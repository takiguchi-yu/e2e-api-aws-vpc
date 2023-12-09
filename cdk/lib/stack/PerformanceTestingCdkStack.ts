import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { CodeBuild } from '../construct/codebuild';
import { Iam } from '../construct/iam';
import { S3 } from '../construct/s3';

interface PerformanceTestingCdkStackProps extends cdk.StackProps {
  sourceRepository: string;
  vpc: {
    vpcId: string;
    availabilityZones: string[];
    privateSubnetIds: string[];
  };
  s3: {
    bucket: string;
    key: string;
  };
  codebuild: {
    dockerImage: string;
  };
  secretsManager: {
    arn: string;
  };
}

export class PerformanceTestingCdkStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props: PerformanceTestingCdkStackProps) {
    super(scope, id, props);
    // Iam（github actions 用）
    new Iam(this, 'Iam', { account: this.account, sourceRepository: props.sourceRepository });
    // S3（テストコード保存用）
    const s3 = new S3(this, 'S3', { s3: { bucket: props.s3.bucket } });
    // CodeBuild（テストコード実行用）
    new CodeBuild(this, 'CodeBuild', {
      s3: {
        key: props.s3.key,
      },
      s3Bukect: s3.e2eTestingCodeBucket,
      codebuild: {
        dockerImage: props.codebuild.dockerImage,
      },
      vpc: {
        vpcId: props.vpc.vpcId,
        availabilityZones: props.vpc.availabilityZones,
        privateSubnetIds: props.vpc.privateSubnetIds,
      },
      secretsManager: {
        arn: props.secretsManager.arn,
      },
    });
  }
}
