import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const list = query({
	args: {},
	handler: async (ctx) => {
		// Grab the most recent messages.
		const messages = await ctx.db.query("messages").order("asc").take(100);
		// Grab the likes for each message.
		const messagesWithLikes = await Promise.all(
			messages.map(async (message) => {
				const likes = await ctx.db
					.query("likes")
					.withIndex("by_messageId", (q) => q.eq("messageId", message._id))
					.collect();
				return { ...message, likes };
			})
		);
		return messagesWithLikes;
	},
});

export const send = mutation({
	args: { body: v.string(), author: v.string() },
	handler: async (ctx, { body, author }) => {
		// Send a new message.
		await ctx.db.insert("messages", { body, author });
		const messages = await ctx.db
			.query("messages")
			.order("desc")
			.filter((q) => q.neq(q.field("body"), undefined))
			.take(21);
		messages.reverse();
		const botMessageId = await ctx.db.insert("messages", {
			author: "assistant",
			body: "",
		});
		return { messages, botMessageId };
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
		const likes = await ctx.db.query("likes").collect();
		likes.forEach(async (like) => {
			await ctx.db.delete(like._id);
		});
	},
});

export const like = mutation({
	args: { messageId: v.id("messages"), liker: v.string() },
	handler: async (ctx, { messageId, liker }) => {
		const isLiked = await ctx.db
			.query("likes")
			.filter((q) => q.and(q.eq(q.field("messageId"), messageId), q.eq(q.field("liker"), liker)))
			.first();
		if (isLiked) {
			ctx.db.delete(isLiked._id);
		} else {
			ctx.db.insert("likes", { messageId, liker });
		}
	},
});
