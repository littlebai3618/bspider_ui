<template>
  <div class="createPost-container">

    <sticky :z-index="10" :class-name="'sub-navbar '+stickyStatus">
      <el-button v-loading="loading" style="margin-left: 10px;" type="success" @click="submitForm">
        submit
      </el-button>
    </sticky>
    <div class="createPost-main-container">

      <el-form ref="postForm" :rules="rules" :model="postForm" label-position="right" label-width="130px" class="postInfo-form">
        <el-form-item label="Username" prop="username">
          <el-input v-model="postForm.username" />
        </el-form-item>
        <el-form-item label="Identity" prop="identity">
          <el-input v-model="postForm.identity" />
        </el-form-item>
        <el-form-item v-if="isEdit" label="New Password" prop="password">
          <el-input v-model="postForm.password" />
        </el-form-item>
        <el-form-item v-else label="Password" prop="password">
          <el-input v-model="postForm.password" />
        </el-form-item>
        <el-form-item label="Email" prop="email">
          <el-input v-model="postForm.email" />
        </el-form-item>
        <el-form-item label="Phone" prop="phone">
          <el-input v-model="postForm.phone" />
        </el-form-item>
        <el-form-item label="Role" prop="role" class="postInfo-form-item">
          <el-select v-model="postForm.role">
            <el-option v-for="item in roleOptions" :key="item.key" :label="item.display_name" :value="item.key" />
          </el-select>
        </el-form-item>
        <el-form-item label="Status" class="postInfo-form-item">
          <el-switch
            v-model="postForm.status"
            style="display: block;padding-top: 8px;"
            active-color="#13ce66"
            inactive-color="#ff4949"
            :active-value="1"
            :inactive-value="0"
          />
        </el-form-item>

      </el-form>

    </div>
  </div>
</template>

<script>
import Sticky from '@/components/Sticky' // 粘性header组件
import { validEmail, validMobilePhone } from '@/utils/validate'
import { fetchUser, updateUser, createUser } from '@/api/user'

const defaultForm = {
  username: '',
  identity: '',
  role: 'work',
  email: '1@qq.com',
  phone: '13333333333',
  status: 1,
  password: undefined
}

export default {
  name: 'UserDetail',
  components: { Sticky },
  props: {
    isEdit: {
      type: Boolean,
      default: false
    }
  },
  data() {
    const validateEmail = (rule, value, callback) => {
      if (validEmail(value)) {
        callback()
      } else {
        callback(new Error('Invalid email address'))
      }
    }

    const validatePhone = (rule, value, callback) => {
      if (validMobilePhone(value)) {
        callback()
      } else {
        callback(new Error('Invalid phone number'))
      }
    }
    return {
      stickyStatus: 'draft',
      roleOptions: [
        { key: 'admin', display_name: 'admin' },
        { key: 'work', display_name: 'work' },
        { key: 'read', display_name: 'read' }
      ],
      postForm: Object.assign({}, defaultForm),
      loading: false,
      rules: {
        username: [
          { required: true, message: 'Please input username', trigger: 'blur' },
          { min: 1, max: 20, message: '5 to 20 characters in length', trigger: 'blur' }
        ],
        identity: [
          { required: true, message: 'Please input identity', trigger: 'blur' },
          { min: 5, max: 20, message: '5 to 20 characters in length', trigger: 'blur' }
        ],
        password: [
          { min: 5, max: 32, message: '5 to 32 characters in length', trigger: 'blur' }
        ],
        role: [
          { required: true, message: 'Please select this user role', trigger: 'blur' }
        ],
        email: [
          { required: true, message: 'Please input email', trigger: 'blur' },
          { validator: validateEmail, trigger: 'blur' }],
        phone: [
          { required: true, message: 'Please input phone', trigger: 'blur' },
          { validator: validatePhone, trigger: 'blur' }]
      },
      tempRoute: {},
      userId: undefined
    }
  },
  created() {
    if (this.isEdit) {
      const id = this.$route.params && this.$route.params.id
      this.fetchData(id)
    }

    // Why need to make a copy of this.$route here?
    // Because if you enter this page and quickly switch tag, may be in the execution of the setTagsViewTitle function, this.$route is no longer pointing to the current page
    // https://github.com/PanJiaChen/vue-element-admin/issues/1221
    this.tempRoute = Object.assign({}, this.$route)
  },
  methods: {
    fetchData(id) {
      fetchUser(id).then(response => {
        this.userId = id
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
      const title = 'Edit User'
      const route = Object.assign({}, this.tempRoute, { title: `${title}-${this.postForm.username}` })
      this.$store.dispatch('tagsView/updateVisitedView', route)
    },
    setPageTitle() {
      const title = 'Edit User'
      document.title = `${title}-${this.postForm.username}`
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
          if (this.postForm.password === undefined) {
            delete this.postForm.password
          }
          updateUser(this.postForm, this.userId).then(response => {
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
      this.$refs.postForm.validate(valid => {
        if (valid) {
          createUser(this.postForm).then(response => {
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
    }
  }
}
</script>

<style lang="scss" scoped>
  @import "~@/styles/mixin.scss";

  .createPost-container {
    position: relative;

    .createPost-main-container {
      padding: 40px 45px 20px 50px;

      .postInfo-form {
        margin:0 auto;
        text-align: center;
        width: 400px;
      }

      .postInfo-form-item {
        position: relative;
        @include clearfix;
        margin-bottom: 10px;
        float: left;
      }
    }
  }
</style>
