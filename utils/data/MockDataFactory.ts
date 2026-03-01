/**
 * Factory para crear datos mock complejos
 */
export class MockDataFactory {
  static createMockUser() {
    return {
      id: Math.floor(Math.random() * 1000),
      name: "Test User",
      email: "test@example.com",
      role: "user",
      createdAt: new Date().toISOString(),
    };
  }

  static createMockPost() {
    return {
      id: Math.floor(Math.random() * 1000),
      title: "Test Post",
      content: "This is test content",
      authorId: 1,
      published: true,
      createdAt: new Date().toISOString(),
    };
  }

  static createMockProduct() {
    return {
      id: Math.floor(Math.random() * 1000),
      name: "Test Product",
      price: 99.99,
      category: "Electronics",
      inStock: true,
      quantity: 10,
    };
  }

  static createBulkMockData<T>(factory: () => T, count: number): T[] {
    return Array.from({ length: count }, factory);
  }
}
