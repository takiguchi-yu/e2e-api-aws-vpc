#!/usr/bin/env node
import * as cdk from 'aws-cdk-lib';
import 'source-map-support/register';
import { PerformanceTestingCdkStack } from '../lib/stack/PerformanceTestingCdkStack';
import { testParameter } from '../parameter';

const app = new cdk.App();
new PerformanceTestingCdkStack(app, 'E2ETestingCdkStack', {
  tags: {
    Repository: testParameter.sourceRepository,
    Environment: testParameter.envName,
  },
  sourceRepository: testParameter.sourceRepository,
  vpc: {
    vpcId: testParameter.vpc.vpcId,
    availabilityZones: testParameter.vpc.availabilityZones,
    privateSubnetIds: testParameter.vpc.privateSubnetIds,
  },
  s3: {
    bucket: testParameter.s3.bucket,
    key: testParameter.s3.key,
  },
  codebuild: {
    dockerImage: testParameter.codebuild.dockerImage,
  },
  secretsManager: {
    arn: testParameter.secretsManager.arn,
  },
});
