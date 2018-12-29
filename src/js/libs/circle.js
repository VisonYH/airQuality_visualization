import * as d3 from 'd3'
import axios from 'axios'
export default class Circle {
  constructor (dom, data, dataOptions) {
    this.showInnerText = true
    this.innerRadius = 15
    this.outerRadius = 25
    this.type = dataOptions.type
    this.currentData = data
    this.spaceScale = dataOptions.spaceScale
    this.time = dataOptions.time
    this.timeScale = dataOptions.timeScale
    this.space = dataOptions.space
    this.color = d3.scaleThreshold().domain([50, 100, 150, 200, 300]).range([d3.rgb(0, 153, 102), d3.rgb(255, 222, 51), d3.rgb(255, 153, 51), d3.rgb(204, 0, 51), d3.rgb(102, 0, 153), d3.rgb(126, 0, 35)])
    let body = d3.select(dom)
    if (body.selectAll('svg').size() > 0) {
      this.svg = body.select('svg')
    } else {
      this.svg = body.append('svg').attr('class', 'circleContainer')
    }
    // 每一个circle实例
    this.newCircle = this.svg.append('g')
    this._bindClick(this.newCircle)
    this.createCircle(data, {
      innerRadius: this.innerRadius,
      outerRadius: this.outerRadius,
      timeScale: dataOptions.timeScale,
      space: this.space
    })
  }
  createCircle (data, options) {
    this.newCircle.selectAll('g').remove()
    this.newCircle.selectAll('title').remove()
    let {innerRadius, outerRadius} = options
    var arcsData = d3.pie().padAngle(0.01).value(d => 1)(data)
    this.newCircle.append('title')
    this.newCircle.select('title').text(`${this.space} ${this.type}`)
    this.newCircle.attr('label', options.timeScale).attr('address', options.space)
    var arcGroup = this.newCircle.selectAll('g').data(arcsData).enter().append('g').attr('label', (d) => {
      return d.data.date
    })
    this.arc = d3.arc().innerRadius(innerRadius).outerRadius(outerRadius)
    arcGroup.append('path').attr('fill', (d, i) => {
      return this.color(d.data.value)
    }).attr('d', (d) => {
      return this.arc(d)
    })
    // arcGroup.append('text').attr('transform', (d) => {
    //   let rotate = d.startAngle / Math.PI * 180 + (d.endAngle - d.startAngle) / Math.PI * 180 / 2
    //   return `translate(${arc.centroid(d)}) rotate(${rotate})`
    // }).attr('text-anchor', 'middle').attr('dominant-baseline', 'middle').attr('fill', 'white').attr('font-size', '10px').text((d) => d.data.date.slice(4))

    // 中心文字
    if (this.showInnerText) {
      let text = data[0].date.substring(0, data[0].date.length - 2)
      let innerGroup = this.newCircle.append('g').attr('class', 'inner').attr('label', text)
      innerGroup.append('circle').attr('cx', 0).attr('cy', 0).attr('r', innerRadius).attr('fill', '#34333280')
      innerGroup.append('text').attr('text-anchor', 'middle').attr('dominant-baseline', 'middle').attr('fill', 'white').attr('font-size', '8px').text(text)
    }
  }

  _bindClick (newCircle) {
    newCircle.on('click', (e) => {
      let time = d3.event.target.parentNode.getAttribute('label')
      // 点击的是内部
      if (d3.event.target.parentNode.getAttribute('class')) {
        if (time.length === 4) {
          return 0
        } else {
          time = time.substring(0, time.length - 2)
        }
      } else {
        if (time.length === 10) {
          console.log('达到最大层级')
          return 0
        }
      }
      axios.post('http://localhost:8080/api/circle/update', {
        time,
        space: this.space,
        type: this.type,
        spaceScale: this.spaceScale
      }).then(res => {
        this.createCircle(res.data, {
          innerRadius: this.innerRadius,
          outerRadius: this.outerRadius,
          timeScale: time,
          space: this.space
        })
      })
    })
    newCircle.on('mouseover', () => {
      newCircle.attr('cursor', 'pointer')
    })
  }
  updateRadius (zoom, spaceScale) {
    let oldRadius = this.outerRadius
    this.getRadiusByZoom(zoom, spaceScale)
    if (oldRadius !== this.outerRadius) {
      this.createCircle(this.currentData, {
        innerRadius: this.innerRadius,
        outerRadius: this.outerRadius,
        timeScale: this.timeScale,
        space: this.space
      })
    }
  }
  updatePos (x, y) {
    this.newCircle.attr('transform', `translate(${x}, ${y})`)
  }

  getRadiusByZoom (zoom, spaceScale) {
    if (spaceScale === 'all') {
      if (zoom > 6) {
        this.newCircle.attr('display', 'block')
        this.showInnerText = true
        this.innerRadius = 30
        this.outerRadius = 40
      } else if (zoom > 5 && zoom <= 6) {
        this.newCircle.attr('display', 'block')
        this.showInnerText = true
        this.innerRadius = 20
        this.outerRadius = 35
      } else if (zoom > 3.5 && zoom <= 5) {
        this.newCircle.attr('display', 'block')
        this.showInnerText = true
        this.innerRadius = 10
        this.outerRadius = 20
      } else if (zoom < 3.5 && zoom >= 2.5) {
        this.newCircle.attr('display', 'block')
        this.showInnerText = false
        this.innerRadius = 0
        this.outerRadius = 10
      } else if (zoom <= 2.5 && zoom > 1.5) {
        this.newCircle.attr('display', 'block')
        this.showInnerText = false
        this.innerRadius = 0
        this.outerRadius = 5
      } else if (zoom <= 1.5) {
        this.newCircle.attr('display', 'none')
      }
    } else if (spaceScale === 'province') {
      if (zoom > 6) {
        this.newCircle.attr('display', 'block')
        this.showInnerText = true
        this.innerRadius = 20
        this.outerRadius = 30
      } else if (zoom > 5 && zoom <= 6) {
        this.newCircle.attr('display', 'block')
        this.showInnerText = true
        this.innerRadius = 15
        this.outerRadius = 25
      } else if (zoom > 3.5 && zoom <= 5) {
        this.newCircle.attr('display', 'block')
        this.showInnerText = false
        this.innerRadius = 0
        this.outerRadius = 10
      } else if (zoom < 3.5 && zoom > 2.5) {
        this.newCircle.attr('display', 'block')
        this.showInnerText = false
        this.innerRadius = 0
        this.outerRadius = 5
      } else if (zoom <= 2.5) {
        this.newCircle.attr('display', 'none')
      }
    }
  }
}
