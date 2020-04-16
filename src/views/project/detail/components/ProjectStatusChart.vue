<template>
  <two-line-chart ref="lineChart" :width="'100%'" :height="height + 'px'" />
</template>
<script>
import { fetchDownloaderProjectPV, fetchParserProjectPV } from '@/api/chart'
import TwoLineChart from '@/components/Charts/TwoLineChart'

export default {
  name: 'DownloadStatus',
  components: { TwoLineChart },
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
      height: window.innerHeight - 210
    }
  },
  created() {
    this.fetchProjectInfoChart()
  },
  methods: {
    fetchProjectInfoChart() {
      if (this.statusType === 'downloader') {
        fetchDownloaderProjectPV(this.projectId).then(response => {
          this.$refs.lineChart.setOptions(response.data)
        }).catch(err => {
          console.log(err)
        })
      } else {
        fetchParserProjectPV(this.projectId).then(response => {
          this.$refs.lineChart.setOptions(response.data)
        }).catch(err => {
          console.log(err)
        })
      }
    }
  }
}
</script>
