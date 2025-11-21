import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";
import { authTables } from "@convex-dev/auth/server";

const applicationTables = {
  friends: defineTable({
    userId: v.id("users"),
    name: v.string(),
    favoriteDonut: v.optional(v.string()),
  }).index("by_user", ["userId"]),
  
  donuts: defineTable({
    name: v.string(),
    description: v.string(),
    imageUrl: v.string(),
  }),
};

export default defineSchema({
  ...authTables,
  ...applicationTables,
});
