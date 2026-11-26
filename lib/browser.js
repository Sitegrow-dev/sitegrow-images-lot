// Opens a browser page for the scripts of this repo.
// - On Sitegrow's dev server: reuses the shared co-browser (/opt/cobrowser), already logged in.
// - Anywhere else: Playwright Chromium with a persistent profile (~/.sitegrow-images-lot/profile),
//   so the team password of Ralph's tool is typed only once (run with HEADED=1 the first time).
const fs = require('fs');
const os = require('os');
const path = require('path');

const COBROWSER = '/opt/cobrowser/lib/connect.js';

async function openPage({ headless } = {}) {
  if (fs.existsSync(COBROWSER) && !process.env.NO_COBROWSER) {
    const { connect } = require(COBROWSER);
    if (headless) {
      const { browser } = await connect({ headless: true });
      const ctx = await browser.newContext();
      const page = await ctx.newPage();
      return { page, close: async () => ctx.close() };
    }
    const { context } = await connect();
    const page = await context.newPage();
    // Never close the shared Chrome itself: only our tab.
    return { page, close: async () => page.close() };
  }
  const { chromium } = require('playwright');
  const dir = path.join(os.homedir(), '.sitegrow-images-lot', 'profile');
  fs.mkdirSync(dir, { recursive: true });
  const ctx = await chromium.launchPersistentContext(dir, {
    headless: headless ?? process.env.HEADED !== '1',
    viewport: { width: 1440, height: 900 },
  });
  const page = await ctx.newPage();
  return { page, close: async () => ctx.close() };
}

module.exports = { openPage };
