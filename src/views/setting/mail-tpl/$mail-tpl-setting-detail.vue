<template>
  <div class="mail-tpl-setting-detail">
    <el-form ref="form" label-width="100px" label-position="left">
      <!-- <el-form-item :label="$t('trigger_cond')" v-if="!isSend">
        {{tpl.trigger_cond}}
      </el-form-item> -->
      <el-form-item :label="$t('notice_target')" v-if="!isSend">
        <select-staff v-model="vm.notice_target"  multiple width="80%" :collapse-tags="false" placeholder=" "></select-staff>
      </el-form-item>
      <el-form-item :label="$t('mail_subject')">
        <x-input
          v-model="vm.subject"
          width="80%">
        </x-input>
      </el-form-item>
      <el-form-item :label="$t('mail_content')">
        <editor
          ref="editor"
          v-model="vm.html"
        >
        <el-dropdown placement="bottom" @command="handleCommand">
          <span>插入变量</span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item :command="item" v-for="(item, i) in variables" :key="i">
              <span v-html="item"></span>
            </el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
        </editor>
      </el-form-item>
      <!-- <el-form-item :label="$t('可用变量')">
        <div class="variables flex-w">
          <div class="var-item" v-for="(item, i) in variables" :key="i" v-html="item"></div>
        </div>
      </el-form-item> -->
      <el-form-item :label="$t('mail_sign')">
        <x-input
          type="textarea"
          v-model="vm.mail_sign"
          width="80%">
        </x-input>
      </el-form-item>
    </el-form>

    <div class="fixed-bottom text-center">
      <el-button type="primary" @click="onSave">{{$t('save')}}</el-button>
    </div>
  </div>
</template>

<script>
import mailTpls from '@/lib/mail-tpl'
export default {
  options: {
    icon: 'icon-set',
  },
  components: {
  },
  data() {
    return {
      vm: {
        notice_target: [],
        subject: '',
        html: '',
        mail_sign: '',
        mail_key: ''
      },
      variables: []
    }
  },
  computed: {
    isSend () {
      return this.tpl.mail_type === 'send'
    },
    tpl () {
      return mailTpls[this.payload.mail_key] || {}
    },
    field () {
      return 'mail_tpl_' + this.payload.mail_key
    },
    instance () {
      return this.$state('me').com_id
    }
  },
  methods: {
    async getMailTpl () {
      let v = await this.$configure.getValue(this.field, this.instance)
      this.vm = {...Object._merge(this.vm, this.tpl), ...v[this.field]}
      this.vm.html || (this.vm.html = this.tpl.html)
      this.vm.html = this.tpl.getHtml(this.vm.html)
    },
    async onSave () {
      let para = {...this.vm}
      para.html = this.tpl.htmlToKey(para.html)
      await this.$configure.setValue(this.field, {[this.field]: para}, this.instance)
      this.$message.success(this.$t('save_success'))
    },
    restoreSelection () {
      var selection = window.getSelection ? window.getSelection() : document.getSelection();
      selection.removeAllRanges();
      if (this.$refs.editor.range) {
        selection.addRange(this.$refs.editor.range);
      } else {
        this.$message.warning('请选择插入位置，光标所在位置')
      }
    },
    handleCommand (h) {
      this.restoreSelection()
      document.execCommand('insertHTML', false, `<span>&nbsp;${h}&nbsp;</span>`)
    }
  },
  created () {
    this.getMailTpl()
    this.variables = this.tpl.getVariables()
  }
}
</script>
<style lang="scss">
.mail-tpl-setting-detail {
  .editor {
    width: 80%;
    display: inline-block;
  }
}
</style>
