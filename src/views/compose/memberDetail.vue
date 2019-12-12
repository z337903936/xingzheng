<template>
    <div  class="app-container">
        <div class="filter-container">
            <div><el-date-picker
                    v-model="searchTime"
                    type="datetimerange"
                    range-separator="至"
                    start-placeholder="开始时间"
                    end-placeholder="结束时间"
                    style="width: 405px;"
            />

                <el-cascader
                        :options="caseTypeList"
                        v-model="listQuery.caseCategory"
                        :filter-method="filterSearch"
                        :show-all-levels="false"
                        placeholder="案件类别"
                        @change="countDict($event,'案件类别')"
                        filterable
                        style="width: 200px"
                        :props="emitProps"
                />
                <el-cascader
                        :options="caseHappenRegionList"
                        v-model="listQuery.caseHappenRegion"
                        :filter-method="filterSearch"
                        :show-all-levels="false"
                        placeholder="案发区划"
                        @change="countDict($event,'行政区划')"
                        :props="emitProps"
                        filterable
                        style="width: 200px"
                />
                <div style="margin-top: 15px">
                    <el-select
                            v-model="listQuery.mainChargerName"
                            :filter-method="filterUserSearch"
                            filterable
                            placeholder="主办人"
                            center
                            @visible-change="restUserSearch">
                        <el-option
                                v-for="item in userShowList"
                                :key="item.id"
                                :label="item.title"
                                :value="item.id"/>
                    </el-select>
                    <el-select
                            v-model="listQuery.supporterName"
                            :filter-method="filterUserSearch"
                            filterable
                            placeholder="协办人"
                            center
                            @visible-change="restUserSearch">
                        <el-option
                                v-for="item in userShowList"
                                :key="item.id"
                                :label="item.title"
                                :value="item.id"/>
                    </el-select>
                    <el-input v-model="listQuery.filters" placeholder="关键字" style="width: 200px;"
                              @keyup.enter.native="handleFilter"/>
                    <el-button v-waves type="primary" icon="el-icon-refresh" @click="reset"
                               style="float: right;margin-right: 20px">
                        清空搜索条件
                    </el-button>
                    <el-button v-waves type="primary" icon="el-icon-search" @click="handleFilter"  style="float: right;margin-right: 20px">
                        搜索
                    </el-button>
                    <el-button v-waves type="primary"  @click="handleApply"
                               style="float: right;margin-right: 20px;">
                        <svg-icon icon-class="jichuguanli" /> 保存
                    </el-button>
                </div>

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
                @selection-change="selectTask"
                style="width: 100%;"
        >
            <el-table-column
                    v-model="taskId"
                    type="selection"
                    width="55"/>
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
            <el-table-column label="发案区划" align="center">
                <template slot-scope="{row}">
                    <span>{{ row.caseHappenRegion }}</span>
                </template>
            </el-table-column>
            <el-table-column label="主办" align="center" width="100">
                <template slot-scope="{row}">
                    <span>{{ row.mainChargerName }}</span>
                </template>
            </el-table-column>
            <el-table-column label="协办" align="center" width="150">
                <template slot-scope="{row}">
                    <span>{{ row.supporterName }}</span>
                </template>
            </el-table-column>
            <el-table-column label="法医" align="center" width="100">
                <template slot-scope="{row}">
                    <span>{{ row.medicalName }}</span>
                </template>
            </el-table-column>
            <el-table-column label="案件性质" align="center">
                <template slot-scope="{row}">
                    <span>{{ row.caseCategory }}</span>
                </template>
            </el-table-column>
            <el-table-column label="是否死亡" align="center" width="80">
                <template slot-scope="{row}">
                    <span>{{ row.isDeathCase?'是':'否' }}</span>
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
                :page-count="pages"
                :current-page.sync="listQuery.page"
                @current-change="getList"
                @size-change="getList"
                :hide-on-single-page="paginationShow"
                style="float: right;margin-top: 15px"
        >
        </el-pagination>
        <el-dialog title="串并申请" :close-on-click-modal="false" :visible.sync="dialogFormVisible" width="30%">
            <el-form
                    ref="dataForm"
                    :rules="rules"
                    :model="applyData"
                    label-position="left"
                    label-width="70px"
                    style="width: 70%; margin-left:50px;">

                <el-form-item label="串并依据" prop="path">
                    <el-input v-model="applyData.preConditions"/>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogFormVisible = false">
                    取 消
                </el-button>
                <el-button type="primary" @click="applyCompose()">
                    确 定
                </el-button>
            </div>
        </el-dialog>


    </div>
</template>

