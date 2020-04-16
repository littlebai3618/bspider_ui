<template>
  <div class="createPost-container">
    <el-form ref="postForm" :model="postForm" class="form-container">

      <sticky :z-index="10" :class-name="'sub-navbar '+stickyStatus">
        <el-input v-model="postForm.editor" style="width: 120px" prefix-icon="el-icon-edit" placeholder="editor" />
        <status-dropdown v-model="postForm.status" />
        <el-button v-loading="loading" style="margin-left: 10px;" type="success" @click="submitForm">
          submit
        </el-button>
      </sticky>

      <div class="createPost-main-container">
        <el-form-item style="margin-bottom: 30px;">
          <keep-alive>
            <yaml-editor ref="editor" v-model="postForm.config" />
          </keep-alive>
        </el-form-item>

      </div>
    </el-form>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

import Sticky from '@/components/Sticky' // 粘性header组件
import YamlEditor from '@/components/YamlEditor'
import { fetchProject, createProject, updateProject } from '@/api/project'
import { StatusDropdown } from './Dropdown'

const defaultForm = {
  status: 1,
  editor: undefined,
  config: ''
}

export default {
  name: 'ProjectForm',
  components: { StatusDropdown, Sticky, YamlEditor },
  props: {
    isEdit: {
      type: Boolean,
      default: false
    }
  },

  data() {
    return {
      stickyStatus: 'draft',
      postForm: Object.assign({}, defaultForm),
      updateForm: {},
      isUpdate: false,
      loading: false,
      tempRoute: {},
      projectId: undefined
    }
  },
  computed: {
    contentShortLength() {
      return this.postForm.description.length
    },
    ...mapGetters([
      'name'
    ])
  },
  watch: {
    'postForm.config': {
      handler: function(value) {
        this.updateForm.config = value
        this.isUpdate = true
      }
    },
    'postForm.editor': {
      handler: function(value) {
        this.updateForm.editor = value
        this.isUpdate = true
      }
    },
    'postForm.status': {
      handler: function(value) {
        this.updateForm.status = value
        this.isUpdate = true
      }
    }
  },
  created() {
    if (this.isEdit) {
      const id = this.$route.params && this.$route.params.id
      this.projectId = id
      this.fetchData(id)
    } else {
      this.initFormData()
    }

    // Why need to make a copy of this.$route here?
    // Because if you enter this page and quickly switch tag, may be in the execution of the setTagsViewTitle function, this.$route is no longer pointing to the current page
    // https://github.com/PanJiaChen/vue-element-admin/issues/1221
    this.tempRoute = Object.assign({}, this.$route)
  },
  methods: {
    fetchData(id) {
      fetchProject(id).then(response => {
        this.postForm = response.data

        // set tagsview title
        this.setTagsViewTitle()

        // set page title
        this.setPageTitle()
      }).catch(err => {
        console.log(err)
      })
    },
    setTagsViewTitle() {
      const title = 'Edit Project'
      const route = Object.assign({}, this.tempRoute, { title: `${title}-${this.postForm.name}` })
      this.$store.dispatch('tagsView/updateVisitedView', route)
    },
    setPageTitle() {
      const title = 'Edit Project'
      document.title = `${title}-${this.postForm.name}`
    },
    initFormData() {
      this.postForm.editor = this.name
    },
    submitForm() {
      if (this.isEdit) {
        this.update()
      } else {
        this.create()
      }
    },
    update() {
      this.postForm.config = this.$refs.editor.getValue()
      this.$refs.postForm.validate(valid => {
        if (valid && this.isUpdate) {
          updateProject(this.postForm, this.projectId).then(response => {
            this.loading = true
            if (response.errno === 0) {
              this.stickyStatus = 'published'
              this.$message({
                message: response.msg,
                type: 'success'
              })
            }
            this.loading = false
          }).catch(err => {
            console.log(err)
          })
        }
      })
    },
    create() {
      this.postForm.config = this.$refs.editor.getValue()
      this.$refs.postForm.validate(valid => {
        if (valid) {
          createProject(this.postForm).then(response => {
            this.loading = true
            if (response.errno === 0) {
              this.stickyStatus = 'published'
              this.$message({
                message: response.msg,
                type: 'success'
              })
            }
            this.loading = false
          }).catch(err => {
            console.log(err)
          })
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
  @import "~@/styles/mixin.scss";

  .createPost-container {
    position: relative;

    .createPost-main-container {
      padding: 10px 45px 20px 50px;

      .postInfo-container {
        position: relative;
        @include clearfix;
        margin-bottom: 5px;

        .postInfo-container-item {
          float: left;
        }
      }
    }

    .word-counter {
      width: 40px;
      position: absolute;
      right: 10px;
      top: 0;
    }
  }

  .article-textarea /deep/ {
    textarea {
      padding-right: 40px;
      resize: none;
      border: none;
      border-radius: 0;
      border-bottom: 1px solid #bfcbd9;
    }
  }
</style>
