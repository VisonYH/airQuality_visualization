import G2 from '@antv/g2'

export default function (newData, dom) {
  var chart = new G2.Chart({
    container: dom,
    forceFit: true,
    padding: [80, 120, 20, 30]
  })
  chart.source(newData)
  chart.coord('polar')
  chart.legend({
    position: 'right',
    offsetY: -100
  })
  chart.axis(false)
  chart.interval().position('date*value').color('date', G2.Global.colors_pie_16).style({
    lineWidth: 1,
    stroke: '#fff'
  })
  chart.render()
  return chart
}
