<template>
    <div class="app-container">
        <div class="filter-container">

                <el-button v-waves type="primary"  @click="handleApply"
                           style="float: right;margin-right: 20px;margin-bottom: 10px">
                    <svg-icon icon-class="jichuguanli" /> 申请串并
                </el-button>

        </div>
        <el-table
                v-loading="listLoading"
                :key="tableKey"
                :data="list"
                border
                fit
                highlight-current-row
                style="width: 100%;"
                @selection-change="selectTask"
        >
            <el-table-column
                    v-model="taskId"
                    type="selection"
                    width="55"/>
            <el-table-column label="勘查号"  align="center" width="220px" >
                <template slot-scope="{row}">
                    <span>{{ row.evidence.selfEvidenceNo }}</span>
                </template>
            </el-table-column>

            <el-table-column label="发案日期"  align="center" width="320px">
                <template slot-scope="{row}">
                    <span>{{ row.evidence.caseHappenTime | parseTime('{y}-{m}-{d} {h}:{i}:{s}') }}</span>
                </template>
            </el-table-column>
            <el-table-column label="发案地址"   align="center" width="320px">
                <template slot-scope="{row}">
                    <span>{{ row.evidence.caseAddress }}</span>
                </template>
            </el-table-column>
            <el-table-column label="发案区划" align="center" width="320px">
                <template slot-scope="{row}">
                    <span>{{ row.evidence.caseHappenRegion }}</span>
                </template>
            </el-table-column>
            <el-table-column label="案件性质" align="center" width="220px">
                <template slot-scope="{row}">
                    <span>{{ row.evidence.caseType  }}</span>
                </template>
            </el-table-column>
            <el-table-column label="主办" align="center" width="220px">
                <template slot-scope="{row}">
                    <span>{{ row.evidence.mainChargerName }}</span>
                </template>
            </el-table-column>
            <el-table-column label="操作" align="center" fixed="right" width="280" class-name="small-padding fixed-width">
                <template slot-scope="{row}">
                    <router-link :to="'/search/show-search/'+row.evidenceId">
                        <el-button type="primary" size="mini" >查看</el-button>
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
                :hide-on-single-page="paginationShow"
                style="float: right;margin-top: 15px"
        >
        </el-pagination>
        <el-dialog title="串并申请" :close-on-click-modal="false" :visible.sync="dialogFormVisible" width="30%">
            <el-form
                    ref="dataForm"
                    :rules="rules"
                    :model="applyData"
                    label-position="left"
                    label-width="70px"
                    style="width: 70%; margin-left:50px;">

                <el-form-item label="串并依据" prop="path">
                    <el-input v-model="applyData.preConditions"/>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogFormVisible = false">
                    取 消
                </el-button>
                <el-button type="primary" @click="applyCompose()">
                    确 定
                </el-button>
            </div>
        </el-dialog>

    </div>
</template>

<style>
    .mb10 {
        margin-bottom: 10px;
    }
</style>

<script>
    import {robotResult} from '@/api/robot'
    import {applyCompose} from '@/api/compose'
    import waves from '@/directive/waves' // waves directive
    import { parseTime } from '@/utils'
    import { fetchAdminMemberList } from '@/api/permissions'

    export default {
        name: 'robotTaskResult',
        directives: {waves},
        data() {
            return {
                tableKey: 0,
                list: null,
                pages: 0,
                listLoading: false,
                paginationShow: true,

                searchTime: '',
                listQuery: {
                    page: 1,
                    id: undefined,
                },
                taskId: [],
                applyData:{
                    preConditions:'',
                    list:[],
                },
                dialogFormVisible: false,
                rules:{},
                curId:''

            }
        },
        created() {
            const id = this.$route.params && this.$route.params.id
            this.curId = id;
            this.getList(id)
        },
        methods: {
            handleApply(){
                if (this.taskId.length===0){
                    this.$confirm('请选择串并数据!')
                        .then(_ => {

                        })
                        .catch(_ => {});
                } else{
                    this.dialogFormVisible = true;
                }
            },
            selectTask(selection) {
                this.taskId = selection.map(data => {
                    return data.evidence.id
                })
            },
            applyCompose(){
                this.applyData.list =  this.taskId
                applyCompose(this.applyData).then(response=>{
                    if (response.code === 200) {
                        this.$message({
                            message: '操作成功',
                            type: 'success',
                            showClose: true,
                            duration: 2000
                        })
                        this.dialogFormVisible = false;
                        this.getList(this.curId)
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
            getList(id) {
                this.listQuery.id = id
                this.listLoading = true;
                robotResult(this.listQuery).then(response => {
                    this.list = response.list;
                    this.pages = response.pages

                    // Just to simulate the time of the request
                    this.listLoading = false

                })
            },

        }
    }
</script>
