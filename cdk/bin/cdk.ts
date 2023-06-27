#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import {CdkStack} from '../lib/cdk-stack';
import {CdkStackUsEast} from "../lib/cdk-stack-us-east";

const app = new cdk.App();
const stack = new CdkStack(app, 'cornetto-blog-s3', {
  env: {region: 'eu-west-1'},
});

new CdkStackUsEast(app, 'cornetto-blog', {
  crossRegionReferences: true,
  env: {region: 'us-east-1'},
  s3Bucket: stack.s3Bucket,
})
