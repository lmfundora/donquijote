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
          return { ...product, imageUrl: undefined };
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
          return { ...product, imageUrl: undefined };
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
      return { ...product, imageUrl: undefined };
    }
  },
});

export const getBySlug = query({
  args: { slug: v.string() },
  handler: async (ctx, args) => {
    const product = await ctx.db
      .query("products")
      .withIndex("by_slug", (q) => q.eq("slug", args.slug))
      .first();

    if (!product) return null;

    if (!product.imageUrl) return product;

    const storageId = product.imageUrl.startsWith("http")
      ? product.imageUrl.split("/api/storage/")[1] || product.imageUrl
      : product.imageUrl;

    try {
      const url = await ctx.storage.getUrl(storageId as any);
      return { ...product, imageUrl: url };
    } catch {
      return { ...product, imageUrl: undefined };
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
    preparation: v.optional(v.string()),
    ingredients: v.optional(v.array(v.string())),
    slug: v.string(),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("products")
      .withIndex("by_slug", (q) => q.eq("slug", args.slug))
      .first();
    if (existing) {
      throw new Error("El slug ya está en uso por otro producto.");
    }

    const newProduct = {
      name: args.name,
      description: args.description,
      imageUrl: args.imageUrl,
      price: args.price,
      categoryId: args.categoryId,
      sectionId: args.sectionId,
      allergens: args.allergens,
      preparation: args.preparation,
      ingredients: args.ingredients,
      slug: args.slug,
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
    preparation: v.optional(v.string()),
    ingredients: v.optional(v.array(v.string())),
    slug: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { id, ...updates } = args;

    if (updates.slug !== undefined) {
      const existing = await ctx.db
        .query("products")
        .withIndex("by_slug", (q) => q.eq("slug", updates.slug!))
        .first();
      if (existing && existing._id !== id) {
        throw new Error("El slug ya está en uso por otro producto.");
      }
    }

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
