import { test, expect } from "@playwright/test";
import { JSONPlaceholderClient } from "../../api/clients/JSONPlaceholderClient";
import { TestDataGenerator } from "../../utils/data/TestDataGenerator";
import { Logger } from "../../utils/reporting/Logger";

test.describe("API Tests - Posts (JSONPlaceholder)", () => {
  test("API001 - Obtener todos los posts", async ({ request }) => {
    Logger.testStart("API001");

    await test.step("Obtener lista completa de posts", async () => {
      const apiClient = new JSONPlaceholderClient(request);
      const posts = await apiClient.getAllPosts();

      expect(posts, "Posts es undefined").toBeDefined();
      expect(
        Array.isArray(posts),
        `Posts no es array: tipo ${typeof posts}`,
      ).toBeTruthy();
      expect(
        posts.length,
        `Sin posts: encontrados ${posts.length}`,
      ).toBeGreaterThan(0);

      Logger.info(`Total posts: ${posts.length}`);
    });

    Logger.testEnd("API001", "PASSED");
  });

  test("API002 - Obtener post por ID", async ({ request }) => {
    Logger.testStart("API002");

    await test.step("Obtener post específico", async () => {
      const apiClient = new JSONPlaceholderClient(request);
      const post = await apiClient.getPostById(1);

      expect(post, "Post sin propiedad id").toHaveProperty("id");
      expect(post, "Post sin título").toHaveProperty("title");
      expect(post, "Post sin body").toHaveProperty("body");
      expect(post.id, `ID incorrecto: esperado 1, recibido ${post.id}`).toBe(1);

      Logger.info("Post retrieved", post);
    });

    Logger.testEnd("API002", "PASSED");
  });

  test("API003 - Crear nuevo post", async ({ request }) => {
    Logger.testStart("API003");

    await test.step("Crear post con datos aleatorios", async () => {
      const apiClient = new JSONPlaceholderClient(request);
      const newPost = TestDataGenerator.randomPost();
      const created = await apiClient.createPost(newPost);

      expect(created, "Post creado sin ID").toHaveProperty("id");
      expect(
        created.title,
        `Título no coincide: esperado "${newPost.title}", recibido "${created.title}"`,
      ).toBe(newPost.title);

      Logger.info("Post created", created);
    });

    Logger.testEnd("API003", "PASSED");
  });

  test("API004 - Actualizar post completo (PUT)", async ({ request }) => {
    Logger.testStart("API004");

    await test.step("Actualizar post con PUT", async () => {
      const apiClient = new JSONPlaceholderClient(request);
      const updatedData = {
        userId: 1,
        title: "Updated Title",
        body: "Updated Body",
      };

      const updated = await apiClient.updatePost(1, updatedData);

      expect(
        updated.id,
        `ID incorrecto: esperado 1, recibido ${updated.id}`,
      ).toBe(1);
      expect(
        updated.title,
        `Título no actualizado: esperado "${updatedData.title}", recibido "${updated.title}"`,
      ).toBe(updatedData.title);
    });

    Logger.testEnd("API004", "PASSED");
  });

  test("API005 - Actualizar post parcialmente (PATCH)", async ({ request }) => {
    Logger.testStart("API005");

    await test.step("Actualizar post con PATCH", async () => {
      const apiClient = new JSONPlaceholderClient(request);
      const partialUpdate = { title: "Partially Updated Title" };
      const updated = await apiClient.patchPost(1, partialUpdate);

      expect(
        updated.id,
        `ID incorrecto: esperado 1, recibido ${updated.id}`,
      ).toBe(1);
      expect(
        updated.title,
        `Título no actualizado: esperado "${partialUpdate.title}", recibido "${updated.title}"`,
      ).toBe(partialUpdate.title);
    });

    Logger.testEnd("API005", "PASSED");
  });

  test("API006 - Eliminar post", async ({ request }) => {
    Logger.testStart("API006");

    await test.step("Eliminar post existente", async () => {
      const apiClient = new JSONPlaceholderClient(request);
      await apiClient.deletePost(1);

      Logger.info("Post deleted successfully");
    });

    Logger.testEnd("API006", "PASSED");
  });

  test("API007 - Obtener posts por usuario", async ({ request }) => {
    Logger.testStart("API007");

    await test.step("Filtrar posts por userId", async () => {
      const apiClient = new JSONPlaceholderClient(request);
      const posts = await apiClient.getPostsByUser(1);

      expect(
        Array.isArray(posts),
        `Posts no es array: tipo ${typeof posts}`,
      ).toBeTruthy();
      expect(
        posts.length,
        `Usuario sin posts: encontrados ${posts.length}`,
      ).toBeGreaterThan(0);
    });

    Logger.testEnd("API007", "PASSED");
  });

  test("API008 - Obtener comentarios de un post", async ({ request }) => {
    Logger.testStart("API008");

    await test.step("Obtener comentarios del post 1", async () => {
      const apiClient = new JSONPlaceholderClient(request);
      const comments = await apiClient.getCommentsByPost(1);

      expect(
        Array.isArray(comments),
        `Comentarios no es array: tipo ${typeof comments}`,
      ).toBeTruthy();
      expect(
        comments.length,
        `Post sin comentarios: encontrados ${comments.length}`,
      ).toBeGreaterThan(0);
    });

    Logger.testEnd("API008", "PASSED");
  });
});
