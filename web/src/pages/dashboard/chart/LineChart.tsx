import useDashboardData from '@/hooks/useDashboard'
import ReactECharts from 'echarts-for-react'

const LineChart = (): JSX.Element => {
  const { monthlyDonors } = useDashboardData()
  const option = {
    title: {
      text: 'تحليل بيانات المتبرعين',
      left: 'center',
      textStyle: {
        fontFamily: 'DIN Next LT W23',
      },
    },
    xAxis: {
      type: 'category',
      data: monthlyDonors?.map((val) => val.month),
      axisLabel: {
        rotate: 45,
      },
    },
    tooltip: {
      trigger: 'item',
    },
    yAxis: {
      type: 'value',
    },
    axisLabel: {
      fontFamily: 'DIN Next LT W23',
    },
    yxisLabel: {
      fontFamily: 'DIN Next LT W23',
    },
    series: [
      {
        data: monthlyDonors?.map((val) => val.number),

        type: 'line',
      },
    ],
  }
  return (
    <div className="bg-[#F4F4F4] p-8">
      <ReactECharts
        option={option}
        style={{ height: '500px' }}
        theme={'my_theme'}
      />
    </div>
  )
}

export default LineChart
