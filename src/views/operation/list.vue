<template>
  <div class="app-container">
    <div class="filter-container">
      <el-select v-model="listQuery.code_id" placeholder="Operation Code Name" clearable style="width: 360px" class="filter-item">
        <el-option v-for="item in codeOptions" :key="item.id" :label="item.editor + '-> ' + item.name" :value="item.id" />
      </el-select>
      <!--      <el-input v-model="listQuery.project_id" placeholder="ProjectID" readonly style="width: 160px;" class="filter-item" @keyup.enter.native="handleFilter" />-->
      <!--      - -->
      <!--      <el-input v-model="listQuery.code_id" placeholder="CodeID" style="width: 160px;" class="filter-item" @keyup.enter.native="handleFilter" />-->
      <!--      <el-select v-model="listQuery.type" placeholder="Type" clearable style="width: 120px" class="filter-item">-->
      <!--        <el-option v-for="item in cronTypeOptions" :key="item.key" :label="item.display_name" :value="item.key" />-->
      <!--      </el-select>-->
      <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">
        Search
      </el-button>
      <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-edit" @click="createOperationHandler">
        Add Operation
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
      <el-table-column label="Cron Id" align="center" width="75px">
        <template slot-scope="scope">
          <span>{{ scope.row.project_id + '-' + scope.row.code_id }}</span>
        </template>
      </el-table-column>
      <el-table-column label="Crontab" width="105px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.trigger }}</span>
        </template>
      </el-table-column>
      <el-table-column label="Type" width="110px" align="center">
        <template slot-scope="{row}">
          <el-tag :type="row.type | typeFilter">
            {{ row.type }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="next_run_time" width="165px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.next_run_time }}</span>
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
      <el-table-column label="Actions" align="center" width="180" class-name="small-padding fixed-width">
        <template slot-scope="{row}">
          <el-button type="primary" size="mini" @click="updateOperationHandler(row)">
            Edit
          </el-button>
          <el-button size="mini" type="danger" @click="deleteProjectHandler(row)">
            delete
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />
  </div>
</template>

<script>
import { fetchCronList, deleteCron } from '@/api/bcron'
import { fetchAllCodeList } from '@/api/tools'
import waves from '@/directive/waves' // waves directive
import Pagination from '@/components/Pagination' // secondary package based on el-pagination

import { searchStr } from '@/utils/search'

export default {
  name: 'List',
  components: { Pagination },
  directives: { waves },
  filters: {
    typeFilter(status) {
      const typeMap = {
        'operation': 'warning',
        'crawl': 'info'
      }
      return typeMap[status]
    }
  },
  props: {
    isDetail: {
      type: Boolean,
      default: false
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
        type: 'operation',
        project_id: 0,
        code_id: undefined,
        search: undefined
      },
      codeOptions: [],
      // cronTypeOptions: [
      //   { key: 'operation', display_name: 'operation' },
      //   { key: 'crawl', display_name: 'crawl' }
      // ],
      statusMap: {
        '1': 'run',
        '0': 'close',
        '-1': 'fatal'
      }
    }
  },
  created() {
    if (this.isDetail) {
      this.listQuery.ip = this.$route.params && this.$route.params.ip
    }
    this.getList()
  },
  methods: {
    getList() {
      this.listLoading = true
      this.listQuery.search = searchStr(this.listQuery, ['project_id', 'code_id', 'type'])
      fetchCronList(this.listQuery).then(response => {
        this.list = response.data.items
        this.total = response.data.total
        // Just to simulate the time of the request
        setTimeout(() => {
          this.listLoading = false
        }, 1.5 * 1000)
      })
      fetchAllCodeList({ type: 'operation' }).then(response => {
        this.codeOptions = response.data
      })
    },
    getOperationCode() {

    },

    handleFilter() {
      this.listQuery.page = 1
      this.getList()
    },
    createOperationHandler() {
      this.$router.push({ name: 'CreateCron' })
    },
    updateOperationHandler(row) {
      this.$router.push({ path: '/operation/edit/' + row.id })
    },
    deleteProjectHandler(row) {
      this.$confirm('This action will permanently delete operation job ' + row.project_id + '-' + row.code_id, 'Alert', {
        confirmButtonText: 'ok',
        cancelButtonText: 'cancel',
        type: 'warning'
      }).then(() => {
        deleteCron(row.id).then(response => {
          if (response.errno === 0) {
            this.$message({
              message: response.msg,
              type: 'success'
            })
            const index = this.list.indexOf(row)
            this.list.splice(index, 1)
          }
        }).catch(err => {
          console.log(err)
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: 'Cancel delete operation job ' + row.project_id + '-' + row.code_id
        })
      })
    }
  }
}
</script>
