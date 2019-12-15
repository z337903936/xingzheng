<template>
    <div class="app-container">
        <div class="filter-container">
            <div><el-date-picker
                    v-model="searchTime"
                    type="datetimerange"
                    range-separator="至"
                    start-placeholder="移交开始时间"
                    end-placeholder="移交结束时间"
                    value-format="timestamp"
                    style="width: 405px;"
            />
                <el-select v-model="listQuery.requestName" placeholder="移交人" center>
                    <el-option
                            v-for="item in userList"
                            :key="item.id"
                            :label="item.title"
                            :value="item.id"/>
                </el-select>
                <!--<el-input v-model="listQuery.dnaNo" placeholder="DNA编号" class="mb10" style="width: 200px;"-->
                          <!--@keyup.enter.native="handleFilter"/>-->
                <!--<el-input v-model="listQuery.materialNo" placeholder="物证编号" class="mb10" style="width: 200px;"-->
                          <!--@keyup.enter.native="handleFilter"/>-->

                <el-input v-model="listQuery.evidenceNo" placeholder="勘查号" class="mb10" style="width: 200px;"
                          @keyup.enter.native="handleFilter"/>
                <!--<div style="margin-top: 10px">-->
                    <!--<el-input v-model="listQuery.taskNo" placeholder="任务号" class="mb10" style="width: 200px;"-->
                              <!--@keyup.enter.native="handleFilter"/>-->
                    <!--<el-input v-model="listQuery.examResult" placeholder="检验结果" class="mb10" style="width: 200px;"-->
                              <!--@keyup.enter.native="handleFilter"/>-->
                    <el-input v-model="listQuery.filters" placeholder="关键字" class="mb10" style="width: 200px;"
                              @keyup.enter.native="handleFilter"/>
                    <div style="float: right">
                        <el-button v-waves type="primary" icon="el-icon-refresh" @click="reset"
                                   style="float: right;margin-right: 20px">
                            清空搜索条件
                        </el-button>
                        <el-button v-waves type="primary" icon="el-icon-search" @click="handleFilter" style="float: right;margin-right: 20px">
                            搜索
                        </el-button>
                        <!--<router-link :to="'/dna/create-dna'" style="float: right;margin-right: 20px">-->
                            <!--<el-button v-waves type="primary"  icon="el-icon-edit" >添加</el-button>-->
                        <!--</router-link>-->
                    </div>

                <!--</div>-->
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
            <!--<el-table-column label="DNA编号" prop="id" align="center" width="180">-->
                <!--<template slot-scope="{row}">-->
                    <!--<span>{{ row.dnaNo }}</span>-->
                <!--</template>-->
            <!--</el-table-column>-->

            <!--<el-table-column label="送检时间" width="170" align="center">-->
                <!--<template slot-scope="{row}">-->
                    <!--<span>{{ row.requestTime | parseTime('{y}-{m}-{d} {h}:{i}:{s}') }}</span>-->
                <!--</template>-->
            <!--</el-table-column>-->
            <!--<el-table-column label="提取人" align="center" min-width="100">-->
                <!--<template slot-scope="{row}">-->
                    <!--<span>{{ row.handlerName }}</span>-->
                <!--</template>-->
            <!--</el-table-column>-->
            <!--<el-table-column label="勘查号" width="210" align="center">-->
                <!--<template slot-scope="{row}">-->
                    <!--<span>{{ row.evidenceNo }}</span>-->
                <!--</template>-->
            <!--</el-table-column>-->
            <!--<el-table-column label="任务号" width="210px" align="center">-->
                <!--<template slot-scope="{row}">-->
                    <!--<span>{{ row.taskNo }}</span>-->
                <!--</template>-->
            <!--</el-table-column>-->
            <!--<el-table-column label="移交人" width="100" align="center">-->
                <!--<template slot-scope="{row}">-->
                    <!--<span>{{ row.requestName }}</span>-->
                <!--</template>-->
            <!--</el-table-column>-->
            <!--<el-table-column label="检验结果" width="210" align="center">-->
                <!--<template slot-scope="{row}">-->
                    <!--<span>{{ row.examResult }}</span>-->
                <!--</template>-->
            <!--</el-table-column>-->
            <!--<el-table-column label="文书去向" width="110" align="center">-->
                <!--<template slot-scope="{row}">-->
                    <!--<span>{{ row.documentRoute }}</span>-->
                <!--</template>-->
            <!--</el-table-column>-->
            <el-table-column label="任务编号" prop="id" align="center" width="180">
                <template slot-scope="{row}">
                    <span>{{ row.taskNo }}</span>
                </template>
            </el-table-column>
            <el-table-column label="现勘号" prop="id" align="center" width="180">
                <template slot-scope="{row}">
                    <span>{{ row.evidenceNo }}</span>
                </template>
            </el-table-column>
            <el-table-column label="物证数量" align="center" min-width="100">
                <template slot-scope="{row}">
                    <span>{{ row.examNumber }}</span>
                </template>
            </el-table-column>
            <el-table-column label="来源" width="210" align="center">
                <template slot-scope="{row}">
                    <span>{{ row.fromStep }}</span>
                </template>
            </el-table-column>
            <el-table-column label="转移人" width="100" align="center">
                <template slot-scope="{row}">
                    <span>{{ row.fromName }}</span>
                </template>
            </el-table-column>
            <el-table-column label="接受人" width="210" align="center">
                <template slot-scope="{row}">
                    <span>{{ row.createName }}</span>
                </template>
            </el-table-column>

            <el-table-column label="转移时间" width="170" align="center">
                <template slot-scope="{row}">
                    <span>{{ row.createTime | parseTime('{y}-{m}-{d} {h}:{i}:{s}') }}</span>
                </template>
            </el-table-column>

            <el-table-column label="操作" align="center" fixed="right" width="230" class-name="small-padding fixed-width">
                <template slot-scope="{row}">
                    <router-link :to="'/material/batch/'+row.id">
                        <el-button v-waves type="primary" size="mini" style="width: 100px"  icon="el-icon-tickets">物证详情</el-button>
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
    .detail{
        margin-left: 20px;
        margin-top: 15px;
    }
