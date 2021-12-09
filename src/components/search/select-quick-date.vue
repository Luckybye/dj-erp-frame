<template>
  <div
    class="x-component search-select-date-range-radio"
    :style="{ width: width }"
    :label="!!(label || $slots.label) + ''"
  >
    <label
      v-if="label || $slots.label"
      :style="{ width: labelWidth }"
      class="x-form-label"
    >
      <template v-if="!$slots.label">{{ label }}</template>
      <slot v-else name="label"></slot>
    </label>
    <x-check v-for="item in dateList" :key="item.text_en" :result="vm" field="x_date" :expect="item.text_en" :unexpect="item.text_en === 'all' ? 'three_month' : 'all'" :text="$tt(item, 'text')" class="mr10" @change="onChangeType"></x-check>
  </div>
</template>
<script>
import moment from 'dayjs'
export default {
  name: "select-date-range-radio",
  props: {
    label: {
      type: String,
      default: "",
    },
    labelWidth: {
      type: String,
      default: "auto",
    },
    width: {
      type: String,
      default: "",
    },
    clearable: {
      type: Boolean,
      default: true,
    },
    value: {
      type: [String, Array],
    },
    result: {
      type: Object,
      default() {
        return {};
      },
    },
    field: {
      type: String,
      default: "",
    },
    field2: {
      type: String,
      default: "",
    },
    readonly: [Boolean],
    disabled: [Boolean],
    disabledMap: {
      type: Object,
      default() {
        return {};
      },
    },
  },
  methods: {
    onChange(v) {
      this.$nextTick(() => {
        this.$emit("change", v);
        if (this.field) {
          this.$emit(
            "save",
            {
              [this.field]: this.result[this.field],
              [this.field2]: this.result[this.field2],
            },
            this.result
          );
        }
      });
    },
    onChangeType(v, x) {
      let temp = this.dateList.find(item => {
        if (item.text_en === this.vm.x_date) return item
      })
      this.result[this.field] = temp.key.begin_date
      this.result[this.field2] = temp.key.end_date
      this.$emit(
        "save",
        {
          [this.field]: this.result[this.field],
          [this.field2]: this.result[this.field2],
        },
        this.result
      );
    },
    sDate (s, l) {
      let d = moment()
      if (l) d = moment().subtract(l, s)
      // let d = moment().startOf(s)
      // if (l) d = moment().subtract(1, s).startOf(s)
      return new Date(d)
    },
    eDate (s, l) {
      // let d = moment().endOf(s)
      // if (l) d = moment().subtract(1, s).endOf(s)
      let d = moment()
      if (l) d = moment().subtract(l, s)
      return new Date(d)
    }
  },
  computed: {
    vmodel: {
      get: function() {
        let val = this.value;
        if (this.field) {
          if (this.result[this.field]) val = [this.result[this.field]];
          if (this.result[this.field2]) val = [this.result[this.field], this.result[this.field2]];
        }
        return val;
      },
      set: function(n) {
        this.$emit("input", n);
        if (this.field) {
          this.result[this.field] = (n || [])[0] || null;
          this.result[this.field2] = (n || [])[1] || null;
        }
      },
    },
  },
  data() {
    return {
      vm: { x_date: "all" },
      dateList: [
        {
          text_en: "three_month",
          text: "3月内",
          key: {
            begin_date: this.sDate("month", 3),
            end_date: new Date(),
          },
        },
        {
          text_en: "six_month",
          text: "6月内",
          key: {
            begin_date: this.sDate("month", 6),
            end_date: new Date(),
          },
        },
        {
          text_en: "last_year",
          text: "1年内",
          key: {
            begin_date: this.sDate("year", 1),
            end_date: new Date(),
          },
        },
        {
          text_en: "all",
          text: "不限",
          key: {
            begin_date: '',
            end_date: '',
          },
        },
      ],
    };
  },
  watch: {
    vmodel (n) {
      if (!n) {
        this.vm.x_date = 'all'
      }
    }
  },
  mounted() {},
  created() {},
};
</script>
<style lang="scss">
.search-select-date-range-radio {
  display: inline-flex !important;
}
</style>
