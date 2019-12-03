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
            <el-table-column type="expand" ref="expand222">
                <template slot-scope="{row}" >
                    <el-form label-position="left" inline class="table-expand" v-if="row.fromStep === '接警'">
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
                    <el-form label-position="left" inline class="table-expand" v-if="row.fromStep === '物证'">
                        <el-form-item label="物证编号">
                            <span>{{ row.material.thirdMaterialNo }}</span>
                        </el-form-item>
                        <el-form-item label="物证细类">
                            <span>{{ row.material.noned }}</span>
                        </el-form-item>
                        <el-form-item label="物证类别">
                            <span>{{ row.material.materialCategory }}</span>
                        </el-form-item>
                        <el-form-item label="物证类型">
                            <span>{{ row.material.materialType }}</span>
                        </el-form-item>
                        <el-form-item label="可靠程度">
                            <span>{{ row.material.reliabilityLevel }}</span>
                        </el-form-item>
                        <el-form-item label="遗留部位">
                            <span>{{ row.material.stayPart }}</span>
                        </el-form-item>
                        <el-form-item label="提取方法">
                            <span>{{ row.material.extractMethod }}</span>
                        </el-form-item>
                        <el-form-item label="利用情况">
                            <span>{{ row.material.usedType }}</span>
                        </el-form-item>
                        <el-form-item label="提取日期">
                            <span>{{  pareTime(row.material.extractTime) }}</span>
                        </el-form-item>
                        <el-form-item label="提取人">
                            <span>{{ row.material.extractName }}</span>
                        </el-form-item>
                        <el-form-item label="物证名称">
                            <span>{{ row.material.name }}</span>
                        </el-form-item>
                        <el-form-item label="特征描述">
                            <span>{{ row.material.note }}</span>
                        </el-form-item>
                        <el-form-item label="是否转移">
                            <span>{{ row.material.hasTransfered ? '是':'否' }}</span>
                        </el-form-item>
                        <el-form-item label="物证图片">
                           <span>
                                <el-image
                                        style="width: 100px; height: 100px"
                                        :src="row.material.imgUrl"
                                        fit="fit"></el-image>
                           </span>
                        </el-form-item>

                    </el-form>

                    <el-form label-position="left" inline class="table-expand"  v-else-if="row.fromStep === '痕检'">
                        <el-form-item label="勘查开始">
                            <span>{{   pareTime(row.evidence.examBeginTime) }}</span>
                        </el-form-item>
                        <el-form-item label="勘查结束">
                            <span>{{  pareTime(row.evidence.examEndTime) }}</span>
                        </el-form-item>
                        <el-form-item label="发案开始">
                            <span>{{   pareTime(row.evidence.caseBeginTime)}}</span>
                        </el-form-item>
                        <el-form-item label="发案结束">
                            <span>{{  pareTime(row.evidence.caseEndTime) }}</span>
                        </el-form-item>
                        <el-form-item label="发案地点">
                            <span>{{ row.evidence.caseAddress }}</span>
                        </el-form-item>
                        <el-form-item label="案件类别">
                            <span>{{ row.evidence.caseCategory }}</span>
                        </el-form-item>
                        <el-form-item label="现场保护情况">
                            <span>{{ row.evidence.sceneProtect }}</span>
                        </el-form-item>
                        <el-form-item label="发案区划">
                            <span>{{ row.evidence.caseHappenRegion }}</span>
                        </el-form-item>
                        <el-form-item label="主办">
                            <span>{{ row.evidence.mainChargerName }}</span>
                        </el-form-item>
                        <el-form-item label="协办">
                            <span>{{ row.evidence.supporterName }}</span>
                        </el-form-item>
                        <el-form-item label="照相">
                            <span>{{ row.evidence.photographName }}</span>
                        </el-form-item>
                        <el-form-item label="录像">
                            <span>{{ row.evidence.cameraName }}</span>
                        </el-form-item>
                        <el-form-item label="法医">
                            <span>{{ row.evidence.medicalName }}</span>
                        </el-form-item>
                        <el-form-item label="现场保护民警">
                            <span>{{ row.evidence.sceneProtectUid }}</span>
                        </el-form-item>
                        <el-form-item label="处所">
                            <span>{{ row.evidence.sceneType }}</span>
                        </el-form-item>
                        <el-form-item label="作案时机">
                            <span>{{ row.evidence.crimeTime }}</span>
                        </el-form-item>
                        <el-form-item label="侵入方式">
                            <span>{{ row.evidence.invadeType }}</span>
                        </el-form-item>
                        <el-form-item label="作案出口">
                            <span>{{ row.evidence.escapeType }}</span>
                        </el-form-item>
                        <el-form-item label="作案人数">
                            <span>{{ row.evidence.crimePeoples }}</span>
                        </el-form-item>

                        <el-form-item label="作案工具">
                            <span>{{ row.evidence.crimeTools }}</span>
                        </el-form-item>

                        <el-form-item label="警情号">
                            <span>{{ row.evidence.instanceNo }}</span>
                        </el-form-item>

                        <el-form-item label="案件编号">
                            <span>{{ row.evidence.caseNo }}</span>
                        </el-form-item>

                        <el-form-item label="现勘号">
                            <span>{{ row.evidence.thirdEvidenceNo }}</span>
                        </el-form-item>

                        <el-form-item label="勘查号">
                            <span>{{ row.evidence.selfEvidenceNo }}</span>
                        </el-form-item>

                        <el-form-item label="作案过程">
                            <span>{{ row.evidence.crimeDetail }}</span>
                        </el-form-item>

                        <el-form-item label="是否有监控">
                            <span>{{ row.evidence.hasCamera ? '是':'否' }}</span>
                        </el-form-item>

                        <el-form-item label="是否十类案件">
                            <span>{{ row.evidence.isTenCase ? '是':'否'  }}</span>
                        </el-form-item>

                        <el-form-item label="是否死亡案件">
                            <span>{{ row.evidence.isDeathCase ? '是':'否'  }}</span>
                        </el-form-item>

                    </el-form>
                </template>

            </el-table-column>
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
                        <el-button type="primary" size="small" >编辑现勘</el-button>
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
                    物证编号：{{ detail.material.thirdMaterialNo }}
                </el-col>
                <el-col :span="12">
                    物证类别：{{ detail.material.materialCategory }}
                </el-col>
            </el-row>
            <el-row :gutter="20">
                <el-col :span="12">
                    遗留部位：{{ detail.material.stayPart }}
                </el-col>
                <el-col :span="12">
                    提取方法：{{ detail.material.extractMethod }}
                </el-col>
            </el-row>
            <el-row :gutter="20">
                <el-col :span="12">
                    提取日期：{{  pareTime(detail.material.extractTime) }}
                </el-col>
                <el-col :span="12">
                    提取人：{{ detail.material.extractName }}
                </el-col>
            </el-row>
            <el-row :gutter="20">
                <el-col :span="12">
                    可靠程度：{{ detail.material.reliabilityLevel }}
                </el-col>
                <el-col :span="12">
                    利用情况：{{ detail.material.usedType }}
                </el-col>
            </el-row>
            <el-divider content-position="center">案件信息</el-divider>
            <el-row :gutter="20">
                <el-col :span="12">
                    勘查号：{{ detail.evidence.selfEvidenceNo }}
                </el-col>
                <el-col :span="12">
                    现勘号：{{ detail.evidence.thirdEvidenceNo }}
                </el-col>
            </el-row>
            <el-row :gutter="20">
                <el-col :span="12">
                    案件编号：{{ detail.evidence.caseNo }}
                </el-col>
                <el-col :span="12">
                    案件类别：{{ detail.evidence.caseCategory }}
                </el-col>
            </el-row>
            <el-row :gutter="20">
                <el-col :span="12">
                    案发地点：{{ detail.evidence.crimeTools }}
                </el-col>
                <el-col :span="12">
                    案发时间：{{  pareTime(detail.evidence.caseBeginTime) }}
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
                detail:{
                    evidence:{
                        selfEvidenceNo:'',
                        thirdEvidenceNo:'',
                        caseNo:'',
                        caseCategory:'',
                        crimeTools:'',
                        caseBeginTime:'',
                    },
                    material:{
                        thirdMaterialNo:'',
                        materialCategory:'',
                        stayPart:'',
                        extractTime:'',
                        extractMethod:'',
                        extractName:'',
                        reliabilityLevel:'',
                        usedType:'',
                    }
                }
            }
        },
        created() {
            this.getList();

        },
        methods:{
            pareTime(time){
                if (time) {
                    return this.formatDate(time*1000)
                }else{
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

                    this.listLoading = false

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
                this.detail = task;
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
