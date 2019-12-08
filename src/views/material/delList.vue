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
                />
                <el-input v-model="listQuery.materialNo" placeholder="物证编号" class="mb10" style="width: 200px;"
                          @keyup.enter.native="handleFilter"/>
                <el-input v-model="listQuery.applyName" placeholder="申请人" class="mb10" style="width: 200px;"
                          @keyup.enter.native="handleFilter"/>
                <el-input v-model="listQuery.toName" placeholder="接收人" class="mb10" style="width: 200px;"
                          @keyup.enter.native="handleFilter"/>
                <div style="margin-top: 15px">
                    <el-input v-model="listQuery.name" placeholder="物证名字" class="mb10" style="width: 200px;"
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
            <el-table-column label="物证名称" width="250" align="center">
                <template slot-scope="{row}">
                    <span>{{ row.name }}</span>
                </template>
            </el-table-column>
            <el-table-column label="销毁理由" width="150" align="center">
                <template slot-scope="{row}">
                    <span>{{ row.reason  }}</span>
                </template>
            </el-table-column>
            <el-table-column label="申请人" width="120" align="center">
                <template slot-scope="{row}">
                    <span>{{ row.applyName }}</span>
                </template>
            </el-table-column>

            <el-table-column label="申请时间" width="300" align="center">
                <template slot-scope="{row}">
                    <span>{{ row.applyTime | parseTime('{y}-{m}-{d} {h}:{i}:{s}') }}</span>
                </template>
            </el-table-column>
            <el-table-column label="审核人" width="170" align="center">
                <template slot-scope="{row}">
                    <span>{{ row.approverName }}</span>
                </template>
            </el-table-column>
            <el-table-column label="审核时间" width="210" align="center">
                <template slot-scope="{row}">
                    <span>{{ row.approveTime | parseTime('{y}-{m}-{d} {h}:{i}:{s}') }}</span>
                </template>
            </el-table-column>
            <el-table-column label="状态" width="170" align="center">
                <template slot-scope="{row}">
                    <span>{{ row.approveStatus ===1?'申请人':row.approveStatus ===2?'同意':'驳回'  }}</span>
                </template>
            </el-table-column>
            <el-table-column label="操作" align="center" width="230" fixed="right" class-name="small-padding fixed-width">
                <template slot-scope="{row}">
                    <el-button v-if="row.approveStatus ===1" v-waves type="primary" style="width: 70px"  size="mini" @click="handleDeleteAction(row,1)" >
                        同意
                    </el-button>
                    <el-button v-if="row.approveStatus ===1" v-waves type="primary" style="width: 70px"  size="mini" @click="handleDeleteAction(row,2)" >
                        驳回
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
    import {delMaterialList,delMaterialAction} from '@/api/material'
    import waves from '@/directive/waves' // waves directive
    import {parseTime} from '@/utils'
    import { fetchAdminMemberList} from '@/api/permissions'

    export default {
        name: 'delList',
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
                listQuery: {
                    page: 1,
                    beginTime: undefined,
                    endTime: undefined,
                    filters: undefined,
                    applyName: undefined,
                    toName: undefined,
                    name: undefined,
                    materialNo: undefined
                },
                rules:{},
                downloadLoading: false,
            }
        },
        created(){
            this.getList()
        },
        methods: {
            handleDeleteAction(val,type){
                const sendData = {
                    id:val.id,
                    status:type,
                };
                delMaterialAction(sendData).then(response=>{
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
            getList(id) {
                this.listLoading = true;
                delMaterialList(this.listQuery).then(response => {
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
                    applyName: undefined,
                    toName: undefined,
                    name: undefined,
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

        }
    }
</script>
