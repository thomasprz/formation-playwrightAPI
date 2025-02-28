import { test, expect } from '@playwright/test';

test.beforeEach(async ({ page }) => {
    await page.route('https://conduit-api.bondaracademy.com/api/tags', async route => {
        const tags = {
            "tags": [
                "automation",
                "playwright",
            ]
        };
        await route.fulfill({
            body: JSON.stringify(tags)
        });
    });

    await page.route('*/**/api/articles*', async route => { //https://conduit-api.bondaracademy.com/api/articles?limit=10&offset=0'
        const response = await route.fetch()
        const responseBody = await response.json()
        console.log(responseBody)
        responseBody.articles[0].title = "This is a test title"
        responseBody.articles[0].description = "This is a description"

        await route.fulfill({
            body: JSON.stringify(responseBody)
        });
    });    await page.goto('https://conduit.bondaracademy.com/', {waitUntil: 'networkidle'})
});

test('Expect Has Title', async ({ page }) => {
    await expect(page.locator('.navbar-brand')).toHaveText('conduit');
    await expect(page.locator('app-article-list h1').first()).toContainText("This is a test title")
    await expect(page.locator('app-article-list p').first()).toContainText("This is a description")
});