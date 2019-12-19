<template>
    <div class="createPost-container">

        <el-form ref="postForm" :model="postForm" :rules="rules" class="form-container" label-position="left"
                 label-width="120px"
                 style="width: 50%;margin: auto;padding-bottom: 20px">
            <div class="createPost-main-container">

                <div class="postInfo-container">
                    <el-row :gutter="20">
                        <el-col :span="12">
                            <el-form-item label="勘查号" prop="evidenceNo">
                                <el-input v-model="postForm.evidenceNo"/>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="任务号" prop="taskNo">
                                <el-input v-model="postForm.taskNo"/>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row :gutter="20">
                        <el-col :span="12">
                            <el-form-item label="DNA编号" prop="materialNo">
                                <el-input v-model="postForm.materialNo"/>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="移交人" prop="requestUid">
                                <el-select v-model="postForm.requestUid"
                                           class="filter-item"
                                           allow-create
                                           filterable
                                           clearable
                                           default-first-option
                                           style="width: 100%">
                                    <el-option
                                            v-for="item in userList"
                                            :value-key="item.id"
                                            :label="item.title"
                                            :value="item.id"/>
                                </el-select>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row :gutter="20">
                        <el-col :span="12">
                            <el-form-item label="送检日期" prop="requestTime">
                                <el-date-picker
                                        clearable
                                        v-model="postForm.requestTime"
                                        type="datetime"
                                        value-format="timestamp"
                                        placeholder="选择时间"
                                        style="width: 100%"/>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="送检单位" prop="requestOrg">
                                <el-input v-model="postForm.requestOrg"/>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row :gutter="20">
                        <el-col :span="12">
                            <el-form-item label="提取人" prop="handlerUid">
                                <el-select v-model="postForm.handlerUid"
                                           class="filter-item"
                                           allow-create
                                           clearable
                                           filterable
                                           default-first-option
                                           style="width: 100%">
                                    <el-option
                                            v-for="item in userList"
                                            :value-key="item.id"
                                            :label="item.title"
                                            :value="item.id"/>
                                </el-select>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="文书号" prop="documentNo">
                                <el-input v-model="postForm.documentNo"/>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row :gutter="20">
                        <el-col :span="12">
                            <el-form-item label="案件类别" prop="caseCategory">
                                <el-cascader
                                        :options="caseCategoryList"
                                        filterable
                                        clearable
                                        @change="countDict"
                                        v-model="postForm.caseCategory"
                                        :filter-method="remoteSearch"
                                        :show-all-levels="false"
                                        placeholder="案件类型"
                                        class="mb10"
                                        style="width: 100%">
                                </el-cascader>

                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="文书去向" prop="documentRoute">
                                <el-input v-model="postForm.documentRoute"/>
                            </el-form-item>
                        </el-col>
                    </el-row>

                    <el-form-item label="检验结果" prop="smsContent">
                        <el-input v-model="postForm.examResult" :autosize="{ minRows: 2, maxRows: 4}"
                                   type="textarea"/>
                    </el-form-item>
                        <el-form-item label="简要案情" prop="smsContent">
                        <el-input v-model="postForm.caseDigest" :autosize="{ minRows: 2, maxRows: 4}"
                                  type="textarea"/>
                    </el-form-item>
                        <el-form-item label="物证情况" prop="smsContent">
                        <el-input v-model="postForm.materialDetail" :autosize="{ minRows: 2, maxRows: 4}"
                                   type="textarea"/>
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
    import {dnaList, fetchDna, createDna, updateDna} from '@/api/dna'
    import {fetchList} from '@/api/dictionary'
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
                postForm: {
                    id: undefined,
                    evidenceNo: '',
                    taskNo: '',
                    materialNo: '',
                    requestUid: '',
                    requestName: '',
                    requestOrg: '',
                    requestTime: '',
                    handlerUid: '',
                    handlerName: '',
                    caseCategory: "",
                    documentNo: '',
                    documentRoute: '',
                    examResult: '',
                    caseDigest: '',
                    materialDetail: '',
                },
                userList: [],
                userShowList: [],
                rules: {},
                loading: false,
                smsContentChange: '',
                caseCategoryList: [],
            }
        },
        computed: {

        },
        watch: {
        },
        created() {
            this.getUserList()
            this.restForm()
            this.search('案件类别');
            if (this.isEdit) {
                const id = this.$route.params && this.$route.params.id
                this.postForm.id = id;
                this.fetchData(id)
            }

        },
        methods: {
            countDict(val){
                if (val){
                    val = val.slice(-1)[0]
                    const send={
                        name:val
                    };
                    this.$store.dispatch('PostUserUseDict', send)
                }

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
                    evidenceNo: '',
                    taskNo: '',
                    materialNo: '',
                    requestUid: '',
                    requestName: '',
                    requestOrg: '',
                    requestTime: '',
                    handlerUid: '',
                    handlerName: '',
                    caseCategory: "",
                    documentNo: '',
                    documentRoute: '',
                    examResult: '',
                    caseDigest: '',
                    materialDetail: '',
                }
            },
            search(parentName,filter=null){
                const data = {
                    filter:filter,
                    parentName:parentName
                };
                fetchList(data).then(response=>{
                    this.caseCategoryList = this.processData(response.list)
                })
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
                fetchDna(id).then(data => {
                    this.postForm = Object.assign({}, data);
                    if (this.postForm.requestTime.toString().length===10)
                        this.postForm.requestTime = data.requestTime*1000;

                }).catch(err => {
                    console.log(err)
                })
            },
            submitForm() {

                var data = Object.assign({},  this.postForm);

                if (!/^[1-9]+[0-9]*]*$/.test(data.receiptUid)) {
                    data.receiptName = data.receiptUid;
                    data.receiptUid = 0;
                }

                if (!/^[1-9]+[0-9]*]*$/.test(data.handlerUid)) {
                    data.handlerName = data.handlerUid;
                    data.handlerUid = 0;
                }

                if (data.caseCategory.constructor === Array) {
                    data.caseCategory = data.caseCategory.slice(-1)[0]
                }

                if (data.requestTime.toString().length>10)
                    data.requestTime =  parseInt(data.requestTime/1000);

                this.$refs.postForm.validate(valid => {
                    if (valid) {
                        this.loading = true
                        if (this.isEdit) {
                            updateDna(data).then(data => {
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
                            createDna(data).then(data => {
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
                                        path: '/dna/index',
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
