import { z } from 'zod'

export const phoneSchema = z.string()
  .min(10, 'Phone number must be at least 10 digits')
  .regex(/^\+?[\d\s\-\(\)]+$/, 'Invalid phone number format')

export const leadSchema = z.object({
  investmentTimeline: z.string().min(1, 'Investment timeline is required'),
  capitalAvailable: z.string().min(1, 'Capital amount is required'),
  investmentPreferences: z.array(z.string()).min(1, 'At least one preference is required'),
  phoneNumber: phoneSchema,
  consent: z.boolean().refine((val) => val === true, {
    message: 'You must consent to be contacted',
  }),
  timestamp: z.string(),
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
