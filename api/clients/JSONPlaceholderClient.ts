import { APIRequestContext } from "@playwright/test";
import { BaseAPIClient } from "../base/BaseAPIClient";
import { TestAPIs } from "../../config/test-api.config";

export interface Post {
  id?: number;
  userId: number;
  title: string;
  body: string;
}

export interface Comment {
  id?: number;
  postId: number;
  name: string;
  email: string;
  body: string;
}

export interface User {
  id?: number;
  name: string;
  username: string;
  email: string;
  address?: {
    street: string;
    city: string;
    zipcode: string;
  };
  phone?: string;
  website?: string;
}

//Cliente para JSONPlaceholder API

export class JSONPlaceholderClient extends BaseAPIClient {
  constructor(request: APIRequestContext) {
    super(request, TestAPIs.jsonPlaceholder.baseURL);
  }

  //POSTS

  async getAllPosts() {
    const response = await this.get("/posts");
    this.verifySuccess(response);
    return (await response.json()) as Post[];
  }

  async getPostById(id: number) {
    const response = await this.get(`/posts/${id}`);
    this.verifySuccess(response);
    return (await response.json()) as Post;
  }

  async createPost(post: Omit<Post, "id">) {
    const response = await this.post("/posts", post);
    this.verifySuccess(response);
    return (await response.json()) as Post;
  }

  async updatePost(id: number, post: Partial<Post>) {
    const response = await this.put(`/posts/${id}`, post);
    this.verifySuccess(response);
    return (await response.json()) as Post;
  }

  async patchPost(id: number, post: Partial<Post>) {
    const response = await this.patch(`/posts/${id}`, post);
    this.verifySuccess(response);
    return (await response.json()) as Post;
  }

  async deletePost(id: number) {
    const response = await this.delete(`/posts/${id}`);
    this.verifySuccess(response);
  }

  async getPostsByUser(userId: number) {
    const response = await this.get(`/posts?userId=${userId}`);
    this.verifySuccess(response);
    return (await response.json()) as Post[];
  }

  //COMMENTS

  async getCommentsByPost(postId: number) {
    const response = await this.get(`/posts/${postId}/comments`);
    this.verifySuccess(response);
    return (await response.json()) as Comment[];
  }

  async createComment(comment: Omit<Comment, "id">) {
    const response = await this.post("/comments", comment);
    this.verifySuccess(response);
    return (await response.json()) as Comment;
  }

  //USERS

  async getAllUsers() {
    const response = await this.get("/users");
    this.verifySuccess(response);
    return (await response.json()) as User[];
  }

  async getUserById(id: number) {
    const response = await this.get(`/users/${id}`);
    this.verifySuccess(response);
    return (await response.json()) as User;
  }
}
