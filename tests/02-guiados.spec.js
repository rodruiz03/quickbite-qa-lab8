const { test, expect } = require('@playwright/test');
test('R01 - Rechaza credenciales incorrectas', async ({ page }) => {
  await page.goto('/');
  await page.locator('#user').fill('usuario_falso');
  await page.locator('#password').fill('clave_incorrecta');
  await page.locator('#login').click();
  await expect(page.locator('#login-result')).toHaveText('Credenciales incorrectas');
  // Además, se verifica que NO se haya concedido acceso.
  await expect(page.locator('#login-result')).not.toHaveText('Bienvenido');
});
test('R02 - Filtra productos por búsqueda', async ({ page }) => {
  await page.goto('/');
  await page.locator('#search').fill('Pizza');
  const productos = page.locator('#products');
  await expect(productos).toContainText('Pizza');
  await expect(productos).not.toContainText('Tacos');
  // Solo debe quedar un botón "Agregar" y debe ser el de Pizza.
  await expect(productos.locator('button.add')).toHaveCount(1);
  await expect(productos.locator('[data-product="Pizza"]')).toBeVisible();
});
test('R03 - Actualiza contador del carrito', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('#cart-count')).toHaveText('0'); // estado inicial
  await page.locator('[data-product="Hamburguesa"]').click();
  await page.locator('[data-product="Pizza"]').click();
  await expect(page.locator('#cart-count')).toHaveText('2');
});
test('R04 - Impide pedido sin productos', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('#cart-count')).toHaveText('0'); // precondición: carrito vacío
  await page.locator('#customer').fill('Ana López');
  await page.locator('#checkout').click();
  await expect(page.locator('#message')).toHaveText('Agregue productos al carrito');
  await expect(page.locator('#message')).not.toContainText('Pedido confirmado');
});
