export interface AppParameter {
  envName: string;
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

// テスト環境用パラメータ
export const testParameter: AppParameter = {
  envName: 'TEST',
  sourceRepository: 'takiguchi-yu/e2e-api-aws-vpc',
  // VPC
  vpc: {
    vpcId: 'vpc-0603a6bad566bec1f',
    availabilityZones: ['ap-northeast-1a', 'ap-northeast-1c'],
    privateSubnetIds: ['subnet-aaa', 'subnet-bbb'],
  },
  s3: {
    bucket: 'api-e2e-testing-bucket',
    key: 'e2e-testing-code.zip',
  },
  codebuild: {
    dockerImage: 'mcr.microsoft.com/playwright:v1.39.0-jammy',
  },
  secretsManager: {
    arn: 'arn:aws:secretsmanager:ap-northeast-1:9999999999:secret:api-e2e-testing',
  },
};
