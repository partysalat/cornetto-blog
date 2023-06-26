#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import {CdkStack} from '../lib/cdk-stack';
import {CdkStackUsEast} from "../lib/cdk-stack-us-east";

const app = new cdk.App();
const stack = new CdkStackUsEast(app, 'cornetto-blog-cert-lambda', {
  env: {region: 'us-east-1'},
})
new CdkStack(app, 'cornetto-blog', {
  crossRegionReferences: true,
  env: {region: 'eu-west-1'},
  edgeLambdaVersion: stack.edgeLambdaVersion
});
