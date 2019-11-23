<template>
    <div class="app-container">

           <div  style="width: 60%;margin: auto;padding-bottom: 20px">
               <div style="padding-bottom: 5px">
                   <el-button type="primary" size="mini" @click="dialogMaterialListForm=true">添加物证</el-button>
                   <el-button type="primary" size="mini" @click="">批量提交</el-button>
               </div>
               <el-table
                       :data="materialList"
                       height="200"
                       border
                       max-height="200"
                      >
                   <el-table-column
                           prop="materialNo"
                           label="物证编码"
                   >
                       <template slot-scope="{row}">
                           <span>{{ row.materialNo }}</span>
                       </template>
                   </el-table-column>
                   <el-table-column
                           prop="thirdMaterialNo"
                           label="物证库编号"
                   >
                       <template slot-scope="{row}">
                           <span>{{ row.thirdMaterialNo }}</span>
                       </template>
                   </el-table-column>
                   <el-table-column
                           prop="materialCategory"
                           label="物证类别">
                       <template slot-scope="{row}">
                           <span>{{ row.materialCategory }}</span>
                       </template>
                   </el-table-column>
                   <el-table-column
                           prop="materialType"
                           label="物证类型">
                       <template slot-scope="{row}">
                           <span>{{ row.materialTypeShow }}</span>
                       </template>
                   </el-table-column>
                   <el-table-column
                           prop="extractTime"
                           label="提取日期">
                       <template slot-scope="{row}">
                           <span>{{ row.extractTime }}</span>
                       </template>
                   </el-table-column>
                   <el-table-column
                           prop="extractMethod"
                           label="提取方法">
                       <template slot-scope="{row}">
                           <span>{{ row.extractMethod }}</span>
                       </template>
                   </el-table-column>
                   <el-table-column
                           prop="extractUid"
                           label="提取人">
                       <template slot-scope="{row}">
                           <span>{{ row.extractUidShow }}</span>
                       </template>
                   </el-table-column>
                   <el-table-column label="操作" fixed="right" width="150">
                       <template slot-scope="scope">
                           <el-button
                                   size="mini"
                                   @click="handleEditMaterialListForm( scope.row)">编辑</el-button>
                           <el-button
                                   size="mini"
                                   type="danger"
                                   @click="handleDeleteMaterialListForm( scope.row)">删除</el-button>
                       </template>
                   </el-table-column>
               </el-table>
           </div>

        <el-dialog title="添加物证" :visible.sync="dialogMaterialListForm"
                   :close-on-click-modal="false" width="50%">
            <el-form
                    ref="materialListForm"
                    :rules="materialListFormRules"
                    :model="materialListForm"
                    label-position="left"
                    label-width="100px"
                    >
                <el-row :gutter="20">
                    <el-col :span="8">
                        <el-form-item label="系统编号" >

                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="物证编号" >

                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="物证细类" prop="materialNo">
                            <el-input v-model="materialListForm.materialNo"/>
                        </el-form-item>
                    </el-col>
                </el-row>

                <el-row :gutter="20">
                    <el-col :span="8">
                        <el-form-item label="物证类别" prop="materialCategory">
                            <el-input v-model="materialListForm.materialCategory"/>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">

                        <el-form-item label="物证类型" prop="materialType">
                            <el-input v-model="materialListForm.materialType"/>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="可靠程度" prop="materialNo">
                            <el-input v-model="materialListForm.materialNo"/>
                        </el-form-item>
                    </el-col>
                </el-row>

                <el-row :gutter="20">
                    <el-col :span="8">
                        <el-form-item label="遗留部位" prop="materialNo">
                            <el-input v-model="materialListForm.materialNo"/>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="利用情况" prop="idNo">
                            <el-input v-model="materialListForm.idNo"/>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="利用情况" prop="idNo">
                            <el-input v-model="materialListForm.idNo"/>
                        </el-form-item>
                    </el-col>
                </el-row>

                <el-row :gutter="20">
                    <el-col :span="8">
                        <el-form-item label="提取日期" prop="registerName">
                            <el-input v-model="materialListForm.registerName"/>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">

                        <el-form-item label="提取人" prop="registerName">
                            <el-input v-model="materialListForm.registerName"/>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">

                        <el-form-item label="物证名称" prop="registerName">
                            <el-input v-model="materialListForm.registerName"/>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-form-item label="特征描述" prop="registerName">
                    <el-input v-model="materialListForm.registerName"/>
                </el-form-item>
                <el-form-item label="物证图片" prop="registerName">
                    <Upload v-model="materialListForm.imgUrl"/>
                </el-form-item>


            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogMaterialListForm = false">
                    取 消
                </el-button>
                <el-button type="primary"
                           @click="dialogMaterialListFormMethod === 'add'?addMaterialListForm():updateMaterialListForm()">
                    确 定
                </el-button>
            </div>
        </el-dialog>

    </div>
