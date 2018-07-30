#!groovy

def dockerImage

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
               dockerImage = docker.build("gitviz-node")
                }
             }
         }
         stage('Test') {
            steps {
                echo "test case running ..."
                }
            }

         stage('docker push') {
            steps {
                echo "push docker image"
                }
            }   

        stage('Deliver for production') {
            steps {
                echo "deploying to staging .."
            }
        }
   }
   post {
        success {
            echo "success notification"
        }
        failure {
            echo "failure notification"
        }
        unstable {
            echo "build is unstable"
        }
    }
}