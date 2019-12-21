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
            <el-table-column label="勘查号" prop="id" align="center" width="180">
                <template slot-scope="{row}">
                    <span>{{ row.evidenceNo }}</span>
                </template>
            </el-table-column>
            <el-table-column label="简要案情" align="center" min-width="200">
                <template slot-scope="{row}">
                    <span>{{ row.evidence.caseHappenTime }}</span>
                    <span v-if="row.evidence.caseHappenTime && row.evidence.caseAddress">
                        在
                    </span>
                    <span>
                        {{ row.evidence.caseAddress + row.evidence.caseCategory  }}
                    </span>
                    <span v-if=" row.evidence.caseCategory">
                        案
                    </span>
                </template>
            </el-table-column>
            <el-table-column label="物证数量" prop="id" align="center" width="180">
                <template slot-scope="{row}">
                    <span>{{ row.examNumber }}</span>
                </template>
            </el-table-column>
            <el-table-column label="移交人" prop="id" align="center" width="180">
                <template slot-scope="{row}">
                    <span>{{ row.fromName }}</span>
                </template>
            </el-table-column>
            <el-table-column label="移交时间" prop="id" align="center" width="180">
                <template slot-scope="{row}">
                    <span>{{ row.createTime | parseTime('{y}-{m}-{d} {h}:{i}:{s}') }}</span>
                </template>
            </el-table-column>
            <el-table-column label="物证库存放位置" prop="id" align="center" width="180">
                <template slot-scope="{row}">
                    <span>{{ row.stepName }}</span>
                </template>
            </el-table-column>



            <el-table-column label="操作" align="center" width="330" fixed="right" class-name="small-padding fixed-width">
                <template slot-scope="{row}">
                    <router-link :to="'/material/detail/'+row.id">
                        <el-button v-waves type="primary" size="mini" style="width: 100px"  icon="el-icon-tickets">物证详情</el-button>
                    </router-link>
                    <el-button v-waves type="success" style="width: 70px"  size="mini" @click="agreeIn(row)" v-if="row.status === 1" >
                        同意
                    </el-button>
                    <el-button v-waves type="warning" style="width: 70px;margin-left: 0"  size="mini" @click="denyIn(row)" v-if="row.status === 1">
                        拒绝
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



    </div>
</template>

<style>
    .mb10 {
        margin-bottom: 10px;
    }
</style>

<script>
    import {fetchMaterialList,delMaterial,applyDelMaterial,agreeMaterialIn,dnyMaterialIn} from '@/api/material'
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
            getList() {
                this.listLoading = true;
                batchList(this.listQuery).then(response => {
                    this.list = response.list;
                    this.pages = response.pages
                    this.list.map(data=>{
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
            agreeIn(data){
                const sendData={
                    batchId:data.id
                }
                agreeMaterialIn(sendData).then(response=>{
                    if (response.code === 200) {
                        this.$message({
                            message: '操作成功',
                            type: 'success',
                            showClose: true,
                            duration: 2000
                        })
                        this.getList()
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
            denyIn(data){
                const sendData={
                    batchId:data.id
                }
                dnyMaterialIn(sendData).then(response=>{
                    if (response.code === 200) {
                        this.$message({
                            message: '操作成功',
                            type: 'success',
                            showClose: true,
                            duration: 2000
                        })
                        this.getList()
                    } else {
                        this.$message({
                            message: response.reason,
                            type: 'success',
                            showClose: true,
                            duration: 2000
                        })
                    }
                })
            }


        }
    }
</script>
