# Playwright E2E Testing Framework

> Proyecto personal de automatización UI construido desde cero para aprender
> cómo un QA organiza pruebas en un entorno real. Implementa Page Object Model,
> 9 tipos de prueba organizados por propósito, y pipeline CI/CD con Jenkins + Docker.

---

## ¿Por qué construí esto?

Cuando terminé mi proyecto de API Testing con RestAssured me quedé con una pregunta
sin responder: ¿cómo se prueban las interfaces de usuario de la misma forma en que
se prueban las APIs — con organización, propósito claro y sin depender de "funciona
en mi máquina"?

La mayoría de tutoriales de Playwright muestran un test de login y ya. Nadie explica
qué pasa cuando tienes 50 tests, varios flujos y un equipo que necesita entender qué
prueba cada test y por qué.

Así que me propuse construir una Suite de puebas atomatizadas con la estructura que tendría en una empresa
real: Page Objects para separar la lógica de navegación de los tests, fixtures para
reutilizar el estado de autenticación, 9 tipos de prueba con propósito distinto cada
uno, y un pipeline en Jenkins + Docker que corre en un entorno limpio en cada ejecución.

El proceso no fue limpio. Hubo tests que pasaban en local y fallaban en CI por latencia
de red. Snapshots visuales que generaban archivos de 50MB si no los organizabas bien.
El `retries: 2` que aprendí a activar solo en CI porque en local necesitas ver el fallo
de inmediato, no después de 3 reintentos. Cada uno de esos problemas me enseñó algo
que no aparece en la documentación oficial.

---

## Sistema bajo prueba

Un sandbox de Automation Practice con formularios dinámicos, tablas, popups nativos
del navegador, drag & drop y elementos que cambian de estado. Lo elegí porque tiene
exactamente los escenarios que un QA enfrenta en aplicaciones web reales — sin la
complejidad de un sistema de negocio que distrae del aprendizaje.

---

## ¿Por qué 9 tipos de prueba y no solo "tests"?

Esta fue la decisión de diseño más importante del proyecto. En empresas reales,
diferentes tipos de prueba tienen diferentes propósitos, diferentes owners y se
ejecutan en momentos distintos del pipeline. Mezclarlos en una sola carpeta hace
imposible saber qué falló y por qué.

| Proyecto | Propósito | Cuándo corre |
|---|---|---|
| `ui-tests` | Funcionalidad de interfaz  | Cada commit |
| `api-tests` | Validación de endpoints REST — independiente de la UI | Cada commit |
| `e2e-tests` | Flujos completos de usuario de punta a punta | Antes de cada deploy |
| `integration-tests` | Comunicación entre componentes de la misma página | Cada commit |
| `contract-tests` | Estructura de datos — si cambia una columna, falla aquí | Cada commit |
| `performance-tests` | Tiempos de carga y render | Diario o antes de releases |
| `security-tests` | Inputs maliciosos: SQL injection, XSS | Antes de cada deploy |
| `accessibility-tests` | Cumplimiento WCAG — requerido por ley en muchos países | Semanal |
| `visual-tests` | Regresión visual con screenshots | Antes de releases de UI |

---

## Análisis de casos de prueba

### UI Tests — "¿La interfaz funciona como debería?"

**Login exitoso (UI001)**
El primer test que escribí y el más importante. Si el login falla, todo lo demás
es irrelevante. Verifico dos cosas: que aparezca el mensaje de bienvenida Y que
la URL cambie a `/dashboard` — porque un sistema mal implementado podría mostrar
el mensaje sin redirigir, o redirigir sin mostrar el mensaje.

**Formulario dinámico (UI002)**
Prueba el flujo principal de la app: llenar 3 campos → Submit → verificar que los
datos exactos que ingresé aparezcan en la tabla. La trampa aquí es que muchos QAs
solo verifican que "aparezca algo" en la tabla — yo verifico que los datos sean
exactamente los que ingresé, en el orden correcto.

**Manejo de popups (UI003)**
Los alerts nativos del navegador son un caso especial en Playwright — a diferencia
de Selenium, necesitas escuchar el evento `dialog` antes de que aparezca. Si lo
haces después, el test falla o se bloquea indefinidamente. Este test me enseñó
a entender el modelo de eventos asíncrono de Playwright.

---

### E2E Tests — "¿El flujo completo funciona de principio a fin?"

**Ciclo completo: Login → Acción → Verificación → Logout (E2E001)**
El happy path que simula a un usuario real. Lo estructuré en 5 pasos explícitos
para que cualquier persona —técnica o no— pueda leerlo y entender qué hace:

1. Login con credenciales válidas
2. Navegar al formulario
3. Agregar 2 registros con datos distintos
4. Verificar que ambos aparezcan en la tabla
5. Logout y verificar que las páginas protegidas ya no sean accesibles

El paso 5 es el que la mayoría omite. Un logout que no invalida la sesión es
un bug de seguridad real.

---

### Contract Tests — "¿La estructura de datos cambió sin avisarnos?"

Este es el tipo de test menos obvio cuando empiezas en QA y uno de los más valiosos.

```typescript
const headers = await page.locator('table thead th').allTextContents();
expect(headers).toEqual(['Nombre', 'Apellido', 'Email', 'Acciones']);
```

Si un developer agrega una columna nueva o cambia el orden, este test falla
antes de que llegue a producción. Los tests funcionales probablemente seguirían
pasando — la tabla "funciona", solo tiene una columna extra inesperada.

---

### Security Tests — "¿El sistema rechaza inputs maliciosos?"

No soy especialista en seguridad, pero cubro lo básico que cualquier QA debería
verificar según OWASP:

