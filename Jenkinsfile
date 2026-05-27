pipeline {
    agent any
    stages {
        stage('Checkout') {
            steps {
                git branch: 'feature_julian',
                    url: 'https://github.com/caroandres356-eng/Administrador-de-Compras-de-Mercado.git'
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
                    withEnv(['DB_PASS=Pipesofi2006']) {
                        sh 'mvn test'
                    }
                }
            }
        }
        stage('Docker Build') {
            steps {
                sh 'docker build -t market-admin:latest ./backend'
            }
        }
        stage('Docker Compose Up') {
            steps {
                sh 'docker compose down || true'
                sh 'docker compose up -d'
            }
        }
    }
    post {
        success {
            echo 'Pipeline ejecutado exitosamente'
        }
        failure {
            echo 'Pipeline falló'
        }
    }
}
