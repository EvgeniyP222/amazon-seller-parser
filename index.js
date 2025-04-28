const express = require('express');
const { chromium } = require('playwright-chromium'); // Используем puppeteer-core
const app = express();
const PORT = process.env.PORT || 3000;

app.get('/', (req, res) => {
  res.send('Amazon Seller Parser is running!');
});

// Новый роут для парсинга
app.get('/parse', async (req, res) => {
  let browser;
  try {
    const browser = await chromium.launch({ ... });
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
