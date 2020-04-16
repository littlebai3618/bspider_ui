<template>
  <project-form :is-edit="false" />
</template>

<script>
import ProjectForm from './components/ProjectForm'

export default {
  name: 'Create',
  components: { ProjectForm }
}
</script>
