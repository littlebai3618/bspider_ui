<template>
  <div class="app-container">
    <div class="filter-container">
      <el-select v-model="searchQuery.tag" placeholder="type" clearable style="width: 190px" class="filter-item">
        <el-option v-for="item in tagOptions" :key="item.key" :label="item.display_name" :value="item.key" />
      </el-select>
      <el-select v-model="searchQuery.source" placeholder="source" clearable style="width: 190px" class="filter-item">
        <el-option v-for="item in sourceOptions" :key="item.key" :label="item.display_name" :value="item.key" />
      </el-select>
      <el-input v-model="searchQuery.data" :placeholder="searchQuery.tag" style="width: 450px;" class="filter-item" @keyup.enter.native="handleSearch" />
      <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleSearch">
        Search
      </el-button>
    </div>

    <el-collapse v-model="activeNames">
      <el-collapse-item title="Request Base Info" name="1">
        <json-viewer
          :value="crawlDetailData"
          :expand-depth="1"
          copyable
        />
      </el-collapse-item>
      <el-collapse-item title="Http Body" name="2">
        {{ crawlDetailContent.text }}
      </el-collapse-item>
    </el-collapse>
  </div>
</template>

<script>
import { fetchCrawlDetail } from '@/api/tools'
import waves from '@/directive/waves' // waves directive
import JsonViewer from 'vue-json-viewer'

export default {
  name: 'CrawlDetail',
  components: { JsonViewer },
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
      crawlDetailData: {},
      crawlDetailContent: { text: null },
      activeNames: ['1'],
      searchQuery: {
        tag: 'url',
        data: undefined,
        source: 'downloader'
      },
      tagOptions: [
        { key: 'url', display_name: 'URL' },
        { key: 'sign', display_name: 'request-sign' }
      ],
      sourceOptions: [
        { key: 'downloader', display_name: 'downloader' },
        { key: 'parser', display_name: 'parser' }
      ]
    }
  },
  created() {
    const crawlQuery = this.$route.query && this.$route.query.crawlQuery
    if (crawlQuery !== undefined) {
      this.searchQuery = crawlQuery
      this.fetchCrawlDetailInfo()
    }
  },
  methods: {
    fetchCrawlDetailInfo() {
      fetchCrawlDetail(this.searchQuery).then(api_response => {
        if (api_response.data.response !== null) {
          this.crawlDetailContent = (({ text }) => ({ text }))(api_response.data.response)
          delete api_response.data.response.text
        }
        this.crawlDetailData = api_response.data
      }).catch(err => {
        console.log(err)
      })
    },
    handleSearch() {
      this.fetchCrawlDetailInfo()
    }
  }
}

</script>
