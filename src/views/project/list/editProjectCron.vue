<template>
  <project-cron-form :is-edit="true" />
</template>

<script>
import ProjectCronForm from './components/ProjectCronForm'

export default {
  name: 'Edit',
  components: { ProjectCronForm }
}
</script>
