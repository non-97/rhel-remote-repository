# -x to display the command to be executed
set -x

# Redirect /var/log/user-data.log and /dev/console
exec > >(tee /var/log/user-data.log | logger -t user-data -s 2>/dev/console) 2>&1

# SSM Agent
region_name=$(curl -s http://169.254.169.254/latest/meta-data/placement/availability-zone | sed -e 's/.$//')
dnf install -y "https://s3.${region_name}.amazonaws.com/amazon-ssm-${region_name}/latest/linux_amd64/amazon-ssm-agent.rpm"
systemctl enable amazon-ssm-agent
systemctl start amazon-ssm-agent
