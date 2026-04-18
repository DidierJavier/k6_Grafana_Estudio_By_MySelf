import { browser } from 'k6/browser';
import { check, sleep } from 'k6';
import { htmlReport } from "https://raw.githubusercontent.com/benc-uk/k6-reporter/main/dist/bundle.js";

export const options = {
  scenarios: {
    ui: {
      executor: 'constant-vus',
      vus: 1, // El browser consume mucha RAM, empieza con 1
      duration: '10s',
      options: {
        browser: {
          type: 'chromium',
        },
      },
    },
  },
};

export default async function () {
  const context = await browser.newContext();
  const page = await context.newPage();

  try {
    // 1. Navegamos a la web
    await page.goto('https://test.k6.io/my_messages.php');

    // 2. Interactuamos con la página (Login manual)
    await page.locator('input[name="login"]').type('admin');
    await page.locator('input[name="password"]').type('12345');
    
    // Usamos Promise.all para esperar a que la página cargue tras el click
    await Promise.all([
      page.waitForNavigation(),
      page.locator('input[type="submit"]').click(),
    ]);

    // 3. Verificamos que entramos con más seguridad
    const header = page.locator('h2');
    await header.waitFor({ state: 'visible', timeout: 5000 }); // Esperamos hasta 5s

    const text = await header.textContent();
    
    check(page, {
      'header visible': () => text === 'Welcome, admin!',
    });
    
  } finally {
    await page.close();
  }
}

export function handleSummary(data) {
  return {
    "summary.html": htmlReport(data),
  };
}