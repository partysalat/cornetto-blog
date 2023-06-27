import * as cdk from 'aws-cdk-lib';
import {Construct} from 'constructs';
import {Bucket} from "aws-cdk-lib/aws-s3";


export class CdkStack extends cdk.Stack {
  s3Bucket: Bucket;

  constructor(scope: Construct, id: string, props: cdk.StackProps) {
    super(scope, id, props);
    this.s3Bucket = new cdk.aws_s3.Bucket(this, 'cornetto-blog-assets');
    new cdk.aws_s3_deployment.BucketDeployment(this, 'DeployWebsite', {
      sources: [cdk.aws_s3_deployment.Source.asset('../dist/client')],
      destinationBucket: this.s3Bucket,
    });



  }
}
