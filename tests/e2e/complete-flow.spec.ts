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
      await sandboxPage.verifyHiddenElementAppears();
    });

    await test.step("Completar formulario de texto", async () => {
      const text = TestDataGenerator.randomString(15);
      await sandboxPage.enterText(text);
      const value = await sandboxPage.getTextInputValue();
      expect(value).toBe(text);
    });

    await test.step("Seleccionar checkboxes", async () => {
      await sandboxPage.checkMultipleFoods(["Pizza 🍕", "Pasta 🍝"]);
      const checked = await sandboxPage.getCheckedFoods();
      expect(checked.length).toBeGreaterThanOrEqual(2);
    });

    await test.step("Seleccionar radio button", async () => {
      await sandboxPage.selectYesRadio();
    });

    await test.step("Seleccionar deporte", async () => {
      await sandboxPage.selectSport("Tennis");
      const selected = await sandboxPage.getSelectedSport();
      expect(selected).toBe("Tennis");
    });

    await test.step("Validar tabla estática", async () => {
      const names = await sandboxPage.getStaticTableNames();
      expect(names).toContain("Messi");
    });

    await test.step("Interactuar con popup", async () => {
      await sandboxPage.openPopup();
      await sandboxPage.verifyPopupVisible();
      await sandboxPage.closePopup();
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
      expect(postId).toBeDefined();
      Logger.info(`Post created with ID: ${postId}`);
    });

    await test.step("Verificar que API devuelve ID (fake API)", async () => {
      // JSONPlaceholder es fake, siempre devuelve ID 101
      // Pero NO persiste datos, así que validamos que el ID existe
      expect(postId).toBeGreaterThan(0);

      // En lugar de buscar el post (404), validamos la respuesta de creación
      Logger.info("✅ Post ID validado (fake API no persiste datos)");
    });

    await test.step("Actualizar post", async () => {
      const updates = { title: "Updated E2E Title" };

      // Usar ID 1 que SÍ existe en la fake API
      const updated = await apiClient.patchPost(1, updates);
      expect(updated.title).toBe(updates.title);
    });

    await test.step("Agregar comentario", async () => {
      const comment = {
        postId: 1, // Usar ID que existe
        name: "E2E Comment",
        email: TestDataGenerator.randomEmail(),
        body: "E2E test comment",
      };
      const created = await apiClient.createComment(comment);
      expect(created.postId).toBe(1);
    });

    await test.step("Eliminar post", async () => {
      await apiClient.deletePost(1); // Usar ID que existe
    });

    Logger.testEnd("E2E002", "PASSED");
  });
});
