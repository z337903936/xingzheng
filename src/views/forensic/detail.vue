<template>
    <div class="app-container">
        <div class="filter-container" style="margin-bottom: 20px">
            <div>
                <el-date-picker
                        v-model="searchTime"
                        type="datetimerange"
                        range-separator="至"
                        start-placeholder="开始时间"
                        end-placeholder="结束时间"
                        value-format="timestamp"
                        style="width: 405px;display: inline-flex"
                        class="filter-item"
                />
                <el-select v-model="listQuery.examUid"
                           filterable
                           placeholder="检验人"
                           :filter-method="filterUserSearch"
                           @visible-change="restUserSearch"
                           class="filter-item"
                           @change="selectUpdate"
                           value-key="id"
                           style="width: 200px">
                    <el-option
                            v-for="item in userShowList"
                            :key="item.id"
                            :label="item.title"
                            :value="item.id"/>
                </el-select>
                <el-select v-model="listQuery.examUid"
                           filterable
                           placeholder="委托人"
                           :filter-method="filterUserSearch"
                           @visible-change="restUserSearch"
                           class="filter-item"
                           @change="selectUpdate"
                           value-key="id"
                           style="width: 200px">
                    <el-option
                            v-for="item in userShowList"
                            :key="item.id"
                            :label="item.title"
                            :value="item.id"/>
                </el-select>
                <div>
                    <el-input
                            v-model="listQuery.documentNo"
                            placeholder="文书号"
                            style="width: 200px;"
                            class="filter-item"
                            @keyup.enter.native="handleFilter"/>
                    <el-input
                            v-model="listQuery.evidenceNo"
                            placeholder="勘查号"
                            style="width: 200px;"
                            class="filter-item"
                            @keyup.enter.native="handleFilter"/>
                    <el-input
                            v-model="listQuery.autopsyNo"
                            placeholder="尸检号"
                            style="width: 200px;"
                            class="filter-item"
                            @keyup.enter.native="handleFilter"/>

                    <el-input
                            v-model="listQuery.delegateOrg"
                            placeholder="送检单位"
                            style="width: 200px;"
                            class="filter-item"
                            @keyup.enter.native="handleFilter"/>
                    <el-input
                            v-model="listQuery.filters"
                            placeholder="关键字"
                            style="width: 200px;"
                            class="filter-item"
                            @keyup.enter.native="handleFilter"/>
                    <el-button v-waves type="primary" icon="el-icon-refresh" @click="reset"
                               style="float: right;margin-right: 20px">
                        清空搜索条件
                    </el-button>
                    <el-button v-waves type="primary" icon="el-icon-search" @click="handleFilter"
                               style="float: right;margin-right: 20px">
                        搜索
                    </el-button>
                    <!--<router-link :to="'/alarm/create-alarm/'" style="float: right;margin-right: 20px">-->
                        <!--<el-button v-waves type="primary" icon="el-icon-edit">添加</el-button>-->
                    <!--</router-link>-->
                </div>



                <!--<el-button v-waves :loading="downloadLoading" type="primary" icon="el-icon-download" @click="handleDownload">-->
                <!--导出-->
                <!--</el-button>-->
            </div>
        </div>
        <el-table
                v-loading="listLoading"

                :data="list"
                border
                fit
                highlight-current-row
                style="width: 100%;"

        >
            <el-table-column label="尸检号" align="center" width="130">
                <template slot-scope="{row}">
                    <span>{{ row.autopsyNo }}</span>
                </template>
            </el-table-column>
            <el-table-column label="案件类别" align="center" width="200">
                <template slot-scope="{row}">
                    <span>{{ row.caseCategory }}</span>
                </template>
            </el-table-column>
            <el-table-column label="委托日期" align="center" width="170">
                <template slot-scope="{row}">
                    <span>{{ row.delegateTime | parseTime('{y}-{m}-{d} {h}:{i}:{s}')  }}</span>
                </template>
            </el-table-column>
            <el-table-column label="委托单位" align="center">
                <template slot-scope="{row}">
                    <span>{{ row.delegateOrg }}</span>
                </template>
            </el-table-column>

            <el-table-column label="委托人" align="center">
                <template slot-scope="{row}">
                    <span>{{ row.delegateName  }}</span>
                </template>
            </el-table-column>

            <el-table-column label="简要案情" align="center">
                <template slot-scope="{row}">
                    <span>{{ row.digest }}</span>
                </template>
            </el-table-column>
            <el-table-column label="死者情况" align="center">
                <template slot-scope="{row}">
                    <span>{{ row.deathDetail }}</span>
                </template>
            </el-table-column>

            <el-table-column label="提取检材" align="center">
                <template slot-scope="{row}">
                    <span>{{ row.extractMaterial }}</span>
                </template>
            </el-table-column>
            <el-table-column label="鉴定结论" align="center">
                <template slot-scope="{row}">
                    <span>{{ row.conclusion }}</span>
                </template>
            </el-table-column>

            <el-table-column label="检验人" align="center">
                <template slot-scope="{row}">
                    <span>{{ row.examName }}</span>
                </template>
            </el-table-column>
            <el-table-column label="文书" align="center">
                <template slot-scope="{row}">
                    <span>{{ row.documentNo }}</span>
                </template>
            </el-table-column>
            <el-table-column label="是否移交" align="center">
                <template slot-scope="{row}">
                    <span>{{ row.hasTransfered?"是":"否" }}</span>
                </template>
            </el-table-column>

            <el-table-column label="备注" align="center">
                <template slot-scope="{row}">
                    <span>{{ row.note }}</span>
                </template>
            </el-table-column>

            <el-table-column label="操作" align="center" width="230" class-name="small-padding fixed-width">
                <template slot-scope="{row}">
                    <el-button type="primary" size="small" icon="el-icon-edit" @click="gotoMedicalResult(row)" :disabled="resultDisable(row)">
                        填写结果
                    </el-button>
                    <!--<el-button type="primary" size="small" icon="el-icon-document-checked"-->
                               <!--@click="handleAcceptTask(row)"-->
                               <!--v-if="row.status===1">-->
                        <!--接收任务-->
                    <!--</el-button>-->

                    <!--<el-button type="success" size="small" icon="el-icon-tickets" @click="handleWriteResult(row)"-->
                               <!--v-if="row.status===2">-->
                        <!--填写结果-->
                    <!--</el-button>-->
                    <!--<router-link :to="'/search/update-search/'+row.evidenceId"-->
                                 <!--v-if="row.status===2 && row.stepName==='痕检现勘'">-->
                        <!--<el-button icon="el-icon-edit" type="primary" size="small">编辑现勘</el-button>-->
                    <!--</router-link>-->
                </template>
            </el-table-column>
        </el-table>
        <el-pagination
                :page-count="pages"
                :current-page.sync="listQuery.page"
                :hide-on-single-page="paginationShow"
                background
                layout="prev, pager, next"
                @current-change="getList"
                @size-change="getList"
                style="float: right;margin-top: 15px"
        />


    </div>
