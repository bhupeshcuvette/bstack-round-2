const { Builder, By, until } = require("selenium-webdriver");
const axios = require("axios");
const fs = require("fs");

async function getElPaisOpinion() {
  let articlesFound=-1
  let finalSettings = {}; 
  const articleTitles = []; 
  let checkStatus = false;
  let driver = await new Builder().forBrowser("chrome").build();

  try {
    await driver.get("https://elpais.com/opinion");
    await driver.wait(until.elementsLocated(By.css("article")), 10000);

    if (!checkStatus) {
      try {
        const finBtn = await driver.findElement(
          By.id("didomi-notice-agree-button")
        );
        await driver.wait(until.elementIsVisible(finBtn), 10000);
        await finBtn.click();
        checkStatus = true;
      } catch (error) {
        console.warn(
          "BTN not clickable or is not found ->",
          error.message
        );
      }
    }

    const articleAnchorElements = await driver.findElements(By.css("article h2 a"));
    const articleLinks = await Promise.all(
      articleAnchorElements.map(async (link) => await link.getAttribute("href"))
    );
    let articlesRead = articlesFound + 1;
    for (const link of articleLinks) {
      if (articlesRead >= 5) break;
      try {
        await driver.get(link);
        if (!checkStatus){
          try {
            const finBtn = await driver.findElement(By.id("didomi-notice-agree-button")
            );
            await driver.wait(until.elementIsVisible(finBtn), 10000);
            await finBtn.click();
            checkStatus  = true;
          } catch (error) {
            console.warn(
              "BTN not clickable or is not found ->",error.message
            );
          }
        }
        await driver.wait(until.elementsLocated(By.css("article")), 10000);

        const titleElement = await driver.findElement(By.css("article h1.a_t"));
        const title = await titleElement.getText();

        articleTitles.push(title);
        await driver.wait(
          until.elementLocated(By.css('[data-dtm-region="articulo_cuerpo"]')),
          10000
        );
        const contentElement = await driver.wait(
          until.elementIsVisible(
            driver.findElement(By.css('[data-dtm-region="articulo_cuerpo"]'))
          ),
          10000
        );
        const content = await contentElement.getText();
        console.log("Untranslated Articles -->");
        console.log("Title of Article:", title);
        console.log("Content of Article:", content);
        console.log("End of content");

        try { //download the cover image
          const coverImageElement = await driver.findElement(
            By.css("article img._re.a_m-h")
          );
          const coverImageUrl = await coverImageElement.getAttribute("src");
          const imageResponse = await axios.get(coverImageUrl, {
            responseType: "stream",
          });
          const imageLocation = `./assets/${title
            .replace(/[<>:"\/\\|?*]/g, "")
            .replace(/\s+/g, "-")}.jpg`;
          const writer = fs.createWriteStream(imageLocation);
          imageResponse.data.pipe(writer);
          console.log(`All saved-> File location - ${imageLocation}`);
        } catch (err) {
          console.log("NaN image");
        }
        articlesRead++;
      } catch (error) {
        console.log("not availability of articles");
      }
    }
    finalSettings = {
      action: "setSessionStatus",
      arguments: {
        status: "passed",
        reason: "Success",
      },
    };
  } catch (error) {
    finalSettings  = {
      action: "setSessionStatus",
      arguments: {
        status: "failed",
        reason: `${error}`,
      },
    };
    console.error("Error", error);
  } finally {
    try {
      await driver.executeScript(
        "browserstack_executor: " + JSON.stringify(finalSettings),
        []
      );
    } catch (error) {
      console.log("Browserstack Error");
    }
    await driver.quit();
  }
  return articleTitles;
}
module.exports = getElPaisOpinion;
