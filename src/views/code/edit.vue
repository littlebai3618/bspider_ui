<template>
  <code-detail :is-edit="true" />
</template>

<script>
import CodeDetail from './components/CodeDetail'

export default {
  name: 'Edit',
  components: { CodeDetail }
}
</script>

