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
            <el-table-column label="勘查号" align="center" >
                <template slot-scope="{row}">
                    <span>{{ row.evidenceNo }}</span>
                </template>
            </el-table-column>
            <el-table-column label="文件名"  align="center" >
                <template slot-scope="{row}">
                    <span>{{ row.fileName }}</span>
                </template>
            </el-table-column>


            <el-table-column label="操作" align="center" width="230" fixed="right" class-name="small-padding fixed-width">
                <template slot-scope="{row}">
                    <!--<router-link :to="'/material/detail/'+row.id">-->
                    <!--<el-button v-waves type="primary" size="mini" style="width: 100px"  icon="el-icon-tickets">物证详情</el-button>-->
                    <!--</router-link>-->
                    <!--<router-link :to="'/material/edit/'+row.id">-->
                    <!--<el-button v-waves type="primary" size="mini"  icon="el-icon-edit">编辑</el-button>-->
                    <!--</router-link>-->

                    <!--<el-button v-waves type="primary" style="width: 70px"  size="mini" @click="handleDelete(row)" >-->
                    <!--销毁申请-->
                    <!--</el-button>-->
                </template>
            </el-table-column>
        </el-table>
        <el-pagination
                background
                layout="prev, pager, next"
                :page-count="pages"
                :current-page.sync="page"
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
    import {sanluList} from '@/api/material'
    import { batchList, batchMaterialList } from '@/api/common'
    import waves from '@/directive/waves' // waves directive
    import {parseTime} from '@/utils'
    import { fetchAdminMemberList} from '@/api/permissions'


    export default {
        name: 'sanlu',
        directives: {waves},
        data() {
            return {
                tableKey: 0,
                list: null,
                pages: 0,
                listLoading: false,
                paginationShow: true,
                page: 0,
                curId:undefined

            }
        },
        created(){
            const id = this.$route.params && this.$route.params.id;
            this.curId = id;
            this.getList()
        },
        methods: {
            getList() {
                const  data={
                    page:this.page,
                }
                this.listLoading = true;
                sanluList(data,this.curId).then(response => {
                    this.list = response.list;
                    this.pages = response.pages;

                    // Just to simulate the time of the request

                    this.listLoading = false

                })
            },


        }
    }
</script>
