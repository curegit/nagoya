function contains(article, phrases) {
  for (let i = 0; i < phrases.length; i++) {
    const occurrence = article.text.indexOf(phrases[i]);
    if (occurrence === -1) {
      return false;
    }
  }
  return true;
}

onmessage = function (e) {
  const phrases = e.data.phrases;
  const arrayBuffer = e.data.articleBuffer;
  const articles = JSON.parse(new TextDecoder().decode(arrayBuffer));
  const result = [];
  for (let i = 0; i < articles.length; i++) {
    const article = articles[i];
    if (contains(article, phrases)) {
      result.push({
        link: article.link,
        title: article.title,
      });
    }
  }
  postMessage(result);
};
