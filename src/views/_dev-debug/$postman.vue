<template>
  <div class="postman">
    <div class="flex-b">
      <div class="req-logs fixed-top" v-infinite-scroll="load">
        <x-input v-model="searchText" clearable class="fixed-top"></x-input>
        <div
          class="l-item flex-b"
          v-for="(item, i) in logs"
          :key="i"
          :class="{ active: vm.index === i }"
          @click="onSelect(item, i)"
        >
          <div style="width:25px">{{i+1}}</div>
          <div class="text-bold mr10"  style="width:40px">{{
            item.method.toUpperCase()
          }}</div>
          <div class="flex-1">
            <div
              :class="{ 'text-red': item.err }"
              class="text-12 pointer break-word line-2"
              :title="item.err"
              v-html="highlightSearch(item)"
              ></div>
              <span class="text-12 text-grey">
                {{item.req_date | timeFormat('YY-MM-DD HH:mm')}}
              </span>
          </div>
        </div>
      </div>
      <div class="req flex-1">
        <div class="flex-b">
          <x-select
            :source="methods"
            :map="{ label: 'text', value: 'key' }"
            width="100px"
            v-model="vm.method"
          ></x-select>
          <x-input class="flex-1" v-model="vm.url"></x-input>
          <el-button type="primary" @click="onSend" class="ml10"
            >Send</el-button
          >
        </div>
        <x-fold class="mt20" show>
          <span slot="header">Params</span>
          <x-code v-model="vm.req_data" height="300px"></x-code>
        </x-fold>
        <x-fold class="mt20" show>
          <span slot="header">Response</span>
          <x-code v-model="vm.res_data" height="500px" disabled></x-code>
        </x-fold>
      </div>
    </div>
    <!-- <x-label>
      <x-code value="I am html"></x-code>
    </x-label>
    <x-code value="I am disabled" disabled></x-code> -->
  </div>
</template>
<script>
/* eslint-disable */

let fmt = {
  method: 'get',
  url: '',
  req_data: null,
  res_data: null,
  index: '',
}

export default {
  options: { title: 'Postman' },
  data() {
    return {
      methods: [
        { key: 'post', text: 'POST' },
        { key: 'get', text: 'GET' },
      ],
      vm: { ...fmt },
      showCount: 30,
      searchText: ''
    }
  },
  computed: {
    logs() {
      let text = this.searchText
      let reg = new RegExp(text, 'i')
      return this.datas.filter(f => reg.test(f.x_text)).slice(0, this.showCount)
    },
  },
  methods: {
    highlightSearch (item) {
      let reg = new RegExp(this.searchText, 'i')
      return item.x_text.replace(reg, `<span class='text-orange'>${this.searchText.match(reg)}</span>`)
    },
    async onSend() {
      let { url, req_data, method } = this.vm
      let para = { url, method }
      if (method === 'get' && req_data) {
        para.params = JSON.parse(req_data)
      } else if (req_data) para.data = JSON.parse(req_data)
      let v = await this.$axios(para)
      this.vm.res_data = this.$h.formatJson(v.data)
    },
    onSelect(item, i) {
      this.vm = {
        ...fmt,
        index: i,
        ...item,
        req_data: this.$h.formatJson(item.data || ''),
      }
    },
    init() {
      this.datas = JSON.parse(sessionStorage.getItem('dj_req_logs') || '[]').map(
        f => {
          f.x_text = window.decodeURIComponent(f.url)
          f.data = f.params || f.data
          if (f.data && f.data.url)
            f.x_text += window.decodeURIComponent(f.data.url)
          return f
        }
      )
    },
    load() {
      if (this.showCount >= this.datas.length) return
      this.showCount += 2
    },
  },
  created() {
    this.init()
  },
}
</script>
<style lang="scss">
.postman {
  .req-logs {
    width: 300px;
    margin-right: 20px;
    line-height: 1;
    height: calc(100vh - 140px);
    overflow: auto;
  }
  .l-item {
    padding: 5px;
    border-bottom: 1px solid #eee;
    &:hover {
      background: #eee;
    }
    &.active {
      background: grey;
      color: white;
    }
    &>div {
      height: fit-content;
      align-self: center;
    }
  }
}
</style>
