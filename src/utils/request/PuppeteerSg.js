import puppeteer from 'puppeteer'
import fs from 'fs'

class PuppeteerSg {
  constructor() {
    if (!PuppeteerSg.instance) {
      PuppeteerSg.instance = this;
      process.on('exit', () => {
        this.close();
      });
    }
    return PuppeteerSg.instance;
  }

  /**
   * Launch a browser
   */
  async launch() {
    // Detect if running in CI, Docker, or production environment
    const isCI = process.env.CI === 'true';
    const isDocker = process.env.DOCKER === 'true' || fs.existsSync('/.dockerenv');
    const isProduction = process.env.NODE_ENV === 'production';
    
    // Always use sandbox flags in Docker/production/CI environments
    const args = [];
    if (isCI || isDocker || isProduction) {
      args.push(
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-accelerated-2d-canvas',
        '--no-first-run',
        '--no-zygote',
        '--disable-gpu'
      );
    }
    
    this.browser = await puppeteer.launch({
      headless: "new",
      defaultViewport: null,
      args,
      timeout: 0,
    });
  }

  /**
   * New a page
   * @param {string} url 
   * @returns 
   */
  async getPage(url) {
    if (!this.browser) {
      await this.launch()
    }
    let page = await this.browser.newPage()
    await page.goto(url, {
      waitUntil: "load",
    })
    return page
  }

  /**
   * Close the browser
   */
  async close() {
    if (this.browser) {
      await this.browser.close();
      this.browser = null;
    }
  }
}

export const puppeteerSg = new PuppeteerSg()
