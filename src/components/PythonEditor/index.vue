<template>
  <div class="python-editor">
    <textarea ref="textarea" />
  </div>
</template>

<script>
import CodeMirror from 'codemirror/lib/codemirror' // CodeMirror，必要
import 'codemirror/lib/codemirror.css'
// theme css
import 'codemirror/theme/monokai.css'
import 'codemirror/addon/fold/foldgutter.css'
import 'codemirror/addon/hint/show-hint.css'

// language
require('codemirror/mode/python/python')
// require active-line.js
require('codemirror/addon/selection/active-line')
require('codemirror/addon/fold/foldgutter')
require('codemirror/addon/fold/foldcode')
require('codemirror/addon/edit/matchbrackets')
require('codemirror/addon/hint/show-hint')
require('codemirror/addon/edit/closebrackets')

export default {
  name: 'PythonEditor',
  props: {
    /* eslint-disable */
    readonly: Boolean,
    hidden: Boolean,
    height: String,
    width: String
  },
  mounted() {
    this.initCodeMirror()
  },
  data() {
    return {
      value: ''
    }
  },
  watch: {
    value(value) {
      const editorValue = this.editor.getValue()
      if (value !== editorValue) {
        this.yamlEditor.setValue(this.value)
      }
    }
  },
  methods: {
    initCodeMirror() {
      this.editor = CodeMirror.fromTextArea(this.$refs.textarea, {
        // mode: 'text/x-python', // 实现groovy代码高亮
        // lineNumbers: true,	// 显示行号
        // theme: 'monokai',	// 设置主题
        // // lineWrapping: true,	//代码折叠
        // foldGutter: true,
        // gutters: ['CodeMirror-linenumbers', 'CodeMirror-foldgutter'],
        // matchBrackets: true	// 括号匹配

        mode: 'text/x-python', // python 代码高亮
        lineNumbers: true,	// 显示行号
        theme: 'monokai',	// 设置主题
        indentWithTabs: false, // 使用制表符进行智能缩进
        smartIndent: true,
        indentUnit: 4, // 智能缩进单位为4个空格长度

        lineWrapping: true, //
        // 在行槽中添加行号显示器、折叠器、语法检测器
        gutters: ['CodeMirror-linenumbers', 'CodeMirror-foldgutter', 'CodeMirror-lint-markers'],
        foldGutter: true, // 启用行槽中的代码折叠
        autofocus: true, // 自动聚焦
        matchBrackets: true, // 匹配结束符号，比如"]、}"
        autoCloseBrackets: true, // 自动闭合符号
        styleActiveLine: true // 显示选中行的样式
      })
      if (this.readonly) {
        this.editor.setOption("readOnly", true)
      }
      if (this.hidden) {
        this.editor.setOption("hidden", true)
      }
      this.editor.setValue(this.value)
      this.editor.on('change', cm => {
        this.$emit('changed', cm.getValue())
        this.$emit('input', cm.getValue())
      })
    },
    getContent() {
      return this.editor.getValue()
    },
    setContent(context) {
      this.editor.setValue(context) // 给代码框赋值
    },
    setOption(name, value) {
      this.editor.setOption(name, value)
    }
  }
}
</script>
<style scoped>
  .python-editor{
    height: 100%;
    position: relative;
  }
  .python-editor >>> .CodeMirror {
    font-size : 16px;
    line-height : 150%;
    height: auto;
  }
  .python-editor >>> .CodeMirror-scroll{
    min-height: 300px;
    height: auto;
  }
</style>

