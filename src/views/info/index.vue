<template>
    <div class="app-container">
        <div class="filter-container">
            <el-date-picker
                    v-model="searchTime"
                    type="datetimerange"
                    range-separator="至"
                    start-placeholder="开始时间"
                    end-placeholder="结束时间"
                    value-format="timestamp"
            />

            <el-cascader
                    :options="sceneTypeList"
                    v-model="listQuery.sceneType"
                    :filter-method="filterSearch"
                    :show-all-levels="false"
                    @change="countDict"
                    filterable
                    placeholder="处所"
                    :props="{ checkStrictly: true,emitPath:false }"
                    style="width: 200px;"/>
            <el-cascader
                    :options="crimeTimeList"
                    v-model="listQuery.crimeTime"
                    :filter-method="filterSearch"
                    :show-all-levels="false"
                    @change="countDict"
                    filterable
                    placeholder="作案时机"
                    :props="{ checkStrictly: true,emitPath:false }"
                    style="width: 200px"/>
            <el-cascader
                    :options="caseHappenRegionList"
                    v-model="listQuery.caseHappenRegion"
                    :filter-method="filterSearch"
                    :show-all-levels="false"
                    @change="countDict"
                    filterable
                    placeholder="发案区划"
                    :props="{ checkStrictly: true,emitPath:false }"
                    style="width: 200px"
            />
            <el-cascader
                    :options="invadeTypeList"
                    v-model="listQuery.invadeType"
                    :filter-method="filterSearch"
                    :show-all-levels="false"
                    @change="countDict"
                    filterable
                    placeholder="侵入方式"
                    :props="{ checkStrictly: true,emitPath:false }"
                    style="width: 200px"/>
            <div style="margin-top: 20px">
                <el-cascader
                        :options="escapeTypeList"
                        v-model="listQuery.escapeType"
                        :filter-method="filterSearch"
                        :show-all-levels="false"
                        @change="countDict"
                        placeholder="作案出口"
                        filterable
                        :props="{ checkStrictly: true,emitPath:false }"
                        style="width: 200px"/>
                <el-select v-model="listQuery.crimePeoples" placeholder="作案人数" center style="width: 200px">
                    <el-option
                            v-for="item in crimePeoplesType"
                            :key="item.id"
                            :label="item.title"
                            :value="item.id"/>
                </el-select>
                <el-input v-model="listQuery.crimeTools" placeholder="作案工具" class="mb10" style="width: 200px;"
                          @keyup.enter.native="handleFilter"/>
                <el-input v-model="listQuery.suspectName" placeholder="嫌疑人" class="mb10" style="width: 200px;"
                          @keyup.enter.native="handleFilter"/>
                <el-input v-model="listQuery.filters" placeholder="关键字" class="mb10" style="width: 200px;"
                          @keyup.enter.native="handleFilter"/>

                <el-button v-waves type="primary" icon="el-icon-search" @click="reset"
                           style="float: right;margin-right: 20px">
                    清空搜索条件
                </el-button>
                <el-button v-waves type="primary" icon="el-icon-search" @click="handleFilter" style="float: right;margin-right: 20px">
                    搜索
                </el-button>
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
            <el-table-column label="勘查号" prop="id" align="center" width="220">
                <template slot-scope="{row}">
                    <span>{{ row.selfEvidenceNo }}</span>
                </template>
            </el-table-column>
            <el-table-column label="案件类别" width="150" align="center">
                <template slot-scope="{row}">
                    <span>{{ row.caseCategory }}</span>
                </template>
            </el-table-column>
            <el-table-column label="发案日期" width="150" align="center">
                <template slot-scope="{row}">
                    <span>{{ row.caseHappenTime | parseTime('{y}-{m}-{d} {h}:{i}:{s}') }}</span>
                </template>
            </el-table-column>
            <el-table-column label="处所" width="150" align="center">
                <template slot-scope="{row}">
                    <span>{{ row.sceneType }}</span>
                </template>
            </el-table-column>
            <el-table-column label="作案区划" width="110" align="center">
                <template slot-scope="{row}">
                    <span>{{ row.caseAddress }}</span>
                </template>
            </el-table-column>
            <el-table-column label="侵入方式" width="210" align="center">
                <template slot-scope="{row}">
                    <span>{{ row.invadeType }}</span>
                </template>
            </el-table-column>
            <el-table-column label="作案出口" width="110" align="center">
                <template slot-scope="{row}">
                    <span>{{ row.escapeType }}</span>
                </template>
            </el-table-column>
            <el-table-column label="作案人数" width="110" align="center">
                <template slot-scope="{row}">
                    <span>{{ row.crimePeoples }}</span>
                </template>
            </el-table-column>
            <el-table-column label="作案工具" width="210" align="center">
                <template slot-scope="{row}">
                    <span>{{ row.crimeTools }}</span>
                </template>
            </el-table-column>
            <el-table-column label="主办" width="110" align="center">
                <template slot-scope="{row}">
                    <span>{{ row.mainChargerName }}</span>
                </template>
            </el-table-column>

            <el-table-column label="操作" fixed="right" align="center" width="230" class-name="small-padding fixed-width">
                <template slot-scope="{row}">
                    <!--<router-link :to="'/alarm/edit-alarm/'+row.id">-->
                        <!--<el-button v-waves type="primary" size="mini" icon="el-icon-edit">编辑</el-button>-->
                    <!--</router-link>-->

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
    import { filterEvidence } from '@/api/info'
    import { fetchAdminMemberList } from '@/api/permissions'
    import waves from '@/directive/waves' // waves directive
    import {fetchList} from '@/api/dictionary'

    export default {
        name: 'Dna',
        directives: {waves},
        data() {
            return {
                tableKey: 0,
                list: null,
                pages: 0,
                listLoading: false,
                paginationShow: true,
                searchTime: '',
                limit: 20,
                listQuery: {
                    page: 1,
                    sceneType: undefined,
                    crimeTime: undefined,
                    caseHappenRegion: undefined,
                    invadeType: undefined,
                    escapeType: undefined,
                    crimePeoples: undefined,
                    crimeTools: undefined,
                    suspectName: undefined,
                    filters: undefined,
                    beginTime: undefined,
                    endTime: undefined,
                    status: 4,
                },
                rules: {},
                downloadLoading: false,
                caseHappenRegionList: [],
                sceneTypeList: [],
                crimeTimeList: [],
                invadeTypeList: [],
                escapeTypeList: [],
                crimePeoplesType: [
                    {
                        id: 0,
                        title: '不确定'
                    }, {
                        id: 1,
                        title: '1人'
                    }, {
                        id: 2,
                        title: '两个'
                    }, {
                        id: 3,
                        title: '多人'
                    }
                ],
            }
        },
        created() {
            this.getList()

            this.search('行政区划').then(data => {
                this.caseHappenRegionList = this.processData(data.list)
            })
            this.search('作案选择处所').then(data => {
                this.sceneTypeList = this.processData(data.list)
            })
            this.search('作案时机').then(data => {
                this.crimeTimeList = this.processData(data.list)
            })
            this.search('侵入方式').then(data => {
                this.invadeTypeList = this.processData(data.list)
            })
            this.search('作案出口').then(data => {
                this.escapeTypeList = this.processData(data.list)
            })
        },
        methods: {
            reset() {
                this.listQuery = {
                    page: 1,
                    sceneType: undefined,
                    crimeTime: undefined,
                    caseHappenRegion: undefined,
                    invadeType: undefined,
                    escapeType: undefined,
                    crimePeoples: undefined,
                    crimeTools: undefined,
                    suspectName: undefined,
                    filters: undefined,
                    beginTime: undefined,
                    endTime: undefined,
                    status: 4,
                };
                this.searchTime = '';
            },
            countDict(val){
                if (val){
                    val = val.slice(-1)[0]
                    const send={
                        name:val
                    };
                    this.$store.dispatch('PostUserUseDict', send)
                }

            },
            getList() {
                this.listLoading = true;
                filterEvidence(this.listQuery).then(response => {
                    this.list = response.list;
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
                        if (this.list.escapeType){
                            if (JSON.parse(res.escapeType).constructor === Array){
                                res.escapeType = JSON.parse(res.escapeType).join(' ')
                            }
                        }
                    })
                    this.pages = response.pages

                    // Just to simulate the time of the request
                    this.listLoading = false

                })
            },
            handleFilter() {
                if (this.searchTime) {
                    if (this.searchTime[0].toString().length > 10)
                        this.listQuery.beginTime = this.searchTime[0] / 1000;
                    if (this.searchTime[1].toString().length > 10)
                        this.listQuery.endTime = this.searchTime[1] / 1000;
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
            filterSearch(node, value) {
                var p = /^[a-zA-Z]+$/
                if (p.test(value)) {
                    if (node.data.py.toLowerCase().indexOf(value.toLowerCase()) > -1) { return true }
                } else {
                    if (node.data.label.indexOf(value) > -1) { return true }
                }
            },
            filterUserSearch(value) {
                if (value) {
                    this.userShowList = this.userList.filter(data => {
                        var p = /^[a-zA-Z]+$/
                        if (p.test(value)) {
                            if (data.py.toLowerCase().indexOf(value.toLowerCase()) > -1) { return data }
                        } else {
                            if (data.title.indexOf(value) > -1) { return data }
                        }
                    })
                } else {
                    this.userShowList = this.userList
                }
            },



        }
    }
</script>
