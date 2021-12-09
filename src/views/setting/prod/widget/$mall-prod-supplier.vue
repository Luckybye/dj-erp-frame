<template lang="html">
  <div class="">
    <x-table :data="profileDatas">
      <x-table-column label="一级目录">
        <el-checkbox
          v-model="config[row.key].status"
          :disabled="!isOperate"
          true-label="normal"
          false-label="stopped"
          @change="onSetValue('supplier_com_profile_config')" slot-scope="{row}">{{row.text}}</el-checkbox>
      </x-table-column>
      <x-table-column label="二级目录">
        <div v-if="row.param" width="100%" slot-scope="{row}">
          <el-checkbox
            style="width:100%"
            v-for="item in row.param"
            :key="item.key"
            v-model="config[row.key].param[item.key]"
            :disabled="!isOperate || (config[row.key].status === 'stopped') || item.disabled"
            @change="onSetValue('supplier_com_profile_config')"
          >{{item.text}}</el-checkbox>
        </div>
        <div v-else>
          无
        </div>
      </x-table-column>
    </x-table>
  </div>
</template>

<script>
export default {
  options: {title: '供应商'},
  data () {
    return {
      instance: '',
      config: {
        com_overview: {
          status: 'stopped',
          param: {
            com_v_p: false,
            com_details: false
          }
        },
        prod_capacity: {
          status: 'stopped',
          param: {
            prod_flow: false,
            prod_equ: false,
            factory_info: false,
            ann_prod_cap: false
          }
        },
        quality_con: {
          status: 'stopped',
          param: {
            test_equ: false
          }
        },
        r_d_capacity: {
          status: 'stopped',
          param: {
            certifications: false,
            prod_certifications: false,
            patents: false,
            trademarks: false,
            r_d: false
          }
        },
        main_markets: {
          status: 'stopped',
          param: {
            main_markets: false
          }
        },
        factory_insp_rep: {
          status: 'stopped',
          param: {
          }
        }
      },
      profileDatas: [
        {
          text: 'Company Overview',
          key: 'com_overview',
          param: [
            {
              text: 'Company video and photos',
              key: 'com_v_p'
            },
            {
              text: 'Company Details',
              key: 'com_details'
            }
          ]
        },
        {
          text: 'PRODUCT CAPACITY',
          key: 'prod_capacity',
          param: [{
            text: 'Production Flow',
            key: 'prod_flow'
          }, {
            text: 'Production Equipment',
            key: 'prod_equ'
          }, {
            text: 'Factory Information',
            key: 'factory_info'
          }, {
            text: 'Annual Production Capacity',
            key: 'ann_prod_cap'
          }]
        },
        {
          text: 'QUALITY CONTROL',
          key: 'quality_con',
          param: [
            {
              text: 'Test Equipment',
              key: 'test_equ'
            }
          ]
        },
        {
          text: 'R&D CAPACITY',
          key: 'r_d_capacity',
          param: [
            {
              text: 'Certifications',
              key: 'certifications'
            }, {
              text: 'Production Certification',
              key: 'prod_certifications'
            }, {
              text: 'Patents',
              key: 'patents'
            }, {
              text: 'Trademarks',
              key: 'trademarks'
            }, {
              text: 'Research & Development',
              key: 'r_d'
            }
          ]
        },
        {
          text: 'Main Markets',
          key: 'main_markets',
          param: [
            {
              text: 'Main Markets',
              key: 'main_markets'
            }
          ]
        },
        {
          text: 'Factory inspection reports',
          key: 'factory_insp_rep',
          param: []
        }
      ]
    }
  },
  methods: {
    getConfigure (field) {
      field = field || 'supplier_com_profile_config'
      this.$get('/api/support/getConfigure', {
        field,
        instance: this.$state('me').com_id
      }, {loading: true}).then(v => {
        v[field] && Object.assign(
          this.config,
          v[field]
        )
      })
    },
    onSetValue (field) {
      field = field || 'supplier_com_profile_config'
      this.$configure.setValue(field, {
        [field]: this.config,
      }, this.$state('me').com_id)
    }
  },
  computed: {
    isOperate () {
      return !(this.$state('me').role !== '1' && this.$state('me').role !== '2')
    }
  },
  created () {
    this.getConfigure()
  }
}
</script>

<style lang="scss" scoped>
</style>
