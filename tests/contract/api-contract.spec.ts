import { test, expect } from "@playwright/test";
import { TestAPIs } from "../../config/test-api.config";
import { Logger } from "../../utils/reporting/Logger";

test.describe("Contract Tests - API Schema Validation", () => {
  test("CON001 - Post schema es correcto", async ({ request }) => {
    Logger.testStart("CON001");

    await test.step("Validar schema completo de Post", async () => {
      const response = await request.get(
        `${TestAPIs.jsonPlaceholder.baseURL}/posts/1`,
      );

      expect(
        response.ok(),
        `Petición falló: status ${response.status()}`,
      ).toBeTruthy();

      const post = await response.json();
      expect(
        post,
        `Campos faltantes: ${JSON.stringify(Object.keys(post))}`,
      ).toMatchObject({
        userId: expect.any(Number),
        id: expect.any(Number),
        title: expect.any(String),
        body: expect.any(String),
      });

      expect(
        post.title.length,
        `Título vacío: longitud ${post.title.length}`,
      ).toBeGreaterThan(0);
    });

    Logger.testEnd("CON001", "PASSED");
  });

  test("CON002 - User schema es correcto", async ({ request }) => {
    Logger.testStart("CON002");

    await test.step("Validar schema completo de User", async () => {
      const response = await request.get(
        `${TestAPIs.jsonPlaceholder.baseURL}/users/1`,
      );
      expect(
        response.ok(),
        `Petición falló: status ${response.status()}`,
      ).toBeTruthy();

      const user = await response.json();
      expect(user, `Schema de usuario incorrecto`).toMatchObject({
        id: expect.any(Number),
        name: expect.any(String),
        username: expect.any(String),
        email: expect.stringMatching(/^[^\s@]+@[^\s@]+\.[^\s@]+$/),
        address: expect.objectContaining({
          street: expect.any(String),
          city: expect.any(String),
          zipcode: expect.any(String),
        }),
        phone: expect.any(String),
        website: expect.any(String),
        company: expect.objectContaining({
          name: expect.any(String),
        }),
      });

      expect(user.email, `Email inválido: "${user.email}"`).toMatch(
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
      );
    });

    Logger.testEnd("CON002", "PASSED");
  });

  test("CON003 - Comment schema es correcto", async ({ request }) => {
    Logger.testStart("CON003");

    await test.step("Validar schema de Comment", async () => {
      const response = await request.get(
        `${TestAPIs.jsonPlaceholder.baseURL}/comments/1`,
      );
      expect(
        response.ok(),
        `Petición falló: status ${response.status()}`,
      ).toBeTruthy();

      const comment = await response.json();
      expect(comment, `Schema de comentario incorrecto`).toMatchObject({
        postId: expect.any(Number),
        id: expect.any(Number),
        name: expect.any(String),
        email: expect.stringMatching(/^[^\s@]+@[^\s@]+\.[^\s@]+$/),
        body: expect.any(String),
      });
    });

    Logger.testEnd("CON003", "PASSED");
  });

  test("CON004 - Array de posts cumple contrato", async ({ request }) => {
    Logger.testStart("CON004");

    await test.step("Validar posts en array", async () => {
      const response = await request.get(
        `${TestAPIs.jsonPlaceholder.baseURL}/posts`,
      );
      expect(response.ok(), "Petición a /posts falló").toBeTruthy();

      const posts = await response.json();
      expect(
        Array.isArray(posts),
        `No es array: tipo ${typeof posts}`,
      ).toBeTruthy();

      posts.slice(0, 5).forEach((post: any, index: number) => {
        expect(post, `Post ${index} viola contrato`).toMatchObject({
          userId: expect.any(Number),
          id: expect.any(Number),
          title: expect.any(String),
          body: expect.any(String),
        });
      });
    });

    Logger.testEnd("CON004", "PASSED");
  });

  test("CON005 - POST acepta estructura correcta", async ({ request }) => {
    Logger.testStart("CON005");

    await test.step("Crear post con estructura válida", async () => {
      const newPost = {
        title: "Contract Test Post",
        body: "Testing contract compliance",
        userId: 1,
      };

      const response = await request.post(
        `${TestAPIs.jsonPlaceholder.baseURL}/posts`,
        {
          data: newPost,
        },
      );

      expect(
        response.status(),
        `POST rechazado: status ${response.status()}`,
      ).toBe(201);

      const created = await response.json();
      expect(created, "Respuesta sin ID").toHaveProperty("id");
      expect(
        created.title,
        `Título no coincide: esperado "${newPost.title}", recibido "${created.title}"`,
      ).toBe(newPost.title);
    });

    Logger.testEnd("CON005", "PASSED");
  });
});
