import {
  GetObjectCommand,
  PutObjectCommand,
  S3Client,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { v } from "convex/values";
import { action, mutation, query } from "./_generated/server";

const PRESIGNED_URL_EXPIRY_SECONDS = 3600;

function getS3Client(): S3Client {
  return new S3Client({
    region: process.env.AWS_REGION ?? "eu-north-1",
    credentials: {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID ?? "",
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY ?? "",
    },
  });
}

function getBucketName(): string {
  const bucket = process.env.S3_BUCKET_NAME;
  if (!bucket) {
    throw new Error("S3_BUCKET_NAME environment variable is not set");
  }
  return bucket;
}

export const list = query({
  args: {
    accountId: v.id("accounts"),
    prefix: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const files = await ctx.db
      .query("files")
      .withIndex("by_account", (q) => q.eq("accountId", args.accountId))
      .collect();

    if (args.prefix) {
      return files.filter((f) => f.s3Key.startsWith(args.prefix as string));
    }

    return files;
  },
});

export const getUploadUrl = action({
  args: {
    accountSlug: v.string(),
    filePath: v.string(),
    contentType: v.string(),
  },
  handler: async (_ctx, args) => {
    const s3 = getS3Client();
    const key = `${args.accountSlug}/${args.filePath}`;

    const command = new PutObjectCommand({
      Bucket: getBucketName(),
      Key: key,
      ContentType: args.contentType,
    });

    const url = await getSignedUrl(s3, command, {
      expiresIn: PRESIGNED_URL_EXPIRY_SECONDS,
    });

    return { url, key };
  },
});

export const getDownloadUrl = action({
  args: {
    accountSlug: v.string(),
    filePath: v.string(),
  },
  handler: async (_ctx, args) => {
    const s3 = getS3Client();
    const key = `${args.accountSlug}/${args.filePath}`;

    const command = new GetObjectCommand({
      Bucket: getBucketName(),
      Key: key,
    });

    const url = await getSignedUrl(s3, command, {
      expiresIn: PRESIGNED_URL_EXPIRY_SECONDS,
    });

    return { url };
  },
});

export const recordUpload = mutation({
  args: {
    accountId: v.id("accounts"),
    s3Key: v.string(),
    fileName: v.string(),
    contentType: v.string(),
    sizeBytes: v.number(),
    uploadedBy: v.string(),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("files", {
      ...args,
      createdAt: Date.now(),
    });
  },
});

export const remove = mutation({
  args: {
    fileId: v.id("files"),
  },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.fileId);
  },
});
