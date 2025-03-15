import { test, expect, request } from '@playwright/test';

test.beforeEach(async ({ page }) => {
    await page.goto('https://conduit.bondaracademy.com/', {waitUntil: 'networkidle'})
 });


test('End to End Processus : Login > Create Article > Delete', async ({ page, request }) => {
    //LOGIN TO ACCOUNT
    const response = await request.post('https://conduit-api.bondaracademy.com/api/users/login', {
        data: {
            "user": {
                "email": "testApiplaywright",
                "password": "test"
            }
        }
    })
    const responseBody = await response.json();
    const accessToken = responseBody.user.token //Récupérer le token de connexion
    console.log(responseBody);

    //CREATE ARTICLE 
    const articleReponse = await request.post('https://conduit-api.bondaracademy.com/api/articles/', {
        data : {
            "article":{"title":"Playwright","description":"Tests description playwright","body":"Test","tagList":[]}
        },
        headers: {
            Authorization: `Token ${accessToken}`
        }
    })
    expect(articleReponse.status()).toBe(201)
    const articleResponseBody = await articleReponse.json()
    console.log(articleResponseBody)
    const slugData = articleResponseBody.article.slug

    //DELETE ARTICLE 
    const deleteResponse = await request.delete(`https://conduit-api.bondaracademy.com/api/articles/${slugData}`, {
        headers: {
            Authorization: `Token ${accessToken}`
        }
    })

    expect(deleteResponse.status()).toBe(204)
});
