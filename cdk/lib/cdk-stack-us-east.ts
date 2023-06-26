import * as cdk from 'aws-cdk-lib';
import {Construct} from 'constructs';
import {LambdaEdgeEventType} from "aws-cdk-lib/aws-cloudfront";
import {Version} from "aws-cdk-lib/aws-lambda";
import {RemovalPolicy} from "aws-cdk-lib";

export class CdkStackUsEast extends cdk.Stack {
  edgeLambdaVersion: Version;
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const requestHandlerLambda = new cdk.aws_lambda.Function(this, "lambda", {
      handler: "index.handler",
      runtime: cdk.aws_lambda.Runtime.NODEJS_18_X,
      code: cdk.aws_lambda.Code.fromAsset("../dist/server"),
      currentVersionOptions: {
        removalPolicy: RemovalPolicy.DESTROY
      }
    })

    this.edgeLambdaVersion = requestHandlerLambda.currentVersion
    // this.edgeLambdaVersion = new cdk.aws_lambda.Version(this, "lambdaVersion", {
    //   lambda: requestHandlerLambda,
    // });
    
    


  }
}
