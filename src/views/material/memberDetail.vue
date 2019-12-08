<template>
    <div class="createPost-container">

        <el-form ref="postForm" :model="postForm" :rules="rules" class="form-container" label-position="left"
                 label-width="120px"
                 style="width: 50%;margin: auto;padding-bottom: 20px">
            <div class="createPost-main-container">

                <div class="postInfo-container">
                    <el-row :gutter="20">
                        <el-col :span="8">
                            <el-form-item label="物证编号" prop="thirdMaterialNo">
                                <el-input v-model="materialListForm.thirdMaterialNo" :disabled="true" placeholder="系统自动生成" />
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
                                        <li v-for="item in materialCategoryUserList"><el-link @click="materialChange(item.dictName);materialListForm.materialCategory=item.dictName" >{{ item.dictName }}</el-link></li>
                                    </ul>
                                    <el-cascader
                                            ref="materialCategoryList"
                                            :options="materialCategoryList"
                                            v-model="materialListForm.materialCategory"
                                            :filter-method="filterSearch"
                                            :show-all-levels="false"
                                            @change="countDictMaterial($event,'物证类型')"
                                            @visible-change="materialCategoryPopover = !materialCategoryPopover"
                                            slot="reference"
                                            filterable
                                            style="width: 100%"/>
                                </el-popover>
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item label="可靠程度" prop="reliabilityLevel">
                                <el-select v-model="materialListForm.reliabilityLevel" placeholder="请选择">
                                    <el-option
                                            v-for="item in reliabilityLevel"
                                            :key="item.title"
                                            :label="item.title"
                                            :value="item.title"/>
                                </el-select>
                            </el-form-item>
                        </el-col>
                    </el-row>

                    <el-row :gutter="20">
                        <el-col :span="8">
                            <el-form-item label="遗留部位" prop="stayPart">
                                <el-input v-model="materialListForm.stayPart"/>
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item label="提取方法" prop="extractMethod">
                                <el-input v-if="isInput" v-model="materialListForm.extractMethod"/>
                                <el-select v-model="materialListForm.extractMethod"
                                           filterable
                                           @change="countDictSelect"
                                           default-first-option
                                           v-if="!isInput"
                                           placeholder="请选择"
                                           style="width: 100%">
                                    <el-option
                                            v-for="item in extractMethodList"
                                            :key="item.value"
                                            :label="item.value"
                                            :value="item.value"/>
                                </el-select>
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item label="利用情况" prop="usedType">
                                <el-select v-model="materialListForm.usedType" placeholder="请选择">
                                    <el-option
                                            v-for="item in usedType"
                                            :key="item.title"
                                            :label="item.title"
                                            :value="item.title"/>
                                </el-select>
                            </el-form-item>
                        </el-col>
                    </el-row>

                    <el-row :gutter="20">
                        <el-col :span="8">
                            <el-form-item label="提取日期" prop="extractTime">

                                <el-date-picker
                                        v-model="materialListForm.extractTime"
                                        type="date"
                                        value-format="timestamp"
                                        placeholder="选择时间"
                                        style="width: 100%"
                                />
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item label="提取人" prop="extractUid">
                                <el-select
                                        v-model="materialListForm.extractUid"
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
                                <el-input v-model="materialListForm.name"/>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-form-item label="特征描述" prop="note">
                        <el-input v-model="materialListForm.note" type="textarea"/>
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
    import {fetchAlarm, createAlarm, updateAlarm} from '@/api/alarm'
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
                    reporter: '',
                    reportOrg: '',
                    contactPhoneNumber: '',
                    driverName: '',
                    monitorUid: '',
                    techUid: '',
                    techUidArray: [],
                    leaderUid: '',
                    receiptTimeShow: '',
                    receiptTime: '',
                    smsContent: '',
                    smsReceiverArray: [],
                    smsReceiver: '',
                    caseAddress: '',
                    caseCategory: '',
                    caseDigest: '',
                    lostDetail: '',
                    instanceNo: this.$store.getters.instanceNo,
                    caseTime: '',
                    receiptUid:'',
                    receiptName:'',
                },
                emitProps:{
                    emitPath:false
                },
                userList: [],
                userShowList: [],
                rules: {},
                loading: false,
                caseCategoryPopover: false,
                reportOrgPopover: false,
                smsContentChange: '',
                caseCategoryList: [],
                caseCategoryUserList: [],
                reportOrgList: [],
                reportOrgUserList: [],
            }
        },
        computed: {

        },
        watch: {
            postForm: {
                handler(newData, oldData) {
                    var tech = ''
                    var category = ''
                    var lost= '';
                    var date= '';
                    if (this.postForm.techUidArray.length > 0) {
                         this.postForm.techUidArray.map(item=>{
                            this.userList.map(value=>{
                               if (item === value.id)
                                   tech += value.title+' '
                            })
                        });
                    }
                    if (this.postForm.caseCategory != ''){
                        if (this.isEdit) {
                            category = this.postForm.caseCategory
                        }else{
                            category = this.postForm.caseCategory.slice(-1)[0]
                        }
                    }
                    if (this.postForm.lostDetail != ''){
                        lost ='损失情况：'+ this.postForm.lostDetail +','
                    }
                    if (this.isEdit) {
                        date = this.postForm.receiptTimeShow;
                    }else{
                        date = this.formatDate(this.postForm.receiptTimeShow)
                    }
                    if (this.postForm.monitorUid){
                        if (this.postForm.smsReceiverArray.indexOf(this.postForm.monitorUid) === -1)
                            this.postForm.smsReceiverArray.push(this.postForm.monitorUid)
                    }

                    if (this.postForm.leaderUid){
                        if (this.postForm.smsReceiverArray.indexOf(this.postForm.leaderUid) === -1)
                            this.postForm.smsReceiverArray.push(this.postForm.leaderUid)
                    }

                    if (this.postForm.techUidArray.length >0){
                        this.postForm.techUidArray.map(data=>{
                            if (this.postForm.smsReceiverArray.indexOf(data) === -1)
                                this.postForm.smsReceiverArray.push(data)
                        })

                    }

                    this.smsContentChange =  date + ' 接到' + this.postForm.reportOrg + ' ' + this.postForm.reporter + '(' + this.postForm.contactPhoneNumber + ")" +
                        '报告在' + this.postForm.caseAddress + '发生一起' + category+ ' 案件。'+lost+'值班技术员：' + tech

                },
                deep: true,

            },

        },
        created() {
            this.getUserList()

            this.search('案件类别').then(response=>{
                this.caseCategoryList = this.processData(response.list)
            });
            this.getUserDict('案件类别').then(response=>{
                this.caseCategoryUserList = response.list;
            });
            this.search('报告单位').then(response=>{
                this.reportOrgList = this.processData(response.list)
            });
            this.getUserDict('报告单位').then(response=>{
                this.reportOrgUserList = response.list;
            });
            if (this.isEdit) {
                const id = this.$route.params && this.$route.params.id
                this.postForm.id = id;
                this.fetchData(id)
            }else{
                this.restForm()
            }
            this.initDateTime()
            this.postForm.receiptUid = this.$store.getters.id;
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
            countDict(val,type){
                const send={
                    name:val,
                    cateName:type
                };
                this.$store.dispatch('PostUserUseDict', send)
            },
            selectUpdate(val){
              this.$forceUpdate();
            },
            initDateTime(){
              // var rightNow = this.formatDate()
              // console.log(rightNow)
              var rightNow = new Date()
                this.postForm.receiptTimeShow = rightNow
                this.postForm.receiptTime = rightNow / 1000
                this.postForm.caseTime = rightNow
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
                    reporter: '',
                    reportOrg: '',
                    contactPhoneNumber: '',
                    driverName: '',
                    monitorUid: '',
                    techUid: '',
                    techUidArray: [],
                    leaderUid: '',
                    receiptTimeShow: '',
                    receiptTime: '',
                    smsContent: "",
                    smsReceiverArray: [],
                    smsReceiver: '',
                    caseAddress: '',
                    caseCategory: '',
                    caseDigest: '',
                    lostDetail: '',
                    instanceNo: this.$store.getters.instanceNo,
                    caseTime: '',
                    receiptUid:'',
                    receiptName:'',
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
                fetchAlarm(id).then(data => {
                    this.postForm = Object.assign({}, data);


                    if (this.postForm.monitorUid === 0)
                        this.postForm.monitorUid = '';
                    if (this.postForm.leaderUid === 0)
                        this.postForm.leaderUid = '';
                    if (this.postForm.techUid === ''){
                        this.postForm.techUidArray = [];
                    }else{
                        this.postForm.techUidArray = this.postForm.techUid.split(",").map(data => {
                            return parseInt(data);
                        });
                    }

                    if (this.postForm.smsReceiver  === ''){
                        this.postForm.smsReceiverArray = [];
                    }else{
                        this.postForm.smsReceiverArray = this.postForm.smsReceiver.split(",").map(data => {
                            return parseInt(data);
                        });
                    }

                    if (this.postForm.caseTime.toString().length===10)
                        this.postForm.caseTime =  data.caseTime*1000;
                    var d = new Date(this.postForm.receiptTime * 1000);

                    this.postForm.receiptTimeShow = this.formatDate(d)
                    if (this.postForm.receiptUid === 0) {
                        data.receiptUid = data.receiptName;
                    }
                    this.postForm.smsContentChange = this.postForm.smsContent;
                }).catch(err => {
                    console.log(err)
                })
            },
            submitForm() {

                var data =Object.assign({}, this.postForm);

                data.smsContent = this.smsContentChange;
                if (data.smsReceiverArray.length > 0) {
                    data.smsReceiver = data.smsReceiverArray.join(',');
                }
                if (data.techUidArray.length > 0) {
                    data.techUid = data.techUidArray.join(',');
                }
                data.receiptTime = Date.parse(data.receiptTimeShow) / 1000;
                if (data.caseTime.toString().length>10)
                    data.caseTime =  parseInt(data.caseTime/1000);

                // if (data.caseCategory.constructor === Array) {
                //     data.caseCategory = data.caseCategory.slice(-1)[0]
                // }
                // if (data.reportOrg.constructor === Array) {
                //     data.reportOrg = data.reportOrg.slice(-1)[0]
                // }

                if (!/^[1-9]+[0-9]*]*$/.test(data.receiptUid)) {
                    data.receiptName = data.receiptUid;
                    data.receiptUid = 0;
                }
                if (data.instanceNo === this.$store.getters.instanceNo)
                    data.instanceNo=''

                this.$refs.postForm.validate(valid => {
                    if (valid) {
                        this.loading = true
                        if (this.isEdit) {
                            updateAlarm(data).then(data => {
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
                            createAlarm(data).then(data => {
                                this.loading = false
                                if (data.code === 200) {
                                    this.$message({
                                        message: '保存成功',
                                        type: 'success',
                                        showClose: true,
                                        duration: 1000
                                    })
                                    this.$router.push({
                                        path: '/alarm/index',
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
