<template>
    <div class="createPost-container">

        <el-form ref="postForm" :model="postForm" :rules="rules" class="form-container" label-position="left"
                 label-width="120px"
                 style="width: 50%;margin: auto;padding-bottom: 20px">
            <div class="createPost-main-container">

                <div class="postInfo-container">
                    <el-row :gutter="20">
                        <el-col :span="12">
                            <el-form-item label="报告人" prop="reporter">
                                <el-input v-model="postForm.reporter"/>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="报告单位" prop="reportOrg">

                                <el-cascader
                                        :options="reportOrgList"
                                        filterable
                                        v-model="postForm.reportOrg"
                                        :filter-method="remoteSearch"
                                        :show-all-levels="false"
                                        style="width: 100%">
                                </el-cascader>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row :gutter="20">
                        <el-col :span="12">
                            <el-form-item label="接警时间" prop="receiptTimeShow">
                                <el-date-picker
                                        v-model="postForm.receiptTimeShow"
                                        type="datetime"
                                        value-format="yyyy-MM-dd HH:mm:ss"
                                        placeholder="选择时间"
                                        style="width: 100%"/>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="联系电话" prop="contactPhoneNumber">
                                <el-input v-model="postForm.contactPhoneNumber"/>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row :gutter="20">
                        <el-col :span="12">
                            <el-form-item label="案件类别" prop="caseCategory" >
                                <el-cascader
                                        :options="caseCategoryList"
                                        filterable
                                        v-model="postForm.caseCategory"
                                        :filter-method="remoteSearch"
                                        :show-all-levels="false"
                                        style="width: 100%">
                                </el-cascader>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="案发时间" prop="caseTime">
                                <el-date-picker
                                        v-model="postForm.caseTime"
                                        type="datetime"
                                        value-format="timestamp"
                                        placeholder="选择时间"
                                        style="width: 100%"
                                />
                            </el-form-item>
                        </el-col>
                    </el-row>


                    <el-form-item label="警情号" prop="instanceNo">
                        <el-input v-model="postForm.instanceNo"/>
                    </el-form-item>
                    <el-form-item label="案发地点" prop="caseAddress">
                        <el-input v-model="postForm.caseAddress"/>
                    </el-form-item>
                    <el-form-item label="案发摘要" prop="caseDigest">
                        <el-input type="textarea" :autosize="{ minRows: 2, maxRows: 4}" v-model="postForm.caseDigest" placeholder="作案手法、侵入方式等"/>
                    </el-form-item>
                    <el-form-item label="损失情况" prop="lostDetail">
                        <el-input v-model="postForm.lostDetail"/>
                    </el-form-item>

                    <el-row :gutter="20">
                        <el-col :span="12">
                            <el-form-item label="技术值班队长" prop="monitorUid">
                                <el-select v-model="postForm.monitorUid"
                                           filterable
                                           :filter-method="filterUserSearch"
                                           @visible-change="restUserSearch"
                                           class="filter-item"
                                           style="width: 100%">
                                    <el-option
                                            v-for="item in userShowList"
                                            :key="item.id"
                                            :label="item.title"
                                            :value="item.id"/>
                                </el-select>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="值班技术员" prop="techUid">

                                <el-select v-model="postForm.techUidArray"
                                           filterable
                                           :filter-method="filterUserSearch"
                                           @visible-change="restUserSearch"
                                           class="filter-item" multiple
                                           @change="selectUpdate"
                                           style="width: 100%">
                                    <el-option
                                            v-for="item in userShowList"
                                            :key="item.id"
                                            :label="item.title"
                                            :value="item.id"/>
                                </el-select>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row :gutter="20">
                        <el-col :span="12">
                            <el-form-item label="大队值班领导" prop="leaderUid">

                                <el-select v-model="postForm.leaderUid"
                                           filterable
                                           :filter-method="filterUserSearch"
                                           @visible-change="restUserSearch"
                                            class="filter-item"
                                           style="width: 100%">
                                    <el-option
                                            v-for="item in userShowList"
                                            :key="item.id"
                                            :label="item.title"
                                            :value="item.id"/>
                                </el-select>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="接警人" prop="receiptUid">
                                <el-select v-model="postForm.receiptUid"
                                           class="filter-item"
                                           allow-create
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
                    </el-row>
                    <el-row :gutter="20">
                        <el-col :span="12">
                            <el-form-item label="驾驶员" prop="driverName">
                                <el-input v-model="postForm.driverName"/>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="短信通知" prop="smsReceiverArray">
                                <el-select v-model="postForm.smsReceiverArray"
                                           filterable
                                           :filter-method="filterUserSearch"
                                           @visible-change="restUserSearch"
                                           class="filter-item" multiple
                                           @change="selectUpdate"
                                           style="width: 100%">
                                    <el-option
                                            v-for="item in userShowList"
                                            :key="item.id"
                                            :label="item.title"
                                            :value="item.id"/>
                                </el-select>
                            </el-form-item>
                        </el-col>
                    </el-row>

                    <el-form-item label="短信内容" prop="smsContent">
                        <el-input v-model="postForm.smsContent" type="textarea" :autosize="{ minRows: 2, maxRows: 4}"
                                  :value="smsContentChange" />
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
                userList: [],
                userShowList: [],
                rules: {},
                loading: false,
                smsContentChange: '',
                caseCategoryList: [],
                reportOrgList: [],
            }
        },
        computed: {

        },
        watch: {
            postForm: {
                handler() {
                    var tech = ''
                    var category = ''
                    var lost= '';
                    console.log(this.postForm.techUidArray.length);
                    if (this.postForm.techUidArray.length > 0) {
                         this.postForm.techUidArray.map(item=>{
                            this.userList.map(value=>{
                               if (item === value.id)
                                   tech += value.title+' '
                            })
                        });
                    }
                    if (this.postForm.caseCategory != ''){
                        category = this.postForm.caseCategory.slice(-1)[0]
                    }
                    if (this.postForm.lostDetail != ''){
                        lost ='损失情况：'+ this.postForm.lostDetail
                    }
                  
                    this.smsContentChange =  this.formatDate(this.postForm.receiptTimeShow) + ' 接到' + this.postForm.reportOrg + ' ' + this.postForm.reporter + '(' + this.postForm.contactPhoneNumber + ")" +
                        '报告在' + this.postForm.caseAddress + '发生一起' + category+ ' 案件。'+lost+',值班技术员：' + tech

                },
                deep: true,

            },

        },
        created() {
            this.getUserList()

            this.search('案件类别').then(response=>{
                this.caseCategoryList = this.processData(response.list)
            });
            this.search('报告单位').then(response=>{
                this.reportOrgList = this.processData(response.list)
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
                    this.postForm.smsReceiverArray = this.postForm.smsReceiver.split(",").map(data => {
                        return parseInt(data);
                    });
                    this.postForm.techUidArray = this.postForm.techUid.split(",").map(data => {
                       return parseInt(data);
                    });

                    if (this.postForm.caseTime.toString().length===10)
                        this.postForm.caseTime =  data.caseTime*1000;
                    var d = new Date(this.postForm.receiptTime * 1000);

                    this.postForm.receiptTimeShow = this.formatDate(d)
                    console.log(this.postForm.techUidArray)
                }).catch(err => {
                    console.log(err)
                })
            },
            submitForm() {

                var data = this.postForm

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

                if (data.caseCategory.constructor === Array) {
                    data.caseCategory = data.caseCategory.slice(-1)[0]
                }
                if (data.reportOrg.constructor === Array) {
                    data.reportOrg = data.reportOrg.slice(-1)[0]
                }

                if (!/^[1-9]+[0-9]*]*$/.test(data.receiptUid)) {
                    data.receiptName = data.receiptUid;
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
