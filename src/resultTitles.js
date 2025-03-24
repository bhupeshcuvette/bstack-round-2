const axios = require("axios");
async function finalTitles(titles) {
  const finalResultitles = [];
  const options = {
    method: "POST",
    url: "https://google-translate113.p.rapidapi.com/api/v1/translator/text",
    headers: {
      "x-rapidapi-key": "ENTER YOUR KEY", 
      "x-rapidapi-host": "google-translate113.p.rapidapi.com",
      "Content-Type": "application/json",
    },
  };
  try {
    for (const title of titles) {
      const response = await axios.request({
        ...options,
        data: {
          from: "es",
          to: "en",
          text: title,
        },
      });
  finalResultitles.push(response.data.trans);
    }
  } catch (error) {
    console.error(error); 
  }
  return finalResultitles;
}
module.exports = finalTitles;
