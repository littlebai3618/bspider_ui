<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model="listQuery.name" placeholder="Name" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter" />
      <el-select v-model="listQuery.type" placeholder="Type" clearable style="width: 90px" class="filter-item">
        <el-option v-for="item in codeTypeOptions" :key="item.key" :label="item.display_name" :value="item.key" />
      </el-select>
      <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">
        Search
      </el-button>
      <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-edit" @click="createCodeHandler">
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
      <el-table-column label="ID" align="center" width="50">
        <template slot-scope="scope">
          <span>{{ scope.row.id }}</span>
        </template>
      </el-table-column>
      <el-table-column label="ClassName" width="190px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="Type" width="110px" align="center">
        <template slot-scope="{row}">
          <el-tag :type="row.type | typeFilter">
            {{ row.type }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="Description" align="center">
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
      <el-table-column label="Actions" align="center" width="180" class-name="small-padding">
        <template slot-scope="{row}">
          <el-button type="primary" size="mini" @click="updateCodeHandler(row.id)">
            Edit
          </el-button>
          <el-button type="danger" size="mini" @click="deleteCodeHandler(row)">
            Delete
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />
  </div>
</template>

<script>
import { fetchCodeList, deleteCode } from '@/api/code'
import waves from '@/directive/waves' // waves directive
import Pagination from '@/components/Pagination' // secondary package based on el-pagination

import { searchStr } from '@/utils/search'

export default {
  name: 'CodeList',
  components: { Pagination },
  directives: { waves },
  filters: {
    typeFilter(status) {
      const typeMap = {
        'pipeline': '',
        'middleware': 'success',
        'operation': 'warning',
        'task': 'info',
        'extractor': 'danger'
      }
      return typeMap[status]
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
        type: undefined
      },
      codeTypeOptions: [
        { key: 'pipeline', display_name: 'pipeline' },
        { key: 'operation', display_name: 'operation' },
        { key: 'middleware', display_name: 'middleware' },
        // { key: 'task', display_name: 'task' },
        { key: 'extractor', display_name: 'extractor' }
      ],
      showTime: false
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      this.listLoading = true
      this.listQuery.search = searchStr(this.listQuery, ['name', 'type'])
      fetchCodeList(this.listQuery).then(response => {
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
    createCodeHandler() {
      this.$router.push({ name: 'CreateCode' })
    },
    updateCodeHandler(id) {
      this.$router.push({ path: '/code/edit/' + id })
    },
    deleteCodeHandler(row) {
      this.$confirm('This action will permanently delete code ' + row.name, 'Alert', {
        confirmButtonText: 'ok',
        cancelButtonText: 'cancel',
        type: 'warning'
      }).then(() => {
        deleteCode(row.id).then(response => {
          if (response.errno === 0) {
            this.$message({
              message: response.msg,
              type: 'success'
            })
            const index = this.list.indexOf(row)
            this.list.splice(index, 1)
          }
        }).catch(response => {
          var ht = 'Module' + row.name + 'is being used by the following project:<br>'
          for (const index in response.data) {
            ht += '<router-link to="/project/detail/' + response.data[index].id + '" class="link-type"><el-tag key="' + response.data[index].id + '">' + response.data[index].name + '</el-tag></router-link><br>'
          }
          this.$notify({
            title: 'Delete Error',
            dangerouslyUseHTMLString: true,
            message: ht,
            duration: 0
          })
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: 'Cancel delete code ' + row.name
        })
      })
    }
  }
}
</script>
