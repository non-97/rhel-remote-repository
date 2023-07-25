import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";
import * as fs from "fs";
import * as path from "path";

export interface Ec2InstanceProps {
  vpc: cdk.aws_ec2.IVpc;
  imageName: string;
  securityGroup: cdk.aws_ec2.ISecurityGroup;
  isRepository: boolean;
}

export class Ec2Instance extends Construct {
  readonly instance: cdk.aws_ec2.IInstance;

  constructor(scope: Construct, id: string, props: Ec2InstanceProps) {
    super(scope, id);

    // User data
    const userDataScript = fs.readFileSync(
      path.join(__dirname, "../ec2/user-data.sh"),
      "utf8"
    );
    const userData = cdk.aws_ec2.UserData.forLinux({
      shebang: "#!/bin/bash",
    });
    userData.addCommands(userDataScript);

    // EC2 Instance
    this.instance = new cdk.aws_ec2.Instance(this, "Default", {
      machineImage: cdk.aws_ec2.MachineImage.lookup({
        name: props.imageName,
        owners: ["309956199498"],
      }),
      instanceType: new cdk.aws_ec2.InstanceType("t3.micro"),
      blockDevices: [
        {
          deviceName: "/dev/sda1",
          volume: cdk.aws_ec2.BlockDeviceVolume.ebs(
            props.isRepository ? 100 : 10,
            {
              volumeType: cdk.aws_ec2.EbsDeviceVolumeType.GP3,
              encrypted: true,
            }
          ),
        },
      ],
      vpc: props.vpc,
      vpcSubnets: props.vpc.selectSubnets({
        subnetGroupName: "Public",
      }),
      propagateTagsToVolumeOnCreation: true,
      ssmSessionPermissions: true,
      userData,
      securityGroup: props.securityGroup,
    });
  }
}
