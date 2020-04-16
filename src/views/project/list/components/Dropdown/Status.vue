<template>
  <el-dropdown :show-timeout="100" trigger="click">
    <el-button plain>
      {{ project_status===0?'Status: Off':'Status: On' }}
      <i class="el-icon-caret-bottom el-icon--right" />
    </el-button>
    <el-dropdown-menu slot="dropdown" class="no-padding">
      <el-dropdown-item>
        <el-radio-group v-model="project_status" style="padding: 10px;">
          <el-radio :label="0">
            Off
          </el-radio>
          <el-radio :label="1">
            On
          </el-radio>
        </el-radio-group>
      </el-dropdown-item>
    </el-dropdown-menu>
  </el-dropdown>
</template>

<script>
export default {
  props: {
    value: {
      type: Number,
      default: 1
    }
  },
  computed: {
    project_status: {
      get() {
        return this.value
      },
      set(val) {
        this.$emit('input', val)
      }
    }
  }
}
</script>
