#!/bin/bash
echo 'run after_install.sh: ' >> /home/ec2-user/AWS/P12-Authentication/deploy.log

echo 'cd /home/ec2-user/nodejs-server-cicd' >> /home/ec2-user/AWS/P12-Authentication/deploy.log
cd /home/ec2-user/nodejs-aws-codedeploy-pipeline >> /home/ec2-user/AWS/P12-Authentication/deploy.log

echo 'npm install' >> /home/ec2-user/AWS/P12-Authentication/deploy.log 
npm install >> /home/ec2-user/AWS/P12-Authentication/deploy.log