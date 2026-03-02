pipeline {
    agent any
    
    parameters {
        choice(
            name: 'BROWSER',
            choices: [
                'ui-tests',
                'api-tests',
                'e2e-tests',
                'integration-tests',
                'contract-tests',
                'performance-tests',
                'security-tests',
                'accessibility-tests',
                'visual-tests',
                'all'
            ],
            description: 'Selecciona el proyecto de Playwright'
        )
        choice(
            name: 'TEST_SUITE',
            choices: ['all', 'ui', 'api', 'e2e', 'integration', 'contract', 'performance', 'security', 'accessibility', 'visual'],
            description: 'Selecciona la suite de tests'
        )
        booleanParam(name: 'HEADED', defaultValue: false, description: 'Ejecutar con interfaz gráfica')
        booleanParam(name: 'UPDATE_SNAPSHOTS', defaultValue: false, description: 'Actualizar screenshots base')
    }

    stages {
        stage('Checkout') {
            steps {
                echo '=== Clonando repositorio ==='
                git branch: 'main', url: 'https://github.com/ipanaque94/playwright-professional-framework.git'
            }
        }
        
        stage('Install') {
            steps {
                echo '=== Instalando dependencias ==='
                bat '''
                    npm install
                    npx playwright install --with-deps
                '''
            }
        }
        
        stage('Test') {
            steps {
                echo '=== Ejecutando tests ==='
                script {
                    def testCommand = buildTestCommand(
                        params.TEST_SUITE,
                        params.BROWSER,
                        params.HEADED,
                        params.UPDATE_SNAPSHOTS
                    )
                    
                    echo "Comando: ${testCommand}"
                    
                    bat(script: testCommand, returnStatus: true)
                }
            }
        }
        
        stage('Report') {
            steps {
                echo '=== Publicando reportes ==='
                publishHTML([
                    allowMissing: true,
                    alwaysLinkToLastBuild: true,
                    keepAll: true,
                    reportDir: 'reports/html-report',
                    reportFiles: 'index.html',
                    reportName: 'Test Report'
                ])
            }
        }
    }
    
    post {
        always {
            echo 'Pipeline terminado'
        }
        success {
            echo '✅ Pipeline exitoso'
        }
        failure {
            echo '❌ Pipeline falló'
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