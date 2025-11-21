import { v } from "convex/values";
import { query } from "./_generated/server";

export const list = query({
  args: {},
  returns: v.array(
    v.object({
      _id: v.id("donuts"),
      _creationTime: v.number(),
      name: v.string(),
      description: v.string(),
      imageStorageId: v.optional(v.id("_storage")),
      image: v.union(v.string(), v.null()),
    })
  ),
  handler: async (ctx) => {
    const donuts = await ctx.db.query("donuts").collect();

    return await Promise.all(
      donuts.map(async (donut) => {
        const image = donut.imageStorageId
          ? await ctx.storage.getUrl(donut.imageStorageId)
          : null;

        return {
          ...donut,
          image,
        };
      })
    );
  },
});
