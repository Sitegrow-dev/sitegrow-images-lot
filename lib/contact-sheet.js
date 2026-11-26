// Screenshot of contact-sheet.html (full page) into contact-sheet.jpg.
const path = require('path');
const { openPage } = require('./browser');

const dir = path.resolve(process.argv[2]);
(async () => {
  const { page, close } = await openPage({ headless: true });
  try {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto('file://' + path.join(dir, 'contact-sheet.html'), { waitUntil: 'load' });
    await page.screenshot({ path: path.join(dir, 'contact-sheet.jpg'), quality: 75, fullPage: true });
  } finally {
    await close();
  }
  process.exit(0);
})();
