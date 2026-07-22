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
    // Verificar si hay productos con esta categoría
    const productsWithCategory = await ctx.db
      .query("products")
      .filter((q) => q.eq(q.field("categoryId"), args.id))
      .collect();

    if (productsWithCategory.length > 0) {
      throw new Error("La categoría tiene productos asignados");
    }

    await ctx.db.delete(args.id);
  },
});
