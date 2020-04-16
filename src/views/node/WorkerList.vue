<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model="listQuery.name" placeholder="worker name" style="width: 190px;" class="filter-item" @keyup.enter.native="handleFilter" />
      <el-select v-model="listQuery.ip" placeholder="node ip" clearable style="width: 160px" class="filter-item">
        <el-option v-for="item in nodeIpOptions" :key="item.ip" :label="item.ip" :value="item.ip" />
      </el-select>
      <el-select v-model="listQuery.type" placeholder="worker type" clearable style="width: 150px" class="filter-item">
        <el-option v-for="item in workerTypeOptions" :key="item.key" :label="item.display_name" :value="item.key" />
      </el-select>
      <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">
        Search
      </el-button>
      <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-edit" @click="createWorkerHandler">
        Add worker
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
      <el-table-column label="Worker PID" width="100px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.pid }}</span>
        </template>
      </el-table-column>
      <el-table-column label="Type" width="110px" align="center">
        <template slot-scope="{row}">
          <el-tag :type="row.type | typeFilter">
            {{ row.type }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="Status" class-name="status-col" width="90px">
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
      <el-table-column label="Actions" align="center" width="180" class-name="small-padding fixed-width">
        <template slot-scope="{row}">
          <el-button type="primary" size="mini" @click="updateWorkerHandler(row)">
            Edit
          </el-button>
          <el-button v-if="row.status === 1" size="mini" type="danger" @click="changeWorkerStatusHandler(row, 0)">
            Stop
          </el-button>
          <el-button v-if="row.status !== 1" size="mini" @click="changeWorkerStatusHandler(row, 1)">
            Start
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />
    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form ref="dataPostForm" :rules="rules" :model="dialogPostForm" label-position="right" label-width="110px" style="width: 450px; margin-left:50px;">
        <el-form-item label="Name" prop="name">
          <el-input v-model="dialogPostForm.name" />
        </el-form-item>
        <el-form-item label="Worker Type" prop="type">
          <el-select v-model="dialogPostForm.type" class="filter-item" placeholder="Please select">
            <el-option v-for="item in workerTypeOptions" :key="item.key" :label="item.display_name" :value="item.key" />
          </el-select>
        </el-form-item>
        <el-form-item label="Node Ip" prop="ip">
          <el-select v-model="dialogPostForm.ip" class="filter-item" placeholder="Please select">
            <el-option v-for="item in nodeIpOptions" :key="item.ip" :label="item.ip" :value="item.ip" />
          </el-select>
        </el-form-item>
        <el-form-item label="Desc" prop="description">
          <el-input v-model="dialogPostForm.description" :autosize="{ minRows: 2, maxRows: 4}" type="textarea" placeholder="Please input desc" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">
          Cancel
        </el-button>
        <el-button type="primary" @click="dialogStatus==='create'?createData():updateData()">
          Confirm
        </el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
import { fetchWorkerList, updateWorker, createWorker } from '@/api/node'
import { fetchAllNodeList } from '@/api/tools'

import waves from '@/directive/waves' // waves directive
import Pagination from '@/components/Pagination' // secondary package based on el-pagination

import { searchStr } from '@/utils/search'

export default {
  name: 'List',
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
    },
    typeFilter(status) {
      const typeMap = {
        'downloader': '',
        'parser': 'info'
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
      list: null,
      total: 0,
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 10,
        name: undefined,
        ip: undefined,
        type: undefined,
        search: undefined
      },
      workerTypeOptions: [
        { key: 'parser', display_name: 'parser' },
        { key: 'downloader', display_name: 'downloader' }
      ],
      nodeIpOptions: [],
      statusMap: {
        '1': 'run',
        '0': 'close',
        '-1': 'fatal'
      },
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: 'Edit',
        create: 'Create'
      },
      dialogPostForm: {},
      rules: {
        name: [
          { required: true, message: 'Please input worker\'s name', trigger: 'blur' },
          { min: 1, max: 20, message: '1 to 20 characters in length', trigger: 'blur' }
        ],
        type: [
          { required: true, message: 'Please select this worker type', trigger: 'blur' }
        ],
        ip: [
          { required: true, message: 'Please select this node ip', trigger: 'blur' }
        ],
        description: [
          { required: true, message: 'Please input worker\'s description', trigger: 'blur' },
          { min: 1, max: 70, message: '1 to 70 characters in length', trigger: 'blur' }
        ]
      },
      showTime: false
    }
  },
  created() {
    this.getNodeIpOptions()
    this.getList()
  },
  methods: {
    getList() {
      this.listLoading = true
      this.listQuery.search = searchStr(this.listQuery, ['name', 'ip', 'type'])
      fetchWorkerList(this.listQuery).then(response => {
        this.list = response.data.items
        this.total = response.data.total
        // Just to simulate the time of the request
        setTimeout(() => {
          this.listLoading = false
        }, 1.5 * 1000)
      })
    },
    getNodeIpOptions() {
      fetchAllNodeList(this.listQuery).then(response => {
        this.nodeIpOptions = response.data
      })
    },
    handleFilter() {
      this.listQuery.page = 1
      this.getList()
    },
    createWorkerHandler() {
      this.resetTemp()
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs.dataPostForm.clearValidate()
      })
    },
    updateWorkerHandler(row) {
      this.dialogPostForm = Object.assign({}, row) // copy obj
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs.dataPostForm.clearValidate()
      })
    },
    resetTemp() {
      this.dialogPostForm = {
        name: undefined,
        ip: this.listQuery.ip,
        type: undefined,
        description: undefined,
        status: undefined
      }
    },
    changeWorkerStatusHandler(row, status) {
      updateWorker({ status: status }, row.id).then(response => {
        if (response.errno === 0) {
          this.$message({
            message: this.statusMap[status.toString()] + ' worker ' + row.ip + ' success',
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
    },
    updateData() {
      this.$refs.dataPostForm.validate(valid => {
        if (valid) {
          updateWorker(this.dialogPostForm, this.dialogPostForm.id).then(response => {
            if (response.errno === 0) {
              this.$message({
                message: response.msg,
                type: 'success'
              })
              this.dialogFormVisible = false
              this.getList()
            }
          }).catch(err => {
            console.log(err)
          })
        }
      })
    },
    createData() {
      this.$refs.dataPostForm.validate(valid => {
        if (valid) {
          createWorker(this.dialogPostForm).then(response => {
            if (response.errno === 0) {
              this.$message({
                message: response.msg,
                type: 'success'
              })
              this.dialogFormVisible = false
            }
          }).catch(err => {
            console.log(err)
          })
        }
      })
    }
  }
}
</script>
