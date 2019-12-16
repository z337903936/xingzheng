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
            <el-table-column label="批次号"  align="center" width="180" >
                <template slot-scope="{row}">
                    <span>{{ row.batchNo }}</span>
                </template>
            </el-table-column>

            <el-table-column label="任务名称"  align="center" width="90">
                <template slot-scope="{row}">
                    <span>{{ row.taskName }}</span>
                </template>
            </el-table-column>
            <el-table-column label="匹配数"   align="center" width="90">
                <template slot-scope="{row}">
                    <span>{{ row.matchCount }}</span>
                </template>
            </el-table-column>
            <el-table-column label="勘查时间" width="300" align="center">
                <template slot-scope="{row}">
                    <span>{{ row.examBeginTime | parseTime('{y}-{m}-{d} {h}:{i}:{s}') }}</span>
                    <span> - </span>
                    <span>{{ row.examEndTime | parseTime('{y}-{m}-{d} {h}:{i}:{s}') }}</span>
                </template>
            </el-table-column>
            <!--<el-table-column label="勘查开始时间" width="200" align="center">-->
                <!--<template slot-scope="{row}">-->
                    <!--<span>{{ row.examEndTime | parseTime('{y}-{m}-{d} {h}:{i}:{s}') }}</span>-->
                <!--</template>-->
            <!--</el-table-column>-->
            <el-table-column label="任务开始时间" width="200" align="center">
                <template slot-scope="{row}">
                    <span>{{ row.beginTime | parseTime('{y}-{m}-{d} {h}:{i}:{s}') }}</span>
                </template>
            </el-table-column>
            <!--<el-table-column label="任务结束时间" width="200" align="center">-->
                <!--<template slot-scope="{row}">-->
                    <!--<span>{{ row.endTime | parseTime('{y}-{m}-{d} {h}:{i}:{s}') }}</span>-->
                <!--</template>-->
            <!--</el-table-column>-->
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
            <!--<el-table-column label="案件分类" align="center" width="200">-->
                <!--<template slot-scope="{row}">-->
                    <!--<span>{{ row.caseCategory }}</span>-->
                <!--</template>-->
            <!--</el-table-column>-->
            <!--<el-table-column label="处所" align="center" width="200">-->
                <!--<template slot-scope="{row}">-->
                    <!--<span>{{ row.sceneType }}</span>-->
                <!--</template>-->
            <!--</el-table-column>-->
            <!--<el-table-column label="作案时机" align="center" width="200">-->
                <!--<template slot-scope="{row}">-->
                    <!--<span>{{ row.crimeTime }}</span>-->
                <!--</template>-->
            <!--</el-table-column>-->
            <!--<el-table-column label="案件发生区域" align="center" width="200">-->
                <!--<template slot-scope="{row}">-->
                    <!--<span>{{ row.caseHappenRegion }}</span>-->
                <!--</template>-->
            <!--</el-table-column>-->
            <!--<el-table-column label="侵入方式" align="center" width="200">-->
                <!--<template slot-scope="{row}">-->
                    <!--<span>{{ row.invadeType }}</span>-->
                <!--</template>-->
            <!--</el-table-column>-->
            <!--<el-table-column label="作案出口" align="center" width="200">-->
                <!--<template slot-scope="{row}">-->
                    <!--<span>{{ row.escapeType }}</span>-->
                <!--</template>-->
            <!--</el-table-column>-->
            <!--<el-table-column label="作案工具" align="center" width="200">-->
                <!--<template slot-scope="{row}">-->
                    <!--<span>{{ row.crimeTools }}</span>-->
                <!--</template>-->
            <!--</el-table-column>-->
            <!--<el-table-column label="作案过程" align="center" width="200">-->
                <!--<template slot-scope="{row}">-->
                    <!--<span>{{ row.crimeDetail }}</span>-->
                <!--</template>-->
            <!--</el-table-column>-->
            <el-table-column label="作案人数 " align="center" width="90">
                <template slot-scope="{row}">
                    <span>{{ row.crimePeoples===0?'不确定':row.status===1?'1人':row.status===2?'两个':'多人' }}</span>
                </template>
            </el-table-column>

            <el-table-column label="任务状态" width="110" align="center">
                <template slot-scope="{row}">
                    <span>{{ row.status===1?'未开始':row.status===2?'进行中':'已结束' }}</span>
                </template>
            </el-table-column>
            <el-table-column label="操作" align="center" fixed="right" width="280" class-name="small-padding fixed-width">
                <template slot-scope="{row}">
                    <router-link :to="'/robot/taskResult/'+row.id">
                        <el-button type="success" size="mini" icon=""  style="width: 100px">查看结果</el-button>
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
    import {robotBatch} from '@/api/robot'
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
        name: 'robotTaskList',
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
                this.listLoading = true;
                this.listQuery.id = id
                robotBatch(this.listQuery).then(response => {
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

        }
    }
</script>
