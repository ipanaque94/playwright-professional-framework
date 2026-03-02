import { test, expect } from "@playwright/test";
import { SandboxPage } from "../../pages/sandbox/SandboxPage";
import { JSONPlaceholderClient } from "../../api/clients/JSONPlaceholderClient";
import { TestDataGenerator } from "../../utils/data/TestDataGenerator";
import { Logger } from "../../utils/reporting/Logger";

test.describe("E2E Tests - Complete User Flows", () => {
  test("E2E001 - Flujo completo de interacción en Sandbox", async ({
    page,
  }) => {
    Logger.testStart("E2E001");

    const sandboxPage = new SandboxPage(page);

    await test.step("Navegar a Sandbox", async () => {
      await sandboxPage.goto();
    });

    await test.step("Interactuar con botón dinámico", async () => {
      await sandboxPage.clickDynamicButton();
      await expect(
        sandboxPage.hiddenElement,
        "Elemento oculto no apareció",
      ).toBeVisible();
    });

    await test.step("Completar formulario de texto", async () => {
      const text = TestDataGenerator.randomString(15);
      await sandboxPage.enterText(text);
      const value = await sandboxPage.getTextInputValue();
      expect(
        value,
        `Texto no coincide: esperado "${text}", recibido "${value}"`,
      ).toBe(text);
    });

    await test.step("Seleccionar checkboxes", async () => {
      await sandboxPage.checkMultipleFoods(["Pizza 🍕", "Pasta 🍝"]);
      const checked = await sandboxPage.getCheckedFoods();
      expect(
        checked.length,
        `Checkboxes seleccionados: ${checked.length}, esperados: 2`,
      ).toBeGreaterThanOrEqual(2);
    });

    await test.step("Seleccionar deporte", async () => {
      await sandboxPage.selectSport("Tennis");
      const selected = await sandboxPage.getSelectedSport();
      expect(
        selected,
        `Deporte incorrecto: esperado "Tennis", recibido "${selected}"`,
      ).toBe("Tennis");
    });

    await test.step("Validar tabla estática", async () => {
      const names = await sandboxPage.getStaticTableNames();
      expect(names, 'Tabla no contiene "Messi"').toContain("Messi");
    });

    Logger.testEnd("E2E001", "PASSED");
  });

  test("E2E002 - Crear recurso via API y validar", async ({ request }) => {
    Logger.testStart("E2E002");

    const apiClient = new JSONPlaceholderClient(request);
    let postId: number;

    await test.step("Crear post", async () => {
      const newPost = TestDataGenerator.randomPost();
      const created = await apiClient.createPost(newPost);
      postId = created.id!;
      expect(postId, "Post creado sin ID").toBeDefined();
      Logger.info(`Post created with ID: ${postId}`);
    });

    await test.step("Validar ID del post", async () => {
      expect(postId, `ID inválido: ${postId}`).toBeGreaterThan(0);
      Logger.info("✅ Post ID validado (fake API no persiste datos)");
    });

    await test.step("Actualizar post existente", async () => {
      const updates = { title: "Updated E2E Title" };
      const updated = await apiClient.patchPost(1, updates);
      expect(
        updated.title,
        `Título no actualizado: esperado "${updates.title}", recibido "${updated.title}"`,
      ).toBe(updates.title);
    });

    await test.step("Agregar comentario", async () => {
      const comment = {
        postId: 1,
        name: "E2E Comment",
        email: TestDataGenerator.randomEmail(),
        body: "E2E test comment",
      };
      const created = await apiClient.createComment(comment);
      expect(
        created.postId,
        `PostId incorrecto: esperado 1, recibido ${created.postId}`,
      ).toBe(1);
    });

    await test.step("Eliminar post", async () => {
      await apiClient.deletePost(1);
      Logger.info("✅ Post eliminado");
    });

    Logger.testEnd("E2E002", "PASSED");
  });
});
