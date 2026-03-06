pipeline {
    agent any
    
    environment {
        // Variables de entorno
        NODE_ENV = 'test'
        CI = 'true'
        PLAYWRIGHT_BROWSERS_PATH = '/var/jenkins_home/.cache/ms-playwright'
        FORCE_COLOR = '1'
        
        // Configuración de reportes
        REPORT_DIR = 'reports'
        SCREENSHOTS_DIR = 'screenshots'
        VIDEOS_DIR = 'videos'
        TRACES_DIR = 'traces'
    }
    
    parameters {
        choice(
            name: 'TEST_PROJECT',
            choices: [
                'all',
                'ui-tests',
                'api-tests',
                'e2e-tests',
                'integration-tests',
                'contract-tests',
                'performance-tests',
                'security-tests',
                'accessibility-tests'
            ],
            description: '🎯 Selecciona el proyecto de tests a ejecutar'
        )
        
        choice(
            name: 'BROWSER',
            choices: ['chromium', 'firefox', 'webkit', 'all'],
            description: '🌐 Selecciona el navegador'
        )
        
        choice(
            name: 'TEST_SUITE',
            choices: ['all', 'ui', 'api', 'e2e', 'integration', 'contract', 'performance', 'security', 'accessibility'],
            description: '📦 Selecciona la suite de tests'
        )
        
        booleanParam(
            name: 'HEADED',
            defaultValue: false,
            description: '👁️ Ejecutar tests con interfaz gráfica (solo para debug)'
        )
        
        booleanParam(
            name: 'UPDATE_SNAPSHOTS',
            defaultValue: false,
            description: '📸 Actualizar screenshots base'
        )
        
        booleanParam(
            name: 'GENERATE_TRACE',
            defaultValue: true,
            description: '🔍 Generar traces para análisis de fallos'
        )
        
        choice(
            name: 'WORKERS',
            choices: ['1', '2', '4', '6', 'auto'],
            description: '⚡ Número de workers paralelos'
        )
        
        choice(
            name: 'RETRIES',
            choices: ['0', '1', '2', '3'],
            description: '🔄 Reintentos en caso de fallo'
        )
    }

    options {
        // Mantener últimos 30 builds
        buildDiscarder(logRotator(numToKeepStr: '30', artifactNumToKeepStr: '30'))
        
        // Timeout global del pipeline
        timeout(time: 1, unit: 'HOURS')
        
        // No permitir builds concurrentes
        disableConcurrentBuilds()
        
        // Timestamps en console output
        timestamps()
        
    }

    stages {
        stage('🔍 Pre-Build Checks') {
            steps {
                script {
                    
                    echo '   PRE-BUILD CHECKS'
                    
                    
                    sh '''
                        echo "📋 Información del Sistema:"
                        echo "  - Node: $(node --version)"
                        echo "  - NPM: $(npm --version)"
                        echo "  - Playwright: $(npx playwright --version)"
                        echo "  - Workspace: ${WORKSPACE}"
                        echo ""
                        echo "⚙️  Parámetros del Build:"
                        echo "  - Proyecto: ${TEST_PROJECT}"
                        echo "  - Navegador: ${BROWSER}"
                        echo "  - Suite: ${TEST_SUITE}"
                        echo "  - Workers: ${WORKERS}"
                        echo "  - Retries: ${RETRIES}"
                        echo "  - Headed: ${HEADED}"
                        echo "  - Update Snapshots: ${UPDATE_SNAPSHOTS}"
                        echo "  - Generate Trace: ${GENERATE_TRACE}"
                    '''
                }
            }
        }
        
        stage('📥 Checkout') {
            steps {
                script {
                
                    echo '   CHECKOUT CODE'
                    
                }
                
                checkout scm
                
                sh '''
                    echo "✅ Código descargado"
                    echo "📂 Branch: $(git branch --show-current)"
                    echo "🔖 Commit: $(git rev-parse --short HEAD)"
                    echo "👤 Autor: $(git log -1 --pretty=format:'%an')"
                    echo "📝 Mensaje: $(git log -1 --pretty=format:'%s')"
                '''
            }
        }
        
        stage('🧹 Clean') {
            steps {
                script {
                    
                    echo '   CLEANING OLD ARTIFACTS'
                    
                }
                
                sh '''
                    echo "🗑️  Eliminando archivos antiguos..."
                    rm -rf node_modules
                    rm -rf test-results
                    rm -rf playwright-report
                    rm -rf reports
                    rm -rf screenshots
                    rm -rf videos
                    rm -rf traces
                    echo "✅ Limpieza completada"
                '''
            }
        }
        
        stage('📦 Install Dependencies') {
            steps {
                script {
                    
                    echo '   INSTALLING DEPENDENCIES'
                    
                }
                
                sh '''
                    echo "📥 Instalando dependencias de Node..."
                    npm ci --quiet
                    echo "✅ Dependencias instaladas"
                    
                    echo ""
                    echo "📊 Resumen de dependencias:"
                    npm list --depth=0 || true
                '''
            }
        }
        
        stage('🎭 Install Playwright Browsers') {
            steps {
                script {
                    
                    echo '   INSTALLING PLAYWRIGHT BROWSERS'
                    
                }
                
                sh '''
                    echo "🌐 Instalando navegadores de Playwright..."
                    
                    echo ""
                    echo "📂 Verificando ubicación de navegadores:"
            
                    # Verificar si playwright está instalado globalmente
                    which playwright || echo "Playwright instalado localmente"
            
                    # Verificar navegadores
                    npx playwright --version
            
                    echo ""
                    echo "✅ Verificación completada"
                '''
            }
        }
        
        stage('🔍 Code Quality') {
            parallel {
                stage('ESLint') {
                    steps {
                        script {
                            echo '🔍 Ejecutando ESLint...'
                            sh 'npm run lint || true'
                        }
                    }
                }
                
                stage('Type Check') {
                    steps {
                        script {
                            echo '📝 Verificando tipos TypeScript...'
                            sh 'npx tsc --noEmit || true'
                        }
                    }
                }
            }
        }
        
        stage('🧪 Run Tests') {
            steps {
                script {
                    
                    echo '   RUNNING TESTS'
                   
                    
                    def testCommand = buildTestCommand(
                        params.TEST_SUITE,
                        params.TEST_PROJECT,
                        params.BROWSER,
                        params.HEADED,
                        params.UPDATE_SNAPSHOTS,
                        params.GENERATE_TRACE,
                        params.WORKERS,
                        params.RETRIES
                    )
                    
                    echo "🚀 Comando a ejecutar:"
                    echo "   ${testCommand}"
                    echo ""
                    
                    def testResult = sh(script: testCommand, returnStatus: true)
                    
                    echo ""
                    echo "📊 Resultado de los tests:"
                    if (testResult == 0) {
                        echo "   ✅ Todos los tests pasaron"
                        currentBuild.result = 'SUCCESS'
                    } else {
                        echo "   ⚠️  Algunos tests fallaron (Exit code: ${testResult})"
                        currentBuild.result = 'UNSTABLE'
                    }
                }
            }
        }
        
        stage('📊 Generate Reports') {
            steps {
                script {
                    
                    echo '   GENERATING REPORTS'
                    
                }
                
                sh '''
                    echo "📈 Generando reportes HTML..."
                    
                    # Verificar si existen resultados
                    if [ -d "test-results" ]; then
                        echo "✅ Test results encontrados"
                        ls -lh test-results/ | head -n 20
                    else
                        echo "⚠️  No se encontraron test results"
                    fi
                    
                    # Generar reporte HTML si no existe
                    if [ ! -d "reports/html-report" ]; then
                        npx playwright show-report reports/html-report --host 0.0.0.0 > /dev/null 2>&1 &
                        sleep 2
                        pkill -f "playwright show-report" || true
                    fi
                    
                    echo "✅ Reportes generados"
                '''
            }
        }
        
        stage('📤 Publish Results') {
            parallel {
                stage('HTML Report') {
                    steps {
                        script {
                            echo '📊 Publicando reporte HTML...'
                            publishHTML([
                                allowMissing: true,
                                alwaysLinkToLastBuild: true,
                                keepAll: true,
                                reportDir: 'reports/html-report',
                                reportFiles: 'index.html',
                                reportName: '📊 Playwright Test Report',
                                reportTitles: 'Test Results'
                            ])
                        }
                    }
                }
                
                stage('JUnit Report') {
                    steps {
                        script {
                            echo '📋 Publicando reporte JUnit...'
                            junit(
                                testResults: 'reports/junit.xml',
                                allowEmptyResults: true,
                                skipPublishingChecks: false
                            )
                        }
                    }
                }
                
                stage('Archive Artifacts') {
                    steps {
                        script {
                            echo '📦 Archivando artefactos...'
                            archiveArtifacts(
                                artifacts: '''
                                    test-results/**/*,
                                    reports/**/*,
                                    screenshots/**/*.png,
                                    videos/**/*.webm,
                                    traces/**/*.zip
                                ''',
                                allowEmptyArchive: true,
                                fingerprint: true,
                                onlyIfSuccessful: false
                            )
                        }
                    }
                }
            }
        }
        
        stage('📈 Test Metrics') {
            steps {
                script {
                    
                    echo '   TEST METRICS'
                    
                    
                    sh '''
                        echo "📊 Generando métricas de tests..."
                        
                        # Contar tests
                        TOTAL_TESTS=$(find test-results -name "*.xml" 2>/dev/null | wc -l)
                        FAILED_TESTS=$(find test-results -name "*-failed-*" 2>/dev/null | wc -l)
                        
                        echo ""
                        echo "📈 Resumen de Ejecución:"
                        echo "  - Total de archivos de resultado: ${TOTAL_TESTS}"
                        echo "  - Tests fallidos: ${FAILED_TESTS}"
                        
                        # Screenshots
                        if [ -d "screenshots" ]; then
                            SCREENSHOT_COUNT=$(find screenshots -name "*.png" 2>/dev/null | wc -l)
                            echo "  - Screenshots capturados: ${SCREENSHOT_COUNT}"
                        fi
                        
                        # Videos
                        if [ -d "videos" ]; then
                            VIDEO_COUNT=$(find videos -name "*.webm" 2>/dev/null | wc -l)
                            echo "  - Videos grabados: ${VIDEO_COUNT}"
                        fi
                        
                        # Traces
                        if [ -d "traces" ]; then
                            TRACE_COUNT=$(find traces -name "*.zip" 2>/dev/null | wc -l)
                            echo "  - Traces generados: ${TRACE_COUNT}"
                        fi
                        
                        echo ""
                        echo "💾 Uso de espacio:"
                        du -sh test-results reports screenshots videos traces 2>/dev/null || echo "  - No hay datos disponibles"
                    '''
                }
            }
        }
    }
    
    post {
        always {
            script {
                
                echo '   PIPELINE COMPLETED'
                
                def duration = currentBuild.durationString.replace(' and counting', '')
                def result = currentBuild.currentResult
                
                echo "⏱️  Duración: ${duration}"
                echo "📊 Resultado: ${result}"
                echo "🔗 Build URL: ${env.BUILD_URL}"
                
                if (result == 'SUCCESS') {
                    echo '✅ PIPELINE EXITOSO'
                } else if (result == 'UNSTABLE') {
                    echo '⚠️  PIPELINE INESTABLE (algunos tests fallaron)'
                } else if (result == 'FAILURE') {
                    echo '❌ PIPELINE FALLÓ'
                } else {
                    echo "ℹ️  Estado: ${result}"
                }
                
                echo 'ENOC'
            }
        }
        
        success {
            script {
                echo '🎉 ¡Todos los tests pasaron exitosamente!'
                
                // Notificación opcional (descomentar si usas Slack/Email)
                // slackSend(color: 'good', message: "✅ Tests pasaron: ${env.JOB_NAME} #${env.BUILD_NUMBER}")
            }
        }
        
        unstable {
            script {
                echo '⚠️  Algunos tests fallaron, revisa el reporte'
                
                // Notificación opcional
                // slackSend(color: 'warning', message: "⚠️  Tests inestables: ${env.JOB_NAME} #${env.BUILD_NUMBER}")
            }
        }
        
        failure {
            script {
                echo '❌ El pipeline falló completamente'
                
                sh '''
                    echo ""
                    echo "🔍 Información de debug:"
                    echo "  - Workspace: ${WORKSPACE}"
                    echo "  - Build Number: ${BUILD_NUMBER}"
                    echo "  - Node User: $(whoami)"
                    echo ""
                    echo "📂 Contenido del workspace:"
                    ls -lah ${WORKSPACE} | head -n 20
                '''
                
                // Notificación opcional
                // slackSend(color: 'danger', message: "❌ Pipeline falló: ${env.JOB_NAME} #${env.BUILD_NUMBER}")
            }
        }
        
        cleanup {
            script {
                echo '🧹 Limpiando workspace temporal...'
                
                sh '''
                    # Mantener solo lo necesario
                    echo "💾 Preservando reportes y artefactos importantes"
                    
                    # Opcional: Limpiar node_modules para ahorrar espacio
                    # rm -rf node_modules
                    
                    echo "✅ Limpieza completada"
                '''
            }
        }
    }
}


// FUNCIONES AUXILIARES


def buildTestCommand(testSuite, testProject, browser, headed, updateSnapshots, generateTrace, workers, retries) {
    def command = 'npx playwright test'

    if (testSuite != 'all') {
        command += " tests/${testSuite}/"
    }

    if (testProject != 'all') {
        command += " --project=${testProject}"
    }

    if (workers != 'auto') {
        command += " --workers=${workers}"
    }

    if (retries != '0') {
        command += " --retries=${retries}"
    }

    if (headed == true) {
        command += ' --headed'
    }

    if (updateSnapshots == true) {
        command += ' --update-snapshots'
    }

    if (generateTrace == true) {
        command += ' --trace=retain-on-failure'
    }

    command += ' --reporter=html,junit,list'

    return command
}