</style>

<script>
    import {dnaList, fetchDna, createDna, updateDna} from '@/api/dna'
    import { batchList, batchMaterialList } from '@/api/common'
    import waves from '@/directive/waves' // waves directive
    import {parseTime} from '@/utils'
    import { fetchAdminMemberList} from '@/api/permissions'
    import {fetchList} from '@/api/dictionary'

    export default {
        name: 'fingerprint',
        directives: {waves},
        data() {
            return {
                tableKey: 0,
                list: null,
                pages: 0,
                listLoading: false,
                paginationShow: true,
                dialogDetail: false,
                detail: {},
                searchTime: [],
                limit: 20,
                listQuery: {
                    page: 1,
                    beginTime: undefined,
                    endTime: undefined,
                    bizName: '指纹送检',
                    evidenceNo: undefined,
                    fromName: undefined,
                    filters: undefined,
                },
                rules:{},
                downloadLoading: false,
                caseCategoryList: [],
                userList: [],
            }
        },
        created() {
            this.getList()
            this.getUserList();
            this.search('案件类别').then(response=>{
                this.caseCategoryList = this.processData(response.list)
            });
        },
        methods: {
            reset() {
                this.listQuery = {
                    page: 1,
                    beginTime: undefined,
                    endTime: undefined,
                    materialNo: undefined,
                    caseCategory: undefined,
                    evidenceNo: undefined,
                    taskNo: undefined,
                    examResult: undefined,
                    requestName: undefined,
                    dnaNo: undefined,
                };
                this.searchTime = '';
            },
            // celldblclick(val){
            //     this.detail = val;
            //     this.dialogDetail = true;
            // },
            countDict(val){
                if (val){
                    val = val.slice(-1)[0]
                    const send={
                        name:val
                    };
                    this.$store.dispatch('PostUserUseDict', send)
                }

            },
            getUserList() {
                fetchAdminMemberList({}).then(response => {
                    this.userList = response.list.map(data => {
                        return {
                            id: data.id,
                            title: data.realName,
                            py: data.pinyinAbbr
                        }
                    })
                    this.userShowList = this.userList
                })
            },
            getList() {
                this.listLoading = true;
                batchList(this.listQuery).then(response => {
                    this.list = response.list;
                    this.pages = response.pages

                    // Just to simulate the time of the request

                    this.listLoading = false
                })
            },
            handleFilter () {
                if (this.searchTime.length){
                    if (this.searchTime[0].toString().length>10)
                        this.listQuery.beginTime = this.searchTime[0]/1000;
                    if (this.searchTime[1].toString().length>10)
                        this.listQuery.endTime = this.searchTime[1]/1000;
                }
                this.listQuery.page = 1;
                this.getList()
            },

            search(parentName, filter = null) {
                return new Promise((resolve, reject) => {
                    const data = {
                        filter: filter,
                        parentName: parentName
                    }
                    resolve(fetchList(data))
                })
            },
            remoteSearch(node,value){
                var p =  /^[a-zA-Z]+$/;
                if (p.test(value)){
                    if (node.data.py.toLowerCase().indexOf(value.toLowerCase())>-1)
                        return true
                }else{
                    if (node.data.label.indexOf(value)>-1)
                        return true
                }
            },
            processData(data) {
                return data.map(item => {
                    var sendData = {
                        value: item.name,
                        label: item.name,
                        py: item.pinyinAbbr
                    }
                    if (item.children.length > 0) {
                        sendData.children = this.processData(item.children)
                    }

                    return sendData
                })
            },

        }
    }
</script>
