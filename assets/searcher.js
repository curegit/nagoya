function contains(article, phrases, normalize = "NFKC") {
  const src = article.text.normalize(normalize);
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
  const arrayBuffer = e.data.articleBuffer;
  const articles = JSON.parse(new TextDecoder().decode(arrayBuffer));
  const resultArticles = [];
  for (let i = e.data.start; i < e.data.end; i++) {
    const article = articles[i];
    if (contains(article, phrases)) {
      resultArticles.push({
        link: article.link,
        title: article.title,
      });
    }
  }
  postMessage(resultArticles);
};
