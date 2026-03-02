pipeline {
    agent any
    
    environment {
        NODE_VERSION = '18'
        TEST_ENV = 'QA'
        PLAYWRIGHT_BROWSERS_PATH = "${WORKSPACE}\\ms-playwright"
    }

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

    triggers {
        cron('0 2 * * *')
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
                bat '''
                    node --version
                    npm --version
                    npm ci
                '''
            }
        }
        
        stage('🎭 Install Playwright') {
            steps {
                echo '=== Instalando navegadores de Playwright ==='
                bat '''
                    set PLAYWRIGHT_BROWSERS_PATH=${WORKSPACE}\\ms-playwright
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
                    
                    def testResult = bat(
                        script: testCommand,
                        returnStatus: true
                    )
                    
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
                bat '''
                    echo "Reportes generados en reports/"
                    dir reports\\ || echo "No hay reportes"
                '''
            }
        }
        
        stage('📸 Archive Artifacts') {
            steps {
                echo '=== Archivando artefactos ==='
                
                publishHTML([
                    allowMissing: false,
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
            echo '=== Limpieza post-ejecución ==='
        }
        
        success {
            echo '✅ ¡Pipeline ejecutado exitosamente!'
            
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
            echo '⚠️ El pipeline es inestable (algunos tests fallaron)'
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