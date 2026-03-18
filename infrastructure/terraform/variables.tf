variable "aws_region" {
  description = "AWS region for resources"
  type        = string
  default     = "eu-north-1"
}

variable "domain_name" {
  description = "Root domain name"
  type        = string
  default     = "mark-life.com"
}

variable "cdn_subdomain" {
  description = "Subdomain for media CDN"
  type        = string
  default     = "cdn"
}

variable "app_subdomain" {
  description = "Subdomain for the web application"
  type        = string
  default     = "app"
}

variable "environment" {
  description = "Environment name"
  type        = string
  default     = "production"
}
