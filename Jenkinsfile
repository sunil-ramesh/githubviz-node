pipeline {
    agent any
    stages {
        stage('Build image') {
            steps {
                docker.build("gitviz-node")
            }
        }
        stage('Deliver for production') {
            when {
                branch 'master' 
            }
            steps {
                sh 'echo "deploying...'
            }
        }
        }
    }
    post { 
        always { 
            echo 'I will always say Hello again!'
        }
    }
}





