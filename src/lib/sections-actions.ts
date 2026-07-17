import { createServerFn } from "@tanstack/react-start";

export const getSections = createServerFn({ method: "GET" }).handler(async () => {
  // Por ahora retornamos un array vacío hasta que implementemos Convex
  return [];
});

export const createSection = createServerFn({ method: "POST" })
  .validator((data: { name: string; description: string; imageUrl?: string; order: number }) => data)
  .handler(async ({ data }) => {
    // Implementación pendiente de Convex
    console.log("Creating section:", data);
    return { success: true };
  });

export const updateSection = createServerFn({ method: "POST" })
  .validator((data: { id: string; name?: string; description?: string; imageUrl?: string; order?: number }) => data)
  .handler(async ({ data }) => {
    // Implementación pendiente de Convex
    console.log("Updating section:", data);
    return { success: true };
  });

export const deleteSection = createServerFn({ method: "POST" })
  .validator((data: { id: string }) => data)
  .handler(async ({ data }) => {
    // Implementación pendiente de Convex
    console.log("Deleting section:", data);
    return { success: true };
  });
