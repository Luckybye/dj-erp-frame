<template>
  <div
    class="x-component search-select-date-range-radio2 flex-1 clearfix"
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
    <x-check :result="result" :field="pm.check_key" :expect="pm.check_value" :unexpect="pm.check_value2" :text="$t('task.date_range')" :disabled="disabled || disabledMap[pm.field]"></x-check>
    <select-date-range
      class="flex-1 mr20"
      width="200px"
      :result="result"
      :field="pm.field"
      :field2="pm.field2"
      type="daterange"
      start-placeholder="Start"
      end-placeholder="End"
      :clearable="clearable"
      @change="onChange"
      :readonly="readonly"
      :disabled="disabled || disabledMap[pm.field] || (result[pm.check_key] !== pm.check_value)"
    ></select-date-range>
    <x-check :result="result" :field="pm.check_key" :expect="pm.check_value2" :unexpect="pm.check_value" :text="$t('task.pass')" :disabled="disabled || disabledMap[pm.field]"></x-check>
    <x-input
      :disabled="disabled || disabledMap[pm.field] || (result[pm.check_key] !== pm.check_value2)"
      :result="result"
      :field="pm.field3"
      width="100px"
      type="number"></x-input>
    <div class="x-form-label" width="100px"><t path="task.pass_now">天到现在</t></div>
  </div>
</template>
<script>
import moment from 'dayjs'
export default {
  name: "select-date-range-radio2",
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
    pm: {
      type: Object,
      default() {
        return {
          check_key: '',
          check_value: '',
          check_value2: '',
          field: '',
          field2: '',
          field3: ''
        };
      }
    },
    check_key: {
      type: String,
      default: "",
    },
    check_value: {
      type: String,
      default: "",
    },
    check_value2: {
      type: String,
      default: "",
    },
    field: {
      type: String,
      default: "",
    },
    field2: {
      type: String,
      default: "",
    },
    field3: {
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
        if (this.pm.field) {
          this.$emit(
            "save",
            {
              [this.pm.field]: this.result[this.pm.field],
              [this.pm.field2]: this.result[this.pm.field2],
              [this.pm.field3]: this.result[this.pm.field3],
            },
            this.result
          );
        }
      });
    },
    onChangeType(v, x) {
      let temp = this.dateList.find(item => {
        if (item.text_en === v) return item
      })
      this.result[this.pm.field] = temp.key.begin_date
      this.result[this.pm.field2] = temp.key.end_date
      this.$emit(
        "save",
        {
          [this.pm.field]: this.result[this.pm.field],
          [this.pm.field2]: this.result[this.pm.field2],
          [this.pm.field3]: this.result[this.pm.field3],
        },
        this.result
      );
    },
    sDate (s, l) {
      let d = moment().startOf(s)
      if (l) d = moment().subtract(1, s).startOf(s)
      return new Date(d)
    },
    eDate (s, l) {
      let d = moment().endOf(s)
      if (l) d = moment().subtract(1, s).endOf(s)
      return new Date(d)
    }
  },
  computed: {
    vmodel: {
      get: function() {
        let val = this.value;
        if (this.pm.field) {
          if (this.result[this.pm.field]) val = [this.result[this.pm.field]];
          if (this.result[this.pm.field2]) val = [this.result[this.pm.field], this.result[this.pm.field2]];
          if (this.result[this.pm.field3]) val = [this.result[this.pm.field], this.result[this.pm.field2], this.result[this.pm.field3]];
        }
        return val;
      },
      set: function(n) {
        this.$emit("input", n);
        if (this.pm.field) {
          this.result[this.pm.field] = (n || [])[0] || null;
          this.result[this.pm.field2] = (n || [])[1] || null;
          this.result[this.pm.field3] = (n || [])[2] || null;
        }
      },
    },
  },
  data() {
    return {
      vm: { x_date: "self_defined" },
      dateList: [
        {
          text_en: "this_year",
          text: "本年",
          key: {
            begin_date: this.sDate("year"),
            end_date: this.eDate("year"),
          },
        },
        {
          text_en: "this_quarter",
          text: "本季",
          key: {
            begin_date: this.sDate("quarter"),
            end_date: this.eDate("quarter"),
          },
        },
        {
          text_en: "this_month",
          text: "本月",
          key: {
            begin_date: this.sDate("month"),
            end_date: this.eDate("month"),
          },
        },
        {
          text_en: "last_year",
          text: "上年",
          key: {
            begin_date: this.sDate("year", 1),
            end_date: this.eDate("year", 1),
          },
        },
        {
          text_en: "last_quarter",
          text: "上季",
          key: {
            begin_date: this.sDate("quarter", 1),
            end_date: this.eDate("quarter", 1),
          },
        },
        {
          text_en: "last_month",
          text: "上月",
          key: {
            begin_date: this.sDate("month", 1),
            end_date: this.eDate("month", 1),
          },
        },
        {
          text_en: "self_defined",
          text: "自定义",
          key: {
            begin_date: null,
            end_date: null,
          },
        },
      ],
    };
  },
  watch: {
    vmodel (n) {
      if (!n) {
        this.vm.x_date = 'self_defined'
      }
    }
  },
  mounted() {},
  created() {
    console.log(this.result)
    console.log(this.field)
    console.log(this.field3)
    console.log(this.field2)
  },
};
</script>
<style lang="scss">
.search-select-date-range-radio2 {
  display: inline-flex !important;
}
</style>
