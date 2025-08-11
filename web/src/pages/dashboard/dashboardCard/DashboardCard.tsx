import { Icon } from './type'

interface DashboardCardProps {
  title: string
  number: number
}

const DashboardCard = ({ title, number }: DashboardCardProps): JSX.Element => {
  return (
    <div className="rounded-xl bg-[#F4F4F4] p-7 flex items-center">
      <div className="pl-5 pb-1">{title && Icon(title)}</div>
      <div>
        <p className="text-gray-400 text-sm">{title}</p>
        <p className="text-2xl font-medium pt-2">
          {number}
          {title == 'مجموع التبرعات' && '  ر.ع'}
        </p>
      </div>
    </div>
  )
}

export default DashboardCard
