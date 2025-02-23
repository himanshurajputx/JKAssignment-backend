# Full-Stack Blog Platform

A modern blog platform built with NestJS, Angular, and AWS infrastructure.

## Project Overview

This application provides a complete blogging platform with authentication, role-based access control, and a responsive frontend interface. The infrastructure is provisioned and managed using AWS services and Terraform.

## Architecture

### Backend (NestJS)
- RESTful API built with NestJS framework
- JWT-based authentication with social login options
- Role-based access control for content management
- PostgreSQL database integration with TypeORM
- Comprehensive test coverage with Jest and Supertest

### Frontend (Angular)
- Modern SPA with Angular
- Social authentication (Google/Facebook)
- State management with NgRx
- Responsive dashboard for content management
- End-to-end testing with Cypress

### Infrastructure (AWS)
- Container orchestration with EKS (Elastic Kubernetes Service)
- Container registry with ECR
- Infrastructure as Code using Terraform
- CI/CD automation with GitHub Actions
- Observability with AWS CloudWatch

## Getting Started

### Prerequisites
- Node.js (v20+)
- npm
- Docker and Docker Compose
- AWS CLI configured
- Terraform CLI

### Installation

#### Backend Setup
```bash
# Clone the repository
git clone git@github.com:himanshurajputx/JKAssignment-backend.git

# Navigate to backend directory
cd JKAssignment-backend

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Edit .env with your configuration

# Start development server
npm run start:dev
```

#### Frontend Setup
```bash
# Clone the repository
git clone git@github.com:himanshurajputx/JKAssignment-frontend.git

# Navigate to frontend directory
cd JKAssignment-frontend

# Install dependencies
npm install

# Edit environment.ts with your configuration

# Start development server
ng serve
```

### Running Tests
```bash
# Backend tests
cd backend
npm run test       # Unit tests
npm run test:e2e   # Integration tests

# Frontend tests
cd frontend
npm run test       # Unit tests
ng e2e             # Cypress tests
```

## Infrastructure Deployment

```bash
# Navigate to terraform directory
cd terraform

# Initialize Terraform
terraform init

# Plan deployment
terraform plan -out=tfplan

# Apply deployment
terraform apply tfplan
```

## API Documentation

API documentation is available at `/api/docs` when the backend server is running.

##  Testing Strategy

### Backend Testing
- Unit tests for services and controllers
- Integration tests for API endpoints
- Test coverage reporting

### Frontend Testing
- Component unit tests with Jest
- End-to-end testing with Cypress
- Visual regression testing

## Security Features

- JWT-based authentication
- Role-based access control
- HTTPS enforcement
- Input validation
- CSRF protection
- Rate limiting

##  CI/CD Pipeline

The project uses GitHub Actions for continuous integration and deployment:

1. Code quality checks (linting, formatting)
2. Running automated tests
3. Building Docker images
4. Pushing to ECR
5. Deploying to EKS
6. Post-deployment health checks

##  Monitoring

- Application logs aggregated in CloudWatch
- Performance metrics dashboard
- Alerting for critical issues
- Request tracing
