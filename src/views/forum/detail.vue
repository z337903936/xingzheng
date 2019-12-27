<template>
    <div class="forum" @click="replyShow=false;currentShow=undefined">
        <h2>{{ detail.title }}</h2>
        <div style="display: flex">
            <div>{{ detail.createdTime | parseTime('{y}-{m}-{d} {h}:{i}:{s}') }}</div>
            <div style="margin-left: 20px">{{ detail.author  }}</div>
            <div style="margin-left: 20px">
                <el-button type="text" style="padding: 0;" v-if="!detail.isFav" @click="fav(detail,!detail.isFav)">
                    <i class="el-icon-star-off"  />收藏
                </el-button>
                <el-button type="text" style="padding: 0;" v-if="detail.isFav" @click="fav(detail,!detail.isFav)">
                    <i class="el-icon-star-on" />已收藏
                </el-button>
            </div>
        </div>
        <p class="article" v-html="detail.content">
        </p>


        <div style="margin-top: 66px">
            <el-divider content-position="center">评论区</el-divider>
            <div class="comment">
                <el-avatar :size="30" icon="el-icon-user-solid" style="margin-right: 10px"></el-avatar>
                <div class="form-box">
                    <el-input
                            type="textarea"
                            autosize
                            placeholder="输入评论..."
                            v-model="commentDetail.content"
                    >
                    </el-input>
                    <div class="comment-action">
                        <div class="submit">
                            <el-button class="submit-button" type="primary"  :disabled="isUse" @click="comment">评论</el-button>
                        </div>
                    </div>
                </div>
            </div>

            <div class="comment-list">
                <div v-for="row in commentList">
                    <el-row :gutter="20">
                        <el-col :span="2">
                            <el-avatar :size="50"  :src="row.avatar" style="margin-left: 20px"></el-avatar>
                        </el-col>
                        <el-col :span="22">
                            <div >
                                <div>{{ row.userName }}</div>
                                <div class="comment-list-content">{{ row.content }}</div>
                                <div style="color: #8a93a0;margin: 1rem 0;">
                                    <el-row :gutter="20">
                                        <el-col :span="20">
                                            {{ row.createdTime | parseTime('{y}-{m}-{d} {h}:{i}:{s}') }}
                                        </el-col>
                                        <el-col :span="4">
                                            <div style="display: flex;justify-content:space-between;">
                                                <div>
                                                    <el-button type="text" style="padding: 0;color: #8a93a0;" :class="{'active':row.hasLike}"  @click="like(row,!row.hasLike)">
                                                        <svg-icon icon-class="dianzan"  v-if="!row.hasLike" />
                                                        <svg-icon icon-class="dianzansuccess" v-if="row.hasLike" />
                                                    </el-button>
                                                    {{ row.likes }}
                                                </div>
                                                <div>
                                                    <el-button type="text" style="padding: 0 10px 0 0;color: #8a93a0;" @click.stop="replyAction(row)"><i class="el-icon-chat-dot-square"></i>回复</el-button>
                                                </div>
                                            </div>
                                        </el-col>
                                    </el-row>
                                </div>
                            </div>
                            <div class="reply" v-if="commentJudg(row.id)" @click.stop>
                                <div class="form-box">
                                    <el-input
                                            type="textarea"
                                            autosize
                                            placeholder="输入评论..."
                                            v-model="replyDetail.content"
                                    ></el-input>
                                    <div class="comment-action">
                                        <div class="submit">
                                            <el-button class="submit-button" type="primary" :disabled="replyDetail.content.length===0" @click="reply">评论</el-button>
                                        </div>
                                    </div>
                                </div>

                            </div>
                            <div class="sub-commment-list">
                                <div class="item" v-for="item in row.replyList">
                                    <div class="sub-comment">
                                        <el-row :gutter="20">
                                            <el-col :span="2">
                                                <el-avatar :size="50"  :src="item.avatar" style="margin-left: 20px"></el-avatar>
                                            </el-col>
                                            <el-col :span="22">
                                                <div >
                                                    <div>{{ item.userName }}</div>
                                                    <div class="comment-list-content">回复<span style="color: #406599;">{{ item.atUserName  }}</span>:{{ item.content }}</div>
                                                    <div style="color: #8a93a0;margin: 1rem 0;">
                                                        <el-row :gutter="20">
                                                            <el-col :span="20">
                                                                {{ item.createdTime | parseTime('{y}-{m}-{d} {h}:{i}:{s}') }}
                                                            </el-col>
                                                            <!--<el-col :span="4">-->
                                                                <!--<div style="display: flex;justify-content:space-between;">-->
                                                                    <!--<div>-->
                                                                        <!--<el-button type="text" style="padding: 0;color: #8a93a0;">-->
                                                                            <!--<i class="el-icon-thumb"></i>-->
                                                                        <!--</el-button>-->
                                                                    <!--</div>-->
                                                                    <!--<div>-->
                                                                        <!--<el-button type="text" style="padding: 0 10px 0 0;color: #8a93a0;" @click.stop="subReplyAction(item)"><i class="el-icon-chat-dot-square"></i>回复</el-button>-->
                                                                    <!--</div>-->
                                                                <!--</div>-->
                                                            <!--</el-col>-->
                                                        </el-row>
                                                    </div>
                                                </div>
                                                <!--<div class="reply" v-if="subJudg(item.id)" @click.stop>-->
                                                    <!--<div class="form-box">-->
                                                        <!--<el-input-->
                                                                <!--type="textarea"-->
                                                                <!--autosize-->
                                                                <!--placeholder="输入评论..."-->
                                                                <!--v-model="replyDetail.content"-->
                                                        <!--&gt;</el-input>-->
                                                        <!--<div class="comment-action">-->
                                                            <!--<div class="submit">-->
                                                                <!--<el-button class="submit-button" type="primary" :disabled="replyDetail.content.length===0" @click="reply">评论</el-button>-->
                                                            <!--</div>-->
                                                        <!--</div>-->
                                                    <!--</div>-->

                                                <!--</div>-->
                                            </el-col>
                                        </el-row>
                                    </div>
                                </div>
                            </div>

                        </el-col>
                    </el-row>

                    <el-divider></el-divider>
                </div>
            </div>
        </div>

    </div>
