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
                    <!--<router-link :to="'/material/create'" style="float: right;margin-right: 20px">-->
                        <!--<el-button v-waves type="primary"  icon="el-icon-edit">添加</el-button>-->
                    <!--</router-link>-->
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
            <el-table-column label="任务编号" prop="id" align="center" width="180">
                <template slot-scope="{row}">
                    <span>{{ row.taskNo }}</span>
                </template>
            </el-table-column>
            <el-table-column label="现勘号" prop="id" align="center" width="180">
                <template slot-scope="{row}">
                    <span>{{ row.evidenceNo }}</span>
                </template>
            </el-table-column>
            <el-table-column label="物证数量" align="center" min-width="100">
                <template slot-scope="{row}">
                    <span>{{ row.examNumber }}</span>
                </template>
            </el-table-column>
            <el-table-column label="来源" width="210" align="center">
                <template slot-scope="{row}">
                    <span>{{ row.fromStep }}</span>
                </template>
            </el-table-column>
            <el-table-column label="转移人" width="100" align="center">
                <template slot-scope="{row}">
                    <span>{{ row.fromName }}</span>
                </template>
            </el-table-column>
            <el-table-column label="接收人" width="210" align="center">
                <template slot-scope="{row}">
                    <span>{{ row.createName }}</span>
                </template>
            </el-table-column>

            <el-table-column label="转移时间" width="170" align="center">
                <template slot-scope="{row}">
                    <span>{{ row.createTime | parseTime('{y}-{m}-{d} {h}:{i}:{s}') }}</span>
                </template>
            </el-table-column>

            <el-table-column label="操作" align="center" width="230" fixed="right" class-name="small-padding fixed-width">
                <template slot-scope="{row}">
                    <!--<router-link :to="'/material/batch/'+row.id">-->
                        <!--<el-button v-waves type="primary" size="mini" style="width: 100px"  icon="el-icon-tickets">物证详情</el-button>-->
                    <!--</router-link>-->
                    <!--<router-link :to="'/material/edit/'+row.id">-->
                        <!--<el-button v-waves type="primary" size="mini"  icon="el-icon-edit">编辑</el-button>-->
                    <!--</router-link>-->

                    <!--<el-button v-waves type="primary" style="width: 70px"  size="mini" @click="handleDelete(row)" >-->
                        <!--销毁申请-->
                    <!--</el-button>-->
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



    </div>
</template>

<style>
    .mb10 {
        margin-bottom: 10px;
    }
</style>

<script>
    import {fetchMaterialList,delMaterial,applyDelMaterial} from '@/api/material'
    import { batchList, batchMaterialList } from '@/api/common'
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
                    evidenceNo: undefined,
                    bizName: 'MATERIAL_STOCK',
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
            getList(id) {
                this.listLoading = true;
                batchList(this.listQuery).then(response => {
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
