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
            <el-table-column label="任务单号" align="center" >
                <template slot-scope="{row}">

                    <span>{{ row.taskNo }}</span>
                </template>
            </el-table-column>
            <el-table-column label="任务类型" align="center">
                <template slot-scope="{row}">
                    <span>{{ row.stepName }}</span>
                </template>
            </el-table-column>
            <el-table-column label="发送人" align="center">
                <template slot-scope="{row}">
                    <span>{{ row.stepHandler }}</span>
                </template>
            </el-table-column>
            <el-table-column label="发送时间"  align="center">
                <template slot-scope="{row}">
                    <span>{{row.taskArriveTime*1000 | parseTime('{y}-{m}-{d} {h}:{i}') }}</span>
                </template>
            </el-table-column>
            <!--<el-table-column label="任务结束时间"  align="center">-->
            <!--<template slot-scope="{row}">-->
            <!--<span>{{row.taskEndTime!==''?(row.taskEndTime*1000 | parseTime('{y}-{m}-{d} {h}:{i}')):''}}</span>-->
            <!--</template>-->
            <!--</el-table-column>-->
            <el-table-column label="任务详情" align="center">
                <template slot-scope="{row}">
                    <span>{{ row.stepHandler }}</span>
                </template>
            </el-table-column>
            <el-table-column label="状态"  align="center">
                <template slot-scope="{row}">
                    <span>{{ row.status | statusFilter }}</span>
                </template>
            </el-table-column>
            <el-table-column label="关联编号" >
                <template slot-scope="{row}">
                    <span>{{ row.stepHandler }}</span>
                </template>
            </el-table-column>

            <el-table-column label="操作" align="center" width="230" class-name="small-padding fixed-width">
                <template slot-scope="{row}">
                    <!--<el-button type="primary" size="small" @click="handleAcceptTask(row)" v-if="row.status===1">-->
                        <!--接受任务-->
                    <!--</el-button>-->
                    <!--<router-link :to="'/task/show-case/'+row.id">-->
                    <!--<el-button type="primary" size="mini">查看</el-button>-->
                    <!--</router-link>-->
                </template>
            </el-table-column>
        </el-table>

        <el-pagination
                background
                layout="prev, pager, next"
                :page-count="pages"
                :current-page.sync="listQuery.page"
                @current-change="getList"
                @size-change="getList"
                style="float: right;margin-top: 15px"
        >
        </el-pagination>
    </div>
</template>

<script>
    import { accetpTask,taskList,writeResult } from '@/api/backlog'
    import {parseTime} from '@/utils'
    import { fetchAdminMemberList} from '@/api/permissions'
    import {fetchList} from '@/api/dictionary'
    import waves from '@/directive/waves' // waves directive
    export default {
        name: "Complete",
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
                pages:1,
                listLoading:false,
                listQuery:{
                    page:1,
                    status:2,
                }
            }
        },
        created() {
            this.getList();
        },
        methods:{
            getList() {
                this.listLoading = true;
                taskList(this.listQuery).then(response => {

                    this.list = response.list
                    // this.pages = response.pages

                    // Just to simulate the time of the request

                    this.listLoading = false

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
