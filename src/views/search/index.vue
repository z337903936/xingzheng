<template>
    <div  class="app-container">
        <div class="filter-container">
            <div><el-date-picker
                    v-model="searchTime"
                    type="datetimerange"
                    range-separator="至"
                    start-placeholder="开始时间"
                    end-placeholder="结束时间"
            />
                <el-input v-model="listQuery.caseNo" placeholder="案件编号" style="width: 200px;margin-left: 5px"
                          @keyup.enter.native="handleFilter"/>
                <el-input v-model="listQuery.caseId" placeholder="案件ID" style="width: 200px;"
                          @keyup.enter.native="handleFilter"/>
                <el-input v-model="listQuery.caseType" placeholder="案件类别" style="width: 200px;"
                          @keyup.enter.native="handleFilter"/>
                <el-input v-model="listQuery.chargerUid" placeholder="主办人" style="width: 200px;"
                          @keyup.enter.native="handleFilter"/>
                <el-button v-waves type="primary" icon="el-icon-search" @click="handleFilter">
                    搜索
                </el-button>
                <router-link :to="'/search/create-search/'">
                    <el-button type="primary" icon="el-icon-edit">添加</el-button>
                </router-link>
                <!--<el-button v-waves :loading="downloadLoading" type="primary" icon="el-icon-download" @click="handleDownload">-->
                <!--导出-->
                <!--</el-button>-->
            </div>
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
            <el-table-column label="案件ID" prop="id" align="center" width="80">
                <template slot-scope="{row}">
                    <span>{{ row.caseId }}</span>
                </template>
            </el-table-column>
            <el-table-column label="案件编号">
                <template slot-scope="{row}">
                    <span>{{ row.caseNo }}</span>
                </template>
            </el-table-column>
            <el-table-column label="勘查起始时间"  align="center">
                <template slot-scope="{row}">
                    <span>{{ row.examBeginTime | parseTime('{y}-{m}-{d} {h}:{i}') }}</span>
                </template>
            </el-table-column>
            <el-table-column label="创建时间" align="center">
                <template slot-scope="{row}">
                    <span>{{ row.createTime | parseTime('{y}-{m}-{d} {h}:{i}') }}</span>
                </template>
            </el-table-column>

            <el-table-column label="操作" align="center" width="530" class-name="small-padding fixed-width">
                <template slot-scope="{row}">
                    <router-link :to="'/search/update-search/'+row.id">
                        <el-button type="primary" size="mini" icon="el-icon-edit">编辑</el-button>
                    </router-link>
                    <!--<el-button type="primary" size="mini" @click="handleUpdate(row)">-->
                        <!--编辑-->
                    <!--</el-button>-->
                    <!--<el-button size="mini" type="success">-->
                        <!--查看-->
                    <!--</el-button>-->
                </template>
            </el-table-column>
        </el-table>

        <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="limit"
                    @pagination="getList"/>



    </div>
</template>

<script>
    import {fetchList} from '@/api/search'
    import waves from '@/directive/waves' // waves directive
    import Pagination from '@/components/Pagination' // secondary package based on el-pagination

    export default {
        name: "Search",
        components: {Pagination},
        directives: {waves},
        data() {
            return {
                tableKey: 0,
                list: null,
                total: 0,
                listLoading: true,
                searchTime: '',
                limit: 20,
                listQuery: {
                    page: 1,
                    caseNo: undefined,
                    caseId: undefined,
                    caseType: undefined,
                    chargerUid: undefined,
                    beginTime: undefined,
                    endTime: undefined,
                },
                calendarTypeOptions:{},

            }
        },
        created() {
            this.getList()
        },
        methods: {
            getList() {
                this.listLoading = true;
                fetchList(this.listQuery).then(response => {
                    this.list = response.list;

                    // Just to simulate the time of the request
                    setTimeout(() => {
                        this.listLoading = false
                    }, 1.5 * 1000)
                })
            },
            handleFilter () {
                this.listQuery.page = 1
                this.getList()
            },

        }
    }
</script>

<style scoped>

</style>