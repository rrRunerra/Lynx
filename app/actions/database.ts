"use server";

import prisma from "@/lib/prisma";

export async function getDatabaseRows(
  modelName: string,
  page: number,
  limit: number = 100
) {
  try {
    // Basic validation to prevent arbitrary property access
    // In a real app, you might want more strict validation against a whitelist of allowed models
    const model = (prisma as any)[modelName];

    if (!model) {
      return { error: `Model ${modelName} not found` };
    }

    const skip = (page - 1) * limit;

    const [data, total] = await Promise.all([
      model.findMany({
        skip,
        take: limit,
      }),
      model.count(),
    ]);

    return {
      data,
      total,
      hasMore: skip + limit < total,
    };
  } catch (error: any) {
    console.error(`Error fetching rows for ${modelName}:`, error);
    return { error: error.message || "Failed to fetch data" };
  }
}

export async function deleteDatabaseRow(
  modelName: string,
  keyField: string,
  value: any
) {
  try {
    const model = (prisma as any)[modelName];
    if (!model) return { error: `Model ${modelName} not found` };

    await model.delete({
      where: {
        [keyField]: value,
      },
    });

    return { success: true };
  } catch (error: any) {
    console.error(`Error deleting row from ${modelName}:`, error);
    return { error: error.message || "Failed to delete row" };
  }
}

export async function updateDatabaseRow(
  modelName: string,
  keyField: string,
  value: any,
  data: any
) {
  try {
    const model = (prisma as any)[modelName];
    if (!model) return { error: `Model ${modelName} not found` };

    // Remove the key field from data to avoid trying to update the primary key (usually not allowed or needed)
    const { [keyField]: _, ...updateData } = data;

    await model.update({
      where: {
        [keyField]: value,
      },
      data: updateData,
    });

    return { success: true };
  } catch (error: any) {
    console.error(`Error updating row in ${modelName}:`, error);
    return { error: error.message || "Failed to update row" };
  }
}
