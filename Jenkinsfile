pipeline {
    agent any

    environment {
        NODE_VERSION = '18'
        TEST_ENV = 'QA'
        PLAYWRIGHT_BROWSERS_PATH = "${WORKSPACE}\\ms-playwright"
    }

    parameters {
        choice(name: 'BROWSER', choices: ['chromium-ui', 'firefox-ui', 'webkit-ui', 'api-tests', 'all'], description: 'Selecciona el navegador o tipo de test')
        choice(name: 'TEST_SUITE', choices: ['all', 'ui', 'api', 'e2e', 'integration', 'contract', 'performance', 'security', 'accessibility', 'visual'], description: 'Selecciona la suite de tests')
        booleanParam(name: 'HEADED', defaultValue: false, description: 'Ejecutar tests con interfaz gráfica')
        booleanParam(name: 'UPDATE_SNAPSHOTS', defaultValue: false, description: 'Actualizar screenshots base')
    }

    triggers {
        cron('0 2 * * *')
        githubPush()
    }

    stages {
        stage('🔍 Checkout') {
            steps {
                echo '=== Clonando repositorio desde GitHub ==='
                checkout scm
            }
        }
        
        stage('📦 Install Dependencies') {
            steps {
                echo '=== Instalando dependencias de Node.js ==='
                bat '''
                    node --version
                    npm --version
                    npm ci
                '''
            }
        }
        
        stage('🎭 Install Playwright Browsers') {
            steps {
                echo '=== Instalando navegadores de Playwright ==='
                bat '''
                    npx playwright install --with-deps
                '''
            }
        }
        
        stage('🧪 Run Non-Visual Tests') {
            steps {
                echo '=== Ejecutando tests (sin visuales) ==='
                bat '''
                    npx playwright test --grep-invert "VIS"
                '''
            }
        }
        
        stage('📸 Generate Visual Snapshots') {
            steps {
                echo '=== Generando snapshots visuales ==='
                bat '''
                    npx playwright test tests/visual/ --update-snapshots
                '''
            }
        }
        
        stage('✅ Run All Tests') {
            steps {
                script {
                    echo '=== Ejecutando suite completa de tests ==='
                    
                    def testCommand = buildTestCommand(
                        params.TEST_SUITE,
                        params.BROWSER,
                        params.HEADED,
                        params.UPDATE_SNAPSHOTS
                    )
                    
                    echo "Comando: ${testCommand}"
                    
                    def testResult = bat(
                        script: testCommand,
                        returnStatus: true
                    )
                    
                    env.TEST_RESULT = testResult
                    
                    if (testResult != 0) {
                        echo '⚠️ Algunos tests fallaron'
                        unstable(message: "Tests fallaron")
                    } else {
                        echo '✅ Todos los tests pasaron'
                    }
                }
            }
        }
        
        stage('📊 Generate Reports') {
            steps {
                echo '=== Generando reportes HTML ==='
                bat '''
                    if exist reports\\html-report (echo Reporte HTML generado) else (echo No se generó reporte)
                '''
            }
        }
        
        stage('📸 Archive Artifacts') {
            steps {
                echo '=== Archivando artefactos ==='
                
                publishHTML([
                    allowMissing: true,
                    alwaysLinkToLastBuild: true,
                    keepAll: true,
                    reportDir: 'reports/html-report',
                    reportFiles: 'index.html',
                    reportName: 'Playwright Test Report',
                    reportTitles: 'Test Report'
                ])
                
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
            echo '=== Pipeline terminado ==='
        }
        
        success {
            echo '✅ Pipeline completado con éxito!'
            script {
                echo "Tests completados en: ${currentBuild.durationString}"
            }
        }
        
        failure {
            echo '❌ El pipeline falló'
            script {
                if (env.TEST_RESULT != '0') {
                    echo 'Los tests fallaron. Revisa el reporte HTML.'
                }
            }
        }
        
        unstable {
            echo '⚠️ Pipeline inestable - algunos tests fallaron'
        }
    }
}

def buildTestCommand(testSuite, browser, headed, updateSnapshots) {
    def command = 'npx playwright test'
    
    if (testSuite != 'all') {
        command += " tests/${testSuite}/"
    }

    if (browser != 'all') {
        command += " --project=${browser}"
    }

    if (headed) {
        command += ' --headed'
    }

    if (updateSnapshots) {
        command += ' --update-snapshots'
    }

    return command
}