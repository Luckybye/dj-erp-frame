<template lang="html">
  <com-profile field="supplier_com_profile" :componentName="componentName" :instance="payload.cust_com_id" :disabled="isDisableEdit"></com-profile>
</template>

<script>
import Auth from '../components/auth-mixins';
export default {
  options: { title: '认证信息' },
  mixins: [Auth],
  data() {
    return {
    }
  },
  components: {
  },
  methods: {
  },
  computed: {
  },
  created() {
  },
}
</script>
