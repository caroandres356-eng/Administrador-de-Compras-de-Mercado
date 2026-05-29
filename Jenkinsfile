pipeline {
    agent any

    parameters {
        string(name: 'BRANCH', defaultValue: 'feature_julian', description: 'Branch a desplegar')
        string(name: 'DB_PASS', defaultValue: 'Pipesofi2006', description: 'Contraseña de MariaDB')
    }

    environment {
        DOCKER_IMAGE = 'market-admin'
        DOCKER_TAG = "${BUILD_NUMBER}"
        TEST_DB = 'mercalist-test-db'
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

        stage('Start Test DB') {
            steps {
                sh '''
                    docker rm -f ${TEST_DB} || true
                    docker run -d --name ${TEST_DB} \
                        --network container:jenkins \
                        -e MYSQL_ROOT_PASSWORD=${DB_PASS} \
                        -e MYSQL_DATABASE=mercalist_test_db \
                        mariadb:11
                    echo "Waiting for MariaDB..."
                    for i in $(seq 1 30); do
                        if docker exec ${TEST_DB} mariadb-admin ping -uroot -p${DB_PASS} --silent 2>/dev/null; then
                            echo "MariaDB ready"
                            break
                        fi
                        sleep 2
                    done
                '''
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
            sh 'docker rm -f ${TEST_DB} || true'
            deleteDir()
        }
    }
}
