<template>
  <div class="app-container">
    <el-row :gutter="10">
      <el-col :span="5">
        <el-row>
          <el-card class="detail-wrapper">
            <div slot="header" class="clearfix">
              <span>Base Info</span>
            </div>
            <div class="text item">
              <el-row>
                <el-col :span="10"><div class="content-key">ID:</div></el-col>
                <el-col :span="14">
                  <div class="content-value">
                    {{ projectBaseInfo.id }}
                    <el-button style="padding: 3px 0" type="text" @click="updateProjectHandler(projectBaseInfo.id)"> Edit </el-button>
                  </div>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="10"><div class="content-key">Name:</div></el-col>
                <el-col :span="14"><div class="content-value">{{ projectBaseInfo.name }}</div></el-col>
              </el-row>
              <el-row>
                <el-col :span="10"><div class="content-key">Editor:</div></el-col>
                <el-col :span="14"><div class="content-value">{{ projectBaseInfo.editor }}</div></el-col>
              </el-row>
              <el-row>
                <el-col :span="10"><div class="content-key">Group:</div></el-col>
                <el-col :span="14"><div class="content-value">{{ projectBaseInfo.group }}</div></el-col>
              </el-row>
              <el-row>
                <el-col :span="10"><div class="content-key">Status:</div></el-col>
                <el-col :span="14">
                  <div class="content-value">
                    <el-tag :type="projectBaseInfo.status | statusFilter" size="mini">
                      {{ projectBaseInfo.status | statusName }}
                    </el-tag>
                  </div>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="10"><div class="content-key">Rate:</div></el-col>
                <el-col :span="14"><el-tag size="mini">{{ projectBaseInfo.rate }} R/min</el-tag></el-col>
              </el-row>
              <el-row>
                <el-col :span="10"><div class="content-key">Description:</div></el-col>
                <el-col :span="14"><div class="content-value">{{ projectBaseInfo.description }}</div></el-col>
              </el-row>
              <el-row>
                <el-col :span="10"><div class="content-key">Create:</div></el-col>
                <el-col :span="14"><div class="content-value">{{ projectBaseInfo.create_time }}</div></el-col>
              </el-row>
              <el-row>
                <el-col :span="10"><div class="content-key">Update:</div></el-col>
                <el-col :span="14"><div class="content-value">{{ projectBaseInfo.update_time }}</div></el-col>
              </el-row>
            </div>
          </el-card>
        </el-row>
        <el-row>
          <el-card class="detail-wrapper">
            <div slot="header" class="clearfix">
              <span>Queue Info</span>
            </div>
            <div class="text item">
              <el-row>
                <el-col :span="10"><div class="content-key">Candidate:</div></el-col>
                <el-col :span="14">
                  <div class="content-value">
                    {{ projectQueueInfo.candidate.total[0] + ' - ' +projectQueueInfo.candidate.total[1] + ' R/s' }}
                    <el-button style="padding: 3px 0" type="text" @click="purgeRequestHandler"> Purge </el-button>
                  </div>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="10"><div class="content-key">Download:</div></el-col>
                <el-col :span="14">
                  <div class="content-value">
                    {{ projectQueueInfo.download.total[0] + ' - ' +projectQueueInfo.download.total[1] + ' R/s' }}
                  </div>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="10"><div class="content-key">Parse:</div></el-col>
                <el-col :span="14">
                  <div class="content-value">
                    {{ projectQueueInfo.parse.total[0] + ' - ' +projectQueueInfo.parse.total[1] + ' R/s' }}
                  </div>
                </el-col>
              </el-row>
            </div>
          </el-card>
        </el-row>
      </el-col>
      <el-col :span="19">
        <el-tabs v-model="activeName" type="border-card">
          <el-tab-pane :label="'Downloader Status'" :name="'Downloader Status'" :lazy="true">
            <keep-alive>
              <project-status-chart :project-id="projectId" :status-type="'downloader'" />
            </keep-alive>
          </el-tab-pane>
          <el-tab-pane :label="'Downloader Exception'" :name="'Downloader Exception'" :lazy="true">
            <ProjectException :project-id="projectId" :status-type="'downloader'" />
          </el-tab-pane>
          <el-tab-pane :label="'Parser Status'" :name="'Parser Status'" :lazy="true">
            <project-status-chart :project-id="projectId" :status-type="'parser'" />
          </el-tab-pane>
          <el-tab-pane :label="'Parser Exception'" :name="'Parser Exception'" :lazy="true">
            <ProjectException :project-id="projectId" :status-type="'parser'" />
          </el-tab-pane>
        </el-tabs>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { fetchProject } from '@/api/project'
import { fetchProjectQueue, purgeRequest } from '@/api/rabbitmq'
import ProjectStatusChart from './components/ProjectStatusChart'
import ProjectException from './components/ProjectException'

export default {
  name: 'Detail',
  components: { ProjectStatusChart, ProjectException },
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
      timer: {
        getProjectQueueInfo: undefined
      },
      projectId: undefined,
      projectBaseInfo: {},
      loading: false,
      tempRoute: {},
      projectQueueInfo: {
        candidate: { total: [0, 0] },
        download: { total: [0, 0] },
        parse: { total: [0, 0] }
      },
      activeName: 'Downloader Status'
    }
  },
  created() {
    this.projectId = this.$route.params && this.$route.params.id
    this.fetchProjectInfo()
    this.getProjectQueueInfo()
  },
  mounted() {
    this.timer.getProjectQueueInfo = setInterval(this.getProjectQueueInfo, 5000)
  },
  beforeDestroy() {
    for (const key in this.timer) {
      clearInterval(this.timer[key])
    }
  },
  methods: {
    fetchProjectInfo() {
      fetchProject(this.projectId).then(response => {
        this.projectBaseInfo = response.data
      }).catch(err => {
        console.log(err)
      })
    },

    updateProjectHandler(id) {
      this.$router.push({ path: '/project/edit/' + id })
    },

    purgeRequestHandler() {
      this.$confirm('This action will permanently purge all candidate Request ', 'Alert', {
        confirmButtonText: 'ok',
        cancelButtonText: 'cancel',
        type: 'warning'
      }).then(() => {
        purgeRequest(this.projectId).then(response => {
          if (response.errno === 0) {
            this.$message({
              message: 'purge all candidate Request success!',
              type: 'success'
            })
          }
        }).catch(err => {
          console.log(err)
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: 'Cancel purge code'
        })
      })
    },

    getProjectQueueInfo() {
      fetchProjectQueue(this.projectId).then(response => {
        this.projectQueueInfo = response.data
      }).catch(err => {
        console.log(err)
      })
    }
  }
}
</script>

<style lang="scss" scoped>
  .project-detail-container {
    padding: 32px;
    background-color: rgb(240, 242, 245);
    position: relative;
    margin-bottom: 10px;

    .detail-wrapper {
      background: #fff;
      padding: 16px 16px 0;
      margin-bottom: 32px;
    }
  }

  @media (max-width:1024px) {
    .detail-wrapper {
      padding: 8px;
    }
  }

  .el-row {
    margin-bottom: 10px;
    &:last-child {
      margin-bottom: 0;
    }
  }

  .content-key {
    font-weight: bold;
    font-size: smaller;
  }
</style>

