import { test, expect } from "@playwright/test";
import { JSONPlaceholderClient } from "../../api/clients/JSONPlaceholderClient";
import { GitHubClient } from "../../api/clients/GitHubClient";
import { TestDataGenerator } from "../../utils/data/TestDataGenerator";
import { Logger } from "../../utils/reporting/Logger";

test.describe("Integration Tests - Multiple APIs", () => {
  test("INT001 - Crear post y agregar comentarios", async ({ request }) => {
    Logger.testStart("INT001");

    const apiClient = new JSONPlaceholderClient(request);
    let postId: number;

    await test.step("Crear post", async () => {
      const newPost = TestDataGenerator.randomPost();
      const created = await apiClient.createPost(newPost);
      postId = created.id!;
      expect(postId).toBeDefined();
    });

    await test.step("Agregar comentario", async () => {
      const comment = {
        postId: 1, // Usar ID que existe
        name: "Integration Comment",
        email: TestDataGenerator.randomEmail(),
        body: "Testing integration",
      };

      const created = await apiClient.createComment(comment);
      expect(created.postId).toBe(1);
    });

    Logger.testEnd("INT001", "PASSED");
  });

  test("INT002 - Verificar usuario en JSONPlaceholder", async ({ request }) => {
    Logger.testStart("INT002");

    const apiClient = new JSONPlaceholderClient(request);

    await test.step("Obtener usuario", async () => {
      const user = await apiClient.getUserById(1);
      expect(user.id).toBe(1);
      expect(user.name).toBeDefined();
    });

    await test.step("Obtener posts del usuario", async () => {
      const posts = await apiClient.getPostsByUser(1);
      expect(posts.length).toBeGreaterThan(0);
    });

    Logger.testEnd("INT002", "PASSED");
  });

  test("INT003 - GitHub user tiene repositorios", async ({ request }) => {
    Logger.testStart("INT003");

    const githubClient = new GitHubClient(request);
    let username: string;

    await test.step("Obtener usuario de GitHub", async () => {
      const user = await githubClient.getUser("TheFreeRangeTester");
      username = user.login;
      expect(user.public_repos).toBeGreaterThan(0);
    });

    await test.step("Obtener repositorios", async () => {
      const repos = await githubClient.getUserRepos(username);
      expect(Array.isArray(repos)).toBeTruthy();
      expect(repos.length).toBeGreaterThan(0);
    });

    Logger.testEnd("INT003", "PASSED");
  });

  test("INT004 - Flujo completo: Usuario → Post → Comentarios", async ({
    request,
  }) => {
    Logger.testStart("INT004");

    const apiClient = new JSONPlaceholderClient(request);
    let userId: number;

    await test.step("Obtener usuario", async () => {
      const user = await apiClient.getUserById(1);
      userId = user.id!;
      expect(userId).toBe(1);
    });

    await test.step("Obtener posts del usuario", async () => {
      const posts = await apiClient.getPostsByUser(userId);
      expect(posts.length).toBeGreaterThan(0);
    });

    await test.step("Obtener comentarios del primer post", async () => {
      const comments = await apiClient.getCommentsByPost(1);
      expect(Array.isArray(comments)).toBeTruthy();
    });

    Logger.testEnd("INT004", "PASSED");
  });
});
