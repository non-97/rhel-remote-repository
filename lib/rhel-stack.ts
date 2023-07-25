import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";
import { Vpc } from "./constructs/vpc";
import { Ec2Instance } from "./constructs/ec2-instance";

export class RhelStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // VPC
    const vpc = new Vpc(this, "Vpc");

    // Repository
    new Ec2Instance(this, "Repository", {
      vpc: vpc.vpc,
      imageName: "RHEL-9.0.0_HVM-20220513-x86_64-0-Hourly2-GP2",
      securityGroup: vpc.repositorySg,
      isRepository: true,
    });

    // RHEL 8.5
    new Ec2Instance(this, "Rhel85", {
      vpc: vpc.vpc,
      imageName: "RHEL-8.5.0_HVM-20211103-x86_64-0-Hourly2-GP2",
      securityGroup: vpc.clientSg,
      isRepository: false,
    });

    // RHEL 9.1
    new Ec2Instance(this, "Rhel91", {
      vpc: vpc.vpc,
      imageName: "RHEL-9.1.0_HVM-20230404-x86_64-54-Hourly2-GP2",
      securityGroup: vpc.clientSg,
      isRepository: false,
    });
  }
}
