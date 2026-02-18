import { chromium, expect, test } from '@playwright/test'

test('two players can start a game', async () => {
  const browser = await chromium.launch()
  const contextA = await browser.newContext()
  const contextB = await browser.newContext()

  const pageA = await contextA.newPage()
  const pageB = await contextB.newPage()

  const homepage = 'http://localhost:3000/'
  await pageA.goto(homepage)
  await pageB.goto(homepage)

  const startGameButtonA = pageA.getByRole('button', { name: 'Start Game' })
  const startGameButtonB = pageB.getByRole('button', { name: 'Start Game' })

  await expect(startGameButtonA).toBeVisible()
  await expect(startGameButtonB).toBeVisible()

  await startGameButtonA.click()
  await startGameButtonB.click()

  const boardA = pageA.getByTestId('board')
  const boardB = pageB.getByTestId('board')

  await Promise.all([
    expect(boardA).toBeVisible({ timeout: 15000 }),
    expect(boardB).toBeVisible({ timeout: 15000 }),
  ])
})
