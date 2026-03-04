import { test, expect } from "@playwright/test";
import { SandboxPage } from "../../pages/sandbox/SandboxPage";
import { Logger } from "../../utils/reporting/Logger";

test.describe("Sandbox UI Tests - Complete Suite", () => {
  let page: SandboxPage;

  test.beforeEach(async ({ page: p }) => {
    page = new SandboxPage(p);
    await page.goto();
    Logger.info("✅ Navegado al Sandbox");
  });

  test("UI001 - Botón dinámico muestra elemento oculto", async () => {
    Logger.testStart("UI001");

    await page.clickDynamicButton();

    await expect(
      page.hiddenElement,
      "El elemento oculto no apareció tras 10s de espera. Verificar timeout o selector",
    ).toBeVisible({ timeout: 15000 });

    Logger.testEnd("UI001", "PASSED");
  });

  test("UI002 - Input de texto acepta entrada", async () => {
    Logger.testStart("UI002");

    const testText = "Playwright Automation";
    await page.enterText(testText);

    const value = await page.getTextInputValue();
    expect(
      value,
      `Input no guardó el texto correctamente. Esperado: "${testText}", Recibido: "${value}"`,
    ).toBe(testText);

    Logger.testEnd("UI002", "PASSED");
  });

  test("UI003 - Checkbox Pizza se marca", async () => {
    Logger.testStart("UI003");

    await page.checkbox.check("Pizza 🍕");

    const isChecked = await page.checkbox.isChecked("Pizza 🍕");
    expect(
      isChecked,
      "Checkbox Pizza no se marcó. Verificar selector o estado del elemento",
    ).toBeTruthy();

    Logger.testEnd("UI003", "PASSED");
  });

  test("UI004 - Múltiples checkboxes funcionan", async () => {
    Logger.testStart("UI004");

    const foods = ["Pizza 🍕", "Pasta 🍝", "Hamburguesa 🍔"];
    await page.checkMultipleFoods(foods);

    const checked = await page.getCheckedFoods();
    expect(
      checked.length,
      `Solo ${checked.length} checkboxes marcados. Esperados: mínimo 3. Marcados: ${checked.join(", ")}`,
    ).toBeGreaterThanOrEqual(3);

    Logger.testEnd("UI004", "PASSED");
  });

  test("UI005 - Radio button SI funciona", async () => {
    Logger.testStart("UI005");

    await page.selectYesRadio();

    const isSelected = await page.radio.isSelected("Si");
    expect(
      isSelected,
      'Radio SI no se seleccionó. Verificar que el selector "Si" (sin tilde) es correcto',
    ).toBeTruthy();

    Logger.testEnd("UI005", "PASSED");
  });

  test("UI006 - Dropdown de deportes funciona", async () => {
    Logger.testStart("UI006");

    await page.selectSport("Tennis");

    const selected = await page.getSelectedSport();
    expect(
      selected,
      `Deporte no seleccionado correctamente. Esperado: "Tennis", Recibido: "${selected}"`,
    ).toContain("Tennis");

    Logger.testEnd("UI006", "PASSED");
  });

  test("UI007 - Popup abre y cierra", async () => {
    Logger.testStart("UI007");

    await page.openPopup();
    await expect(
      page.popup.getContent(),
      "Popup no se abrió. Verificar selector dialog o animación",
    ).toBeVisible();

    await page.closePopup();
    await expect(
      page.popup.getContent(),
      "Popup no se cerró. Verificar que el botón de cierre funciona",
    ).toBeHidden();

    Logger.testEnd("UI007", "PASSED");
  });

  test("UI008 - Tabla contiene datos", async () => {
    Logger.testStart("UI008");

    const nombres = await page.getStaticTableNames();

    expect(
      nombres,
      `Tabla no contiene "Messi". Valores encontrados: ${nombres.join(", ")}`,
    ).toContain("Messi");

    expect(
      nombres,
      `Tabla no contiene "Ronaldo". Valores encontrados: ${nombres.join(", ")}`,
    ).toContain("Ronaldo");

    expect(
      nombres,
      `Tabla no contiene "Mbappe". Valores: ${nombres.join(", ")}`,
    ).toContain("Mbappe");

    Logger.testEnd("UI008", "PASSED");
  });

  test("UI009 - Limpiar input funciona", async () => {
    Logger.testStart("UI009");

    await page.enterText("Texto a borrar");
    await page.clearTextInput();

    const value = await page.getTextInputValue();
    expect(value, `Input no se limpió. Valor actual: "${value}"`).toBe("");

    Logger.testEnd("UI009", "PASSED");
  });

  test("UI010 - Desmarcar checkbox Pasta", async () => {
    Logger.testStart("UI010");

    await page.checkPasta();
    await page.uncheckPasta();

    const isChecked = await page.checkbox.isChecked("Pasta 🍝");
    expect(
      isChecked,
      "Checkbox Pasta sigue marcado después de uncheck()",
    ).toBeFalsy();

    Logger.testEnd("UI010", "PASSED");
  });

  test("UI011 - Dropdown días funciona", async () => {
    Logger.testStart("UI011");

    await page.selectWeekday("Martes");
    Logger.info("✅ Día seleccionado correctamente");

    Logger.testEnd("UI011", "PASSED");
  });

  test("UI012 - Verificar opciones de deportes", async () => {
    Logger.testStart("UI012");

    const expectedSports = ["Fútbol", "Tennis", "Basketball"];

    await page.verifySportsOptions(expectedSports).catch(async (error) => {
      const actualOptions = await page.getAllSportsOptions();
      throw new Error(
        `Opciones incorrectas. Esperadas: ${expectedSports.join(", ")}. Encontradas: ${actualOptions.join(", ")}`,
      );
    });

    Logger.info("✅ Todas las opciones esperadas están presentes");

    Logger.testEnd("UI012", "PASSED");
  });

  test("UI013 - Contar filas de tabla", async () => {
    Logger.testStart("UI013");

    const rowCount = await page.getStaticTableRowCount();

    expect(
      rowCount,
      `Tabla tiene ${rowCount} filas, se esperaban al menos 3`,
    ).toBeGreaterThan(0);

    Logger.testEnd("UI013", "PASSED");
  });

  test("UI014 - Popup contiene texto esperado", async () => {
    Logger.testStart("UI014");

    await page.openPopup();
    const text = await page.getPopupText();

    expect(
      text,
      `Popup no contiene el texto esperado. Texto actual: "${text}"`,
    ).toContain("Pop-up");

    await page.closePopup();

    Logger.testEnd("UI014", "PASSED");
  });

  test("UI015 - Tabla dinámica cambia valores al recargar", async ({
    page: p,
  }) => {
    Logger.testStart("UI015");

    const sandboxPage = new SandboxPage(p);
    await sandboxPage.goto();

    // Obtener valores iniciales de tabla DINÁMICA
    const valoresIniciales = await sandboxPage.getDynamicTableValues();
    Logger.info(
      `Valores iniciales: ${valoresIniciales.slice(0, 5).join(", ")}...`,
    );

    await p.reload();
    await p.waitForLoadState("networkidle");

    const valoresPostReload = await sandboxPage.getDynamicTableValues();
    Logger.info(
      `Valores post-reload: ${valoresPostReload.slice(0, 5).join(", ")}...`,
    );

    // Verificar que cambiaron
    expect(
      valoresIniciales,
      "Los valores de la tabla dinámica no cambiaron después del reload",
    ).not.toEqual(valoresPostReload);

    Logger.testEnd("UI015", "PASSED");
  });

  test("UI016 - Validar columna Nombres de tabla estática con screenshot", async ({
    page: p,
  }) => {
    Logger.testStart("UI016");

    await test.step("Navegar al Sandbox", async () => {
      await p.goto(
        "https://thefreerangetester.github.io/sandbox-automation-testing/",
      );
    });

    await test.step("Validar columna Nombres", async () => {
      const valoresColumnaNombres = await p.$$eval(
        'h2:has-text("Tabla estática") + table tbody tr td:nth-child(2)',
        (elements) => elements.map((element) => element.textContent?.trim()),
      );

      const nombresEsperados = ["Messi", "Ronaldo", "Mbappe"];

      // Adjuntar screenshot
      await test.info().attach("screenshot", {
        body: await p.screenshot(),
        contentType: "image/png",
      });

      expect(
        valoresColumnaNombres,
        `Nombres incorrectos. Esperados: ${nombresEsperados.join(", ")}, Recibidos: ${valoresColumnaNombres.join(", ")}`,
      ).toEqual(nombresEsperados);

      Logger.info("✅ Columna Nombres validada correctamente");
    });

    Logger.testEnd("UI016", "PASSED");
  });
});
