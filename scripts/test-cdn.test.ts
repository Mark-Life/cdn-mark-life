/**
 * CDN Integration Test
 *
 * Tests the full pipeline: S3 upload → CloudFront fetch → S3 delete → cache invalidation → verify gone.
 *
 * Required env vars:
 *   AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY, AWS_REGION (defaults to eu-north-1)
 *
 * Usage:
 *   bun run scripts/test-cdn.ts
 */

import {
  CloudFrontClient,
  CreateInvalidationCommand,
} from "@aws-sdk/client-cloudfront";
import {
  DeleteObjectCommand,
  GetObjectCommand,
  PutObjectCommand,
  S3Client,
} from "@aws-sdk/client-s3";

const BUCKET = "static-mark-life-com-media";
const CDN_DOMAIN = "https://static.mark-life.com";
const CLOUDFRONT_DISTRIBUTION_ID = "E30LRWSJTWF8AQ";
const TEST_KEY = `_test/cdn-test-${Date.now()}.txt`;

const region = process.env.AWS_REGION ?? "eu-north-1";

const s3 = new S3Client({ region });
const cf = new CloudFrontClient({ region });

function log(step: string, msg: string) {
  console.log(`[${step}] ${msg}`);
}

async function fetchCdn(
  key: string
): Promise<{ status: number; body: string }> {
  const url = `${CDN_DOMAIN}/${key}`;
  const res = await fetch(url);
  const body = await res.text();
  return { status: res.status, body };
}

function sleep(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}

async function main() {
  const testContent = `CDN test file created at ${new Date().toISOString()}`;

  // 1. Upload file to S3
  log("1/6", `Uploading to s3://${BUCKET}/${TEST_KEY}`);
  await s3.send(
    new PutObjectCommand({
      Bucket: BUCKET,
      Key: TEST_KEY,
      Body: testContent,
      ContentType: "text/plain",
    })
  );
  log("1/6", "Upload complete ✓");

  // 2. Verify file exists in S3
  log("2/6", "Verifying file in S3...");
  const s3Obj = await s3.send(
    new GetObjectCommand({ Bucket: BUCKET, Key: TEST_KEY })
  );
  const s3Body = await s3Obj.Body?.transformToString();
  if (s3Body !== testContent) {
    throw new Error(
      `S3 content mismatch: expected "${testContent}", got "${s3Body}"`
    );
  }
  log("2/6", "S3 file verified ✓");

  // 3. Fetch via CloudFront CDN
  log("3/6", `Fetching ${CDN_DOMAIN}/${TEST_KEY}`);
  // CloudFront may take a moment to propagate
  let cdnResult = { status: 0, body: "" };
  for (let attempt = 1; attempt <= 10; attempt++) {
    cdnResult = await fetchCdn(TEST_KEY);
    if (cdnResult.status === 200) {
      break;
    }
    log(
      "3/6",
      `Attempt ${attempt}: status ${cdnResult.status}, retrying in 3s...`
    );
    await sleep(3000);
  }
  if (cdnResult.status !== 200) {
    throw new Error(
      `CDN fetch failed with status ${cdnResult.status}: ${cdnResult.body}`
    );
  }
  if (cdnResult.body !== testContent) {
    throw new Error(
      `CDN content mismatch: expected "${testContent}", got "${cdnResult.body}"`
    );
  }
  log("3/6", "CDN fetch verified ✓");

  // 4. Delete file from S3
  log("4/6", "Deleting file from S3...");
  await s3.send(new DeleteObjectCommand({ Bucket: BUCKET, Key: TEST_KEY }));
  log("4/6", "Deleted from S3 ✓");

  // 5. Invalidate CloudFront cache
  log("5/6", "Invalidating CloudFront cache...");
  const invalidation = await cf.send(
    new CreateInvalidationCommand({
      DistributionId: CLOUDFRONT_DISTRIBUTION_ID,
      InvalidationBatch: {
        CallerReference: `test-${Date.now()}`,
        Paths: {
          Quantity: 1,
          Items: [`/${TEST_KEY}`],
        },
      },
    })
  );
  log("5/6", `Invalidation created: ${invalidation.Invalidation?.Id} ✓`);

  // 6. Verify file is gone via CloudFront
  log("6/6", "Waiting for invalidation to propagate...");
  let gone = false;
  for (let attempt = 1; attempt <= 20; attempt++) {
    const result = await fetchCdn(TEST_KEY);
    if (result.status === 403 || result.status === 404) {
      gone = true;
      break;
    }
    log(
      "6/6",
      `Attempt ${attempt}: still status ${result.status}, retrying in 5s...`
    );
    await sleep(5000);
  }
  if (!gone) {
    throw new Error(
      "File still accessible via CDN after invalidation — cache may not have cleared"
    );
  }
  log("6/6", "File confirmed gone from CDN ✓");

  console.log("\n✅ All CDN integration tests passed!");
}

main().catch((err) => {
  console.error("\n❌ Test failed:", err.message);
  process.exit(1);
});
