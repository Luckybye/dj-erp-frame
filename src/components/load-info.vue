<template>
  <div class="loading-info b-box" :class="{mobile: mobile}">
    <slot></slot>
    <div class="flex-1 load-content">
      <div v-for="(val, key) in loadInfo" :key="key" class="flex l-item flex-wrap" :class="{'empty-load': !val.count}">
        <div class="load-icon">
          <i class="el-icon-success text-lightgrey" :class="{'text-green': val.percent}"></i>
          <i class="iconfont icon-transport2 ml5"></i>
        </div>
        <div class="flex-1 relative progress">
          <el-progress :text-inside="true" :stroke-width="36" :percentage="val.percent > 100 ? 100 : val.percent" color="#5cd992" :show-text="false" class="inline-block">
          </el-progress>
          <div class="flex-b progress-text">
            <span v-show="val.value" class="flex-middle">
              <div v-for="item in getVal(val.value)" :key="item">{{item}}</div>
            </span>
            <span class="flex-middle">{{val.text}}</span>
          </div>
          <span class="flex-middle">
            <i v-if="val.count" class="ml5 text-green text-bold vm">× {{val.count}}</i>
          </span>
        </div>
        <!-- <div class="lh-22"><span>{{$t('limit')}}: {{val.limit}}</span></div> -->
      </div>
    </div>
  </div>
</template>
<script>

function handlerRest (gw, cbm, v) {
  if (cbm <= 28) {
    v.gp20.percent = max(gw / 22, cbm / 28) * 100
    v.gp20.value = `${cbm}CBM/${gw}MT`
    v.gp20.count = v.gp20.count + 1
  }
  if (cbm > 28 && cbm <= 58) {
    v.gp40.percent = max(gw / 22, cbm / 58) * 100
    v.gp40.value = `${cbm}CBM/${gw}MT`
    v.gp40.count = v.gp40.count + 1
  }
  if (cbm > 58 && cbm <= 68) {
    v.hq40.percent = max(gw / 22, cbm / 68) * 100
    v.hq40.value = `${cbm}CBM/${gw}MT`
    v.hq40.count = v.hq40.count + 1
  }
}

const {floor, ceil, max} = Math

export default {
  props: {
    vm: {
      type: Object,
      default () {
        return {
        }
      }
    },
    mobile: Boolean
  },
  data () {
    return {}
  },
  computed: {
    loadInfo () {
      let gw = ((this.vm.gw / 1000) || 0).toFixed(5) * 1
      let cbm = (this.vm.cbm || 0).toFixed(3) * 1
      let v = {
        gp20: {text: '20GP', value: '', limit: '28.00CBM / 22MT', percent: 0, count: 0},
        gp40: {text: '40GP', value: '', limit: '58.00CBM / 22MT', percent: 0, count: 0},
        hq40: {text: '40HC', value: '', limit: '68.00CBM / 22MT', percent: 0, count: 0}
      }
      if (!gw && !cbm) return v

      if (gw <= 22 && cbm <= 68) {
        handlerRest(gw, cbm, v)
        return v
      }

      let n = floor(gw / 22)
      let ny = (gw % 22).toFixed(5) * 1
      let m = floor(cbm / 68)
      let my = (cbm % 68).toFixed(3) * 1 || 0
      console.log(n, ny, m, my, 1111111111)
      // let showValue = (m, my, n, ny, c) => `${m ? `${m}*${c}` : ''}${m && my ? '+' : ''}${my || ''}CBM/${n ? n + '*22' : ''}${n && ny ? '+' : ''}${ny || ''}MT`
      let showValue = (m, my, n, ny, c) => `${(m * c + my).toFixed(3) * 1 || 0}CBM/${(n * 22 + ny).toFixed(5) * 1 || 0}MT`
      if (n > m) {
        // 重货
        v.gp20 = {
          ...v.gp20,
          percent: max(ny / 22, my / 28) * 100,
          value: showValue(floor(cbm / 28), (cbm % 28).toFixed(3) * 1 || 0, n, ny, 28),
          // value: showValue(cbm, gw),
          count: max(ceil(gw / 22), ceil(cbm / 28))
        }
      } else {
        // 抛货
        v.hq40 = {
          ...v.hq40,
          count: m,
          percent: 100,
          // value: showValue(cbm, gw),
          value: showValue(m, 0, n, 0, 68)
        }
        if (my > 58) {
          v.hq40.value = showValue(m, my, n, ny, 68)
        } else if (my > 0) handlerRest(ny, my, v)
      }
      return v
    }
  },
  methods: {
    getVal (str) {
      return str.split('/')
    }
  }
}
</script>
<style lang="scss">
  .loading-info {
    margin-top: 0.2rem;
    position: relative;
    .l-item {
      // height: 30px;
      // line-height: 30px;
      max-width: 500px;
      min-width: 280px;
      // padding-bottom: 0.1rem;
      padding: 0.1rem 0;
      &:last-child {
        margin-bottom: 0;
      }
    }
    .load-icon {
      height: fit-content;
      align-self: center;
    }
    .empty-load {
      display: none;
    }
    .el-progress {
      width: calc(100% - 50px);
      // margin-top: 4px;
      min-width: 190px;
    }
    .progress {
      // margin: 0.05rem 0;
      display: flex;
    }
    .progress-text {
      position: absolute;
      min-width: 190px;
      width: calc(100% - 50px);
      left: 0;
      top: 0;
      padding: 0 0.1rem;
      font-size: 0.12rem;
      height: 100%;
    }
    .lh-22 {
      line-height: 22px;
    }
    .title {
      min-width: 80px;
      font-weight: 600;
      margin-bottom: 0.05rem;
      font-size: 0.15rem;
      padding: 0 0.2rem;
    }
    .el-icon-success {
      font-size: 0.18rem;
    }
    .icon-transport2 {
      font-size: 0.21rem;
    }
    .progress {
      margin: 0 0.1rem;
    }
    .popper__arrow {
      position: absolute;
      top: calc(50% - 5px);
      right: -15px;
      border-left: 7px solid red;
      width: 15px;
      height: 15px;
      border-color: white;
      display: none;
      &:after {
        content: " ";
        position: absolute;
        left: -10px;
        top: 1px;
        width: 12px;
        height: 12px;
        border-width: 1px;
        border-style: solid;
        border-color: #c0c1c5;
        transform: rotate(45deg);
        border-left-width: 0;
        border-bottom-width: 0;
        filter: blur(2px)
      }
    }
  }
</style>
