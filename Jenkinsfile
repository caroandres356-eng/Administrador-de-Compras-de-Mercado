pipeline {
    agent any
    stages {
        stage('Build') {
            steps {
                dir('backend') {
                    sh 'docker rm -f test-mariadb 2>/dev/null || true'
                    sh 'docker run -d --name test-mariadb --network container:jenkins -e MYSQL_ROOT_PASSWORD=Pipesofi2006 -e MYSQL_DATABASE=mercalist_test_db mariadb:11'
                    sh 'for i in $(seq 1 30); do docker exec test-mariadb mariadb-admin ping -uroot -pPipesofi2006 --silent 2>/dev/null && break; sleep 2; done'
                    sh 'mvn clean package -DskipTests=false'
                }
            }
        }
        stage('Run Tests') {
            steps {
                dir('backend') {
                    sh 'mvn test'
                }
            }
        }
        stage('Docker Build') {
            steps {
                sh 'docker build -t market-admin:latest ./backend'
            }
        }
        stage('Docker Run') {
            steps {
                sh 'docker rm -f market-admin 2>/dev/null || true'
                sh 'docker run -d --name market-admin -p 8080:8080 market-admin:latest'
            }
        }
    }
    post {
        always {
            sh 'docker rm -f test-mariadb 2>/dev/null || true'
            echo 'Pipeline terminado.'
        }
        success {
            echo '¡Despliegue exitoso!'
        }
        failure {
            echo 'Error en el pipeline. Revisar los logs.'
        }
    }
}
