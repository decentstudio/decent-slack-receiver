pipeline {
    agent any

    stages {
        stage('Build') {
            agent {
              docker {
                image 'node:7.4'
              }
            }
            steps {
                echo 'Building..'
                sh 'npm install'
                sh 'npm run build'
            }
        }
        stage('Test') {
            steps {
                echo 'Testing..'
            }
        }
        stage('Deploy') {
            steps {
                echo 'Deploying....'
            }
        }
    }
}
