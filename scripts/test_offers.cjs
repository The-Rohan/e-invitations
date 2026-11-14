const { chromium } = require(process.env.PLAYWRIGHT_MODULE || 'playwright');
const assert = require('node:assert/strict');
(async()=>{
 const browser=await chromium.launch({executablePath:process.env.CHROMIUM_PATH||'/usr/bin/chromium',args:['--no-sandbox']});
 try {
 const page=await browser.newPage({viewport:{width:1440,height:1000}});
 for(const [id,name,price,inclusion] of [['basic','One celebration','4,999','1 event with'],['premium','The wedding website','7,999','Up to 3 events'],['full','The complete suite','11,999','2 WhatsApp status images']]){
  await page.goto('http://127.0.0.1:3000/templates/gulistan');
  await page.getByRole('radio',{name:new RegExp(name)}).click();
  assert((await page.locator('.at-selected-offer').innerText()).includes(inclusion));
  const href=await page.locator('.at-offer-picker>.at-primary').getAttribute('href');
  const url=new URL(href,'http://127.0.0.1:3000');assert.equal(url.pathname,'/order');assert.equal(url.searchParams.get('template'),'gulistan');assert.equal(url.searchParams.get('tier'),id);
  await page.locator('.at-offer-picker>.at-primary').click();
  await page.locator('#customer-name').waitFor();assert((await page.locator('.order-summary').innerText()).includes(price));
 }
 for(const width of [390,320]){
  await page.setViewportSize({width,height:844});
  for(const route of ['/','/templates','/templates/khat','/order']){
   await page.goto('http://127.0.0.1:3000'+route);assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),route+' overflow at '+width);
  }
 }
 console.log('PASS: all package prices, inclusions, selection-preserving order links, and 320/390px layouts');
 }finally{await browser.close()}
})().catch(e=>{console.error(e);process.exitCode=1});
