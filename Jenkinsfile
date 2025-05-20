pipeline {
    agent any

    tools {
        nodejs "nodejs"
    }

    environment {
        CI = 'true'
        MONGO_URI='mongodb+srv://karthyayenip22cse:kavya123@cluster0.9uqygwk.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0'
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
                    sh 'npm run test'
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
