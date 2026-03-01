//Configuración de ambientes

export interface EnvironmentConfig {
  name: string;
  baseURL: string;
  apiURL: string;
  timeout: number;
  retries: number;
}

export class Environment {
  private static environments: Record<string, EnvironmentConfig> = {
    LOCAL: {
      name: "Local Development",
      baseURL:
        "https://thefreerangetester.github.io/sandbox-automation-testing/",
      apiURL: "https://jsonplaceholder.typicode.com",
      timeout: 30000,
      retries: 0,
    },
    DEV: {
      name: "Development",
      baseURL: "https://dev.example.com",
      apiURL: "https://api-dev.example.com",
      timeout: 60000,
      retries: 3,
    },
    QA: {
      name: "Quality Assurance",
      baseURL: "https://qa.example.com",
      apiURL: "https://api-qa.example.com",
      timeout: 45000,
      retries: 2,
    },
    STAGING: {
      name: "Staging",
      baseURL: "https://staging.example.com",
      apiURL: "https://api-staging.example.com",
      timeout: 30000,
      retries: 2,
    },
    PROD: {
      name: "Production",
      baseURL: "https://www.freerangetesters.com",
      apiURL: "https://api.freerangetesters.com",
      timeout: 30000,
      retries: 1,
    },
  };

  static getConfig(): EnvironmentConfig {
    const env = process.env.TEST_ENV || "LOCAL";
    const config = this.environments[env];

    if (!config) {
      throw new Error(`Environment ${env} not found`);
    }

    return config;
  }

  static get current(): EnvironmentConfig {
    return this.getConfig();
  }

  static isProduction(): boolean {
    return process.env.TEST_ENV === "PROD";
  }
}
