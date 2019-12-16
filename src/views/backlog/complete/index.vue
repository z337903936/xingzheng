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
                <template slot-scope="{row}">
                    <span>{{ row.evidence.caseHappenTime + row.evidence.caseAddress + row.evidence.caseCategory }}</span>
                </template>
            </el-table-column>
            <el-table-column label="案件类别" align="center" width="150">
                <template slot-scope="{row}">
                    <span>{{ row.evidence.caseCategory }}</span>
                </template>
            </el-table-column>
            <el-table-column label="状态" align="center" width="100">
                <template slot-scope="{row}">
                    <span>{{ row.status | statusFilter }}</span>
                </template>
            </el-table-column>


            <el-table-column label="操作" align="center" width="230" class-name="small-padding fixed-width">

                <template slot-scope="{row}">
                    <router-link :to="'/material/detail/'+row.examBatch.id" v-if=" row.stepName === '申请物证入库'  || row.stepName === '申请物证出库' ">
                        <el-button v-waves type="primary" size="mini" style="width: 100px"  icon="el-icon-tickets">物证详情</el-button>
                    </router-link>
                    <router-link :to="'/medical/result/'+row.id"
                                 v-if=" row.stepName === '法医现勘' ">
                        <el-button icon="el-icon-edit" type="primary" size="small">填写结果</el-button>
                    </router-link>
                    <!--<router-link :to="'/material/batch/'+row.examBatchId"-->
                                 <!--v-if="row.stepName === 'DNA送检' && row.stepName === '指纹送检' && row.stepName === '理化送检' && row.stepName === '电子物证送检'"-->
                    <!--&gt;-->
                        <!--<el-button v-waves type="success" size="mini" icon="el-icon-tickets" style="width: 100px">物证详情</el-button>-->
                    <!--</router-link>-->
                    <el-button v-waves type="primary" size="mini" style="width: 100px" @click="gotobatchList(row)"  icon="el-icon-tickets"
                               v-if="row.stepName === 'DNA送检' && row.stepName === '指纹送检' && row.stepName === '理化送检' && row.stepName === '电子物证送检'">
                        物证详情</el-button>
                    <router-link :to="'/search/update-search/'+row.evidence.id" v-if="row.stepName === '痕检现勘' || row.stepName === '警情扭转' ">
                        <el-button type="primary" size="mini" icon="el-icon-edit" >编辑</el-button>
                    </router-link>
                    <router-link :to="'/search/show-search/'+row.evidence.id" v-if="row.stepName === '痕检现勘' || row.stepName === '警情扭转'">
                        <el-button type="success" size="mini" icon="el-icon-zoom-in">查看</el-button>
                    </router-link>
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
                        if (data.evidence.caseHappenTime) {
                            data.evidence.caseHappenTime = parseTime(data.evidence.caseHappenTime,'{y}-{m}-{d} {h}:{i}:{s}')
                        }else{
                            data.evidence.caseHappenTime = ''
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
