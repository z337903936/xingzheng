<template>
    <div>
        <el-divider content-position="center">待办任务</el-divider>

        <el-table
                v-loading="listLoading"
                :key="tableKey"
                :data="list"
                border
                fit
                highlight-current-row
                style="width: 100%;"
        >
            <el-table-column label="任务单号" prop="id" align="center" width="350">
                <template slot-scope="{row}">
                    <span>{{ row.id }}</span>
                </template>
            </el-table-column>
            <el-table-column label="系统编号" align="center" width="350">
                <template slot-scope="{row}">
                    <span>{{ row.taskNo }}</span>
                </template>
            </el-table-column>
            <el-table-column label="勘查号" width="350" align="center">
                <template slot-scope="{row}">
                    <span>{{ row.receiptTime | parseTime('{y}-{m}-{d} {h}:{i}:{s}') }}</span>
                </template>
            </el-table-column>
            <el-table-column label="物证类别" align="center" >
                <template slot-scope="{row}">
                    <span>{{ row.reporter }}</span>
                </template>
            </el-table-column>
            <el-table-column label="日期"  width="180" align="center">
                <template slot-scope="{row}">
                    <span>{{ row.reportOrg }}</span>
                </template>
            </el-table-column>
            <el-table-column label="移交人" width="110" align="center">
                <template slot-scope="{row}">
                    <span>{{ row.contactPhoneNumber }}</span>
                </template>
            </el-table-column>
             <el-table-column label="任务状态" width="110" align="center">
                <template slot-scope="{row}">
                    <span>{{ row.contactPhoneNumber }}</span>
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

        <el-row :gutter="20" style="margin-top: 25px">
            <el-col :span="16">
                <el-table
                        v-loading="listLoading"
                        :key="tableKey"
                        :data="list"
                        border
                        fit
                        highlight-current-row
                        style="width: 100%;"
                >
                    <el-table-column label="物证室名" prop="id" align="center" >
                        <template slot-scope="{row}">
                            <span>{{ row.id }}</span>
                        </template>
                    </el-table-column>
                    <el-table-column label="物证数量" align="center" width="200">
                        <template slot-scope="{row}">
                            <span>{{ row.taskNo }}</span>
                        </template>
                    </el-table-column>
                    <el-table-column label="借出数量" width="150" align="center">
                        <template slot-scope="{row}">
                            <span>{{ row.receiptTime | parseTime('{y}-{m}-{d} {h}:{i}:{s}') }}</span>
                        </template>
                    </el-table-column>
                    <el-table-column label="逾期数量" align="center" width="100">
                        <template slot-scope="{row}">
                            <span>{{ row.reporter }}</span>
                        </template>
                    </el-table-column>
                    <el-table-column label="状态"  width="180" align="center">
                        <template slot-scope="{row}">
                            <span>{{ row.reportOrg }}</span>
                        </template>
                    </el-table-column>

                </el-table>

            </el-col>
            <el-col :span="8">
                <el-card class="box-card">
                    <div slot="header" class="clearfix">
                        <span>物证库环境监测</span>
                    </div>
                    <div v-for="o in 4" :key="o" class="text item">
                        {{'列表内容 ' + o }}
                    </div>
                </el-card>
            </el-col>
        </el-row>
    </div>
</template>

<script>
    import {fetchList, fetchAlarm, createAlarm, updateAlarm} from '@/api/alarm'
    import waves from '@/directive/waves' // waves directive
    import {parseTime} from '@/utils'
    import { fetchAdminMemberList} from '@/api/permissions'



    export default {
        name: 'MaterialHome',
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
                    leaderName: undefined,
                    receiptName: undefined,
                    reporterOrg: undefined,
                    reporterName: undefined,
                    caseCategoryId: undefined
                },
                rules:{},
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
            //         },1000)
            //     })
            // },
            // handleFilter () {
            //     if (this.searchTime[0].toString().length>10)
            //         this.listQuery.beginTime = this.searchTime[0]/1000;
            //     if (this.searchTime[1].toString().length>10)
            //         this.listQuery.endTime = this.searchTime[1]/1000;
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

<style scoped>

</style>