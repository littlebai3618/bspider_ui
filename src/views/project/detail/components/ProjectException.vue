<template>
  <el-timeline>
    <el-timeline-item
      v-for="(activity, index) in timeLineData"
      :key="index"
      :timestamp="activity.crawl_time"
      placement="top"
    >
      <el-card>
        <el-table :data="[activity]" border>
          <el-table-column label="Message">
            <template slot-scope="{row}">
              <div>
                <span class="message-title" style="padding-right: 10px;">Method:</span>
                <el-tag type="success">
                  {{ row.method }}
                </el-tag>
              </div>
              <br>
              <div>
                <span class="message-title" style="padding-right: 10px;">Http Code: </span>
                <el-tag type="danger">
                  {{ row.status }}
                </el-tag>
              </div>
              <br>
              <div>
                <span class="message-title" style="padding-right: 16px;">Url: </span>
                <el-tag :key="activity.url_sign">
                  <a :href="activity.url">
                    {{ activity.url }}
                  </a>
                </el-tag>
              </div>
              <br>
              <div>
                <span class="message-title" style="padding-right: 16px;">Sign: </span>
                <el-tag :key="activity.sign" type="info" @click="showCrawlDetailHandler(activity.sign)"><a>{{ activity.sign }}</a></el-tag>
              </div>
            </template>
          </el-table-column>
          <el-table-column label="Stack">
            <template slot-scope="scope">
              <p v-html="scope.row.exception" />
            </template>
          </el-table-column>
        </el-table>
      </el-card>
    </el-timeline-item>
  </el-timeline>
</template>

<script>
import { ParserException, DownloaderException } from '@/api/tools'

export default {
  name: 'DownloadStatus',
  props: {
    statusType: {
      type: String,
      default: 'downloader'
    },
    projectId: {
      type: String,
      default: '0'
    }
  },
  data() {
    return {
      timeLineData: {}
    }
  },
  created() {
    this.fetchProjectInfoChart()
  },
  methods: {
    fetchProjectInfoChart() {
      if (this.statusType === 'downloader') {
        DownloaderException(this.projectId).then(response => {
          this.timeLineData = response.data
        }).catch(err => {
          console.log(err)
        })
      } else {
        ParserException(this.projectId).then(response => {
          this.timeLineData = response.data
        }).catch(err => {
          console.log(err)
        })
      }
    },
    showCrawlDetailHandler(data) {
      this.$router.push({ path: '/tools/crawl-detail', query: { crawlQuery: {
        tag: 'sign',
        data: data,
        source: this.statusType
      }}})
    }
  }
}
</script>
