import { pgTable, text } from "drizzle-orm/pg-core";
import { createInsertSchema } from 'drizzle-zod'
import { z } from "zod";

export const accounts = pgTable("accounts", {
    id: text("id").primaryKey(),
    plaidId: text("plaid_id"),
    name: text("name").notNull(),
    userId: text("user_id").notNull(),
});

export const insertAccountSchema = createInsertSchema(accounts, {
    name: z.string().min(1)
})