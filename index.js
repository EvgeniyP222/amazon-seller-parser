const express = require('express');
const puppeteer = require('puppeteer-core'); // Используем puppeteer-core
const app = express();
const PORT = process.env.PORT || 3000;

app.get('/', (req, res) => {
  res.send('Amazon Seller Parser is running!');
});

// Новый роут для парсинга
app.get('/parse', async (req, res) => {
  let browser;
  try {
    browser = await puppeteer.launch({
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
      headless: true,
      executablePath: process.env.PUPPETEER_EXECUTABLE_PATH || '/usr/bin/chromium-browser'
    });

    const page = await browser.newPage();
    await page.goto('https://www.amazon.com/sp?seller=A1PA6795UKMFR9'); // Пример страницы продавца

    const title = await page.title();

    await browser.close();

    res.send(`Страница загружена! Title: ${title}`);
  } catch (error) {
    if (browser) {
      await browser.close();
    }
    console.error(error);
    res.status(500).send('Ошибка при парсинге.');
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
app.get('/parse', async (req, res) => {
  try {
    const browser = await puppeteer.launch({
      args: ['--no-sandbox'],
      headless: true
    });
    const page = await browser.newPage();
    
    await page.goto('https://www.amazon.com/sp?seller=A2L77EE7U53NWQ', { waitUntil: 'domcontentloaded' });
    
    const aboutSeller = await page.$eval('#seller-profile-container', el => el.innerText);

    await browser.close();

    res.send(`About Seller Section:\n\n${aboutSeller}`);
  } catch (error) {
    console.error(error);
    res.status(500).send('Ошибка при парсинге страницы.');
  }
});
