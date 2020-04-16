<template>
  <div class="createPost-container">
    <el-form ref="postForm" :model="postForm" :rules="rules" class="form-container">

      <sticky :z-index="10" :class-name="'sub-navbar '+stickyStatus">
        <el-button v-loading="loading" style="margin-left: 10px;" type="success" @click="submitForm">
          submit
        </el-button>
      </sticky>
      <div class="createPost-main-container">
        <el-row>

          <el-col :span="24">
            <div class="postInfo-container">
              <el-row>
                <el-col :span="8">
                  <el-form-item label-width="75px" label="Project:" class="postInfo-container-item">
                    <el-input v-model="projectName" readonly />
                  </el-form-item>
                </el-col>

                <el-col :span="8">
                  <el-form-item label-width="75px" label="Crontab:" prop="trigger" class="postInfo-container-item">
                    <el-input v-model="postForm.trigger" />
                  </el-form-item>
                </el-col>

                <el-col :span="8">
                  <el-form-item label-width="120px" label="Script Name:" prop="code_id" class="postInfo-container-item">
                    <el-select
                      v-model="postForm.code_id"
                      class="filter-item"
                      placeholder="Please select"
                      filterable
                      @change="getCodeContent"
                    >
                      <el-option v-for="item in codeOptions" :key="item.name" :label="item.name" :value="item.id" />
                    </el-select>
                  </el-form-item>
                </el-col>
              </el-row>
            </div>
          </el-col>
        </el-row>
        <el-form-item style="margin-bottom: 40px;" prop="description" label-width="90px" label="Description:">
          <el-input
            v-model="postForm.description"
            :rows="1"
            type="textarea"
            class="article-textarea"
            autosize
            placeholder="Please enter the description"
          />
          <span v-show="contentShortLength" class="word-counter">{{ contentShortLength }}words</span>
        </el-form-item>

        <el-alert
          :center="true"
          :title="alertText"
          type="info"
          class="link-type"
          show-icon
          @click.native="jumpToCodeEditorHandler()"
        />
        <el-form-item style="margin-bottom: 30px;">
          <python-editor ref="editor" :readonly="true" :height="'100%'" :width="'100%'" />
        </el-form-item>

      </div>
    </el-form>
  </div>
</template>

<script>
import { fetchCron, updateCron, createCron } from '@/api/bcron'
import { fetchAllCodeList, validCrontab } from '@/api/tools'
import { fetchCode } from '@/api/code'
import PythonEditor from '@/components/PythonEditor'
import Sticky from '@/components/Sticky' // 粘性header组件

const defaultForm = {
  project_id: 0,
  code_id: undefined,
  type: 'crawl',
  trigger: undefined,
  description: ''
}

export default {
  name: 'ProjectCronForm',
  components: { Sticky, PythonEditor },
  props: {
    isEdit: {
      type: Boolean,
      default: false
    }
  },
  data() {
    const validateCrontab = (rule, value, callback) => {
      validCrontab({ 'data': value }).then(response => {
        if (response.data.valid) {
          callback()
        } else {
          callback(new Error('Invalid crontab'))
        }
      })
    }
    return {
      cronId: undefined,
      stickyStatus: 'draft',
      codeOptions: [],
      postForm: Object.assign({}, defaultForm),
      loading: false,
      rules: {
        trigger: [
          { required: true, message: 'Please select this worker type', trigger: 'blur' },
          { validator: validateCrontab, trigger: 'blur' }
        ],
        code_id: [
          { required: true, message: 'Please select script', trigger: 'change' }
        ],
        description: [
          { required: true, message: 'Please input operation\'s description', trigger: 'blur' },
          { min: 1, max: 70, message: '1 to 70 characters in length', trigger: 'blur' }
        ]
      },
      alertText: 'Select script to Preview it',
      tempRoute: {},
      projectName: undefined
    }
  },
  computed: {
    contentShortLength() {
      return this.postForm.description.length
    }
  },
  created() {
    this.projectName = this.$route.query && this.$route.query.project_name

    if (this.isEdit) {
      const id = this.$route.params && this.$route.params.id
      this.fetchData(id)
    } else {
      this.postForm.project_id = this.$route.query && this.$route.query.project_id
    }
    this.getCodeOptions()
    // Why need to make a copy of this.$route here?
    // Because if you enter this page and quickly switch tag, may be in the execution of the setTagsViewTitle function, this.$route is no longer pointing to the current page
    // https://github.com/PanJiaChen/vue-element-admin/issues/1221
    this.tempRoute = Object.assign({}, this.$route)
  },
  methods: {
    fetchData(id) {
      fetchCron(id).then(response => {
        this.cronId = id
        this.postForm = response.data
        if (this.isEdit) {
          this.getCodeContent(this.postForm.code_id)
        }

        // set tagsview title
        this.setTagsViewTitle()

        // set page title
        this.setPageTitle()
      }).catch(err => {
        console.log(err)
      })
    },
    getCodeOptions() {
      fetchAllCodeList({ 'type': 'task' }).then(response => {
        this.codeOptions = response.data
      })
    },
    setTagsViewTitle() {
      const title = 'Edit Project Cron'
      const route = Object.assign({}, this.tempRoute, { title: `${title} ${this.postForm.project_id}-${this.postForm.code_id}` })
      this.$store.dispatch('tagsView/updateVisitedView', route)
    },
    setPageTitle() {
      const title = 'Edit Project Cron'
      document.title = `${title} ${this.postForm.project_id}-${this.postForm.code_id}`
    },
    getCodeContent(codeId) {
      fetchCode(codeId).then(response => {
        this.$refs.editor.setContent(response.data.content)
        this.alertText = 'Executable Code Preview Click to edit this code'
      }).catch(err => {
        console.log(err)
      })
    },
    jumpToCodeEditorHandler() {
      if (this.postForm.code_id !== undefined) {
        this.$router.push({ path: '/code/edit/' + this.postForm.code_id })
      } else {
        this.$notify({
          title: 'warning',
          message: 'Please select model',
          type: 'warning',
          duration: 2000
        })
      }
    },
    submitForm() {
      if (this.isEdit) {
        this.update()
      } else {
        this.create()
      }
    },
    update() {
      this.$refs.postForm.validate(valid => {
        if (valid) {
          updateCron(this.postForm, this.cronId).then(response => {
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
      this.$refs.postForm.validate(valid => {
        if (valid) {
          createCron(this.postForm).then(response => {
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
