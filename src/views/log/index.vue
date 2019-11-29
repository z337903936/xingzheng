<template>
    <div class="app-container">
        <div class="filter-container">
            <div><el-date-picker
                    v-model="searchTime"
                    type="datetimerange"
                    range-separator="至"
                    start-placeholder="开始时间"
                    end-placeholder="结束时间"
                    value-format="timestamp"
            />
                <!--<el-input v-model="listQuery.adminId" placeholder="操作人" class="mb10" style="width: 200px;"/>-->
                <el-select v-model="listQuery.adminId"
                           placeholder="操作人"
                           filterable
                           :filter-method="filterUserSearch"
                           @visible-change="restUserSearch"
                           class=" mb10"
                          >
                    <el-option
                            v-for="item in userShowList"
                            :key="item.id"
                            :label="item.title"
                            :value="item.id"/>
                </el-select>
                <el-button v-waves type="primary" icon="el-icon-search" @click="handleFilter">
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
            <el-table-column label="操作人" prop="id" align="center" width="100" >
                <template slot-scope="{row}">
                    <span>{{ row.adminName }}</span>
                </template>
            </el-table-column>
            <el-table-column label="IP" width="120" align="center">
                <template slot-scope="{row}" >
                    <span>{{ row.ip }}</span>
                </template>
            </el-table-column>
            <el-table-column label="ip地址" width="120"  align="center">
                <template slot-scope="{row}">
                    <span>{{ row.place }}</span>
                </template>
            </el-table-column>
            <el-table-column label="操作说明" align="center">
                <template slot-scope="{row}">

                    <span>{{ row.note }}</span>
                </template>
            </el-table-column>
            <el-table-column label="操作时间" width="160"  align="center">
                <template slot-scope="{row}">
                    <span>{{ row.createTime | parseTime('{y}-{m}-{d} {h}:{i}:{s}') }}</span>
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

<style>
    .mb10 {
        margin-bottom: 10px;
    }
</style>

<script>
    import {logList} from '@/api/log'
    import waves from '@/directive/waves' // waves directive
    import {fetchAdminMemberList} from '@/api/permissions'

    export default {
        name: 'Medical',
        directives: {waves},
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
                    beginTime: undefined,
                    endTime: undefined,
                    adminId: undefined,

                },
                rules:{},
                userList: [],
                userShowList: [],

            }
        },
        created() {
            this.getList()
            this.getUserList()
        },
        methods: {
            getList() {
                this.listLoading = true;
                logList(this.listQuery).then(response => {
                    this.list = response.list;
                    this.pages = response.pages

                    // Just to simulate the time of the request
                    setTimeout(() => {
                        this.listLoading = false
                    },1000)
                })
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
            handleFilter () {
                if (this.searchTime){
                    if (this.searchTime[0].toString().length>10)
                        this.listQuery.beginTime = this.searchTime[0]/1000;
                    if (this.searchTime[1].toString().length>10)
                        this.listQuery.endTime = this.searchTime[1]/1000;
                }
                this.listQuery.page = 1;
                console.log()
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
            
        }
    }
</script>
