<template>
    <div class="app-container">

        <el-table
                v-loading="listLoading"
                :key="tableKey"
                :data="list"
                border
                fit
                highlight-current-row
                style="width: 100%;"
        >
            <el-table-column label="案件编号"  align="center" >
                <template slot-scope="{row}">
                    <span>{{ row.caseNo }}</span>
                </template>
            </el-table-column>

            <el-table-column label="接警记录编号"  align="center" >
                <template slot-scope="{row}">
                    <span>{{ row.recordNo }}</span>
                </template>
            </el-table-column>
            <el-table-column label="警情号"   align="center" >
                <template slot-scope="{row}">
                    <span>{{ row.instanceNo }}</span>
                </template>
            </el-table-column>
            <el-table-column label="案件分类" align="center" >
                <template slot-scope="{row}">
                    <span>{{ row.caseCategory }}</span>
                </template>
            </el-table-column>
            <el-table-column label="勘查开始时间" align="center">
                <template slot-scope="{row}">
                    <span>{{ row.examBeginTime | parseTime('{y}-{m}-{d} {h}:{i}:{s}') }}</span>
                </template>
            </el-table-column>
            <el-table-column label="操作" align="center" width="280" class-name="small-padding fixed-width">
                <template slot-scope="{row}">
                    <router-link :to="'/search/show-search/'+row.id">
                        <el-button type="success" size="mini" >查看</el-button>
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
                style="float: right;margin-top: 15px"
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
    import {robotResult} from '@/api/robot'
    import waves from '@/directive/waves' // waves directive
    import { parseTime } from '@/utils'
    import { fetchAdminMemberList } from '@/api/permissions'

    export default {
        name: 'robotTaskResult',
        directives: {waves},
        data() {
            return {
                tableKey: 0,
                list: null,
                pages: 0,
                listLoading: false,
                paginationShow: true,
                searchTime: '',
                listQuery: {
                    page: 1,
                    id: undefined,
                },
                statusList:statusMap,

            }
        },
        created() {
            const id = this.$route.params && this.$route.params.id
            this.getList(id)
        },
        methods: {
            getList(id) {
                this.listQuery.id = id
                this.listLoading = true;
                robotResult(this.listQuery).then(response => {
                    this.list = response.list;
                    this.pages = response.pages

                    // Just to simulate the time of the request
                    this.listLoading = false

                })
            },

        }
    }
</script>
