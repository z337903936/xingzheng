<template>
    <div class="app-container">
        <!--<div class="filter-container">-->
            <!--<div>-->
                <!--<el-date-picker-->
                        <!--v-model="searchTime"-->
                        <!--type="datetimerange"-->
                        <!--range-separator="至"-->
                        <!--start-placeholder="移交开始时间"-->
                        <!--end-placeholder="移交结束时间"-->
                        <!--value-format="timestamp"-->
                        <!--style="width: 405px;"-->
                <!--/>-->
                <!--<el-input v-model="listQuery.materialNo" placeholder="物证编号" class="mb10" style="width: 200px;"-->
                          <!--@keyup.enter.native="handleFilter"/>-->
                <!--<el-input v-model="listQuery.evidenceNo" placeholder="勘查号" class="mb10" style="width: 200px;"-->
                          <!--@keyup.enter.native="handleFilter"/>-->
                <!--<el-input v-model="listQuery.storagePlace" placeholder="物证库" class="mb10" style="width: 200px;"-->
                          <!--@keyup.enter.native="handleFilter"/>-->
                <!--<div style="margin-top: 15px">-->
                    <!--<el-input v-model="listQuery.fromName" placeholder="移交人" class="mb10" style="width: 200px;"-->
                              <!--@keyup.enter.native="handleFilter"/>-->
                    <!--<el-input v-model="listQuery.filters" placeholder="关键字" class="mb10" style="width: 200px;"-->
                              <!--@keyup.enter.native="handleFilter"/>-->
                    <!--<el-button v-waves type="primary" icon="el-icon-search" @click="reset"-->
                               <!--style="float: right;margin-right: 20px">-->
                        <!--清空搜索条件-->
                    <!--</el-button>-->
                    <!--<el-button v-waves type="primary" icon="el-icon-search" @click="handleFilter" style="float: right;margin-right: 20px">-->
                        <!--搜索-->
                    <!--</el-button>-->
                    <!--<router-link :to="'/material/create'" style="float: right;margin-right: 20px">-->
                        <!--<el-button v-waves type="primary"  icon="el-icon-edit">添加</el-button>-->
                    <!--</router-link>-->
                <!--</div>-->



                <!--<el-button v-waves :loading="downloadLoading" type="primary" icon="el-icon-download" @click="handleDownload">-->
                <!--导出-->
                <!--</el-button>-->
            <!--</div>-->
        <!--</div>-->
        <div class="tip">
            <el-row :gutter="20" class="mb10">
                <el-col :span="12" >
                    勘查号:{{ heardDetail.evidence ?heardDetail.evidence.selfEvidenceNo: '' }}
                </el-col>
                <el-col :span="12">
                    简要案情:{{ heardDetail.evidence ?( heardDetail.evidence.caseHappenTime +'在'+ heardDetail.evidence.caseAddress + heardDetail.evidence.caseCategory +'案'): '' }}
                </el-col>


            </el-row>
            <el-row :gutter="20" class="mb10">
                <el-col :span="12">
                    移交人:{{ heardDetail.evidenceMaterial ?heardDetail.evidenceMaterial.transferName: '' }}
                </el-col>
                <el-col :span="12">
                    移交时间:{{ heardDetail.evidenceMaterial ?heardDetail.evidenceMaterial.transferTime : ''}}
                </el-col>

            </el-row>
            <el-row :gutter="20" class="mb10">

                <el-col :span="12">
                    申请人:{{ heardDetail.evidence ?heardDetail.evidence.createName : ''}}
                </el-col>



            </el-row>


        </div>

        <el-divider content-position="left"></el-divider>
        <el-table
                v-loading="listLoading"
                :key="tableKey"
                :data="list"
                border
                fit
                highlight-current-row
                style="width: 100%;"
        >
            <el-table-column label="物证名称" align="center" width="180">
                <template slot-scope="{row}">
                    <span>{{ row.evidenceMaterial.name }}</span>
                </template>
            </el-table-column>
            <el-table-column label="物证类别" width="150" align="center">
                <template slot-scope="{row}">
                    <span>{{ row.evidenceMaterial.materialCategory  }}</span>
                </template>
            </el-table-column>
            <el-table-column label="保存时限"  align="center">
                <template slot-scope="{row}">
                    <span>{{ row.evidenceMaterial.storageDuration }}</span>
                </template>
            </el-table-column>
            <el-table-column label="物证库存放位置"  align="center">
                <template slot-scope="{row}">
                    <span>{{ row.evidenceMaterial.storagePlace }}</span>
                </template>
            </el-table-column>
            <el-table-column label="物证编号" width="300" align="center">
                <template slot-scope="{row}">
                    <span>
                        <barcode v-model="row.evidenceMaterial.materialNo">
                            Show this if the rendering fails.
                        </barcode>
                    </span>
                </template>
            </el-table-column>
            <el-table-column label="出库用途"  align="center">
                <template slot-scope="{row}">
                    <span>{{ row.evidenceMaterial.borrowReason }}</span>
                </template>
            </el-table-column>

            <el-table-column label="操作" align="center" width="230" fixed="right" class-name="small-padding fixed-width">
                <template slot-scope="{row}">
                    <el-button v-waves type="primary" size="mini" icon="el-icon-edit"  style="width: 70px" @click="handleAction(row)" >
                        编辑
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

        <el-dialog title="销毁申请" :close-on-click-modal="false" :visible.sync="dialogdeleteForm" width="40%">
            <el-form
                    ref="rules"
                    :model="deleteForm"
                    label-position="left"
                    label-width="70px"
                    style="width: 80%; margin-left:50px;">
                <el-form-item label="理由" prop="reason">
                    <el-input v-model="deleteForm.reason"/>
                </el-form-item>

            </el-form>

            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogdeleteForm = false">
                    取 消
                </el-button>
                <el-button type="primary" @click="pushDelete()">
                    确 定
                </el-button>
            </div>
        </el-dialog>

        <el-dialog title="操作" :close-on-click-modal="false" :visible.sync="dialogActionForm" width="40%">
            <el-form
                    ref="rules"
                    :model="actionForm"
                    label-position="left"
                    label-width="140px"
                    style="width: 80%; margin-left:50px;">
               <div v-if="actionForm.stepName === '申请物证入库'">
                   <el-form-item label="物证库存放位置" prop="storagePlace">
                       <el-select v-model="actionForm.storagePlace" placeholder="请选择" clearable center style="width: 100%">
                           <el-option
                                   v-for="item in storagePlace"
                                   :key="item.value"
                                   :label="item.value"
                                   :value="item.value"
                           />
                       </el-select>
                   </el-form-item>
                   <el-form-item label="保存时限" prop="storageDuration">
                       <el-select v-model="actionForm.storageDuration" placeholder="请选择" clearable center style="width: 100%">
                           <el-option
                                   v-for="item in storageDuration"
                                   :key="item.title"
                                   :label="item.title"
                                   :value="item.title"
                           />
                       </el-select>
                   </el-form-item>
               </div>

                <div v-if="actionForm.stepName === '申请物证出库'">
                    <el-form-item label="出库用途" prop="borrowReason">
                        <el-select v-model="actionForm.borrowReason" placeholder="请选择" clearable center style="width: 100%">
                            <el-option
                                    v-for="item in borrowReason"
                                    :key="item.value"
                                    :label="item.value"
                                    :value="item.value"
                            />
                        </el-select>
                    </el-form-item>
                </div>

            </el-form>

            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogActionForm = false">
                    取 消
                </el-button>
                <el-button type="primary" @click="editAction()">
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
        color: #606266;
    }
