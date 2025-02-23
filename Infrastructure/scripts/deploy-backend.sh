#!/bin/bash

# Environment variables that should be set
# EC2_HOST - 65.0.20.230
# SSH_KEY_PATH - Path to SSH private key
# BACKEND_REPO - https://github.com/himanshurajputx/JKAssignment-backend.git
# BRANCH - Branch to deploy (default: main)
# NODE_ENV - Node environment (default: production)

set -e  # Exit on any error

echo "Starting Backend Deployment..."

# Default values
BRANCH=${BRANCH:-main}
NODE_ENV=${NODE_ENV:-production}

# Create temporary directory
TEMP_DIR=$(mktemp -d)
echo "Created temporary directory: $TEMP_DIR"

# Clone repository
echo "Cloning backend repository..."
git clone -b $BRANCH $BACKEND_REPO $TEMP_DIR
cd $TEMP_DIR

# Install dependencies and build
echo "Installing dependencies..."
npm install

echo "Building application..."
npm run build

# Create deployment script for EC2
cat > deploy.sh << 'EOF'
#!/bin/bash
set -e

# Stop existing process
pm2 stop backend || true

# Install dependencies
npm install --production

# Start application
pm2 start dist/main.js --name backend \
    --time \
    --max-memory-restart 500M \
    --env ${NODE_ENV}

# Save PM2 configuration
pm2 save

# Display status
pm2 status
EOF

# Make script executable
chmod +x deploy.sh

# Deploy to EC2
echo "Deploying to EC2..."
ssh -i $SSH_KEY_PATH ubuntu@$EC2_HOST "sudo mkdir -p /var/www/backend"
scp -i $SSH_KEY_PATH -r \
    package*.json \
    dist/ \
    deploy.sh \
    .env* \
    ubuntu@$EC2_HOST:/var/www/backend/

# Execute deployment script on EC2
echo "Starting backend service..."
ssh -i $SSH_KEY_PATH ubuntu@$EC2_HOST "cd /var/www/backend && ./deploy.sh"

# Cleanup
echo "Cleaning up..."
rm -rf $TEMP_DIR

echo "Backend deployment completed successfully!"