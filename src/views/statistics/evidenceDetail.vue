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
            <el-table-column label="送检案件起数" align="center"  prop="handleCount">
                <template slot-scope="{row}">
                    <span>{{ row.sendExamCount }}</span>
                </template>
            </el-table-column>
            <el-table-column label="比中数" align="center"  prop="compareHitCount">
                <template slot-scope="{row}">
                    <span>{{ row.compareHitCount }}</span>
                </template>
            </el-table-column>
            <el-table-column label="比中率" align="center" prop="compareHitCountRate">
                <template slot-scope="{row}">
                    <span>{{ row.compareHitCountRate }}</span>
                </template>
            </el-table-column>
            <el-table-column label="微量检材份数" align="center"  prop="minorMaterialCount">
                <template slot-scope="{row}">
                    <span>{{ row.minorMaterialCount }}</span>
                </template>
            </el-table-column>
            <el-table-column label="单一分型" align="center"  prop="simpleMaterialCount">
                <template slot-scope="{row}">
                    <span>{{ row.simpleMaterialCount }}</span>
                </template>
            </el-table-column>
            <el-table-column label="混合可拆分" align="center"  prop="mixMaterialCount">
                <template slot-scope="{row}">
                    <span>{{ row.mixMaterialCount }}</span>
                </template>
            </el-table-column>
            <el-table-column label="微量检出数" align="center"  prop="minorHitCount">
                <template slot-scope="{row}">
                    <span>{{ row.minorHitCount }}</span>
                </template>
            </el-table-column>
            <el-table-column label="有效检出率" align="center" prop="effectiveRate">
                <template slot-scope="{row}">
                    <span>{{ row.effectiveRate }}</span>
                </template>
            </el-table-column>
            <el-table-column label="常规检材数" align="center" prop="normalMaterialCount">
                <template slot-scope="{row}">
                    <span>{{ row.normalMaterialCount }}</span>
                </template>
            </el-table-column>
            <el-table-column label="常规检出数" align="center"  prop="normalMaterialHitCount">
                <template slot-scope="{row}">
                    <span>{{ row.normalMaterialHitCount }}</span>
                </template>
            </el-table-column>
            <el-table-column label="常规检出率" align="center" prop="normalMaterialHitCountRate">
                <template slot-scope="{row}">
                    <span>{{ row.normalMaterialHitCountRate }}</span>
                </template>
            </el-table-column>
            <el-table-column label="备注" align="center" prop="note">
                <template slot-scope="{row}">
                    <span>{{ row.note }}</span>
                </template>
            </el-table-column>




        </el-table>


    </div>
</template>

<script>

    import {evidenceStatistics} from '@/api/statistics'
    import waves from '@/directive/waves' // waves directive
    import {parseTime} from '@/utils'

    export default {
        name: "evidenceDetail",
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
            this.list.map(data => {
                data.compareHitCountRate = this.getPercent(data.compareHitCount,data.sendExamCount);
                data.effectiveRate = this.getPercent(data.mixMaterialCount + data.simpleMaterialCount,data.minorMaterialCount);
                data.normalMaterialHitCountRate = this.getPercent(data.normalMaterialHitCount,data.normalMaterialCount);
                return data;
            });
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
                this.$router.push({ name:'evidenceStatisticsDetail',query: { detail:JSON.stringify(row.detailList)}})
            },

            handleSelectionChange(val) {
                this.multipleSelection = val
            },
            getList() {
                this.listLoading = true
                evidenceStatistics(this.listQuery).then(response => {
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
                    const tHeader = ['名称', '统计时间', '送检案件起数',
                        '比中数', '比中率', '微量检材份数', '单一分型', '混合可拆分', '微量检出数', '有效检出率', '常规检材数', '常规检出数', '常规检出率', '备注',]
                    const filterVal = ['userName', 'createTime', 'sendExamCount', 'compareHitCount', 'compareHitCountRate',
                        'minorMaterialCount', 'simpleMaterialCount', 'mixMaterialCount', 'minorHitCount', 'effectiveRate', 'normalMaterialCount', 'normalMaterialHitCount', 'normalMaterialHitCountRate', 'note',]
                    const list = this.multipleSelection
                    const data = this.formatJson(filterVal, list)
                    let title = ''
                    if (this.searchTime){
                        let title = parseTime(this.searchTime[0],"{y}-{m}-{d}")+'-'+parseTime(this.searchTime[1],"{y}-{m}-{d}");
                    }

                    excel.export_json_to_excel({
                        header: tHeader,
                        data,
                        filename: '痕检人员工作质量统计'+title
                    })
                    this.downloadSelectLoading = false
                })
            },
            handleDownload() {
                this.downloadLoading = true
                import('@/vendor/Export2Excel').then(excel => {
                    const tHeader = ['名称', '统计时间', '送检案件起数',
                        '比中数', '比中率', '微量检材份数', '单一分型', '混合可拆分', '微量检出数', '有效检出率', '常规检材数', '常规检出数', '常规检出率', '备注',]
                    const filterVal = ['userName', 'createTime', 'sendExamCount', 'compareHitCount', 'compareHitCountRate',
                        'minorMaterialCount', 'simpleMaterialCount', 'mixMaterialCount', 'minorHitCount', 'effectiveRate', 'normalMaterialCount', 'normalMaterialHitCount', 'normalMaterialHitCountRate', 'note',]
                    const data = this.formatJson(filterVal, this.list)
                    let title = ''
                    if (this.searchTime){
                         title = parseTime(this.searchTime[0],"{y}-{m}-{d}")+'-'+parseTime(this.searchTime[1],"{y}-{m}-{d}");
                    }

                    excel.export_json_to_excel({
                        header: tHeader,
                        data,
                        filename: '痕检人员工作质量统计'+title
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
