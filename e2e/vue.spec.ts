import { test, expect } from '@playwright/test'

// See here how to get started:
// https://playwright.dev/docs/intro
test('visits the app root url', async ({ page }) => {
  await page.goto('/')
  await expect(page.locator('header')).toHaveText(
    /我在做一个 todo 相关的应用，计划使用以下六款前端 UI 框架分别搭建一次：/,
  )
})
