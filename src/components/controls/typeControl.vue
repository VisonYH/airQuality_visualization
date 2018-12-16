<template>
  <div class='catType'>
    <ul>
      <li class="item-head">类型</li>
      <li class="items" v-for="(type, index) in types" @click="selectItem(index)" :key="type" :class="{'active-item': index === activeIndex}">
        <span>{{type}}</span>
      </li>
    </ul>
  </div>
</template>

<script>
import {mapGetters, mapMutations} from 'vuex'
export default {
  data () {
    return {
      types: ['AQI', 'PM2.5', 'PM10', 'CO', 'NO2', 'SO2'],
      activeIndex: 0
    }
  },
  computed: {
    ...mapGetters(['spaceScale', 'spaceScaleArr', 'catType'])
  },
  methods: {
    ...mapMutations(['mMap', 'mCatType']),
    selectItem (index) {
      this.activeIndex = index
      this.mCatType(this.types[index])
    }
  }
}
</script>

<style scoped lang='less'>
.catType{
  position: absolute;
  right: 0;
  top: 50%;
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
