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
                    <el-button type="primary" size="small" @click="handleAcceptTask(row)" v-if="row.status===1">
                        接受任务
                    </el-button>
                    <!--<router-link :to="'/task/show-case/'+row.id">-->
                        <!--<el-button type="primary" size="mini">查看</el-button>-->
                    <!--</router-link>-->
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
        <el-dialog title="接受任务" :visible.sync="dialogFormAccept" width="30%">
            <el-form
                    ref="dataForm"
                    :model="acceptTaskFrom"
                    label-position="left"
                    label-width="100px"
                    style="width: 400px; margin-left:50px;">

                <el-form-item label="送检单位" prop="name">
                    <el-input v-model="acceptTaskFrom.requireOrg"/>
                </el-form-item>


                <el-form-item label="送检时间" prop="sort">
                    <el-date-picker
                            v-model="acceptTaskFrom.requireTime"
                            type="date"
                            value-format="timestamp"
                            placeholder="选择日期">
                    </el-date-picker>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogFormAccept = false">
                    取 消
                </el-button>
                <el-button type="primary" @click="acceptTask()">
                    确 定
                </el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
    import { accetpTask,taskList } from '@/api/backlog'

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
                dialogFormAccept:false,
                acceptTaskFrom:{
                    id:'',
                    requireOrg:'',
                    requireTime:'',
                }
            }
        },
        created() {
            this.getList();
        },
        methods:{
            getList() {
                this.listLoading = true;
                const data={
                    status:1
                }
                taskList(data).then(response => {
                    this.list = response.list;
                    // this.pages = response.pages

                    // Just to simulate the time of the request
                    setTimeout(() => {
                        this.listLoading = false
                    }, 1000)
                })
            },
            handleAcceptTask(task){
                this.dialogFormAccept =true;
                this.acceptTaskFrom.id = task.id
            },
            acceptTask(){
                var  data = this.acceptTaskFrom;
                if (data.requireTime.toString().length>10)
                    data.requireTime =  parseInt(data.requireTime/1000);
                accetpTask(data).then(response=>{
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
