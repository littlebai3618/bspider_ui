<template>
  <div class="app-container">
    <div class="filter-container text-center">
      <el-input v-model="searchQuery.data" placeholder="crontab" style="width: 450px;" class="filter-item" @keyup.enter.native="handleSearch" />
      <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleSearch">
        Search
      </el-button>
    </div>

    <div class="show-form">
      <el-alert
        :title="alertMsg.title"
        :type="alertMsg.type"
        center
        show-icon
      />
    </div>
    <div class="show-form">
      <el-timeline>
        <el-timeline-item
          v-for="(activity, index) in nextRunTime"
          :key="index"
          :timestamp="activity"
          :size="'large'"
        >
          {{ index | indexFilter }}
        </el-timeline-item>
      </el-timeline>
    </div>
  </div>
</template>

<script>
import { validCrontab } from '@/api/tools'
import waves from '@/directive/waves' // waves directive

export default {
  name: 'CrontabEditor',
  directives: { waves },
  filters: {
    indexFilter(index) {
      const indexMap = {
        0: 'First execution time',
        1: 'Second execution time',
        2: 'Third execution time',
        3: 'Fourth execution time',
        4: 'Fifth execution time'
      }
      return indexMap[index]
    }
  },
  data() {
    return {
      searchQuery: {
        data: undefined
      },
      nextRunTime: undefined,
      isPass: undefined,
      alertMsg: {
        title: 'Please input crontab EL',
        type: 'info'
      }
    }
  },
  methods: {
    fetchCrontab() {
      validCrontab(this.searchQuery).then(response => {
        if (response.data.valid) {
          this.nextRunTime = response.data.time
          this.alertMsg.title = 'valid success'
          this.alertMsg.type = 'success'
        } else {
          this.alertMsg.title = 'Illegal crontab EL'
          this.alertMsg.type = 'error'
        }
        this.isPass = response.data.valid
      }).catch(err => {
        console.log(err)
      })
    },
    handleSearch() {
      this.fetchCrontab()
    }
  }
}

</script>

<style lang="scss" scoped>
  @import "~@/styles/mixin.scss";

  .show-form {
    margin:0 auto;
    text-align: center;
    width: 400px;
  }
</style>

