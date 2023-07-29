import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const list = query({
	args: {},
	handler: async (ctx) => {
		// Grab the most recent messages.
		const messages = await ctx.db.query("messages").order("asc").take(100);

		return messages;
	},
});

export const send = mutation({
	args: { body: v.string(), author: v.string() },
	handler: async (ctx, { body, author }) => {
		// Send a new message.
		await ctx.db.insert("messages", { body, author });
	},
});

export const clearMessages = mutation({
	args: {},
	handler: async (ctx) => {
		// Clear all messages.
		const messages = await ctx.db.query("messages").collect();
		messages.forEach(async (message) => {
			await ctx.db.delete(message._id);
		});
	},
});
