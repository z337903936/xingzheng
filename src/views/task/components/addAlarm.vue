<template>


    <div class="main alarm">
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
                                placeholder="选择时间"
                        />
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
                        <el-select v-model="alarm.reporter" filterable class="filter-item">
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
                        <el-select v-model="alarm.monitorUid" filterable class="filter-item">
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

                        <el-select v-model="alarm.techUid" filterable class="filter-item">
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

                        <el-select v-model="alarm.leaderUid" filterable class="filter-item">
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
                        <el-select v-model="alarm.receiptUid" filterable class="filter-item">
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
                    <el-form-item label="驾驶员" prop="driverName">
                        <el-input v-model="alarm.driverName"/>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="短信通知" prop="sms">
                        <el-select v-model="alarm.sms" class="filter-item" multiple>
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
                <el-select v-model="alarm.caseCategory" class="filter-item">
                    <el-option
                            v-for="item in userList"
                            :key="item.id"
                            :label="item.title"
                            :value="item.id"/>
                </el-select>
            </el-form-item>
            <el-form-item label="损失情况" prop="lostDetails">
                <el-input v-model="alarm.lostDetails"/>
            </el-form-item>
            <el-form-item label="短信内容" prop="remark">
                <el-input v-model="alarm.remark" :autosize="{ minRows: 2, maxRows: 4}" type="textarea"/>
            </el-form-item>
        </el-form>
        <div class="action" v-if="showNext && lastStep ">
            <el-button type="primary" style="float: right" @click="addAlarm(lastStep && !is_detail)">下一个步骤</el-button>
        </div>

        <div class="action" v-if="showNext&&!lastStep">
            <el-button type="primary" style="float: right" @click="addAlarm(lastStep)">保存</el-button>
        </div>


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
    import {fetchList, fetchTask, createTask, updateTask, nextTask, groupList} from '@/api/task'
    import {createAlarm, updateAlarm} from '@/api/alarm'
    import {fetchAdminMemberList} from '@/api/permissions'

    export default {
        name: "addAlarm",
        props: {
            parentId: {
                type: Number,
                default: 0
            },
            is_detail: {
                type: Boolean,
                default: false
            },
            detailData: {
                type: Object,
                default: {}
            }
        },
        data() {
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
                alarmRules: {
                    reporter: [{required: true, trigger: 'blur'}],
                    reportOrg: [{required: true, trigger: 'blur'}],
                    contactPhoneNumber: [{required: true, trigger: 'blur'}],
                    receiptUid: [{required: true, trigger: 'blur'}],
                    monitorUid: [{required: true, trigger: 'blur'}],
                    techUid: [{required: true, trigger: 'blur'}],
                    leaderUid: [{required: true, trigger: 'blur'}],
                },
                nextAlarm: null,
                dialogAlarmGroup: false,
                groupList: [],
                userList: [],
                showNext: true,
                lastStep: true,

            }
        },
        created() {
            if (this.is_detail) {
                if (this.detailData.currentUserId !== this.detailData.stepHanlderUid) {
                    this.showNext = false;
                }
                this.lastStep = this.detailData.isLast;
                this.alarm = Object.assign({}, this.detailData)// copy obj
            }
            this.getGroup()
            this.getUserList()
        },
        methods: {
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
            getUserList() {
                fetchAdminMemberList({}).then(response => {
                    this.userList = response.list.map(data => {
                        return {
                            id: data.id,
                            title: data.realName
                        }
                    })
                })
            },
            addAlarm(judge) {
                this.$refs.alarmForm.validate(valid => {
                    if (valid) {
                        if (judge) {
                            this.alarm.caseId = this.parentId

                            createAlarm(this.alarm).then(response => {
                                if (response.code === 200) {
                                    this.$parent.setTaskStep(response.id);
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
                        } else {
                            if (this.alarm.receiptTime.length>10)
                                this.alarm.receiptTime = this.alarm.receiptTime / 1000;
                            this.alarm.caseId = this.$route.params.id

                            updateAlarm(this.alarm).then(response => {
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

