const puppeteer = require('puppeteer');
const dotenv = require('dotenv');
dotenv.config();

async function login(page, id, pw, code, checkEnter) {
  await page.goto('https://login.ecounterp.com/ECERP');
  await page.type('#com_code', code)
  await page.type('#id', id)
  await page.type('#passwd', pw)
  await page.click('#save')

  if (checkEnter) {
    await page.click('#logintimeinck');
  }

  await Promise.all([
    page.waitForNavigation(),
    page.waitForTimeout(2000),
  ]);

  const btn = await page.$$('#ecdivpop button');
  await btn[1].click();
  await Promise.all([
    page.waitForNavigation(),
    page.waitForTimeout(2000),
  ]);
  await page.screenshot({ path: 'login.png' });
}

async function logout(page) {
  const logoutMenu = await page.$('#ecLogout');
  const { x, y, width, height } = await logoutMenu.boundingBox();
  await page.mouse.move(x + width / 2, y + height / 2);
  await page.waitForTimeout(1000);
  const exitBtn = await logoutMenu.$('a');
  await exitBtn.click();
  await page.waitForTimeout(2000),
  await page.screenshot({ path: 'logout.png' });
}

async function attendWork(id, pw, code) {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  await login(page, id, pw, code, true);

  await browser.close();
}

async function leaveWork(id, pw, code) {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  await login(page, id, pw, code, false);
  await logout(page);

  await browser.close();
}

(async () => {
  const id = process.env.USERNAME;
  const pw = process.env.PASSWORD;
  const code = process.env.CODE;

  // await attendWork(id, pw, code);
  // await leaveWork(id, pw, code);
})();
