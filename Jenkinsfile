pipeline {
    agent any

    parameters {
        string(name: 'BRANCH', defaultValue: 'main', description: 'Branch a desplegar')
        string(name: 'DB_PASS', defaultValue: '', description: 'Contraseña de MariaDB')
    }

    environment {
        DOCKER_IMAGE = 'market-admin'
        DOCKER_TAG = "${BUILD_NUMBER}"
    }

    stages {
        stage('Checkout') {
            steps {
                checkout scm: [
                    $class: 'GitSCM',
                    branches: [[name: "${params.BRANCH}"]],
                    userRemoteConfigs: [[url: 'https://github.com/caroandres356-eng/Administrador-de-Compras-de-Mercado.git']]
                ]
            }
        }

        stage('Build') {
            steps {
                dir('backend') {
                    sh 'mvn clean package -DskipTests=true'
                }
            }
        }

        stage('Test') {
            steps {
                dir('backend') {
                    sh 'mvn test -DDB_PASS=${DB_PASS}'
                }
            }
        }

        stage('Docker Build') {
            steps {
                sh 'docker build -t ${DOCKER_IMAGE}:${DOCKER_TAG} ./backend'
                sh 'docker tag ${DOCKER_IMAGE}:${DOCKER_TAG} ${DOCKER_IMAGE}:latest'
            }
        }

        stage('Docker Compose Up') {
            steps {
                sh 'DB_PASS=${DB_PASS} docker compose down -v || true'
                sh 'DB_PASS=${DB_PASS} docker compose up -d'
            }
        }
    }

    post {
        success {
            echo "Pipeline ejecutado exitosamente — ${DOCKER_IMAGE}:${DOCKER_TAG}"
        }
        failure {
            echo 'Pipeline falló. Revisar los logs.'
        }
        always {
            cleanWs()
        }
    }
}
