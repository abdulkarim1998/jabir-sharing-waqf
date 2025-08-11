import { WaqfCards, WaqfType } from '@/interfaces'
import {
  personalWaqf,
  ramadanWaqf,
  giftWaqf,
  motherGift,
  eidGift,
} from '@/assets'

export const waqfCards: WaqfCards[] = [
  { id: 1, svg: personalWaqf, name: 'وقف شخصي', waqfType: WaqfType.personal },
  { id: 2, svg: ramadanWaqf, name: 'وقف رمضان', waqfType: WaqfType.ramadan },
  { id: 3, svg: giftWaqf, name: 'وقف الهدية', waqfType: WaqfType.gift },
  { id: 4, svg: motherGift, name: 'هدية الأم', waqfType: WaqfType.motherGift },
  { id: 5, svg: eidGift, name: 'هدية العيد', waqfType: WaqfType.eidGift },
]
