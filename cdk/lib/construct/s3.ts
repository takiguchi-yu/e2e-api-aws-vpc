import * as cdk from 'aws-cdk-lib';
import * as s3 from 'aws-cdk-lib/aws-s3';
import { Construct } from 'constructs';

interface S3StackProps extends cdk.StackProps {
  s3: {
    bucket: string;
  };
}

export class S3 extends Construct {
  public readonly e2eTestingCodeBucket: s3.IBucket;

  constructor(scope: Construct, id: string, props: S3StackProps) {
    super(scope, id);

    const bucket = new s3.Bucket(this, 'E2ETestingCodeBucket', {
      bucketName: props.s3.bucket,
      publicReadAccess: false,
      blockPublicAccess: s3.BlockPublicAccess.BLOCK_ALL,
      removalPolicy: cdk.RemovalPolicy.DESTROY,
      autoDeleteObjects: true,
    });
    this.e2eTestingCodeBucket = bucket;
  }
}
