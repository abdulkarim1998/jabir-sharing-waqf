import { z } from 'zod'

export const schema = z
  .object({
    title: z.string().min(2, 'لا بد أن يحتوي الاسم على حرفين على الأقل'),
    description: z
      .string()
      .min(2, 'لا بد أن يحتوي الوصف على حرفين على الأقل')
      .max(200, 'لا يجب أن يزيد الوصف عن 200 حرف'),
    address: z.string().min(2, 'لا بد أن تحتوي المدينة على حرفين على الأقل'),
    isActive: z.boolean(),
    isComplete: z.boolean(),
  })
  .partial()
