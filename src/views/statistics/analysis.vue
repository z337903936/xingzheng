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
            <el-table-column type="selection" align="center"   />
            <el-table-column label="检验人" width="90" align="center">
                <template slot-scope="{row}">
                    <span>{{ row.userName }}</span>
                </template>
            </el-table-column>
            <el-table-column label="简要案情" width="90" align="center" >
                <template slot-scope="{row}">
                    <span>{{ row.caseDigest }}</span>
                </template>
            </el-table-column>
            <el-table-column label="送检人" width="90" align="center" >
                <template slot-scope="{row}">
                    <span>{{ row.requireName }}</span>
                </template>
            </el-table-column>
            <el-table-column label="送检时间" width="160" align="center" >
                <template slot-scope="{row}">
                    <span>{{ row.requireTime | parseTime('{y}-{m}-{d}') }}</span>
                </template>
            </el-table-column>
            <el-table-column label="检材名称" width="90" align="center" >
                <template slot-scope="{row}">
                    <span>{{ row.examMaterialName }}</span>
                </template>
            </el-table-column>

          <el-table-column label="微量检材" align="center" >
                <el-table-column label="检材类型" align="center" >
                    <el-table-column label="工具类" align="center"  >
                        <template slot-scope="{row}">
                            <span>{{ row.toolsCount }}</span>
                        </template>
                    </el-table-column>
                    <el-table-column label="指掌脚印" align="center"  >
                        <template slot-scope="{row}">
                            <span>{{ row.palmFootCount }}</span>
                        </template>
                    </el-table-column>
                    <el-table-column label="衣物鞋帽手套" align="center"  >
                        <template slot-scope="{row}">
                            <span>{{ row.clothCount }}</span>
                        </template>
                    </el-table-column>
                    <el-table-column label="擦拭物" align="center"  >
                        <template slot-scope="{row}">
                            <span>{{ row.minorWipeCount }}</span>
                        </template>
                    </el-table-column>
                    <el-table-column label="合计" align="center"  >
                        <template slot-scope="{row}">
                            <span>{{ row.totalJ }}</span>
                        </template>
                    </el-table-column>
                </el-table-column>

                <el-table-column label="检验结果" align="center" >

                    <el-table-column label="有效检出" align="center"  >


                        <el-table-column label="单一分型" align="center" >
                            <template slot-scope="{row}">
                                <span>{{ row.singleCount }}</span>
                            </template>
                        </el-table-column>
                        <el-table-column label="可拆分" align="center"  >
                            <template slot-scope="{row}">
                                <span>{{ row.separableCount }}</span>
                            </template>
                        </el-table-column>
                        <el-table-column label="不可拆分" align="center"  >
                            <template slot-scope="{row}">
                                <span>{{ row.notSeparableCount }}</span>
                            </template>
                        </el-table-column>


                    </el-table-column>
                    <el-table-column label="无效检出" align="center"  >

                        <el-table-column label="不稳定分型" align="center" >
                            <template slot-scope="{row}">
                                <span>{{ row.notStableCount }}</span>
                            </template>
                        </el-table-column>
                        <el-table-column label="未检出分型" align="center" >
                            <template slot-scope="{row}">
                                <span>{{ row.notExamOutCount }}</span>
                            </template>
                        </el-table-column>



                    </el-table-column>

                </el-table-column>
            </el-table-column>

            <el-table-column label="常规检材" align="center" >
                <el-table-column label="检材类型" align="center" >
                    <el-table-column label="瓶口" align="center"  >
                        <template slot-scope="{row}">
                            <span>{{ row.capCount }}</span>
                        </template>
                    </el-table-column>
                    <el-table-column label="烟蒂" align="center"  >
                        <template slot-scope="{row}">
                            <span>{{ row.smokeCapCount }}</span>
                        </template>
                    </el-table-column>
                    <el-table-column label="血迹" align="center"  >
                        <template slot-scope="{row}">
                            <span>{{ row.bloodCount }}</span>
                        </template>
                    </el-table-column>
                    <el-table-column label="擦拭物" align="center"  >
                        <template slot-scope="{row}">
                            <span>{{ row.regularWipeCount }}</span>
                        </template>
                    </el-table-column>
                    <el-table-column label="合计" align="center"  >
                        <template slot-scope="{row}">
                            <span>{{ row.totalC }}</span>
                        </template>
                    </el-table-column>
                </el-table-column>

                <el-table-column label="检验结果" align="center" >
                        <el-table-column label="检出" align="center" >
                            <template slot-scope="{row}">
                                <span>{{ row.regularExamOutCount }}</span>
                            </template>
                        </el-table-column>
                        <el-table-column label="未检出" align="center"  >
                            <template slot-scope="{row}">
                                <span>{{ row.regularNotExamOutCount }}</span>
                            </template>
                        </el-table-column>

                </el-table-column>
            </el-table-column>

        </el-table>


    </div>