</template>

<script>
    import Upload from '@/components/Upload/SingleImage3'
    import { fetchSearch, createMaterial, updateMaterial, delMaterial,submitMaterial} from '@/api/search'
    import {fetchList} from '@/api/dictionary'
    export default {
        name: "material",
        components: { Upload },
        data(){
            return{
                materialListForm:{
                    id:'',
                    evidenceId:'',
                    materialNo:'',
                    thirdMaterialNo:'',
                    materialCategory:'',
                    materialType:'',
                    extractTime:'',
                    extractMethod:'',
                    extractUid:'',
                    imgUrl:'',
                    isAdd:true,
                },
                materialList:[],
                materialListFormRules:{},
                dialogMaterialListForm:false,
            }
        },
        methods:{
            fetchData(id) {
                fetchSearch(id).then(data => {
                    this.list = data;


                }).catch(err => {
                    console.log(err)
                })
            },
            resetMaterialListForm() {
                this.materialListForm = {
                    name: '',
                    materialNo: '',
                    thirdMaterialNo: '',
                    materialCategory: '',
                    materialType: '',
                    extractTime: '',
                    extractMethod: '',
                    extractUid: '',
                }
                this.dialogMaterialListFormMethod = 'add'
                this.dialogMaterialListFormIndex = ''
            },
            addMaterialListForm() {

                if (this.isEdit) {
                    this.materialListForm.evidenceId = this.list.id;
                    createMaterial(this.materialListForm).then(response=>{
                        if (response.code === 200){
                            this.$message({
                                message: '操作成功',
                                type: 'success',
                                showClose: true,
                                duration: 2000
                            })
                            this.fetchData(this.list.id)
                            this.dialogMaterialListForm = false;
                            this.resetMaterialListForm();
                        }else{
                            this.$message({
                                message: response.reason,
                                type: 'success',
                                showClose: true,
                                duration: 2000
                            })
                        }
                    });

                }else{
                    this.materialType.map(data=>{
                        if (data.id == this.materialListForm.materialType){
                            this.materialListForm.materialTypeShow = data.title
                        }
                    })
                    this.userList.map(data=>{
                        if (data.id == this.materialListForm.extractUid){
                            this.materialListForm.extractUidShow = data.title
                        }
                    })
                    this.list.materialList.push(this.materialListForm);
                    this.dialogMaterialListForm = false;
                    this.resetMaterialListForm();
                }

            },
            handleEditMaterialListForm(index, row) {
                this.materialListForm = Object.assign({}, row) // copy obj
                this.dialogMaterialListFormIndex = index;
                this.dialogMaterialListFormMethod = 'edit';
                this.dialogMaterialListForm = true;


            },
            updateMaterialListForm() {
                if (this.isEdit) {
                    updateMaterial(this.materialListForm).then(response=>{
                        if (response.code === 200){
                            this.$message({
                                message: '操作成功',
                                type: 'success',
                                showClose: true,
                                duration: 2000
                            })
                            this.fetchData(this.list.id)
                            this.dialogMaterialListForm = false;
                            this.resetMaterialListForm();
                        }else{
                            this.$message({
                                message: response.reason,
                                type: 'success',
                                showClose: true,
                                duration: 2000
                            })
                        }
                    });
                }else{
                    this.materialType.map(data=>{
                        if (data.id == this.materialListForm.materialType){
                            this.materialListForm.materialTypeShow = data.title
                        }
                    })
                    this.userList.map(data=>{
                        if (data.id == this.materialListForm.extractUid){
                            this.materialListForm.extractUidShow = data.title
                        }
                    })
                    var temp = Object.assign({}, this.materialListForm)// copy obj
                    this.list.materialList.splice(this.dialogMaterialListFormIndex, 1, temp)
                    this.dialogMaterialListForm = false;
                    this.resetMaterialListForm();
                }

            },
            handleDeleteMaterialListForm(index, row) {
                if (this.isEdit) {
                    const sendData={
                        id:row.id,
                        operation:'del',
                    }
                    delMaterial(sendData).then(response=>{
                        if (response.code === 200){
                            this.$message({
                                message: '操作成功',
                                type: 'success',
                                showClose: true,
                                duration: 2000
                            })
                            this.fetchData(this.list.id)
                        }else{
                            this.$message({
                                message: response.reason,
                                type: 'success',
                                showClose: true,
                                duration: 2000
                            })
                        }
                    });
                }else{
                    this.list.materialList.splice(index, 1);
                }

            },
        }
    }
</script>

<style scoped>

</style>