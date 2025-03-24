const getElPaisOpinion = require("./getArticles.js");
const finalTitles = require("./resultTitles.js");
const wordsByFreq = require("./applyFilter.js");

async function main() {
  const originalTitles = await getElPaisOpinion(); 
  const translatedTitles = await finalTitles(originalTitles);
  console.log("<- Resulting Titles ->");
  translatedTitles.forEach((title, index) => {
    console.log(`${index + 1}. ${title}`);
  });
  const freqGreaterthan2=wordsByFreq(translatedTitles);
  console.log("<- Words with frequency greater than 2 are ->");
  for (const [key, value] of Object.entries(freqGreaterthan2)) {
    console.log(`${key} : ${value}`);
  }
}();
