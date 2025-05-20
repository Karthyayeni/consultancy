pipeline {
    agent any

    tools {
        nodejs "Node18"
    }

    environment {
        CI = 'true'
    }

    stages {
        stage('Checkout Code') {
            steps {
                checkout scm
            }
        }

        stage('Install & Test Backend') {
            steps {
                dir('backend') {
                    sh 'npm install'
                    sh 'npm run test:ci'
                }
            }
        }

        stage('Install & Test Frontend') {
            steps {
                dir('frontend') {
                    sh 'npm install'
                    sh 'npm test'
                }
            }
        }
    }

    post {
        always {
            junit 'backend/test-results/backends/jest-results.xml'
            junit 'frontend/test-results/frontends/jest-results.xml'
        }
    }
}
