pipeline {
    agent any
    
    parameters {
        choice(name: 'BROWSER', choices: ['chromium-ui', 'firefox-ui', 'webkit-ui', 'all'], description: 'Navegador')
        choice(name: 'TEST_SUITE', choices: ['all', 'ui', 'api', 'e2e'], description: 'Suite de tests')
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
                    npm ci
                    npx playwright install --with-deps
                '''
            }
        }
        
        stage('Test') {
            steps {
                echo '=== Ejecutando tests ==='
                script {
                    def testCommand = 'npx playwright test'
                    
                    if (params.TEST_SUITE != 'all') {
                        testCommand += " tests/${params.TEST_SUITE}/"
                    }
                    
                    if (params.BROWSER != 'all') {
                        testCommand += " --project=${params.BROWSER}"
                    }
                    
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