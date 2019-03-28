import G2 from '@antv/g2'

export default function (newData, dom, timeScale) {
  var chart = new G2.Chart({
    container: dom,
    forceFit: true,
    padding: [80]
  })
  chart.source(newData)
  chart.scale('value', {
    min: 0,
    alias: '浓度值'
  })
  chart.scale('date', {
    range: [0, 1],
    alias: '日期'
  })
  chart.tooltip({
    crosshairs: {
      type: 'line'
    }
  })
  chart.line().position('date*value')
  chart.point().position('date*value').size(4).shape('circle').style({
    stroke: '#fff',
    lineWidth: 1
  })
  chart.axis('date', {
    label: {
      formatter: (val) => {
        return formatByTimeScale(timeScale, val)
      }
    },
    title: true
  })
  chart.axis('value', {
    title: true
  })
  chart.render()
  return chart
}

function formatByTimeScale (scale, value) {
  if (scale === 'month') {
    value = parseInt(value.substring(6, 8))
    if (value % 3 === 1) {
      return value
    } else {
      return ' '
    }
  } else if (scale === 'year') {
    return value.substring(4, 6)
  } else if (scale === 'day') {
    value = parseInt(value)
    if (value % 4 === 0) {
      return value + 'h'
    } else {
      return ' '
    }
  }
}
