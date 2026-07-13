pipeline {
    agent any

    environment {
        DOCKERHUB_USER = "joshwa03"
        IMAGE_NAME     = "seoul-spice"
        IMAGE_TAG      = "${env.GIT_COMMIT.take(7)}"
        FULL_IMAGE     = "${DOCKERHUB_USER}/${IMAGE_NAME}"
    }

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Build Docker Image') {
            steps {
                sh "docker build -t ${FULL_IMAGE}:${IMAGE_TAG} -t ${FULL_IMAGE}:latest ."
            }
        }

        stage('Push to Docker Hub') {
            steps {
                withCredentials([usernamePassword(
                    credentialsId: 'dockerhub-creds',
                    usernameVariable: 'DOCKER_USER',
                    passwordVariable: 'DOCKER_PASS'
                )]) {
                    sh """
                        echo \$DOCKER_PASS | docker login -u \$DOCKER_USER --password-stdin
                        docker push ${FULL_IMAGE}:${IMAGE_TAG}
                        docker push ${FULL_IMAGE}:latest
                    """
                }
            }
        }
    }
}