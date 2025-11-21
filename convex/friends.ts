import { query, mutation } from "./_generated/server";
import { v } from "convex/values";
import { getAuthUserId } from "@convex-dev/auth/server";

export const list = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      return [];
    }
    
    return await ctx.db
      .query("friends")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .collect();
  },
});

export const add = mutation({
  args: {
    name: v.string(),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Must be logged in to add friends");
    }
    
    return await ctx.db.insert("friends", {
      userId,
      name: args.name,
    });
  },
});

export const updateDonutPreference = mutation({
  args: {
    friendId: v.id("friends"),
    donutName: v.string(),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Must be logged in");
    }
    
    const friend = await ctx.db.get(args.friendId);
    if (!friend || friend.userId !== userId) {
      throw new Error("Friend not found or not owned by user");
    }
    
    await ctx.db.patch(args.friendId, {
      favoriteDonut: args.donutName,
    });
  },
});

export const remove = mutation({
  args: {
    friendId: v.id("friends"),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Must be logged in");
    }
    
    const friend = await ctx.db.get(args.friendId);
    if (!friend || friend.userId !== userId) {
      throw new Error("Friend not found or not owned by user");
    }
    
    await ctx.db.delete(args.friendId);
  },
});
