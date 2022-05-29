<script setup lang="ts">
</script>
<template>
  <el-container class="com-layout-index">
    <el-aside width="190px">
      <el-menu :router="true">
        <el-menu-item index="/demo/draggable">
          <el-icon>
            <Document />
          </el-icon>
          <span>拖拽</span>
        </el-menu-item>
        <el-menu-item index="/report/basic">
          <el-icon>
            <DataAnalysis />
          </el-icon>
          <span>报表</span>
        </el-menu-item>
        <el-menu-item index="/demo/api">
          <el-icon>
            <DataLine />
          </el-icon>
          <span>API</span>
        </el-menu-item>
      </el-menu>
    </el-aside>
    <el-main>
      <router-view v-slot="{ Component }">
        <keep-alive>
          <component :is="Component" v-if="$route.meta.keepAlive" :key="$route.name" />
        </keep-alive>
        <component :is="Component" v-if="!$route.meta.keepAlive" :key="$route.name">></component>
      </router-view>

    </el-main>
  </el-container>
</template>
<style lang="scss" scoped>
.com-layout-index {
  height: 100%;

  .el-aside {
    border-right: 1px solid #eee;
  }

  .el-menu {
    border-right: none;
  }
}
</style>