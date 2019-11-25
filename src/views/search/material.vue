<template>
    <div class="app-container">

        <div style="width: 70%;margin: auto;padding-bottom: 20px">
            <div style="padding-bottom: 5px">
                <el-button type="primary" size="mini" @click="dialogMaterialListForm=true">添加物证</el-button>
                <el-button type="primary" size="mini" @click="submitTask">批量提交</el-button>
            </div>
            <el-table
                    :data="materialList"
                    height="200"
                    border
                    max-height="200"
                    row-key="id"
                    @selection-change="selectTask"
            >
                <el-table-column
                        type="selection"
                        width="55"
                        v-model="taskId">
                </el-table-column>
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
                        <span>{{ row.materialType }}</span>
                    </template>
                </el-table-column>
                <el-table-column
                        prop="extractTime"
                        label="提取日期">
                    <template slot-scope="{row}">
                        <span v-if="row.extractTime !== ''">{{ row.extractTime*1000 | parseTime('{y}-{m}-{d}') }}</span>
                        <span v-else></span>
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
                        <span>{{ row.extractName }}</span>
                    </template>
                </el-table-column>
                <el-table-column label="操作" fixed="right" width="150">
                    <template slot-scope="scope">
                        <el-button
                                size="mini"
                                @click="handleEditMaterialListForm( scope.row)">编辑
                        </el-button>
                        <el-button
                                size="mini"
                                type="danger"
                                @click="handleDeleteMaterialListForm( scope.row)">删除
                        </el-button>
                    </template>
                </el-table-column>
            </el-table>
        </div>


    </div>
</template>

