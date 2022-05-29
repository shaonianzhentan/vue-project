<script setup lang="ts">
import { ref } from 'vue'
const props = defineProps(['submit', '_ok', '_cancel', '_closed'])
const visible = ref(true)
const okClick = async () => {
    const data = await props.submit()
    if (data) {
        props._ok(data)
        visible.value = false
    }
}
const cancelClick = () => {
    props._cancel()
    visible.value = false
}

defineExpose({
    close: (data: any) => {
        if (data) {
            props._ok(data)
        } else {
            props._cancel()
        }
        visible.value = false
    },
})
</script>
<template>
    <el-drawer v-model="visible" direction="rtl" :close-on-click-modal="false" @closed="props._closed">
        <template #header>
            <slot name="header"></slot>
        </template>
        <slot></slot>
        <template #footer>
            <slot name="footer">
                <el-button @click="cancelClick">取消</el-button>
                <el-button type="primary" @click="okClick">确定</el-button>
            </slot>
        </template>
    </el-drawer>
</template>
<script lang="ts">
export default {
}
</script>