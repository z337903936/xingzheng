<template>
    <div >
        <el-row :gutter="20" class="mb10" v-for="list in detailList">
            <el-col :span="8">
                尸检号：{{  list.autopsyNo }}
            </el-col>
            <el-col :span="8">
                勘查号：{{ list.evidenceNo }}
            </el-col>
            <el-col :span="8">
                文书号：{{ list.documentNo }}
            </el-col>
            <el-col :span="8">
                类别：{{ list.caseCategory }}
            </el-col>

            <el-col :span="8">
                委托日期：{{ list.delagateTime*1000 | parseTime('{y}-{m}-{d} {h}:{i}:{s}') }}
            </el-col>
            <el-col :span="8">
                委托单位：{{list.delegateOrg}}
            </el-col>
            <el-col :span="8">
                办案人：{{list.delegateName }}
            </el-col>
            <el-col :span="8">
                死者情况：{{  list.deathDetail}}
            </el-col>
            <el-col :span="8">
                委托目的：{{ list.delegateReason }}
            </el-col>
            <el-col :span="8">
                鉴定结论：{{ list.delegateResult }}
            </el-col>

            <el-col :span="8">
                鉴定人：{{ list.examName }}
            </el-col>
            <el-col :span="8">
                简要案情：{{ list.digest }}
            </el-col>

        </el-row>

    </div>
</template>

<script>
    export default {
        name: "forensicDetail",
        props: {
            detailList: {
                type: Array,
                default: []
            }
        },
    }
</script>

<style scoped>
    .el-col {
        margin-bottom: 10px;
    }
</style>