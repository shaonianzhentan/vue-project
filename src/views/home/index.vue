<script lang="ts" setup>
</script>
<template>
    <page-list class="views-home-index">
        <el-form :model="formModel" label-width="120px">
            <el-row>
                <el-col :span="6">
                    <el-form-item label="Activity name" prop="name">
                        <el-input v-model="formModel.name" />
                    </el-form-item>
                </el-col>
                <el-col :span="6">
                    <el-form-item label="Activity name" prop="name">
                        <el-input v-model="formModel.name" />
                    </el-form-item>
                </el-col>
                <el-col :span="6">
                    <el-form-item label="Activity name" prop="name">
                        <el-input v-model="formModel.name" />
                    </el-form-item>
                </el-col>
                <el-col :span="6">
                    <el-form-item label="Activity name" prop="name">
                        <el-input v-model="formModel.name" />
                    </el-form-item>
                </el-col>
            </el-row>
        </el-form>
        <vxe-table border show-footer :data="table.data" :footer-method="footerMethod">
            <vxe-column type="seq" width="60"></vxe-column>
            <vxe-column field="name" title="Name" sortable
             :filters="[{ label: '包含 6', value: '6' }, { label: '包含 4', value: '4' }]"
               :filter-method="filterNameMethod"
             >
                <template #default="{ row }">
                    <span>自定义插槽模板 {{ row.price }}</span>
                </template>
            </vxe-column>
            <vxe-column field="sex" title="Sex"></vxe-column>
            <vxe-column field="price" title="Price" formatter="amount"></vxe-column>
        </vxe-table>
    </page-list>
</template>

<script lang="ts">
export default {
    data() {
        return {
            formModel: {
                name: ''
            },
            table: {
                data: [
                    {
                        price: 19212312.1232131,
                        sex: 1,
                        age: 1
                    }
                ]
            },
        }
    },
    created() {
        this.api.service.api_test({}).then(res=>{
            this.table.data = res.data
        })
    },
    methods: {
        footerMethod() {
            return [
                ['合计', '2', '44', '67', '-']
            ]
        },
        filterNameMethod(){

        }
    }
}
</script>