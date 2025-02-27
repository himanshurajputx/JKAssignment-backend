#!/bin/bash

# Environment variables that should be set
# EC2_HOST - 65.0.20.230
# SSH_KEY_PATH - Path to SSH private key
# FRONTEND_REPO - https://github.com/himanshurajputx/JKAssignment-frontend.git
# BRANCH - Branch to deploy (default: main)

set -e  # Exit on any error

echo "Starting Frontend Deployment..."

# Default branch
BRANCH=${BRANCH:-main}

# Create temporary directory
TEMP_DIR=$(mktemp -d)
echo "Created temporary directory: $TEMP_DIR"

# Clone repository
echo "Cloning frontend repository..."
git clone -b $BRANCH $FRONTEND_REPO $TEMP_DIR
cd $TEMP_DIR

# Install dependencies and build
echo "Installing dependencies..."
npm install

echo "Building application..."
npm run build

# Deploy to EC2
echo "Deploying to EC2..."
ssh -i $SSH_KEY_PATH ubuntu@$EC2_HOST "sudo mkdir -p /var/www/frontend"
scp -i $SSH_KEY_PATH -r dist/* ubuntu@$EC2_HOST:/var/www/frontend/

# Restart Nginx
echo "Restarting Nginx..."
ssh -i $SSH_KEY_PATH ubuntu@$EC2_HOST "sudo systemctl restart nginx"

# Cleanup
echo "Cleaning up..."
rm -rf $TEMP_DIR

echo "Frontend deployment completed successfully!"
