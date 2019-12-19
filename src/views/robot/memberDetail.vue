<template>
    <div class="createPost-container">

        <el-form ref="postForm" :model="postForm" :rules="rules" class="form-container" label-position="left"
                 label-width="120px"
                 style="width: 50%;margin: auto;padding-bottom: 20px">
            <div class="createPost-main-container">

                <div class="postInfo-container">
                    <el-row :gutter="20">
                        <el-col :span="12">
                            <el-form-item label="勘查开始时间" prop="examBeginTime">
                                <el-date-picker
                                        v-model="postForm.examBeginTime"
                                        type="datetime" clearable
                                        value-format="timestamp"
                                        placeholder="选择时间"
                                        style="width: 100%"
                                />
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="勘查结束时间" prop="examEndTime">
                                <el-date-picker
                                        v-model="postForm.examEndTime"
                                        type="datetime" clearable
                                        value-format="timestamp"
                                        placeholder="选择时间"
                                        style="width: 100%"/>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row :gutter="20">
                        <el-col :span="12">
                            <el-form-item label="任务名字" prop="name">
                                <el-input v-model="postForm.name"/>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="处所" prop="sceneType">

                                    <el-cascader
                                            :options="sceneTypeList"
                                            v-model="postForm.sceneType"
                                            :filter-method="filterSearch"
                                            :show-all-levels="false"
                                            filterable clearable
                                            clearable
                                            :props="props"
                                            style="width: 100%"/>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row :gutter="20">
                        <el-col :span="12">
                            <el-form-item label="作案时机" prop="crimeTime">

                                    <el-cascader
                                            :options="crimeTimeList"
                                            v-model="postForm.crimeTime"
                                            :filter-method="filterSearch"
                                            :show-all-levels="false"
                                            clearable clearable
                                            :props="props"
                                            filterable
                                            style="width: 100%"/>

                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="案件发生区域" prop="caseHappenRegion">

                                    <el-cascader
                                            :options="caseHappenRegionList"
                                            v-model="postForm.caseHappenRegion"
                                            :filter-method="filterSearch"
                                            :show-all-levels="false"
                                            clearable clearable
                                            :props="emitProps"
                                            filterable
                                            style="width: 100%"
                                    />

                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row :gutter="20">
                        <el-col :span="12">
                            <el-form-item label="侵入方式" prop="invadeType">

                                    <el-cascader
                                            :options="invadeTypeList"
                                            v-model="postForm.invadeType"
                                            :filter-method="filterSearch"
                                            :show-all-levels="false"
                                            clearable clearable
                                            filterable
                                            :props="props"
                                            style="width: 100%"/>

                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="作案出口" prop="escapeType">

                                    <el-cascader
                                            :options="escapeTypeList"
                                            v-model="postForm.escapeType"
                                            :filter-method="filterSearch"
                                            :show-all-levels="false"
                                            clearable clearable
                                            filterable
                                            :props="props"
                                            style="width: 100%"/>

                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row :gutter="20">
                        <el-col :span="12">
                            <el-form-item label="作案工具" prop="crimeTools">
                                <el-input v-model="postForm.crimeTools"/>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="案件类别" prop="caseCategory">

                                    <el-cascader
                                            :options="caseCategoryList"
                                            v-model="postForm.caseCategory"
                                            :filter-method="filterSearch"
                                            :show-all-levels="false"
                                            clearable clearable
                                            :props="emitProps"
                                            filterable
                                            style="width: 100%"
                                    />

                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row :gutter="20">
                        <el-col :span="12">
                            <el-form-item label="足迹" prop="footprint">
                                <el-cascader
                                        :options="footprintList"
                                        v-model="postForm.footprint"
                                        :filter-method="filterSearch"
                                        :show-all-levels="false"
                                        clearable
                                        :props="emitProps"
                                        filterable
                                        style="width: 100%"
                                />

                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="嫌疑人" prop="keyword">
                                <el-input v-model="postForm.keyword" type="text"/>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-form-item label="关键字" prop="keyword">
                        <el-input v-model="postForm.keyword" type="text"/>
                    </el-form-item>
                    <el-form-item label="作案过程" prop="crimeDetail">
                        <el-input v-model="postForm.crimeDetail" type="textarea"/>
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
    import { createRobot, updateRobot,robotDetail } from '@/api/robot'
    import {fetchList,userDictList} from '@/api/dictionary'
    import {fetchAdminMemberList} from '@/api/permissions'

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
                props: {
                    multiple: true,
                    emitPath:false
                },
                emitProps:{
                    emitPath:false,
                    multiple: true
                },
                postForm: {
                    id: undefined,
                    name: '',
                    sceneType: '',
                    crimeTime: '',
                    caseHappenRegion: '',
                    invadeType: '',
                    escapeType: '',
                    crimeTools: '',
                    crimeDetail: '',
                    crimePeoples: '',
                    caseCategory: "",
                    examBeginTime: '',
                    examEndTime: '',
                    keyword: '',
                    footprint: '',
                },
                userList: [],
                userShowList: [],
                rules: {},
                loading: false,


                caseCategoryList: [],
                caseHappenRegionList: [],
                sceneTypeList: [],
                crimeTimeList: [],
                invadeTypeList: [],
                escapeTypeList: [],
                footprintList: [],


            }
        },
        computed: {

        },
        watch: {
        },
        created() {
            this.getUserList()
            this.restForm()
            this.search('案件类别').then(data => {
                this.caseCategoryList = this.processData(data.list)
            })

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

            this.search('足迹物证').then(data => {
                this.footprintList = this.processData(data.list)
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
            getUserDict(parentName){
                return new Promise((resolve, reject) => {
                    const data = {
                        cateName:parentName
                    };
                    resolve(userDictList(data))
                })
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
            restForm() {
                this.postForm = {
                    id: undefined,
                    name: '',
                    sceneType: '',
                    crimeTime: '',
                    caseHappenRegion: '',
                    invadeType: '',
                    escapeType: '',
                    crimeTools: '',
                    crimeDetail: '',
                    crimePeoples: '',
                    caseCategory: "",
                    examBeginTime: '',
                    examEndTime: '',
                    keyword: '',
                    footprint: '',
                }
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

            fetchData(id) {
                robotDetail(id).then(data => {
                    this.postForm = Object.assign({}, data);
                    if (this.postForm.examBeginTime.toString().length===10)
                        this.postForm.examBeginTime = data.examBeginTime*1000;
                    else if (this.postForm.examBeginTime === 0)
                        this.postForm.examBeginTime =''

                    if (this.postForm.examEndTime.toString().length===10)
                        this.postForm.examEndTime = data.examEndTime*1000;
                    else if (this.postForm.examEndTime === 0)
                        this.postForm.examEndTime =''

                    if (this.postForm.crimeTime){
                        this.postForm.crimeTime = JSON.parse(this.postForm.crimeTime)
                    }
                    if (this.postForm.sceneType){
                        this.postForm.sceneType = JSON.parse(this.postForm.sceneType)
                    }
                    if (this.postForm.invadeType){
                        this.postForm.invadeType = JSON.parse(this.postForm.invadeType)
                    }
                    if (this.postForm.escapeType){
                        this.postForm.escapeType = JSON.parse(this.postForm.escapeType)
                    }
                    if (this.postForm.footprint){
                        this.postForm.footprint = JSON.parse(this.postForm.footprint)
                    }


                    if (this.postForm.caseHappenRegion){
                        this.postForm.caseHappenRegion = JSON.parse(this.postForm.caseHappenRegion)
                    }

                    if (this.postForm.caseCategory){
                        this.postForm.caseCategory = JSON.parse(this.postForm.caseCategory)
                    }


                }).catch(err => {
                    console.log(err)
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
            submitForm() {

                var data = Object.assign({},  this.postForm);

                if (data.crimeTime) {
                    if (data.crimeTime.length > 0) {
                        data.crimeTime = JSON.stringify(data.crimeTime)
                    }
                }

                 if (data.caseHappenRegion) {
                    if (data.caseHappenRegion.length > 0) {
                        data.caseHappenRegion = JSON.stringify(data.caseHappenRegion)
                    }
                }

                if (data.sceneType) {
                    if (data.sceneType.length > 0) {
                        data.sceneType = JSON.stringify(data.sceneType)
                    }
                }

                if (data.invadeType) {
                    if (data.invadeType.length > 0) {
                        data.invadeType = JSON.stringify(data.invadeType)
                    }
                }

                if (data.escapeType) {
                    if (data.escapeType.length > 0) {
                        data.escapeType = JSON.stringify(data.escapeType)
                    }
                }

                if (data.caseCategory) {
                    if (data.caseCategory.length > 0) {
                        data.caseCategory = JSON.stringify(data.caseCategory)
                    }
                }

                 if (data.footprint) {
                    if (data.footprint.length > 0) {
                        data.footprint = JSON.stringify(data.footprint)
                    }
                }


                if (data.examBeginTime &&data.examBeginTime.toString().length>10)
                    data.examBeginTime =  parseInt(data.examBeginTime/1000);

                if (data.examEndTime && data.examEndTime.toString().length>10)
                    data.examEndTime =  parseInt(data.examEndTime/1000);

                this.$refs.postForm.validate(valid => {
                    if (valid) {
                        this.loading = true
                        if (this.isEdit) {

                            updateRobot(data).then(data => {
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

                            createRobot(data).then(data => {
                                this.loading = false
                                if (data.code === 200) {
                                    this.$message({
                                        message: '保存成功',
                                        type: 'success',
                                        showClose: true,
                                        duration: 1000
                                    })
                                    this.$router.push({
                                        path: '/robot/index',
                                        query: {
                                            t: +new Date()
                                        }
                                    })
                                    this.$store.dispatch('delView', this.$route)
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
