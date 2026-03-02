import { test, expect } from "@playwright/test";
import { SandboxPage } from "../../pages/sandbox/SandboxPage";
import { TestDataGenerator } from "../../utils/data/TestDataGenerator";
import { Logger } from "../../utils/reporting/Logger";

test.describe("Sandbox UI Tests - Complete Suite", () => {
  let sandboxPage: SandboxPage;

  test.beforeEach(async ({ page }) => {
    sandboxPage = new SandboxPage(page);
    await sandboxPage.goto();
    Logger.info("✅ Navegado al Sandbox");
  });

  test("UI001 - Click botón con ID dinámico", async () => {
    Logger.testStart("UI001");

    await test.step("Hacer click en el botón dinámico", async () => {
      await sandboxPage.clickDynamicButton();
    });

    await test.step("Verificar que elemento oculto aparece", async () => {
      await expect(
        sandboxPage.hiddenElement,
        "❌ El elemento oculto NO apareció después de hacer click - Posible timeout o selector incorrecto",
      ).toBeVisible({ timeout: 5000 });
    });

    Logger.testEnd("UI001", "PASSED");
  });

  test("UI002 - Llenar campo de texto y validar valor", async () => {
    Logger.testStart("UI002");

    const textoAleatorio = TestDataGenerator.randomString(20);

    await test.step("Verificar que el campo de texto es editable", async () => {
      await expect(
        sandboxPage.textInput,
        "❌ El campo de texto NO es editable - El input podría estar deshabilitado",
      ).toBeEditable();
    });

    await test.step("Ingresar texto en el campo", async () => {
      await sandboxPage.enterText(textoAleatorio);
    });

    await test.step("Validar que el texto ingresado coincide", async () => {
      const valorIngresado = await sandboxPage.getTextInputValue();
      expect(
        valorIngresado,
        `❌ El texto NO coincide - Esperado: "${textoAleatorio}", Recibido: "${valorIngresado}"`,
      ).toBe(textoAleatorio);
    });

    await test.step("Limpiar el campo de texto", async () => {
      await sandboxPage.clearTextInput();
      const valorDespuesLimpiar = await sandboxPage.getTextInputValue();
      expect(
        valorDespuesLimpiar,
        "❌ El campo NO se limpió correctamente - Aún contiene texto",
      ).toBe("");
    });

    Logger.testEnd("UI002", "PASSED");
  });

  test("UI003 - Marcar y desmarcar checkbox", async () => {
    Logger.testStart("UI003");

    await test.step("Marcar checkbox de Pasta", async () => {
      await sandboxPage.checkPasta();
      const estaCheckeado =
        await sandboxPage.checkboxComponent.isChecked("Pasta 🍝");
      expect(
        estaCheckeado,
        "❌ El checkbox de Pasta NO se marcó - El elemento podría no ser clickeable",
      ).toBeTruthy();
    });

    await test.step("Desmarcar checkbox de Pasta", async () => {
      await sandboxPage.uncheckPasta();
      const estaCheckeado =
        await sandboxPage.checkboxComponent.isChecked("Pasta 🍝");
      expect(
        estaCheckeado,
        "❌ El checkbox de Pasta NO se desmarcó - El elemento no respondió al segundo click",
      ).toBeFalsy();
    });

    Logger.testEnd("UI003", "PASSED");
  });

  test("UI004 - Marcar múltiples checkboxes", async () => {
    Logger.testStart("UI004");

    const comidasAMarcar = ["Pizza 🍕", "Pasta 🍝", "Helado 🍧"];

    await test.step("Marcar múltiples checkboxes", async () => {
      await sandboxPage.checkMultipleFoods(comidasAMarcar);
    });

    await test.step("Verificar que todos los checkboxes están marcados", async () => {
      const comidasMarcadas = await sandboxPage.getCheckedFoods();

      comidasAMarcar.forEach((comida) => {
        expect(
          comidasMarcadas,
          `❌ El checkbox "${comida}" NO está marcado - Falló la selección múltiple`,
        ).toContain(comida);
      });

      expect(
        comidasMarcadas.length,
        `❌ Se esperaban ${comidasAMarcar.length} checkboxes marcados pero se encontraron ${comidasMarcadas.length}`,
      ).toBeGreaterThanOrEqual(comidasAMarcar.length);
    });

    Logger.testEnd("UI004", "PASSED");
  });

  test("UI005 - Seleccionar radio button", async () => {
    Logger.testStart("UI005");

    await test.step('Seleccionar radio button "No"', async () => {
      await sandboxPage.selectNoRadio();
      const estaSeleccionado =
        await sandboxPage.radioComponent.isSelected("No");
      expect(
        estaSeleccionado,
        '❌ El radio button "No" NO se seleccionó - El elemento no es clickeable o no existe',
      ).toBeTruthy();
    });

    await test.step('Cambiar selección a "Si"', async () => {
      await sandboxPage.selectYesRadio();
      const estaSeleccionado =
        await sandboxPage.radioComponent.isSelected("Si");
      expect(
        estaSeleccionado,
        '❌ El radio button "Si" NO se seleccionó - El elemento no existe o está oculto',
      ).toBeTruthy();
    });

    Logger.testEnd("UI005", "PASSED");
  });

  test("UI006 - Seleccionar deporte del dropdown", async () => {
    Logger.testStart("UI006");

    const deporteASeleccionar = "Tennis";

    await test.step(`Seleccionar "${deporteASeleccionar}" del dropdown`, async () => {
      await sandboxPage.selectSport(deporteASeleccionar);
    });

    await test.step("Verificar que la opción seleccionada es correcta", async () => {
      const deporteSeleccionado = await sandboxPage.getSelectedSport();
      expect(
        deporteSeleccionado,
        `❌ El deporte seleccionado NO es correcto - Esperado: "${deporteASeleccionar}", Recibido: "${deporteSeleccionado}"`,
      ).toBe(deporteASeleccionar);
    });

    Logger.testEnd("UI006", "PASSED");
  });

  test("UI007 - Validar opciones del dropdown", async () => {
    Logger.testStart("UI007");

    const opcionesEsperadas = [
      "Seleccioná un deporte",
      "Fútbol",
      "Tennis",
      "Basketball",
    ];

    await test.step("Obtener todas las opciones del dropdown", async () => {
      const opcionesObtenidas = await sandboxPage.getAllSportsOptions();

      expect(
        opcionesObtenidas,
        `❌ Las opciones del dropdown NO coinciden - Esperadas: ${opcionesEsperadas.join(", ")} - Recibidas: ${opcionesObtenidas.join(", ")}`,
      ).toEqual(opcionesEsperadas);
    });

    Logger.testEnd("UI007", "PASSED");
  });

  test("UI008 - Validar tabla estática", async () => {
    Logger.testStart("UI008");

    const nombresEsperados = ["Messi", "Ronaldo", "Mbappe"];

    await test.step("Obtener nombres de jugadores de la tabla", async () => {
      const nombres = await sandboxPage.getStaticTableNames();

      nombresEsperados.forEach((nombre) => {
        expect(
          nombres,
          `❌ El nombre "${nombre}" NO está en la tabla - Los datos podrían haber cambiado`,
        ).toContain(nombre);
      });
    });

    await test.step("Verificar que la tabla tiene filas", async () => {
      const cantidadFilas = await sandboxPage.getStaticTableRowCount();
      expect(
        cantidadFilas,
        "❌ La tabla NO tiene filas - La tabla podría estar vacía o no cargarse correctamente",
      ).toBeGreaterThan(0);
    });

    Logger.testEnd("UI008", "PASSED");
  });

  test("UI009 - Tabla dinámica cambia al recargar", async ({ page }) => {
    Logger.testStart("UI009");

    let datosIniciales: string[][];

    await test.step("Obtener datos iniciales de la tabla dinámica", async () => {
      datosIniciales = await sandboxPage.getDynamicTableData();
      expect(
        datosIniciales.length,
        "❌ La tabla dinámica está vacía en la carga inicial - La tabla no se renderizó",
      ).toBeGreaterThan(0);
    });

    await test.step("Recargar la página", async () => {
      await page.reload(); // ✅ Usar page del test
    });

    await test.step("Verificar que los datos cambiaron", async () => {
      const datosNuevos = await sandboxPage.getDynamicTableData();
      expect(
        datosNuevos,
        "❌ Los datos de la tabla dinámica NO cambiaron después de recargar - La tabla podría ser estática",
      ).not.toEqual(datosIniciales);
    });

    Logger.testEnd("UI009", "PASSED");
  });

  test("UI010 - Abrir y cerrar popup", async ({ page }) => {
    Logger.testStart("UI010");

    await test.step("Abrir popup", async () => {
      await sandboxPage.openPopup();
    });

    await test.step("Verificar que el popup es visible", async () => {
      await expect(
        page.getByText("¿Viste? ¡Apareció un Pop-up!"), // ✅ Usar page del test, NO sandboxPage.page
        "❌ El popup NO apareció después de hacer click en el botón - El modal no se abrió",
      ).toBeVisible();
    });

    await test.step("Cerrar popup", async () => {
      await sandboxPage.closePopup();
    });

    await test.step("Verificar que el popup se cerró", async () => {
      await expect(
        page.getByText("¿Viste? ¡Apareció un Pop-up!"), // ✅ Usar page del test
        "❌ El popup NO se cerró correctamente - El modal sigue visible",
      ).not.toBeVisible();
    });

    Logger.testEnd("UI010", "PASSED");
  });
  test("UI011 - Seleccionar día de la semana", async ({ page }) => {
    Logger.testStart("UI011");

    const diaASeleccionar = "Martes";

    await test.step(`Seleccionar "${diaASeleccionar}" del dropdown`, async () => {
      await page.getByRole("button", { name: "Día de la semana" }).click();

      await page.getByRole("link", { name: diaASeleccionar }).click();

      Logger.info(`✅ "${diaASeleccionar}" seleccionado correctamente`);
    });

    Logger.testEnd("UI011", "PASSED");
  });
});
