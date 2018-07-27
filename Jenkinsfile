node {
    def app

    stage('SCM Checkout') {
        git credentialsId: '8e74bd8b-049f-4320-b077-2df0e12373a0', url: 'https://github.com/sunil-ramesh/githubviz-node.git'
    }

    stage('Build image') {
        app = docker.build("gitviz-node")
    }

    stage('Docker push') {
    	sh 'ecs-cli configure --cluster gitviz-test --region us-east-1 --default-launch-type EC2 --config-name gitviz-test'
    	sh 'ecs-cli configure profile --access-key AKIAJEP4WYKNHY6WLPKQ --secret-key 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 --profile-name gitviz-test'

    }

}





