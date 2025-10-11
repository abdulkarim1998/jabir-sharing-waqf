# Quick Checkout Component

## Component Structure

```
QuickCheckout/
├── QuickCheckout.tsx          # Main component
└── QuickCheckout.styles.tsx   # Styled components
```

## Features

### 1. Header Section
- **Sohar Islamic Logo**: Prominently displayed at the top
- **Title**: "الدفع السريع" (Quick Payment)
- **Amount Display**: Shows the donation amount in large, bold text

### 2. Card Form
The form includes three main fields:

#### Card Number
- Format: `XXXX XXXX XXXX XXXX`
- Validation: Exactly 16 digits
- Auto-formatting: Adds spaces every 4 digits
- Direction: LTR (left-to-right for card numbers)

#### Expiry Date
- Format: `MM/YY`
- Validation: Exactly 4 digits (2 for month, 2 for year)
- Auto-formatting: Adds slash after month
- Direction: LTR

#### CVV
- Format: `XXX`
- Validation: Exactly 3 digits
- Input Type: Password (masked)
- Direction: LTR

### 3. Action Buttons

#### Confirm Payment Button
- Text: "تأكيد الدفع"
- Disabled when: Form is incomplete or invalid
- Loading State: Shows "جاري المعالجة..." during processing
- Color: Primary blue (#255274)

#### Cancel Button
- Text: "إلغاء"
- Action: Returns to previous page
- Style: Subtle/text button

### 4. Success Modal
Appears after successful payment with:
- ✓ Green checkmark icon (80x80px circular)
- "تمت العملية بنجاح!" (Operation Successful!)
- "شكراً لتبرعكم الكريم" (Thank you for your generous donation)
- Amount display in green
- Auto-redirect to home page after 2 seconds

## Props and State

### Location State (from navigation)
```typescript
{
  amount: string,      // Donation amount
  projectId: string,   // Project ID (for future use)
  waqfTypeId: string   // Waqf type ID (for future use)
}
```

### Component State
```typescript
{
  cardNumber: string,      // 16-digit card number
  expiryDate: string,      // 4-digit expiry (MMYY)
  cvv: string,            // 3-digit CVV
  showSuccess: boolean,    // Success modal visibility
  isProcessing: boolean    // Payment processing state
}
```

## Color Scheme

- **Primary**: `#255274` (Navy Blue)
- **Primary Hover**: `#1F4460` (Darker Blue)
- **Success**: `#4CAF50` (Green)
- **Disabled**: `#C8D8E3` (Light Blue)
- **Text**: `#666666` (Gray)
- **Background**: `#FFFFFF` (White)

## Validation Rules

1. **Card Number**:
   - Only digits allowed
   - Exactly 16 characters
   - No special characters except spaces (auto-added)

2. **Expiry Date**:
   - Only digits allowed
   - Exactly 4 characters (MMYY)
   - Auto-adds slash after 2 digits

3. **CVV**:
   - Only digits allowed
   - Exactly 3 characters
   - Displayed as password

4. **Form Submit**:
   - Disabled until all fields are valid
   - Shows loading state during processing

## User Experience Flow

```
Project Page
    ↓ (Enter amount + Click "التبرع السريع")
Checkout Page
    ↓ (Enter card details)
Processing (1.5s)
    ↓
Success Modal
    ↓ (Auto-redirect after 2s)
Home Page
```

## Responsive Design

### Desktop (> 768px)
- Centered card layout
- Max width: 600px
- Comfortable padding
- Large input fields

### Mobile (< 768px)
- Full-width card
- Reduced padding
- Touch-friendly input sizes
- Stacked layout

## Integration Notes

### Current Implementation (Mock)
```typescript
setTimeout(() => {
  setIsProcessing(false)
  setShowSuccess(true)
  setTimeout(() => navigate('/'), 2000)
}, 1500)
```

### Future Implementation (Real Payment)
Replace mock with actual payment API:
```typescript
const response = await paymentAPI.process({
  amount,
  cardNumber,
  expiryDate,
  cvv,
  projectId,
  waqfTypeId
})
```

## Accessibility

- All form fields have labels
- Keyboard navigation supported
- Error states clearly indicated
- High contrast colors
- RTL support maintained for Arabic text
- LTR override for card details (international standard)

## Testing

### Manual Testing Checklist
- [ ] Enter valid card number (16 digits)
- [ ] Enter valid expiry (MMYY)
- [ ] Enter valid CVV (3 digits)
- [ ] Submit button enables when form is valid
- [ ] Submit button disabled when form is invalid
- [ ] Processing animation shows
- [ ] Success modal appears
- [ ] Auto-redirect to home works
- [ ] Cancel button returns to previous page
- [ ] Mobile responsive layout works
- [ ] RTL/LTR text directions are correct

### Test Data
For testing, use any 16-digit number:
- Card: `4111 1111 1111 1111`
- Expiry: `12/25`
- CVV: `123`

