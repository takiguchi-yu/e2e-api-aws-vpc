import * as cdk from 'aws-cdk-lib';
import * as codebuild from 'aws-cdk-lib/aws-codebuild';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as secretsmanager from 'aws-cdk-lib/aws-secretsmanager';
import { Construct } from 'constructs';

interface CodeBuildStackProps extends cdk.StackProps {
  s3: {
    key: string;
  };
  s3Bukect: s3.IBucket;
  codebuild: {
    dockerImage: string;
  };
  vpc: {
    vpcId: string;
    availabilityZones: string[];
    privateSubnetIds: string[];
  };
  secretsManager: {
    arn: string;
  };
}

export class CodeBuild extends Construct {
  constructor(scope: Construct, id: string, props: CodeBuildStackProps) {
    super(scope, id);

    // VPC
    const vpc = ec2.Vpc.fromVpcAttributes(this, 'Vpc', {
      vpcId: props.vpc.vpcId,
      availabilityZones: props.vpc.availabilityZones,
      privateSubnetIds: props.vpc.privateSubnetIds,
    });

    // SecretManager
    const secret = secretsmanager.Secret.fromSecretAttributes(this, 'SecretsManager', {
      secretCompleteArn: props.secretsManager.arn,
    });

    // Codebuild
    new codebuild.Project(this, 'ApiE2ETesting', {
      projectName: 'api-e2e-testing',
      description: 'APIのE2Eテストを実行する',
      source: codebuild.Source.s3({
        bucket: props.s3Bukect,
        path: props.s3.key,
      }),
      buildSpec: codebuild.BuildSpec.fromObject({
        version: '0.2',
        phases: {
          build: {
            commands: ['node -v && npm -v', 'npm ci', 'npx playwright install --with-deps', 'npx playwright test'],
          },
        },
      }),
      environment: {
        buildImage: codebuild.LinuxBuildImage.fromDockerRegistry(props.codebuild.dockerImage),
        privileged: true,
        environmentVariables: {
          API_KEY: {
            type: codebuild.BuildEnvironmentVariableType.PLAINTEXT,
            value: `${secret.secretValueFromJson('API_KEY').unsafeUnwrap()}`,
          },
        },
      },
      vpc: vpc,
    });
  }
}
