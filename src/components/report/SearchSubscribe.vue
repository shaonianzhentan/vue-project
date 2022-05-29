<script setup lang="ts">
</script>
<template>
    <mp-drawer ref="MpDrawer" title="订阅管理" :submit="submit" width="400px">
        <el-menu>
            <draggable ghost-class="ghost" v-model="list" :move="checkMove" @start="drag = true" @end="drag = false"
                item-key="id">
                <template #item="{ element }">
                    <el-menu-item :index="element.id.toString()" class="d-flex justify-content-between"
                        @click="selectClick(element)">
                        <template #title>
                            {{ element.name }}
                            <el-popconfirm confirm-button-text="确定" cancel-button-text="取消" icon="InfoFilled"
                                icon-color="#626AEF" :title="`确认要删除【${element.name}】吗?`">
                                <template #reference>
                                    <el-icon @click="deleteClick(element.id)">
                                        <Delete />
                                    </el-icon>
                                </template>
                            </el-popconfirm>
                        </template>
                    </el-menu-item>
                </template>
            </draggable>
        </el-menu>
    </mp-drawer>
</template>
<script lang="ts">
import draggable from 'vuedraggable'
export default {
    components: {
        draggable
    },
    data() {
        return {
            list: new Array<any>(),
            drag: false,
        }
    },
    created() {
        for (let i = 0; i < 20; i++) {
            this.list.push({
                id: i,
                name: '项目' + i
            })
        }
    },
    methods: {
        checkMove() {

        },
        async submit() {

        },
        deleteClick(id: number) {

        },
        selectClick(item: any) {
            this.$refs.MpDrawer.close({})
        }
    }
}
</script>
<style lang="scss" scoped>
.ghost {
    opacity: 0.5;
    background: #c8ebfb;
}

.not-draggable {
    cursor: no-drop;
}

.el-menu {
    border-right: none;
}
</style>