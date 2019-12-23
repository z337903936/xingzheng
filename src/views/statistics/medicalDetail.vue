<template>
    <div class="app-container">
        <div class="filter-container" style="margin-bottom: 20px">
            <div>
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
            <el-table-column label="出现场数" align="center" width="100" prop="joinCount">
                <template slot-scope="{row}">
                    <span>{{ row.joinCount }}</span>
                </template>
            </el-table-column>
            <el-table-column label="烧死" align="center" width="100" prop="burnToDeathCount">
                <template slot-scope="{row}">
                    <span>{{ row.burnToDeathCount }}</span>
                </template>
            </el-table-column>
            <el-table-column label="绞死" align="center" width="100" prop="hangToDeathCount">
                <template slot-scope="{row}">
                    <span>{{ row.hangToDeathCount }}</span>
                </template>
            </el-table-column>
            <el-table-column label="中毒" align="center" width="100" prop="poisonToDeathCount">
                <template slot-scope="{row}">
                    <span>{{ row.poisonToDeathCount }}</span>
                </template>
            </el-table-column>
            <el-table-column label="高坠" width="120" align="center" prop="fallToDeathCount">
                <template slot-scope="{row}">
                    <span>{{ row.fallToDeathCount }}</span>
                </template>
            </el-table-column>
            <el-table-column label="溺死" width="100" align="center" prop="drownToDeathCount">
                <template slot-scope="{row}">
                    <span>{{ row.drownToDeathCount }}</span>
                </template>
            </el-table-column>
            <el-table-column label="其他" width="100" align="center" prop="otherDeathCount">
                <template slot-scope="{row}">
                    <span>{{ row.otherDeathCount }}</span>
                </template>
            </el-table-column>
            <el-table-column label="伤害致死" width="100" align="center" prop="hurtToDeathCount">
                <template slot-scope="{row}">
                    <span>{{ row.hurtToDeathCount }}</span>
                </template>
            </el-table-column>
            <el-table-column label="出具鉴定书数" width="100" align="center" prop="documentCount">
                <template slot-scope="{row}">
                    <span>{{ row.documentCount }}</span>
                </template>
            </el-table-column>
            <el-table-column label="伤情鉴定总数" width="100" align="center" prop="injuryTotalCount">
                <template slot-scope="{row}">
                    <span>{{ row.injuryTotalCount }}</span>
                </template>
            </el-table-column>
            <el-table-column label="轻伤" width="100" align="center" prop="littleInjuryCount">
                <template slot-scope="{row}">
                    <span>{{ row.littleInjuryCount }}</span>
                </template>
            </el-table-column>
            <el-table-column label="重伤" width="100" align="center" prop="seriousInjuryCount">
                <template slot-scope="{row}">
                    <span>{{ row.seriousInjuryCount }}</span>
                </template>
            </el-table-column>
            <el-table-column label="伤残等级" width="100" align="center" prop="injuryLevelCount">
                <template slot-scope="{row}">
                    <span>{{ row.injuryLevelCount }}</span>
                </template>
            </el-table-column>
            <el-table-column label="未构成轻微伤" width="100" align="center" prop="notCauseBitInjuryCount">
                <template slot-scope="{row}">
                    <span>{{ row.notCauseBitInjuryCount }}</span>
                </template>
            </el-table-column>
            <el-table-column label="中止鉴定" width="100" align="center" prop="stopInjuryCount">
                <template slot-scope="{row}">
                    <span>{{ row.stopInjuryCount }}</span>
                </template>
            </el-table-column>
            <el-table-column label="不宜鉴定" width="100" align="center" prop="notAvailAbleCount">
                <template slot-scope="{row}">
                    <span>{{ row.notAvailAbleCount }}</span>
                </template>
            </el-table-column>

        </el-table>


    </div>
</template>

<script>

    import {medicalStatistics} from '@/api/statistics'
    import waves from '@/directive/waves' // waves directive
    import {parseTime} from '@/utils'

    export default {
        name: "medicalDetail",
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
            this.list =  JSON.parse(this.$route.query.detail);
        },
        methods:{
            handleCurrentChange(row){
                this.$router.push({ name:'medicalStatisticsDetail',query: { detail:JSON.stringify(row.detailList)}})
            },

            handleSelectionChange(val) {
                this.multipleSelection = val
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
                        '烧死','绞死','中毒','高坠','溺死',
                        '其他','伤害致死','出具鉴定书数','伤情鉴定总数','轻伤',
                        '重伤','伤残等级','未构成轻微伤','中止鉴定','不宜鉴定',
                    ]
                    const filterVal = ['userName', 'createTime', 'joinCount', 'burnToDeathCount',
                        'hangToDeathCount','poisonToDeathCount', 'fallToDeathCount', 'drownToDeathCount', 'otherDeathCount', 'hurtToDeathCount',
                        'documentCount', 'injuryTotalCount', 'littleInjuryCount', 'seriousInjuryCount', 'injuryLevelCount','notCauseBitInjuryCount',
                        'stopInjuryCount', 'notAvailAbleCount']

                    const list = this.multipleSelection
                    const data = this.formatJson(filterVal, list)
                    let title = ''


                    excel.export_json_to_excel({
                        header: tHeader,
                        data,
                        filename: '法医工作情况统计'+title
                    })
                    this.downloadSelectLoading = false
                })
            },
            handleDownload() {
                this.downloadLoading = true
                import('@/vendor/Export2Excel').then(excel => {
                    const tHeader = ['名称','统计时间','出现场数',
                        '烧死','绞死','中毒','高坠','溺死',
                        '其他','伤害致死','出具鉴定书数','伤情鉴定总数','轻伤',
                        '重伤','伤残等级','未构成轻微伤','中止鉴定','不宜鉴定',
                      ]
                    const filterVal = ['userName', 'createTime', 'joinCount', 'burnToDeathCount',
                        'hangToDeathCount','poisonToDeathCount', 'fallToDeathCount', 'drownToDeathCount', 'otherDeathCount', 'hurtToDeathCount',
                        'documentCount', 'injuryTotalCount', 'littleInjuryCount', 'seriousInjuryCount', 'injuryLevelCount','notCauseBitInjuryCount',
                        'stopInjuryCount', 'notAvailAbleCount']
                    const data = this.formatJson(filterVal, this.list)
                    let title = ''


                    excel.export_json_to_excel({
                        header: tHeader,
                        data,
                        filename: '法医工作情况统计'+title
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
