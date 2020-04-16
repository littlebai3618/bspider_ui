<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model="listQuery.name" placeholder="node name" style="width: 190px;" class="filter-item" @keyup.enter.native="handleFilter" />
      <el-input v-model="listQuery.ip" placeholder="node ip" style="width: 150px;" class="filter-item" @keyup.enter.native="handleFilter" />
      <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">
        Search
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
      <el-table-column label="Node IP" align="center" width="95px">
        <template slot-scope="scope">
          <span>{{ scope.row.ip }}</span>
        </template>
      </el-table-column>
      <el-table-column label="Name" width="120px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="Agent PID" width="90px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.pid }}</span>
        </template>
      </el-table-column>
      <el-table-column label="Status" class-name="status-col" width="100">
        <template slot-scope="{row}">
          <el-tag :type="row.status | statusFilter">
            {{ row.status | statusName }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="description" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.description }}</span>
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
          <el-button type="primary" size="mini" @click="nodeStatusHandler(row)">
            Detail
          </el-button>
          <el-button v-if="row.status===1" size="mini" type="danger" @click="changeNodeStatusHandler(row, 0)">
            stop
          </el-button>
          <el-button v-if="row.status===0" size="mini" @click="changeNodeStatusHandler(row, 1)">
            start
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />
  </div>
</template>

<script>
import { fetchNodeList, updateNode } from '@/api/node'
import waves from '@/directive/waves' // waves directive
import Pagination from '@/components/Pagination' // secondary package based on el-pagination

import { searchStr } from '@/utils/search'

export default {
  name: 'NodeList',
  components: { Pagination },
  directives: { waves },
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
      tableKey: 0,
      list: null,
      total: 0,
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 10,
        name: undefined,
        ip: undefined,
        search: undefined
      },
      statusMap: {
        '1': 'run',
        '0': 'close',
        '-1': 'fatal'
      },
      showTime: false
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      this.listLoading = true
      this.listQuery.search = searchStr(this.listQuery, ['name', 'ip'])
      fetchNodeList(this.listQuery).then(response => {
        this.list = response.data.items
        this.total = response.data.total
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
    nodeStatusHandler(row) {
      this.$router.push({ path: '/resource/node/detail/' + row.id, query: { ip: row.ip }})
    },
    changeNodeStatusHandler(row, status) {
      updateNode({ status: status }, row.id).then(response => {
        if (response.errno === 0) {
          this.$message({
            message: this.statusMap[status.toString()] + ' node ' + row.ip + ' success',
            type: 'success'
          })
          if (status !== 1) {
            row.status = status
            row.pid = status
          } else {
            this.getList()
          }
        }
      }).catch(err => {
        console.log(err)
      })
    }
  }
}
</script>
