import { z } from 'zod';

export const HelloWorldGreetingSchema = z.object({
  message: z.string(),
  timestamp: z.string().datetime(),
});
export type HelloWorldGreeting = z.infer<typeof HelloWorldGreetingSchema>;
