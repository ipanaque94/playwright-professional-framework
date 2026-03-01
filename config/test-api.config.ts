//Configuración de APIs de prueba

export const TestAPIs = {
  jsonPlaceholder: {
    name: "JSONPlaceholder",
    baseURL: "https://jsonplaceholder.typicode.com",
    endpoints: {
      posts: "/posts",
      comments: "/comments",
      albums: "/albums",
      photos: "/photos",
      todos: "/todos",
      users: "/users",
    },
  },

  github: {
    name: "GitHub API",
    baseURL: "https://api.github.com",
    endpoints: {
      users: "/users",
      repos: "/repos",
      search: "/search",
    },
  },

  sandbox: {
    name: "Sandbox FRT",
    baseURL: "https://thefreerangetester.github.io/sandbox-automation-testing",
  },
};

export type APIConfig = (typeof TestAPIs)[keyof typeof TestAPIs];
