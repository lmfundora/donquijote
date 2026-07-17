import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const list = query({
  args: {},
  handler: async (ctx) => {
    const categories = await ctx.db.query("categories").collect();
    return categories;
  },
});

export const getById = query({
  args: { id: v.id("categories") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});

export const create = mutation({
  args: {
    name: v.string(),
  },
  handler: async (ctx, args) => {
    const newCategory = {
      name: args.name,
    };
    const id = await ctx.db.insert("categories", newCategory);
    return { id };
  },
});

export const update = mutation({
  args: {
    id: v.id("categories"),
    name: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { id, ...updates } = args;
    await ctx.db.patch(id, updates);
  },
});

export const remove = mutation({
  args: {
    id: v.id("categories"),
  },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
  },
});
