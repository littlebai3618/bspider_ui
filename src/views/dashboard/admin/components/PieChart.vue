<template>
  <pie-chart ref="pieChart" />
</template>
<script>
import { fetchCodeTypeDetail } from '@/api/chart'
import PieChart from '@/components/Charts/PieChart'

export default {
  name: 'CodeTypeChart',
  components: { PieChart },
  created() {
    this.fetchProjectInfoChart()
  },
  methods: {
    fetchProjectInfoChart() {
      fetchCodeTypeDetail().then(response => {
        this.$refs.pieChart.setOptions(response.data)
      }).catch(err => {
        console.log(err)
      })
    }
  }
}
</script>
