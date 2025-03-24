function freqWordOccurrences(titles) {
  const wordCount = {};
  const getTitlesContent = titles.join(" ").toLowerCase();
  const indWords = getTitlesContent.split(/\W+/); 

  indWords.forEach((word) => {
    if (word) {
      wordCount[word] = (wordCount[word] || 0) + 1;
    }
  });
  return wordCount;
}

function wordsByFreq(titles) {
  const wordCount = freqWordOccurrences(titles);
  return Object.fromEntries(
    Object.entries(wordCount).filter(([word, count]) => count > 2)
  );
}

module.exports = wordsByFreq;
