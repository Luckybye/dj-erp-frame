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
    <el-radio-group
      v-model="vm.x_date"
      :disabled="disabled || disabledMap[field]"
      @change="onChangeType"
    >
      <el-radio :label="item.text_en" v-for="item in dateList" :key="item.text_en" class="mt10">{{
        $tt(item, "text")
      }}</el-radio>
    </el-radio-group>
    <select-date-range
      class="flex-1"
      :result="result"
      :field="field"
      :field2="field2"
      type="daterange"
      start-placeholder="Start"
      end-placeholder="End"
      :clearable="clearable"
      @change="onChange"
      :readonly="readonly"
      :disabled="disabled || disabledMap[field]"
      v-if="vm.x_date === 'self_defined'"
    >
    </select-date-range>
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
        if (item.text_en === v) return item
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
  created() {},
};
</script>
<style lang="scss">
.search-select-date-range-radio {
  display: inline-flex !important;
}
</style>
