import { z } from 'zod'

export const donorSchema = z
  .object({
    donorName: z
      .string()
      .min(2, 'لا بد أن يحتوي الاسم على حرفين على الأقل')
      .or(z.literal(''))
      .optional(),
    donorPhoneNumber: z
      .string()
      .min(8, 'أدخل رقم الهاتف بشكل صحيح')
      .max(8, 'أدخل رقم الهاتف بشكل صحيح')
      .or(z.literal(''))
      .optional(),
    donorEmail: z
      .string()
      .email({ message: 'اكتب البريد الإلكتروني بشكل صحيح' })
      .or(z.literal(''))
      .optional(),
    numberOfSaham: z
      .number()
      .min(1, 'الحد الأدنى سهم واحد!')
      .max(100, 'الحد الأقصى 100 سهم!'),
  })
  .partial()

export const recipientsSchema = z.object({
  recipients: z
    .object({
      recipientName: z
        .string()
        .min(2, 'لا بد أن يحتوي الاسم على حرفين على الأقل')
        .or(z.literal(''))
        .optional(),
      recipientPhone: z
        .string()
        .min(8, 'أدخل رقم الهاتف بشكل صحيح')
        .max(8, 'أدخل رقم الهاتف بشكل صحيح')
        .or(z.literal(''))
        .optional(),
      recipientAddress: z
        .string()
        .email({ message: 'اكتب البريد الإلكتروني بشكل صحيح' })
        .or(z.literal(''))
        .optional(),

      messageText: z
        .string()
        .min(0)
        .max(100, 'يجب أن لا تزيد الرسالة عن 100 حرف!'),
    })
    .array(),
})
