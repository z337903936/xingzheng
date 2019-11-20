<template>
    <div class="app-container">
        <div class="filter-container">
            <div><el-date-picker
                    v-model="searchTime"
                    type="datetimerange"
                    range-separator="至"
                    start-placeholder="开始时间"
                    end-placeholder="结束时间"
                    value-format="timestamp"
            />
                <el-select v-model="listQuery.leaderName" placeholder="带班领导" center>
                    <el-option
                            v-for="item in userList"
                            :key="item.id"
                            :label="item.title"
                            :value="item.id"/>
                </el-select>
                <el-select v-model="listQuery.receiptName" placeholder="接警人" center>
                    <el-option
                            v-for="item in userList"
                            :key="item.id"
                            :label="item.title"
                            :value="item.id"/>
                </el-select>
                <el-select v-model="listQuery.reporterName" placeholder="报告人" center>
                    <el-option
                            v-for="item in userList"
                            :key="item.id"
                            :label="item.title"
                            :value="item.id"/>
                </el-select>
                <el-input v-model="listQuery.reporterOrg" placeholder="报告单位" style="width: 200px;"
                          @keyup.enter.native="handleFilter"/>
                <el-select v-model="listQuery.caseCategoryId" placeholder="案件类别" style="width: 140px">
                    <el-option v-for="item in userList" :key="item.id"
                               :label="item.title" :value="item.id"/>
                </el-select>
                <el-button v-waves type="primary" icon="el-icon-search" @click="handleFilter">
                    搜索
                </el-button>
                <el-button v-waves  type="primary" icon="el-icon-edit" @click="handleCreate">
                    添加
                </el-button>

                <!--<el-button v-waves :loading="downloadLoading" type="primary" icon="el-icon-download" @click="handleDownload">-->
                <!--导出-->
                <!--</el-button>-->
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
            <el-table-column label="案件编号" min-width="50px">
                <template slot-scope="{row}">
                    <span>{{ row.caseNo }}</span>
                </template>
            </el-table-column>
            <el-table-column label="接警时间" width="150px" align="center">
                <template slot-scope="{row}">
                    <span>{{ row.receiptTime | parseTime('{y}-{m}-{d} {h}:{i}') }}</span>
                </template>
            </el-table-column>
            <el-table-column label="报告人" min-width="150px">
                <template slot-scope="{row}">
                    <span>{{ row.reporter }}</span>
                </template>
            </el-table-column>
            <el-table-column label="报告单位" width="110px" align="center">
                <template slot-scope="{row}">
                    <span>{{ row.reportOrg }}</span>
                </template>
            </el-table-column>
            <el-table-column label="联系方式" width="110px" align="center">
                <template slot-scope="{row}">
                    <span>{{ row.contactPhoneNumber }}</span>
                </template>
            </el-table-column>
            <el-table-column label="案件类别" width="110px" align="center">
                <template slot-scope="{row}">
                    <span>{{ row.caseCategoryId }}</span>
                </template>
            </el-table-column>
            <el-table-column label="操作" align="center" width="230" class-name="small-padding fixed-width">
                <template slot-scope="{row}">
                    <el-button type="primary" size="mini" @click="handleUpdate(row)">
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
        >
        </el-pagination>


        <el-dialog :visible.sync="dialogFormVisible" :title="textMap[dialogStatus]">
            <el-form ref="dataForm" :rules="rules" :model="temp" label-position="left" label-width="120px"
                     style="width: 700px; margin-left:50px;">
                <el-row :gutter="20">
                    <el-col :span="12">
                        <el-form-item label="接警时间" prop="receiptTime">
                            <el-date-picker
                                    v-model="temp.receiptTime"
                                    type="datetime"
                                    value-format="timestamp"
                                    placeholder="选择时间"/>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="报告单位" prop="reportOrg">
                            <el-input v-model="temp.reportOrg"/>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row :gutter="20">
                    <el-col :span="12">
                        <el-form-item label="报告人" prop="reporter">
                            <el-input v-model="temp.reporter"/>
                        </el-form-item>

                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="联系电话" prop="contactPhoneNumber">
                            <el-input v-model="temp.contactPhoneNumber"/>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row :gutter="20">
                    <el-col :span="12">
                        <el-form-item label="技术值班队长" prop="monitorUid">
                            <el-select v-model="temp.monitorUid" filterable  class="filter-item">
                                <el-option
                                        v-for="item in userList"
                                        :key="item.id"
                                        :label="item.title"
                                        :value="item.id"/>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="值班技术员" prop="techUid">

                            <el-select v-model="temp.techUid" filterable  class="filter-item">
                                <el-option
                                        v-for="item in userList"
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

                            <el-select v-model="temp.leaderUid" filterable  class="filter-item">
                                <el-option
                                        v-for="item in userList"
                                        :key="item.id"
                                        :label="item.title"
                                        :value="item.id"/>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="接警人" prop="receiptUid">
                            <el-select v-model="temp.receiptUid" filterable  class="filter-item">
                                <el-option
                                        v-for="item in userList"
                                        :key="item.id"
                                        :label="item.title"
                                        :value="item.id"/>
                            </el-select>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row :gutter="20">
                    <el-col :span="12">
                        <el-form-item label="驾驶员" prop="driverName" >
                            <el-input v-model="temp.driverName" />
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="短信通知" prop="sms">
                            <el-select v-model="temp.smsReceiver" class="filter-item" multiple  >
                                <el-option
                                        v-for="item in userList"
                                        :key="item.id"
                                        :label="item.title"
                                        :value="item.id"/>
                            </el-select>
                        </el-form-item>
                    </el-col>
                </el-row>

                <el-form-item label="短信内容" prop="smsContent">
                    <el-input v-model="temp.smsContent" :autosize="{ minRows: 2, maxRows: 4}" type="textarea"/>
                </el-form-item>
                <el-divider>案件信息</el-divider>
                <el-form-item label="案件编号" prop="caseNo">
                    <el-input v-model="temp.caseNo"/>
                </el-form-item>
                <el-form-item label="任务编号" prop="instanceNo">
                    <el-input v-model="temp.instanceNo"/>
                </el-form-item>
                <el-form-item label="案件类型" prop="caseCategory">
                    <el-select v-model="temp.caseCategory" class="filter-item"  >
                        <el-option
                                v-for="item in userList"
                                :key="item.id"
                                :label="item.title"
                                :value="item.id"/>
                    </el-select>
                </el-form-item>
                <el-form-item label="案发地点" prop="caseAddress">
                    <el-input v-model="temp.caseAddress"/>
                </el-form-item>
                <el-form-item label="案发摘要" prop="caseDigest">
                    <el-input v-model="temp.caseDigest"/>
                </el-form-item>
                <el-form-item label="损失情况" prop="lostDetail">
                    <el-input v-model="temp.lostDetail"/>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogFormVisible = false">
                    取消
                </el-button>
                <el-button type="primary" @click="dialogStatus==='create'?createData():updateData()">
                    确认
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
    import {fetchList, fetchAlarm, createAlarm, updateAlarm} from '@/api/alarm'
    import waves from '@/directive/waves' // waves directive
    import {parseTime} from '@/utils'
    import { fetchAdminMemberList} from '@/api/permissions'



    export default {
        name: 'Alarm',
        directives: {waves},
        data() {
            return {
                tableKey: 0,
                list: null,
                pages: 0,
                listLoading: true,
                searchTime: '',
                limit: 20,
                listQuery: {
                    page: 1,
                    beginTime: undefined,
                    endTime: undefined,
                    leaderName: undefined,
                    receiptName: undefined,
                    reporterOrg: undefined,
                    reporterName: undefined,
                    caseCategoryId: undefined
                },
                temp: {
                    id: undefined,
                    reporter: '',
                    reportOrg: '',
                    contactPhoneNumber: '',
                    driverName: '',
                    monitorUid: '',
                    techUid: '',
                    leaderUid: '',
                    receiptTime: '',
                    smsContent: '',
                    smsReceiver: [],
                    caseAddress:'',
                    caseCategory:'',
                    caseDigest:'',
                    instanceNo:'',
                    caseNo:'',
                    lostDetail:'',
                },
                dialogFormVisible: false,
                dialogStatus: '',
                textMap: {
                    update: '修改',
                    create: '新增'
                },
                rules:{},
                downloadLoading: false,
                userList: [],
            }
        },
        created() {
            this.getList()
            this.getUserList()
        },
        methods: {
            getUserList(){
                fetchAdminMemberList({}).then(response => {
                    this.userList = response.list.map(data => {
                        return {
                            id: data.id,
                            title: data.realName
                        }
                    })
                })
            },
            getList() {
                this.listLoading = true;
                fetchList(this.listQuery).then(response => {
                    this.list = response.list;
                    this.pages = response.pages

                    // Just to simulate the time of the request
                    setTimeout(() => {
                        this.listLoading = false
                    },1000)
                })
            },
            handleFilter () {
                this.listQuery.beginTime = this.searchTime[0]/1000;
                this.listQuery.endTime = this.searchTime[1]/1000;
                this.listQuery.page = 1;
                this.getList()
            },
            resetTemp() {
                this.temp = {
                    id: undefined,
                    reporter: '',
                    reportOrg: '',
                    contactPhoneNumber: '',
                    driverName: '',
                    monitorUid: '',
                    techUid: '',
                    leaderUid: '',
                    receiptTime: '',
                    smsContent: '',
                    smsReceiver: [],
                    caseAddress:'',
                    caseCategory:'',
                    caseDigest:'',
                    instanceNo:'',
                    caseNo:'',
                    lostDetail:'',
                }
            },
            handleCreate() {
                this.resetTemp()
                this.dialogStatus = 'create'
                this.dialogFormVisible = true
                // this.$nextTick(() => {
                //     this.$refs['dataForm'].clearValidate()
                // })
            },
            createData() {
                this.$refs['dataForm'].validate((valid) => {
                    if (valid) {
                        createAlarm(this.temp).then(response=> {
                            if (response.code === 200){
                                this.getList()
                                this.dialogFormVisible = false
                                this.$notify({
                                    title: 'Success',
                                    message: '操作成功',
                                    type: 'success',
                                    duration: 2000
                                })
                            } else{
                                this.$notify({
                                    title: 'Success',
                                    message: response.reason,
                                    type: 'success',
                                    duration: 2000
                                })
                            }

                        })
                    }else {
                        this.$message({
                            message: '操作失败，请检查数据',
                            type: 'error',
                            showClose: true,
                            duration: 2000
                        });

                    }
                })
            },
            handleUpdate(row) {
                this.temp = Object.assign({}, row) // copy obj
                this.dialogStatus = 'update'
                this.dialogFormVisible = true
                // this.$nextTick(() => {
                //     this.$refs['dataForm'].clearValidate()
                // })
            },
            updateData() {
                this.$refs['dataForm'].validate((valid) => {
                    if (valid) {
                        const tempData = Object.assign({}, this.temp)
                        updateAlarm(tempData).then(response => {
                            if (response.code == 200) {
                                this.dialogFormVisible = false;
                                this.$notify({
                                    title: 'Success',
                                    message: '操作成功',
                                    type: 'success',
                                    duration: 2000
                                })
                            }else{
                                this.$notify({
                                    title: 'Success',
                                    message: response.reason,
                                    type: 'success',
                                    duration: 2000
                                })
                            }

                        })
                    }else {
                        this.$message({
                            message: '操作失败，请检查数据',
                            type: 'error',
                            showClose: true,
                            duration: 2000
                        });

                    }
                })
            },
            handleDelete(row) {
                this.$notify({
                    title: 'Success',
                    message: 'Delete Successfully',
                    type: 'success',
                    duration: 2000
                })
                const index = this.list.indexOf(row)
                this.list.splice(index, 1)
            },

            handleDownload() {
                this.downloadLoading = true
                import('@/vendor/Export2Excel').then(excel => {
                    const tHeader = ['timestamp', 'title', 'type', 'importance', 'status']
                    const filterVal = ['timestamp', 'title', 'type', 'importance', 'status']
                    const data = this.formatJson(filterVal, this.list)
                    excel.export_json_to_excel({
                        header: tHeader,
                        data,
                        filename: 'table-list'
                    })
                    this.downloadLoading = false
                })
            },
            formatJson(filterVal, jsonData) {
                return jsonData.map(v => filterVal.map(j => {
                    if (j === 'timestamp') {
                        return parseTime(v[j])
                    } else {
                        return v[j]
                    }
                }))
            },
            
        }
    }
</script>
