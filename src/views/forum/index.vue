<template>
    <div class="forum">
        <div style="margin-top: 20px;text-align: right">
            <router-link :to="'/forum/create/'" >
                <el-button type="success" size="small" style="padding: 10px 20px;width: 100px;font-size: 17px"><svg-icon icon-class="fatie" /> 发帖</el-button>
            </router-link>
        </div>


        <div class="forum-content">

            <el-tabs v-model="activeIndex" type="card" :before-leave="changeCategory">
                <el-tab-pane  label="全部" name="all"></el-tab-pane>
                <el-tab-pane v-for="item in category" :label="item.name" :name="item.id.toString()"></el-tab-pane>
            </el-tabs>

            <div class="forum-list">
                <ul style="padding-left: 0;margin-top: 0">
                    <li class="list"  v-for="list in lists" v-bind:key="list.id" >
                        <el-row :gutter="20">
                            <el-col :span="3">
                                <el-image class="headPic" fit="fill" :src="list.headPic"></el-image>
                            </el-col>
                            <el-col :span="15">
                                <span v-if="list.placeTop===2"  class="badge badge-danger">置顶</span>
                                <span v-if="list.recommend===2" class="badge badge-success">推荐</span>
                                <router-link :to="'/forum/detail/'+list.id" class="link-type">
                                    <el-link type="primary" style="font-size: 16px;"> {{ list.title }}</el-link>
                                </router-link>
                                <div class="digest">
                                    {{ list.digest }}
                                </div>
                            </el-col>
                            <el-col :span="6">
                                <div>
                                    <i class="el-icon-star-on" ></i>{{ list.favs }}
                                    <i class="el-icon-s-comment" style="padding-left: 10px"></i>{{ list.comments }}
                                    <i class="el-icon-view" style="padding-left: 10px"></i>{{ list.views }}
                                    <i class="el-icon-user-solid" style="padding-left: 10px"></i>{{ list.author }}
                                </div>
                                <div class="time">{{ list.createdTime | parseTime('{y}-{m}-{d} {h}:{i}:{s}')}}</div>
                            </el-col>
                        </el-row>

                    </li>
                </ul>
                <div class="list-page">
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

            </div>
        </div>

    </div>
</template>

<script>
    import { fetchAllCateList } from '@/api/category'
    import { fetchForumList,delForum } from '@/api/forum'
    import { parseTime } from '@/utils'

    export default {
        name: "forum",
        data(){
           return{
               activeIndex:'all',
               lists:[],
               category:[],
               listQuery: {
                   page: 1,
                   cateId: 0,
               },
               pages:0,
               paginationShow: true,
           }
        },
        created(){
            this.init()
            this.getList();
        },
        methods:{
            init(){
                fetchAllCateList().then(response=>{
                    this.category = response.list
                })
            },
            getList(){
                fetchForumList(this.listQuery).then(response=>{
                    this.lists = response.list;
                    this.pages = response.pages

                })
            },
            changeCategory(activeName, oldActiveName){
                if (activeName !== 'all'){
                    this.listQuery.cateId = activeName;
                }else{
                    this.listQuery.cateId = 0;
                }
                this.getList();
            },
            delForum(){

            }
        }
    }
</script>

<style scoped>
    .forum .list{
        padding: 15px;
        /*display: flex;*/
        color: grey!important;
        border: 1px solid #f2f2f2;
        list-style:none;
    }
    .forum .digest{
        font-size: 14px;
        margin-top: 10px;

    }
    .forum .headPic{
        width: 100px;
        height: 100px;
    }
    .forum .time{
        margin-top: 10px;
    }

    .align-items-center{
        -webkit-box-align: center!important;
        -ms-flex-align: center!important;
        align-items: center!important;
    }
    .align-items-justify {
        webkit-box-pack: justify!important;
        -ms-flex-pack: justify!important;
        justify-content: space-between!important;
    }
    .forum{
        position: relative;
        width: 1136px;
        padding: 0px 16px;
        margin: 0px auto;
        transition: all 0.15s ease-in 0s;
        min-height: 560px;
    }
    .forum .forum-search{
        margin-top: 30px;
        padding-left: 40px;


    }
    .forum .forum-content{
        margin-top: 5px;
        background-color:#ffffff;
    }



    .forum .avatar{
        margin-right: 15px;
    }
    .forum .badge{
        margin-right: 5px;
        display: inline-block;
        padding: .25em .4em;
        font-size: 75%;
        font-weight: 700;
        line-height: 1;
        text-align: center;
        white-space: nowrap;
        vertical-align: baseline;
        border-radius: .25rem;
        -webkit-transition: color .15s ease-in-out,background-color .15s ease-in-out,border-color .15s ease-in-out,-webkit-box-shadow .15s ease-in-out;
        transition: color .15s ease-in-out,background-color .15s ease-in-out,border-color .15s ease-in-out,box-shadow .15s ease-in-out,-webkit-box-shadow .15s ease-in-out;
    }
    .forum .badge-danger{
        color: #fff;
        background-color: #e3111a;
        -webkit-font-smoothing: antialiased;
    }
    .forum .badge-success{
        color: #fff;
        background-color: #00de51;
    }

    .forum .list-left{
        width: 70%;
        display: flex;

    }
    .forum .list-right{
        display: flex;
        margin-left: auto;
    }
    .forum .list-icon{
        padding: 7.5px;
        color: inherit;
        text-decoration: none;
        background-color: transparent;
    }
    .forum .list-time{
        color: #999;
        margin-left: 7.5px!important;
        display: flex;
        align-items: center;
    }
    .forum .list-page{
        padding: 15px;
        display: flex;
        justify-content: center;
    }



</style>
