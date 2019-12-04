<template>
    <div>
        <el-row :gutter="20">
            <el-col :span="4" v-for="row in detailList">
                <el-card :body-style="{ padding: '0px' }">
                    <div class="result">
                        检测结果：{{ row.result }}
                    </div>
                    <div style="padding: 14px;">
                        <span>文书号：{{ row.documentNo }}</span>
                        <div class="bottom clearfix">
                            <time class="time">时间：{{ row.documentTime | parseTime('{y}-{m}-{d} {h}:{i}:{s}') }}</time>

                        </div>
                    </div>
                </el-card>

            </el-col>
        </el-row>

    </div>
</template>

<script>
    import { parseTime } from '@/utils'
    export default {
        name: "materialDetail",
        props: {
            detailList: {
                type: Array,
                default: []
            }
        },
        data(){
            return {

            }
        }
    }
</script>

<style scoped>
    .el-col {
        margin-bottom: 20px;
    }
    .result {
        background-color: #f0f0f0;
        padding: 14px;
        min-height: 200px;
    }
    .time {
        font-size: 13px;
        color: #999;
    }
    .clearfix:before,
    .clearfix:after {
        display: table;
        content: "";
    }

    .clearfix:after {
        clear: both
    }
</style>