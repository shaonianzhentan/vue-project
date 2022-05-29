<script setup lang="ts">
import api from '../../api/index'

const sessionStorageClick = () => {
    api.sessionStorage.test = 123
    console.log(api.sessionStorage.test, sessionStorage)
}

const localStorageClick = () => {
    api.localStorage.test = 123
    console.log(api.localStorage.test, localStorage)
}
</script>
<template>
    <el-row class="mb-4">
        <el-button>Default</el-button>
        <el-button type="primary" @click="sessionStorageClick">sessionStorage设置</el-button>
        <el-button type="success" plain @click="localStorageClick">localStorage设置</el-button>
        <el-button type="info" round>Info</el-button>
        <el-button type="warning">Warning</el-button>
        <el-button type="danger" icon="Delete">Danger</el-button>
        <el-button icon="Delete" circle></el-button>
    </el-row>
</template>
<script lang="ts">
export default {
}
</script>
<style lang="scss" scoped>
</style>