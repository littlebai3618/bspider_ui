<template>
  <el-table :data="list" :empty-text="'no exception project'" style="width: 100%;padding-top: 15px;">
    <el-table-column label="name" min-width="200">
      <template slot-scope="scope">
        <router-link :to="'/project/detail/'+scope.row.id" class="link-type">
          {{ scope.row.name }}
        </router-link>
      </template>
    </el-table-column>
    <el-table-column label="editor" width="195" align="center">
      <template slot-scope="scope">
        {{ scope.row.editor }}
      </template>
    </el-table-column>
    <el-table-column label="Status" width="100" align="center">
      <template slot-scope="{row}">
        <el-tag :type="row.status | statusFilter">
          {{ row.status | statusMap }}
        </el-tag>
      </template>
    </el-table-column>
  </el-table>
</template>

<script>
import { exceptionProjectList } from '@/api/tools'

export default {
  filters: {
    statusFilter(status) {
      const statusMap = {
        '1': 'success',
        '0': 'danger',
        '-1': 'warning'
      }
      return statusMap[status.toString()]
    },
    statusName(status) {
      const statusMap = {
        '1': 'running',
        '0': 'closed',
        '-1': 'fatal'
      }
      return statusMap[status.toString()]
    }
  },
  data() {
    return {
      list: null
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    fetchData() {
      exceptionProjectList().then(response => {
        this.list = response.data.slice(0, 8)
      })
    }
  }
}
</script>
