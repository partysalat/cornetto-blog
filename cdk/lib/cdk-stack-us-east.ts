import * as cdk from 'aws-cdk-lib';
import {Duration, RemovalPolicy} from 'aws-cdk-lib';
import {Construct} from 'constructs';
import {LambdaEdgeEventType, PriceClass} from "aws-cdk-lib/aws-cloudfront";
import {Version} from "aws-cdk-lib/aws-lambda";
import {Bucket} from "aws-cdk-lib/aws-s3";

type AdditionalProps = {
  s3Bucket: Bucket
}

export class CdkStackUsEast extends cdk.Stack {
  edgeLambdaVersion: Version;

  constructor(scope: Construct, id: string, {s3Bucket, ...props}: AdditionalProps & cdk.StackProps) {
    super(scope, id, props);
    // ==================== Lambda ====================
    const solidStartLambda = new cdk.aws_lambda.Function(this, "lambda", {
      handler: "index.handler",
      runtime: cdk.aws_lambda.Runtime.NODEJS_18_X,
      code: cdk.aws_lambda.Code.fromAsset("../dist/server"),
      currentVersionOptions: {
        removalPolicy: RemovalPolicy.DESTROY
      }
    })

    const edgeLambdaVersion = solidStartLambda.currentVersion

    // ==================== Rewrite from www to cornetto.cloud ====================
    const cfFunction = new cdk.aws_cloudfront.Function(this, 'redirectToCornettCloudFunction', {
      code: cdk.aws_cloudfront.FunctionCode.fromFile({filePath: './redirectToCornetto.js'}),
    });

    // ==================== CloudFront  + Domain ====================
    const domainNames: string[] = ["cornetto.cloud", "www.cornetto.cloud"]
    const certificate = new cdk.aws_certificatemanager.Certificate(this, "certificate", {
      domainName: domainNames[0],
      subjectAlternativeNames: domainNames.slice(1),
      validation: cdk.aws_certificatemanager.CertificateValidation.fromDns(),

    })

    const distribution = new cdk.aws_cloudfront.Distribution(this, 'cornetto-blog-assets-distribution', {
      priceClass: PriceClass.PRICE_CLASS_100,
      domainNames: domainNames,
      certificate: certificate,
      additionalBehaviors: {
        "/assets/*": {
          origin: new cdk.aws_cloudfront_origins.S3Origin(s3Bucket),
          compress: true
        }
      },
      defaultBehavior: {
        origin: new cdk.aws_cloudfront_origins.S3Origin(s3Bucket),
        functionAssociations: [{
          function: cfFunction,
          eventType: cdk.aws_cloudfront.FunctionEventType.VIEWER_REQUEST,
        }],
        edgeLambdas: [
          {
            eventType: LambdaEdgeEventType.ORIGIN_REQUEST,
            functionVersion: edgeLambdaVersion
          },
        ]
      },
    })
    const zone = cdk.aws_route53.HostedZone.fromHostedZoneAttributes(this, 'hostedZone', {
      zoneName: "cornetto.cloud",
      hostedZoneId:"ZPOH5O9KUKB55"
    });

    domainNames.forEach((domainName)=>{
      const normalizedDomainName = domainName.replace(/\./,"");
      new cdk.aws_route53.RecordSet(this, `record${normalizedDomainName}`, {
        ttl: Duration.minutes(1),
        zone: zone,
        recordName: domainName,
        recordType: cdk.aws_route53.RecordType.A,
        target: cdk.aws_route53.RecordTarget.fromAlias(new cdk.aws_route53_targets.CloudFrontTarget(distribution))
      })

    })



  }
}
