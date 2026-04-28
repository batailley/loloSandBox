import { z } from 'zod';

export const HostMeSchema = z.object({
  name: z.string(),
  email: z.string().email(),
  avatarInitials: z.string().max(3),
});
export type HostMe = z.infer<typeof HostMeSchema>;

export const HostFeatureSchema = z.object({
  id: z.string(),
  name: z.string(),
  route: z.string(),
  description: z.string(),
});
export type HostFeature = z.infer<typeof HostFeatureSchema>;

export const HostFeaturesSchema = z.object({
  features: z.array(HostFeatureSchema),
});
export type HostFeatures = z.infer<typeof HostFeaturesSchema>;
