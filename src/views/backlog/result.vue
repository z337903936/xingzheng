<template>
    <div class="createPost-container">
        <el-form
                ref="resultFrom"
                :model="resultFrom"
                label-position="left"
                label-width="120px"
                style="width: 50%;margin: auto;padding-bottom: 20px">
            <div class="createPost-main-container">
                <el-row :gutter="20">
                    <el-col :span="12">
                        <el-form-item label="检验人" prop="examUid">
                            <el-select v-model="resultFrom.examUid"
                                       filterable
                                       :filter-method="filterUserSearch"
                                       @visible-change="restUserSearch"
                                       class="filter-item"
                                       @change="selectUpdate"
                                       clearable
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
                    <div v-if="stepName === 'DNA送检'">
                        <el-col :span="12">

                            <el-form-item label="检材类型" prop="materialType">
                                <!--<el-input v-model="resultFrom.materialType"/>-->
                                <el-cascader
                                        :options="materialTypeList"
                                        clearable
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
                                <el-select v-model="resultFrom.examResult" placeholder="请选择" style="width: 100%" clearable>
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
                    <div v-else-if="stepName === '指纹送检'">
                        <el-col :span="24">
                            <el-form-item label="检验结果" prop="idNo">
                                <el-select v-model="resultFrom.examResult" placeholder="请选择" style="width: 100%" clearable>
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

                    <div v-if="stepName === 'DNA送检' || stepName === '指纹送检'">

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
                                <el-select v-model="resultFrom.sex" placeholder="请选择"  style="width: 100%" clearable>
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
                                        clearable
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
                            <el-select v-model="resultFrom.useType" clearable placeholder="请选择"  style="width: 100%" @change="selectUpdate">
                                <el-option
                                        v-for="item in usedType"
                                        :key="item.title"
                                        :label="item.title"
                                        :value="item.title"/>
                            </el-select>
                            <el-popover
                                    placement="right"
                                    width="500"
                                    trigger="click"
                            >
                                <el-table :data="usetypeListShow"  height="250">
                                    <el-table-column width="100" property="operatorName" label="操作员"></el-table-column>
                                    <el-table-column width="100" property="useType" label="利用情况"></el-table-column>
                                    <el-table-column width="120" property="evidenceNo" label="现勘号"></el-table-column>
                                    <el-table-column width="140" property="createTime" label="填写时间"></el-table-column>
                                </el-table>
                                <el-button type="primary" slot="reference" plain>利用情况详情</el-button>
                            </el-popover>
                        </el-form-item>

                    </el-col>
                    <el-col :span="24">
                        <el-form-item label="检查图片" >
                            <Upload v-model="resultFrom.imgUrl"></Upload>
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
                        <!--<el-form-item label="鉴定文书号" prop="documentNo">-->
                            <!--<el-input v-model="resultFrom.documentNo"/>-->
                        <!--</el-form-item>-->

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
                <div style="text-align: center">
                    <el-button  style="width: 150px" type="primary"
                                @click="submitForm">保存
                    </el-button>
                    <el-button  style="width:150px" type="primary"
                                @click="gotoNextMaterialResult">下一个物证
                    </el-button>
                </div>



            </div>


        </el-form>
    </div>
</template>

