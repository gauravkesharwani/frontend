import { z } from 'zod'

export const phoneSchema = z.string()
  .min(10, 'Phone number must be at least 10 digits')
  .regex(/^\+?[\d\s\-\(\)]+$/, 'Invalid phone number format')

// Helper to create a schema that accepts enum values OR "other:..." strings
const enumOrOther = <T extends string>(values: readonly [T, ...T[]]) =>
  z.union([z.enum(values), z.string().startsWith('other:')])

export const qualificationSchema = z.object({
  investorType: enumOrOther(['hnw', 'family_office'] as const),
  capacity: enumOrOther(['$100K-$250K', '$250K-$500K', '$500K-$1M', '$1M+'] as const),
  fit: enumOrOther(['high_priority', 'medium_priority', 'open_to_exploring', 'not_a_focus'] as const),
  process: enumOrOther(['toe_in', 'meaningful_first', 'full_commitment'] as const),
  timing: enumOrOther(['actively_deploying', 'possibly_evaluating', 'just_researching'] as const),
  score: z.number().min(0).max(100),
  bucket: z.enum(['active_intro', 'nurture', 'not_qualified']),
})

export const leadSchema = z.object({
  phoneNumber: phoneSchema,
  consent: z.boolean().refine((val) => val === true, {
    message: 'You must consent to be contacted',
  }),
  timestamp: z.string(),
  qualification: qualificationSchema.nullable(),
})

export type LeadFormData = z.infer<typeof leadSchema>

export const validatePhone = (phone: string): boolean => {
  try {
    phoneSchema.parse(phone)
    return true
  } catch {
    return false
  }
}

export const formatPhoneNumber = (value: string): string => {
  const cleaned = value.replace(/\D/g, '')
  const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/)
  if (match) {
    return `(${match[1]}) ${match[2]}-${match[3]}`
  }
  return value
}
