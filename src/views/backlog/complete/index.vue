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
            <el-table-column  type="expand" ref="expand">
                <template slot-scope="{row}">
                    <el-form label-position="left" inline class="table-expand" v-if="row.status === -2">
                        <el-form-item label="报告人">
                            <span>{{ row.record.reporter }}</span>
                        </el-form-item>
                        <el-form-item label="报告单位">
                            <span>{{ row.record.reportOrg }}</span>
                        </el-form-item>
                        <el-form-item label="接警时间">
                            <span>{{  pareTime(row.record.receiptTime) }}</span>
                        </el-form-item>
                        <el-form-item label="联系电话">
                            <span>{{ row.record.contactPhoneNumber }}</span>
                        </el-form-item>
                        <el-form-item label="案件类别">
                            <span>{{ row.record.caseCategory }}</span>
                        </el-form-item>
                        <el-form-item label="案发时间">
                            <span>{{ pareTime(row.record.caseTime)  }}</span>
                        </el-form-item>
                        <el-form-item label="警情号">
                            <span>{{ row.record.instanceNo }}</span>
                        </el-form-item>
                        <el-form-item label="案发地点">
                            <span>{{ row.record.caseAddress }}</span>
                        </el-form-item>
                        <el-form-item label="案发摘要">
                            <span>{{ row.record.caseDigest }}</span>
                        </el-form-item>
                        <el-form-item label="损失情况">
                            <span>{{ row.record.lostDetail }}</span>
                        </el-form-item>
                        <el-form-item label="技术值班队长">
                            <span>{{ row.record.monitorName }}</span>
                        </el-form-item>
                        <el-form-item label="值班技术员">
                            <span>{{ row.record.techName }}</span>
                        </el-form-item>
                        <el-form-item label="大队值班领导">
                            <span>{{ row.record.leaderName }}</span>
                        </el-form-item>
                        <el-form-item label="接警人">
                            <span>{{ row.record.receiptName }}</span>
                        </el-form-item>
                        <el-form-item label="驾驶员">
                            <span>{{ row.record.driverName }}</span>
                        </el-form-item>
                    </el-form>

                </template>

            </el-table-column >
            <el-table-column label="任务单号" align="center" width="120">
                <template slot-scope="{row}">
                    <span>{{ row.taskNo }}</span>
                </template>
            </el-table-column>
            <el-table-column label="任务类型" align="center" width="120">
                <template slot-scope="{row}">
                    <span>{{ row.stepName }}</span>
                </template>
            </el-table-column>
            <el-table-column label="发送人" align="center" width="100">
                <template slot-scope="{row}">
                    <span>{{ row.fromUser }}</span>
                </template>
            </el-table-column>
            <el-table-column label="发送时间" align="center" width="170">
                <template slot-scope="{row}">
                    <span>{{ row.taskArriveTime | parseTime('{y}-{m}-{d} {h}:{i}:{s}')  }}</span>
                </template>
            </el-table-column>

            <el-table-column label="简要案情" align="center" style="min-width: 600px">
                <template slot-scope="{row}" v-if="row.evidence">
                    <span>{{ row.evidence?row.evidence.caseHappenTime:'' }}</span>
                    <span v-if="row.evidence && row.evidence.caseHappenTime && row.evidence.caseAddress">
                        在
                    </span>
                    <span>
                        {{ row.evidence ? row.evidence.caseAddress:'' + row.evidence ? row.evidence.caseCategory:''  }}
                    </span>
                    <span v-if="row.evidence && row.evidence.caseCategory">
                        案
                    </span>
                </template>
            </el-table-column>
            <el-table-column label="状态" align="center" width="100">
                <template slot-scope="{row}">
                    <span v-if="row.status === 3"><el-tag effect="dark" type="success">已完成</el-tag></span>
                    <span v-if="row.status === -1"><el-tag effect="dark" type="info">已拒绝</el-tag></span>
                    <span v-if="row.status === -2"><el-tag effect="dark" type="info">取消现勘</el-tag></span>
                    <div>
                        {{ row.reason }}
                    </div>
                </template>
            </el-table-column>


            <el-table-column label="操作" align="center" width="230" class-name="small-padding fixed-width">

                <template slot-scope="{row}">
                    <router-link :to="'/material/detail/'+row.examBatch.id" v-if=" row.stepName === '申请物证入库'  || row.stepName === '申请物证出库' ">
                        <el-button v-waves type="info" size="mini" style="width: 100px"  icon="el-icon-tickets">物证详情</el-button>
                    </router-link>
                    <el-button type="primary" size="small" icon="el-icon-edit" @click="gotoMedicalResult(row)"
                               v-if="row.stepName === '法医现勘' ">
                        填写结果
                    </el-button>
                    <!--<router-link :to="'/medical/result/'+row.id"-->
                                 <!--v-if=" row.stepName === '法医现勘' ">-->
                        <!--<el-button icon="el-icon-edit" type="primary" size="small">填写结果</el-button>-->
                    <!--</router-link>-->
                    <!--<router-link :to="'/material/batch/'+row.examBatchId"-->
                                 <!--v-if="row.stepName === 'DNA送检' && row.stepName === '指纹送检' && row.stepName === '理化送检' && row.stepName === '电子物证送检'"-->
                    <!--&gt;-->
                        <!--<el-button v-waves type="success" size="mini" icon="el-icon-tickets" style="width: 100px">物证详情</el-button>-->
                    <!--</router-link>-->
                    <el-button v-waves type="primary" plain size="mini" style="width: 100px" @click="gotobatchList(row)"  icon="el-icon-tickets"
                               v-if="row.stepName === 'DNA送检' || row.stepName === '指纹送检' || row.stepName === '理化送检' || row.stepName === '电子物证送检'">
                        物证详情</el-button>
                    <div v-if="row.evidence">
                        <router-link :to="'/search/update-search/'+row.evidence.id" v-if="row.stepName === '痕检现勘' || row.stepName === '警情扭转'">
                            <el-button type="primary" size="mini" icon="el-icon-edit" >编辑</el-button>
                        </router-link>
                        <router-link :to="'/search/show-search/'+row.evidence.id" v-if="row.stepName === '痕检现勘'">
                            <el-button type="info" size="mini" icon="el-icon-zoom-in">查看</el-button>
                        </router-link>
                    </div>

                    <!--<router-link :to="'/alarm/edit-alarm/'+row.record.id" v-if="row.stepName === '警情扭转'">-->
                        <!--<el-button type="success" size="mini" icon="el-icon-zoom-in" style="width: 100px">编辑</el-button>-->
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
    import {parseTime,formatDate} from '@/utils'
    import { fetchAdminMemberList} from '@/api/permissions'
    import {fetchList} from '@/api/dictionary'
    import waves from '@/directive/waves' // waves directive

    export default {
        name: "Complete",
        directives: {waves},
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
            gotoMedicalResult(row){
                this.$router.push({ name:'medicalResult',params:{id:row.id},query: { evidence:JSON.stringify(row)}})
            },
            pareTime(time) {
                if (time) {
                    return this.formatDate(time * 1000)
                } else {
                    return ''
                }
            },
            formatDate(now) {
                var time = new Date(now)
                var year = time.getFullYear();
                var month = time.getMonth() + 1;
                var date = time.getDate();
                var hour = time.getHours();
                var minute = time.getMinutes();
                var second = time.getSeconds();
                return year + "-" + month + "-" + date + " " + hour + ":" + minute + ":" + second;
            },
            gotobatchList(row){
                this.$router.push({ name:'materialBatch',params:{id:row.examBatch.id},query: { batch:JSON.stringify(row)}})
            },
            getList() {
                this.listLoading = true;
                taskList(this.listQuery).then(response => {

                    this.list = response.list
                    // this.pages = response.pages
                    this.list.map(data=>{
                        if (data.examBatch){
                            data.examBatchId = data.examBatch.id;
                        }
                        if (data.evidence) {
                            if (data.evidence.caseHappenTime) {
                                data.evidence.caseHappenTime = formatDate(data.evidence.caseHappenTime)
                            }else{
                                data.evidence.caseHappenTime = ''
                            }
                        }

                        return data;
                    })

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
<style scoped>
    .el-table >>> .el-table__expanded-cell[class*="cell"] {
        background-color: #f0f0f0 !important;
    }

    .table-expand {
        font-size: 0;

    }

    .table-expand label {
        width: 90px;
        color: #99a9bf;
    }

    .table-expand .el-form-item {
        margin-right: 0;
        margin-bottom: 0;
        width: 50%;
    }

    .el-row {
        margin-bottom: 20px;
    }

</style>
