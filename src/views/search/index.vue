<template>
    <div  class="app-container">
        <div class="filter-container">
            <div><el-date-picker
                    v-model="searchTime"
                    type="datetimerange"
                    range-separator="至"
                    start-placeholder="开始时间"
                    end-placeholder="结束时间"
            />
                <el-input v-model="listQuery.caseNo" placeholder="案件编号" style="width: 200px;margin-left: 5px"
                          @keyup.enter.native="handleFilter"/>
                <el-input v-model="listQuery.caseId" placeholder="案件ID" style="width: 200px;"
                          @keyup.enter.native="handleFilter"/>
                <el-cascader
                        :options="caseTypeList"
                        filterable
                        @change="countDict"
                        v-model="listQuery.caseType"
                        :filter-method="remoteSearch"
                        :show-all-levels="false"
                        placeholder="案件类别"
                        style="width: 200px;">
                </el-cascader>
                <el-input v-model="listQuery.chargerUid" placeholder="主办人" style="width: 200px;"
                          @keyup.enter.native="handleFilter"/>
                <el-select
                        v-model="listQuery.status"
                        placeholder="状态"
                        center
                >
                    <el-option
                            v-for="item in statusList"
                            :key="item.id"
                            :label="item.title"
                            :value="item.id"/>
                </el-select>
                <el-button v-waves type="primary" icon="el-icon-search" @click="handleFilter">
                    搜索
                </el-button>
                <router-link :to="'/search/create-search/'">
                    <el-button type="primary" icon="el-icon-edit">添加</el-button>
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
            <el-table-column label="勘查号" prop="id" align="center" width="120">
                <template slot-scope="{row}">
                    <span>{{ row.selfEvidenceNo }}</span>
                </template>
            </el-table-column>
            <el-table-column label="案件性质" align="center">
                <template slot-scope="{row}">
                    <span>{{ row.caseCategory }}</span>
                </template>
            </el-table-column>
            <el-table-column label="发案地址" align="center">
                <template slot-scope="{row}">
                    <span>{{ row.caseAddress }}</span>
                </template>
            </el-table-column>

            <el-table-column label="发案日期"  align="center" width="100">
                <template slot-scope="{row}">
                    <span>{{ row.examBeginTime | parseTime('{y}-{m}-{d}') }}</span>
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

            <el-table-column label="是否死亡" align="center" width="80">
                <template slot-scope="{row}">
                    <span>{{ row.isDeathCase?'是':'否' }}</span>
                </template>
            </el-table-column>
            <el-table-column label="状态" align="center" width="150">
                <template slot-scope="{row}">
                    <span>{{ row.status | statusFilter }}</span>
                </template>
            </el-table-column>

            <el-table-column label="操作" align="center" fixed="right" width="200" class-name="small-padding fixed-width">
                <template slot-scope="{row}">
                    <router-link :to="'/search/update-search/'+row.id">
                        <el-button type="primary" size="mini" >编辑</el-button>
                    </router-link>
                    <!--<el-button type="primary" size="mini" @click="handleUpdate(row)">-->
                        <!--编辑-->
                    <!--</el-button>-->
                    <router-link :to="'/search/show-search/'+row.id">
                        <el-button type="success" size="mini" >查看</el-button>
                    </router-link>
                    <!--<el-button size="mini" type="success">-->
                        <!--查看-->
                    <!--</el-button>-->
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
        >
        </el-pagination>



    </div>
</template>

<script>
    import {searchList} from '@/api/search'
    import waves from '@/directive/waves' // waves directive
    import {fetchList} from '@/api/dictionary'
    import {parseTime} from '@/utils'

    const statusMap =[
        {
            id:0,
            title:'全部'
        },
        {
            id:1,
            title:'未领取'
        },{
            id:2,
            title:'进行中'
        },{
            id:3,
            title:'已完成'
        },
    ];

    export default {
        name: "Search",

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
                tableKey: 0,
                list: null,
                pages: 0,
                listLoading: true,
                paginationShow: true,
                searchTime: '',
                limit: 20,
                listQuery: {
                    page: 1,
                    caseNo: undefined,
                    caseId: undefined,
                    caseType: undefined,
                    chargerUid: undefined,
                    beginTime: undefined,
                    endTime: undefined,
                    status: 0,
                },
                caseTypeList:[],
                statusList: statusMap,
                calendarTypeOptions:{},

            }
        },
        created() {
            this.getList()
            this.search('案件类别').then(response=>{
                this.caseTypeList = this.processData(response.list)
            });
        },
        methods: {
            countDict(val){
                val = val.slice(-1)[0]
                const send={
                    name:val
                };
                this.$store.dispatch('PostUserUseDict', send)
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


        }
    }
</script>

<style scoped>

</style>