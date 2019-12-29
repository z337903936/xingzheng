<template>
    <div class="app-container">
        <el-table
                v-loading="listLoading"

                :data="list"
                border
                fit
                highlight-current-row
                style="width: 100%;"

        >

            <el-table-column label="任务单号" align="center">
                <template slot-scope="{row}">
                    <span>{{ row.taskNo }}</span>
                </template>
            </el-table-column>
            <el-table-column label="任务类型" align="center">
                <template slot-scope="{row}">
                    <span>{{ row.stepName }}</span>
                </template>
            </el-table-column>
            <el-table-column label="发送人" align="center">
                <template slot-scope="{row}">
                    <span>{{ row.stepHandler }}</span>
                </template>
            </el-table-column>
            <el-table-column label="发送时间" align="center">
                <template slot-scope="{row}">
                    <span>{{ row.taskArriveTime | parseTime('{y}-{m}-{d} {h}:{i}:{s}')  }}</span>
                </template>
            </el-table-column>

            <el-table-column label="任务详情" align="center">
                <template slot-scope="{row}">
                    <span>{{ row.stepHandler }}</span>
                </template>
            </el-table-column>
            <el-table-column label="状态" align="center">
                <template slot-scope="{row}">
                    <span>{{ row.status | statusFilter }}</span>
                </template>
            </el-table-column>


            <el-table-column label="操作" align="center" width="230" class-name="small-padding fixed-width">
                <template slot-scope="{row}">

                    <el-button type="primary" size="small" icon="el-icon-document-checked"
                               @click="handleAcceptTask(row)"
                               v-if="row.status===1">
                        接收任务
                    </el-button>

                    <el-button type="success" size="small" icon="el-icon-tickets" @click="handleWriteResult(row)"
                               v-if="row.status===2">
                        填写结果
                    </el-button>
                    <router-link :to="'/search/update-search/'+row.evidenceId"
                                 v-if="row.status===2 && row.stepName==='痕检现勘'">
                        <el-button icon="el-icon-edit" type="primary" size="small">编辑现勘</el-button>
                    </router-link>
                </template>
            </el-table-column>
        </el-table>


        <el-dialog title="接受任务" :close-on-click-modal="false" :visible.sync="dialogFormAccept" width="30%">
            <el-form
                    ref="acceptTaskFrom"
                    :model="acceptTaskFrom"
                    label-position="left"
                    label-width="70px"
                    style="width: 80%; margin-left:50px;">

                <el-form-item label="送检单位" prop="name">
                    <el-input v-model="acceptTaskFrom.requireOrg"/>
                </el-form-item>


                <el-form-item label="送检时间" prop="sort">
                    <el-date-picker
                            v-model="acceptTaskFrom.requireTime"
                            type="date"
                            value-format="timestamp"
                            placeholder="选择日期"
                            style="width: 100%"
                    >
                    </el-date-picker>
                </el-form-item>
                <el-form-item label="理由" prop="name">
                    <el-input v-model="acceptTaskFrom.reason"/>
                </el-form-item>

            </el-form>

            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogFormAccept = false">
                    取 消
                </el-button>
                <el-button type="primary" @click="acceptTask()">
                    确 定
                </el-button>
            </div>
        </el-dialog>

        <el-dialog title="填写结果" :close-on-click-modal="false" :visible.sync="dialogResultFrom" width="30%">
            <el-form
                    ref="resultFrom"
                    :model="resultFrom"
                    label-position="left"
                    label-width="120px"
                    style="width: 80%; margin-left:50px;">

                <el-form-item label="检测结果" prop="result">
                    <el-input v-model="resultFrom.result"/>
                </el-form-item>
                <el-form-item label="勘查号" prop="evidenceNo">
                    <el-input v-model="resultFrom.evidenceNo"/>
                </el-form-item>
                <el-form-item label="文书号" prop="documentNo">
                    <el-input v-model="resultFrom.documentNo"/>
                </el-form-item>
                <el-form-item label="文书日期" prop="sort">
                    <el-date-picker
                            v-model="resultFrom.documentDate"
                            type="date"
                            value-format="timestamp"
                            placeholder="选择日期"
                            style="width: 100%">
                    </el-date-picker>
                </el-form-item>
                <el-form-item label="是否推送给主办痕检" prop="needToPushToCharger">
                    <el-checkbox v-model="resultFrom.needToPushToCharger"></el-checkbox>
                </el-form-item>
                <el-form-item label="任务编号" prop="taskNo">
                    <el-input v-model="resultFrom.taskNo"/>
                </el-form-item>
                <el-form-item label="案件类别" prop="caseCategory">
                    <el-cascader
                            :options="caseCategoryList"
                            filterable
                            @change="countDict"
                            v-model="resultFrom.caseCategory"
                            :filter-method="remoteSearch"
                            :show-all-levels="false"
                            placeholder="案件类别"
                            style="width: 100%;">
                    </el-cascader>

                </el-form-item>
                <el-form-item label="委托日期" prop="delegateTime">
                    <el-date-picker
                            v-model="resultFrom.delegateTime"
                            type="date"
                            value-format="timestamp"
                            placeholder="选择日期"
                            style="width: 100%">
                    </el-date-picker>
                </el-form-item>
                <el-form-item label="委托单位" prop="delegateOrg">
                    <el-input v-model="resultFrom.delegateOrg"/>
                </el-form-item>

                <el-form-item label="委托人" prop="delegateName">
                    <el-select v-model="resultFrom.delegateUid"
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
                <el-form-item label="简要案情" prop="digest">
                    <el-input v-model="resultFrom.digest"/>
                </el-form-item>
                <el-form-item label="死者情况" prop="deathDetail">
                    <el-input v-model="resultFrom.deathDetail"/>
                </el-form-item>
                <el-form-item label="提取检材" prop="extractMaterial">
                    <el-input v-model="resultFrom.extractMaterial"/>
                </el-form-item>
                <el-form-item label="检材去向" prop="materialTo">
                    <el-input v-model="resultFrom.materialTo"/>
                </el-form-item>

                <el-form-item label="鉴定结论" prop="conclusion">
                    <el-input v-model="resultFrom.conclusion"/>
                </el-form-item>
                <el-form-item label="检验人" prop="examName">
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
                <el-form-item label="备注栏" prop="note">
                    <el-input v-model="resultFrom.note" type="textarea"
                              :autosize="{ minRows: 2, maxRows: 4}"/>
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
<style scoped>
    .el-table >>> .el-table__expanded-cell[class*="cell"] {
        background-color: #f0f0f0 !important;
    }

    .table-expand {
        font-size: 0;

    }

    .table-expand label {
        width: 90px;
        color: #99a9bf;
    }

    .table-expand .el-form-item {
        margin-right: 0;
        margin-bottom: 0;
        width: 50%;
    }

    .el-row {
        margin-bottom: 20px;
    }

