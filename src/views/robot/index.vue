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
                        style="width: 405px;"
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
                <el-button v-waves type="primary" icon="el-icon-refresh" @click="reset"
                           style="float: right;margin-right: 20px">
                    清空搜索条件
                </el-button>
                <el-button v-waves type="primary" icon="el-icon-search" @click="handleFilter" style="float: right;margin-right: 20px">
                    搜索
                </el-button>
                <router-link :to="'/robot/create'">
                    <el-button v-waves type="primary"  icon="el-icon-edit" style="float: right;margin-right: 20px">创建任务</el-button>
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
            <el-table-column label="任务名称"   prop="id" align="center" width="200">
                <template slot-scope="{row}">
                    <span>{{ row.name }}</span>
                </template>
            </el-table-column>

            <el-table-column label="研判依据" align="center" width="450">
                <template slot-scope="{row}">
                    <span>
                        <div v-if="row.sceneType ">
                            处所：{{ row.sceneType  }}
                        </div>
                        <div v-if="row.crimeTime ">
                            作案时机：{{ row.crimeTime  }}
                        </div>
                        <div v-if="row.caseHappenRegion ">
                            案件发生区域：{{ row.caseHappenRegion  }}
                        </div>
                        <div v-if="row.invadeType ">
                            侵入方式：{{ row.invadeType  }}
                        </div>
                        <div v-if="row.escapeType ">
                            作案出口：{{ row.escapeType  }}
                        </div>
                        <div v-if="row.crimeTools ">
                            作案工具：{{ row.crimeTools  }}
                        </div>
                        <div v-if="row.crimeDetail ">
                            作案过程：{{ row.crimeDetail  }}
                        </div>
                        <div v-if="row.caseCategory ">
                            案件分类：{{ row.caseCategory  }}
                        </div>
                    </span>

                </template>
            </el-table-column>

            <el-table-column label="勘查时间" width="300" align="center">
                <template slot-scope="{row}">
                    <span>{{ row.examBeginTime | parseTime('{y}-{m}-{d} {h}:{i}:{s}') }}</span>
                    <span> - </span>
                    <span>{{ row.examEndTime | parseTime('{y}-{m}-{d} {h}:{i}:{s}') }}</span>
                </template>
            </el-table-column>

            <el-table-column label="创建人" align="center" width="150">
                <template slot-scope="{row}">
                    <span>{{ row.createName }}</span>
                </template>
            </el-table-column>

            <el-table-column label="创建日期"  width="200" align="center">
                <template slot-scope="{row}">
                    <span>{{ row.createTime | parseTime('{y}-{m}-{d} {h}:{i}:{s}') }}</span>
                </template>
            </el-table-column>

            <el-table-column label="任务状态" width="110" align="center">
                <template slot-scope="{row}">
                    <span>{{ row.status===1?'未开始':row.status===2?'进行中':'已结束' }}</span>
                </template>
            </el-table-column>
            <el-table-column label="操作" align="center" fixed="right"  width="380" class-name="small-padding">
                <template slot-scope="{row}">
                    <router-link :to="'/robot/edit/'+row.id">
                        <el-button v-waves type="primary" size="mini"  icon="el-icon-edit">编辑</el-button>
                    </router-link>
                    <router-link :to="'/robot/taskList/'+row.id">
                        <el-button v-waves type="primary" icon="el-icon-tickets" size="mini" style="width: 100px" >任务批次</el-button>
                    </router-link>

                    <el-button v-waves type="success" icon="el-icon-video-play" size="mini" style="width: 100px"  v-if="row.status !==2" @click="handleTask(row,true)">
                        开始任务
                    </el-button>
                    <el-button v-waves type="warning" icon="el-icon-video-pause" size="mini" style="width: 100px"  v-if="row.status ===2" @click="handleTask(row,false)">
                        结束任务
                    </el-button>
                    <el-button v-waves  type="danger" size="mini" icon="el-icon-delete" style="margin-left: 0"
                               @click="handleDelete(row)">删除
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
    import {robotList, createRobot, updateRobot,startRobot,endRobot,deleteRobot} from '@/api/robot'
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
            handleDelete(data) {
                this.$confirm('确认删除？')
                    .then(_ => {
                        this.delete(data)

                    })
                    .catch(_ => {});

            },
            delete(data){
                const sendData = {
                    taskId: data.id,
                    operation: 'del'
                }
                deleteRobot(sendData).then(response => {
                    if (response.code === 200) {
                        this.$message({
                            message: '操作成功',
                            type: 'success',
                            showClose: true,
                            duration: 2000
                        })
                        this.getList()
                    } else {
                        this.$message({
                            message: response.reason,
                            type: 'success',
                            showClose: true,
                            duration: 2000
                        })
                    }
                })
            },
            reset() {
                this.listQuery = {
                    page: 1,
                    beginTime: undefined,
                    endTime: undefined,
                    name: undefined,
                    status: 0,
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
                robotList(this.listQuery).then(response => {
                    this.list = response.list;
                    this.pages = response.pages
                    this.list.map(res=>{
                        if (res.crimeTime){
                            if (JSON.parse(res.crimeTime).constructor === Array){
                                res.crimeTime = JSON.parse(res.crimeTime).join(' ')
                            }
                        }
                        if (res.sceneType){
                            if (JSON.parse(res.sceneType).constructor === Array){
                                res.sceneType = JSON.parse(res.sceneType).join(' ')
                            }
                        }
                        if (res.invadeType){
                            if (JSON.parse(res.invadeType).constructor === Array){
                                res.invadeType = JSON.parse(res.invadeType).join(' ')
                            }
                        }
                        if (res.escapeType){
                            if (JSON.parse(res.escapeType).constructor === Array){
                                res.escapeType = JSON.parse(res.escapeType).join(' ')
                            }
                        }
                        if (res.caseHappenRegion){
                            if (JSON.parse(res.caseHappenRegion).constructor === Array){
                                res.caseHappenRegion = JSON.parse(res.caseHappenRegion).join(' ')
                            }
                        }
                        if (res.caseCategory){
                            if (JSON.parse(res.caseCategory).constructor === Array){
                                res.caseCategory = JSON.parse(res.caseCategory).join(' ')
                            }
                        }
                        return res;

                    });
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
