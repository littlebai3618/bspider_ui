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
                    {{ nodeBaseInfo.id }}
                  </div>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="10"><div class="content-key">Name:</div></el-col>
                <el-col :span="14"><div class="content-value">{{ nodeBaseInfo.name }}</div></el-col>
              </el-row>
              <el-row>
                <el-col :span="10"><div class="content-key">CPU:</div></el-col>
                <el-col :span="14"><div class="content-value">{{ nodeBaseInfo.cpu_num }} core</div></el-col>
              </el-row>
              <el-row>
                <el-col :span="10"><div class="content-key">Memory:</div></el-col>
                <el-col :span="14"><div class="content-value">{{ nodeBaseInfo.mem_size }} G</div></el-col>
              </el-row>

              <el-row>
                <el-col :span="10"><div class="content-key">Disk:</div></el-col>
                <el-col :span="14"><div class="content-value">{{ nodeBaseInfo.disk_size }} G</div></el-col>
              </el-row>
            </div>
          </el-card>
        </el-row>
        <el-row>
          <el-card class="detail-wrapper">
            <div slot="header" class="clearfix">
              <span>Agent Info</span>
            </div>
            <div class="text item">
              <el-row>
                <el-col :span="10"><div class="content-key">Pid:</div></el-col>
                <el-col :span="14"><div class="content-value">{{ nodeBaseInfo.pid }}</div></el-col>
              </el-row>
              <el-row>
                <el-col :span="10"><div class="content-key">Status:</div></el-col>
                <el-col :span="14">
                  <div class="content-value">
                    <el-tag :type="nodeBaseInfo.status | statusFilter" size="mini">
                      {{ nodeBaseInfo.status | statusName }}
                    </el-tag>
                  </div>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="10"><div class="content-key">Server:</div></el-col>
                <el-col :span="14"><div class="content-value">{{ nodeBaseInfo.ip + ':' + nodeBaseInfo.port }}</div></el-col>
              </el-row>
              <el-row>
                <el-col :span="10"><div class="content-key">Description:</div></el-col>
                <el-col :span="14"><div class="content-value">{{ nodeBaseInfo.description }}</div></el-col>
              </el-row>
              <el-row>
                <el-col :span="10"><div class="content-key">Create:</div></el-col>
                <el-col :span="14"><div class="content-value">{{ nodeBaseInfo.create_time }}</div></el-col>
              </el-row>
              <el-row>
                <el-col :span="10"><div class="content-key">Update:</div></el-col>
                <el-col :span="14"><div class="content-value">{{ nodeBaseInfo.update_time }}</div></el-col>
              </el-row>
            </div>
          </el-card>
        </el-row>
      </el-col>
      <el-col :span="19">
        <el-tabs v-model="activeName" type="border-card">
          <el-tab-pane :label="'Node Status(7 days)'" :name="'Node Status'" :lazy="true">
            <keep-alive>
              <node-status-chart :node-ip="nodeIp" />
            </keep-alive>
          </el-tab-pane>
        </el-tabs>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { fetchNode } from '@/api/node'
import NodeStatusChart from './components/NodeStatusChart'

export default {
  name: 'Detail',
  components: { NodeStatusChart },
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
      nodeIp: undefined,
      nodeId: undefined,
      nodeBaseInfo: {},
      loading: false,
      tempRoute: {},
      activeName: 'Node Status'
    }
  },
  created() {
    this.nodeId = this.$route.params && this.$route.params.id
    this.nodeIp = this.$route.query && this.$route.query.ip
    this.fetchNodeInfo()
  },
  beforeDestroy() {
    for (const key in this.timer) {
      clearInterval(this.timer[key])
    }
  },
  methods: {
    fetchNodeInfo() {
      fetchNode(this.nodeId).then(response => {
        this.nodeBaseInfo = response.data
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

