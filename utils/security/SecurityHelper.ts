/**
 * Helper para pruebas de seguridad
 */
export class SecurityHelper {
  static detectXSSVulnerability(input: string, output: string): boolean {
    const scriptTags = [
      "<script>",
      "</script>",
      "javascript:",
      "onerror=",
      "onload=",
    ];

    return scriptTags.some(
      (tag) =>
        input.toLowerCase().includes(tag.toLowerCase()) &&
        output.toLowerCase().includes(tag.toLowerCase()),
    );
  }

  static detectSQLInjection(input: string, response: string): boolean {
    const sqlKeywords = [
      "SELECT",
      "DROP",
      "DELETE",
      "INSERT",
      "UPDATE",
      "WHERE",
      "FROM",
    ];

    return sqlKeywords.some(
      (keyword) =>
        input.toUpperCase().includes(keyword) && response.includes("error"),
    );
  }

  static isSecureURL(url: string): boolean {
    return url.startsWith("https://");
  }

  static validatePasswordStrength(password: string): {
    isStrong: boolean;
    score: number;
    feedback: string[];
  } {
    let score = 0;
    const feedback: string[] = [];

    if (password.length >= 8) score += 1;
    else feedback.push("Password should be at least 8 characters");

    if (/[a-z]/.test(password)) score += 1;
    else feedback.push("Include lowercase letters");

    if (/[A-Z]/.test(password)) score += 1;
    else feedback.push("Include uppercase letters");

    if (/[0-9]/.test(password)) score += 1;
    else feedback.push("Include numbers");

    if (/[^a-zA-Z0-9]/.test(password)) score += 1;
    else feedback.push("Include special characters");

    return {
      isStrong: score >= 4,
      score,
      feedback,
    };
  }
}
