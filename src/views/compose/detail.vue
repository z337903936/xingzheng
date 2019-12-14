<template>
    <div  class="app-container">

            <el-table
                    v-loading="listLoadingUse"
                    :data="listUse"
                    border
                    fit
                    highlight-current-row
                    max-height="500"
                    style="width: 100%;"
            >
                <el-table-column label="勘查号"  align="center" width="120">
                    <template slot-scope="{row}">
                        <span>{{ row.selfEvidenceNo }}</span>
                    </template>
                </el-table-column>
                <el-table-column label="发案日期"  align="center" width="100">
                    <template slot-scope="{row}">
                        <span>{{ row.examBeginTime | parseTime('{y}-{m}-{d}') }}</span>
                    </template>
                </el-table-column>
                <el-table-column label="发案地址" align="center">
                    <template slot-scope="{row}">
                        <span>{{ row.caseAddress }}</span>
                    </template>
                </el-table-column>
                <el-table-column label="案件性质" align="center">
                    <template slot-scope="{row}">
                        <span>{{ row.caseCategory }}</span>
                    </template>
                </el-table-column>
                <el-table-column label="发案区划" align="center">
                    <template slot-scope="{row}">
                        <span>{{ row.caseHappenRegion }}</span>
                    </template>
                </el-table-column>
                <el-table-column label="侵入方式" align="center">
                    <template slot-scope="{row}">
                        <span>{{ row.invadeType }}</span>
                    </template>
                </el-table-column>
                <el-table-column label="作案工具" align="center">
                    <template slot-scope="{row}">
                        <span>{{ row.crimeTools }}</span>
                    </template>
                </el-table-column>
                <el-table-column label="足迹" align="center">
                    <template slot-scope="{row}">
                        <span>{{ row.footprint }}</span>
                    </template>
                </el-table-column>

                <el-table-column label="操作" align="center" fixed="right" width="280" class-name="small-padding fixed-width">
                    <template slot-scope="{row}">
                        <router-link :to="'/search/show-search/'+row.id">
                            <el-button type="success" size="mini" icon="el-icon-zoom-in">查看</el-button>
                        </router-link>
                    </template>
                </el-table-column>
            </el-table>
            <el-pagination
                    background
                    layout="prev, pager, next"
                    :page-count="pagesUse"
                    :current-page.sync="pageUse"
                    @current-change="getComposeList"
                    @size-change="getComposeList"
                    :hide-on-single-page="paginationShow"
                    style="float: right;margin-top: 15px"
            >
            </el-pagination>

    </div>
</template>

<script>
    import {searchList} from '@/api/search'
    import {composeDetail,updateCompose,delCompose} from '@/api/compose'
    import waves from '@/directive/waves' // waves directive
    import {fetchList} from '@/api/dictionary'
    import {parseTime} from '@/utils'
    import {fetchAdminMemberList} from '@/api/permissions'


    export default {
        name: "composeForm",

        directives: {waves},
        filters: {
            // statusFilter(status) {
            //     const statusMap = {
            //         1: '未领取',
            //         2: '进行中',
            //         3: '已完成'
            //     }
            //     return statusMap[status]
            // }
        },
        data() {
            return {
                listUse: null,
                pagesUse: 0,
                pageUse: 0,
                listLoadingUse: true,
                paginationShow: true,
                rules:{},
                curId:undefined,
            }
        },
        created() {
            const id = this.$route.params && this.$route.params.id;
            this.curId = id;
            this.getComposeList(id)
        },
        methods: {
            getComposeList(id) {
                this.listLoading = true;
                composeDetail(id).then(response => {
                    this.listUse = response.list;
                    this.pagesUse = response.pages;

                    // Just to simulate the time of the request

                    this.listLoadingUse = false

                })
            },


        }
    }
</script>

<style scoped>

</style>
