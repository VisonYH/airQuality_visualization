<template>
  <div class='catType'>
    <ul>
      <li class="item-head">图层</li>
      <li class="items" v-for="(type, index) in types" @click="selectItem(index)" :key="type" :class="{'active-item': index === activeIndex}">
        <span>{{type}}</span>
      </li>
    </ul>
  </div>
</template>

<script>
import {mapGetters} from 'vuex'
import {addCircleLayer, removeCircleLayer} from '../../js/layers/circleLayer.js'
import {addHeatLayer, removeHeatLayer} from '../../js/layers/heatLayer.js'
import {addStationLayer, removeStationLayer} from '../../js/layers/stationLayer.js'
export default {
  data () {
    return {
      types: ['热力图', '环图', '站点'],
      currentLayer: 0,
      activeIndex: null
    }
  },
  computed: {
    ...mapGetters(['map', 'spaceScale', 'spaceScaleArr', 'catType', 'timeScale', 'timeScaleArr', 'catType'])
  },
  methods: {
    selectItem (index) {
      this.activeIndex = index
      this.currentLayer = this.types[index]
      this.drawlayer()
    },
    removeOtherLayer () {
      removeHeatLayer(this.map)
      removeStationLayer(this.map)
      removeCircleLayer(this.map)
    },
    drawlayer () {
      if (this.currentLayer === '站点') {
        this.removeOtherLayer()
        addStationLayer(this.map, this.spaceScaleArr, this.spaceScale)
      } else if (this.currentLayer === '热力图') {
        this.removeOtherLayer()
        let scale = this.spaceScale ? this.spaceScale : 'all'
        let address = this.spaceScaleArr ? this.spaceScaleArr : 'all'
        let catType = this.catType ? this.catType : 'AQI'
        addHeatLayer(this.map, scale, address, catType)
      } else if (this.currentLayer === '环图') {
        this.removeOtherLayer()
        addCircleLayer(this.map, this.spaceScale, this.spaceScaleArr[this.spaceScaleArr.length - 1], this.timeScale, this.timeScaleArr, this.catType)
      }
    }
  },
  mounted () {
  },
  watch: {
    spaceScale () {
      this.drawlayer()
    },
    timeScaleArr () {
      this.drawlayer()
    },
    catType () {
      this.drawlayer()
    }
  }
}
</script>

<style scoped lang='less'>
.catType{
  position: absolute;
  right: 0;
  top: 20%;
  transform: translate(0, -50%);
  ul{
    list-style: none;
    background: rgba(0, 0, 0, 1);;
    margin: 0;
    padding: 0 8px;
    .items{
      height: 28px;
      line-height: 28px;
      width: 40px;
      text-align: center;
      color: rgba(255, 255, 255, 0.5);
      transition: all .3s ease;
      cursor: pointer;
      font-size: 12px;
      border-bottom: 2px solid rgba(0, 0, 0, 1);;
    }
    .items:hover{
      border-bottom: 2px solid rgb(255, 205, 50);
    }
    .active-item{
      border-bottom: 2px solid rgb(255, 205, 50);
    }
    .item-head{
      height: 28px;
      line-height: 28px;
      width: 40px;
      text-align: center;
      color: rgba(255, 255, 255, 0.5);
      transition: all .3s ease;
      cursor: pointer;
      font-size: 12px;
      border-bottom: 2px solid rgba(0, 0, 0, 1);
      color: rgb(255, 205, 50);
      background: rgba(0, 0, 0, 1);
      border: none;
      font-size: 14px;
    }
  }
}
</style>
