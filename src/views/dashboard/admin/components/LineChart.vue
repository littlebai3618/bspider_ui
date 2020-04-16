<template>
  <two-line-chart ref="lineChart" :width="'100%'" :height="'350px'" />
</template>
<script>
import { fetchDownloaderPV } from '@/api/chart'
import TwoLineChart from '@/components/Charts/TwoLineChart'

export default {
  name: 'DownloadStatus',
  components: { TwoLineChart },
  created() {
    this.fetchProjectInfoChart()
  },
  methods: {
    fetchProjectInfoChart() {
      fetchDownloaderPV().then(response => {
        this.$refs.lineChart.setOptions(response.data)
      }).catch(err => {
        console.log(err)
      })
    }
  }
}
</script>

<style scoped>

</style>
