<template>
    <div class="app-container">
        <div class="filter-container">
            <div>
                <el-date-picker
                        v-model="searchTime"
                        type="datetimerange"
                        range-separator="至"
                        start-placeholder="移交开始时间"
                        end-placeholder="移交结束时间"
                        value-format="timestamp"
                        style="width: 405px;"
                />
                <el-input v-model="listQuery.materialNo" placeholder="物证编号" class="mb10" style="width: 200px;"
                          @keyup.enter.native="handleFilter"/>
                <el-input v-model="listQuery.evidenceNo" placeholder="勘查号" class="mb10" style="width: 200px;"
                          @keyup.enter.native="handleFilter"/>
                <el-input v-model="listQuery.storagePlace" placeholder="物证库" class="mb10" style="width: 200px;"
                          @keyup.enter.native="handleFilter"/>
                <div style="margin-top: 15px">
                    <el-input v-model="listQuery.fromName" placeholder="移交人" class="mb10" style="width: 200px;"
                              @keyup.enter.native="handleFilter"/>
                    <el-input v-model="listQuery.filters" placeholder="关键字" class="mb10" style="width: 200px;"
                              @keyup.enter.native="handleFilter"/>
                    <el-button v-waves type="primary" icon="el-icon-search" @click="reset"
                               style="float: right;margin-right: 20px">
                        清空搜索条件
                    </el-button>
                    <el-button v-waves type="primary" icon="el-icon-search" @click="handleFilter" style="float: right;margin-right: 20px">
                        搜索
                    </el-button>
                    <router-link :to="'/material/create'" style="float: right;margin-right: 20px">
                        <el-button v-waves type="primary"  icon="el-icon-edit">添加</el-button>
                    </router-link>
                </div>



                <!--<el-button v-waves :loading="downloadLoading" type="primary" icon="el-icon-download" @click="handleDownload">-->
                <!--导出-->
                <!--</el-button>-->
            </div>
        </div>

        <el-table
                v-loading="listLoading"
                :key="tableKey"
                :data="list"
                border
                fit
                highlight-current-row
                style="width: 100%;"
        >
            <el-table-column label="物证编码" prop="id" align="center" width="180">
                <template slot-scope="{row}">
                    <span>{{ row.materialNo }}</span>
                </template>
            </el-table-column>
            <el-table-column label="物证库编号" align="center" width="200">
                <template slot-scope="{row}">
                    <span>{{ row.thirdMaterialNo }}</span>
                </template>
            </el-table-column>
            <el-table-column label="物证类别" width="150" align="center">
                <template slot-scope="{row}">
                    <span>{{ row.materialCategory  }}</span>
                </template>
            </el-table-column>
            <el-table-column label="利用情况" width="120" align="center">
                <template slot-scope="{row}">
                    <span>{{ row.usedType }}</span>
                </template>
            </el-table-column>
            <el-table-column label="物证名称" width="250" align="center">
                <template slot-scope="{row}">
                    <span>{{ row.name }}</span>
                </template>
            </el-table-column>
            <el-table-column label="特征描述" width="300" align="center">
                <template slot-scope="{row}">
                    <span>{{ row.note }}</span>
                </template>
            </el-table-column>
            <el-table-column label="物证类型" width="170" align="center">
                <template slot-scope="{row}">
                    <span>{{ row.materialType }}</span>
                </template>
            </el-table-column>
            <el-table-column label="转移时间" width="210" align="center">
                <template slot-scope="{row}">
                    <span>{{ row.transferTime | parseTime('{y}-{m}-{d} {h}:{i}:{s}') }}</span>
                </template>
            </el-table-column>

            <el-table-column label="操作" align="center" width="230" fixed="right" class-name="small-padding fixed-width">
                <template slot-scope="{row}">
                    <router-link :to="'/material/edit/'+row.id">
                        <el-button v-waves type="primary" size="mini"  icon="el-icon-edit">编辑</el-button>
                    </router-link>

                    <el-button v-waves type="primary" style="width: 70px"  size="mini" @click="handleDelete(row)" >
                        销毁申请
                    </el-button>
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

        <el-dialog title="销毁申请" :close-on-click-modal="false" :visible.sync="dialogdeleteForm" width="40%">
            <el-form
                    ref="rules"
                    :model="deleteForm"
                    label-position="left"
                    label-width="70px"
                    style="width: 80%; margin-left:50px;">
                <el-form-item label="理由" prop="reason">
                    <el-input v-model="deleteForm.reason"/>
                </el-form-item>

            </el-form>

            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogdeleteForm = false">
                    取 消
                </el-button>
                <el-button type="primary" @click="pushDelete()">
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
    import {fetchMaterialList,delMaterial,applyDelMaterial} from '@/api/material'
    import waves from '@/directive/waves' // waves directive
    import {parseTime} from '@/utils'
    import { fetchAdminMemberList} from '@/api/permissions'


    export default {
        name: 'Material',
        directives: {waves},
        data() {
            return {
                tableKey: 0,
                list: null,
                activeName: 'first',
                pages: 0,
                listLoading: false,
                paginationShow: true,
                searchTime: '',
                limit: 20,
                deleteForm: {
                    id:undefined,
                    reason:undefined
                },
                listQuery: {
                    page: 1,
                    beginTime: undefined,
                    endTime: undefined,
                    filters: undefined,
                    fromName: undefined,
                    storagePlace: undefined,
                    evidenceNo: undefined,
                    materialNo: undefined
                },
                rules:{},
                downloadLoading: false,
                dialogdeleteForm: false,
            }
        },
        created(){
            this.getList()
        },
        methods: {
            handleDelete(val){
                this.deleteForm.id = val.id;
                this.dialogdeleteForm = true;
            },
            pushDelete(){
                applyDelMaterial(this.deleteForm).then(response=>{
                    if (response.code === 200) {
                        this.$message({
                            message: '操作成功',
                            type: 'success',
                            showClose: true,
                            duration: 2000
                        })
                        this.dialogdeleteForm = false;
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
                this.listLoading = true;
                fetchMaterialList(this.listQuery).then(response => {
                    this.list = response.list;
                    this.pages = response.pages

                    // Just to simulate the time of the request

                        this.listLoading = false

                })
            },
            reset() {
                this.listQuery = {
                    page: 1,
                    beginTime: undefined,
                    endTime: undefined,
                    filters: undefined,
                    fromName: undefined,
                    storagePlace: undefined,
                    evidenceNo: undefined,
                    materialNo: undefined
                };
                this.searchTime = '';
            },
            handleFilter () {
                if (this.searchTime[0].toString().length>10)
                    this.listQuery.beginTime = this.searchTime[0]/1000;
                if (this.searchTime[1].toString().length>10)
                    this.listQuery.endTime = this.searchTime[1]/1000;
                this.listQuery.page = 1;
                this.getList()
            },
            //
            // handleDownload() {
            //     this.downloadLoading = true
            //     import('@/vendor/Export2Excel').then(excel => {
            //         const tHeader = ['timestamp', 'title', 'type', 'importance', 'status']
            //         const filterVal = ['timestamp', 'title', 'type', 'importance', 'status']
            //         const data = this.formatJson(filterVal, this.list)
            //         excel.export_json_to_excel({
            //             header: tHeader,
            //             data,
            //             filename: 'table-list'
            //         })
            //         this.downloadLoading = false
            //     })
            // },
            // formatJson(filterVal, jsonData) {
            //     return jsonData.map(v => filterVal.map(j => {
            //         if (j === 'timestamp') {
            //             return parseTime(v[j])
            //         } else {
            //             return v[j]
            //         }
            //     }))
            // },

        }
    }
</script>