<script>
    import {searchList} from '@/api/search'
    import waves from '@/directive/waves' // waves directive
    import {fetchList} from '@/api/dictionary'
    import {parseTime} from '@/utils'
    import {fetchAdminMemberList} from '@/api/permissions'


    export default {
        name: "composeForm",
        props: {
            isEdit: {
                type: Boolean,
                default: false
            }
        },
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
                emitProps: {
                    emitPath: false
                },
                tableKey: 0,
                list: null,
                pages: 0,
                listLoading: true,
                paginationShow: true,
                searchTime: '',
                limit: 20,
                listQuery: {
                    page: 1,
                    caseHappenRegion: undefined,
                    caseCategory: undefined,
                    mainChargerName: undefined,
                    supporterName: undefined,
                    beginTime: undefined,
                    endTime: undefined,
                    filters: undefined,
                    status: 0,
                },
                caseTypeList:[],
                userShowList: [],
                caseHappenRegionList:[],
                calendarTypeOptions:{},
                taskId: [],
                dialogFormVisible: false,
                applyData:{
                    preConditions:'',
                    list:[],
                },
            }
        },
        created() {
            this.getList()
            this.getUserList()
            this.search('案件类别').then(response=>{
                this.caseTypeList = this.processData(response.list)
            });
            this.search('行政区划').then(data => {
                this.caseHappenRegionList = this.processData(data.list)
            })
        },
        methods: {
            handleApply(){
                if (this.taskId.length===0){
                    this.$confirm('请选择串并数据!')
                        .then(_ => {
                        })
                        .catch(_ => {});
                } else{
                    if (this.isEdit) {

                    }else{
                        this.dialogFormVisible = true;
                    }

                }
            },
            applyCompose(){
                if (this.isEdit) {

                }else{
                    this.applyData.list =  this.taskId
                    applyCompose(this.applyData).then(response=>{
                        if (response.code === 200) {
                            this.$message({
                                message: '操作成功',
                                type: 'success',
                                showClose: true,
                                duration: 2000
                            })
                            this.dialogFormVisible = false;
                            this.getList(this.curId)
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
            selectTask(selection) {
                this.taskId = selection.map(data => {
                    return data.id
                })
            },
            reset() {
                this.listQuery = {
                    page: 1,
                    caseHappenRegion: undefined,
                    caseCategory: undefined,
                    mainChargerName: undefined,
                    supporterName: undefined,
                    beginTime: undefined,
                    endTime: undefined,
                    filters: undefined,
                    status: 0,
                };
                this.searchTime = '';
            },
            countDict(val,type){
                if (val) {
                    if (val.constructor === Array){
                        val.map(data=>{
                            const send={
                                name:data,
                                cateName:type
                            };
                            this.$store.dispatch('PostUserUseDict', send)
                        })
                    }else{
                        const send={
                            name:val,
                            cateName:type
                        };
                        this.$store.dispatch('PostUserUseDict', send)
                    }
                }
            },
            getList() {
                this.listLoading = true;
                searchList(this.listQuery).then(response => {
                    this.list = response.list;
                    this.pages = response.pages;

                    // Just to simulate the time of the request

                    this.listLoading = false

                })
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
            handleFilter () {
                this.listQuery.page = 1
                this.getList()
            },
            search(parentName,filter=null){
                return new Promise((resolve, reject) => {
                    const data = {
                        filter:filter,
                        parentName:parentName
                    };
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
            filterSearch(node, value) {
                var p = /^[a-zA-Z]+$/
                if (p.test(value)) {
                    if (node.data.py.toLowerCase().indexOf(value.toLowerCase()) > -1) {
                        return true
                    }
                } else {
                    if (node.data.label.indexOf(value) > -1) {
                        return true
                    }
                }
            },
            processData(data){
                return data.map(item=>{
                    var sendData = {
                        value:item.name,
                        label:item.name,
                        py:item.pinyinAbbr,
                    }
                    if (item.children.length >0){
                        sendData.children = this.processData(item.children);
                    }

                    return sendData;
                })
            },
            filterUserSearch(value) {
                if (value) {
                    this.userShowList = this.userList.filter(data => {
                        var p = /^[a-zA-Z]+$/
                        if (p.test(value)) {
                            if (data.py.toLowerCase().indexOf(value.toLowerCase()) > -1) {
                                return data
                            }
                        } else {
                            if (data.title.indexOf(value) > -1) {
                                return data
                            }
                        }
                    })
                } else {
                    this.userShowList = this.userList
                }
            },
            restUserSearch(change) {
                if (!change) {
                    this.userShowList = this.userList
                }
            },


        }
    }
</script>

<style scoped>

</style>