</style>

<script>
    import {fetchMaterialList,delMaterial,applyDelMaterial,updateMaterial} from '@/api/material'
    import waves from '@/directive/waves' // waves directive
    import {parseTime,formatDate} from '@/utils'
    import { fetchAdminMemberList} from '@/api/permissions'
    import {  batchMaterialList } from '@/api/common'
    import {fetchList} from '@/api/dictionary'
    import VueBarcode from 'vue-barcode';

    export default {
        name: 'Material',
        directives: {waves},
        components: {
            'barcode': VueBarcode
        },
        data() {
            return {
                storageDuration: [
                    {
                        title: '临时保存'
                    }, {
                        title: '永久保存'
                    }
                ],
                tableKey: 0,
                list: null,
                activeName: 'first',
                pages: 0,
                listLoading: false,
                paginationShow: true,
                searchTime: '',
                limit: 20,
                deleteForm: {
                    id:undefined,
                    reason:undefined
                },

                listQuery: {
                    page: 1,
                    batchId: undefined,
                },
                rules:{},
                downloadLoading: false,
                dialogdeleteForm: false,
                heardDetail:{},
                dialogActionForm:false,
                actionForm:{
                    id:undefined,
                    storagePlace:undefined,
                    storageDuration:undefined,
                    borrowReason:undefined,
                },
                borrowReason:[],
                storagePlace:[],
                curId:'',
            }
        },
        created(){
            const id = this.$route.params && this.$route.params.id
            this.curId = id;
            this.getList(id)
            this.search('出库用途').then(response=>{
                this.borrowReason = this.processData(response.list)
            });
            this.search('物证库存放位置').then(response=>{
                this.storagePlace = this.processData(response.list)
            });
        },
        methods: {
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
            handleAction(data){
                // this.actionForm = data.evidenceMaterial;
                this.actionForm.stepName = data.stepName
                this.actionForm.id = data.materialId
                this.dialogActionForm = true;
            },
            editAction(){
                console.log(this.actionForm)
                updateMaterial(this.actionForm).then(response=>{
                    if (response.code === 200) {
                        this.$message({
                            message: '操作成功',
                            type: 'success',
                            showClose: true,
                            duration: 2000
                        })
                        this.getList(this.curId)
                        this.dialogActionForm = false;
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
            handleDelete(val){
                this.deleteForm.id = val.id;
                this.dialogdeleteForm = true;
            },
            pushDelete(){
                applyDelMaterial(this.deleteForm).then(response=>{
                    if (response.code === 200) {
                        this.$message({
                            message: '操作成功',
                            type: 'success',
                            showClose: true,
                            duration: 2000
                        })
                        this.getList(this.curId)
                        this.dialogdeleteForm = false;
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
                this.listQuery.batchId = id;
                this.listLoading = true;
                batchMaterialList(this.listQuery).then(response => {
                    this.list = response.list;
                    this.pages = response.pages;
                    this.heardDetail =   this.list[0];
                    this.heardDetail.evidence.caseHappenTime = formatDate(this.heardDetail.evidence.caseHappenTime)?formatDate(this.heardDetail.evidence.caseHappenTime):''
                    this.heardDetail.evidenceMaterial.transferTime= parseTime(this.heardDetail.evidenceMaterial.transferTime,'{y}-{m}-{d} {h}:{i}:{s}')
                    this.heardDetail.evidence.createTime = parseTime(this.heardDetail.evidence.createTime,'{y}-{m}-{d} {h}:{i}:{s}')
                    // Just to simulate the time of the request

                        this.listLoading = false

                })
            },
            reset() {
                this.listQuery = {
                    page: 1,
                    beginTime: undefined,
                    endTime: undefined,
                    filters: undefined,
                    fromName: undefined,
                    storagePlace: undefined,
                    evidenceNo: undefined,
                    materialNo: undefined
                };
                this.searchTime = '';
            },
            handleFilter () {
                if (this.searchTime[0].toString().length>10)
                    this.listQuery.beginTime = this.searchTime[0]/1000;
                if (this.searchTime[1].toString().length>10)
                    this.listQuery.endTime = this.searchTime[1]/1000;
                this.listQuery.page = 1;
                this.getList()
            },
            //
            // handleDownload() {
            //     this.downloadLoading = true
            //     import('@/vendor/Export2Excel').then(excel => {
            //         const tHeader = ['timestamp', 'title', 'type', 'importance', 'status']
            //         const filterVal = ['timestamp', 'title', 'type', 'importance', 'status']
            //         const data = this.formatJson(filterVal, this.list)
            //         excel.export_json_to_excel({
            //             header: tHeader,
            //             data,
            //             filename: 'table-list'
            //         })
            //         this.downloadLoading = false
            //     })
            // },
            // formatJson(filterVal, jsonData) {
            //     return jsonData.map(v => filterVal.map(j => {
            //         if (j === 'timestamp') {
            //             return parseTime(v[j])
            //         } else {
            //             return v[j]
            //         }
            //     }))
            // },

        }
    }
</script>
