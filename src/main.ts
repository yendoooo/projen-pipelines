import { App, CfnOutput, RemovalPolicies, Stack, StackProps } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as iam from 'aws-cdk-lib/aws-iam';

export class MyStack extends Stack {
  constructor(scope: Construct, id: string, props: StackProps = {}) {
    super(scope, id, props);

    const githubRepository = 'yendoooo/projen-pipelines';  // 自身の環境に合わせて修正

    const githubProvider = new iam.OpenIdConnectProvider(this, 'GitHubProvider', {
      url: 'https://token.actions.githubusercontent.com',
      clientIds: ['sts.amazonaws.com'],
      thumbprints: ['6938fd4d98bab03faadb97b34396831e3780aea1'],
    });

    const githubActionsPolicy = new iam.ManagedPolicy(this, 'GitHubActionsPolicy', {
      statements: [
        new iam.PolicyStatement({
          actions: ['*'],
          resources: ['*'],
        }),
      ],
    });

    const githubActionsRole = new iam.Role(this, 'GitHubActionsRole', {
      assumedBy: new iam.FederatedPrincipal(
        githubProvider.openIdConnectProviderArn,
        {
          "StringEquals": {
            "token.actions.githubusercontent.com:aud": "sts.amazonaws.com"
          },
          "StringLike": {
            "token.actions.githubusercontent.com:sub": `repo:${githubRepository}:*`
          },
        },
        "sts:AssumeRoleWithWebIdentity",
      ),
      managedPolicies: [githubActionsPolicy],
    });

    new CfnOutput(this, 'GitHubActionsRoleArn', {
      value: githubActionsRole.roleArn,
      exportName: 'GitHubActionsRoleArn',
    });
  }
}

// for development, use account/region from cdk cli
const devEnv = {
  account: process.env.CDK_DEFAULT_ACCOUNT,
  region: process.env.CDK_DEFAULT_REGION,
};

const app = new App();

const myStack = new MyStack(app, 'MyStack', { env: devEnv });
RemovalPolicies.of(myStack).destroy()
// new MyStack(app, 'projen-pipelines-prod', { env: prodEnv });

app.synth();