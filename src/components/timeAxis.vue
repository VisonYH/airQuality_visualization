<template>
  <div class="timeAxis">
  </div>
</template>

<script>
import * as d3 from 'd3'
export default {
  name: 'timeAxis',
  data () {
    return {
      timeInterval: [new Date(2015, 0, 1, 0), new Date(2019, 0, 1, 0)], // 初始化时间范围
      tickObj: [d3.timeMonth.every(12), d3.timeMonth.every(1), d3.timeDay.every(1), d3.timeHour.every(1)], // 不同的tick，防止tick改变带来其他数据更新
      tick: null, // 当前使用的tick
      zoomLevel: 1, // 设置zoom等级，默认为第一级
      xAxis: null, // 坐标轴
      innerG: null, // 用来放置滚动组件（两个圆和一个矩形）
      g: null, // 用来放innerG和坐标
      selectedTimeInterval: null // 选取的时间
    }
  },
  props: {
    height: {
      type: Number,
      default: 100
    },
    width: {
      type: Number,
      default: 700
    }
  },
  computed: {
    // 比例尺
    xScale () {
      let xScale = d3.scaleTime().domain(this.timeInterval).range([0, 630])
      return xScale
    },
    // 滚动组件的圆的定位数据
    circleData () {
      return [{
        cx: 0,
        cy: 0,
        r: 5
      }, {
        cx: this.tickValue[1],
        cy: 0,
        r: 5
      }]
    },
    // 滚动组件的矩形定位数据
    rectData () {
      return [{x: 0,
        y: -50,
        height: 50,
        width: this.tickValue[1]
      }]
    },
    // 坐标轴每个刻度的位置
    tickValue () {
      return this.xScale.ticks(this.tick).map(item => this.xScale(item)) // 刻度数组
    }
  },
  watch: {
    selectedTimeInterval (newVal, oldVal) {
      let format = d3.timeFormat('%Y-%m-%d-%H')
      newVal = newVal.map(item => format(item))
      this.$emit('change', newVal)
    },
    // 监听缩放级别的变化,变化就重绘
    zoomLevel (newLevel, oldLevel) {
      // 这里的if语句是判断从大比例尺回到小比例尺时，获取小比例尺的时间范围
      if (newLevel === 2 && oldLevel === 3) {
        let format = d3.timeFormat('%Y')
        let year = format(this.xScale.invert(this.circleData[0].cx))
        this.timeInterval = [new Date(year, 0, 1, 0), new Date(parseInt(year) + 1, 0, 1, 0)]
      } else if (newLevel === 1 && oldLevel === 2) {
        this.timeInterval = [new Date(2015, 0, 1, 0), new Date(2019, 0, 1, 0)]
      } else if (newLevel === 3 && oldLevel === 4) {
        let formatM = d3.timeFormat('%M')
        let formatY = d3.timeFormat('%Y')
        let year = formatY(this.xScale.invert(this.circleData[0].cx))
        let month = formatM(this.xScale.invert(this.circleData[0].cx))
        this.timeInterval = [new Date(year, month, 1, 0), new Date(year, parseInt(month + 1), 1, 0)]
      } else { // 这种情况是小比例尺到大比例尺
        this.timeInterval = [this.xScale.invert(this.circleData[0].cx), this.xScale.invert(this.circleData[1].cx)]
      }
      // 更新timeInterval之后再重绘
      this.$nextTick(() => {
        this.tick = this.tickObj[newLevel - 1]
        this.repaint(this.innerG, this.g, this.xAxis)
      })
    }
  },
  methods: {
    getSelectedTimeInterval () {
      this.selectedTimeInterval = [this.xScale.invert(this.circleData[0].cx), this.xScale.invert(this.circleData[1].cx)]
    },
    // 模拟磁吸附，判断吸附到哪个坐标
    belongsTo (num) {
      let dragBound = this.getBound()
      let i = 0
      while (num > dragBound[i]) {
        i++
      }
      return this.tickValue[i]
    },
    // 获取每段吸附区间的范围
    getBound () {
      let dragBound = this.xScale.ticks(this.tick)
      dragBound.forEach((item, index) => {
        if (index !== 0) {
          dragBound[index - 1] = (this.xScale(dragBound[index - 1]) + this.xScale(item)) / 2
        }
      })
      dragBound[dragBound.length - 1] = 630
      return dragBound
    },
    // 拖动事件逻辑
    _bindDragEvent (innerG) {
      let dragHandler = d3.drag().on('drag', () => {
        if ((this.circleData[0].cx + d3.event.dx >= 0) && (this.circleData[1].cx + d3.event.dx <= 630)) {
          this.circleData[0].cx += d3.event.dx
          this.circleData[1].cx += d3.event.dx
          this.circleData[0].cx = this.circleData[0].cx >= 0 ? this.circleData[0].cx : 0
          this.circleData[1].cx = this.circleData[1].cx >= this.tickValue[1] ? this.circleData[1].cx : this.tickValue[1]
          this.rectData[0].x = this.circleData[0].cx
          innerG.selectAll('rect').data(this.rectData).attr('x', (d) => d.x)
          innerG.selectAll('circle').data(this.circleData).attr('cx', (d) => d.cx).attr('r', (d) => d.r)
        }
      }).on('end', () => {
        this.circleData[0].cx = this.belongsTo(this.circleData[0].cx)
        this.circleData[1].cx = this.tickValue[this.tickValue.indexOf(this.circleData[0].cx) + 1]
        this.rectData[0].x = this.circleData[0].cx
        this.rectData[0]['width'] = this.circleData[1].cx - this.circleData[0].cx
        innerG.selectAll('rect').data(this.rectData).attr('x', (d) => d.x)
        innerG.selectAll('circle').data(this.circleData).attr('cx', (d) => d.cx).attr('r', (d) => d.r)
        this.getSelectedTimeInterval()
      })
      // 鼠标悬浮时改变鼠标指针
      innerG.on('mouseover', () => {
        innerG.attr('cursor', 'move')
      })
      dragHandler(innerG)
    },
    // 重绘逻辑
    repaint (innerG, g, xAxis) {
      xAxis.scale(this.xScale).ticks(this.tick)
      // 这里的逻辑判断是为了格式化刻度文字
      if (this.zoomLevel === 1) {
        xAxis.scale(this.xScale).tickFormat(function (n, i) {
          return d3.timeFormat('%Y')(n)
        })
      } else if (this.zoomLevel === 2) {
        xAxis.scale(this.xScale).tickFormat(function (n, i) {
          if (i % 2 !== 0) return ''
          return d3.timeFormat('%y-%m')(n)
        })
      } else if (this.zoomLevel === 3) {
        xAxis.scale(this.xScale).tickFormat(function (n, i) {
          if (i % 3 !== 0) return ''
          return d3.timeFormat('%m-%d')(n)
        })
      } else {
        xAxis.scale(this.xScale).tickFormat(function (n, i) {
          if (i % 4 !== 0) return ''
          return d3.timeFormat('%m-%d-%H')(n)
        })
      }
      xAxis(g)
      this.circleData[0].cx = this.tickValue[0]
      this.circleData[1].cx = this.tickValue[1]
      this.rectData[0].x = this.circleData[0].cx
      this.rectData[0]['width'] = this.circleData[1].cx - this.circleData[0].cx
      innerG.selectAll('circle').data(this.circleData).attr('cx', (d) => d.cx).attr('r', (d) => d.r)
      innerG.selectAll('rect').data(this.rectData).attr('x', (d) => d.x).attr('y', (d) => d.y).attr('width', (d) => d.width)
      this.getSelectedTimeInterval()
    },
    _bindZoomEvent (innerG, g, xAxis) {
      // 绑定缩放事件
      let zoom = d3.zoom().on('zoom', () => {
        let k = d3.event['transform']['k']
        if (k <= 2) {
          this.zoomLevel = 1
        } else if (k > 2 && k <= 3) {
          this.zoomLevel = 2
        } else if (k > 3 && k <= 4) {
          this.zoomLevel = 3
        } else {
          this.zoomLevel = 4
        }
      })
      zoom(innerG)
    }
  },
  mounted () {
    let bodyDom = document.querySelector('.timeAxis')
    let body = d3.select(bodyDom)
    this.tick = this.tickObj[0]
    let svg = body.append('svg').attr('width', this.width).attr('height', this.height)
    let timeFormat = d3.timeFormat('%Y')
    this.xAxis = d3.axisBottom().scale(this.xScale).ticks(this.tick).tickFormat(timeFormat).tickSize(4, 6)
    this.g = svg.append('g').attr('transform', 'translate(50, 70)')
    this.innerG = this.g.append('g')
    this.innerG.selectAll('circle').data(this.circleData).attr('cx', (d) => d.cx).attr('r', (d) => d.r).enter().append('circle').attr('cx', (d) => d.cx).attr('cy', (d) => d.cy).attr('r', (d) => d.r).attr('fill', 'black')
    this.innerG.selectAll('rect').data(this.rectData).attr('x', (d) => d.x).attr('y', (d) => d.y).attr('width', (d) => d.width).enter().append('rect').attr('x', (d) => d.x).attr('y', (d) => d.y).attr('height', (d) => d.height).attr('width', (d) => d.width).attr('fill', 'rgba(255, 0, 0, 0.1)')
    this._bindDragEvent(this.innerG)
    this._bindZoomEvent(this.innerG, this.g, this.xAxis)
    this.xAxis(this.g)
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.hello{
  text-align: center
}
</style>
