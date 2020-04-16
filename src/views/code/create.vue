<template>
  <code-detail :is-edit="false" />
</template>

<script>
import CodeDetail from './components/CodeDetail'

export default {
  name: 'Create',
  components: { CodeDetail }
}
</script>

