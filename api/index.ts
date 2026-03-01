//Exportaciones centralizadas de API Clients

export { BaseAPIClient } from "./base/BaseAPIClient";
export { JSONPlaceholderClient } from "./clients/JSONPlaceholderClient";
export { GitHubClient } from "./clients/GitHubClient";
export type { Post, Comment, User } from "./clients/JSONPlaceholderClient";
export type { GitHubUser, GitHubRepo } from "./clients/GitHubClient";
