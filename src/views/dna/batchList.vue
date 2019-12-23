<template>
    <div class="app-container">
        <el-divider content-position="left">案件信息</el-divider>
        <div class="tip">
            <el-row :gutter="20" class="mb10">
                <el-col :span="12" >
                    勘查号:{{ heardDetail.evidence ?heardDetail.evidence.selfEvidenceNo: '' }}
                </el-col>
                <el-col :span="12">
                    案件编号:{{ heardDetail.evidence ?heardDetail.evidence.caseNo: '' }}
                </el-col>


            </el-row>
            <el-row :gutter="20" class="mb10">
                <el-col :span="12">
                    发案时间:{{ heardDetail.evidence ?heardDetail.evidence.caseBeginTime: '' }}
                </el-col>
                <el-col :span="12">
                    案件类别:{{ heardDetail.evidence ?heardDetail.evidence.caseCategory : ''}}
                </el-col>

            </el-row>
            <el-row :gutter="20" class="mb10">
                <el-col :span="12">
                    发案地点:{{ heardDetail.evidence ?heardDetail.evidence.caseAddress : ''}}
                </el-col>

            </el-row>


        </div>

        <el-divider content-position="left">批次物证列表</el-divider>
        <div style="float: right;margin-bottom: 10px">
            <el-button type="primary" size="mini" @click="dialogTaskFrom = true">填写任务号</el-button>
            <el-button type="primary" size="mini" @click="submitMaterialinStock">批量存入物证库</el-button>
            <el-button type="primary" size="mini" @click="submitPush">推送痕检</el-button>
            <el-button type="primary" size="mini" @click="dialogTransFrom = true">移交鉴定文书</el-button>
        </div>
        <el-table
                v-loading="listLoading"
                :key="tableKey"
                :data="list"
                border
                fit
                @selection-change="selectTask"
                highlight-current-row
                style="width: 100%;"
        >
            <el-table-column
                    v-model="taskId"
                    type="selection"
                    width="55"/>
            <el-table-column label="物证名称"  align="center" width="120px" >
                <template slot-scope="{row}">
                    <span>{{ row.evidenceMaterial.name	 }}</span>
                </template>
            </el-table-column>
            <el-table-column label="特征描述"  align="center" >
                <template slot-scope="{row}">
                    <span>{{ row.evidenceMaterial.note }}</span>
                </template>
            </el-table-column>
            <el-table-column label="物证类型"  align="center" width="120px" >
                <template slot-scope="{row}">
                    <span>{{ row.evidenceMaterial.materialCategory }}</span>
                </template>
            </el-table-column>
            <el-table-column label="物证类别"   align="center" width="220px">
                <template slot-scope="{row}">
                    <span>{{ row.evidenceMaterial.materialCategory }}</span>
                </template>
            </el-table-column>
            <el-table-column label="遗留部位" align="center" width="120px">
                <template slot-scope="{row}">
                    <span>{{ row.evidenceMaterial.stayPart }}</span>
                </template>
            </el-table-column>
            <el-table-column label="可靠程度" align="center" width="110px">
                <template slot-scope="{row}">
                    <span>{{ row.evidenceMaterial.reliabilityLevel }}</span>
                </template>
            </el-table-column>
            <el-table-column label="利用情况" align="center" width="110px">
                <template slot-scope="{row}">
                    <span>{{ row.evidenceMaterial.usedType }}</span>
                </template>
            </el-table-column>
            <el-table-column label="物证库编号"  align="center" width="120px">
                <template slot-scope="{row}">
                    <span>{{ row.evidenceMaterial.thirdMaterialNo }}</span>
                </template>
            </el-table-column>
            <el-table-column label="状态"  align="center" width="120px">
                <template slot-scope="{row}">
                    <span v-if="row.evidenceMaterialResult.status===1">未填写</span>
                    <span v-if="row.evidenceMaterialResult.status===2">已填写</span>
                </template>
            </el-table-column>
            <el-table-column label="操作" align="center" fixed="right" width="280" class="small-padding fixed-width">
                <template slot-scope="{row}">
                    <!--<router-link :to="{name:'materialResult',params:row}" >-->
                        <!--<el-button v-waves type="success" size="mini" style="width: 90px" icon="el-icon-tickets" :disabled="resultDisable()">填写结果</el-button>-->
                    <!--</router-link>-->
                    <el-button v-waves type="success" size="mini" style="width: 90px" icon="el-icon-tickets" :disabled="resultDisable()" @click="gotoMaterialResult(row)">填写结果</el-button>
                    <!--<el-button type="success" size="mini" style="width: 90px" icon="el-icon-tickets" @click="handleWriteResult(row)">-->
                        <!--填写结果-->
                    <!--</el-button>-->
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
                style="float: right;margin-top: 15px"
        >
        </el-pagination>

        <el-dialog title="填写结果" :close-on-click-modal="false" :visible.sync="dialogResultFrom" width="50%">
            <el-form
                    ref="resultFrom"
                    :model="resultFrom"
                    label-position="left"
                    label-width="100px"
                    style="width:80%; margin-left:50px;">
                <el-row :gutter="20">
                    <el-col :span="12">
                        <el-form-item label="检验人" prop="examUid">
                            <el-select v-model="resultFrom.examUid"
                                       filterable
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
                        <el-form-item label="检验单位" prop="examOrg">
                            <el-input v-model="resultFrom.examOrg"/>
                        </el-form-item>
                    </el-col>
                    <div v-if="resultDetail.stepName === 'DNA送检'">
                        <el-col :span="12">

                            <el-form-item label="检材类型" prop="materialType">
                                <!--<el-input v-model="resultFrom.materialType"/>-->
                                <el-cascader
                                        :options="materialTypeList"
                                        filterable
                                        :props="emitProps"
                                        v-model="resultFrom.materialType"
                                        :filter-method="remoteSearch"
                                        @change="countDict($event,'检材类型')"
                                        :show-all-levels="false"
                                        style="width: 100%">
                                </el-cascader>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="检验结果" prop="examResult">
                                <el-select v-model="resultFrom.examResult" placeholder="请选择" style="width: 100%">
                                    <el-option
                                            v-for="item in examResult"
                                            :key="item.title"
                                            :label="item.title"
                                            :value="item.title"/>
                                </el-select>
                                <el-input v-model="resultFrom.materialDetail"/>

                            </el-form-item>

                        </el-col>
                    </div>
                    <div v-else-if="resultDetail.stepName === '指纹送检'">
                        <el-col :span="24">
                            <el-form-item label="检验结果" prop="idNo">
                                <el-select v-model="resultFrom.examResult" placeholder="请选择" style="width: 100%">
                                    <el-option
                                            v-for="item in examResultF"
                                            :key="item.title"
                                            :label="item.title"
                                            :value="item.title"/>
                                </el-select>
                            </el-form-item>

                        </el-col>
                    </div>

                    <div v-else>
                        <el-col :span="24">
                            <el-form-item label="检验结果" prop="idNo">
                                <el-input v-model="resultFrom.examResult"/>
                            </el-form-item>

                        </el-col>
                    </div>

                    <div v-if="resultDetail.stepName === 'DNA送检' || resultDetail.stepName === '指纹送检'">

                        <el-col :span="12">
                            <el-form-item label="比中人员" prop="checkPeople">
                                <el-input v-model="resultFrom.checkPeople"/>
                                <!--<el-select v-model="resultFrom.checkPeople"-->
                                           <!--filterable-->
                                           <!--:filter-method="filterUserSearch"-->
                                           <!--@visible-change="restUserSearch"-->
                                           <!--class="filter-item"-->
                                           <!--@change="selectUpdate"-->
                                           <!--value-key="id"-->
                                           <!--style="width: 100%">-->
                                    <!--<el-option-->
                                            <!--v-for="item in userShowList"-->
                                            <!--:key="item.id"-->
                                            <!--:label="item.title"-->
                                            <!--:value="item.id"/>-->
                                <!--</el-select>-->
                            </el-form-item>

                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="性别" prop="sex">
                                <el-select v-model="resultFrom.sex" placeholder="请选择"  style="width: 100%">
                                    <el-option
                                            v-for="item in sex"
                                            :key="item.title"
                                            :label="item.title"
                                            :value="item.title"/>
                                </el-select>
                            </el-form-item>

                        </el-col>

                        <el-col :span="12">
                            <el-form-item label="身份证号" prop="idNo">
                                <el-input v-model="resultFrom.idNo"/>

                            </el-form-item>

                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="比中时间" prop="checkOutTime">
                                <el-date-picker
                                        v-model="resultFrom.checkOutTime"
                                        type="date"
                                        value-format="timestamp"
                                        placeholder="选择日期"
                                        style="width: 100%">
                                </el-date-picker>
                            </el-form-item>

                        </el-col>

                        <el-col :span="24">
                            <el-form-item label="户籍地" prop="huji">
                                <el-input v-model="resultFrom.huji"/>
                            </el-form-item>

                        </el-col>
                    </div>
                    <el-col :span="12">
                        <el-form-item label="利用情况" prop="useType">
                            <el-select v-model="resultFrom.usedType" placeholder="请选择"  style="width: 100%">
                                <el-option
                                        v-for="item in usedType"
                                        :key="item.title"
                                        :label="item.title"
                                        :value="item.title"/>
                            </el-select>
                        </el-form-item>

                    </el-col>

                    <el-col :span="12">
                        <!--<el-form-item label="物证是否入库" prop="needPutInStock">-->
                            <!--<el-checkbox v-model="resultFrom.needPutInStock"></el-checkbox>-->
                        <!--</el-form-item>-->
                        <!--<el-form-item label="是否推送痕检" prop="needToPushToCharger">-->

                            <!--<el-checkbox v-model="resultFrom.needToPushToCharger"></el-checkbox>-->
                        <!--</el-form-item>-->

                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="鉴定文书号" prop="documentNo">
                            <el-input v-model="resultFrom.documentNo"/>
                        </el-form-item>

                    </el-col>

                    <el-col :span="12">
                        <!--<el-form-item label="移交鉴定文书" prop="needTransferDocument">-->

                            <!--<el-checkbox v-model="resultFrom.needTransferDocument"></el-checkbox>-->
                        <!--</el-form-item>-->

                    </el-col>
                </el-row>

            <el-divider content-position="left">物证信息</el-divider>

            <el-row :gutter="20">
                <el-col :span="12">
                    <el-form-item label="物证名称" >
                        {{ resultDetail.evidenceMaterial ? resultDetail.evidenceMaterial.name:'' }}
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="提取位置" >
                        {{ resultDetail.evidenceMaterial ? resultDetail.evidenceMaterial.name:'' }}
                    </el-form-item>
                </el-col>

                <el-col :span="12">

                    <el-form-item label="提取方法" >
                        {{  resultDetail.evidenceMaterial ?resultDetail.evidenceMaterial.extractMethod:'' }}
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="可靠程度" >
                        {{ resultDetail.evidenceMaterial ?resultDetail.evidenceMaterial.reliabilityLevel:'' }}
                    </el-form-item>

                </el-col>

                <el-col :span="12">
                    <el-form-item label="提取人" >
                        {{ resultDetail.evidenceMaterial ?resultDetail.evidenceMaterial.extractName:'' }}
                    </el-form-item>

                </el-col>
                <el-col :span="12">
                    <el-form-item label="提取时间" >
                        {{ resultDetail.evidenceMaterial ?resultDetail.evidenceMaterial.extractTime: '' }}
                    </el-form-item>

                </el-col>

            </el-row>

            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogResultFrom = false">
                    取 消
                </el-button>
                <el-button type="primary" @click="writeResult()">
                    确 定
                </el-button>
            </div>
        </el-dialog>



        <el-dialog title="移交鉴定文书" :close-on-click-modal="false" :visible.sync="dialogTransFrom" width="50%">
            <el-form
                    ref="trans"
                    :model="transFrom"
                    label-position="left"
                    label-width="120px"
                    style="width: 80%; margin-left:50px;">

                <el-form-item label="文书号" prop="documentNo">
                    <el-input v-model="transFrom.documentNo"/>
                </el-form-item>


            </el-form>

            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogTransFrom = false">
                    取 消
                </el-button>
                <el-button type="primary" @click="submitTrans()">
                    确 定
                </el-button>
            </div>
        </el-dialog>

        <el-dialog title="填写任务号" :close-on-click-modal="false" :visible.sync="dialogTaskFrom" width="50%">
            <el-form
                    ref="trans"
                    :model="taskFrom"
                    label-position="left"
                    label-width="80px"
                    style="width: 80%; margin-left:50px;">
                <el-form-item label="任务号" prop="dnaTaskNo" v-if="batch.stepName === 'DNA送检'">
                    <el-input v-model="taskFrom.dnaTaskNo"/>
                </el-form-item>
                <el-form-item label="任务号" prop="fpTaskNo" v-if="batch.stepName === '指纹送检'">
                    <el-input v-model="taskFrom.fpTaskNo"/>
                </el-form-item>
                <el-form-item label="任务号" prop="digiTaskNo" v-if="batch.stepName === '电子物证送检'">
                    <el-input v-model="taskFrom.digiTaskNo"/>
                </el-form-item>
                <el-form-item label="任务号" prop="cheTaskNo" v-if="batch.stepName === '理化送检'">
                    <el-input v-model="taskFrom.cheTaskNo"/>
                </el-form-item>

            </el-form>

            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogTaskFrom = false">
                    取 消
                </el-button>
                <el-button type="primary" @click="submitTaskNo()">
                    确 定
                </el-button>
            </div>
        </el-dialog>
    </div>
