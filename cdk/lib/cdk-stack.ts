import * as cdk from 'aws-cdk-lib';
import {Construct} from 'constructs';
import {LambdaEdgeEventType} from "aws-cdk-lib/aws-cloudfront";
import {Version} from "aws-cdk-lib/aws-lambda";

type AdditionalProps = {
  edgeLambdaVersion: Version
}

export class CdkStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props: AdditionalProps & cdk.StackProps) {
    super(scope, id, props);
    const s3Bucket = new cdk.aws_s3.Bucket(this, 'cornetto-blog-assets');
    new cdk.aws_s3_deployment.BucketDeployment(this, 'DeployWebsite', {
      sources: [cdk.aws_s3_deployment.Source.asset('../dist/client')],
      destinationBucket: s3Bucket,
    });

    new cdk.aws_cloudfront.Distribution(this, 'cornetto-blog-assets-distribution', {
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
            functionVersion: props.edgeLambdaVersion
          },
        ]
      },
    })


  }
}
