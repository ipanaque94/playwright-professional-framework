Playwright E2E Testing Framework

Proyecto personal de automatización E2E construido desde cero para demostrar cómo un QA profesional estructura pruebas en un entorno real. Implementa Page Object Model con 6 componentes, 9 proyectos de prueba organizados por tipo, y pipeline CI/CD con Jenkins + Docker.
🔗 Ver código en GitHub

Por qué construí esto (y lo que aprendí en el camino)
Cuando arranqué con QA Automation, encontré muchos tutoriales que mostraban "cómo hacer un test de login" pero ninguno explicaba cómo organizar 50+ tests en un proyecto que no se vuelva imposible de mantener.
Este proyecto lo construí con una regla simple: si no entiendo por qué algo está organizado de cierta manera, no lo dejo así. Eso significó refactorizar varias veces, leer documentación de Playwright hasta las 2am, y debuggear errores que solo aparecían en CI pero nunca en local.
El resultado no es un "proyecto de ejemplo perfecto". Es un proyecto que refleja cómo pienso como QA: qué pruebo, por qué lo pruebo de esa manera, y cómo lo organizo para que otro QA (o yo mismo en 3 meses) pueda entender la lógica sin tener que leer 500 líneas de código.

Qué se prueba y por qué lo dividí así
Sistema bajo prueba: Sandbox de Automation Testing
Un sitio de práctica con formularios, tablas dinámicas, popups, drag & drop y elementos que cambian de estado. Perfecto para cubrir los casos típicos que un QA enfrenta en aplicaciones web reales.
Arquitectura: 9 proyectos de prueba separados
La mayoría de tutoriales pone todo en un solo proyecto llamado "tests". Yo lo dividí en 9 porque en empresas reales, diferentes tipos de pruebas tienen diferentes propósitos, diferentes owners, y se ejecutan en diferentes momentos del pipeline.
ProyectoPropósitoPor qué existe como proyecto separadoui-testsPruebas funcionales de interfazEl 80% de lo que un QA prueba diariamente. Necesitan correr rápido y ser estables.api-testsValidación de endpoints RESTLas APIs cambian independiente de la UI. Separarlas permite detectar si un error es de backend o frontend.e2e-testsFlujos completos de usuarioSimulan el comportamiento real: login → acción → logout. Tardan más, por eso corren menos frecuente.integration-testsInteracción entre componentesVerifica que el formulario se comunique correctamente con la tabla dinámica cuando se agrega un dato.contract-testsValidación de estructura de datosSi la tabla cambia de 3 a 4 columnas sin avisar, este test falla antes de que llegue a producción.performance-testsTiempos de carga y respuestaDetecta si una página que antes cargaba en 2s ahora tarda 10s por un cambio en el código.security-testsValidación de inputs maliciososSQL injection, XSS, inputs excesivamente largos. No soy pen-tester, pero cubro lo básico.accessibility-testsCumplimiento de estándares WCAGLabels en inputs, contraste de colores, navegación por teclado. Muchas empresas lo requieren por ley.visual-testsRegresión visual con snapshotsDetecta si un cambio de CSS rompió el diseño sin que nadie se dé cuenta.

Análisis de casos de prueba por categoría
UI Tests — "¿La interfaz funciona como debería?"
Login exitoso (UI001)

Qué prueba: Usuario válido puede iniciar sesión
Por qué importa: Si el login falla, todo lo demás es irrelevante
Cómo lo pruebo: Verifico que después de login exitoso aparezca el mensaje de bienvenida Y la URL cambie a /dashboard

Formulario dinámico (UI002)

Qué prueba: Los campos del formulario se agregan correctamente a la tabla
Por qué importa: Es el flujo principal de la app
Cómo lo pruebo: LLeno 3 campos → Submit → Verifico que aparezcan en la tabla con los datos exactos que ingresé

Manejo de popups (UI003)

Qué prueba: Los alerts nativos del navegador se pueden aceptar/rechazar
Por qué importa: Muchas apps legacy usan alerts, y Playwright los maneja diferente a Selenium
Cómo lo pruebo: Escucho el evento dialog, capturo el mensaje, y verifico que la acción se ejecute correctamente


E2E Tests — "¿El flujo completo funciona de principio a fin?"
Ciclo completo: Login → Agregar dato → Verificar → Logout (E2E001)

Qué prueba: El happy path completo desde que un usuario entra hasta que sale
Por qué importa: Refleja el comportamiento real de un usuario
Cómo lo pruebo:

Login con credenciales válidas
Navego a formulario
Agrego 2 registros
Verifico que ambos aparezcan en tabla
Logout
Verifico que no pueda acceder a páginas protegidas sin autenticación




Integration Tests — "¿Los componentes se comunican correctamente?"
Formulario → Tabla dinámica (INT001)

Qué prueba: Cuando agrego un dato en el formulario, la tabla se actualiza sin recargar la página
Por qué importa: Si la tabla no se actualiza, es un bug de integración entre componentes
Cómo lo pruebo:

Cuento cuántas filas tiene la tabla ANTES
Agrego un registro
Cuento cuántas filas tiene DESPUÉS
Verifico que aumentó en exactamente 1




Contract Tests — "¿La estructura de datos cambió sin avisarnos?"
Estructura de tabla dinámica (CON001)

Qué prueba: La tabla tiene exactamente las columnas esperadas en el orden correcto
Por qué importa: Si un dev agrega una columna nueva o cambia el orden, los selectores de UI pueden romperse
Cómo lo pruebo:

typescript  const headers = await page.locator('table thead th').allTextContents();
  expect(headers).toEqual(['Nombre', 'Apellido', 'Email', 'Acciones']);

Performance Tests — "¿La página carga en tiempo razonable?"
Tiempo de carga de homepage (PERF001)

Qué prueba: La página principal carga en menos de 3 segundos
Por qué importa: Google penaliza sitios lentos en SEO, y usuarios abandonan si tarda más de 3s
Cómo lo pruebo:

typescript  const startTime = Date.now();
  await page.goto('/');
  const loadTime = Date.now() - startTime;
  expect(loadTime).toBeLessThan(3000);
Performance de tabla con 100 filas (PERF002)

Qué prueba: El render de una tabla grande no bloquea la UI
Por qué importa: Las tablas mal optimizadas pueden hacer que el navegador se congele
Cómo lo pruebo: Agrego 100 filas programáticamente y mido el tiempo de render


Security Tests — "¿El sistema rechaza inputs maliciosos?"
SQL Injection en formulario (SEC001)

Qué prueba: El sistema sanitiza inputs tipo ' OR '1'='1
Por qué importa: Es la vulnerabilidad #1 según OWASP
Cómo lo pruebo: Ingreso el payload, verifico que NO se ejecute como código sino que se muestre como texto

XSS en campos de texto (SEC002)

Qué prueba: Scripts como <script>alert('XSS')</script> no se ejecutan
Por qué importa: Permite robar sesiones de usuarios
Cómo lo pruebo: Ingreso el payload, verifico que aparezca escapado en la tabla como texto plano


Accessibility Tests — "¿Usuarios con discapacidad pueden usar la app?"
Labels en inputs (A11Y001)

Qué prueba: Todos los inputs tienen labels asociados correctamente
Por qué importa: Los lectores de pantalla no funcionan sin labels
Cómo lo pruebo: Uso axe-core para escanear la página y detectar violaciones WCAG

Navegación por teclado (A11Y002)

Qué prueba: Se puede navegar el formulario completo usando solo Tab y Enter
Por qué importa: Usuarios con movilidad reducida dependen de esto
Cómo lo pruebo: Simulo navegación con page.keyboard.press('Tab') y verifico que el foco se mueva correctamente


Visual Tests — "¿El CSS cambió algo sin querer?"
Screenshot de homepage (VIS001)

Qué prueba: La página se ve idéntica a la versión aprobada
Por qué importa: Un cambio en un archivo CSS puede romper el layout en toda la app
Cómo lo pruebo:

typescript  await expect(page).toHaveScreenshot('homepage.png');

Si hay diferencias, Playwright genera un diff visual automáticamente


Decisiones técnicas que aprendí debuggeando
Por qué Page Object Model en lugar de tests lineales
❌ ANTES (test lineal):
typescripttest('login', async ({ page }) => {
  await page.goto('/');
  await page.fill('#username', 'admin');
  await page.fill('#password', '1234');
  await page.click('#login-btn');
  await expect(page.locator('.welcome')).toBeVisible();
});
✅ DESPUÉS (Page Object):
typescripttest('login', async ({ page }) => {
  const loginPage = new LoginPage(page);
  await loginPage.login('admin', '1234');
  await expect(loginPage.welcomeMessage).toBeVisible();
});
Ventaja: Si el selector de #username cambia, lo modifico en UN solo lugar (LoginPage) en lugar de en 15 tests diferentes.