</template>

<script>
    import {fetchForum,fetchForumCommentsList,commentAction,commentLikeAction,commentReplyAction,favForum} from '@/api/forum'
    import {parseTime} from '@/utils'
    export default {
        name: "forumDetail",
        data(){
            return{
                detail:{},
                commentList:[],
                commentDetail:{
                    content:'',
                    articleId:undefined,
                    atUid:undefined,
                },
                replyDetail:{
                    content:'',
                    commentId:undefined,
                    atUid:undefined,
                },
                articleId:undefined,
                replyShow:false,
                currentSubShow:undefined,
                currentShow:undefined,
                isUse:true,
            }
        },
        watch:{
            "commentDetail.content":{
                handler(newData, oldData) {
                    if (newData.length > 0) {
                        this.isUse = false
                    } else {
                        this.isUse = true
                    }
                },
                deep: true,
            }
        },
        created(){
            const id = this.$route.params && this.$route.params.id;
            this.getDetail(id);
            this.commentDetail.articleId = id;
            this.articleId = id;

        },
        methods:{
            commentJudg(row){
                if (row === this.currentShow)
                    return true
            },
            subJudg(row){
                if (row === this.currentSubShow)
                    return true
            },
            subReplyAction(data){
                this.replyDetail.atUid= data.uid
                this.replyDetail.commentId= data.id
                this.currentSubShow =  data.id;
            },
            replyAction(data){
                this.replyDetail.atUid= data.uid
                this.replyDetail.commentId= data.id
                this.replyShow = true;
                this.currentShow =  data.id;
            },
            reset(){
                this.replyShow=false;
                this.currentShow=undefined ;
                this.currentSubShow=undefined ;
                this.getDetail(this.articleId);
                this.commentDetail.content = '';
                this.replyDetail.content = '';
            },
            reply(){
                commentReplyAction(this.replyDetail).then(res=>{
                    if (res.code === 200) {
                        this.$message({
                            message: '评论成功',
                            type: 'success',
                            showClose: true,
                            duration: 1000
                        })
                       this.reset()

                    } else {
                        this.$message({
                            message: res.reason,
                            type: 'error',
                            showClose: true,
                            duration: 1000
                        })
                    }
                })
            },
            fav(val,type){
                const data={
                    articleId:val.id,
                    enable:type,
                }
                var content = '收藏成功'
                if (!type) {
                    content = '已取消收藏'
                }
                favForum(data).then(res=>{
                    if (res.code === 200) {
                        this.$message({
                            message: content,
                            type: 'success',
                            showClose: true,
                            duration: 1000
                        })
                        this.reset()

                    } else {
                        this.$message({
                            message: res.reason,
                            type: 'error',
                            showClose: true,
                            duration: 1000
                        })
                    }
                })
            },
            like(val,type){
                const data={
                    commentId:val.id,
                    hasLike:type,
                }
                var content = '点赞成功'
                if (!type) {
                    content = '已取消点赞'
                }
                commentLikeAction(data).then(res=>{
                    if (res.code === 200) {
                        this.$message({
                            message: content,
                            type: 'success',
                            showClose: true,
                            duration: 1000
                        })
                        this.reset()

                    } else {
                        this.$message({
                            message: res.reason,
                            type: 'error',
                            showClose: true,
                            duration: 1000
                        })
                    }
                })
            },
            getDetail(id){
                fetchForum(id).then(response=>{
                    this.detail = response;
                })
                const data={
                    articleId:id,
                    page:1
                }
                fetchForumCommentsList(data).then(res=>{
                    this.commentList = res.list
                })
            },
            comment(){
                commentAction(this.commentDetail).then(res=>{
                    if (res.code === 200) {
                        this.$message({
                            message: '评论成功',
                            type: 'success',
                            showClose: true,
                            duration: 1000
                        })
                        this.reset()

                    } else {
                        this.$message({
                            message: res.reason,
                            type: 'error',
                            showClose: true,
                            duration: 1000
                        })
                    }
                })
            }


        }
    }
