pipeline {
    agent any
    
    // Variables de entorno
    environment {
        NODE_VERSION = '18'
        TEST_ENV = 'QA'
        PLAYWRIGHT_BROWSERS_PATH = "${WORKSPACE}/ms-playwright"
    }
    
    // Parámetros configurables
    parameters {
        choice(
            name: 'BROWSER',
            choices: ['chromium-ui', 'firefox-ui', 'webkit-ui', 'api-tests', 'all'],
            description: 'Selecciona el navegador o tipo de test'
        )
        choice(
            name: 'TEST_SUITE',
            choices: ['all', 'ui', 'api', 'e2e', 'integration', 'contract', 'performance', 'security', 'accessibility', 'visual'],
            description: 'Selecciona la suite de tests'
        )
        booleanParam(
            name: 'HEADED',
            defaultValue: false,
            description: 'Ejecutar tests con interfaz gráfica'
        )
        booleanParam(
            name: 'UPDATE_SNAPSHOTS',
            defaultValue: false,
            description: 'Actualizar screenshots base'
        )
    }
    
    // Triggers automáticos
    triggers {
        // Ejecutar diariamente a las 2 AM
        cron('0 2 * * *')
        
        // Ejecutar en cada push (requiere GitHub webhook)
        githubPush()
    }
    
    stages {
        stage('🔍 Checkout') {
            steps {
                echo '=== Obteniendo código ==='
                checkout scm
            }
        }
        
        stage('📦 Install Dependencies') {
            steps {
                echo '=== Instalando dependencias de Node.js ==='
                sh '''
                    node --version
                    npm --version
                    npm ci
                '''
            }
        }
        
        stage('🎭 Install Playwright') {
            steps {
                echo '=== Instalando navegadores de Playwright ==='
                sh '''
                    npx playwright install --with-deps
                '''
            }
        }
        
        stage('🧪 Run Tests') {
            steps {
                script {
                    echo '=== Ejecutando tests ==='
                    
                    def testCommand = buildTestCommand(
                        params.TEST_SUITE,
                        params.BROWSER,
                        params.HEADED,
                        params.UPDATE_SNAPSHOTS
                    )
                    
                    echo "Comando: ${testCommand}"
                    
                    // Ejecutar tests y capturar resultado
                    def testResult = sh(
                        script: testCommand,
                        returnStatus: true
                    )
                    
                    // Guardar resultado
                    env.TEST_RESULT = testResult
                    
                    if (testResult != 0) {
                        echo '⚠️ Algunos tests fallaron'
                    } else {
                        echo '✅ Todos los tests pasaron'
                    }
                }
            }
        }
        
        stage('📊 Generate Reports') {
            steps {
                echo '=== Generando reportes ==='
                sh '''
                    echo "Reportes generados en reports/"
                    ls -la reports/ || echo "No hay reportes"
                '''
            }
        }
        
        stage('📸 Archive Artifacts') {
            steps {
                echo '=== Archivando artefactos ==='
                
                // Archivar reportes HTML
                publishHTML([
                    allowMissing: false,
                    alwaysLinkToLastBuild: true,
                    keepAll: true,
                    reportDir: 'reports/html-report',
                    reportFiles: 'index.html',
                    reportName: 'Playwright Test Report',
                    reportTitles: 'Test Report'
                ])
                
                // Archivar screenshots y videos (si hay fallos)
                archiveArtifacts(
                    artifacts: 'test-results/**/*,screenshots/**/*',
                    allowEmptyArchive: true,
                    fingerprint: true
                )
            }
        }
        
        stage('📈 Publish Test Results') {
            steps {
                echo '=== Publicando resultados JUnit ==='
                
                // Publicar resultados JUnit
                junit(
                    testResults: 'reports/junit-results.xml',
                    allowEmptyResults: true,
                    skipPublishingChecks: false
                )
            }
        }
    }
    
    post {
        always {
            echo '=== Limpieza post-ejecución ==='
            
            // Limpiar workspace si es necesario
            // cleanWs()
        }
        
        success {
            echo '✅ ¡Pipeline ejecutado exitosamente!'
            
            // Notificación de éxito (opcional)
            script {
                def totalTests = sh(
                    script: 'cat reports/test-results.json | grep -o \'"tests":[0-9]*\' | grep -o \'[0-9]*\' || echo 0',
                    returnStdout: true
                ).trim()
                
                echo "Total de tests ejecutados: ${totalTests}"
            }
        }
        
        failure {
            echo '❌ El pipeline falló'
            
            // Notificación de fallo (opcional)
            script {
                if (env.TEST_RESULT != '0') {
                    echo 'Los tests fallaron. Revisa el reporte HTML.'
                }
            }
        }
        
        unstable {
            echo '⚠️ El pipeline es inestable (algunos tests fallaron)'
        }
    }
}

// ==================== FUNCIONES AUXILIARES ====================

def buildTestCommand(testSuite, browser, headed, updateSnapshots) {
    def command = 'npx playwright test'
    
    // Agregar suite específica
    if (testSuite != 'all') {
        command += " tests/${testSuite}/"
    }
    
    // Agregar proyecto/navegador
    if (browser != 'all') {
        command += " --project=${browser}"
    }
    
    // Modo headed
    if (headed) {
        command += ' --headed'
    }
    
    // Actualizar snapshots
    if (updateSnapshots) {
        command += ' --update-snapshots'
    }
    
    return command
}