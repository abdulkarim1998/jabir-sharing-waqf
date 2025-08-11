import useDashboardData from '@/hooks/useDashboard'
import ReactECharts from 'echarts-for-react'

const PieChart = (): JSX.Element => {
  const { donationsByWaqfType } = useDashboardData()
  const options = {
    title: {
      text: 'الأسهم / الأوقاف',
      left: 'center',
      textStyle: {
        fontFamily: 'DIN Next LT W23',
      },
    },
    tooltip: {
      trigger: 'item',
    },
    legend: {
      orient: 'vertical',
      left: 'left',
      textStyle: {
        fontFamily: 'DIN Next LT W23',
      },
      itemGap: 20,
    },
    series: [
      {
        type: 'pie',
        radius: '75%',
        data: donationsByWaqfType?.map((val) => ({
          value: val.donationAmount,
          name: val.waqfTypeName,
          label: {
            fontFamily: 'DIN Next LT W23',
          },
        })),
      },
    ],
  }
  return (
    <div className="bg-[#F4F4F4] p-4 xl:p-8">
      <ReactECharts option={options} theme={'my_theme'} />
    </div>
  )
}

export default PieChart
