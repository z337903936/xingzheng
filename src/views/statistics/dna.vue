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
            <el-table-column label="名称" width="90" align="center" prop="userName">
                <template slot-scope="{row}">
                    <span>{{ row.userName }}</span>
                </template>
            </el-table-column>
            <el-table-column label="统计时间" width="160" align="center" prop="createTime">
                <template slot-scope="{row}">
                    <span>{{ row.createTime | parseTime('{y}-{m}-{d}') }}</span>
                </template>
            </el-table-column>
            <el-table-column label="受理案件起数" align="center" width="100" prop="handleCount">
                <template slot-scope="{row}">
                    <span>{{ row.handleCount }}</span>
                </template>
            </el-table-column>
            <el-table-column label="比中数" align="center" width="100" prop="compareHitCount">
                <template slot-scope="{row}">
                    <span>{{ row.compareHitCount }}</span>
                </template>
            </el-table-column>
            <el-table-column label="微量检材份数" align="center" width="100" prop="minorMaterialCount">
                <template slot-scope="{row}">
                    <span>{{ row.minorMaterialCount }}</span>
                </template>
            </el-table-column>
            <el-table-column label="单一分型" align="center" width="100" prop="simpleMaterialCount">
                <template slot-scope="{row}">
                    <span>{{ row.simpleMaterialCount }}</span>
                </template>
            </el-table-column>
            <el-table-column label="混合可拆分" align="center" width="100" prop="mixMaterialCount">
                <template slot-scope="{row}">
                    <span>{{ row.mixMaterialCount }}</span>
                </template>
            </el-table-column>
            <el-table-column label="微量检出数" align="center" width="100" prop="minorHitCount">
                <template slot-scope="{row}">
                    <span>{{ row.minorHitCount }}</span>
                </template>
            </el-table-column>
            <el-table-column label="常规检材数" align="center" width="100" prop="normalMaterialCount">
                <template slot-scope="{row}">
                    <span>{{ row.normalMaterialCount }}</span>
                </template>
            </el-table-column>
            <el-table-column label="常规检出数" align="center" width="100" prop="normalMaterialHitCount">
                <template slot-scope="{row}">
                    <span>{{ row.normalMaterialHitCount }}</span>
                </template>
            </el-table-column>
            <el-table-column label="备注" align="center" width="100" prop="note">
                <template slot-scope="{row}">
                    <span>{{ row.note }}</span>
                </template>
            </el-table-column>



        </el-table>


    </div>
</template>

<script>

    import {dnaStatistics} from '@/api/statistics'
    import waves from '@/directive/waves' // waves directive
    import {parseTime} from '@/utils'

    export default {
        name: "dnaStatistics",
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
                this.$router.push({ name:'dnaStatisticsDetail',query: { detail:JSON.stringify(row.detailList)}})
            },

            handleSelectionChange(val) {
                this.multipleSelection = val
            },
            getList() {
                this.listLoading = true
                dnaStatistics(this.listQuery).then(response => {
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
                    const tHeader = ['名称','统计时间','受理案件起数',
                        '比中数','微量检材份数','单一分型','混合可拆分','微量检出数','常规检材数','常规检出数','备注',]
                    const filterVal = ['userName', 'createTime', 'handleCount', 'compareHitCount',
                        'minorMaterialCount','simpleMaterialCount','mixMaterialCount','minorHitCount','normalMaterialCount','normalMaterialHitCount','note',]
                    const list = this.multipleSelection
                    const data = this.formatJson(filterVal, list)
                    let title = ''
                    if (this.searchTime){
                        let title = parseTime(this.searchTime[0],"{y}-{m}-{d}")+'-'+parseTime(this.searchTime[1],"{y}-{m}-{d}");
                    }

                    excel.export_json_to_excel({
                        header: tHeader,
                        data,
                        filename: 'DNA检验人员工作质量统计'+title
                    })
                    this.downloadSelectLoading = false
                })
            },
            handleDownload() {
                this.downloadLoading = true
                import('@/vendor/Export2Excel').then(excel => {
                    const tHeader = ['名称','统计时间','受理案件起数',
                        '比中数','微量检材份数','单一分型','混合可拆分','微量检出数','常规检材数','常规检出数','备注',]
                    const filterVal = ['userName', 'createTime', 'handleCount', 'compareHitCount',
                        'minorMaterialCount','simpleMaterialCount','mixMaterialCount','minorHitCount','normalMaterialCount','normalMaterialHitCount','note',]
                    const data = this.formatJson(filterVal, this.list)
                    let title = ''
                    if (this.searchTime){
                         title = parseTime(this.searchTime[0],"{y}-{m}-{d}")+'-'+parseTime(this.searchTime[1],"{y}-{m}-{d}");
                    }

                    excel.export_json_to_excel({
                        header: tHeader,
                        data,
                        filename: 'DNA检验人员工作质量统计'+title
                    })
                    this.$refs.multipleTable.clearSelection()
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
