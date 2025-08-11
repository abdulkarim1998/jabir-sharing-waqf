import { MonthPickerInput } from '@mantine/dates'
import DashboardCard from './dashboardCard/DashboardCard'
import Chart from './chart/Chart'
import PiChart from './chart/PieChart'
import LineChart from './chart/LineChart'
import { useDashboard } from './context'
import useDashboardData from '@/hooks/useDashboard'
import AdminPage from '@/layouts/AdminPage'

const Dashboard = (): JSX.Element => {
  const { cardData } = useDashboardData()
  const { setValue, value } = useDashboard()

  return (
    <AdminPage>
      <div className="flex flex-wrap gap-5 justify-between items-end text-[#392C45] mt-5 mb-8 pb-2 border-b-2 w-full">
        <p>لوحة البيانات</p>
        <div className="flex flex-wrap gap-2">
          <MonthPickerInput
            label="من"
            placeholder="أختر التاريخ"
            value={value?.from}
            onChange={(newDate) => setValue({ from: newDate, to: null })}
            style={{ width: '10rem' }}
            mx="auto"
            maw={400}
          />
          <MonthPickerInput
            label="إلى"
            placeholder="أختر التاريخ"
            value={value?.to}
            minDate={value?.from}
            onChange={(newDate) => setValue({ ...value, to: newDate })}
            style={{ width: '10rem' }}
            mx="auto"
            maw={400}
          />
        </div>
      </div>
      <div className="grid xs:grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-5 justify-center mx-5">
        {cardData?.map((card) => (
          <DashboardCard
            title={card.title}
            number={card.number}
            key={card.id}
          />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-2 gap-10 py-5 items-center mx-5">
        <Chart />
        <PiChart />
      </div>
      <div className="grid grid-cols-1 mx-5">
        <LineChart />
      </div>
    </AdminPage>
  )
}

export default Dashboard
