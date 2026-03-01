/**
 * Colector de métricas
 */
export class MetricsCollector {
  private metrics: Array<{ name: string; value: number; timestamp: Date }> = [];

  addMetric(name: string, value: number): void {
    this.metrics.push({
      name,
      value,
      timestamp: new Date(),
    });
  }

  getMetrics() {
    return this.metrics;
  }

  getAverage(metricName: string): number {
    const values = this.metrics
      .filter((m) => m.name === metricName)
      .map((m) => m.value);

    return values.length > 0
      ? values.reduce((a, b) => a + b, 0) / values.length
      : 0;
  }

  getMin(metricName: string): number {
    const values = this.metrics
      .filter((m) => m.name === metricName)
      .map((m) => m.value);

    return values.length > 0 ? Math.min(...values) : 0;
  }

  getMax(metricName: string): number {
    const values = this.metrics
      .filter((m) => m.name === metricName)
      .map((m) => m.value);

    return values.length > 0 ? Math.max(...values) : 0;
  }

  generateReport(): string {
    const uniqueMetrics = [...new Set(this.metrics.map((m) => m.name))];

    let report = "📊 Performance Report\n\n";

    uniqueMetrics.forEach((metricName) => {
      report += `${metricName}:\n`;
      report += `  Average: ${this.getAverage(metricName).toFixed(2)}ms\n`;
      report += `  Min: ${this.getMin(metricName).toFixed(2)}ms\n`;
      report += `  Max: ${this.getMax(metricName).toFixed(2)}ms\n\n`;
    });

    return report;
  }

  clear(): void {
    this.metrics = [];
  }
}
