<template>
  <cron-detail :is-edit="true" />
</template>

<script>
import CronDetail from './components/CronDetail'

export default {
  name: 'Edit',
  components: { CronDetail }
}
</script>
