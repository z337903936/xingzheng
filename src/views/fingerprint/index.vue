<template>
    <div class="app-container">
        <div class="filter-container">

            <el-input v-model="listQuery.taskNo" placeholder="指纹编号" class="mb10" style="width: 200px;"
                      @keyup.enter.native="handleFilter"/>
            <el-input v-model="listQuery.taskNo" placeholder="勘查号" class="mb10" style="width: 200px;"
                      @keyup.enter.native="handleFilter"/>
            <el-input v-model="listQuery.taskNo" placeholder="手印类型" class="mb10" style="width: 200px;"
                      @keyup.enter.native="handleFilter"/>
            <el-input v-model="listQuery.taskNo" placeholder="利用情况" class="mb10" style="width: 200px;"
                      @keyup.enter.native="handleFilter"/>
            <el-input v-model="listQuery.taskNo" placeholder="提取人" class="mb10" style="width: 200px;"
                      @keyup.enter.native="handleFilter"/>
            <el-input v-model="listQuery.taskNo" placeholder="比中信息" class="mb10" style="width: 200px;"
                      @keyup.enter.native="handleFilter"/>
            <el-input v-model="listQuery.taskNo" placeholder="检验人" class="mb10" style="width: 200px;"
                      @keyup.enter.native="handleFilter"/>
            <el-input v-model="listQuery.taskNo" placeholder="提取日期" class="mb10" style="width: 200px;"
                      @keyup.enter.native="handleFilter"/>
            <el-input v-model="listQuery.taskNo" placeholder="可靠程度" class="mb10" style="width: 200px;"
                      @keyup.enter.native="handleFilter"/>
            <el-input v-model="listQuery.taskNo" placeholder="关键字" class="mb10" style="width: 200px;"
                      @keyup.enter.native="handleFilter"/>
            <el-input v-model="listQuery.taskNo" placeholder="显示数量" class="mb10" style="width: 200px;"
                      @keyup.enter.native="handleFilter"/>
            <el-button v-waves type="primary" icon="el-icon-search" @click="handleFilter">
                搜索
            </el-button>

            <!--<el-button v-waves :loading="downloadLoading" type="primary" icon="el-icon-download" @click="handleDownload">-->
            <!--导出-->
            <!--</el-button>-->
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
            <el-table-column label="现场指纹编号" prop="id" align="center" width="210">
                <template slot-scope="{row}">
                    <span>{{ row.id }}</span>
                </template>
            </el-table-column>
            <el-table-column label="勘查号" width="250" align="center">
                <template slot-scope="{row}">
                    <span>{{ row.taskNo }}</span>
                </template>
            </el-table-column>
            <el-table-column label="物证编号" width="210" align="center">
                <template slot-scope="{row}">
                    <span>{{ row.receiptTime | parseTime('{y}-{m}-{d} {h}:{i}:{s}') }}</span>
                </template>
            </el-table-column>
            <el-table-column label="手印类型" width="150" align="center">
                <template slot-scope="{row}">
                    <span>{{ row.reporter }}</span>
                </template>
            </el-table-column>
            <el-table-column label="利用情况" width="110" align="center">
                <template slot-scope="{row}">
                    <span>{{ row.reportOrg }}</span>
                </template>
            </el-table-column>
            <el-table-column label="比中信息"  align="center">
                <template slot-scope="{row}">
                    <span>{{ row.contactPhoneNumber }}</span>
                </template>
            </el-table-column>
            <el-table-column label="提取人" width="110" align="center">
                <template slot-scope="{row}">
                    <span>{{ row.caseCategory }}</span>
                </template>
            </el-table-column>
            <el-table-column label="检验人" width="110" align="center">
                <template slot-scope="{row}">
                    <span>{{ row.techName }}</span>
                </template>
            </el-table-column>
            <el-table-column label="提取日期" width="110" align="center">
                <template slot-scope="{row}">
                    <span>{{ row.techName }}</span>
                </template>
            </el-table-column>

            <el-table-column label="操作" align="center" width="230" class-name="small-padding fixed-width">
                <template slot-scope="{row}">
                    <router-link :to="'/alarm/edit-alarm/'+row.id">
                        <el-button v-waves type="primary" size="mini" icon="el-icon-edit">编辑</el-button>
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
    import {fetchList, fetchAlarm, createAlarm, updateAlarm} from '@/api/alarm'
    import waves from '@/directive/waves' // waves directive
    import {parseTime} from '@/utils'
    import {fetchAdminMemberList} from '@/api/permissions'


    export default {
        name: 'Dna',
        directives: {waves},
        data() {
            return {
                tableKey: 0,
                list: null,
                pages: 0,
                listLoading: false,
                paginationShow: true,
                searchTime: '',
                limit: 20,
                listQuery: {
                    page: 1,
                    beginTime: undefined,
                    endTime: undefined,
                    leaderName: undefined,
                    receiptName: undefined,
                    reporterOrg: undefined,
                    reporterName: undefined,
                    caseCategoryId: undefined
                },
                rules: {},
                downloadLoading: false,
            }
        },
        created() {
            // this.getList()
        },
        methods: {
            // getList() {
            //     this.listLoading = true;
            //     fetchList(this.listQuery).then(response => {
            //         this.list = response.list;
            //         this.pages = response.pages
            //
            //         // Just to simulate the time of the request
            //         setTimeout(() => {
            //             this.listLoading = false
            //         }, 1000)
            //     })
            // },
            // handleFilter() {
            //     if (this.searchTime[0].toString().length > 10)
            //         this.listQuery.beginTime = this.searchTime[0] / 1000;
            //     if (this.searchTime[1].toString().length > 10)
            //         this.listQuery.endTime = this.searchTime[1] / 1000;
            //     this.listQuery.page = 1;
            //     this.getList()
            // },
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
