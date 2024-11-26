"use node";
import { Configuration, OpenAIApi } from "openai";
import { action } from "./_generated/server";
import { api } from "./_generated/api";
import { v } from "convex/values";

export const chat = action({
	args: { body: v.string(), author: v.string() },
	handler: async (ctx, { body, author }) => {
		const { messages, botMessageId } = await ctx.runMutation(api.messages.send, { author, body });
		const fail = async (reason: string) => {
			throw new Error(reason);
		};
		// Grab the API key from environment variables
		// Specify this in your dashboard: `npx convex dashboard`
		const apiKey = process.env.OPENAI_API_KEY;
		if (!apiKey) {
			await fail("Add your OPENAI_API_KEY as an env variable");
		}
		const configuration = new Configuration({ apiKey });
		const openai = new OpenAIApi(configuration);

		const openaiResponse = await openai.createChatCompletion({
			model: "gpt-3.5-turbo",
			messages: [
				...(messages.map(({ body, author }) => ({
					role: author,
					content: body,
				})) as any),
			],
		});
		if (openaiResponse.status !== 200) {
			await fail("OpenAI error: " + openaiResponse.statusText);
		}
		const response = openaiResponse.data.choices[0].message?.content;
		console.log("Response: " + response);
	},
});
