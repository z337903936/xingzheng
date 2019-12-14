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
            <el-table-column label="物证名称"  align="center" width="220px" >
                <template slot-scope="{row}">
                    <span>{{ row.evidenceMaterial.name	 }}</span>
                </template>
            </el-table-column>
            <el-table-column label="特征描述"  align="center" width="220px" >
                <template slot-scope="{row}">
                    <span>{{ row.evidenceMaterial.note }}</span>
                </template>
            </el-table-column>
            <el-table-column label="物证类型"  align="center" width="220px" >
                <template slot-scope="{row}">
                    <span>{{ row.evidenceMaterial.materialCategory }}</span>
                </template>
            </el-table-column>
            <el-table-column label="物证类别"   align="center" width="320px">
                <template slot-scope="{row}">
                    <span>{{ row.evidenceMaterial.materialCategory }}</span>
                </template>
            </el-table-column>
            <el-table-column label="遗留部位" align="center" width="320px">
                <template slot-scope="{row}">
                    <span>{{ row.evidenceMaterial.stayPart }}</span>
                </template>
            </el-table-column>
            <el-table-column label="可靠程度" align="center" width="320px">
                <template slot-scope="{row}">
                    <span>{{ row.evidenceMaterial.reliabilityLevel }}</span>
                </template>
            </el-table-column>
            <el-table-column label="利用情况" align="center" width="320px">
                <template slot-scope="{row}">
                    <span>{{ row.evidenceMaterial.usedType }}</span>
                </template>
            </el-table-column>
            <el-table-column label="物证库编号"  align="center" width="320px">
                <template slot-scope="{row}">
                    <span>{{ row.evidenceMaterial.thirdMaterialNo }}</span>
                </template>
            </el-table-column>
            <el-table-column label="操作" align="center" fixed="right" width="280" class="small-padding fixed-width">
                <template slot-scope="{row}">
                    <el-button type="success" size="mini" style="width: 90px" icon="el-icon-tickets" @click="handleWriteResult(row)">
                        填写结果
                    </el-button>
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
                    <div v-if="resultDetail.stepName === 'DNA检测'">
                        <el-col :span="12">

                            <el-form-item label="检材类型" prop="materialType">
                                <el-input v-model="resultFrom.materialType"/>
                                <el-cascader
                                        :options="materialTypeList"
                                        filterable
                                        slot="reference"
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
                                <el-input v-model="resultFrom.examResult"/>

                            </el-form-item>

                        </el-col>
                    </div>
                    <div v-else-if="resultDetail.stepName === '指纹检测'">
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

                    <div v-if="resultDetail.stepName === 'DNA检测' || resultDetail.stepName === '指纹检测'">

                        <el-col :span="12">
                            <el-form-item label="比中人员" prop="checkPeople">
                                <el-select v-model="resultFrom.checkPeople"
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
                        <el-form-item label="是否推送痕检" prop="needToPushToCharger">

                            <el-checkbox v-model="resultFrom.needToPushToCharger"></el-checkbox>
                        </el-form-item>

                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="鉴定文书号" prop="documentNo">
                            <el-input v-model="resultFrom.documentNo"/>
                        </el-form-item>

                    </el-col>

                    <el-col :span="12">
                        <el-form-item label="移交鉴定文书" prop="needTransferDocument">

                            <el-checkbox v-model="resultFrom.needTransferDocument"></el-checkbox>
                        </el-form-item>

                    </el-col>
                </el-row>
            <el-divider content-position="left">物证信息</el-divider>
            <el-row :gutter="20">
                <el-col :span="12">
                    <el-form-item label="物证名称" >
                        {{ resultDetail.evidenceMaterial.name }}
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="提取位置" >
                        {{ resultDetail.evidenceMaterial.name }}
                    </el-form-item>
                </el-col>

                <el-col :span="12">

                    <el-form-item label="提取方法" >
                        {{ resultDetail.evidenceMaterial.extractMethod }}
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="可靠程度" >
                        {{ resultDetail.evidenceMaterial.reliabilityLevel }}
                    </el-form-item>

                </el-col>

                <el-col :span="12">
                    <el-form-item label="提取人" >
                        {{ resultDetail.evidenceMaterial.extractName }}
                    </el-form-item>

                </el-col>
                <el-col :span="12">
                    <el-form-item label="提取时间" >
                        {{ resultDetail.evidenceMaterial.extractTime | parseTime('{y}-{m}-{d} {h}:{i}:{s}')  }}
                    </el-form-item>

                </el-col>

            </el-row>
            <el-divider content-position="left">案件信息</el-divider>
            <el-row :gutter="20">
                <el-col :span="12">
                    <el-form-item label="勘查号" >
                        {{ resultDetail.evidence.evidenceNo }}
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="案件编号">
                        {{ resultDetail.evidence.caseNo }}
                    </el-form-item>
                </el-col>

                <el-col :span="12">
                    <el-form-item label="发案时间 ">
                        {{ resultDetail.evidence.caseHappenTime }}
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="案件类别" >
                        {{ resultDetail.evidence.caseCategory }}
                    </el-form-item>
                </el-col>

                <el-col :span="12">
                    <el-form-item label="发案地点" >
                        {{ resultDetail.evidence.caseAddress }}
                    </el-form-item>
                </el-col>

            </el-row>
                <el-form-item label="物证是否入库" prop="needPutInStock">
                    <el-checkbox v-model="resultFrom.needPutInStock"></el-checkbox>
                </el-form-item>
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
    </div>
</template>

<style>
    .mb10 {
        margin-bottom: 10px;
    }
</style>

<script>
    import {  medicalDetail } from '@/api/backlog'
    import {  batchMaterialList } from '@/api/common'
    import waves from '@/directive/waves' // waves directive
    import { parseTime } from '@/utils'
    import { fetchAdminMemberList } from '@/api/permissions'
    import {writeResult} from '@/api/backlog'
    import {fetchList,userDictList} from '@/api/dictionary'

    export default {
        name: 'materialBatch',
        directives: {waves},
        data() {
            return {
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
                    id: '',
                    examUid: '',
                    examOrg: '',
                    materialType: '',
                    examResult: '',
                    checkPeople: '',
                    sex: '',
                    idNo: '',
                    checkOutTime: undefined,
                    huji: '',
                    useType: '',
                    documentNo: '',
                    needToPushToCharger: '',
                    needTransferDocument: '',
                    needPutInStock: '',
                },
                resultDetail:{},
                userList: [],
                userShowList: [],
                materialTypeList: [],
                curName:'',

            }
        },
        created() {
            const id = this.$route.params && this.$route.params.id
            this.getList(id)
            this.getUserList()
            this.search('检材类型').then(response=>{
                this.materialTypeList = this.processData(response.list)
            });
        },
        methods: {
            selectUpdate(val) {
                this.$forceUpdate()
            },
            handleWriteResult(task) {
                this.dialogResultFrom = true;
                this.resultFrom.id = task.id
                this.resultDetail = task
            },
            writeResult() {
                let data = Object.assign({}, this.resultFrom)
                if (data.checkOutTime.toString().length > 10)
                    data.checkOutTime = parseInt(data.checkOutTime / 1000);
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
