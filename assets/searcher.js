function contains(article, phrases) {
  for (let i = 0; i < phrases.length; i++) {
    const occurrence = article.text.indexOf(phrases[i]);
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
