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

                style="width: 100%;"

                @selection-change="handleSelectionChange"
        >
            <el-table-column type="selection" align="center"   />
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

            <el-table-column label="指纹" align="center" >
                <el-table-column label="起" align="center"  prop="joinCount">
                    <template slot-scope="{row}">
                        <span>{{ row.fpCount }}</span>
                    </template>
                </el-table-column>
                <el-table-column label="份" align="center"  prop="burnToDeathCount">
                    <template slot-scope="{row}">
                        <span>{{ row.fpAmount }}</span>
                    </template>
                </el-table-column>
                <el-table-column label="提取率" align="center"  prop="burnToDeathCount">
                    <template slot-scope="{row}">
                        <span>{{ row.fpRate }}</span>
                    </template>
                </el-table-column>

            </el-table-column>
            <el-table-column label="掌纹" align="center" >
                <el-table-column label="起"  align="center" prop="injuryTotalCount">
                    <template slot-scope="{row}">
                        <span>{{ row.palmCount }}</span>
                    </template>
                </el-table-column>
                <el-table-column label="份"  align="center" prop="littleInjuryCount">
                    <template slot-scope="{row}">
                        <span>{{ row.palmAmount }}</span>
                    </template>
                </el-table-column>
                <el-table-column label="提取率" align="center"  prop="burnToDeathCount">
                    <template slot-scope="{row}">
                        <span>{{ row.palmRate }}</span>
                    </template>
                </el-table-column>

            </el-table-column>

            <el-table-column label="鞋印" align="center" >
                <el-table-column label="起"  align="center" prop="injuryTotalCount">
                    <template slot-scope="{row}">
                        <span>{{ row.footPrintCount }}</span>
                    </template>
                </el-table-column>
                <el-table-column label="份"  align="center" prop="littleInjuryCount">
                    <template slot-scope="{row}">
                        <span>{{ row.footPrintAmount }}</span>
                    </template>
                </el-table-column>
                <el-table-column label="提取率" align="center"  prop="burnToDeathCount">
                    <template slot-scope="{row}">
                        <span>{{ row.footPrintRate }}</span>
                    </template>
                </el-table-column>

            </el-table-column>

            <el-table-column label="DNA" align="center" >
                <el-table-column label="起"  align="center" prop="injuryTotalCount">
                    <template slot-scope="{row}">
                        <span>{{ row.dnaCount }}</span>
                    </template>
                </el-table-column>
                <el-table-column label="份"  align="center" prop="littleInjuryCount">
                    <template slot-scope="{row}">
                        <span>{{ row.dnaAmount }}</span>
                    </template>
                </el-table-column>
                <el-table-column label="提取率" align="center"  prop="burnToDeathCount">
                    <template slot-scope="{row}">
                        <span>{{ row.dnaRate }}</span>
                    </template>
                </el-table-column>

            </el-table-column>





        </el-table>


    </div>
</template>

<script>

    import {materialStatistics} from '@/api/statistics'
    import waves from '@/directive/waves' // waves directive
    import {parseTime} from '@/utils'

    export default {
        name: "materialStatistics",
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
            getPercent(num, total) {

                num = parseFloat(num);
                total = parseFloat(total);
                if (isNaN(num) || isNaN(total)) {
                    return "-";
                }
                return total <= 0 ? "0%" : (Math.round(num / total * 10000) / 100.00) + "%";
            },
            handleCurrentChange(row){
                this.$router.push({ name:'materialDetail',query: { detail:JSON.stringify(row.detailList)}})
            },

            handleSelectionChange(val) {
                this.multipleSelection = val
            },
            getList() {
                this.listLoading = true
                materialStatistics(this.listQuery).then(response => {
                    this.list = response.list
                    // Just to simulate the time of the request
                    this.list.map(data=>{
                       data.fpRate = this.getPercent(data.fpCount,data.fpAmount)
                       data.palmRate = this.getPercent(data.palmCount,data.palmAmount)
                       data.footPrintRate = this.getPercent(data.footPrintCount,data.footPrintAmount)
                       data.dnaRate = this.getPercent(data.dnaCount,data.dnaAmount)
                        return data;
                    });
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
                    const multiHeader = [['名称','统计时间','指纹','','','掌纹','','','鞋印','', '','DNA','','']]
                    const tHeader = ['','','起',
                        '份','提取率','起', '份','提取率'
                        ,'起', '份','提取率','起', '份','提取率'
                    ]
                    const filterVal = ['userName', 'createTime', 'fpCount', 'fpAmount',
                        'fpRate','palmCount', 'palmAmount', 'palmRate', 'footPrintCount', 'footPrintAmount',
                        'footPrintRate', 'dnaCount', 'dnaAmount', 'dnaRate',]
                    const merges = ['A1:A2', 'B1:B2', 'C1:E1', 'F1:H1', 'I1:K1', 'L1:N1']
                    const list = this.multipleSelection
                    const data = this.formatJson(filterVal, list)
                    let title = ''
                    if (this.searchTime){
                        let title = parseTime(this.searchTime[0],"{y}-{m}-{d}")+'-'+parseTime(this.searchTime[1],"{y}-{m}-{d}");
                    }

                    excel.export_json_to_excel({
                        multiHeader:multiHeader,
                        header:tHeader,
                        data:data,
                        filename: '提取现场物证统计'+title,
                        merges:merges,
                    })
                    this.$refs.multipleTable.clearSelection()
                    this.downloadSelectLoading = false
                })
            },
            handleDownload() {
                this.downloadLoading = true
                import('@/vendor/Export2Excel').then(excel => {
                    const multiHeader = [['名称','统计时间','指纹','','','掌纹','','','鞋印','', '','DNA','','']]
                    const tHeader = ['','','起',
                        '份','提取率','起', '份','提取率'
                        ,'起', '份','提取率','起', '份','提取率'
                    ]
                    const filterVal = ['userName', 'createTime', 'fpCount', 'fpAmount',
                        'fpRate','palmCount', 'palmAmount', 'palmRate', 'footPrintCount', 'footPrintAmount',
                        'footPrintRate', 'dnaCount', 'dnaAmount', 'dnaRate',]
                    const merges = ['A1:A2', 'B1:B2', 'C1:E1', 'F1:H1', 'I1:K1', 'L1:N1']
                    const data = this.formatJson(filterVal, this.list)
                    let title = ''
                    if (this.searchTime){
                         title = parseTime(this.searchTime[0],"{y}-{m}-{d}")+'-'+parseTime(this.searchTime[1],"{y}-{m}-{d}");
                    }

                    excel.export_json_to_excel({
                        multiHeader:multiHeader,
                        header:tHeader,
                        data:data,
                        filename: '提取现场物证统计'+title,
                        merges:merges,
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
