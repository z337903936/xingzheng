<template>
    <div class="createPost-container">

        <el-form ref="postForm" :model="postForm" :rules="rules" class="form-container" label-position="left"
                 label-width="120px"
                 style="width: 70%;margin: auto;padding-bottom: 20px">
            <div class="createPost-main-container">

                <div class="postInfo-container">
                    <el-row :gutter="20">
                        <el-col :span="8">
                            <el-form-item label="物证编号" prop="thirdMaterialNo">
                                <el-input v-model="postForm.materialNo" :disabled="true" placeholder="系统自动生成" />
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item label="物证类别" prop="materialCategory">
                                <el-popover
                                        placement="left"
                                        width="200"
                                        trigger="manual"
                                        v-model="materialCategoryPopover">
                                    常用字典
                                    <ul>
                                        <li v-for="item in materialCategoryUserList"><el-link @click="postForm.materialCategory=item.dictName" >{{ item.dictName }}</el-link></li>
                                    </ul>
                                    <el-cascader
                                            ref="materialCategoryList"
                                            :options="materialCategoryList"
                                            v-model="postForm.materialCategory"
                                            :filter-method="filterSearch"
                                            :show-all-levels="false"
                                            @change="countDict($event,'物证类型')"
                                            @visible-change="materialCategoryPopover = !materialCategoryPopover"
                                            slot="reference"
                                            filterable
                                            :props="emitProps"
                                            style="width: 100%"/>
                                </el-popover>
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item label="存放位置" prop="name">
                                <el-input v-model="postForm.storagePlace"/>
                            </el-form-item>
                        </el-col>
                    </el-row>


                    <el-row :gutter="20">
                        <el-col :span="8">
                            <el-form-item label="移交日期" prop="extractTime">

                                <el-date-picker
                                        v-model="postForm.transferTime"
                                        type="date"
                                        value-format="timestamp"
                                        placeholder="选择时间"
                                        style="width: 100%"
                                />
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item label="移交人" prop="extractUid">
                                <el-select
                                        v-model="postForm.transferUid"
                                        :filter-method="filterUserSearch"
                                        filterable
                                        placeholder="请选择"
                                        center
                                        style="width: 100%"
                                        @visible-change="restUserSearch">
                                    <el-option
                                            v-for="item in userShowList"
                                            :key="item.id"
                                            :label="item.title"
                                            :value="item.id"/>
                                </el-select>
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">

                            <el-form-item label="物证名称" prop="name">
                                <el-input v-model="postForm.name"/>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-form-item label="特征描述" prop="note">
                        <el-input v-model="postForm.note" type="textarea"/>
                    </el-form-item>

                    <el-form-item style="margin-bottom: 40px;text-align: center;" label-width="100px">
                        <el-button v-loading="loading"  style="width: 200px" type="primary"
                                   @click="submitForm">保存
                        </el-button>
                    </el-form-item>


                </div>
            </div>

            <div class="btn-container"/>
        </el-form>

    </div>
</template>

