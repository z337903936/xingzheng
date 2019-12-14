<template>
    <div class="app-container">

        <div class="filter-container">
            <div>

                <el-select v-model="listQuery.status" placeholder="任务状态" class="mb10" style="width: 200px;">
                <el-option
                        v-for="item in statusList"
                        :key="item.id"
                        :label="item.title"
                        :value="item.id"/>
                </el-select>
                <el-button v-waves type="primary" icon="el-icon-refresh" @click="reset"
                           style="float: right;margin-right: 20px">
                    清空搜索条件
                </el-button>
                <el-button v-waves type="primary" icon="el-icon-search" @click="handleFilter" style="float: right;margin-right: 20px">
                    搜索
                </el-button>
                <!--<router-link :to="'/compose/create'">-->
                <!--<el-button v-waves type="primary"  icon="el-icon-edit" style="float: right;margin-right: 20px">创建串并</el-button>-->
            <!--</router-link>-->

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
            <el-table-column label="串并编号"   prop="id" align="center" width="250">
                <template slot-scope="{row}">
                    <span>{{ row.composeNo }}</span>
                </template>
            </el-table-column>

            <el-table-column label="串并依据" align="center" >
                <template slot-scope="{row}">
                    <span>{{ row.preConditions }}</span>
                </template>
            </el-table-column>

            <el-table-column label="申请人"  width="200" align="center">
                <template slot-scope="{row}">
                    <span>{{ row.createName  }}</span>
                </template>
            </el-table-column>

            <el-table-column label="任务状态" width="110" align="center">
                <template slot-scope="{row}">
                    <span>{{ row.status===1?'申请中 ':row.status===2?'已同意':'已拒绝' }}</span>
                </template>
            </el-table-column>
            <el-table-column label="操作" align="center" fixed="right"  width="380" class-name="small-padding">
                <template slot-scope="{row}">
                    <router-link :to="'/compose/edit/'+row.id">
                        <el-button v-waves type="primary" size="mini"  icon="el-icon-edit">编辑</el-button>
                    </router-link>
                    <router-link :to="'/compose/detail/'+row.id">
                        <el-button type="success" size="mini" icon="el-icon-zoom-in">查看</el-button>
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
    import {composeList} from '@/api/compose'
    import waves from '@/directive/waves' // waves directive
    import { parseTime } from '@/utils'
    import { fetchAdminMemberList } from '@/api/permissions'

    const statusMap = [

        {
            id: 1,
            title: '进行中'
        }, {
            id: 2,
            title: '已通过'
        }
    ];

    export default {
        name: 'compose',
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
                    status: 1,
                },
                statusList:statusMap,

            }
        },
        created() {
            this.getList()
        },
        methods: {
            reset() {
                this.listQuery = {
                    page: 1,
                    status: 1,
                };
                this.searchTime = '';
            },
            handleTask(data,type){
                const sendData={
                    taskId:data.id
                }
                if (type){
                    startRobot(sendData).then(response => {
                        if (response.code === 200) {
                            this.$message({
                                message: '操作成功',
                                type: 'success',
                                showClose: true,
                                duration: 2000
                            })
                            this.getList();
                        } else {
                            this.$message({
                                message: response.reason,
                                type: 'success',
                                showClose: true,
                                duration: 2000
                            })
                        }
                    })
                } else{
                    endRobot(sendData).then(response => {
                        if (response.code === 200) {
                            this.$message({
                                message: '操作成功',
                                type: 'success',
                                showClose: true,
                                duration: 2000
                            })
                            this.getList();
                        } else {
                            this.$message({
                                message: response.reason,
                                type: 'success',
                                showClose: true,
                                duration: 2000
                            })
                        }
                    })
                }
            },
            getList() {
                this.listLoading = true;
                composeList(this.listQuery).then(response => {
                    this.list = response.list;
                    this.pages = response.pages
                    // Just to simulate the time of the request
                    this.listLoading = false

                })
            },
            handleFilter () {
                if (this.searchTime){
                    if (this.searchTime[0].toString().length>10)
                        this.listQuery.beginTime = this.searchTime[0]/1000;
                    if (this.searchTime[1].toString().length>10)
                        this.listQuery.endTime = this.searchTime[1]/1000;
                }
                this.listQuery.page = 1;
                this.getList()
            },

            handleDownload() {
                this.downloadLoading = true
                import('@/vendor/Export2Excel').then(excel => {
                    const tHeader = ['timestamp', 'title', 'type', 'importance', 'status']
                    const filterVal = ['timestamp', 'title', 'type', 'importance', 'status']
                    const data = this.formatJson(filterVal, this.list)
                    excel.export_json_to_excel({
                        header: tHeader,
                        data,
                        filename: 'table-list'
                    })
                    this.downloadLoading = false
                })
            },
            formatJson(filterVal, jsonData) {
                return jsonData.map(v => filterVal.map(j => {
                    if (j === 'timestamp') {
                        return parseTime(v[j])
                    } else {
                        return v[j]
                    }
                }))
            },

        }
    }
</script>
