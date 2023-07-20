import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const list = query({
  args: {},
  handler: async (ctx) => {
    // Grab the most recent messages.
    const messages = await ctx.db.query("messages").order("desc").take(100);

    return messages.reverse();
  },
});

export const send = mutation({
  args: { body: v.string(), author: v.string() },
  handler: async (ctx, { body, author }) => {
    // Send a new message.
    await ctx.db.insert("messages", { body, author });
  },
});

export const like = mutation({
  args: { liker: v.string(), messageId: v.id("messages") },
  handler: async (ctx, args) => {
    // Save a user's "like" of a particular message
    await ctx.db.insert("likes", {
      liker: args.liker,
      messageId: args.messageId,
    });
  },
});
