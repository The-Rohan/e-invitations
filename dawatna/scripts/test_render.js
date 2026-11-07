const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({ 
    headless: 'new', 
    args: ['--no-sandbox', '--disable-setuid-sandbox'] 
  });
  const page = await browser.newPage();
  await page.setViewport({ width: 390, height: 844, isMobile: true, hasTouch: true });
  
  page.on('console', msg => console.log('PAGE LOG:', msg.text()));
  page.on('pageerror', err => console.log('PAGE ERROR:', err.message));
  
  await page.goto('http://localhost:3000/templates/bazm-e-shahi.html', { waitUntil: 'networkidle2' });
  await page.screenshot({ path: '/Users/rohanalvi/Downloads/E-INVITATIONS/bazm-test-1.png' });
  console.log('Saved bazm-test-1.png');
  
  // Find gate
  const gate = await page.$('#bsGate');
  if (gate) {
    console.log('Found #bsGate, tapping...');
    await gate.tap();
    await new Promise(r => setTimeout(r, 2500));
    await page.screenshot({ path: '/Users/rohanalvi/Downloads/E-INVITATIONS/bazm-test-2.png' });
    console.log('Saved bazm-test-2.png');
    
    await new Promise(r => setTimeout(r, 2000));
    await page.screenshot({ path: '/Users/rohanalvi/Downloads/E-INVITATIONS/bazm-test-3.png' });
    console.log('Saved bazm-test-3.png');
  } else {
    console.log('#bsGate not found!');
  }
  
  await browser.close();
})();
