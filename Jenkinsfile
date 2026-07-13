pipeline {
    agent any

    environment {
        IMAGE_NAME = "seoul-spice-app"
        IMAGE_TAG  = "${env.GIT_COMMIT.take(7)}"
    }

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('List Files') {
            steps {
                sh 'ls -la'
            }
        }

        stage('Build Docker Image') {
            steps {
                sh "docker build -t ${IMAGE_NAME}:${IMAGE_TAG} -t ${IMAGE_NAME}:latest ."
            }
        }

        stage('Show Image') {
            steps {
                sh "docker images | grep ${IMAGE_NAME}"
            }
        }
    }
}