# IAM user for Convex backend to generate presigned URLs

resource "aws_iam_user" "convex_backend" {
  name = "cdn-mark-life-convex-backend"
}

resource "aws_iam_access_key" "convex_backend" {
  user = aws_iam_user.convex_backend.name
}

resource "aws_iam_user_policy" "convex_s3_access" {
  name = "convex-s3-media-access"
  user = aws_iam_user.convex_backend.name

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect = "Allow"
        Action = [
          "s3:GetObject",
          "s3:PutObject",
          "s3:DeleteObject",
          "s3:ListBucket",
        ]
        Resource = [
          aws_s3_bucket.media.arn,
          "${aws_s3_bucket.media.arn}/*",
        ]
      }
    ]
  })
}

# IAM user for CI/CD to deploy app to S3 + invalidate CloudFront

resource "aws_iam_user" "ci_deploy" {
  name = "cdn-mark-life-ci-deploy"
}

resource "aws_iam_access_key" "ci_deploy" {
  user = aws_iam_user.ci_deploy.name
}

resource "aws_iam_user_policy" "ci_deploy" {
  name = "ci-deploy-policy"
  user = aws_iam_user.ci_deploy.name

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect = "Allow"
        Action = [
          "s3:PutObject",
          "s3:DeleteObject",
          "s3:ListBucket",
          "s3:GetObject",
        ]
        Resource = [
          aws_s3_bucket.app.arn,
          "${aws_s3_bucket.app.arn}/*",
        ]
      },
      {
        Effect = "Allow"
        Action = [
          "cloudfront:CreateInvalidation",
        ]
        Resource = [
          aws_cloudfront_distribution.app.arn,
        ]
      }
    ]
  })
}

output "convex_aws_access_key_id" {
  description = "AWS access key ID for Convex backend (set as Convex env var)"
  value       = aws_iam_access_key.convex_backend.id
  sensitive   = true
}

output "convex_aws_secret_access_key" {
  description = "AWS secret access key for Convex backend (set as Convex env var)"
  value       = aws_iam_access_key.convex_backend.secret
  sensitive   = true
}

output "ci_aws_access_key_id" {
  description = "AWS access key ID for CI/CD deployment"
  value       = aws_iam_access_key.ci_deploy.id
  sensitive   = true
}

output "ci_aws_secret_access_key" {
  description = "AWS secret access key for CI/CD deployment"
  value       = aws_iam_access_key.ci_deploy.secret
  sensitive   = true
}
