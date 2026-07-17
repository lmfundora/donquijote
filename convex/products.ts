import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const list = query({
  args: {},
  handler: async (ctx) => {
    const products = await ctx.db.query("products").collect();
    return await Promise.all(
      products.map(async (product) => {
        if (!product.imageUrl) return product;
        
        // Extraer storageId si es una URL completa
        const storageId = product.imageUrl.startsWith("http") 
          ? product.imageUrl.split("/api/storage/")[1] || product.imageUrl
          : product.imageUrl;
        
        try {
          const url = await ctx.storage.getUrl(storageId as any);
          return { ...product, imageUrl: url };
        } catch {
          // Si falla, devolver el producto sin imagen
          return { ...product, imageUrl: null };
        }
      })
    );
  },
});

export const listBySection = query({
  args: { sectionId: v.id("sections") },
  handler: async (ctx, args) => {
    const products = await ctx.db
      .query("products")
      .withIndex("by_section", (q) => q.eq("sectionId", args.sectionId))
      .collect();

    return await Promise.all(
      products.map(async (product) => {
        if (!product.imageUrl) return product;

        const storageId = product.imageUrl.startsWith("http")
          ? product.imageUrl.split("/api/storage/")[1] || product.imageUrl
          : product.imageUrl;

        try {
          const url = await ctx.storage.getUrl(storageId as any);
          return { ...product, imageUrl: url };
        } catch {
          return { ...product, imageUrl: null };
        }
      })
    );
  },
});

export const getById = query({
  args: { id: v.id("products") },
  handler: async (ctx, args) => {
    const product = await ctx.db.get(args.id);
    if (!product) return null;
    
    if (!product.imageUrl) return product;
    
    // Extraer storageId si es una URL completa
    const storageId = product.imageUrl.startsWith("http") 
      ? product.imageUrl.split("/api/storage/")[1] || product.imageUrl
      : product.imageUrl;
    
    try {
      const url = await ctx.storage.getUrl(storageId as any);
      return { ...product, imageUrl: url };
    } catch {
      return { ...product, imageUrl: null };
    }
  },
});

export const create = mutation({
  args: {
    name: v.string(),
    description: v.string(),
    imageUrl: v.optional(v.string()),
    price: v.number(),
    categoryId: v.optional(v.id("categories")),
    sectionId: v.id("sections"),
    allergens: v.optional(v.array(v.string())),
  },
  handler: async (ctx, args) => {
    const newProduct = {
      name: args.name,
      description: args.description,
      imageUrl: args.imageUrl,
      price: args.price,
      categoryId: args.categoryId,
      sectionId: args.sectionId,
      allergens: args.allergens,
    };
    const id = await ctx.db.insert("products", newProduct);
    return { id };
  },
});

export const update = mutation({
  args: {
    id: v.id("products"),
    name: v.optional(v.string()),
    description: v.optional(v.string()),
    imageUrl: v.optional(v.string()),
    price: v.optional(v.number()),
    categoryId: v.optional(v.id("categories")),
    sectionId: v.optional(v.id("sections")),
    allergens: v.optional(v.array(v.string())),
  },
  handler: async (ctx, args) => {
    const { id, ...updates } = args;
    await ctx.db.patch(id, updates);
  },
});

export const remove = mutation({
  args: {
    id: v.id("products"),
  },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
  },
});

export const generateUploadUrl = mutation({
  args: {},
  handler: async (ctx) => {
    return await ctx.storage.generateUploadUrl();
  },
});
