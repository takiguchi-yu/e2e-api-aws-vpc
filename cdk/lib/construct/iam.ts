import * as cdk from 'aws-cdk-lib';
import * as iam from 'aws-cdk-lib/aws-iam';
import { Construct } from 'constructs';

export interface IamStackProps extends cdk.StackProps {
  account: string;
  sourceRepository: string;
}

export class Iam extends Construct {
  constructor(scope: Construct, id: string, props: IamStackProps) {
    super(scope, id);

    new iam.Role(this, 'RoleForGithubAction', {
      roleName: 'api-e2e-testing-githubactions-role',
      assumedBy: new iam.WebIdentityPrincipal(`arn:aws:iam::${props.account}:oidc-provider/token.actions.githubusercontent.com`, {
        StringEquals: {
          ['token.actions.githubusercontent.com:aud']: 'sts.amazonaws.com',
        },
        StringLike: {
          ['token.actions.githubusercontent.com:sub']: `repo:${props.sourceRepository}:*`,
        },
      }),
    }).addManagedPolicy(iam.ManagedPolicy.fromAwsManagedPolicyName('AdministratorAccess'));
  }
}
