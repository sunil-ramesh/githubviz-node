pipeline {
    agent any
    stages {
        stage('clone repository') {
          steps {
           script {
            git branch: 'staging', credentialsId: '8e74bd8b-049f-4320-b077-2df0e12373a0', url: 'https://github.com/sunil-ramesh/githubviz-node'
           }
          }
        }
        stage('Build image') {
            steps {
            script {
                docker.build("gitviz-node")
                }
             }
         }
         stage('Test') {
            steps {
                script {
                    sh 'test case running ....'
                    }
                }
            }
        }

        stage('Deliver for production') {
            when {
                branch 'staging' 
            }
            steps {
                sh 'echo "deploying...'
            }
        }
   }
}