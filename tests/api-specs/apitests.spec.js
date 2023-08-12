import { test, expect } from '@playwright/test';

test.describe('Reqres APIs Test', () => {

    const baseUrl = "https://reqres.in/api";

    test('GET Users', async ({ request }) => {
        const response = await request.get(`${baseUrl}/users/3`);
        expect(response.status()).toBe(200);
    })

    test('GET Users (negative scenario)', async ({ request }) => {
        const response = await request.get(`${baseUrl}/users/5`);
        expect(response.status()).toBe(200);
    })
})