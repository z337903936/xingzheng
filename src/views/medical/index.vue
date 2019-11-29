<template>
    <div class="app-container">
        <div class="filter-container">
            <div><el-date-picker
                    v-model="searchTime"
                    type="datetimerange"
                    range-separator="至"
                    start-placeholder="开始时间"
                    end-placeholder="结束时间"
                    value-format="timestamp"
            />

                <el-input v-model="listQuery.taskNo" placeholder="任务号" class="mb10" style="width: 200px;"
                          @keyup.enter.native="handleFilter"/>
                <el-input v-model="listQuery.delegateOrg" placeholder="委托单位" class="mb10" style="width: 200px;"
                          @keyup.enter.native="handleFilter"/>
                <el-input v-model="listQuery.delegateName" placeholder="委托人" class="mb10" style="width: 200px;"
                          @keyup.enter.native="handleFilter"/>
                <el-input v-model="listQuery.digest" placeholder="简要案情" class="mb10" style="width: 200px;"
                          @keyup.enter.native="handleFilter"/>
                <el-input v-model="listQuery.injure" placeholder="伤者情况" class="mb10" style="width: 200px;"
                          @keyup.enter.native="handleFilter"/>
                <el-input v-model="listQuery.delegateTarget" placeholder="委托目的" class="mb10" style="width: 200px;"
                          @keyup.enter.native="handleFilter"/>
                <el-input v-model="listQuery.delegateResult" placeholder="鉴定结论" class="mb10" style="width: 200px;"
                          @keyup.enter.native="handleFilter"/>
                <el-input v-model="listQuery.refereeName" placeholder="鉴定人" class="mb10" style="width: 200px;"
                          @keyup.enter.native="handleFilter"/>
                <el-input v-model="listQuery.documentNo" placeholder="文书号" class="mb10" style="width: 200px;"
                          @keyup.enter.native="handleFilter"/>
                <el-input v-model="listQuery.supportName" placeholder="协办" class="mb10" style="width: 200px;"
                          @keyup.enter.native="handleFilter"/>
                <el-input v-model="listQuery.caseCategory" placeholder="案件类别" class="mb10" style="width: 200px;"
                          @keyup.enter.native="handleFilter"/>
                <el-checkbox v-model="listQuery.hasTransfered">是否移交</el-checkbox>

                <el-button v-waves type="primary" icon="el-icon-search" @click="handleFilter">
                    搜索
                </el-button>
                <router-link :to="'/medical/create-medical'">
                    <el-button v-waves type="primary"  icon="el-icon-edit">添加</el-button>
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
            <el-table-column label="任务号" prop="id" align="center" width="80">
                <template slot-scope="{row}">
                    <span>{{ row.taskNo</span>
                </template>
            </el-table-column>
            <el-table-column label="委托单位" >
                <template slot-scope="{row}">
                    <span>{{ row.delegateOrg }}</span>
                </template>
            </el-table-column>
            <el-table-column label="委托人"  align="center">
                <template slot-scope="{row}">
                    <span>{{ row.delegateName }}</span>
                </template>
            </el-table-column>
            <el-table-column label="受理日期" >
                <template slot-scope="{row}">
                    <span>{{ row.createTime | parseTime('{y}-{m}-{d} {h}:{i}') }}</span>
                </template>
            </el-table-column>
            <el-table-column label="简要案情" align="center">
                <template slot-scope="{row}">
                    <span>{{ row.digest }}</span>
                </template>
            </el-table-column>
            <el-table-column label="鉴定结论" align="center">
                <template slot-scope="{row}">
                    <span>{{ row.contactPhoneNumber }}</span>
                </template>
            </el-table-column>
            <el-table-column label="鉴定人"  align="center">
                <template slot-scope="{row}">
                    <span>{{ row.refereeName }}</span>
                </template>
            </el-table-column>
            <el-table-column label="案件类别" align="center">
                <template slot-scope="{row}">
                    <span>{{ row.caseCategory }}</span>
                </template>
            </el-table-column>
            <el-table-column label="操作" align="center" width="230" class-name="small-padding fixed-width">
                <template slot-scope="{row}">
                    <router-link :to="'/medical/edit-medical/'+row.id">
                        <el-button v-waves type="primary" size="mini"  icon="el-icon-edit">编辑</el-button>
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
    import {fetchMedicalList, fetchMedical, createMedical, updateMedical} from '@/api/medical'
    import waves from '@/directive/waves' // waves directive
    import {parseTime} from '@/utils'
    import { fetchAdminMemberList} from '@/api/permissions'

    export default {
        name: 'Medical',
        directives: {waves},
        data() {
            return {
                tableKey: 0,
                list: null,
                pages: 0,
                listLoading: true,
                paginationShow: true,
                searchTime: '',
                limit: 20,
                listQuery: {
                    page: 1,
                    beginTime: undefined,
                    endTime: undefined,
                    taskNo: undefined,
                    delegateOrg: undefined,
                    delegateName: undefined,
                    digest: undefined,
                    injure: undefined,
                    delegateTarget: undefined,
                    delegateResult: undefined,
                    refereeName: undefined,
                    documentNo: undefined,
                    supportName: undefined,
                    caseCategory: undefined,
                    hasTransfered: undefined,
                },
                rules:{},

            }
        },
        created() {
            this.getList()
        },
        methods: {
            getList() {
                this.listLoading = true;
                fetchMedicalList(this.listQuery).then(response => {
                    this.list = response.list;
                    this.pages = response.pages

                    // Just to simulate the time of the request
                    setTimeout(() => {
                        this.listLoading = false
                    },1000)
                })
            },
            handleFilter () {
                if (this.searchTime) {
                    if (this.searchTime[0].toString().length > 10)
                        this.listQuery.beginTime = this.searchTime[0] / 1000;
                    if (this.searchTime[1].toString().length > 10)
                        this.listQuery.endTime = this.searchTime[1] / 1000;
                }
                this.listQuery.page = 1;
                this.getList()
            },
            
        }
    }
</script>
