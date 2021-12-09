<template>
 <div class="prod-thead-setting">
  <div v-for="items in datas" :key="items.title">
    <div class="title"> {{ $tt(items, 'title') }}</div>
    <div class="button-list">
        <div class="button" v-for="item in items.sub" :key="item.key">
          <div>{{ $tt(item, 'title') }}</div>
          <el-button type="text" @click="onEdit(item)">{{$t('edit')}}</el-button>
        </div>
    </div>
  </div>
 </div>
</template>

<script>
export default {
  options: {
    icon: 'icon-set',
    title: '产品配置'
  },
  data() {
    return {
      show: [
        {
          title: 'Web端',
          title_en: 'Web端',
          sub: [
            {title: '产品卡', title_en: '产品卡', key: 'web_prod', path: 'SetProdPage', query: {billType: 'meet'}},
            {title: '产品列表 缩略', title_en: '产品列表 缩略', key: 'web_prod_list', path: 'ProdTheadSettingDetail', query: { type: 'meeting_prod_list', filter: 'qu_th'}},
            {title: '产品列表 详情', title_en: '产品列表 详情', key: 'web_prod_list_detail', path: 'ProdTheadSettingDetail', query: { type: 'meeting_prod_list_detail', filter: 'qu_th'}},
          ],
        },
        {
          title: 'App端',
          title_en: 'App端',
          sub: [
            {title: '产品卡', title_en: '产品卡', key: 'app_prod', path: 'MeetingProdCard', query: {prod_display: {type: 'qu', field: 'meet_prod_display'}}},
            // {title: '产品列表', title_en: '产品列表 缩略', key: 'app_prod_list', path: 'MeetingProdCard', query: {prod_display: {type: 'qu', field: 'meet_app_prod_list'}}},
          ]
        },
        {
          title: 'Pad端',
          title_en: 'Pad端',
          sub: [
            {title: '产品卡', title_en: '产品卡', key: 'pad_prod', path: 'MeetingProdCard', query: {prod_display: {type: 'qu', field: 'meet_pad_prod_display'}}},
            // {title: '产品列表 缩略', title_en: '产品列表 缩略', key: 'pad_prod_list', path: 'MeetingProdCard', query: {prod_display: {type: 'qu', field: 'meet_pad_prod_list'}}},
            // {title: '产品列表 详情', title_en: '产品列表 详情', key: 'pad_prod_list_detail', path: 'MeetingProdCard', query: {prod_display: {type: 'qu', field: 'meeting_pad_prod_list_detail'}}},
          ]
        },
      ]
    };
  },
  methods: {
    init() {
      this.datas = this.show
    },
    onEdit(item) {
      this.$tab.open({
        title: item.title,
        title_en: item.title_en,
        tab_id: item.key,
        path: item.path,
        query: item.query
      })
    }
  },
  created() {
    this.init();
  },
};
</script>
<style lang="scss">
.prod-thead-setting {
  .title {
    padding-left: 10px;
    border-left: 3px solid #000;
    border-color: #409EFF !important;
    color: #409EFF !important;
    margin-top: 10px;
    margin-bottom: 10px;;
  }
  .button-list {
    width: 100%;
    display: inline-block;
    .button {
      display: inline-block;
      border: 1px solid #c0ccda;
      border-radius: 5px;
      padding: 10px;
      width: 25%;
      margin: 0 0 10px 10px;
      text-align: center;
    }
  }
}
</style>