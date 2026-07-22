import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  todos: defineTable({
    text: v.string(),
    completed: v.boolean(),
  }),
  sections: defineTable({
    name: v.string(),
    description: v.string(),
    imageUrl: v.optional(v.string()),
    order: v.number(),
    slug: v.optional(v.string()),
    showOnLanding: v.optional(v.boolean()),
  }).index("by_slug", ["slug"]).index("by_order", ["order"]),
  categories: defineTable({
    name: v.string(),
  }),
  products: defineTable({
    name: v.string(),
    description: v.string(),
    imageUrl: v.optional(v.string()),
    price: v.number(),
    categoryId: v.optional(v.id("categories")),
    sectionId: v.id("sections"),
    allergens: v.optional(v.array(v.string())),
    preparation: v.optional(v.string()),
    ingredients: v.optional(v.array(v.string())),
    slug: v.optional(v.string()),
  }).index("by_section", ["sectionId"]).index("by_slug", ["slug"]),
});
