import fs from "fs";
import path from "path";

/**
 * Helper para generación de reportes
 */
export class ReportHelper {
  private static reportsDir = "reports";

  static init(): void {
    if (!fs.existsSync(this.reportsDir)) {
      fs.mkdirSync(this.reportsDir, { recursive: true });
    }
  }

  static generateSummaryReport(results: any[]): string {
    this.init();

    const passed = results.filter((r) => r.status === "passed").length;
    const failed = results.filter((r) => r.status === "failed").length;
    const skipped = results.filter((r) => r.status === "skipped").length;

    let report = "📊 Test Execution Summary\n\n";
    report += `Total Tests: ${results.length}\n`;
    report += `✅ Passed: ${passed}\n`;
    report += `❌ Failed: ${failed}\n`;
    report += `⏭️  Skipped: ${skipped}\n`;
    report += `📈 Pass Rate: ${((passed / results.length) * 100).toFixed(2)}%\n`;

    return report;
  }

  static saveReport(name: string, content: string): void {
    this.init();
    const filepath = path.join(this.reportsDir, `${name}-${Date.now()}.txt`);
    fs.writeFileSync(filepath, content);
  }
}
