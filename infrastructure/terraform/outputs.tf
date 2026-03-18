output "media_bucket_name" {
  description = "S3 bucket name for media files"
  value       = aws_s3_bucket.media.id
}

output "media_bucket_arn" {
  description = "S3 bucket ARN for media files"
  value       = aws_s3_bucket.media.arn
}

output "app_bucket_name" {
  description = "S3 bucket name for app static files"
  value       = aws_s3_bucket.app.id
}

output "cdn_domain" {
  description = "CDN domain for media"
  value       = "https://${var.cdn_subdomain}.${var.domain_name}"
}

output "app_domain" {
  description = "App domain"
  value       = "https://${var.app_subdomain}.${var.domain_name}"
}

output "cloudfront_media_distribution_id" {
  description = "CloudFront distribution ID for media CDN"
  value       = aws_cloudfront_distribution.media.id
}

output "cloudfront_app_distribution_id" {
  description = "CloudFront distribution ID for app"
  value       = aws_cloudfront_distribution.app.id
}