</script>

<style scoped>
    .article{
        font-size:16px;/*字体大小*/
        text-indent:2em;/*首行缩进两个单位*/
        line-height:1.5em;/*行距为1.5个单位*/
        padding:10px;/*用内边距代替外边距来设置段间距*/
        margin:0;/*去掉默认的段间距*/
    }

    .active{
        color: rgb(55, 199, 0) !important;
    }
    .sub-commment-list{
        margin: 1rem 0;
        padding: 0 0 0 1rem;
        background-color: #fafbfc;
        border-radius: 3px;
    }
    .sub-comment{
        padding: 1rem 0 0;
    }
    .reply{
        margin-top: 1.083rem;
        padding: 1rem;
        display: flex;
        position: relative;
        background-color: #fafbfc;
        border-radius: 3px;
    }
    .forum{
        position: relative;
        width: 1136px;
        padding: 0px 16px;
        margin: 0px auto;
        transition: all 0.15s ease-in 0s;
        min-height: 560px;
    }
    .comment{
        margin: 1.333rem 0;
        display: flex;
        position: relative;
        padding: 1rem 1.333rem;
        background-color: #fafbfc;
        border-radius: 3px;
    }
   .comment-action{
        display: flex;
        align-items: center;
        margin: .65rem 0 0;
    }
    .submit{
        flex: 0 0 auto;
        margin-left: auto;
    }
    .submit-button{
        flex: 0 0 auto;
    }
    .form-box{
        flex: 1 1 auto;
        position: relative;
    }
    .comment-list{
        margin: 0 1.666rem 0 4.85rem
    }
    .comment-list-content{
        margin-top: .55rem;
        font-size: .90rem;
        line-height: 1.833rem;
        word-wrap: break-word;
        white-space: pre-wrap;
        word-break: break-all;
    }
</style>
