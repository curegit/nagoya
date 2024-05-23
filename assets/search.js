{{ $data := resources.Get "search.json" | resources.ExecuteAsTemplate "data.json" . | minify | fingerprint }}
{{ $searcher := resources.Get "searcher.js" | minify | fingerprint }}
(function () {
  const searcher = "{{ $searcher.RelPermalink }}";
  const data = "{{ $data.RelPermalink }}";
  const articleCount = {{ len . }};
  const maxConcurrency = {{ site.Params.maxConcurrency }};

  const prefConcurrency = Math.max(1, Math.min(maxConcurrency, Math.ceil(articleCount / 8)));
  const timeoutSec = 10;

  const htmlSpecialCharsTable = {
    "&": "&amp;",
    "'": "&apos;",
    "\"": "&quot;",
    "<": "&lt;",
    ">": "&gt;",
  };

  function htmlSpecialChars(text) {
    return text.replace(/[&'"<>]/g, (match) => htmlSpecialCharsTable[match]);
  }

  function htmlTemplate(strings, ...values) {
    let html = strings[0];
    values.forEach((val, i) => {
      html += htmlSpecialChars("" + val) + strings[i + 1];
    });
    return html;
  }

  const searchForm = document.getElementById("search-form");
  const queryInput = document.getElementById("query");
  const caseInput = document.getElementById("case");

  const contentLoadedPromise = new Promise((resolve) => {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", () => resolve());
    } else {
      resolve();
    }
  });
  const resultElementPromise = contentLoadedPromise.then(() =>
    document.getElementById("search-result")
  );

  const fetchPromise = fetch(data);
  const timeoutPromise = new Promise((_, reject) => setTimeout(reject, timeoutSec * 1000));
  const dataPromise = Promise.race([
    fetchPromise,
    timeoutPromise,
  ]).then((response) => {
    if (response.ok) {
      return response.arrayBuffer();
    } else {
      throw new Error(response.statusText);
    }
  }).catch((error) => {
    searchForm.outerHTML = htmlTemplate`
      <p class="error">${"検索用データファイルをダウンロードできません。"}</p>
    `;
    throw error;
  });

  function getQuery(reflectOnForm = true) {
    const params = new URL(window.location).searchParams;
    const query = params.getAll("q").join(" ");
    const cases = !!+(params.get("c") ?? 0);
    if (reflectOnForm) {
      queryInput.value = query;
      caseInput.checked = cases;
    }
    return [query, cases];
  }

  // サロゲートペアの範囲の文字は追加しないでください
  const whiteSpaces = ["\t", "\n", "\u000b", "\f", "\r", " ", "", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", "　"];

  function parse(query) {
    const phrases = [];
    let buffer = "";
    let quoted = false;
    for (let i = 0; i < query.length; i++) {
      const chara = query[i];
      if (whiteSpaces.includes(chara)) {
        if (quoted) {
          buffer += chara;
        } else if (buffer) {
          phrases.push(buffer);
          buffer = "";
        }
      } else if (chara === "\"") {
        if (query[i + 1] === "\"") {
          buffer += "\"";
          i++;
        } else {
          quoted = !quoted;
          if (buffer) {
            phrases.push(buffer);
            buffer = "";
          }
        }
      } else {
        buffer += chara;
      }
    }
    if (buffer) {
      phrases.push(buffer);
    }
    return phrases;
  }

  function range(n) {
    return [...Array(n).keys()];
  }

  function divideRangesFairly(len, n) {
    const size = Math.floor(len / n);
    const extra = len % n;
    const ranges = [];
    let start = 0;
    for (let i = 0; i < n; i++) {
      const end = start + size + (i < extra ? 1 : 0);
      ranges.push({start, end});
      start = end;
    }
    return ranges;
  }

  let cancelFetch = null;
  let workers = [];
  let cancelSearchFs = [];

  async function search(phrases, caseSensitive) {
    workers.forEach((w) => w.terminate());
    if (cancelFetch !== null) {
      cancelFetch();
    }
    cancelSearchFs.forEach((f) => f());
    cancelSearchFs = [];
    const concurrency = Math.min(navigator.hardwareConcurrency ?? 1, prefConcurrency);
    workers = range(concurrency).map(() => new Worker(searcher));
    const maybeBuffer = await Promise.race([
      dataPromise.catch(() => false),
      new Promise((resolve) => {
        cancelFetch = () => resolve(false);
      })
    ]);
    if (maybeBuffer === false) {
      return false;
    }
    const searchPromises = [];
    for (let i = 0; i < workers.length; i++) {
      const search = new Promise((resolve) => {
        workers[i].onmessage = (e) => {
          resolve(e.data);
        };
        cancelSearchFs.push(() => {
          resolve(false);
        });
      });
      searchPromises.push(search);
    }
    const searchPromise = Promise.all(searchPromises).then((xs) => {
      if (xs.includes(false)) {
        return false;
      } else {
        return xs.flat();
      }
    });
    const ranges = divideRangesFairly(articleCount, workers.length);
    for (let i = 0; i < workers.length; i++) {
      const arrayBufferCopy = maybeBuffer.slice(0);
      const message = {
        phrases: phrases,
        caseSensitive: caseSensitive,
        start: ranges[i].start,
        end: ranges[i].end,
        articleBuffer: arrayBufferCopy,
      };
      workers[i].postMessage(message, [arrayBufferCopy]);
    }
    return await searchPromise;
  }

  let prevQuery = "";
  let prevCases = undefined;

  async function main() {
    if (window.Worker) {
      const [query, cases] = getQuery();
      const phrases = parse(query);
      if (prevQuery === query && cases === prevCases) {
        return;
      } else if (phrases.length > 0) {
        const result = await search(phrases, cases);
        if (result !== false) {
          const element = await resultElementPromise;
          let html = `<h2>${
            phrases.map(x => htmlTemplate`<code>${cases ? x : x.toLowerCase()}</code>`).join("")
          }</h2>`;
          if (result.length > 0) {
            html += htmlTemplate`
              <p class="info">${"を含む記事が"} ${result.length} ${"件見つかりました。"}</p>
            `;
            html += `<ul>${
              result.map(article => htmlTemplate`
                <li><a href="${article.link}">${article.title}</a></li>
              `).join("")
            }</ul>`;
          } else {
            html += htmlTemplate`
              <p class="info">${"を含む記事は見つかりませんでした。"}</p>
            `;
          }
          element.innerHTML = html;
          prevQuery = query;
          prevCases = cases;
        }
      } else {
        const element = await resultElementPromise;
        element.innerHTML = "";
        prevQuery = query;
        prevCases = cases;
      }
    } else {
      const element = await resultElementPromise;
      element.innerHTML = htmlTemplate`
        <p class="warning">${"Web Worker を有効にしてください。"}</p>
      `;
    }
  }

  searchForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const query = queryInput.value;
    const cases = caseInput.checked;
    const params = new URL(window.location).searchParams;
    if (query) {
      params.set("q", query);
    } else {
      params.delete("q");
    }
    if (cases) {
      params.set("c", "1");
    } else {
      params.delete("c");
    }
    const paramStr = params.toString();
    history.pushState({}, "", paramStr ? "?" + paramStr : ".");
    main();
  });

  window.addEventListener("popstate", (e) => {
    main();
  });

  main();
})();
