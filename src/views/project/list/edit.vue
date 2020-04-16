<template>
  <project-form :is-edit="true" />
</template>

<script>
import ProjectForm from './components/ProjectForm'

export default {
  name: 'Edit',
  components: { ProjectForm }
}
</script>