</template>

<style>
    .mb10 {
        margin-bottom: 10px;
    }
    .tip {
        padding: 8px 16px;
        background-color: #ecf8ff;
        border-radius: 4px;
        border-left: 5px solid #50bfff;
        margin: 20px 0;
    }
</style>

<script>
    import {  medicalDetail } from '@/api/backlog'
    import {  submitSanlu ,submitTaskNo} from '@/api/search'
    import {  batchMaterialList,batchPush } from '@/api/common'
    import waves from '@/directive/waves' // waves directive
    import { parseTime } from '@/utils'
    import { fetchAdminMemberList } from '@/api/permissions'
    import {writeResult} from '@/api/backlog'
    import {fetchList,userDictList} from '@/api/dictionary'
    import {submitMaterialinStock} from '@/api/search'

    export default {
        name: 'materialBatch',
        directives: {waves},
        data() {
            return {
                dialogTransFrom:false,
                dialogTaskFrom:false,
                transFrom:{
                    documentNo:''
                },
                sex: [
                    {

                        title: '未知'
                    }, {

                        title: '男'
                    }, {

                        title: '女'
                    }
                ],
                usedType: [
                    {
                        title: '查档认定'
                    }, {
                        title: '鉴定认定'
                    }, {
                        title: '串并认定'
                    }, {
                        title: '排除嫌疑'
                    }, {
                        title: '其他利用'
                    }, {
                        title: '尚未利用'
                    }
                ],
                examResult: [
                    {
                        title: '未检出'
                    }, {
                        title: '单一分型 '
                    }, {
                        title: '混合可拆分'
                    }, {
                        title: '混合不可拆分'
                    },
                ],
                examResultF: [
                    {
                        title: '比中'
                    }, {
                        title: '未比中'
                    },
                ],
                emitProps:{
                    emitPath:false
                },
                taskId: [],
                tableKey: 0,
                list: null,
                pages: 0,
                listLoading: false,
                paginationShow: true,
                searchTime: '',
                listQuery: {
                    page: 1,
                    batchId: undefined,
                },
                dialogResultFrom: false,
                resultFrom: {
                    materialId: '',
                    batchId: '',
                    examUid: '',
                    examOrg: '',
                    materialType: '',
                    examResult: '',
                    checkPeople: '',
                    sex: '',
                    idNo: '',
                    checkOutTime: '',
                    huji: '',
                    useType: '',
                    documentNo: '',
                    needToPushToCharger: '',
                    needTransferDocument: '',
                    needPutInStock: '',
                    materialDetail: '',
                },
                resultDetail:{},
                userList: [],
                userShowList: [],
                materialTypeList: [],
                curId:'',
                heardDetail:{},
                batch:{},
                taskFrom:{
                    evidenceId:undefined,
                    dnaTaskNo:undefined,
                    fpTaskNo:undefined,
                    digiTaskNo:undefined,
                    cheTaskNo:undefined,
                }
            }
        },
        created() {
            this.batch =  JSON.parse(this.$route.query.batch);
            const id = this.$route.params && this.$route.params.id
            this.curId = id;
            this.getList(id)
            this.getUserList()

            this.heardDetail = this.batch;

            this.heardDetail.evidence.caseBeginTime = parseTime(this.heardDetail.evidence.caseBeginTime,'{y}-{m}-{d} {h}:{i}:{s}');
            this.taskFrom.evidenceId = this.heardDetail.evidence.id;

            this.search('检材类型').then(response=>{
                this.materialTypeList = this.processData(response.list)
            });
        },
        methods: {
            submitTaskNo(){
                submitTaskNo(this.taskFrom).then(response => {
                    if (response.code === 200) {
                        this.$message({
                            message: '操作成功',
                            type: 'success',
                            showClose: true,
                            duration: 2000
                        })
                        this.dialogTaskFrom = false
                    } else {
                        this.$message({
                            message: response.reason,
                            type: 'success',
                            showClose: true,
                            duration: 2000
                        })
                    }
                })
            },
            resultDisable(){
                return this.batch.status === 1 || this.batch.status === -1;
            },
            gotoMaterialResult(row){
                // row.handlerUid = this.batch.handlerUid;
                this.$router.push({ name:'materialResult',params:{id:row.id},query: {result:row.evidenceMaterialResult.id,handlerUid:this.batch.handlerUid, batchId:this.curId,status:row.evidenceMaterialResult.status}})
            },
            submitPush(){
                batchPush({
                    batchId:this.curId
                }).then(response => {
                    if (response.code === 200) {
                        this.$message({
                            message: '操作成功',
                            type: 'success',
                            showClose: true,
                            duration: 2000
                        })

                    } else {
                        this.$message({
                            message: response.reason,
                            type: 'success',
                            showClose: true,
                            duration: 2000
                        })
                    }
                })
            },
            submitMaterialinStock() {
                if (this.taskId.length===0){
                    this.$confirm('请选择提交物证!')
                        .then(_ => {

                        })
                        .catch(_ => {});
                } else{
                    const data = {
                        list: this.taskId
                    }
                    submitMaterialinStock(data).then(response => {
                        if (response.code === 200) {
                            this.$message({
                                message: '操作成功',
                                type: 'success',
                                showClose: true,
                                duration: 2000
                            })

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
            },
            submitTrans(){
                const sendData={
                    evidenceId:this.heardDetail.evidence.id,
                    documentNo:this.transFrom.documentNo,
                }
                submitSanlu(sendData).then(response=>{
                    if (response.code === 200) {
                        this.$message({
                            message: '操作成功',
                            type: 'success',
                            showClose: true,
                            duration: 2000
                        })
                        this.dialogTransFrom = false
                    } else {
                        this.$message({
                            message: response.reason,
                            type: 'success',
                            showClose: true,
                            duration: 2000
                        })
                    }
                })
            },
            selectTask(selection) {
                this.taskId = selection.map(data => {
                    return data.evidenceMaterial.id
                })
            },

            selectUpdate(val) {
                this.$forceUpdate()
            },
            handleWriteResult(task) {
                this.dialogResultFrom = true;
                this.resultFrom.materialId = task.evidenceMaterial.id
                this.resultFrom.batchId = task.batchId
                this.resultDetail = task
                if (this.resultDetail.evidenceMaterial){
                    this.resultDetail.evidenceMaterial.extractTime = parseTime(this.resultDetail.evidenceMaterial.extractTime,'{y}-{m}-{d} {h}:{i}:{s}')
                } if (this.resultDetail.evidence){
                    this.resultDetail.evidence.caseHappenTime = parseTime(this.resultDetail.evidence.extractTime,'{y}-{m}-{d} {h}:{i}:{s}')
                }
                this.resultFrom.usedType = this.resultDetail.evidence.usedType
            },
            writeResult() {
                let data = Object.assign({}, this.resultFrom)

                if(data.checkOutTime && data.checkOutTime.toString().length > 10)
                    data.checkOutTime = parseInt(data.checkOutTime / 1000);
                if(data.checkOutTime === '')
                    data.checkOutTime = 0;


                writeResult(data).then(response => {
                    if (response.code === 200) {
                        this.$message({
                            message: '操作成功',
                            type: 'success',
                            showClose: true,
                            duration: 2000
                        });
                        this.dialogResultFrom = false;
                        this.getList();
                    } else {
                        this.$message({
                            message: response.reason,
                            type: 'success',
                            showClose: true,
                            duration: 2000
                        })
                    }
                })
            },
            getList(id) {
                this.listQuery.batchId = id
                this.listLoading = true;
                batchMaterialList(this.listQuery).then(response => {
                    this.list = response.list;
                    this.pages = response.pages
                    // this.heardDetail = this.list[0];
                    // this.heardDetail.evidence.caseHappenTime = parseTime(this.heardDetail.evidence.caseHappenTime,'{y}-{m}-{d} {h}:{i}:{s}');
                    // Just to simulate the time of the request
                    this.listLoading = false

                })
                const send ={
                    caseId:id
                }

            },
            getUserList() {
                fetchAdminMemberList({}).then(response => {
                    this.userList = response.list.map(data => {
                        return {
                            id: data.id,
                            title: data.realName,
                            py: data.pinyinAbbr
                        }
                    })
                    this.userShowList = this.userList
                })
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
