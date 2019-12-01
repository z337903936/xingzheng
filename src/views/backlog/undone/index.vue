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
                    <span>{{ row.taskArriveTime  }}</span>
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
            <el-table-column label="关联编号" align="center">
                <template slot-scope="{row}">
                    <span>{{ row.stepHandler }}</span>
                </template>
            </el-table-column>

            <el-table-column label="操作" align="center" width="230" class-name="small-padding fixed-width">
                <template slot-scope="{row}">
                    <el-button type="primary" size="small" @click="handleAcceptTask(row)" v-if="row.status===1 && row.stepName !== '痕检现勘'">
                        接受任务
                    </el-button>
                    <el-button type="primary" size="small" @click="handleAcceptTaskSeach(row)" v-if="row.status===1 && row.stepName === '痕检现勘'">
                        接受任务
                    </el-button>
                    <el-button type="primary" size="small" @click="handleWriteResult(row)" v-if="row.status===2 && row.stepName !== '痕检现勘'">
                        填写结果
                    </el-button>
                    <router-link :to="'/search/update-search/'+row.evidenceId" v-if="row.status===2 && row.stepName==='痕检现勘'">
                        <el-button type="primary" size="mini" >编辑现勘</el-button>
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
        <el-dialog title="接受任务" :visible.sync="dialogFormAccept" width="50%">
            <el-form
                    ref="acceptTaskFrom"
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
            <el-divider content-position="center">物证信息</el-divider>
            <el-row :gutter="20">
                <el-col :span="12">
                    物证编号：
                </el-col>
                <el-col :span="12">
                    类型：
                </el-col>
            </el-row>
            <el-row :gutter="20">
                <el-col :span="12">
                    遗留部位：
                </el-col>
                <el-col :span="12">
                    提取方法：
                </el-col>
            </el-row>
            <el-row :gutter="20">
                <el-col :span="12">
                    提取日期：
                </el-col>
                <el-col :span="12">
                    提取人：
                </el-col>
            </el-row>
            <el-row :gutter="20">
                <el-col :span="12">
                    可靠程度：
                </el-col>
                <el-col :span="12">
                    利用情况：
                </el-col>
            </el-row>
            <el-divider content-position="center">案件信息</el-divider>
            <el-row :gutter="20">
                <el-col :span="12">
                    勘查号：
                </el-col>
                <el-col :span="12">
                    现勘号：
                </el-col>
            </el-row>
            <el-row :gutter="20">
                <el-col :span="12">
                    案件编号：
                </el-col>
                <el-col :span="12">
                    案件类别：
                </el-col>
            </el-row>
            <el-row :gutter="20">
                <el-col :span="12">
                    案发地点：
                </el-col>
                <el-col :span="12">
                    案发时间：
                </el-col>
            </el-row>

            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogFormAccept = false">
                    取 消
                </el-button>
                <el-button type="primary" @click="acceptTask()">
                    确 定
                </el-button>
            </div>
        </el-dialog>

        <el-dialog title="填写结果" :visible.sync="dialogResultFrom" width="50%">
            <el-form
                    ref="ResultFrom"
                    :model="ResultFrom"
                    label-position="left"
                    label-width="100px"
                    style="width: 400px; margin-left:50px;">

                <el-form-item label="检测结果" prop="name">
                    <el-input v-model="ResultFrom.result"/>
                </el-form-item>
                <el-form-item label="文书号" prop="name">
                    <el-input v-model="ResultFrom.documentNo"/>
                </el-form-item>


                <el-form-item label="文书日期" prop="sort">
                    <el-date-picker
                            v-model="ResultFrom.documentDate"
                            type="date"
                            value-format="timestamp"
                            placeholder="选择日期">
                    </el-date-picker>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogResultFrom = false">
                    取 消
                </el-button>
                <el-button type="primary" @click="writeResult()">
                    确 定
                </el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
    import { accetpTask,taskList,writeResult } from '@/api/backlog'

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
                    stepId :'',
                    requireOrg:'',
                    requireTime:'',
                },
                dialogResultFrom:false,
                ResultFrom:{
                    stepId :'',
                    result:'',
                    documentNo:'',
                    documentDate:'',
                },
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
                    this.list = response.list.map(data=>{
                        data.taskArriveTime = this.getLocalTime(data.taskArriveTime)
                        return data
                    });
                    // this.pages = response.pages

                    // Just to simulate the time of the request
                    setTimeout(() => {
                        this.listLoading = false
                    }, 1000)
                })
            },
            getLocalTime(nS) {
                return new Date(parseInt(nS) * 1000).toLocaleString().replace(/:\d{1,2}$/,' ');
            },
            getDetail(){

            },
            handleWriteResult(task){
                this.dialogResultFrom =true;
                this.ResultFrom.stepId  = task.id
            },
            writeResult(){
                let data = Object.assign({}, this.ResultFrom)
                if (data.documentDate.toString().length>10)
                    data.documentDate =  parseInt(data.documentDate/1000);
                writeResult(data).then(response=>{
                    if (response.code === 200) {
                        this.$message({
                            message: '操作成功',
                            type: 'success',
                            showClose: true,
                            duration: 2000
                        })
                        this.getList();
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

            handleAcceptTaskSeach(task){
                let  data = this.acceptTaskFrom;
                data.stepId  = task.id
                accetpTask(data).then(response=>{
                    if (response.code === 200) {
                        this.$message({
                            message: '操作成功',
                            type: 'success',
                            showClose: true,
                            duration: 2000
                        })
                        this.getList();
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
            handleAcceptTask(task){
                this.dialogFormAccept =true;
                this.acceptTaskFrom.stepId  = task.id
            },
            acceptTask(){
                let  data = this.acceptTaskFrom;
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
                        this.getList();
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
