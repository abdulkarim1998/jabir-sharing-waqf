import { Image } from '@mantine/core'

export const Icon = (title: string) => {
  switch (title) {
    case 'مجموع المؤسسات':
      return <Image radius="md" src="./TotalOrganisation.svg" />
    case 'مجموع المشاريع':
      return <Image radius="md" src="./TotalProjects.svg" />
    case 'مجموع المساهمين':
      return <Image radius="md" src="./TotalDonators.svg" />
    case 'مجموع التبرعات':
      return <Image radius="md" src="./TotalDonations.svg" />
    case 'أنواع الأسهم':
      return <Image radius="md" src="./Types.svg" />

    default:
      return null
  }
}
