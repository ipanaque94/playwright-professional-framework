/**
 * Generador de datos de prueba
 */
export class TestDataGenerator {
  static randomEmail(domain: string = "example.com"): string {
    return `test${Date.now()}${this.randomString(5)}@${domain}`;
  }

  static randomString(length: number = 10): string {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
    let result = "";
    for (let i = 0; i < length; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  }

  static randomNumber(min: number = 1, max: number = 100): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  static randomBoolean(): boolean {
    return Math.random() < 0.5;
  }

  static randomDate(
    start: Date = new Date(2020, 0, 1),
    end: Date = new Date(),
  ): Date {
    return new Date(
      start.getTime() + Math.random() * (end.getTime() - start.getTime()),
    );
  }

  static randomDNI(): string {
    return String(this.randomNumber(10000000, 99999999));
  }

  static randomPhone(): string {
    return `9${this.randomNumber(10000000, 99999999)}`;
  }

  static randomFirstName(): string {
    const names = [
      "Juan",
      "María",
      "Carlos",
      "Ana",
      "Luis",
      "Rosa",
      "Pedro",
      "Carmen",
      "José",
      "Laura",
    ];
    return names[this.randomNumber(0, names.length - 1)];
  }

  static randomLastName(): string {
    const lastNames = [
      "García",
      "Rodríguez",
      "Martínez",
      "López",
      "González",
      "Pérez",
      "Sánchez",
      "Ramírez",
    ];
    return lastNames[this.randomNumber(0, lastNames.length - 1)];
  }

  static randomFullName(): string {
    return `${this.randomFirstName()} ${this.randomLastName()}`;
  }

  static randomUser() {
    return {
      firstName: this.randomFirstName(),
      lastName: this.randomLastName(),
      email: this.randomEmail(),
      phone: this.randomPhone(),
      dni: this.randomDNI(),
      age: this.randomNumber(18, 65),
    };
  }

  static randomPost() {
    return {
      title: `Test Post ${this.randomString(10)}`,
      body: `Test content ${this.randomString(50)}`,
      userId: this.randomNumber(1, 10),
    };
  }

  static randomArray<T>(generator: () => T, count: number): T[] {
    return Array.from({ length: count }, generator);
  }

  static randomPassword(length: number = 12): string {
    const chars =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*";
    let password = "";
    for (let i = 0; i < length; i++) {
      password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return password;
  }

  static randomURL(): string {
    return `https://test${this.randomString(5)}.com`;
  }

  static randomIPAddress(): string {
    return `${this.randomNumber(1, 255)}.${this.randomNumber(0, 255)}.${this.randomNumber(0, 255)}.${this.randomNumber(1, 255)}`;
  }
}
