<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input
        v-model="listQuery.username"
        placeholder="Username"
        style="width: 200px;"
        class="filter-item"
        @keyup.enter.native="handleFilter"
      />
      <el-select v-model="listQuery.role" placeholder="Role" clearable style="width: 90px" class="filter-item">
        <el-option v-for="item in roleOptions" :key="item.key" :label="item.display_name" :value="item.key" />
      </el-select>
      <el-select v-model="listQuery.status" placeholder="Status" clearable class="filter-item" style="width: 130px">
        <el-option v-for="item in statusOptions" :key="item.key" :label="item.display_name" :value="item.key" />
      </el-select>
      <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">
        Search
      </el-button>
      <el-button
        class="filter-item"
        style="margin-left: 10px;"
        type="primary"
        icon="el-icon-edit"
        @click="createUserHandler"
      >
        Add
      </el-button>
      <el-checkbox v-model="showTime" class="filter-item" style="margin-left:15px;" @change="tableKey=tableKey+1">
        create&update time
      </el-checkbox>
    </div>

    <el-table
      :key="tableKey"
      v-loading="listLoading"
      :data="list"
      border
      fit
      highlight-current-row
    >
      <el-table-column label="ID" align="center" width="80">
        <template slot-scope="scope">
          <span>{{ scope.row.id }}</span>
        </template>
      </el-table-column>
      <el-table-column label="Identity" width="150px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.identity }}</span>
        </template>
      </el-table-column>
      <el-table-column label="Username" width="160px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.username }}</span>
        </template>
      </el-table-column>
      <el-table-column label="Status" class-name="status-col" width="100">
        <template slot-scope="{row}">
          <el-tag :type="row.status | statusFilter">
            {{ row.status | statusName }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="Role" width="125px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.role }}</span>
        </template>
      </el-table-column>
      <el-table-column label="Phone" width="155px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.phone }}</span>
        </template>
      </el-table-column>
      <el-table-column label="Email" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.email }}</span>
        </template>
      </el-table-column>
      <el-table-column v-if="showTime" label="Create Time" width="160px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.create_time }}</span>
        </template>
      </el-table-column>
      <el-table-column v-if="showTime" label="Update Time" width="160px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.update_time }}</span>
        </template>
      </el-table-column>
      <el-table-column label="Actions" align="center" width="230" class-name="small-padding fixed-width">
        <template slot-scope="{row}">
          <el-button type="primary" size="mini" @click="updateUserHandler(row.id)">
            Edit
          </el-button>
          <el-button v-if="row.status===1" size="mini" type="danger" @click="changeUserStatusHandler(row, 0)">
            Delete
          </el-button>
          <el-button v-if="row.status===0" size="mini" @click="changeUserStatusHandler(row, 1)">
            Open
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="listQuery.page"
      :limit.sync="listQuery.limit"
      @pagination="getList"
    />
  </div>
</template>

<script>
import { fetchUserList, updateUser } from '@/api/user'
import waves from '@/directive/waves' // waves directive
import Pagination from '@/components/Pagination' // secondary package based on el-pagination

import { searchStr } from '@/utils/search'

export default {
  name: 'ComplexTable',
  components: { Pagination },
  directives: { waves },
  filters: {
    statusFilter(status) {
      const statusMap = {
        1: 'success',
        0: 'danger'
      }
      return statusMap[status]
    },
    statusName(status) {
      const statusMap = {
        1: 'open',
        0: 'close'
      }
      return statusMap[status]
    }
  },
  data() {
    return {
      tableKey: 0,
      showTime: false,
      list: null,
      total: 0,
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 10,
        role: undefined,
        status: undefined,
        username: undefined,
        search: undefined
      },
      roleOptions: [
        { key: 'admin', display_name: 'admin' },
        { key: 'work', display_name: 'work' },
        { key: 'read', display_name: 'read' }
      ],
      statusOptions: [
        { key: 0, display_name: 'close' },
        { key: 1, display_name: 'open' }
      ]
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      this.listLoading = true
      this.listQuery.search = searchStr(this.listQuery, ['role', 'status', 'username'])
      fetchUserList(this.listQuery).then(response => {
        this.list = response.data.items
        this.total = response.data.total

        this.list = this.list.map(v => {
          return v
        })
        // Just to simulate the time of the request
        setTimeout(() => {
          this.listLoading = false
        }, 1.5 * 1000)
      })
    },
    handleFilter() {
      this.listQuery.page = 1
      this.getList()
    },
    createUserHandler() {
      this.$router.push({ path: '/user/create' })
    },
    updateUserHandler(id) {
      this.$router.push({ path: '/user/edit/' + id })
    },
    changeUserStatusHandler(row, status) {
      updateUser({ status: status }, row.id).then(response => {
        if (response.errno === 0) {
          this.$message({
            message: response.msg,
            type: 'success'
          })
          row.status = status
        }
      }).catch(err => {
        console.log(err)
      })
    }
  }
}
</script>
