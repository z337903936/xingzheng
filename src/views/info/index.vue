<template>
    <div class="app-container">
        <div class="filter-container">
            <el-date-picker
                    v-model="searchTime"
                    type="datetimerange"
                    range-separator="至"
                    start-placeholder="开始时间"
                    end-placeholder="结束时间"
                    value-format="timestamp"
            />
            <el-input v-model="listQuery.taskNo" placeholder="选择处所" class="mb10" style="width: 200px;"
                      @keyup.enter.native="handleFilter"/>
            <el-input v-model="listQuery.taskNo" placeholder="作案时机" class="mb10" style="width: 200px;"
                      @keyup.enter.native="handleFilter"/>
            <el-input v-model="listQuery.taskNo" placeholder="发案区划" class="mb10" style="width: 200px;"
                      @keyup.enter.native="handleFilter"/>
            <el-input v-model="listQuery.taskNo" placeholder="侵入方式" class="mb10" style="width: 200px;"
                      @keyup.enter.native="handleFilter"/>
            <el-input v-model="listQuery.taskNo" placeholder="作案出口" class="mb10" style="width: 200px;"
                      @keyup.enter.native="handleFilter"/>
            <el-input v-model="listQuery.taskNo" placeholder="作案人数" class="mb10" style="width: 200px;"
                      @keyup.enter.native="handleFilter"/>
            <el-input v-model="listQuery.taskNo" placeholder="作案工具" class="mb10" style="width: 200px;"
                      @keyup.enter.native="handleFilter"/>
            <el-input v-model="listQuery.taskNo" placeholder="关键字" class="mb10" style="width: 200px;"
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
            <el-table-column label="勘查号" prop="id" align="center" width="220">
                <template slot-scope="{row}">
                    <span>{{ row.id }}</span>
                </template>
            </el-table-column>
            <el-table-column label="案件性质" width="150" align="center">
                <template slot-scope="{row}">
                    <span>{{ row.taskNo }}</span>
                </template>
            </el-table-column>
            <el-table-column label="发案日期" width="150" align="center">
                <template slot-scope="{row}">
                    <span>{{ row.receiptTime | parseTime('{y}-{m}-{d} {h}:{i}:{s}') }}</span>
                </template>
            </el-table-column>
            <el-table-column label="选择处所" width="150" align="center">
                <template slot-scope="{row}">
                    <span>{{ row.reporter }}</span>
                </template>
            </el-table-column>
            <el-table-column label="作案区划" width="110" align="center">
                <template slot-scope="{row}">
                    <span>{{ row.reportOrg }}</span>
                </template>
            </el-table-column>
            <el-table-column label="侵入方式" width="210" align="center">
                <template slot-scope="{row}">
                    <span>{{ row.contactPhoneNumber }}</span>
                </template>
            </el-table-column>
            <el-table-column label="作案出口" width="110" align="center">
                <template slot-scope="{row}">
                    <span>{{ row.caseCategory }}</span>
                </template>
            </el-table-column>
            <el-table-column label="作案人数" width="110" align="center">
                <template slot-scope="{row}">
                    <span>{{ row.techName }}</span>
                </template>
            </el-table-column>
            <el-table-column label="作案工具" width="210" align="center">
                <template slot-scope="{row}">
                    <span>{{ row.techName }}</span>
                </template>
            </el-table-column>
            <el-table-column label="主办" width="110" align="center">
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
