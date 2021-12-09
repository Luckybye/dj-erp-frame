<template>
  <div
    class="x-component search-checkbox"
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
    <!-- <el-row>
      <el-col :span="12" class="flex"> -->
    <div width="40%">
      <el-date-picker
          class="flex-1 form-label"
          v-model="vmodel"
          type="date"
          placeholder="Select date"
          @change="onChange"
          :readonly="readonly"
          :disabled="disabled || disabledMap[field]"
          :picker-options="pickerOptions"
          :clearable="clearable">
        </el-date-picker>
    </div>
    <div width="10%">
      <div class="form-label ml10">{{pm.label2}}</div>
    </div>
    <div width="10%">
      <div class="form-label ml10">{{pm.check_label}}</div>
    </div>
    <div width="40%" class="flex form-label">
      <el-checkbox-group @change="onChange" v-model="selected">
        <el-checkbox v-for="check in pm.source" :label="check.key" :key="check.key" class="mr10">{{check.text}}</el-checkbox>
      </el-checkbox-group>
    </div>
  </div>
</template>
<script>
export default {
  name: "select-checkbox",
  props: {
    label: {
      type: String,
      default: ''
    },
    labelWidth: {
      type: String,
      default: 'auto'
    },
    width: {
      type: String,
      default: ''
    },
    clearable: {
      type: Boolean,
      default: true
    },
    value: {
      type: [String, Array]
    },
    max: {
      type: [Date, String]
    },
    min: {
      type: [Date, String]
    },
    result: {
      type: Object,
      default () {
        return {}
      }
    },
    field: {
      type: String,
      default: ''
    },
    field2: {
      type: String,
      default: ''
    },
    readonly: [Boolean],
    disabled: [Boolean],
    disabledMap: {
      type: Object,
      default () {
        return {}
      }
    },
    pm: {
      type: Object,
      default () {
        return {
          label: 'Label',
          check_label: 'Label',
          source: []
        }
      }
    }
  },
  methods: {
    onChange(v) {
      this.$nextTick(() => {
        this.$emit('change', v)
        if (this.field) this.$emit('save', {[this.field]: this.result[this.field], [this.field2]: this.selected}, this.result)
      })
    },
  },
  computed: {
    vmodel: {
      get: function() {
        console.log('get', this.value)
        let val = this.value
        if (this.field) {
          if (this.result[this.field]) val = this.result[this.field]
        }
        return val
      },
      set: function(n) {
        console.log('set', n)
        this.$emit("input", n);
        if (this.field) {
          this.result[this.field] = n || null
        }
      },
    },
    pickerOptions () {
      let {min, max} = this
      if (!min && !max) return
      return {
        disabledDate: d => {
          return ((min && new Date(d) < new Date(min)) || !min) &&
                 ((max && new Date(d) > new Date(max)) || !max)
        }
      }
    }
  },
  data() {
    return {
      selected: []
    };
  },
  watch: {
  },
  mounted() {},
  created() {
    console.log('this.pm:', this.pm)
  },
};
</script>
<style lang="scss">
.select-checkbox {
  display: inline-flex !important;
}
.form-label {
  align-self: center;
}
</style>
