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
                        <span>{{ row.evidence.selfEvidenceNo }}</span>
                    </template>
                </el-table-column>
                <el-table-column label="发案日期"  align="center" width="100">
                    <template slot-scope="{row}">
                        <span>{{ row.evidence.examBeginTime | parseTime('{y}-{m}-{d}') }}</span>
                    </template>
                </el-table-column>
                <el-table-column label="发案地址" align="center">
                    <template slot-scope="{row}">
                        <span>{{ row.evidence.caseAddress }}</span>
                    </template>
                </el-table-column>
                <el-table-column label="案件性质" align="center">
                    <template slot-scope="{row}">
                        <span>{{ row.evidence.caseCategory }}</span>
                    </template>
                </el-table-column>
                <el-table-column label="发案区划" align="center">
                    <template slot-scope="{row}">
                        <span>{{ row.evidence.caseHappenRegion }}</span>
                    </template>
                </el-table-column>
                <el-table-column label="侵入方式" align="center">
                    <template slot-scope="{row}">
                        <span>{{ row.evidence.invadeType }}</span>
                    </template>
                </el-table-column>
                <el-table-column label="作案工具" align="center">
                    <template slot-scope="{row}">
                        <span>{{ row.evidence.crimeTools }}</span>
                    </template>
                </el-table-column>
                <el-table-column label="足迹" align="center">
                    <template slot-scope="{row}">
                        <span>{{ row.evidence.footprint.replace(/,/g," ") }}</span>
                    </template>
                </el-table-column>

                <el-table-column label="操作" align="center" fixed="right" width="280" class-name="small-padding fixed-width">
                    <template slot-scope="{row}">
                        <router-link :to="'/search/show-search/'+row.evidence.id">
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
                    this.listUse.map(res=>{

                        // if (res.evidence.crimeTime){
                        //     if (res.evidence.crimeTime.startsWith('[',0)){
                        //         if (JSON.parse(res.evidence.crimeTime).constructor === Array){
                        //             res.evidence.crimeTime = JSON.parse(res.evidence.crimeTime).join(' ')
                        //         }
                        //     }else{
                        //         res.evidence.crimeTime = res.evidence.crimeTime.replace("\"","").replace("\"","");
                        //     }
                        // }
                        // if (res.evidence.sceneType){
                        //     if (res.evidence.sceneType.startsWith('[',0)){
                        //         if (JSON.parse(res.evidence.sceneType).constructor === Array){
                        //             res.evidence.sceneType = JSON.parse(res.evidence.sceneType).join(' ')
                        //         }
                        //     }else{
                        //         res.evidence.sceneType = res.evidence.sceneType.replace("\"","").replace("\"","");
                        //     }
                        // }
                        if (res.evidence.invadeType){
                            if (res.evidence.invadeType.startsWith('[',0)){
                                if (JSON.parse(res.evidence.invadeType).constructor === Array){
                                    res.evidence.invadeType = JSON.parse(res.evidence.invadeType).join(' ')
                                }
                            }

                            res.evidence.invadeType = res.evidence.invadeType.replace("\"","").replace("\"","");
                        }
                        // if (res.evidence.escapeType){
                        //     if (res.evidence.escapeType.startsWith('[',0)){
                        //         if (JSON.parse(res.evidence.escapeType).constructor === Array){
                        //             res.evidence.escapeType = JSON.parse(res.evidence.escapeType).join(' ')
                        //         }
                        //     }
                        //
                        //     res.evidence.escapeType = res.evidence.escapeType.replace("\"","").replace("\"","");
                        // }
                        // if (res.evidence.footprint){
                        //     if (JSON.parse(res.evidence.footprint).constructor === Array){
                        //         res.evidence.footprint = JSON.parse(res.evidence.footprint).join(' ')
                        //     }
                        //     res.evidence.footprint = res.evidence.footprint.replace("\"","").replace("\"","");
                        // }
                        return res;
                    })

                    // Just to simulate the time of the request

                    this.listLoadingUse = false

                })
            },


        }
    }
</script>

<style scoped>

</style>
