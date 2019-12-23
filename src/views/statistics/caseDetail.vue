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
            <el-table-column type="selection" align="center" width="70" />
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
            <el-table-column label="当日勘查数" align="center" width="100" prop="dayEvidences">
                <template slot-scope="{row}">
                    <span>{{ row.dayEvidences }}</span>
                </template>
            </el-table-column>
            <el-table-column label="现勘数" align="center" width="100" prop="evidences">
                <template slot-scope="{row}">
                    <span>{{ row.evidences }}</span>
                </template>
            </el-table-column>
            <el-table-column label="盗抢骗案件" align="center" width="100" prop="stealRobCount">
                <template slot-scope="{row}">
                    <span>{{ row.stealRobCount }}</span>
                </template>
            </el-table-column>

            <el-table-column label="十类" align="center">
                <el-table-column label="入室盗窃" align="center" width="100" prop="invadeStealCount">
                    <template slot-scope="{row}">
                        <span>{{ row.invadeStealCount }}</span>
                    </template>
                </el-table-column>
                <el-table-column label="盗窃车内财物" width="120" align="center" prop="stealFromCarCount">
                    <template slot-scope="{row}">
                        <span>{{ row.stealFromCarCount }}</span>
                    </template>
                </el-table-column>

                <el-table-column label="绑架" width="100" align="center" prop="kidnapCount">
                    <template slot-scope="{row}">
                        <span>{{ row.kidnapCount }}</span>
                    </template>
                </el-table-column>
                <el-table-column label="强奸" width="100" align="center" prop="rapeCount">
                    <template slot-scope="{row}">
                        <span>{{ row.rapeCount }}</span>
                    </template>
                </el-table-column>

                <el-table-column label="故意杀人" width="100" align="center" prop="murderCount">
                    <template slot-scope="{row}">
                        <span>{{ row.murderCount }}</span>
                    </template>
                </el-table-column>
                <el-table-column label="伤害致死" width="100" align="center" prop="hurtToDeathCount">
                    <template slot-scope="{row}">
                        <span>{{ row.hurtToDeathCount }}</span>
                    </template>
                </el-table-column>
                <el-table-column label="破坏" width="100" align="center" prop="damageCount">
                    <template slot-scope="{row}">
                        <span>{{ row.damageCount }}</span>
                    </template>
                </el-table-column>
                <el-table-column label="放火" width="100" align="center" prop="arsonCount">
                    <template slot-scope="{row}">
                        <span>{{ row.arsonCount }}</span>
                    </template>
                </el-table-column>
                <el-table-column label="爆炸" width="100" align="center" prop="explodeCount">
                    <template slot-scope="{row}">
                        <span>{{ row.explodeCount }}</span>
                    </template>
                </el-table-column>
                <el-table-column label="投毒" width="100" align="center" prop="poisonCount">
                    <template slot-scope="{row}">
                        <span>{{ row.poisonCount }}</span>
                    </template>
                </el-table-column>
                <el-table-column label="入室抢劫" width="100" align="center" prop="robAtRoomCount">
                    <template slot-scope="{row}">
                        <span>{{ row.robAtRoomCount }}</span>
                    </template>
                </el-table-column>
            </el-table-column>

            <el-table-column label="非十类" align="center">
                <el-table-column label="盗窃" width="100" align="center" prop="stealCount">
                    <template slot-scope="{row}">
                        <span>{{ row.stealCount }}</span>
                    </template>
                </el-table-column>
                <el-table-column label="死亡" width="100" align="center" prop="deathCount">
                    <template slot-scope="{row}">
                        <span>{{ row.deathCount }}</span>
                    </template>
                </el-table-column>
                <el-table-column label="故意伤害" width="100" align="center" prop="intentHurtCount">
                    <template slot-scope="{row}">
                        <span>{{ row.intentHurtCount }}</span>
                    </template>
                </el-table-column>
                <el-table-column label="抢劫" width="100" align="center" prop="robCount">
                    <template slot-scope="{row}">
                        <span>{{ row.robCount }}</span>
                    </template>
                </el-table-column>
                <el-table-column label="打架斗殴" width="100" align="center" prop="fightCount">
                    <template slot-scope="{row}">
                        <span>{{ row.fightCount }}</span>
                    </template>
                </el-table-column>
                <el-table-column label="容留他人吸毒" width="120" align="center" prop="allowTakeDragCount">
                    <template slot-scope="{row}">
                        <span>{{ row.allowTakeDragCount }}</span>
                    </template>
                </el-table-column>
                <el-table-column label="寻衅滋事" width="100" align="center" prop="quarrelCount">
                    <template slot-scope="{row}">
                        <span>{{ row.quarrelCount }}</span>
                    </template>
                </el-table-column>
                <el-table-column label="诈骗" width="100" align="center" prop="defraudCount">
                    <template slot-scope="{row}">
                        <span>{{ row.defraudCount }}</span>
                    </template>
                </el-table-column>
                <el-table-column label="敲诈勒索" width="100" align="center" prop="blackmailCount">
                    <template slot-scope="{row}">
                        <span>{{ row.blackmailCount }}</span>
                    </template>
                </el-table-column>
                <el-table-column label="贩卖毒品" width="100" align="center" prop="sellDrugCount">
                    <template slot-scope="{row}">
                        <span>{{ row.sellDrugCount }}</span>
                    </template>
                </el-table-column>
                <el-table-column label="危害公共安全" width="120" align="center" prop="endangerCount">
                    <template slot-scope="{row}">
                        <span>{{ row.endangerCount }}</span>
                    </template>
                </el-table-column>
                <el-table-column label="非法拘禁" width="100" align="center" prop="falseImprisonmentCount">
                    <template slot-scope="{row}">
                        <span>{{ row.falseImprisonmentCount }}</span>
                    </template>
                </el-table-column>
                <el-table-column label="制造毒品" width="100" align="center" prop="makeDrugCount">
                    <template slot-scope="{row}">
                        <span>{{ row.makeDrugCount }}</span>
                    </template>
                </el-table-column>
                <el-table-column label="非法存储枪支" width="120" align="center" prop="illegalStoreGunCount">
                    <template slot-scope="{row}">
                        <span>{{ row.illegalStoreGunCount }}</span>
                    </template>
                </el-table-column>
                <el-table-column label="其它" width="100" align="center" prop="otherCount">
                    <template slot-scope="{row}">
                        <span>{{ row.otherCount }}</span>
                    </template>
                </el-table-column>
                <el-table-column label="故意毁坏财物" width="120" align="center" prop="intenseRuinMaterialCount">
                    <template slot-scope="{row}">
                        <span>{{ row.intenseRuinMaterialCount }}</span>
                    </template>
                </el-table-column>
                <el-table-column label="其他妨害社会" width="120" align="center" prop="otherHarmfulCount">
                    <template slot-scope="{row}">
                        <span>{{ row.otherHarmfulCount }}</span>
                    </template>
                </el-table-column>
                <el-table-column label="吸毒" width="100" align="center" prop="takeDrugCount">
                    <template slot-scope="{row}">
                        <span>{{ row.takeDrugCount }}</span>
                    </template>
                </el-table-column>
                <el-table-column label="猥亵" width="100" align="center" prop="obsceneCount">
                    <template slot-scope="{row}">
                        <span>{{ row.obsceneCount }}</span>
                    </template>
                </el-table-column>
                <el-table-column label="其他侵财" width="100" align="center" prop="otherInvadeMoneyCount">
                    <template slot-scope="{row}">
                        <span>{{ row.otherInvadeMoneyCount }}</span>
                    </template>
                </el-table-column>
                <el-table-column label="抢夺" width="100" align="center" prop="snatchCount">
                    <template slot-scope="{row}">
                        <span>{{ row.snatchCount }}</span>
                    </template>
                </el-table-column>
            </el-table-column>

        </el-table>


    </div>
