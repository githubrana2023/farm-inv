import { TThrowableScanType } from "@/constants/throwable/type";
import { inventoryDb } from "@/drizzle/db/inventory-db";
import { throwableTable } from "@/drizzle/schema/inventory";
import { and, eq } from "drizzle-orm";

export const deleteThrowableByIdAndType = async (id: string, type: TThrowableScanType) => {
    try {
        await inventoryDb.delete(throwableTable).where(and(
            eq(throwableTable.id, id),
            eq(throwableTable.type, type),
        ))
    } catch (error) {

    }
}