const { test, expect } = require('@playwright/test');
// R05: regla de negocio -> no se debe confirmar un pedido si falta el nombre de entrega.
// Esta prueba DEBE FALLAR: revela el defecto intencional de QuickBite.
// No se debilita la aserción ni se modifica la aplicación.
test('R05 - No permite confirmar sin nombre de entrega', async ({ page }) => {
  await page.goto('/');
 
  // Precondición: carrito con al menos un producto.
  await page.locator('[data-product="Hamburguesa"]').click();
  await expect(page.locator('#cart-count')).toHaveText('1');
 
  // Nombre de entrega vacío.
  await page.locator('#customer').fill('');
  await expect(page.locator('#customer')).toHaveValue('');
 
  // Intento de confirmar.
  await page.locator('#checkout').click();
 
  // Resultado esperado: el pedido NO se confirma.
  await expect(page.locator('#message')).not.toContainText('Pedido confirmado');
});
test('R06 - Búsqueda sin coincidencias', async ({ page }) => {
  await page.goto('/');
  // Control: antes de buscar sí hay productos (evita un "verde" falso).
  await expect(page.locator('#products button.add')).toHaveCount(4);
 
  await page.locator('#search').fill('Sushi');
  await expect(page.locator('#products button.add')).toHaveCount(0);
  await expect(page.locator('#products')).toBeEmpty();
});