</template>
<style scoped>
    .el-table >>> .el-table__expanded-cell[class*="cell"] {
        background-color: #f0f0f0 !important;
    }

    .table-expand {
        font-size: 0;

    }

    .table-expand label {
        width: 90px;
        color: #99a9bf;
    }

    .table-expand .el-form-item {
        margin-right: 0;
        margin-bottom: 0;
        width: 50%;
    }

    .el-row {
        margin-bottom: 20px;
    }

</style>


<script>
    import {medicalResult} from '@/api/backlog'
    import {parseTime} from '@/utils'
    import {fetchAdminMemberList} from '@/api/permissions'
    import {fetchList} from '@/api/dictionary'
    import waves from '@/directive/waves' // waves directive

    export default {
        name: "Backlog",
        directives: {waves},
        filters: {

            statusFilter(status) {
                const statusMap = {
                    1: '未领取',
                    2: '进行中',
                    3: '已完成'
                }
                return statusMap[status]
            }
        },
        data() {
            return {
                list: [],
                tableKey: 0,
                listLoading: false,
                userList: [],
                userShowList: [],
                searchTime: '',
                pages: 0,
                paginationShow: true,
                listQuery:{
                    page: 1,
                    beginTime: undefined,
                    endTime: undefined,
                    examUid:undefined,
                    delegateUid:undefined,
                    documentNo:undefined,
                    autopsyNo:undefined,
                    filters:undefined,
                    delegateOrg:undefined,
                    evidenceNo:undefined,
                },
            }
        },
        created() {
            this.getList();
            this.getUserList();
        },
        methods: {
            resultDisable(row){

                if (this.$store.getters.id !== row.examUid)
                    return true ;
                return false;
            },
            gotoMedicalResult(row){
                this.$router.push({ name:'medicalResult',params:{id:row.id},query: { evidence:JSON.stringify(row),isDetail:true}})
            },
            selectUpdate(val){
                this.$forceUpdate();
            },
            reset() {
                this.listQuery = {
                    page: 1,
                    beginTime: undefined,
                    endTime: undefined,
                    examUid:undefined,
                    delegateUid:undefined,
                    documentNo:undefined,
                    autopsyNo:undefined,
                    filters:undefined,
                    delegateOrg:undefined,
                    evidenceNo:undefined,

                };
                this.searchTime = '';
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
                this.listQuery.page = 1
                this.getList()
            },

            filterUserSearch(value){
                if (value) {
                    this.userShowList = this.userList.filter(data=>{
                        var p =  /^[a-zA-Z]+$/;
                        if (p.test(value)) {
                            if (data.py.toLowerCase().indexOf(value.toLowerCase())>-1)
                                return data
                        }else{
                            if (data.title.indexOf(value)>-1)
                                return data
                        }
                    })
                }else{
                    this.userShowList = this.userList;
                }
            },
            restUserSearch(change){
                if (!change) {
                    this.userShowList = this.userList;
                }

            },
            getUserList() {
                fetchAdminMemberList({}).then(response => {
                    this.userList = response.list.map(data => {
                        return {
                            id: data.id,
                            title: data.realName,
                            py:data.pinyinAbbr,
                        }
                    })
                    this.userShowList = this.userList
                })
            },
            getList() {
                this.listLoading = true;
                medicalResult(this.listQuery).then(response => {
                    this.list = response.list
                    // this.pages = response.pages

                    // Just to simulate the time of the request

                    this.listLoading = false

                })
            },

        }
    }
</script>
