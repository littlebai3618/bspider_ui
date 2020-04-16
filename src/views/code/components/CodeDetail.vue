<template>
  <div class="createPost-container">
    <el-form ref="postForm" :model="postForm" class="form-container">

      <sticky :z-index="10" :class-name="'sub-navbar '+stickyStatus">
        <el-input v-model="postForm.editor" style="width: 120px" prefix-icon="el-icon-edit" placeholder="editor" />
        <el-button v-loading="loading" style="margin-left: 10px;" type="success" @click="submitForm">
          submit
        </el-button>
      </sticky>

      <div class="createPost-main-container">
        <el-form-item style="margin-bottom: 30px;">
          <keep-alive>
            <python-editor ref="editor" :width="'100%'" />
          </keep-alive>
        </el-form-item>

      </div>
    </el-form>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

import Sticky from '@/components/Sticky' // 粘性header组件
import PythonEditor from '@/components/PythonEditor'
import { fetchCode, createCode, updateCode } from '@/api/code'

const defaultForm = {
  content: '',
  editor: ''
}

export default {
  name: 'CodeDetail',
  components: { Sticky, PythonEditor },
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
      loading: false,
      tempRoute: {},
      codeId: undefined
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
  created() {
    if (this.isEdit) {
      const id = this.$route.params && this.$route.params.id
      // 计算编辑器高度
      this.codeId = id
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
      fetchCode(id).then(response => {
        this.postForm = response.data
        this.$refs.editor.setContent(this.postForm.content)

        // set tagsview title
        this.setTagsViewTitle()

        // set page title
        this.setPageTitle()
      }).catch(err => {
        console.log(err)
      })
    },
    setTagsViewTitle() {
      const title = 'Edit Code'
      const route = Object.assign({}, this.tempRoute, { title: `${title}-${this.postForm.name}` })
      this.$store.dispatch('tagsView/updateVisitedView', route)
    },
    setPageTitle() {
      const title = 'Edit Code'
      document.title = `${title}-${this.postForm.name}`
    },
    initFormData() {
      this.postForm.editor = this.name
    },
    submitForm() {
      if (this.isEdit) {
        if (this.postForm.project.length !== 0) {
          var ht = 'This module is being used by the following project:<br>'
          for (const index in this.postForm.project) {
            ht += '<router-link to="/project/detail/' + this.postForm.project[index].id + '" class="link-type"><el-tag key="' + this.postForm.project[index].id + '">' + this.postForm.project[index].name + '</el-tag></router-link><br>'
          }
          this.$confirm(ht, 'Alert', {
            confirmButtonText: 'ok',
            cancelButtonText: 'cancel',
            dangerouslyUseHTMLString: true,
            type: 'warning'
          }).then(() => {
            this.update()
          }).catch(() => {
            this.$message({
              type: 'info',
              message: 'Cancel update code ' + this.postForm.name
            })
          })
        } else {
          this.update()
        }
      } else {
        this.create()
      }
    },
    update() {
      this.postForm.content = this.$refs.editor.getContent()
      this.$refs.postForm.validate(valid => {
        if (valid) {
          // 警告影响的project
          updateCode(this.postForm, this.codeId).then(response => {
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
            this.$message({
              message: err,
              type: 'error'
            })
          })
        }
      })
    },
    create() {
      this.postForm.content = this.$refs.editor.getContent()
      this.$refs.postForm.validate(valid => {
        if (valid) {
          createCode(this.postForm).then(response => {
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