Por qué fixtures personalizadas en lugar de @BeforeEach
Playwright permite crear fixtures reutilizables que se inyectan automáticamente:
typescript// fixtures.ts
export const test = base.extend({
  authenticatedPage: async ({ page }, use) => {
    await page.goto('/login');
    await page.fill('#username', 'admin');
    await page.fill('#password', '1234');
    await page.click('#login-btn');
    await use(page);
  },
});
Ventaja: Los tests que necesitan login usan authenticatedPage, los que no, usan page normal. Sin lógica condicional en @BeforeEach.

Por qué separé los snapshots en una carpeta dedicada
Los snapshots visuales generan archivos .png por cada test. Si los dejo en la raíz, el repo crece a 50MB en una semana.
Solución: Configuré Playwright para guardar snapshots en tests/visual/snapshots/ y lo agregué al .gitignore EXCEPTO los snapshots base (los "golden images" aprobadas).

Por qué retries: 2 solo en CI, no en local
typescript// playwright.config.ts
retries: process.env.CI ? 2 : 0
Razón: En CI, un test puede fallar por latencia de red temporal. En local, si falla es porque algo está mal y quiero verlo inmediatamente, no después de 3 intentos.

Cómo ejecutar
Requisitos

Node.js 18+
npm o pnpm

Instalación
bashgit clone https://github.com/ipanaque94/playwright-professional-framework.git
cd playwright-professional-framework
npm install
npx playwright install  # Descarga navegadores
Ejecución
bash# Todos los tests
npx playwright test

# Solo UI tests
npx playwright test --project=ui-tests

# Solo tests de seguridad
npx playwright test --project=security-tests

# Modo headed (ver el navegador)
npx playwright test --headed

# Modo debug (pausa en cada step)
npx playwright test --debug

# Ver reporte HTML
npx playwright show-report

Pipeline CI/CD (Jenkins + Docker)
Problema que resuelve: Quería que los tests correran en un entorno limpio, idéntico en cada ejecución, sin depender de "funciona en mi máquina".
Arquitectura
Docker Container (Ubuntu 24)
  ├── Jenkins (puerto 9090)
  ├── Node.js 18
  ├── Playwright + Navegadores Chromium
  └── Workspace: /var/jenkins_home/workspace/playwright-pipeline
Jenkinsfile
El pipeline tiene 5 stages:

Checkout: Clona el repo
Install Dependencies: npm ci (más rápido que npm install)
Run Tests: npx playwright test --project=$PROJECT
Generate Report: Convierte resultados JUnit a HTML
Publish: Sube reporte como artifact

Parámetro dinámico: El Jenkinsfile acepta un parámetro PROJECT que permite ejecutar cualquier proyecto sin cambiar código:
groovyparameters {
  choice(name: 'PROJECT', choices: ['all', 'ui-tests', 'e2e-tests', 'security-tests'])
}

Stack
HerramientaVersiónUsoPlaywright1.49.0Framework de testing E2E con soporte nativo para múltiples navegadoresTypeScript5.xTipado estático para detectar errores antes de ejecutarNode.js18+Runtime de JavaScriptJenkins2.xAutomatización de CI/CDDocker24.xContenedores para entorno reproducibleAllure2.xReportes con trazabilidad y categorizaciónaxe-core4.xAuditoría de accesibilidad

Estructura del proyecto
playwright-professional-framework/
├── tests/
│   ├── ui/              # Pruebas funcionales de interfaz
│   ├── api/             # Pruebas de endpoints REST
│   ├── e2e/             # Flujos completos de usuario
│   ├── integration/     # Comunicación entre componentes
│   ├── contract/        # Validación de estructura de datos
│   ├── performance/     # Tiempos de carga
│   ├── security/        # Inputs maliciosos
│   ├── accessibility/   # Cumplimiento WCAG
│   └── visual/          # Regresión visual
├── pages/               # Page Objects
├── fixtures/            # Configuración reutilizable
├── playwright.config.ts # Configuración de Playwright
├── Jenkinsfile          # Pipeline CI/CD
└── Dockerfile           # Imagen para Jenkins + Playwright

Autor
Enoc Ipanaque — Lima, Perú
QA Automation Engineer en formación
Este proyecto lo construí mientras estudiaba Playwright desde cero y aplicaba conceptos del ISTQB Foundation Level. No es un proyecto perfecto, pero refleja cómo pienso como QA: organizado, documentado, y preparado para escalar.
🔗 LinkedIn · GitHub