**SQL Injection (SEC001):** Ingreso `' OR '1'='1` en los campos del formulario
y verifico que aparezca como texto plano en la tabla, no como un resultado de
consulta SQL ejecutada.

**XSS (SEC002):** Ingreso `<script>alert('XSS')</script>` y verifico que aparezca
escapado — que el navegador no ejecute el script. Si el alert aparece, hay
una vulnerabilidad XSS real.

La diferencia entre un test de seguridad básico y uno ausente es enorme.
La mayoría de brechas de seguridad en aplicaciones web no son ataques sofisticados
— son vulnerabilidades básicas que nunca se probaron.

---

### Accessibility Tests — "¿Usuarios con discapacidad pueden usar la app?"

Uso `axe-core` para escanear violaciones WCAG automáticamente:

```typescript
const results = await new AxeBuilder({ page }).analyze();
expect(results.violations).toHaveLength(0);
```

También pruebo navegación por teclado con `page.keyboard.press('Tab')` —
verifico que el foco se mueva en orden lógico por todos los campos.

En muchos países esto no es opcional — la WCAG es un requisito legal para
sitios del sector público y financiero.

---

### Visual Tests — "¿El CSS cambió algo sin querer?"

```typescript
await expect(page).toHaveScreenshot('homepage.png');
```

Si hay diferencias con la imagen base aprobada, Playwright genera un diff
visual automáticamente con las áreas resaltadas. Esto detecta cuando un
cambio en un archivo CSS rompe el layout en una página que nadie pensó probar.

Los snapshots base están en el repo. Los generados en cada test están en
`.gitignore` — si los subieras todos, el repo crecería a 50MB en una semana.

---

## Decisiones técnicas

**Page Object Model en lugar de tests lineales**

Sin POM, cada vez que el selector de un input cambia hay que buscarlo en
todos los tests que lo usan. Con POM, se modifica en un solo lugar — la
clase `LoginPage` o `FormPage` — y todos los tests se actualizan automáticamente.

**Fixtures personalizadas para autenticación**

Playwright permite crear fixtures que se inyectan en los tests:

```typescript
export const test = base.extend({
  authenticatedPage: async ({ page }, use) => {
    await page.goto('/login');
    await page.fill('#username', 'admin');
    await page.fill('#password', '1234');
    await page.click('#login-btn');
    await use(page);
  },
});
```

Los tests que necesitan sesión iniciada usan `authenticatedPage`.
Los que no, usan `page`. Sin lógica condicional en `@BeforeEach`.

**`retries: 2` solo en CI**

```typescript
retries: process.env.CI ? 2 : 0
```

En CI, un test puede fallar por latencia de red temporal — el retry lo
resuelve sin intervención humana. En local, quiero ver el fallo inmediatamente
en el primer intento, no después de 3.

**Jenkins + Docker en lugar de solo GitHub Actions**

GitHub Actions es más simple y es lo que usaría en un proyecto nuevo.
Elegí Jenkins + Docker aquí deliberadamente para aprender cómo funciona
el entorno CI/CD que todavía usan muchas empresas con infraestructura propia.
El `Dockerfile` garantiza que el entorno de Node.js, Playwright y los
navegadores sea idéntico en cada ejecución — sin el clásico "funciona
en mi máquina".

---

## Cómo ejecutar

**Requisitos:** Node.js 18+

```bash
git clone https://github.com/ipanaque94/playwright-professional-framework.git
cd playwright-professional-framework
npm install
npx playwright install
```

```bash
# Todos los tests
npx playwright test

# Proyecto específico
npx playwright test --project=ui-tests
npx playwright test --project=security-tests
npx playwright test --project=accessibility-tests
npx playwright test --project=visual-tests

# Ver el navegador mientras corre
npx playwright test --headed

# Pausar en cada paso para debuggear
npx playwright test --debug

# Ver reporte HTML
npx playwright show-report
```

---

## Stack

| Herramienta | Versión | Uso |
|---|---|---|
| Playwright | 1.49.0 | Framework de testing E2E con soporte multi-browser |
| TypeScript | 5.x | Tipado estático para detectar errores antes de ejecutar |
| Node.js | 18+ | Runtime |
| axe-core | 4.x | Auditoría de accesibilidad WCAG |
| Allure | 2.x | Reportes con trazabilidad y categorización |
| Jenkins | 2.x | CI/CD con pipeline declarativo |
| Docker | 24.x | Entorno reproducible e independiente del SO |

---

## Qué aprendí

El `retries: 0` en local es intencional — no quieres que los tests se
reintenten y oculten fallas reales mientras desarrollas.

Los snapshots visuales necesitan generarse en el mismo SO en el que se
van a comparar. Un snapshot generado en macOS fallará en el runner Linux
de CI aunque la página se vea idéntica visualmente.

Playwright recomienda no mezclar `page.waitForTimeout()` con aserciones —
hace los tests frágiles. La forma correcta es usar `expect(locator).toBeVisible()`
que espera automáticamente hasta el timeout configurado.

La diferencia entre `page.click()` y `page.locator().click()` no es solo
sintaxis — `locator` es más robusto porque espera a que el elemento sea
interactable antes de hacer click.

---

## Autor

**Enoc Ipanaque** — Lima, Perú

QA Automation Engineer en formación. Estudio en paralelo para la certificación
ISTQB Foundation Level. Este proyecto y el de
[RestAssured API Testing](https://github.com/ipanaque94/RestAssured3APIS)
son mi portafolio práctico de lo aprendido.

[LinkedIn](www.linkedin.com/in/enoc-isaac-ipanaque-rodas-b3729a283) · [GitHub](https://github.com/ipanaque94)
