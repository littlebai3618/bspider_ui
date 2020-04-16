<template>
  <div class="icons-container">
    <div v-for="item of tools">
      <el-tooltip placement="top">
        <div slot="content">
          {{ item.desc }}
        </div>
        <div class="icon-item">
          <router-link :to="item.uri">
            <svg-icon :icon-class="item.icon" class-name="disabled" />
            <span>{{ item.name }}</span>
          </router-link>
        </div>
      </el-tooltip>
    </div>
  </div>
</template>

<script>
import clipboard from '@/utils/clipboard'

export default {
  name: 'ToolsLists',
  data() {
    return {
      tools: [
        { name: 'Crawl Detail', uri: '/tools/crawl-detail', icon: 'recall', desc: 'show the request detail' },
        { name: 'Crontab Editor', uri: '/tools/crontab-editor', icon: 'crontab', desc: 'test crontab EL' }
      ]
    }
  },
  methods: {
    generateIconCode(symbol) {
      return `<svg-icon icon-class="${symbol}" />`
    },
    generateElementIconCode(symbol) {
      return `<i class="el-icon-${symbol}" />`
    },
    handleClipboard(text, event) {
      clipboard(text, event)
    }
  }
}
</script>

<style lang="scss" scoped>
.icons-container {
  margin: 10px 20px 0;
  overflow: hidden;

  .icon-item {
    margin: 20px;
    height: 100px;
    text-align: center;
    width: 125px;
    float: left;
    font-size: 50px;
    color: #24292e;
    cursor: pointer;
  }

  span {
    display: block;
    font-size: 16px;
    margin-top: 10px;
  }

  .disabled {
    pointer-events: none;
  }
}
</style>
