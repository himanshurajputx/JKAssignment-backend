variable "aws_region" {
  default = "us-west-2"
}

variable "ami_id" {
  description = "Ubuntu 22.04 LTS AMI ID"
  default     = "ami-0735c191cf914754d"
}

variable "instance_type" {
  default = "t2.micro"
}

variable "key_name" {
  description = "Name of the SSH key pair"
}

variable "instance_name" {
  default = "web-app-server"
}

variable "ssh_allowed_cidr" {
  description = "CIDR block for SSH access"
  default     = "0.0.0.0/0"
}