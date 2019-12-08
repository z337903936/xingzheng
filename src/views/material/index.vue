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
            <el-table-column label="遗留部位" align="center" width="100">
                <template slot-scope="{row}">
                    <span>{{ row.stayPart }}</span>
                </template>
            </el-table-column>
            <el-table-column label="可靠程度"  width="180" align="center">
                <template slot-scope="{row}">
                    <span>{{ row.reliabilityLevel }}</span>
                </template>
            </el-table-column>
            <el-table-column label="利用情况" width="210" align="center">
                <template slot-scope="{row}">
                    <span>{{ row.usedType }}</span>
                </template>
            </el-table-column>
            <el-table-column label="物证名称" width="210" align="center">
                <template slot-scope="{row}">
                    <span>{{ row.name }}</span>
                </template>
            </el-table-column>
            <el-table-column label="特征描述" width="100" align="center">
                <template slot-scope="{row}">
                    <span>{{ row.note }}</span>
                </template>
            </el-table-column>
            <el-table-column label="物证类型" width="210" align="center">
                <template slot-scope="{row}">
                    <span>{{ row.materialType }}</span>
                </template>
            </el-table-column>
            <el-table-column label="提取日期" width="210" align="center">
                <template slot-scope="{row}">
                    <span>{{ row.extractTime | parseTime('{y}-{m}-{d} {h}:{i}:{s}') }}</span>
                </template>
            </el-table-column>
            <el-table-column label="提取方法" width="210" align="center">
                <template slot-scope="{row}">
                    <span>{{ row.extractMethod }}</span>
                </template>
            </el-table-column>
            <el-table-column label="提取人" width="210" align="center">
                <template slot-scope="{row}">
                    <span>{{ row.extractUid }}</span>
                </template>
            </el-table-column>
            <el-table-column label="转移时间" width="210" align="center">
                <template slot-scope="{row}">
                    <span>{{ row.createTime | parseTime('{y}-{m}-{d} {h}:{i}:{s}') }}</span>
                </template>
            </el-table-column>

            <el-table-column label="操作" align="center" width="230" class-name="small-padding fixed-width">
                <template slot-scope="{row}">
                    <router-link :to="'/material/edit/'+row.id">
                        <el-button v-waves type="primary" size="mini"  icon="el-icon-edit">编辑</el-button>
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

    </div>
</template>

<style>
    .mb10 {
        margin-bottom: 10px;
    }
</style>

<script>
    import {fetchMaterialList,delMaterial} from '@/api/material'
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
            }
        },
        created(){
            this.getList()
        },
        methods: {
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
