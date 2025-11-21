import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const list = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("donuts").collect();
  },
});

export const seed = mutation({
  args: {},
  handler: async (ctx) => {
    const existingDonuts = await ctx.db.query("donuts").collect();
    if (existingDonuts.length > 0) {
      return "Donuts already seeded";
    }
    
    const donuts = [
      {
        name: "Glazed",
        description: "Classic glazed donut with sweet glaze",
        imageUrl: "🍩",
      },
      {
        name: "Chocolate Frosted",
        description: "Chocolate cake donut with chocolate frosting",
        imageUrl: "🍫",
      },
      {
        name: "Strawberry Frosted",
        description: "Vanilla donut with pink strawberry frosting",
        imageUrl: "🍓",
      },
      {
        name: "Boston Cream",
        description: "Filled with custard and topped with chocolate",
        imageUrl: "🥧",
      },
      {
        name: "Jelly Filled",
        description: "Fluffy donut filled with sweet jelly",
        imageUrl: "🫐",
      },
      {
        name: "Old Fashioned",
        description: "Dense cake donut with a crispy exterior",
        imageUrl: "🥨",
      },
      {
        name: "Sprinkles",
        description: "Vanilla frosted with colorful sprinkles",
        imageUrl: "🌈",
      },
      {
        name: "Maple Bar",
        description: "Long donut with maple frosting",
        imageUrl: "🍁",
      },
    ];
    
    for (const donut of donuts) {
      await ctx.db.insert("donuts", donut);
    }
    
    return "Donuts seeded successfully";
  },
});
