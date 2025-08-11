import { z } from 'zod'

export const schema = z
  .object({
    firstName: z.string().min(2, 'لا بد أن يحتوي الاسم على حرفين على الأقل'),
    lastName: z.string().min(2, 'لا بد أن يحتوي الاسم على حرفين على الأقل'),
    phone: z
      .string()
      .min(8, 'أدخل رقم الهاتف بشكل صحيح')
      .max(8, 'أدخل رقم الهاتف بشكل صحيح'),
    email: z.string().email({ message: 'اكتب البريد الإلكتروني بشكل صحيح' }),
  })
  .partial()
