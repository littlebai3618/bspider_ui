<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model="listQuery.name" placeholder="Name" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter" />
      <el-input v-model="listQuery.group" placeholder="Group" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter" />
      <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">
        Search
      </el-button>
      <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-edit" @click="createProjectHandler">
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
      <el-table-column label="Name" align="center" width="175">
        <template slot-scope="scope">
          <router-link :to="'/project/detail/'+scope.row.id" class="link-type">
            <span>{{ scope.row.name }}</span>
          </router-link>
        </template>
      </el-table-column>

      <el-table-column label="Rate" width="65" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.rate }}</span>
        </template>
      </el-table-column>
      <el-table-column label="Status" class-name="status-col" width="100">
        <template slot-scope="{row}">
          <el-tag :type="row.status | statusFilter">
            {{ row.status | statusName }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="Group" width="100px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.group }}</span>
        </template>
      </el-table-column>
      <el-table-column label="Scheduler" width="110px" align="center">
        <template slot-scope="{row}">
          <el-button v-if="row.status" type="text" @click="showProjectCronHandler(row)">
            <svg-icon icon-class="project-list-schedule" /> show detail
          </el-button>
          <!--          <el-button v-if="row.status" type="text" @click="createProjectCronHandler(row)">-->
          <!--            add-->
          <!--          </el-button>-->
        </template>
      </el-table-column>
      <el-table-column label="Description" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.description }}</span>
        </template>
      </el-table-column>
      <el-table-column label="Editor" width="79" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.editor }}</span>
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
      <el-table-column label="Actions" align="center" width="250" class-name="small-padding">
        <template slot-scope="{row}">
          <el-button type="primary" size="mini" @click="updateProjectHandler(row.id)">
            Edit
          </el-button>
          <el-button v-if="row.status === 0" type="success" size="mini" @click="updateProjectStatusHandler(1, row)">
            Open
          </el-button>
          <el-button v-if="row.status === 1" type="warning" size="mini" @click="updateProjectStatusHandler(0, row)">
            Close
          </el-button>
          <el-button type="danger" size="mini" @click="deleteProjectHandler(row)">
            Delete
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />

    <el-dialog :title="dialogProjectName" :visible.sync="dialogProjectCronVisible" :show-close="false">
      <el-table :data="projectCronList" empty-text="scheduler job is empty">
        <el-table-column label="Cron Id" width="70" align="center">
          <template slot-scope="scope">
            <span class="link-type" @click="updateProjectCronHandler(scope.row.id)">{{ scope.row.project_id + '-' + scope.row.code_id }}</span>
          </template>
        </el-table-column>
        <el-table-column label="Crontab" width="105px" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.trigger }}</span>
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
<!--        <el-table-column label="Actions" align="center" width="70" class-name="small-padding">-->
<!--          <template slot-scope="scope">-->
<!--            <el-button type="text" @click="updateProjectCronHandler(scope.row.id)">-->
<!--              Edit-->
<!--            </el-button>-->
<!--          </template>-->
<!--        </el-table-column>-->
      </el-table>
    </el-dialog>
  </div>
</template>

<script>
import { fetchProjectList, deleteProject, updateProject } from '@/api/project'
import { fetchCronList } from '@/api/bcron'
import waves from '@/directive/waves' // waves directive
import Pagination from '@/components/Pagination' // secondary package based on el-pagination
import { searchStr } from '@/utils/search'

export default {
  name: 'ProjectList',
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
        1: 'Open',
        0: 'Closed'
      }
      return statusMap[status]
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
      dialogProjectCronVisible: false,
      dialogProjectName: '',
      curProjectName: undefined,
      curProjectId: undefined,
      projectCronList: null,
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
      fetchProjectList(this.listQuery).then(response => {
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
    createProjectHandler() {
      this.$router.push({ name: 'CreateProject' })
    },
    updateProjectHandler(id) {
      this.$router.push({ path: '/project/edit/' + id })
    },
    deleteProjectHandler(row) {
      this.$confirm('This action will permanently delete project ' + row.name, 'Alert', {
        confirmButtonText: 'ok',
        cancelButtonText: 'cancel',
        type: 'warning'
      }).then(() => {
        deleteProject(row.id).then(response => {
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
          message: 'Cancel delete project ' + row.name
        })
      })
    },
    showProjectCronHandler(row) {
      const query = { page: 1, limit: 10, project_id: row.id, search: undefined }
      query.search = searchStr(query, ['project_id'])
      fetchCronList(query).then(response => {
        this.projectCronList = response.data.items
        this.dialogProjectCronVisible = true
        this.dialogProjectName = row.name + ' schedule job'
        this.curProjectName = row.name
        this.curProjectId = row.id
      })
    },
    // createProjectCronHandler(row) {
    //   this.$router.push({ path: '/project/operation/create', query: { project_id: row.id, project_name: row.name }})
    // },
    // updateProjectCronHandler(cronId) {
    //   this.$router.push({ path: '/project/operation/edit/' + cronId, query: { project_id: this.curProjectId, project_name: this.curProjectName }})
    // },
    updateProjectStatusHandler(status, row) {
      this.changeProject({ status: status }, row)
    },
    changeProject(change, row) {
      updateProject(change, row.id).then(response => {
        if (response.errno === 0) {
          this.$message({
            message: response.msg,
            type: 'success'
          })

          for (var key in change) {
            row[key] = change[key]
          }
        }
      }).catch(err => {
        console.log(err)
      })
    }
  }
}
</script>
