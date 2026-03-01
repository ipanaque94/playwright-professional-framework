import fs from "fs";
import path from "path";

export enum LogLevel {
  INFO = "INFO",
  DEBUG = "DEBUG",
  WARN = "WARN",
  ERROR = "ERROR",
}

/**
 * Logger profesional
 */
export class Logger {
  private static logDir = "logs";
  private static logFile = "test-execution.log";

  static init(): void {
    if (!fs.existsSync(this.logDir)) {
      fs.mkdirSync(this.logDir, { recursive: true });
    }
  }

  private static log(level: LogLevel, message: string, data?: any): void {
    this.init();

    const timestamp = new Date().toISOString();
    const logMessage = `[${timestamp}] [${level}] ${message}`;

    console.log(logMessage);
    if (data) {
      console.log(JSON.stringify(data, null, 2));
    }

    const fileMessage = data
      ? `${logMessage}\n${JSON.stringify(data, null, 2)}\n`
      : `${logMessage}\n`;

    fs.appendFileSync(path.join(this.logDir, this.logFile), fileMessage);
  }

  static info(message: string, data?: any): void {
    this.log(LogLevel.INFO, message, data);
  }

  static debug(message: string, data?: any): void {
    this.log(LogLevel.DEBUG, message, data);
  }

  static warn(message: string, data?: any): void {
    this.log(LogLevel.WARN, message, data);
  }

  static error(message: string, data?: any): void {
    this.log(LogLevel.ERROR, message, data);
  }

  static testStart(testName: string): void {
    this.info(`🚀 Starting test: ${testName}`);
  }

  static testEnd(testName: string, status: "PASSED" | "FAILED"): void {
    const emoji = status === "PASSED" ? "✅" : "❌";
    this.info(`${emoji} Test ${status}: ${testName}`);
  }

  static apiRequest(method: string, url: string, data?: any): void {
    this.debug(`API ${method} → ${url}`, data);
  }

  static apiResponse(status: number, data: any): void {
    this.debug(`API Response ← ${status}`, data);
  }

  static stepStart(stepName: string): void {
    this.info(`📍 Step: ${stepName}`);
  }

  static assertion(description: string, passed: boolean): void {
    const emoji = passed ? "✓" : "✗";
    this.info(`${emoji} Assertion: ${description}`);
  }
}
