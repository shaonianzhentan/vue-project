<script setup lang="ts">
import { defineProps } from 'vue'
const props = defineProps({
    title: String
})
</script>
<template>
    <div class="global-page-list">
        <slot name="header"></slot>
        <el-row class="page-action">
            <el-col :span="12">
                {{ props.title }}
            </el-col>
            <el-col :span="12" class="text-end">
                <el-space>
                    <el-button type="primary" text icon="Plus" @click="addSubscribeClick">添加订阅</el-button>
                    <el-button icon="Tickets" @click="searchSubscribeClick">订阅管理</el-button>
                </el-space>
                <el-button-group>
                    <el-tooltip effect="dark" content="导出数据" placement="top">
                        <el-button type="primary" icon="Download" />
                    </el-tooltip>
                    <el-tooltip effect="dark" content="刷新列表" placement="top">
                        <el-button type="primary" icon="RefreshRight" />
                    </el-tooltip>
                    <el-tooltip effect="dark" content="展示列设置" placement="top">
                        <el-button type="primary" icon="Setting" />
                    </el-tooltip>
                </el-button-group>
            </el-col>
        </el-row>
        <slot></slot>
    </div>
</template>
<script lang="ts">
import AddSubscribeVue from '../report/AddSubscribe.vue';
import SearchSubscribeVue from '../report/SearchSubscribe.vue';
export default {
    data() {
        return {}
    },
    methods: {
        addSubscribeClick() {
            this.$dialog(AddSubscribeVue).then((data) => {
                console.log(data)
            })
        },
        searchSubscribeClick() {
            this.$dialog(SearchSubscribeVue).then((data) => {
                console.log(data)
            })
        }
    }
}
</script>
<style lang="scss" scoped>
.page-action {
    margin-bottom: 10px;
}
</style>