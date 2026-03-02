import { test, expect } from "@playwright/test";
import { JSONPlaceholderClient } from "../../api/clients/JSONPlaceholderClient";
import { TestDataGenerator } from "../../utils/data/TestDataGenerator";
import { Logger } from "../../utils/reporting/Logger";

test.describe("Integration Tests - JSONPlaceholder API", () => {
  test("INT001 - Crear post y agregar comentarios", async ({ request }) => {
    Logger.testStart("INT001");

    const apiClient = new JSONPlaceholderClient(request);
    let postId: number;

    await test.step("Crear post con datos aleatorios", async () => {
      const newPost = TestDataGenerator.randomPost();
      const created = await apiClient.createPost(newPost);
      postId = created.id!;

      expect(
        postId,
        `Post creado sin ID. Respuesta: ${JSON.stringify(created)}`,
      ).toBeDefined();
    });

    await test.step("Agregar comentario al post", async () => {
      const comment = {
        postId: 1,
        name: "Integration Comment",
        email: TestDataGenerator.randomEmail(),
        body: "Testing integration",
      };

      const created = await apiClient.createComment(comment);
      expect(
        created.postId,
        `Comentario con postId incorrecto: esperado 1, recibido ${created.postId}`,
      ).toBe(1);
    });

    Logger.testEnd("INT001", "PASSED");
  });

  test("INT002 - Flujo Usuario → Posts → Comentarios", async ({ request }) => {
    Logger.testStart("INT002");

    const apiClient = new JSONPlaceholderClient(request);

    await test.step("Obtener usuario existente", async () => {
      const user = await apiClient.getUserById(1);
      expect(
        user.id,
        `ID de usuario incorrecto: esperado 1, recibido ${user.id}`,
      ).toBe(1);
      expect(
        user.name,
        `Usuario sin nombre. Usuario: ${JSON.stringify(user)}`,
      ).toBeDefined();
    });

    await test.step("Obtener posts del usuario", async () => {
      const posts = await apiClient.getPostsByUser(1);
      expect(
        posts.length,
        `Usuario 1 sin posts: encontrados ${posts.length}`,
      ).toBeGreaterThan(0);
    });

    await test.step("Obtener comentarios del primer post", async () => {
      const comments = await apiClient.getCommentsByPost(1);
      expect(
        Array.isArray(comments),
        `Comentarios no es array: tipo ${typeof comments}`,
      ).toBeTruthy();
      expect(
        comments.length,
        `Post 1 sin comentarios: encontrados ${comments.length}`,
      ).toBeGreaterThan(0);
    });

    Logger.testEnd("INT002", "PASSED");
  });

  test("INT003 - Crear, actualizar y eliminar post", async ({ request }) => {
    Logger.testStart("INT003");

    const apiClient = new JSONPlaceholderClient(request);

    await test.step("Crear post", async () => {
      const newPost = TestDataGenerator.randomPost();
      const created = await apiClient.createPost(newPost);
      expect(created.id, "Post creado sin ID").toBeDefined();
    });

    await test.step("Actualizar post existente", async () => {
      const updates = { title: "Updated Integration Title" };
      const updated = await apiClient.patchPost(1, updates);
      expect(
        updated.title,
        `Título no actualizado: esperado "${updates.title}", recibido "${updated.title}"`,
      ).toBe(updates.title);
    });

    await test.step("Eliminar post", async () => {
      await apiClient.deletePost(1);
    });

    Logger.testEnd("INT003", "PASSED");
  });

  test("INT004 - Validar schemas de recursos", async ({ request }) => {
    Logger.testStart("INT004");

    const apiClient = new JSONPlaceholderClient(request);

    await test.step("Validar schema de posts", async () => {
      const posts = await apiClient.getAllPosts();
      expect(
        Array.isArray(posts),
        `Posts no es array: tipo ${typeof posts}`,
      ).toBeTruthy();
      expect(
        posts.length,
        `Cantidad incorrecta de posts: esperado 100, recibido ${posts.length}`,
      ).toBe(100);

      const firstPost = posts[0];
      expect(
        firstPost,
        `Schema de post incorrecto: ${JSON.stringify(Object.keys(firstPost))}`,
      ).toMatchObject({
        userId: expect.any(Number),
        id: expect.any(Number),
        title: expect.any(String),
        body: expect.any(String),
      });
    });

    Logger.testEnd("INT004", "PASSED");
  });
});