<script>
    import {fetchMaterial, createMaterial, updateMaterial} from '@/api/material'
    import {fetchList,userDictList} from '@/api/dictionary'
    import {fetchAdminMemberList} from '@/api/permissions'
    import {parseTime} from '@/utils'

    export default {
        name: 'Detail',
        components: {},
        props: {
            isEdit: {
                type: Boolean,
                default: false
            }
        },
        data() {
            return {
                postForm: {
                    id: undefined,
                    evidenceNo: '',
                    materialNo: '',
                    materialCategory: '',
                    materialType: '',
                    name: '',
                    note: '',
                    transferUid: '',
                    transferTime: '',
                    storagePlace: '',

                },
                emitProps:{
                    emitPath:false
                },
                userList: [],
                userShowList: [],
                rules: {},
                loading: false,
                materialCategoryPopover: false,
                materialCategoryList: [],
                materialCategoryUserList: [],
            }
        },
        computed: {

        },
        watch: {
        },
        created() {
            this.getUserList()

            this.search('物证类型').then(data => {
                this.materialCategoryList = this.processData(data.list)
            })
            this.getUserDict('物证类型').then(data => {
                this.materialCategoryUserList = data.list
            })
            if (this.isEdit) {
                const id = this.$route.params && this.$route.params.id
                this.postForm.id = id;
                this.fetchData(id)
            }else{
                this.restForm()
            }

        },
        methods: {
            filterSearch(node, value) {
                var p = /^[a-zA-Z]+$/
                if (p.test(value)) {
                    if (node.data.py.toLowerCase().indexOf(value.toLowerCase()) > -1) { return true }
                } else {
                    if (node.data.label.indexOf(value) > -1) { return true }
                }
            },
            getUserDict(parentName){
                return new Promise((resolve, reject) => {
                    const data = {
                        cateName:parentName
                    };
                    resolve(userDictList(data))
                })
            },
            countDict(val,type){
                const send={
                    name:val,
                    cateName:type
                };
                this.$store.dispatch('PostUserUseDict', send)
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

            restForm() {
                this.postForm = {
                    id: undefined,
                    evidenceNo: '',
                    materialNo: '',
                    materialCategory: '',
                    materialType: '',
                    name: '',
                    note: '',
                    transferUid: '',
                    transferTime: '',
                    storagePlace: '',
                }
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

            processData(data){
                return data.map(item=>{
                    var sendData = {
                        value:item.name,
                        label:item.name,
                        id:item.id,
                        py:item.pinyinAbbr,
                    }
                    if (item.children.length >0){
                        sendData.children = this.processData(item.children);
                    }

                    return sendData;
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
            formatDate(now) {
                var year = now.getFullYear();
                var month = now.getMonth() + 1;
                var date = now.getDate();
                var hour = now.getHours();
                var minute = now.getMinutes();
                var second = now.getSeconds();
                return year + "-" + month + "-" + date + " " + hour + ":" + minute + ":" + second;
            },
            fetchData(id) {
                fetchMaterial(id).then(data => {
                    this.postForm = Object.assign({}, data);

                    if (this.postForm.transferUid === 0)
                        this.postForm.transferUid = '';

                    if (this.postForm.transferTime.toString().length===10)
                        this.postForm.transferTime =  data.transferTime*1000;
                    else if (this.postForm.transferTime === 0)
                        this.postForm.transferTime = '';

                }).catch(err => {
                    console.log(err)
                })
            },
            submitForm() {

                var data =Object.assign({}, this.postForm);


                if (data.transferTime.toString().length>10)
                    data.transferTime =  parseInt(data.transferTime/1000);



                this.$refs.postForm.validate(valid => {
                    if (valid) {
                        this.loading = true
                        if (this.isEdit) {
                            updateMaterial(data).then(data => {
                                this.loading = false
                                if (data.code === 200) {
                                    this.$message({
                                        message: '保存成功',
                                        type: 'success',
                                        showClose: true,
                                        duration: 1000
                                    })

                                } else {
                                    this.$message({
                                        message: data.reason,
                                        type: 'error',
                                        showClose: true,
                                        duration: 1000
                                    })
                                }
                            }).catch(err => {
                                console.log(err)
                                this.loading = false
                            })
                        } else {
                            createMaterial(data).then(data => {
                                this.loading = false
                                if (data.code === 200) {
                                    this.$message({
                                        message: '保存成功',
                                        type: 'success',
                                        showClose: true,
                                        duration: 1000
                                    })
                                    this.$store.dispatch('delView', this.$route)
                                    this.$router.push({
                                        path: '/material/index',
                                        query: {
                                            t: +new Date()
                                        }
                                    })

                                } else {
                                    this.$message({
                                        message: data.reason,
                                        type: 'error',
                                        showClose: true,
                                        duration: 1000
                                    })
                                }
                            }).catch(err => {
                                console.log(err)
                                this.loading = false
                            })
                        }
                    }
                })
            }
        }
    }
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
    @import "~@/styles/mixin.scss";

    .createPost-container {
        position: relative;

        .createPost-main-container {
            padding: 40px 45px 20px 50px;

            .postInfo-container {
                position: relative;
                @include clearfix;
                margin-bottom: 10px;

                .postInfo-container-item {
                    float: left;
                }
            }

            .editor-container {
                min-height: 500px;
                margin: 0 0 30px;

                .editor-upload-btn-container {
                    text-align: right;
                    margin-right: 10px;

                    .editor-upload-btn {
                        display: inline-block;
                    }
                }
            }
        }

        .word-counter {
            width: 40px;
            position: absolute;
            right: -10px;
            top: 0px;
        }
    }
</style>
