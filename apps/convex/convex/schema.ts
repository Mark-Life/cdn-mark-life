import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  users: defineTable({
    authId: v.string(),
    email: v.string(),
    name: v.string(),
  }).index("by_authId", ["authId"]),

  accounts: defineTable({
    name: v.string(),
    slug: v.string(),
    createdAt: v.number(),
  }).index("by_slug", ["slug"]),

  files: defineTable({
    accountId: v.id("accounts"),
    s3Key: v.string(),
    fileName: v.string(),
    contentType: v.string(),
    sizeBytes: v.number(),
    uploadedBy: v.string(),
    createdAt: v.number(),
  })
    .index("by_account", ["accountId"])
    .index("by_account_and_key", ["accountId", "s3Key"]),
});
