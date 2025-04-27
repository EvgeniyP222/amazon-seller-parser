const express = require('express');
const puppeteer = require('puppeteer-core');
const app = express();
const PORT = process.env.PORT || 3000;

app.get('/', async (req, res) => {
  res.send('Amazon Seller Parser is running!');
});

app.get('/parse', async (req, res) => {
  const { url } = req.query;
  if (!url) return res.status(400).send('No URL provided');

  try {
    const browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    const page = await browser.newPage();
    await page.goto(url, { waitUntil: 'networkidle2', timeout: 60000 });

    const aboutSeller = await page.evaluate(() => {
      const aboutBlock = document.querySelector('#seller-profile-container') || document.querySelector('div[data-asin]');
      return aboutBlock ? aboutBlock.innerText : null;
    });

    await browser.close();

    if (aboutSeller) {
      res.json({ aboutSeller });
    } else {
      res.json({ aboutSeller: 'Not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).send('Error parsing page');
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
