<template>
  <two-line-chart ref="lineChart" :width="'100%'" :height="height + 'px'" />
</template>
<script>
import { fetchNodePV } from '@/api/chart'
import TwoLineChart from '@/components/Charts/TwoLineChart'

export default {
  name: 'NodeStatusChart',
  components: { TwoLineChart },
  props: {
    nodeIp: {
      type: String,
      default: '0'
    }
  },
  data() {
    return {
      height: window.innerHeight - 220
    }
  },
  created() {
    this.fetchProjectInfoChart()
  },
  methods: {
    fetchProjectInfoChart() {
      fetchNodePV(this.nodeIp).then(response => {
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
