<template>
    <div class="app-container">
        <el-table
                v-loading="listLoading"

                :data="list"
                border
                fit
                highlight-current-row
                style="width: 100%;"
        >
            <el-table-column label="步骤号" align="center" >
                <template slot-scope="{row}">
                    <span>{{ row.stepNo }}</span>
                </template>
            </el-table-column>
            <el-table-column label="步骤内容" >
                <template slot-scope="{row}">
                    <span>{{ row.stepName }}</span>
                </template>
            </el-table-column>
            <el-table-column label="认领人" >
                <template slot-scope="{row}">
                    <span>{{ row.stepHandler }}</span>
                </template>
            </el-table-column>
            <el-table-column label="任务开始时间"  align="center">
                <template slot-scope="{row}">
                    <span>{{ row.taskArriveTime | parseTime('{y}-{m}-{d} {h}:{i}') }}</span>
                </template>
            </el-table-column>
            <el-table-column label="任务结束时间"  align="center">
                <template slot-scope="{row}">
                    <span>{{ row.taskEndTime | parseTime('{y}-{m}-{d} {h}:{i}') }}</span>
                </template>
            </el-table-column>

            <el-table-column label="案件类别"  align="center">
                <template slot-scope="{row}">
                    <span>{{ row.status | statusFilter }}</span>
                </template>
            </el-table-column>
            <el-table-column label="操作" align="center" width="230" class-name="small-padding fixed-width">
                <template slot-scope="{row}">
                    <el-button type="primary" size="mini" @click="acceptTask(row)" v-if="row.status===1">
                        接受任务
                    </el-button>
                    <router-link :to="'/task/show-case/'+row.id">
                        <el-button type="primary" size="mini">查看</el-button>
                    </router-link>
                </template>
            </el-table-column>
        </el-table>
        <!--<el-pagination-->
                <!--background-->
                <!--layout="prev, pager, next"-->
                <!--:page-count="pages"-->
                <!--:current-page.sync="listQuery.page"-->
                <!--@current-change="getList"-->
                <!--@size-change="getList"-->
        <!--&gt;-->
        <!--</el-pagination>-->
    </div>
</template>

<script>
    import { nextTask,accetpTask,taskList } from '@/api/task'

    export default {
        name: "Backlog",
        filters: {

            statusFilter(status) {
                const statusMap = {
                    1: '未领取',
                    2: '进行中',
                    3: '已完成'
                }
                return statusMap[status]
            }
        },
        data(){
            return{
                list:[],
                tableKey:0,
                listLoading:false,
            }
        },
        created() {
            // alert(1);
            this.getList();
        },
        methods:{
            getList() {
                this.listLoading = true
                taskList().then(response => {
                    this.list = response.list;
                    // this.pages = response.pages

                    // Just to simulate the time of the request
                    setTimeout(() => {
                        this.listLoading = false
                    }, 1000)
                })
            },
            acceptTask(task){
                accetpTask(task.id).then(response=>{
                    if (response.code === 200) {
                        this.$message({
                            message: '操作成功',
                            type: 'success',
                            showClose: true,
                            duration: 2000
                        })
                    } else {
                        this.$message({
                            message: response.reason,
                            type: 'success',
                            showClose: true,
                            duration: 2000
                        })
                    }
                })
            },
        }
    }
</script>
