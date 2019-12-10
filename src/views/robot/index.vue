<template>
    <div class="app-container">
        <div class="filter-container">
            <div>
                <el-date-picker
                        v-model="searchTime"
                        type="datetimerange"
                        range-separator="至"
                        start-placeholder="开始时间"
                        end-placeholder="结束时间"
                        value-format="timestamp"
                />
                <el-input v-model="listQuery.name" placeholder="任务名" class="mb10" style="width: 200px;"
                          @keyup.enter.native="handleFilter"/>
                <el-select v-model="listQuery.status" placeholder="任务状态" class="mb10" style="width: 200px;">
                <el-option
                        v-for="item in statusList"
                        :key="item.id"
                        :label="item.title"
                        :value="item.id"/>
                </el-select>
                <el-button v-waves type="primary" icon="el-icon-search" @click="handleFilter">
                    搜索
                </el-button>
                <router-link :to="'/robot/create'">
                    <el-button v-waves type="primary"  icon="el-icon-edit">创建任务</el-button>
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
            <el-table-column label="任务名称"   prop="id" align="center" >
                <template slot-scope="{row}">
                    <span>{{ row.name }}</span>
                </template>
            </el-table-column>

            <el-table-column label="案件分类" align="center" width="200">
                <template slot-scope="{row}">
                    <span>{{ row.caseCategory }}</span>
                </template>
            </el-table-column>

            <el-table-column label="勘查开始时间" width="250" align="center">
                <template slot-scope="{row}">
                    <span>{{ row.examBeginTime | parseTime('{y}-{m}-{d} {h}:{i}:{s}') }}</span>
                </template>
            </el-table-column>

            <el-table-column label="创建人" align="center" width="150">
                <template slot-scope="{row}">
                    <span>{{ row.createName }}</span>
                </template>
            </el-table-column>

            <el-table-column label="创建日期"  width="250" align="center">
                <template slot-scope="{row}">
                    <span>{{ row.createTime | parseTime('{y}-{m}-{d} {h}:{i}:{s}') }}</span>
                </template>
            </el-table-column>

            <el-table-column label="任务状态" width="110" align="center">
                <template slot-scope="{row}">
                    <span>{{ row.status===1?'未开始':row.status===2?'进行中':'已结束' }}</span>
                </template>
            </el-table-column>

            <el-table-column label="操作" align="center" width="280" class-name="small-padding fixed-width">
                <template slot-scope="{row}">
                    <router-link :to="'/robot/edit/'+row.id">
                        <el-button v-waves type="primary" size="mini"  icon="el-icon-edit">编辑</el-button>
                    </router-link>
                    <router-link :to="'/robot/taskList/'+row.id">
                        <el-button v-waves type="primary" size="mini"  icon="el-icon-edit">运行列表</el-button>
                    </router-link>
                    <el-button v-waves type="primary" size="mini" v-if="row.status === 1"  @click="handleTask(row,true)">
                        开始任务
                    </el-button>
                    <el-button v-waves type="primary" size="mini" v-if="row.status === 2"  @click="handleTask(row,false)">
                        结束任务
                    </el-button>
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
    import {robotList, createRobot, updateRobot,startRobot,endRobot} from '@/api/robot'
    import waves from '@/directive/waves' // waves directive
    import { parseTime } from '@/utils'
    import { fetchAdminMemberList } from '@/api/permissions'

    const statusMap = [
        {
            id: 0,
            title: '全部'
        },
        {
            id: 1,
            title: '未领取'
        }, {
            id: 2,
            title: '进行中'
        }, {
            id: 3,
            title: '已完成'
        },
    ];

    export default {
        name: 'robot',
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
                    beginTime: undefined,
                    endTime: undefined,
                    name: undefined,
                    status: 0,
                },
                statusList:statusMap,

            }
        },
        created() {
            this.getList()
        },
        methods: {
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
                robotList(this.listQuery).then(response => {
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
