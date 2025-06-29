import { awscdk } from 'projen';
import { GithubCDKPipeline } from 'projen-pipelines';

const project = new awscdk.AwsCdkTypeScriptApp({
  cdkVersion: '2.1.0',
  defaultReleaseBranch: 'main',
  name: 'projen-pipelines',
  projenrcTs: true,

  devDeps: ['projen-pipelines'],  // 追加
});

new GithubCDKPipeline(project, {
  iamRoleArns: {
    default: 'arn:aws:iam::905418098783:role/MyStack-GitHubActionsRole4F1BBA26-0oo0O6Q4F8nq',
  },
  stages: [
    {
      name: 'dev',
      env: { account: '905418098783', region: 'ap-northeast-1' },
    },
  ],
});

project.synth();