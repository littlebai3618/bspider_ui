<template>
  <project-cron-form :is-edit="false" />
</template>

<script>
import ProjectCronForm from './components/ProjectCronForm'

export default {
  name: 'Create',
  components: { ProjectCronForm }
}
</script>