</template>

<script>

    import {caseStatistics} from '@/api/statistics'
    import waves from '@/directive/waves' // waves directive
    import {parseTime} from '@/utils'

    export default {
        name: "caseStatisticsDetail",
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
                },
            }
        },
        created(){
            this.list =  JSON.parse(this.$route.query.detail);
        },
        methods:{
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
                    const multiHeader = [['名称','统计时间','当日勘查数', '现勘数','盗抢骗案件','十类', '','','','','','','','','','', '非十类', '','','','','','','','','','', '','','','','','','','','','']]
                    const tHeader = ['','','','','',
                        '入室盗窃','盗窃车内财物','绑架',
                        '强奸','故意杀人','伤害致死','破坏','放火',
                        '爆炸','投毒','入室抢劫','盗窃','死亡',
                        '故意伤害','抢劫','打架斗殴','容留他人吸毒','寻衅滋事',
                        '诈骗','敲诈勒索','贩卖毒品','危害公共安全','非法拘禁',
                        '制造毒品','非法存储枪支','其它','故意毁坏财物','其他妨害社会','吸毒','猥亵','其他侵财','抢夺']
                    const filterVal = [
                        'userName', 'createTime', 'dayEvidences',
                        'evidences', 'stealRobCount','invadeStealCount', 'stealFromCarCount', 'kidnapCount', 'rapeCount', 'murderCount',
                        'hurtToDeathCount', 'damageCount', 'arsonCount', 'explodeCount', 'poisonCount','robAtRoomCount',
                        'stealCount', 'deathCount', 'intentHurtCount', 'robCount','fightCount', 'allowTakeDragCount', 'quarrelCount',
                        'defraudCount', 'blackmailCount','sellDrugCount', 'endangerCount', 'falseImprisonmentCount', 'makeDrugCount',
                        'illegalStoreGunCount','otherCount', 'intenseRuinMaterialCount', 'otherHarmfulCount',
                        'takeDrugCount', 'obsceneCount','otherInvadeMoneyCount', 'snatchCount']
                    const merges = ['A1:A2', 'B1:B2','C1:C2','D1:D2','E1:E2', 'F1:P1', 'Q1:AK1']
                    const list = this.multipleSelection
                    const data = this.formatJson(filterVal, list)
                    let title = ''


                    excel.export_json_to_excel({
                        multiHeader:multiHeader,
                        header:tHeader,
                        data:data,
                        filename: '案别统计'+title,
                        merges:merges,
                    })
                    this.$refs.multipleTable.clearSelection()
                    this.downloadSelectLoading = false
                })
            },
            handleDownload() {
                this.downloadLoading = true
                import('@/vendor/Export2Excel').then(excel => {
                    const multiHeader = [['名称','统计时间','当日勘查数', '现勘数','盗抢骗案件','十类', '','','','','','','','','','', '非十类', '','','','','','','','','','', '','','','','','','','','','']]
                    const tHeader = ['','','','','',
                        '入室盗窃','盗窃车内财物','绑架',
                        '强奸','故意杀人','伤害致死','破坏','放火',
                        '爆炸','投毒','入室抢劫','盗窃','死亡',
                        '故意伤害','抢劫','打架斗殴','容留他人吸毒','寻衅滋事',
                        '诈骗','敲诈勒索','贩卖毒品','危害公共安全','非法拘禁',
                        '制造毒品','非法存储枪支','其它','故意毁坏财物','其他妨害社会','吸毒','猥亵','其他侵财','抢夺']
                    const filterVal = [
                        'userName', 'createTime', 'dayEvidences',
                        'evidences', 'stealRobCount','invadeStealCount', 'stealFromCarCount', 'kidnapCount', 'rapeCount', 'murderCount',
                        'hurtToDeathCount', 'damageCount', 'arsonCount', 'explodeCount', 'poisonCount','robAtRoomCount',
                        'stealCount', 'deathCount', 'intentHurtCount', 'robCount','fightCount', 'allowTakeDragCount', 'quarrelCount',
                        'defraudCount', 'blackmailCount','sellDrugCount', 'endangerCount', 'falseImprisonmentCount', 'makeDrugCount',
                        'illegalStoreGunCount','otherCount', 'intenseRuinMaterialCount', 'otherHarmfulCount',
                        'takeDrugCount', 'obsceneCount','otherInvadeMoneyCount', 'snatchCount']
                    const merges = ['A1:A2', 'B1:B2','C1:C2','D1:D2','E1:E2', 'F1:P1', 'Q1:AK1']
                    const data = this.formatJson(filterVal, this.list)
                    let title = ''

                    excel.export_json_to_excel({
                        multiHeader:multiHeader,
                        header:tHeader,
                        data:data,
                        filename: '案别统计'+title,
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