</template>

<script>

    import {analyStatistics} from '@/api/statistics'
    import waves from '@/directive/waves' // waves directive
    import {parseTime} from '@/utils'

    export default {
        name: "analysisStatistics",
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
                this.$router.push({ name:'analysisDetail',query: { detail:JSON.stringify(row.detailList)}})
            },

            handleSelectionChange(val) {
                this.multipleSelection = val
            },
            getList() {
                this.listLoading = true
                analyStatistics(this.listQuery).then(response => {
                    this.list = response.list
                    // Just to simulate the time of the request
                    this.list.map(data=>{
                        data.totalJ = data.toolsCount + data.palmFootCount + data.clothCount + data.minorWipeCount
                        data.totalC = data.capCount + data.smokeCapCount + data.bloodCount
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
                    const multiHeader = [
                        ['检验人','简要案情','送检人','送检时间','检材名称','微量检材','','','','','','','','','','常规检材','', '','','','',''],
                        ['','','','','','检材类型','','','','','检验结果','','','','','检材类型','', '','','','检验结果',''],
                        ['','','','','','工具类','指掌脚印','衣物鞋帽手套','擦拭物','合计','有效检出','','','无效检出','','瓶口','烟蒂','血迹', '合计','擦拭物','检出','未检出'],
                    ]
                    const tHeader = ['','','', '','', '','','','','','单一分型',
                        '可拆分','不可拆分','不稳定分型','未检出分型','','','','','','','',
                    ];
                    const filterVal = ['userName', 'caseDigest', 'requireName', 'requireTime',
                        'examMaterialName','toolsCount', 'palmFootCount', 'clothCount', 'minorWipeCount','totalJ', 'singleCount',
                        'separableCount', 'notSeparableCount', 'notStableCount', 'notExamOutCount','capCount',
                        'smokeCapCount','bloodCount','regularWipeCount','totalC','regularExamOutCount','regularNotExamOutCount']
                    const merges = ['A1:A4', 'B1:B4', 'C1:C4','D1:D4','E1:E4', 'F1:O1','P1:V1',
                        'F3:F4','G3:G4','H3:H4','I3:I4','J3:J4','P3:P4','Q3:Q4','R3:R4','S3:S4','T3:T4','U3:U4','V3:V4',
                        'F2:J2', 'K2:O2', 'P2:T2', 'U2:V2', 'K3:M3', 'N3:O3']
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
                        filename: '检验人员工作质量分析'+title,
                        merges:merges,
                    })
                    this.$refs.multipleTable.clearSelection()
                    this.downloadSelectLoading = false
                })
            },
            handleDownload() {
                this.downloadLoading = true
                import('@/vendor/Export2Excel').then(excel => {
                    const multiHeader = [
                        ['检验人','简要案情','送检人','送检时间','检材名称','微量检材','','','','','','','','','','常规检材','', '','','','',''],
                        ['','','','','','检材类型','','','','','检验结果','','','','','检材类型','', '','','','检验结果',''],
                        ['','','','','','工具类','指掌脚印','衣物鞋帽手套','擦拭物','合计','有效检出','','','无效检出','','瓶口','烟蒂','血迹', '合计','擦拭物','检出','未检出'],
                    ]
                    const tHeader = ['','','', '','', '','','','','','单一分型',
                        '可拆分','不可拆分','不稳定分型','未检出分型','','','','','','','',
                    ];
                    const filterVal = ['userName', 'caseDigest', 'requireName', 'requireTime',
                        'examMaterialName','toolsCount', 'palmFootCount', 'clothCount', 'minorWipeCount', 'singleCount',
                        'separableCount', 'notSeparableCount', 'notStableCount', 'notExamOutCount','capCount',
                        'smokeCapCount','bloodCount','regularWipeCount','regularExamOutCount','regularNotExamOutCount']
                    const merges = ['A1:A4', 'B1:B4', 'C1:C4','D1:D4','E1:E4', 'F1:O1','P1:V1',
                        'F3:F4','G3:G4','H3:H4','I3:I4','J3:J4','P3:P4','Q3:Q4','R3:R4','S3:S4','T3:T4','U3:U4','V3:V4',
                        'F2:J2', 'K2:O2', 'P2:T2', 'U2:V2', 'K3:M3', 'N3:O3']
                    const data = this.formatJson(filterVal, this.list)
                    let title = ''
                    if (this.searchTime){
                         title = parseTime(this.searchTime[0],"{y}-{m}-{d}")+'-'+parseTime(this.searchTime[1],"{y}-{m}-{d}");
                    }

                    excel.export_json_to_excel({
                        multiHeader:multiHeader,
                        header:tHeader,
                        data:data,
                        filename: '检验人员工作质量分析'+title,
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