<script>
    import Upload from '@/components/Upload/SingleImage3'
    import {fetchSearch, createMaterial, updateMaterial, delMaterial, submitMaterial} from '@/api/search'
    import {fetchList} from '@/api/dictionary'
    import {fetchAdminMemberList} from '@/api/permissions'

    export default {
        name: "material",
        components: {Upload},
        data() {
            return {
                reliabilityLevel:[
                    {
                        title:'是',
                    }, {
                        title:'疑似',
                    }, {
                        title:'其他',
                    },
                ],
                usedType:[
                    {
                        title:'查档认定',
                    }, {
                        title:'鉴定认定',
                    }, {
                        title:'串并认定',
                    },{
                        title:'排除嫌疑',
                    },{
                        title:'其他利用',
                    },{
                        title:'尚未利用',
                    },
                ],
                materialListForm: {
                    id: '',
                    evidenceId: '',
                    materialNo: '',
                    thirdMaterialNo: '',
                    materialCategory: '',
                    materialType: '',
                    extractTime: '',
                    extractMethod: '',
                    extractUid: '',
                    imgUrl: '',
                    stayPart: '',
                    reliabilityLevel: '',
                    usedType: '',
                    name: '',
                    note: '',
                    noned: '',
                },
                userShowList: [],
                userList: [],
                materialList: [],
                taskId: [],
                materialCategoryList: [],
                materialListFormRules: {},
                dialogMaterialListForm: false,
                dialogMaterialListFormMethod: 'add',
                searchId: null,
            }
        },
        created() {
            const id = this.$route.params && this.$route.params.id;
            this.materialListForm.evidenceId = id;
            this.searchId = id;
            this.getUserList();
            this.fetchData(id);
            this.search('物证类别').then(data=>{
                this.materialCategoryList = this.processData(data.list);
            });

        },
        methods: {

            setStayPart(val){

                this.materialListForm.stayPart = val.originalFileName;
                this.materialListForm.imgUrl = val.imgUrl;
            },
            selectTask(selection){
                this.taskId = selection.map(data=>{
                    return data.id;
                })
            },
            submitTask() {
                const data = {
                    list:this.taskId
                };
                submitMaterial(data).then(res=>{
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
                });
            },
            fetchData(id) {
                fetchSearch(id).then(data => {
                    this.materialList = data.materialList;
                }).catch(err => {
                    console.log(err)
                })
            },
            search(parentName, filter = null) {
                return new Promise((resolve, reject) => {
                    const data = {
                        filter: filter,
                        parentName: parentName
                    };
                    resolve(fetchList(data))
                })

            },
            processData(data) {
                return data.map(item => {
                    var sendData = {
                        value: item.name,
                        label: item.name,
                        py: item.pinyinAbbr,
                    }
                    if (item.children.length > 0) {
                        sendData.children = this.processData(item.children);
                    }

                    return sendData;
                })
            },
            filterUserSearch(value) {
                if (value) {
                    this.userShowList = this.userList.filter(data => {

                        var p = /^[a-zA-Z]+$/;
                        if (p.test(value)) {
                            if (data.py.toLowerCase().indexOf(value.toLowerCase()) > -1)
                                return data
                        } else {
                            if (data.title.indexOf(value) > -1)
                                return data
                        }
                    })
                } else {
                    this.userShowList = this.userList;
                }
            },
            restUserSearch(change) {
                if (!change) {
                    this.userShowList = this.userList;
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
                    this.userShowList = this.userList;
                })
            },
            filterSearch(node, value) {
                var p = /^[a-zA-Z]+$/;
                if (p.test(value)) {
                    if (node.data.py.toLowerCase().indexOf(value.toLowerCase()) > -1)
                        return true
                } else {
                    if (node.data.label.indexOf(value) > -1)
                        return true
                }
            },
            resetMaterialListForm() {
                this.materialListForm = {
                    id: '',
                    materialNo: '',
                    thirdMaterialNo: '',
                    materialCategory: '',
                    materialType: '',
                    extractTime: '',
                    extractMethod: '',
                    extractUid: '',
                    imgUrl: '',
                    stayPart: '',
                    reliabilityLevel: '',
                    usedType: '',
                    name: '',
                    note: '',
                    noned: '',
                }
                this.dialogMaterialListFormMethod = 'add'
            },
            addMaterialListForm() {

                // if (this.isEdit) {
                //     this.materialListForm.evidenceId = this.list.id;
                var data = this.materialListForm
                if (data.extractTime.toString().length > 10)
                    data.extractTime = parseInt(data.extractTime / 1000);
                createMaterial(data).then(response => {
                    if (response.code === 200) {
                        this.$message({
                            message: '操作成功',
                            type: 'success',
                            showClose: true,
                            duration: 2000
                        })
                        this.fetchData(this.searchId)
                        this.dialogMaterialListForm = false;
                        this.resetMaterialListForm();
                    } else {
                        this.$message({
                            message: response.reason,
                            type: 'success',
                            showClose: true,
                            duration: 2000
                        })
                    }
                });

                // }else{
                //     this.materialType.map(data=>{
                //         if (data.id == this.materialListForm.materialType){
                //             this.materialListForm.materialTypeShow = data.title
                //         }
                //     })
                //     this.userList.map(data=>{
                //         if (data.id == this.materialListForm.extractUid){
                //             this.materialListForm.extractUidShow = data.title
                //         }
                //     })
                //     this.list.materialList.push(this.materialListForm);
                //     this.dialogMaterialListForm = false;
                //     this.resetMaterialListForm();
                // }

            },
            handleEditMaterialListForm(row) {
                console.log(row);
                row.extractTime = row.extractTime*1000
                this.materialListForm = Object.assign({}, row) // copy obj
                this.dialogMaterialListFormMethod = 'edit';
                this.dialogMaterialListForm = true;


            },
            updateMaterialListForm() {
                // if (this.isEdit) {
                var data = this.materialListForm
                if (data.extractTime.toString().length > 10)
                    data.extractTime = parseInt(data.extractTime / 1000);
                updateMaterial(data).then(response => {
                    if (response.code === 200) {
                        this.$message({
                            message: '操作成功',
                            type: 'success',
                            showClose: true,
                            duration: 2000
                        })
                        this.fetchData(this.searchId)
                        this.dialogMaterialListForm = false;
                        this.resetMaterialListForm();
                    } else {
                        this.$message({
                            message: response.reason,
                            type: 'success',
                            showClose: true,
                            duration: 2000
                        })
                    }
                });
                // }else{
                //     this.materialType.map(data=>{
                //         if (data.id == this.materialListForm.materialType){
                //             this.materialListForm.materialTypeShow = data.title
                //         }
                //     })
                //     this.userList.map(data=>{
                //         if (data.id == this.materialListForm.extractUid){
                //             this.materialListForm.extractUidShow = data.title
                //         }
                //     })
                //     var temp = Object.assign({}, this.materialListForm)// copy obj
                //     this.dialogMaterialListForm = false;
                //     this.resetMaterialListForm();
                // }

            },
            handleDeleteMaterialListForm(row) {
                // if (this.isEdit) {
                const sendData = {
                    id: row.id,
                    operation: 'del',
                }
                delMaterial(sendData).then(response => {
                    if (response.code === 200) {
                        this.$message({
                            message: '操作成功',
                            type: 'success',
                            showClose: true,
                            duration: 2000
                        })
                        this.fetchData(this.searchId)
                    } else {
                        this.$message({
                            message: response.reason,
                            type: 'success',
                            showClose: true,
                            duration: 2000
                        })
                    }
                });
                // }else{
                //     this.list.materialList.splice(index, 1);
                // }

            },
        }
    }
</script>

<style scoped>

</style>