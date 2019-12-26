<template>
    <div class="createPost-container">
        <el-form
                ref="resultFrom"
                :model="resultFrom"
                label-position="left"
                label-width="120px"
                style="width: 70%;margin: auto;padding-bottom: 20px">
            <div class="createPost-main-container">
                <el-row :gutter="20">
                    <el-col :span="12">
                        <el-form-item label="检测结果" prop="result">
                            <el-input v-model="resultFrom.result"/>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="勘查号" prop="evidenceNo">
                            <el-input v-model="resultFrom.evidenceNo"/>
                        </el-form-item>
                    </el-col>
                </el-row>

                <el-row :gutter="20">
                    <el-col :span="12">

                        <el-form-item label="文书号" prop="documentNo">
                            <el-input v-model="resultFrom.documentNo"/>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">

                        <el-form-item label="文书日期" prop="documentDate">
                            <el-date-picker
                                    v-model="resultFrom.documentDate"
                                    type="date"
                                    clearable
                                    value-format="timestamp"
                                    placeholder="选择日期"
                                    style="width: 100%">
                            </el-date-picker>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row :gutter="20">
                    <el-col :span="12">
                        <el-form-item label="任务编号" prop="taskNo">
                            <el-input v-model="resultFrom.taskNo"/>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="案件类别" prop="caseCategory">
                            <el-cascader
                                    :options="caseCategoryList"
                                    filterable
                                    clearable
                                    @change="countDict"
                                    v-model="resultFrom.caseCategory"
                                    :filter-method="remoteSearch"
                                    :show-all-levels="false"
                                    placeholder="案件类别"
                                    style="width: 100%;">
                            </el-cascader>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row :gutter="20">
                    <el-col :span="12">
                        <el-form-item label="委托日期" prop="delegateTime">
                            <el-date-picker
                                    v-model="resultFrom.delegateTime"
                                    type="date"
                                    clearable
                                    value-format="timestamp"
                                    placeholder="选择日期"
                                    style="width: 100%">
                            </el-date-picker>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="委托单位" prop="delegateOrg">
                            <el-input v-model="resultFrom.delegateOrg"/>
                        </el-form-item>
                    </el-col>
                </el-row>

                <el-row :gutter="20">
                    <el-col :span="12">
                        <el-form-item label="委托人" prop="delegateName">
                            <el-select v-model="resultFrom.delegateUid"
                                       filterable
                                       clearable
                                       :filter-method="filterUserSearch"
                                       @visible-change="restUserSearch"
                                       class="filter-item"
                                       @change="selectUpdate"
                                       value-key="id"
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

                        <el-form-item label="简要案情" prop="digest">
                            <el-input v-model="resultFrom.digest"/>
                        </el-form-item>
                    </el-col>
                </el-row>

                <el-row :gutter="20">
                    <el-col :span="12">
                        <el-form-item label="死者情况" prop="deathDetail">
                            <el-input v-model="resultFrom.deathDetail"/>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">

                        <el-form-item label="提取检材" prop="extractMaterial">
                            <el-input v-model="resultFrom.extractMaterial"/>
                        </el-form-item>
                    </el-col>
                </el-row>


                <el-row :gutter="20">
                    <el-col :span="12">
                        <el-form-item label="检材去向" prop="materialTo">
                            <el-input v-model="resultFrom.materialTo"/>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">

                        <el-form-item label="检验人" prop="examName">
                            <el-select v-model="resultFrom.examUid"
                                       filterable
                                       clearable
                                       :filter-method="filterUserSearch"
                                       @visible-change="restUserSearch"
                                       class="filter-item"
                                       @change="selectUpdate"
                                       value-key="id"
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
                        <el-form-item label="法医任务号" prop="medicalTaskNo">
                            <el-input v-model="resultFrom.medicalTaskNo"/>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="鉴定结论" prop="conclusion">
                            <el-select v-model="resultFrom.conclusion"
                                       filterable
                                       clearable
                                       class="filter-item"
                                       @change="selectUpdate"
                                       value-key="id"
                                       style="width: 100%">
                                <el-option
                                        v-for="item in conclusion"
                                        :key="item.title"
                                        :label="item.title"
                                        :value="item.title"/>
                            </el-select>
                        </el-form-item>


                    </el-col>
                </el-row>
                <!--<el-form-item label="是否推送给主办痕检" prop="needToPushToCharger">-->
                <!--<el-checkbox v-model="resultFrom.needToPushToCharger"></el-checkbox>-->
                <!--</el-form-item>-->



                <el-form-item label="备注栏" prop="note">
                    <el-input v-model="resultFrom.note" type="textarea"
                              :autosize="{ minRows: 2, maxRows: 4}"/>
                </el-form-item>
            </div>


            <el-form-item style="margin-bottom: 40px;text-align: center;" label-width="100px">
                <el-button   style="width: 200px" type="primary"
                           @click="submitForm">保存
                </el-button>
            </el-form-item>

        </el-form>
    </div>
</template>

