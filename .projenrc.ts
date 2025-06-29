import { awscdk } from 'projen';
const project = new awscdk.AwsCdkTypeScriptApp({
  cdkVersion: '2.1.0',
  defaultReleaseBranch: 'main',
  name: 'projen-pipelines',
  projenrcTs: true,

  devDeps: ['projen-pipelines'],  // 追加
});
project.synth();