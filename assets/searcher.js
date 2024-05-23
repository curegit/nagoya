function contains(article, phrases, caseSensitive = true, normalize = "NFKC") {
  let src = article.text;
  if (!caseSensitive) {
    src = src.toLowerCase();
    phrases = phrases.map(x => x.toLowerCase());
  }
  src = src.normalize(normalize);
  for (let i = 0; i < phrases.length; i++) {
    const p = phrases[i].normalize(normalize);
    const occurrence = src.indexOf(p);
    if (occurrence < 0) {
      return false;
    }
  }
  return true;
}

onmessage = function (e) {
  const phrases = e.data.phrases;
  const caseSensitive = e.data.caseSensitive;
  const arrayBuffer = e.data.articleBuffer;
  const articles = JSON.parse(new TextDecoder().decode(arrayBuffer));
  const resultArticles = [];
  for (let i = e.data.start; i < e.data.end; i++) {
    const article = articles[i];
    if (contains(article, phrases, caseSensitive)) {
      resultArticles.push({
        link: article.link,
        title: article.title,
      });
    }
  }
  postMessage(resultArticles);
};