</style>


<script>
    import {accetpTask, taskList,medicalWriteResult} from '@/api/backlog'
    import {parseTime} from '@/utils'
    import {fetchAdminMemberList} from '@/api/permissions'
    import {fetchList,userDictList} from '@/api/dictionary'

    export default {
        name: "Backlog",
        filters: {

            statusFilter(status) {
                const statusMap = {
                    1: '未领取',
                    2: '进行中',
                    3: '已完成'
                }
                return statusMap[status]
            }
        },
        data() {
            return {
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
                list: [],
                tableKey: 0,
                listLoading: false,
                dialogFormAccept: false,
                acceptTaskFrom: {
                    stepId: '',
                    requireOrg: '',
                    requireTime: '',
                    reason: '',
                },
                dialogResultFrom: false,
                isForensic: false,
                isDNA: false,
                isFinger: false,
                isElectron: false,
                resultFrom: {
                    id: '',
                    result: '',
                    documentNo: '',
                    documentDate: '',
                    taskNo: '',
                    delegateOrg: '',
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
                },
                caseCategoryList: [],
                userList: [],
                userShowList: [],

            }
        },
        created() {
            this.getList();
            this.getUserList();
            this.search('案件类别').then(response => {
                this.caseCategoryList = this.processData(response.list)
            });
        },
        methods: {
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
            handleAction(val, type) {
                const sendData = {
                    stepId: val.id,
                    agree: type,
                };
                accetpTask(sendData).then(response => {
                    if (response.code === 200) {
                        this.$message({
                            message: '操作成功',
                            type: 'success',
                            showClose: true,
                            duration: 2000
                        })
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
            countDict(val) {
                val = val.slice(-1)[0]
                const send = {
                    name: val
                };
                this.$store.dispatch('PostUserUseDict', send)
            },
            pareTime(time) {
                if (time) {
                    return this.formatDate(time * 1000)
                } else {
                    return ''
                }
            },
            formatDate(now) {
                var time = new Date(now)
                var year = time.getFullYear();
                var month = time.getMonth() + 1;
                var date = time.getDate();
                var hour = time.getHours();
                var minute = time.getMinutes();
                var second = time.getSeconds();
                return year + "-" + month + "-" + date + " " + hour + ":" + minute + ":" + second;
            },
            getList() {
                this.listLoading = true;
                const data = {
                    status: 1
                }
                taskList(data).then(response => {
                    this.list = response.list
                    // this.pages = response.pages

                    // Just to simulate the time of the request

                    this.listLoading = false

                })
            },
            getLocalTime(nS) {
                return new Date(parseInt(nS) * 1000).toLocaleString().replace(/:\d{1,2}$/, ' ');
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
            handleWriteResult(task) {
                this.dialogResultFrom = true;
                if (task.stepName === '法医现勘') {
                    this.isForensic = true
                    this.resultFrom.caseCategory = task.evidence.caseCategory
                    this.resultFrom.selfEvidenceNo = task.evidence.selfEvidenceNo
                    this.resultFrom.caseCategory = task.evidence.caseCategory
                } else {
                    this.isForensic = false
                }
                this.resultFrom.stepId = task.id
                this.resultFrom.id = task.id
            },
            writeResult() {
                let data = Object.assign({}, this.resultFrom)
                if (data.documentDate.toString().length > 10)
                    data.documentDate = parseInt(data.documentDate / 1000);
                medicalWriteResult(data).then(response => {
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

            handleAcceptTaskSeach(task) {
                let data = this.acceptTaskFrom;
                data.stepId = task.id
                accetpTask(data).then(response => {
                    if (response.code === 200) {
                        this.$message({
                            message: '操作成功',
                            type: 'success',
                            showClose: true,
                            duration: 2000
                        })
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
            handleAcceptTask(task) {
                this.dialogFormAccept = true;
                this.acceptTaskFrom.stepId = task.id
                if (task) {

                }
            },
            acceptTask() {
                let data = this.acceptTaskFrom;
                if (data.requireTime.toString().length > 10)
                    data.requireTime = parseInt(data.requireTime / 1000);
                accetpTask(data).then(response => {
                    if (response.code === 200) {
                        this.$message({
                            message: '操作成功',
                            type: 'success',
                            showClose: true,
                            duration: 2000
                        })
                        this.dialogFormAccept = false;
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
        }
    }
</script>
