import { z } from 'zod'

export const contentSchema = z.object({
	id: z.number(),
	databaseId: z.number(),
	author: z.string(),
	date: z.date(),
	title: z.string(),
	content: z.string(),
	uri: z.string(),
	veepdotaiPrompt: z.string().optional(),

	veepdotaiDomain: z.string().optional(),
	veepdotaiSubDomain: z.string().optional(),
	veepdotaiCategory: z.string().optional(),
	veepdotaiSubCategory: z.string().optional(),
	veepdotaiArtefactType: z.string().optional(),
	veepdotaiMetadata: z.string().optional(),

	tvfMetadata: z.string().optional(),
	tvfDomain: z.string().optional(),
	tvfSubDomain: z.string().optional(),
	tvfCategory: z.string().optional(),
	tvfSubCategory: z.string().optional(),
	tvfArtefactType: z.string().optional(),

	tvfSubtitle: z.string().optional(),
	tvfStatus: z.string().optional(),
	tvfPubDate: z.string().optional(),
	tvfUpd: z.string().optional(),
	tvfDown: z.string().optional(),

});
