<template>
  <div class="portal-home">
    <div class="home-menus flex wrap">
      <template v-for="(item, i) in homeMenus">
        <div class="h-m-item" :key="i" v-if="item.menus.length">
          <div class="_item-header flex-b">
            <div>
              <div :class="['_item-icon flex middle center', 'custom-color color-' + i % 13]">
                <x-icon type="sys" :icon="item.icon_code" v-if="item.icon_code"></x-icon>
                <span style="margin-top: -2px" v-else>{{item.title[0] || ''}}</span>
              </div>
              <span class="ml15 text-bold">{{$tt(item, 'title') || '-'}}</span>
            </div>
            <div class="flex middle pointer" v-if="item.shortcut" @click="shortcutClick(item)" >
              <!-- <span>{{getShortcutName(item)}}</span> -->
              <div :class="['cut-icon flex-middle', 'custom-color color-' + (i % 13)]" style="width:30px;height:30px">
                <i class="el-icon-plus" style="width:16px;height:16px;font-size:12px;line-height:17px;"></i>
              </div>
            </div>
          </div>
          <div class="_item-box flex wrap">
            <button class="_item menu-button" v-for="(m) in item.menus" :key="m.menu_id" @click="viewMenus(m)">
              <span class="flex center">
                <span class="text-overflow">{{$tt(m, 'menu_name')}}</span>
                <span class="text-red ml5">{{m.val1}}</span>
              </span>
            </button>
          </div>
        </div>
      </template>
    </div>
  </div>
</template>

<script>
import homeMenus from './home-menus'
import {menus} from '@/lib/menus'
export default {
  components: {
  },
  data () {
    return {
      homeMenus,
    }
  },
  methods: {
    viewMenus (item) {
      let tab = this.menusMap[item.menu_code]
      tab.title = item.menu_name
      tab.title_en = item.menu_name_en
      if (!tab) return
      this.$tab.open({...tab, tab_id: tab.menu_code})
    },
  },
  created () {
    this.menusMap = menus._object('id')
  }
}
</script>
<style lang="scss">
@mixin toMutiCol ($cols, $margin) {
  width: calc(#{100% / $cols} - #{$margin});
  margin-right: $margin * $cols / ($cols - 1);
  &:nth-child(#{$cols + 'n'}) {
    margin-right: 0;
  }
}
.portal-home {
  .home-panel {
    background-color: #fff;
    padding: 20px;
    padding-bottom: 0;
    border-radius: 8px;
    &+.home-panel {
      width: 40%;
      margin-left: 30px;
      flex: none;
    }
  }
  .home-menus {
    .h-m-item {
      background-color: #fff;
      box-shadow: 0px 6px 20px 0px rgba(0, 62, 100, 0.04);
      border-radius: 8px;
      margin-right: 15px;
      margin-bottom: 20px;
      overflow: hidden;
      @media screen and (max-width: 1400px) {
        @include toMutiCol(3, 15px);
      }
      @media screen and (min-width: 1400px) {
        @include toMutiCol(4, 15px);
      }
    }
    ._item-header {
      background: #CFD8DC;
      padding: 12px 20px;
      line-height: normal;
    }
    ._item-icon {
      position: relative;
      z-index: 1;
      color: #000;
      font-weight: 600;
      display: inline-flex;
      width: 30px;
      height: 30px;
      border-radius: 50%;
      background: var(--color);
      color: #fff;
    }
    ._item-box {
      padding: 20px;
    }
    ._item-del {
      position: absolute;
      right: 5px;
      top: 10px;
      color: var(--color-danger);
      cursor: pointer;
    }
    ._item-box {
    }
    ._item {
      margin-bottom: 10px;
      width: 100%;
      @media screen and (min-width: 900px) {
        width: calc(50% - 10px);
        &:nth-child(2n) {
          margin-left: 20px;
        }
      }
    }
  }
  .note-wrap {
    margin-left: -20px;
  }
  .note-item {
    width: calc(33.3333% - 20px);
    max-width: 300px;
    background: #ECEFF1;
    // border: 1px dashed grey;
    border-radius: 8px;
    padding: 10px 30px;
    margin-left: 20px;
    margin-bottom: 20px;
    line-height: normal;
    text-align: center;
    cursor: pointer;
    &:hover {
      background: #FFFFFF;
      box-shadow: 0px 9px 21px 0px rgba(93, 130, 170, 0.21);
    }
  }
  .note-item--1 {
    color: var(--color-red);
    font-size: 17px;
    font-weight: 600;
  }
  .note-item--2 {
    color: var(--color-blue);
    font-size: 17px;
    display: block;
    font-weight: 700;
    margin-top: 10px;
  }
  .cut-wrap {
    margin-left: -20px;
    height: 100%;
    padding-bottom: 20px;
    overflow: hidden;
    .custom-color {
      --color: #69C0FF;
      $colors: #597EF7, #FA8C16, #52C41A, #AD8B00, #D3ADF7, #13A8A8, #FF4D4F;
      @each $color in $colors {
      $i: index($colors, $color);
      &.color-#{$i} {
        --color: #{$color};
      }
    }
    }
  }
  .cut-item {
    width: calc(25% - 20px);
    max-width: 200px;
    min-width: 65px;
    // background: #ECEFF1;
    margin-left: 20px;
    margin-bottom: 20px;
    height: 100%;
    text-align: center;
    font-size: 17px;
    cursor: pointer;
    position: relative;
    display: flex;
    flex-direction: column;
    background: #FFFFFF;
    border-radius: 8px;
    border: 1px dashed #2963FF;
    &:hover {
      box-shadow: 0px 9px 21px 0px rgba(93, 130, 170, 0.21);
      // .cut-icon {
      //   transform: rotateY(180deg);
      //   transform-origin: 50% 50%;
      // }
    }
  }
  .cut-icon {
    transition: all 0.3s;
    width: 40px;
    height: 40px;
    margin: 0 auto;
    text-align: center;
    border-radius: 8px;
    background: var(--color);
    color: #fff;
    i {
      font-size: 15px;
      background-color: #fff;
      color:#333;
      width: 20px;
      height: 20px;
      border-radius:50%;
      line-height: 22px;
      align-self: center;
    }
  }
}
.tab-page.Home {
  background: transparent;
  box-shadow: none;
  padding: 0;
  ._bottom {
    display: none;
  }
}
</style>
