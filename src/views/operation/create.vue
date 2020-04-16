<template>
  <cron-detail :is-edit="false" />
</template>

<script>
import CronDetail from './components/CronDetail'

export default {
  name: 'Create',
  components: { CronDetail }
}
</script>

