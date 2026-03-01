/**
 * Validador de datos
 */
export class DataValidator {
  static isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  static isValidDNI(dni: string): boolean {
    return /^\d{8}$/.test(dni);
  }

  static isValidPhone(phone: string): boolean {
    return /^9\d{8}$/.test(phone);
  }

  static isValidURL(url: string): boolean {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  }

  static isValidDate(date: string): boolean {
    return !isNaN(Date.parse(date));
  }

  static isInRange(value: number, min: number, max: number): boolean {
    return value >= min && value <= max;
  }

  static isNotEmpty(value: string): boolean {
    return value.trim().length > 0;
  }

  static matchesPattern(value: string, pattern: RegExp): boolean {
    return pattern.test(value);
  }
}
