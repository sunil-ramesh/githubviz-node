node {
    def app

    stage('SCM Checkout') {
        git credentialsId: '8e74bd8b-049f-4320-b077-2df0e12373a0', url: 'https://github.com/sunil-ramesh/githubviz-node.git'
    }

    stage('Build image') {
        app = docker.build("gitviz-node")
    }

}





