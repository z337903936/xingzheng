<template>


    <div class="main alarm" >
            <el-form
                    ref="alarmForm"
                    :rules="alarmRules"
                    :model="alarm"
                    label-position="left"
                    label-width="120px"
                    style="width: 700px; margin:auto;">
                <el-row :gutter="20">
                    <el-col :span="12">
                        <el-form-item label="接警时间" prop="receiptTime">
                            <el-date-picker
                                    v-model="alarm.receiptTime"
                                    type="datetime"
                                    value-format="timestamp"
                                    placeholder="选择时间"/>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="报告单位" prop="reportOrg">
                            <el-input v-model="alarm.reportOrg"/>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row :gutter="20">
                    <el-col :span="12">
                        <el-form-item label="报告人" prop="reporter">
                            <el-select v-model="alarm.reporter" filterable  class="filter-item">
                                <el-option
                                        v-for="item in userList"
                                        :key="item.id"
                                        :label="item.title"
                                        :value="item.id"/>
                            </el-select>
                        </el-form-item>

                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="联系电话" prop="contactPhoneNumber">
                            <el-input v-model="alarm.contactPhoneNumber"/>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row :gutter="20">
                    <el-col :span="12">
                        <el-form-item label="技术值班队长" prop="monitorUid">
                            <el-select v-model="alarm.monitorUid" filterable  class="filter-item">
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

                            <el-select v-model="alarm.techUid" filterable  class="filter-item">
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

                            <el-select v-model="alarm.leaderUid" filterable  class="filter-item">
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
                            <el-select v-model="alarm.receiptUid" filterable  class="filter-item">
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
                            <el-input v-model="alarm.driverName" />
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="短信通知" prop="sms">
                            <el-select v-model="alarm.sms" class="filter-item" multiple  >
                                <el-option
                                        v-for="item in userList"
                                        :key="item.id"
                                        :label="item.title"
                                        :value="item.id"/>
                            </el-select>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-form-item label="案件类型" prop="caseCategory">
                    <el-select v-model="alarm.caseCategory" class="filter-item"  >
                        <el-option
                                v-for="item in userList"
                                :key="item.id"
                                :label="item.title"
                                :value="item.id"/>
                    </el-select>
                </el-form-item>
                <el-form-item label="短信内容" prop="remark">
                    <el-input v-model="alarm.remark" :autosize="{ minRows: 2, maxRows: 4}" type="textarea"/>
                </el-form-item>
            </el-form>
            <div class="action">
                <el-button type="primary" style="float: right" @click="dialogAlarmGroup = true">下一个步骤</el-button>
            </div>

        <el-dialog
                :visible.sync="dialogAlarmGroup"
                title="岗位选择"
                width="25%"
                center>
            <span>下一步转到：</span>
            <el-select v-model="nextAlarm" placeholder="请选择岗位" center>
                <el-option
                        v-for="item in groupList"
                        :key="item.id"
                        :label="item.title"
                        :value="item.id"/>
            </el-select>
            <span slot="footer" class="dialog-footer">
        <el-button @click="dialogAlarmGroup = false">取 消</el-button>
        <el-button type="primary" @click="addAlarm()">确 定</el-button>
      </span>
        </el-dialog>
        </div>

</template>


<style scoped>
    .main {
        width: 100%;
        margin-top: 100px;
    }

    .action {
        width: 600px;
        margin: auto;
    }
</style>

<script>
    import { groupList, nextTask } from '@/api/task'
    import {  createAlarm}  from '@/api/alarm'
    import { fetchAdminMemberList} from '@/api/permissions'
    export default {
        name: "addAlarm",
        props: {
            parentId: {
                type: Number,
                default: false
            }
        },
        data(){
            return {
                alarm: {
                    id: undefined,
                    caseId: undefined,
                    reporter: '',
                    reportOrg: '',
                    contactPhoneNumber: '',
                    lostDetails: '',
                    driverName: '',
                    receiptUid: '',
                    monitorUid: '',
                    techUid: '',
                    leaderUid: '',
                    sms: '',
                    receiptTime: ''
                },
                alarmRules:{
                    reporter: [{ required: true, trigger: 'blur' }],
                    reportOrg: [{ required: true, trigger: 'blur' }],
                    contactPhoneNumber: [{ required: true, trigger: 'blur' }],
                    receiptUid: [{ required: true, trigger: 'blur' }],
                    monitorUid: [{ required: true, trigger: 'blur' }],
                    techUid: [{ required: true, trigger: 'blur' }],
                    leaderUid: [{ required: true, trigger: 'blur' }],
                },
                nextAlarm:null,
                dialogAlarmGroup:false,
                groupList: [],
                userList: [],
            }
        },
        created() {
            this.getGroup()
            this.getUserList()
        },
        methods:{
            getGroup() {
                groupList({}).then(response => {
                    this.groupList = response.list.map(data => {
                        return {
                            id: data.id,
                            title: data.groupName
                        }
                    })
                })
            },
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
            addAlarm(){
                this.$refs.alarmForm.validate(valid => {
                    if (valid) {
                        if (!this.nextAlarm) {
                            this.$message({
                                message: '请选择下一步岗位',
                                type: 'warning'
                            })
                        } else {
                            this.alarm.caseId = this.parentId
                            createAlarm(this.alarm).then(response => {
                                if (response.code === 200) {
                                    const sendData = {
                                        caseId: this.parentId,
                                        groupId: this.next
                                    }
                                    nextTask(sendData).then(alarmData => {
                                        if (alarmData.code === 200) {
                                            this.$message({
                                                message: '操作成功',
                                                type: 'success',
                                                showClose: true,
                                                duration: 2000
                                            })
                                            this.dialogGroup = false
                                        }
                                    })
                                }
                            })
                        }
                    } else {
                        this.$message({
                            message: '操作失败，请检查数据',
                            type: 'error',
                            showClose: true,
                            duration: 2000
                        });
                        return false
                    }
                })
                this.nextAlarm = null;
            },
        }
    }
</script>

