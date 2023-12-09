import { expect, test } from '@playwright/test';

test('petstore api test', async ({ request }) => {
  const received = await request.get('/petstore');
  const actual = await received.json();

  expect(received.ok()).toBeTruthy();
  expect(actual).toEqual(expect.objectContaining(expected));
});
