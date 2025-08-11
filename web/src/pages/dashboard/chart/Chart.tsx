import useDashboardData from '@/hooks/useDashboard'
import ReactECharts from 'echarts-for-react'

const Chart = (): JSX.Element => {
  const { donation } = useDashboardData()
  const option = {
    title: {
      text: 'مجموع التبرعات',
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
    },
    axisLabel: {
      fontFamily: 'DIN Next LT W23',
    },
    xAxis: {
      type: 'category',
      data: donation?.map((val) => val.month),
      axisLabel: {
        rotate: 45,
      },
    },
    yAxis: {
      type: 'value',
      axisLabel: {
        fontFamily: 'DIN Next LT W23',
      },
    },
    series: [
      {
        type: 'bar',
        data: donation?.map((val) => val.number),
        itemStyle: {
          color: (params: any) => {
            const colors = [
              '#ae96c5',
              '#eccc92',
              '#70a3ca',
              '#c3c6ca',
              '#9cc9ae',
              '#ae96c5',
              '#eccc92',
              '#70a3ca',
              '#c3c6ca',
              '#9cc9ae',
              '#ae96c5',
              '#eccc92',
              '#70a3ca',
              '#c3c6ca',
              '#9cc9ae',
            ]
            return colors[params.dataIndex]
          },
        },
      },
    ],
  }

  return (
    <div className="bg-[#F4F4F4]  p-4 xl:p-8">
      <ReactECharts option={option} theme={'my_theme'} />
    </div>
  )
}

export default Chart