<script>
    import { medicalDetail,writeResult,taskDetails} from '@/api/backlog'
    import {parseTime} from '@/utils'
    import {fetchAdminMemberList} from '@/api/permissions'
    import {fetchList} from '@/api/dictionary'
    import waves from '@/directive/waves' // waves directive
    import {usetypeList} from '@/api/material'
    import {  batchMaterialList,batchPush } from '@/api/common'
    import Upload from '@/components/Upload/SingleImage4'

    export default {
        name: "materialResult",
        directives: {waves},
        components: { Upload },
        props: {
            isEdit: {
                type: Boolean,
                default: false
            }
        },
        data(){
            return{
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
                        title: '尚未利用'
                    }, {
                        title: '查档认定'
                    }, {
                        title: '确定嫌疑'
                    }, {
                        title: '疑似嫌疑'
                    }, {
                        title: '排除嫌疑'
                    },   {
                        title: '鉴定认定'
                    }, {
                        title: '串并认定'
                    }, {
                        title: '其他利用'
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
                    imgUrl: '',
                    id:undefined,
                },
                resultDetail:{},
                userList: [],
                userShowList: [],
                materialTypeList: [],
                stepName:'',
                emitProps:{
                    emitPath:false
                },
                material:{},
                usetypeListShow:null,
                batchId:null,
                listQuery: {
                    page: 0,
                    batchId: undefined,
                },
                list:[],
                // next:undefined,
                next:{
                    id:undefined,
                    handlerUid:undefined,
                    result:undefined,
                    status:undefined,
                    batchId:undefined,
                },
                curId:null
            }
        },
        created() {
            this.getUserList()
            this.search('检材类型').then(response=>{
                this.materialTypeList = this.processData(response.list)
            });

            const id = this.$route.params && this.$route.params.id;
            this.batchId = this.$route.query.batchId;
            this.resultFrom.examUid = this.$store.getters.id;
            this.resultFrom.batchId =  this.batchId
            this.resultFrom.id = id;
            this.curId = id;
            this.getList(this.batchId);

            // this.material = JSON.parse(this.$route.query.material);
            // console.log(this.material);

            this.resultFrom.examOrg =  this.$store.getters.orgName

            this.next.batchId = this.batchId;
            this.next.handlerUid = this.resultFrom.examUid;
            let status = this.$route.query.status;
            let result = this.$route.query.result;
            if (status !== 1) {
                this.fetchData(result)
            }


        },
        methods:{
            gotoNextMaterialResult(){

                if (!this.next.id) {
                    this.submitForm();
                    this.$confirm('暂无下一条数据!')
                        .then(_ => {

                        })
                        .catch(_ => {});
                }else{
                    this.submitForm();
                    this.$store.dispatch('delView', this.$route)
                    this.$router.push({ name:'materialResult',params:{id:this.next.id},query: {result:this.next.result,handlerUid:this.next.handlerUid, batchId:this.next.batchId,status:this.next.status}})
                }

            },

            getList(id) {

                this.listQuery.batchId = id
                let  next = false;

                batchMaterialList(this.listQuery).then(response => {
                    this.list = response.list;

                    this.list.map(item=>{
                        if (item.id === Number(this.curId )){
                            this.material = item;
                            next = true;
                        }
                        if (next && item.id!==Number(this.curId )){
                            this.next.id = item.id;
                            this.next.result = item.evidenceMaterialResult.id;
                            this.next.status = item.evidenceMaterialResult.status;
                            next=false;
                        }

                    })
                    this.getUseType();
                    this.resultDetail = this.material;

                    this.resultDetail.evidenceMaterial.extractTime = parseTime(this.resultDetail.evidenceMaterial.extractTime,'{y}-{m}-{d} {h}:{i}:{s}')
                    this.stepName =  this.resultDetail.stepName
                    this.resultFrom.materialId =  this.material.evidenceMaterial.id
                    if (this.$route.query.status !== 1) {

                    }else{

                        this.resultFrom.useType =  this.material.evidenceMaterial.useType
                    }


                })


            },
            getUseType(){
                if (this.material.evidenceMaterial){
                    const data={
                        materialId:this.material.evidenceMaterial.id
                    }
                    usetypeList(data).then(response=>{
                        this.usetypeListShow = response.list.map(item=>{
                            item.createTime = parseTime(item.createTime,'{y}-{m}-{d}')
                            return item;
                        })
                    })
                }
            },
            selectUpdate(val) {
                this.$forceUpdate()
            },
            fetchData(id) {
                taskDetails(id).then(data => {
                    if(data.checkOutTime && data.checkOutTime.toString().length === 10)
                        data.checkOutTime = data.checkOutTime * 1000;
                    this.resultFrom = Object.assign({}, data);
                    this.resultFrom.batchId =  this.batchId;

                    // this.resultDetail = Object.assign({}, data);

                }).catch(err => {
                    console.log(err)
                })
            },
            submitForm(){
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
            countDict(val,type){
                if (val) {
                    if (val.constructor === Array){
                        val.map(data=>{
                            const send={
                                name:data,
                                cateName:type
                            };
                            this.$store.dispatch('PostUserUseDict', send)
                        })
                    }else{
                        const send={
                            name:val,
                            cateName:type
                        };
                        this.$store.dispatch('PostUserUseDict', send)
                    }
                }
            },

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
