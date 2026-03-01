/**
 * Reporte de accesibilidad
 */
export class A11yReporter {
  static generateReport(results: any): string {
    let report = "♿ Accessibility Report\n\n";

    report += `✅ Passed Tests: ${results.passes.length}\n`;
    report += `❌ Violations: ${results.violations.length}\n`;
    report += `⚠️ Incomplete: ${results.incomplete.length}\n\n`;

    if (results.violations.length > 0) {
      report += "Violations:\n";
      results.violations.forEach((violation: any, index: number) => {
        report += `\n${index + 1}. ${violation.id}\n`;
        report += `   Description: ${violation.description}\n`;
        report += `   Impact: ${violation.impact}\n`;
        report += `   Nodes affected: ${violation.nodes.length}\n`;
      });
    }

    return report;
  }

  static getCriticalViolations(results: any) {
    return results.violations.filter(
      (v: any) => v.impact === "critical" || v.impact === "serious",
    );
  }
}
