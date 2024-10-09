import { z } from "zod"

// We're keeping a simple non-relational schema here.
// IRL, you will have a schema for your data models.
const preschema = z.object({
  id: z.string(),
  title: z.string(),
  //type: z.string(),
  status: z.string(),
  label: z.string(),
  priority: z.string(),
  //date: z.string(),
})

export const schema = preschema.partial()
export type Data = z.infer<typeof schema>
