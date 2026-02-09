# AWS Deployment Guide

## Architecture
- **VPC**: 2 Public Subnets (ALB), 2 Private Subnets (App, DB).
- **ALB**: Internet facing, forwards to Target Group (Port 3001).
- **EC2**: In ASG, Private Subnet. UserData pulls Docker image from ECR.
- **Data**: MongoDB Atlas (Peering) or DocumentDB. ElastiCache Redis.

## Steps
1. **Push Image**:
   aws ecr get-login-password | docker login ...
   docker build -t api .
   docker push ...

2. **Infrastructure**:
   - Create VPC + IGW + NAT Gateway.
   - Create DocumentDB Cluster + Redis Cluster in Private Subnets.
   - Store Secrets (Mongo URI, JWT) in Secrets Manager.

3. **Launch Template**:
   - AMI: Amazon Linux 2 (with Docker).
   - IAM Role: Allow ECR Pull + Secrets Read.
   - UserData:
     ```bash
     #!/bin/bash
     aws ecr get-login-password...
     export MONGODB_URI=$(aws secretsmanager...)
     docker run -d -p 3001:3001 api:latest
     ```

4. **ALB**:
   - Create Target Group (HTTP 3001).
   - Attach ASG to Target Group.
