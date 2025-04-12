import { pgTable, text, serial, integer, boolean, timestamp, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

// Pricing item schema
export const pricingItemSchema = z.object({
  id: z.string(),
  name: z.string().min(1, "Item name is required"),
  unitPrice: z.number().min(0, "Price cannot be negative"),
  quantity: z.number().int().min(1, "Quantity must be at least 1"),
});

export type PricingItem = z.infer<typeof pricingItemSchema>;

// Define Proposal schema
export const proposals = pgTable("proposals", {
  id: serial("id").primaryKey(),
  clientName: text("client_name").notNull(),
  services: text("services").array().notNull(),
  pricing: jsonb("pricing").notNull(),
  startDate: text("start_date").notNull(),
  endDate: text("end_date").notNull(),
  notes: text("notes"),
  totalAmount: integer("total_amount").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertProposalSchema = createInsertSchema(proposals).omit({
  id: true,
  createdAt: true,
});

export const proposalSchema = z.object({
  id: z.number().optional(),
  clientName: z.string().min(1, "Client name is required"),
  services: z.array(z.string()).min(1, "At least one service must be selected"),
  pricing: z.array(pricingItemSchema).min(1, "At least one pricing item is required"),
  startDate: z.string().min(1, "Start date is required"),
  endDate: z.string().min(1, "End date is required"),
  notes: z.string().optional(),
  totalAmount: z.number(),
  createdAt: z.date().optional(),
});

export type InsertProposal = z.infer<typeof insertProposalSchema>;
export type Proposal = typeof proposals.$inferSelect;
export type ProposalWithDate = z.infer<typeof proposalSchema>;
