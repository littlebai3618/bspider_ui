<template>
  <div class="yaml-editor">
    <textarea ref="textarea" />
  </div>
</template>

<script>
import CodeMirror from 'codemirror'
import 'codemirror/addon/lint/lint.css'
import 'codemirror/lib/codemirror.css'
import 'codemirror/theme/monokai.css'
import 'codemirror/mode/yaml/yaml'
import 'codemirror/mode/yaml-frontmatter/yaml-frontmatter'
window.jsyaml = require('js-yaml')
import 'codemirror/addon/lint/lint'
import 'codemirror/addon/lint/yaml-lint'

export default {
  name: 'YamlEditor',
  /* eslint-disable vue/require-prop-types */
  props: ['value'],
  data() {
    return {
      yamlEditor: false
    }
  },
  watch: {
    value(value) {
      const editorValue = this.yamlEditor.getValue()
      if (value !== editorValue) {
        this.yamlEditor.setValue(this.value.toString())
      }
    }
  },
  mounted() {
    this.yamlEditor = CodeMirror.fromTextArea(this.$refs.textarea, {
      lineNumbers: true,
      mode: 'text/x-yaml',
      gutters: ['CodeMirror-lint-markers'],
      theme: 'monokai',
      lint: true
    })
    console.log(this.value)
    this.yamlEditor.setValue(this.value.toString())
    this.yamlEditor.on('change', cm => {
      this.$emit('changed', cm.getValue())
      this.$emit('input', cm.getValue())
    })
  },
  methods: {
    getValue() {
      return this.yamlEditor.getValue()
    }
  }
}
</script>

<style scoped>
.yaml-editor{
  height: 100%;
  position: relative;
}
.yaml-editor >>> .CodeMirror {
  font-size : 16px;
  line-height : 150%;
  height: auto;
}
.yaml-editor >>> .CodeMirror-scroll{
  min-height: 300px;
  height: auto;
}
</style>
