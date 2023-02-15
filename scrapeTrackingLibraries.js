const puppeteer = require('puppeteer');

const scrapeUrl = 'https://www.uniqlo.com/tw/zh_TW/';

async function scrapeTrackingLibraries(url) {
    const browser = await puppeteer.launch({
        headless: true,
        args: [
          '--no-sandbox',
          '--disable-setuid-sandbox',
          '--disable-dev-shm-usage',
          '--disable-accelerated-2d-canvas',
          '--disable-gpu',
          '--user-agent="Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/86.0.4240.111 Safari/537.3"'
        ]
    });
    const page = await browser.newPage();

    const navigationPromise = page.waitForNavigation({
        waitUntil: 'networkidle0'
    });
    await page.goto(url);

    await Promise.race([
        page.waitForNavigation('load'),
        new Promise((resolve) => setTimeout(resolve, 5000))
    ]);

    const scripts = await page.evaluate(() => {
        const scriptElements = Array.from(document.querySelectorAll('script'));
        return scriptElements.map((script) => script.src);
    });
  
    const hosts = [];
    scripts.forEach((src) => {
      if (!src) return;
      const url = src.startsWith('http') ? src : `https:${src}`;
      try {
        const host = new URL(url).hostname;
        // hosts.push(url);

        if (!hosts.includes(host)) {
          hosts.push(host);
        }
      } catch (error) {
        console.error(error);
      }
    });
  
    await navigationPromise;
    await browser.close();
  
    return hosts
  }

(async () => {
  const url = scrapeUrl;
  const scriptSources = await scrapeTrackingLibraries(url);
  console.log(scriptSources);
  console.log(scriptSources.length);
})();
