<template>
    <div class="app-container">
        <div class="filter-container">
            <div>
                <el-button
                        type="primary"
                        icon="el-icon-edit"
                        @click="handleCreate">
                    新增
                </el-button>

            </div>
        </div>
        <el-table
                v-loading="listLoading"
                :key="tableKey"
                :data="list"
                border
                fit
                highlight-current-row
                style="width: 100%;"
        >
            <el-table-column label="ID" prop="id" align="center" width="80">
                <template slot-scope="{row}">
                    <span>{{ row.id }}</span>
                </template>
            </el-table-column>
            <el-table-column label="名称" min-width="50px">
                <template slot-scope="{row}">
                    <span>{{ row.name }}</span>
                </template>
            </el-table-column>
            <el-table-column label="备注" min-width="50px">
                <template slot-scope="{row}">
                    <span>{{ row.note }}</span>
                </template>
            </el-table-column>
            <el-table-column label="成员数" min-width="50px">
                <template slot-scope="{row}">
                    <span>{{ row.members }}</span>
                </template>
            </el-table-column>
            <el-table-column label="操作" align="center" width="330" class-name="small-padding fixed-width">
                <template slot-scope="{row}">
                    <el-button type="primary" size="small" @click="handleUpdate(row)">
                        编辑
                    </el-button>
                    <el-button type="primary" size="small" @click="handleDelete(row)">
                        删除
                    </el-button>
                    <router-link :to="'/permissions/bind-department-menu/'+row.id" >
                        <el-button type="primary" size="small" icon="el-icon-menu">设置成员</el-button>
                    </router-link>
                </template>
            </el-table-column>
        </el-table>
        <pagination v-show="pages>0" :page-count="pages"  @pagination="getList"/>

        <el-dialog
                :visible.sync="dialogDelete"
                title="删除提示"
                width="30%"
        >
            <span>是否删除该条数据?</span>
            <span slot="footer" class="dialog-footer">
        <el-button @click="dialogDelete = false">取 消</el-button>
        <el-button type="primary" @click="deleteData()">确 定</el-button>
      </span>
        </el-dialog>

        <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormAdd" width="30%">
            <el-form
                    ref="dataForm"
                    :rules="rules"
                    :model="temp"
                    label-position="left"
                    label-width="100px"
                    style="width: 400px; margin-left:50px;">

                <el-form-item label="名称" prop="name">
                    <el-input v-model="temp.name"/>
                </el-form-item>
                <el-form-item label="备注" prop="note">
                    <el-input v-model="temp.note"/>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogFormAdd = false">
                    取 消
                </el-button>
                <el-button type="primary" @click="dialogStatus==='create'?createData():updateData()">
                    确 定
                </el-button>
            </div>
        </el-dialog>

    </div>
</template>

<script>

    import { fetchList, fetchArticle, createArticle, updateArticle, delArticle } from '@/api/department'
    import waves from '@/directive/waves' // waves directive
    import Pagination from '@/components/Pagination' // secondary package based on el-pagination

    export default {
        name: 'Department',
        directives: { waves },
        components: { Pagination },
        data() {
            return {
                tableKey: 0,
                list: null,
                pages: 0,
                limit: 20,
                listLoading: true,
                dialogFormAdd: false,
                dialogStatus: '',
                textMap: {
                    update: '修改',
                    create: '新增'
                },
                temp: {
                    name: '',
                    note: ''
                },
                parentId: {},
                rules: {
                    name: [{ required: true, message: '请输入名称', trigger: 'change' }],
                },
                dialogDelete: false,
                deleteId: ''
            }
        },
        created() {
            this.getList()
        },
        methods: {
            getList() {
                this.listLoading = true
                fetchList(this.listQuery).then(response => {
                    this.list = response.list
                    this.pages = response.pages

                    // Just to simulate the time of the request
                    setTimeout(() => {
                        this.listLoading = false
                    }, 1.5 * 1000)
                })
            },
            handleFilter() {
                this.listQuery.page = 1
                this.getList()
            },
            handleCreate() {
                this.resetTemp()
                this.dialogStatus = 'create'
                this.dialogFormAdd = true
                this.$nextTick(() => {
                    this.$refs['dataForm'].clearValidate()
                })
            },
            resetTemp() {
                this.temp = {
                    name: '',
                    sort: 99,
                    parentId: ''
                }
            },
            createData() {
                this.$refs['dataForm'].validate((valid) => {
                    if (valid) {
                        createArticle(this.temp).then(response => {
                            if (response.code === 200) {
                                this.dialogFormAdd = false
                                this.$notify({
                                    title: 'Success',
                                    message: '创建成功',
                                    type: 'success',
                                    duration: 2000
                                })
                                this.getList()
                            }else{
                                this.$notify({
                                    title: 'Success',
                                    message: response.reason,
                                    type: 'success',
                                    duration: 2000
                                })
                            }
                        })
                    }
                })
            },
            handleUpdate(row) {
                this.temp = Object.assign({}, row) // copy obj
                this.dialogStatus = 'update'
                this.dialogFormAdd = true
                this.$nextTick(() => {
                    this.$refs['dataForm'].clearValidate()
                })
            },
            updateData() {
                this.$refs['dataForm'].validate((valid) => {
                    if (valid) {
                        const tempData = Object.assign({}, this.temp)
                        updateArticle(tempData).then(response => {
                            if (response.code === 200) {
                                this.dialogFormAdd = false
                                this.$notify({
                                    title: 'Success',
                                    message: '修改成功',
                                    type: 'success',
                                    duration: 2000
                                })
                                this.getList()
                            }else{
                                this.$notify({
                                    title: 'Success',
                                    message: response.reason,
                                    type: 'success',
                                    duration: 2000
                                })
                            }
                        })
                    }
                })
            },
            handleDelete(row) {
                this.deleteId = row.id // copy obj
                this.dialogDelete = true
            },
            deleteData() {
                delArticle({
                    id: this.deleteId,
                    operation: 'del'
                }).then(response => {
                    if (response.code === 200) {
                        this.dialogDelete = false
                        this.$notify({
                            title: 'Success',
                            message: '删除成功',
                            type: 'success',
                            duration: 2000
                        })
                        this.getList()
                    }else{
                        this.$notify({
                            title: 'Success',
                            message: response.reason,
                            type: 'success',
                            duration: 2000
                        })
                    }
                })
            }
        }
    }
</script>

<style scoped>

</style>