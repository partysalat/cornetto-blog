import * as cdk from 'aws-cdk-lib';
import {Construct} from 'constructs';
import {LambdaEdgeEventType, PriceClass} from "aws-cdk-lib/aws-cloudfront";
import {Version} from "aws-cdk-lib/aws-lambda";
import {RemovalPolicy} from "aws-cdk-lib";
import {Bucket} from "aws-cdk-lib/aws-s3";

type AdditionalProps = {
  s3Bucket: Bucket
}
export class CdkStackUsEast extends cdk.Stack {
  edgeLambdaVersion: Version;
  constructor(scope: Construct, id: string, {s3Bucket, ...props}: AdditionalProps & cdk.StackProps) {
    super(scope, id, props);

    const requestHandlerLambda = new cdk.aws_lambda.Function(this, "lambda", {
      handler: "index.handler",
      runtime: cdk.aws_lambda.Runtime.NODEJS_18_X,
      code: cdk.aws_lambda.Code.fromAsset("../dist/server"),
      currentVersionOptions: {
        removalPolicy: RemovalPolicy.DESTROY
      }
    })

    const edgeLambdaVersion = requestHandlerLambda.currentVersion
    new cdk.aws_cloudfront.Distribution(this, 'cornetto-blog-assets-distribution', {
      priceClass: PriceClass.PRICE_CLASS_100,
      additionalBehaviors: {
        "/assets/*": {
          origin: new cdk.aws_cloudfront_origins.S3Origin(s3Bucket),
          compress: true
        }
      },
      defaultBehavior: {
        origin: new cdk.aws_cloudfront_origins.S3Origin(s3Bucket),
        edgeLambdas: [
          {
            eventType: LambdaEdgeEventType.ORIGIN_REQUEST,
            functionVersion: edgeLambdaVersion
          },
        ]
      },
    })
  }
}
