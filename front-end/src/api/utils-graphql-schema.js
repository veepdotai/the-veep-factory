import { z } from 'zod'

export const contentSchema = z.object({
	id: z.number(),
	databaseId: z.number(),
	author: z.string(),
	date: z.date(),
	content: z.string(),
	title: z.string(),
	uri: z.string(),
	veepdotaiPrompt: z.string().optional(),
});
