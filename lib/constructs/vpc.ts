import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";

export interface VpcProps {}

export class Vpc extends Construct {
  readonly vpc: cdk.aws_ec2.IVpc;
  readonly repositorySg: cdk.aws_ec2.ISecurityGroup;
  readonly clientSg: cdk.aws_ec2.ISecurityGroup;

  constructor(scope: Construct, id: string, props?: VpcProps) {
    super(scope, id);

    this.vpc = new cdk.aws_ec2.Vpc(this, "Default", {
      ipAddresses: cdk.aws_ec2.IpAddresses.cidr("10.1.1.0/24"),
      enableDnsHostnames: true,
      enableDnsSupport: true,
      natGateways: 0,
      maxAzs: 2,
      subnetConfiguration: [
        {
          name: "Public",
          subnetType: cdk.aws_ec2.SubnetType.PUBLIC,
          cidrMask: 27,
          mapPublicIpOnLaunch: true,
        },
      ],
      gatewayEndpoints: {
        S3: {
          service: cdk.aws_ec2.GatewayVpcEndpointAwsService.S3,
        },
      },
    });

    // Security Group
    this.repositorySg = new cdk.aws_ec2.SecurityGroup(this, "RepositorySg", {
      vpc: this.vpc,
    });
    this.clientSg = new cdk.aws_ec2.SecurityGroup(this, "ClientSg", {
      vpc: this.vpc,
    });
    this.repositorySg.addIngressRule(
      cdk.aws_ec2.Peer.securityGroupId(this.clientSg.securityGroupId),
      cdk.aws_ec2.Port.tcp(80)
    );
  }
}
