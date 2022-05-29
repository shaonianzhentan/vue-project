<script setup lang="ts">
import { ref } from 'vue'
const name = ref('')
const submit = async () => {
    return name.value
}
</script>
<template>
    <mp-dialog title="添加订阅" :submit="submit" width="400px">
        <div style="padding: 15px 0;">
            <el-input v-model="name" placeholder="订阅名称" />
        </div>
        <template #footer>
        </template>
    </mp-dialog>
</template>
<script lang="ts">
export default {
}
</script>