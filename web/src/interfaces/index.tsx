export interface Organization {
  id: string
  name: string
  description: string
  location: string
  email: string
  phone: number
  isActive: boolean
  twitter: string
  instagram: string
  website: string
  logo: string
}

export interface OrganizationTableData extends Omit<Organization, 'isActive'> {
  isActive: string
}

export interface Header {
  key: string
  value: string
}

export interface OrganizationCardData {
  id: string
  name: string
  description: string
  projectValue: number
  payments: number
  logo: string
  donors: number
  projects: number
  totalAmount: number
  endowmentReceived: number
  location: string
  projectIds: string[]
  twitter: string
  instagram: string
  email: string
  phone: number
  website: string
}

export interface CardComponentProps {
  data: OrganizationCardData
}

export interface FoundationProfileProps {
  data: OrganizationCardData
  isSelected: boolean
  donors: number
  totalValue: number
  numOfProjects: number
}

export interface ProjectCardData {
  id: string
  title: string
  description: string
  value: number
  location: string
  organizationId: string
}

export interface ProjectCardProps {
  project: ProjectCardData
  orgLogo: string
  showLogoAndName: boolean
  marginTop: string
}

export enum UserRole {
  ADMIN = 'admin',
  ORGANIZATION = 'organization_admin',
  USER = 'user',
}

export interface User {
  firstName: string
  lastName: string
  email: string
  id: string
  role: UserRole
  phone: number
}

export interface Project {
  id: string
  title: string
  description: string
  value: number
  isActive: boolean
  isComplete: boolean
  address: string
}

export enum WaqfType {
  ramadan = 'ramadan',
  personal = 'personal',
  gift = 'gift',
  motherGift = 'mother',
  eidGift = 'eid',
}

export interface WaqfCards {
  id: number
  svg: string
  name: string
  waqfType: WaqfType
}

export interface WaqfCardsProps {
  waqf: WaqfCards
  setSelectedWaqfType: React.Dispatch<React.SetStateAction<WaqfType>>
  selectedWaqfType: WaqfType
}

export interface Donor {
  donorName: string
  donorPhoneNumber: string
  donorEmail: string
  numberOfSaham: number
}

export interface Recipient {
  recipientName?: string
  recipientPhone?: string
  recipientAddress?: string
  messageText?: string
}

export interface GiftDetail {
  recipientName?: string
  recipientPhone?: string
  recipientAddress?: string
  messageText?: string
  recipientRelationship: number
}

export interface DonationContribution {
  projectId: string
  waqfTypeId: string
  donorName: string
  donorEmail: string
  donorPhoneNumber: string
  numberOfSaham: number
  waqfType: number
  giftDetails?: GiftDetail[]
  amount: string
}

export interface DashboardCard {
  id: string
  title: string
  number: number
}

export interface Donation {
  id: string
  month: string
  number: number
}
export interface MonthlyDonors {
  id: string
  month: string
  number: number
}

export interface DonationsByWaqfType {
  id: string
  waqfTypeName: string
  donationAmount: number
}
export interface WaqfTypes {
  id: string
  type: number
  name: string
  description: string
  isActive: boolean
  fixedAmount: number
  requiresRelationship: boolean
}

export interface FinancialStatus {
  totalDonatedAmount: number
  remainingAmount: number
}
