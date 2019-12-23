<template>
    <div class="app-container">
        <div class="filter-container" style="margin-bottom: 20px">
            <div>
                <el-date-picker
                        v-model="searchTime"
                        type="datetimerange"
                        range-separator="至"
                        start-placeholder="开始时间"
                        end-placeholder="结束时间"
                        value-format="timestamp"
                        style="width: 405px;"
                        clearable
                />
                <el-button v-waves type="primary" icon="el-icon-search" @click="handleFilter"
                           style="float: right;margin-right: 20px">
                    搜索
                </el-button>


                <el-button v-waves :loading="downloadLoading" type="primary" icon="el-icon-download" @click="handleDownload" style="float: right;margin-right: 20px">
                导出
                </el-button>
                <el-button v-waves :loading="downloadSelectLoading" type="primary" icon="el-icon-download" @click="handleSelect" style="float: right;margin-right: 20px">
                导出所选
                </el-button>
            </div>
        </div>

        <el-table
                v-loading="listLoading"
                :data="list"
                ref="multipleTable"
                border
                fit
                highlight-current-row
                @current-change="handleCurrentChange"
                style="width: 100%;"

                @selection-change="handleSelectionChange"
        >
            <el-table-column type="selection" align="center" width="70"  />
            <el-table-column label="名称"  align="center" prop="userName">
                <template slot-scope="{row}">
                    <span>{{ row.userName }}</span>
                </template>
            </el-table-column>
            <el-table-column label="统计时间"  align="center" prop="createTime">
                <template slot-scope="{row}">
                    <span>{{ row.createTime | parseTime('{y}-{m}-{d}') }}</span>
                </template>
            </el-table-column>
            <el-table-column label="出现场数" align="center" width="100" prop="joinCount">
                <template slot-scope="{row}">
                    <span>{{ row.joinCount }}</span>
                </template>
            </el-table-column>
            <el-table-column label="盗抢骗现场数" align="center"  prop="handleRobStealCount">
                <template slot-scope="{row}">
                    <span>{{ row.handleRobStealCount }}</span>
                </template>
            </el-table-column>
            <el-table-column label="指纹破案" align="center"  prop="fingerCrackCount">
                <template slot-scope="{row}">
                    <span>{{ row.fingerCrackCount }}</span>
                </template>
            </el-table-column>
            <el-table-column label="破案总数" align="center" prop="totalCrackCount">
                <template slot-scope="{row}">
                    <span>{{ row.totalCrackCount }}</span>
                </template>
            </el-table-column>



        </el-table>


    </div>
</template>

<script>

    import {crackStatistics} from '@/api/statistics'
    import waves from '@/directive/waves' // waves directive
    import {parseTime} from '@/utils'

    export default {
        name: "crackStatistics",
        directives: {waves},
        data(){
            return{
                list:null,
                listLoading:false,
                downloadLoading:false,
                downloadSelectLoading:false,
                multipleSelection: [],
                searchTime: '',
                listQuery:{
                    beginTime: undefined,
                    endTime: undefined,
                }
            }
        },
        created(){
          this.getList()
        },
        methods:{
            handleCurrentChange(row){
                this.$router.push({ name:'crackDetail',query: { detail:JSON.stringify(row.detailList)}})
            },

            handleSelectionChange(val) {
                this.multipleSelection = val
            },
            getList() {
                this.listLoading = true
                crackStatistics(this.listQuery).then(response => {
                    this.list = response.list
                    // Just to simulate the time of the request

                    this.listLoading = false

                })
            },
            handleFilter() {
                if (this.searchTime) {
                    if (this.searchTime[0].toString().length > 10) {
                        this.listQuery.beginTime = this.searchTime[0] / 1000
                    }
                    if (this.searchTime[1].toString().length > 10) {
                        this.listQuery.endTime = this.searchTime[1] / 1000
                    }
                }
                this.getList()
            },
            handleSelect(){
                this.downloadSelectLoading = true
                import('@/vendor/Export2Excel').then(excel => {
                    const tHeader = ['名称','统计时间','出现场数',
                        '盗抢骗现场数','指纹破案','破案总数',]
                    const filterVal = ['userName', 'createTime', 'joinCount', 'handleRobStealCount',
                        'fingerCrackCount','totalCrackCount',]
                    const list = this.multipleSelection
                    const data = this.formatJson(filterVal, list)
                    let title = ''
                    if (this.searchTime){
                        let title = parseTime(this.searchTime[0],"{y}-{m}-{d}")+'-'+parseTime(this.searchTime[1],"{y}-{m}-{d}");
                    }

                    excel.export_json_to_excel({
                        header: tHeader,
                        data,
                        filename: '破案情况统计'+title
                    })
                    this.$refs.multipleTable.clearSelection()
                    this.downloadSelectLoading = false
                })
            },
            handleDownload() {
                this.downloadLoading = true
                import('@/vendor/Export2Excel').then(excel => {
                    const tHeader = ['名称','统计时间','出现场数',
                        '盗抢骗现场数','指纹破案','破案总数',]
                    const filterVal = ['userName', 'createTime', 'joinCount', 'handleRobStealCount',
                        'fingerCrackCount','totalCrackCount',]
                    const data = this.formatJson(filterVal, this.list)
                    let title = ''
                    if (this.searchTime){
                         title = parseTime(this.searchTime[0],"{y}-{m}-{d}")+'-'+parseTime(this.searchTime[1],"{y}-{m}-{d}");
                    }

                    excel.export_json_to_excel({
                        header: tHeader,
                        data,
                        filename: '破案情况统计'+title
                    })

                    this.downloadLoading = false
                })
            },
            formatJson(filterVal, jsonData) {
                return jsonData.map(v => filterVal.map(j => {
                    if (j === 'createTime') {
                        return parseTime(v[j])
                    } else {
                        return v[j]
                    }
                }))
            },
        }

    }
</script>

<style scoped>

</style>
