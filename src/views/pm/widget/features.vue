<template lang="html">
  <div class="features">
    <el-collapse v-model="activeNames">
      <el-collapse-item :name="item.key" v-for="item in prodFeature" :key="item.key">
        <span slot="title">{{ item.text }}/{{ item.text_en }}</span>

        <editor
          v-model="item.attach_comment"
          @on-blur="onSave(item)"
          v-if="item.type === 'html'"
        ></editor>
        <x-upload :files="item.files" @finish="onSave(item)" @delete="onSave(item)" v-else>
        </x-upload>
      </el-collapse-item>
    </el-collapse>
  </div>
</template>
<script>
export default {
  props: {
    collection: {
      type: String,
      require: true,
    },
    billId: {
      type: String,
      require: true,
    },
    payload: {
      type: Object,
      default() {
        return {};
      },
    },
    field: {
      type: String,
      require: true,
    },
  },
  data() {
    return {
      prodFeature: [],
      activeNames: []
    };
  },
  computed: {
    commonParam() {
      return {
        collection: this.collection,
        field: this.field,
        id: this.billId,
      };
    },
  },
  methods: {
    onSave(item) {
      this.editAttachment(item);
    },
    // addAttachment (item) {
    //   const param = {
    //     attach_comment: item.attach_comment,
    //     creator: this.$state('me').user_name,
    //     create_date: new Date(),
    //     files: item.files,
    //     attach_type: item.key,
    //     ...this.commonParam
    //   }
    //   this.$request('/api/support/addAttachment', param).then(data => {
    //     this.initialize()
    //   })
    // },
    editAttachment(item) {
      let { attach_comment, attach_id, files, creator } = item;
      files.forEach((m) => {
        m.file_id = m.file_id || this.$nextId;
      });
      this.$post("/api/support/editAttachment", {
        attach_comment,
        attach_id,
        files,
        ...this.commonParam,
        attach_type: item.key,
        creator: creator || this.$state("me").user_name,
        create_date: item.create_date || new Date(),
        update_date: new Date(),
        comment_type: item.type || "text",
      }, {loading: false}).then((data) => {
        // this.initialize();
      });
    },
    // addFiles ({files, attach_id}) {
    //   this.$request('/api/support/modifyAttachment', {
    //     files, attach_id, ...this.commonParam
    //   }).then(data => {
    //     this.initialize()
    //   })
    // },
    // removeFile ({attach_id}, {file_id}) {
    //   this.$request('/api/support/modifyAttachment', {
    //     attach_id, file_id, ...this.commonParam
    //   }).then(data => {
    //     this.initialize()
    //   })
    // },
    initialize() {
      let { commonParam, field } = this;
      this.$get("/api/support/queryAllAttach", commonParam).then((v) => {
        let map = (v[field] || [])._object("attach_type");
        this.prodFeature = this.$constant("prodFeature").map((m) => {
          this.activeNames.push(m.key)
          return {
            attach_comment: "",
            files: [],
            ...m,
            ...map[m.key],
          };
        });
      });
    },
  },
  created() {
    this.initialize();
  },
  mixins: [],
};
</script>
<style lang="scss">
.features {
}
</style>
