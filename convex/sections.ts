import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const list = query({
  args: {},
  handler: async (ctx) => {
    const sections = await ctx.db.query("sections").order("asc").collect();
    return await Promise.all(
      sections.map(async (section) => {
        if (!section.imageUrl) return section;
        
        // Extraer storageId si es una URL completa
        const storageId = section.imageUrl.startsWith("http") 
          ? section.imageUrl.split("/api/storage/")[1] || section.imageUrl
          : section.imageUrl;
        
        try {
          const url = await ctx.storage.getUrl(storageId as any);
          return { ...section, imageUrl: url };
        } catch {
          // Si falla, devolver la sección sin imagen
          return { ...section, imageUrl: null };
        }
      })
    );
  },
});

export const getById = query({
  args: { id: v.id("sections") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});

export const getBySlug = query({
  args: { slug: v.string() },
  handler: async (ctx, args) => {
    const section = await ctx.db
      .query("sections")
      .withIndex("by_slug", (q) => q.eq("slug", args.slug))
      .unique();
    if (!section) return null;

    if (!section.imageUrl) return section;

    const storageId = section.imageUrl.startsWith("http")
      ? section.imageUrl.split("/api/storage/")[1] || section.imageUrl
      : section.imageUrl;

    try {
      const url = await ctx.storage.getUrl(storageId as any);
      return { ...section, imageUrl: url };
    } catch {
      return { ...section, imageUrl: null };
    }
  },
});

export const create = mutation({
  args: {
    name: v.string(),
    description: v.string(),
    imageUrl: v.optional(v.string()),
    order: v.number(),
    slug: v.string(),
    showOnLanding: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("sections")
      .withIndex("by_slug", (q) => q.eq("slug", args.slug))
      .unique();
    if (existing) {
      throw new Error("La URL o slug ya está en uso por otra sección.");
    }

    const newSection = {
      name: args.name,
      description: args.description,
      imageUrl: args.imageUrl,
      order: args.order,
      slug: args.slug,
      showOnLanding: args.showOnLanding ?? true,
    };
    const id = await ctx.db.insert("sections", newSection);
    return { id };
  },
});

export const update = mutation({
  args: {
    id: v.id("sections"),
    name: v.optional(v.string()),
    description: v.optional(v.string()),
    imageUrl: v.optional(v.string()),
    order: v.optional(v.number()),
    slug: v.optional(v.string()),
    showOnLanding: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    const { id, ...updates } = args;

    if (updates.slug !== undefined) {
      const existing = await ctx.db
        .query("sections")
        .withIndex("by_slug", (q) => q.eq("slug", updates.slug!))
        .unique();
      if (existing && existing._id !== id) {
        throw new Error("La URL o slug ya está en uso por otra sección.");
      }
    }

    await ctx.db.patch(id, updates);
  },
});

export const remove = mutation({
  args: {
    id: v.id("sections"),
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
