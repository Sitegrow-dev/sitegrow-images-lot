// Sends one image through Ralph's tool (https://sitegrow-images.vercel.app/):
// re-encodes the file, removes the "made with AI" label, resizes.
// Env: RALPH_IN, RALPH_OUT, RALPH_SIZE (default blog), RALPH_FORMAT (webp or jpeg).
const fs = require('fs');
const { openPage } = require('./browser');

const { RALPH_IN: input, RALPH_OUT: output, RALPH_SIZE: size = 'blog', RALPH_FORMAT: format = 'webp' } = process.env;

(async () => {
  let code = 1;
  const { page, close } = await openPage();
  try {
    await page.goto('https://sitegrow-images.vercel.app/', { waitUntil: 'networkidle' });
    if (!(await page.locator('input[type=file]').count())) {
      throw new Error('tool page not available (team password needed? run once with HEADED=1): ' + page.url());
    }
    await page.locator('input[type=file]').setInputFiles(input);
    // The radio button is visually hidden: click its label.
    await page.locator(`label:has(input[name=size][value="${size}"])`).click();
    await page.getByRole('button', { name: format === 'jpeg' ? 'JPEG' : 'WebP', exact: true }).click();
    await page.getByRole('button', { name: /Préparer l’image|Prepare the image|Prepare image/ }).click();
    // The download link is hidden at desktop width: read its blob directly.
    await page.locator('a[download]').first().waitFor({ state: 'attached', timeout: 90000 });
    const b64 = await page.evaluate(async () => {
      const r = await fetch(document.querySelector('a[download]').href);
      const b = new Uint8Array(await r.arrayBuffer());
      let s = '';
      for (let i = 0; i < b.length; i += 0x8000) s += String.fromCharCode(...b.subarray(i, i + 0x8000));
      return btoa(s);
    });
    fs.writeFileSync(output, Buffer.from(b64, 'base64'));
    console.log('image ready');
    code = 0;
  } catch (e) {
    console.error("Ralph's tool error:", e.message);
  } finally {
    await close();
  }
  process.exit(code);
})();
