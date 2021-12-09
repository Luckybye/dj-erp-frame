/* eslint-disable */
// import {debounce, defaults} from 'lodash'
function search () {
  // console.log('searchsearchsearch')
  this.skipWatch(() => {
    this.page.x_searchLast = Date.now()
    // this.$set(this.page, 'x_searchLast', Date.now())
  })
  this.getData.call(this.context || this.$parent).then((data) => {
    // 设置分页
    if (!data || !('count' in data)) {
      this.searchText && this.onFilter()
      return this.saveOld()
    }
    this.skipWatch(() => {
      // this.$set(this.page, 'x_searchLast', Date.now())
      this.page.x_searchLast = Date.now()
      this.page.count = data.count || 0
      this.saveOld()
      this.searchText && this.onFilter()
    })
  })
}
function addSearch(page) {
  // console.log(page, 'page.x_searchLastpage.x_searchLast')
  // 500暂时不查
  if (!page.x_searchLast || page.x_searchLast === 500) return
  const nowTime = new Date().getTime()
  let timeout = nowTime - page.x_searchLast
  // console.log(timeout, 'timeouttimeout')
  // 设置x_searchLast，小于当前时间开启查询
  if (timeout < 75) return
  // 开启防抖模式，300ms内重复触发，只执行最后一次
  this.searchTimer && clearTimeout(this.searchTimer)
  if (this.isBackFirstPage()) return
  this.searchTimer = setTimeout(() => {
    search.call(this)
    clearTimeout(this.searchTimer)
    this.searchTimer = 0
  }, 100)
}

export default {
  props: {
    getData: Function,
    // getData执行环境, 默认table父元素
    context: Object,
  },
  data() {
    return {
      // 刷新的定时器
      searchTimer: 0,
      searchModel: {
        // 上次刷新时间,默认当前时间加1天，手动设置1开启查询
        x_searchLast: Date.now() + 1 * 24 * 3600 * 1000,
        page_index: 1,
        page_size: 15,
        count: 0,
      },
      stopWatch: false
    }
  },
  methods: {
    addSearch,
    setPage () {
      if (this.page) {
        Object.keys(this.searchModel).forEach(k => {
          this.$set(this.page, k, this.page[k] || this.searchModel[k])
        })
      }
    },
    skipWatch (cb) {
      if (this.stopWatch) this.stopWatch()
      cb()
      this.$nextTick(() => {
        this.addWatch()
      })
    },
    addWatch () {
      this.stopWatch = this.$watch('page', this.addSearch, {deep: true, immediate: this.page.x_searchLast === 1})
    },
    isBackFirstPage () {
      if (!this.page) return false
      // 查询条件变化，会导致总页数变化，将自动跳到第一页
      let {page, searchModel} = this
      // console.log(page.x_searchLast, searchModel.x_searchLast, 'x_searchLastx_searchLast')
      // console.log(page.page_index, searchModel.page_index, 'page_indexpage_index')
      if (page.x_searchLast === searchModel.x_searchLast && page.page_index === searchModel.page_index && page.page_index !== 1) {
        page.page_index = 1
        return true
      }
      return false
    },
    saveOld () {
      this.searchModel = Object._merge(this.searchModel, this.page)
      // console.log(this.page.x_searchLast, this.searchModel.x_searchLast, 'x_searchLastx_searchLast222222222')
    }
  },
  watch: {
  },
  created () {
    if (this.getData) {
      this.setPage()
      this.addWatch()
    }
  }
}
