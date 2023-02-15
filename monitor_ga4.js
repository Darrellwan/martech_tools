const puppeteer = require('puppeteer');

async function extractGA4Requests() {
    const browser = await puppeteer.launch({headless: false});
    const page = await browser.newPage();
    const url = "your url";
    
    await page.goto(url);
    
    await Promise.race([
        page.waitForNavigation('load'),
        new Promise((resolve) => setTimeout(resolve, 10000))
    ]);
    
    const requests = await page.evaluate(() => {
      return window.performance.getEntriesByType('resource')
        .filter(resource => resource.name.includes("analytics.google.com"))
        .map(resource => resource.name);
    });
    
    console.log(requests);
    
    await browser.close();
}

extractGA4Requests();