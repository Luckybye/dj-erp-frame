<template lang="html">
    <div class="bottom">
      <div class="text-right mb10">
        <ideal-button skin="blue" icon="tianjia" width="80px" @click="addSku"></ideal-button>
      </div>
      <x-table :datas="datas" v-ref:datatable>
        <x-table-column label="图片" width="10%">
          <ideal-td-img :src="_row.main_pic" @click="_self.onOpenProd(_row)"></ideal-td-img>
        </x-table-column>
        <x-table-column label="品名" width="15%">
          <div class="line-1 text-blue cursor" @click="_self.onOpenProd(_row)">
            {{_row.prod_name || _row.prod_name_en}}</div>
          <div class="text-grey">{{_row.prod_no}}</div>
        </x-table-column>
        <x-table-column label="SKU编码" width="15%">
        </x-table-column>
        <x-table-column label="规格" width="15%">
        </x-table-column>
        <x-table-column label="单位" width="10%" prop="prod_unit">
        </x-table-column>
        <x-table-column label="FOB价" width="15%">
          {{_row.fob_curr}} {{_row.fob_price}}
        </x-table-column>
        <x-table-column label="起订量" width="10%">
        </x-table-column>
        <x-table-column label="操作" width="10%">
          <ideal-icon-btn skin="blue" @click="_self.onDelete(_row)" v-if="!_self.readonly">
            上架
          </ideal-icon-btn>
        </x-table-column>
        <div slot="nodata">No data</div>
      </x-table>
    </div>
</template>
<script>
  export default {
    options: {title: 'SKU'},
    data () {
      return {
      }
    },
    methods: {
      initialize () {
      },
      addSku () {},
      onOpenProd (item) {
        let title = item.x_sub_prod_id || 'prod'
        let opts = {
          name: title,
          method: 'PmEdit',
          feature: 'blank',
          pageId: item.sub_prod_id,
          opt: { title, prod_id: item.sub_prod_id, status: item.status },
          isActive: false
        }
        this.$openPage(opts)
      }
    },
    components: {
    },
    created () {
    }
  }
</script>