<script>
    import { medicalWriteResult,medicalDetails } from '@/api/backlog'
    import {parseTime} from '@/utils'
    import {fetchAdminMemberList} from '@/api/permissions'
    import {fetchList} from '@/api/dictionary'
    import waves from '@/directive/waves' // waves directive

    export default {
        name: "medicalResult",
        directives: {waves},
        props: {
            isEdit: {
                type: Boolean,
                default: false
            }
        },
        data(){
            return{
                conclusion: [
                    {
                        title: '轻微伤'
                    }, {
                        title: '轻伤二级 '
                    }, {
                        title: '轻伤一级'
                    }, {
                        title: '重伤二级'
                    },{
                        title: '重伤一级'
                    },{
                        title: '未构成轻微伤'
                    },{
                        title: '不予评定'
                    },{
                        title: '不予受理'
                    },{
                        title: '评伤残等级'
                    },
                ],
                resultFrom: {
                    id: '',
                    result: '',
                    documentNo: '',
                    documentDate: '',
                    taskNo: '',
                    delegateUid: '',
                    digest: '',
                    deathDetail: '',
                    extractMaterial: '',
                    conclusion: '',
                    examUid: '',
                    materialTo: '',
                    caseCategory: '',
                    note: '',
                    needToPushToCharger: '',
                    usedType: '',
                    medicalTaskNo: '',
                    delegateTime: '',
                },
                userList: [],
                userShowList: [],
                caseCategoryList: [],
                evidenceDetail:'',

            }
        },
        created() {
            this.getUserList();
            this.search('案件类别').then(response => {
                this.caseCategoryList = this.processData(response.list)
            });
            this.evidenceDetail = JSON.parse(this.$route.query.evidence);
            if (this.$route.query.isDetail){
                this.fetchData(this.evidenceDetail.id)
            } else{
                this.fetchData(this.evidenceDetail.evidenceMedicalRecord.id)
            }

        },
        methods:{
            fetchData(id) {
                medicalDetails(id).then(data => {
                    if(data.documentDate && data.documentDate.toString().length === 10)
                        data.documentDate = data.documentDate * 1000;
                    if(data.delegateTime && data.delegateTime.toString().length === 10)
                        data.delegateTime = data.delegateTime * 1000;
                    this.$delete(data,'filters')
                    this.resultFrom = data;

                    if (!this.resultFrom.delegateUid) {
                        this.resultFrom.delegateUid = ''
                    }


                }).catch(err => {
                    console.log(err)
                })
            },
            selectUpdate(val) {
                this.$forceUpdate()
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
            countDict(val) {
                val = val.slice(-1)[0]
                const send = {
                    name: val
                };
                this.$store.dispatch('PostUserUseDict', send)
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
            remoteSearch(node, value) {
                var p = /^[a-zA-Z]+$/;
                if (p.test(value)) {
                    if (node.data.py.toLowerCase().indexOf(value.toLowerCase()) > -1)
                        return true
                } else {
                    if (node.data.label.indexOf(value) > -1)
                        return true
                }
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
            filterSearch(node, value) {
                var p = /^[a-zA-Z]+$/
                if (p.test(value)) {
                    if (node.data.py.toLowerCase().indexOf(value.toLowerCase()) > -1) {
                        return true
                    }
                } else {
                    if (node.data.label.indexOf(value) > -1) {
                        return true
                    }
                }
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
            submitForm(){
                // let data = Object.assign({}, this.resultFrom)
                let data = {
                    id: this.resultFrom.id,
                    result: this.resultFrom.result,
                    documentNo: this.resultFrom.documentNo,
                    documentDate: this.resultFrom.documentDate,
                    taskNo: this.resultFrom.taskNo,
                    delegateUid: this.resultFrom.delegateUid,
                    digest: this.resultFrom.digest,
                    deathDetail: this.resultFrom.deathDetail,
                    extractMaterial: this.resultFrom.extractMaterial,
                    conclusion: this.resultFrom.conclusion,
                    examUid: this.resultFrom.examUid,
                    materialTo: this.resultFrom.materialTo,
                    caseCategory: this.resultFrom.caseCategory,
                    note: this.resultFrom.note,
                    needToPushToCharger: this.resultFrom.needToPushToCharger,
                    usedType: this.resultFrom.usedType,
                    medicalTaskNo: this.resultFrom.medicalTaskNo,
                    delegateTime: this.resultFrom.delegateTime,
                };
                if (data.documentDate.toString().length > 10)
                    data.documentDate = parseInt(data.documentDate / 1000);
                if (data.delegateTime.toString().length > 10)
                    data.delegateTime = parseInt(data.delegateTime / 1000);
                    data.medicalTaskNo = data.evidence.medicalTaskNo
                    delete data.evidence
                    delete data.filters
                    medicalWriteResult(data).then(response => {
                        if (response.code === 200) {
                            this.$message({
                                message: '操作成功',
                                type: 'success',
                                showClose: true,
                                duration: 2000
                            });
                        } else {
                            this.$message({
                                message: response.reason,
                                type: 'success',
                                showClose: true,
                                duration: 2000
                            })
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

