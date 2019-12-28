<template>
    <div class="app-container">
        <el-table
                v-loading="listLoading"
                :key="tableKey"
                :data="list"
                border
                fit
                highlight-current-row
                style="width: 100%;"
        >
            <el-table-column label="串并编号"  prop="id" align="center" width="250">
                <template slot-scope="{row}">
                    <span>{{ row.composeNo }}</span>
                </template>
            </el-table-column>

            <el-table-column label="串并依据" align="center" >
                <template slot-scope="{row}">
                    <span>{{ row.preConditions }}</span>
                </template>
            </el-table-column>

            <el-table-column label="申请人"  width="200" align="center">
                <template slot-scope="{row}">
                    <span>{{ row.createName  }}</span>
                </template>
            </el-table-column>
            <el-table-column label="申请时间"  width="200" align="center">
                <template slot-scope="{row}">
                    <span>{{ row.applyTime | parseTime('{y}-{m}-{d} {h}:{i}:{s}')  }}</span>
                </template>
            </el-table-column>

            <el-table-column label="任务状态" width="110" align="center">
                <template slot-scope="{row}">
                    <span>{{ row.status===1?'申请中 ':row.status===2?'已同意':'已拒绝' }}</span>
                </template>
            </el-table-column>
            <el-table-column label="操作" align="center" fixed="right"  width="380" class-name="small-padding">
                <template slot-scope="{row}">
                    <el-button v-waves type="success" icon="el-icon-document-checked" size="mini" style="width: 100px"  v-if="row.status ===1" @click="handleaudit(row,true)">
                        同意
                    </el-button>
                    <el-button v-waves type="warning" icon="el-icon-document-delete" size="mini" style="width: 100px"  v-if="row.status ===1" @click="handleaudit(row,false)">
                        拒绝
                    </el-button>
                    <router-link :to="'/compose/detail/'+row.id" style="margin-left: 10px">
                        <el-button v-waves  type="info" size="mini" icon="el-icon-zoom-in" style="width: 100px">查看</el-button>
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

        <el-dialog title="串并审核" :close-on-click-modal="false" :visible.sync="dialogFormVisible" width="30%">
            <el-form
                    ref="dataForm"
                    :rules="rules"
                    :model="auditForm"
                    label-position="left"
                    label-width="70px"
                    style="width: 70%; margin-left:50px;">

                <el-form-item label="理由" prop="path">
                    <el-input v-model="auditForm.note"/>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogFormVisible = false">
                    取 消
                </el-button>
                <el-button type="primary" @click="audit()">
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
    import {auditComposeList,auditCompose} from '@/api/compose'
    import waves from '@/directive/waves' // waves directive
    import { parseTime } from '@/utils'
    import { fetchAdminMemberList } from '@/api/permissions'


    export default {
        name: 'composeAudit',
        directives: {waves},
        data() {
            return {
                tableKey: 0,
                list: null,
                pages: 0,
                listLoading: false,
                paginationShow: true,
                dialogFormVisible: false,
                listQuery: {
                    page: 1,
                },
                auditForm:{
                    taskId:undefined,
                    agree:undefined,
                    note:undefined,
                },


            }
        },
        created() {
            this.getList()
        },
        methods: {
            reset() {
                this.listQuery = {
                    page: 1,
                };

            },
            handleaudit(data,type){
                this.auditForm.taskId = data.id;
                this.auditForm.agree = type;
                this.dialogFormVisible = true;
            },
            audit(){
                auditCompose(this.auditForm).then(response => {
                    if (response.code === 200) {
                        this.$message({
                            message: '操作成功',
                            type: 'success',
                            showClose: true,
                            duration: 2000
                        })
                        this.dialogFormVisible = false
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
            getList() {
                this.listLoading = true;
                auditComposeList(this.listQuery).then(response => {
                    this.list = response.list;
                    this.pages = response.pages
                    // Just to simulate the time of the request
                    this.listLoading = false

                })
            },


        }
    }
</script>
