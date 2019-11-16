<template>
  <div>
    <el-steps :active="step" align-center finish-status="success" style="margin-top: 20px">
      <el-step style="color: rgb(64, 158, 255)!important;" title="添加案件"/>
      <el-step style="color: rgb(64, 158, 255)!important;" title="接警"/>
      <el-step style="color: rgb(64, 158, 255)!important;" title="现勘"/>
    </el-steps>
    <div class="main task" v-if="step ===1">
      <el-form
        ref="task"
        :model="task"
        :rules="taskRules"
        label-position="center"
        label-width="100px"
        style="width: 600px; margin:auto;">
        <el-form-item label="案件编号" prop="caseNo">
          <el-input v-model="task.caseNo"/>
        </el-form-item>
        <el-form-item label="任务编号" prop="instanceNo">
          <el-input v-model="task.instanceNo"/>
        </el-form-item>
        <el-form-item label="案件分类" prop="caseCategoryId">
          <el-input v-model="task.caseCategoryId"/>
        </el-form-item>
        <el-form-item label="案发地点" prop="caseAddress">
          <el-input v-model="task.caseAddress"/>
        </el-form-item>
        <el-form-item label="案发摘要" prop="caseDigest">
          <el-input v-model="task.caseDigest"/>
        </el-form-item>
        <el-form-item label="损失情况" prop="lostDetail">
          <el-input v-model="task.lostDetail"/>
        </el-form-item>
      </el-form>
      <div class="action">
        <el-button type="primary" style="float: right" @click="dialogGroup = true">下一个步骤</el-button>
      </div>
    </div>

    <div class="main alarm" v-if="step ===2">
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
                placeholder="选择时间"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="报告单位" prop="reportOrg">
              <el-select v-model="alarm.reportOrg" class="filter-item" >
                <el-option
                  v-for="item in calendarTypeOptions"
                  :key="item.key"
                  :label="item.display_name"
                  :value="item.key"/>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="报告人" prop="reporter">
              <el-input v-model="alarm.reporter"/>
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
              <el-input v-model="alarm.monitorUid"/>
            </el-form-item>

          </el-col>
          <el-col :span="12">
            <el-form-item label="值班技术员" prop="techUid">
              <el-input v-model="alarm.techUid"/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="大队值班领导" prop="leaderUid">
              <el-input v-model="alarm.leaderUid"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="接警人" prop="receiptUid">
              <el-input v-model="alarm.receiptUid"/>
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
            <el-form-item label="短信通知" prop="reportOrg">
              <el-select v-model="alarm.reportOrg" class="filter-item" >
                <el-option
                  v-for="item in calendarTypeOptions"
                  :key="item.key"
                  :label="item.display_name"
                  :value="item.key"/>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="短信内容" prop="remark">
          <el-input v-model="alarm.remark" :autosize="{ minRows: 2, maxRows: 4}" type="textarea"/>
        </el-form-item>
      </el-form>
      <div class="action">
        <el-button type="primary" style="float: right" @click="dialogGroup = true">下一个步骤</el-button>
      </div>
    </div>
    <div v-if="step ===3">
      <el-form
              ref="alarmForm"
              :rules="alarmRules"
              :model="alarm"
              label-position="left"
              label-width="120px"
              style="display: flex;"
              >
        <div style="width: 700px;margin-left: 150px">
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="勘查开始" prop="examBeginTime">
                <el-date-picker
                        v-model="alarm.examBeginTime"
                        type="datetime"
                        placeholder="选择时间"/>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="勘查结束" prop="examEndTime">
                <el-date-picker
                        v-model="alarm.examEndTime"
                        type="datetime"
                        placeholder="选择时间"/>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="案件开始" prop="caseBeginTime">
                <el-date-picker
                        v-model="alarm.caseBeginTime"
                        type="datetime"
                        placeholder="选择时间"/>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="案件结束" prop="caseEndTime">
                <el-date-picker
                        v-model="alarm.caseEndTime"
                        type="datetime"
                        placeholder="选择时间"/>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="发案日期" prop="caseHappenTime">
                <el-date-picker
                        v-model="alarm.caseHappenTime"
                        type="date"
                        placeholder="选择时间"/>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="发案区划" prop="caseHappenRegion">
                <el-input v-model="alarm.caseHappenRegion"/>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="现场保护情况" prop="sceneProtect">
                <el-input v-model="alarm.sceneProtect"/>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="案件类型 " prop="caseType">
                <el-input v-model="alarm.caseType"/>
              </el-form-item>
            </el-col>
          </el-row>
          <el-form-item label="当事人">
            <el-table
                    :data="tableData"
                    height="250"
                    border
                    style="width: 100%">
              <el-table-column
                      prop="date"
                      label="编号"
              >
              </el-table-column>
              <el-table-column
                      prop="name"
                      label="姓名"
              >
              </el-table-column>
              <el-table-column
                      prop="address"
                      label="身份类别">
              </el-table-column>
              <el-table-column
                      prop="address"
                      label="身份证号码">
              </el-table-column>
              <el-table-column
                      prop="address"
                      label="性别">
              </el-table-column>
            </el-table>
          </el-form-item>
          <el-form-item label="损失情况">
            <el-table
                    :data="tableData"
                    height="250"
                    border
                    style="width: 100%">
              <el-table-column
                      prop="date"
                      label="编号"
              >
              </el-table-column>
              <el-table-column
                      prop="name"
                      label="名称"
              >
              </el-table-column>
              <el-table-column
                      prop="address"
                      label="型号">
              </el-table-column>
              <el-table-column
                      prop="address"
                      label="特征">
              </el-table-column>
              <el-table-column
                      prop="address"
                      label="数量">
              </el-table-column>
            </el-table>
          </el-form-item>
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="主办" prop="sceneProtect">
                <el-input v-model="alarm.sceneProtect"/>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="协办 " prop="caseType">
                <el-input v-model="alarm.caseType"/>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="照相" prop="sceneProtect">
                <el-input v-model="alarm.sceneProtect"/>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="录像 " prop="caseType">
                <el-input v-model="alarm.caseType"/>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="法医" prop="sceneProtect">
                <el-input v-model="alarm.sceneProtect"/>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="现场保护民警 " prop="caseType">
                <el-input v-model="alarm.caseType"/>
              </el-form-item>
            </el-col>
          </el-row>
          <el-form-item label="是否有监控" prop="sceneProtect">
            <el-checkbox v-model="checked"></el-checkbox>
          </el-form-item>
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="处所" prop="sceneProtect">
                <el-input v-model="alarm.sceneProtect"/>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="作案时机" prop="caseType">
                <el-input v-model="alarm.caseType"/>
              </el-form-item>
            </el-col>
          </el-row>

          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="侵入方式" prop="sceneProtect">
                <el-input v-model="alarm.sceneProtect"/>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="作案出口" prop="caseType">
                <el-input v-model="alarm.caseType"/>
              </el-form-item>
            </el-col>
          </el-row>

          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="作案人数" prop="sceneProtect">
                <el-input v-model="alarm.sceneProtect"/>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="作案工具" prop="caseType">
                <el-input v-model="alarm.caseType"/>
              </el-form-item>
            </el-col>
          </el-row>
          <el-form-item label="作案过程" prop="caseType">
            <el-input v-model="alarm.caseType" type="textarea"/>
          </el-form-item>
          <el-form-item label="是否十类案件" prop="sceneProtect">
            <el-checkbox v-model="checked"></el-checkbox>
          </el-form-item>
          <el-form-item label="是否死亡案件" prop="sceneProtect">
            <el-checkbox v-model="checked"></el-checkbox>
          </el-form-item>
        </div>

        <div style="width: 700px;margin-left: 30px">
          <el-divider>物证信息</el-divider>
          <el-form-item label-width="auto">
            <el-table
                    :data="tableData"
                    height="250"
                    border
                    style="width: 100%">
              <el-table-column
                      prop="date"
                      label="物证编码"
              >
              </el-table-column>
              <el-table-column
                      prop="name"
                      label="物证库编号"
              >
              </el-table-column>
              <el-table-column
                      prop="address"
                      label="物证类别">
              </el-table-column>
              <el-table-column
                      prop="address"
                      label="物证类型">
              </el-table-column>
              <el-table-column
                      prop="address"
                      label="提取日期">
              </el-table-column>
              <el-table-column
                      prop="address"
                      label="提取人">
              </el-table-column>
            </el-table>
          </el-form-item>
          <el-form-item label-width="auto">
            <el-table
                    :data="tableData"
                    height="250"
                    border
                    style="width: 100%">
              <el-table-column
                      prop="date"
                      label="文书编号"
              >
              </el-table-column>
              <el-table-column
                      prop="name"
                      label="文书号"
              >
              </el-table-column>
              <el-table-column
                      prop="address"
                      label="文书种类">
              </el-table-column>
              <el-table-column
                      prop="address"
                      label="关联物证名称">
              </el-table-column>
              <el-table-column
                      prop="address"
                      label="关。。。">
              </el-table-column>
              <el-table-column
                      prop="address"
                      label="提交人">
              </el-table-column>
              <el-table-column
                      prop="address"
                      label="可靠程度">
              </el-table-column>
              <el-table-column
                      prop="address"
                      label="利用情况">
              </el-table-column>
              <el-table-column
                      prop="address"
                      label="是否入库">
              </el-table-column>
              <el-table-column
                      prop="address"
                      label="是否移交">
              </el-table-column>
            </el-table>
          </el-form-item>

        </div>
      </el-form>

    </div>
    <el-button type="primary"  @click="step++">下一步(展示)</el-button>
    <el-button type="primary"  @click="step--">上一步(展示)</el-button>
    <el-dialog
      :visible.sync="dialogGroup"
      title="岗位选择"
      width="25%"
      center>
      <span>下一步转到：</span>
      <el-select v-model="next" placeholder="请选择岗位">
        <el-option
          v-for="item in groupList"
          :key="item.id"
          :label="item.title"
          :value="item.id"/>
      </el-select>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogGroup = false">取 消</el-button>
        <el-button type="primary" @click="nextTask">确 定</el-button>
      </span>
    </el-dialog>

  </div>
</template>

<script>
import { groupList, createTask, nextTask } from '@/api/task'
import { createAlarm } from '@/api/task'

export default {
  name: 'AddTask',
  data() {
    const max20 = (rule, value, callback) => {
      if (value.length < 20) {
        callback(new Error('Please enter the correct user name'))
      } else {
        callback()
      }
    }
    return {
      step: 3,
      task: {
        caseNo: 'A350181',
        instanceNo: '',
        caseCategoryId: '',
        caseAddress: '',
        caseDigest: '',
        lostDetail: ''

      },
      taskRules: {
        taskNo: [{ required: true, trigger: 'blur', validator: max20 }],
        caseNo: [{ required: true, trigger: 'blur', validator: max20 }],
        caseCategoryId: [{ required: true, trigger: 'blur' }],
        caseAddress: [{ required: true, trigger: 'blur' }],
        caseDigest: [{ required: true, trigger: 'blur' }],
        lostDetail: [{ required: true, trigger: 'blur' }]
      },
      dialogGroup: false,
      groupList: [],
      next: null,
      taskId: null,
      alarm: {
        id: undefined,
        reporter: '',
        reportOrg: '',
        contactPhoneNumber: '',
        lostDetails: '',
        driverName: '',
        receiptUid: '',
        monitorUid: '',
        techUid: '',
        leaderUid: '',
        receiptTime: new Date()
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

    }
  },
  created() {
    this.getGroup()
  },
  // computed: {
  //     userInfo() {
  //         return this.$store.state.app.sidebar
  //     },
  //
  //
  // },
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
    nextTask() {
      if (this.step === 1){
        this.task();
      } else if (this.step === 2) {
        this.alarm();
      }

    },
    task(){
      this.$refs.task.validate(valid => {
        if (valid) {
          if (!this.next) {
            this.$message({
              message: '请选择下一步岗位',
              type: 'warning'
            })
          } else {
            createArticle(this.task).then(response => {
              if (response.code === 200) {
                const sendData = {
                  caseId: response.id,
                  groupId: this.next
                }
                nextTask(sendData).then(taskData => {
                  if (taskData.code === 200) {
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
      this.next = null;
    },
    alarm(){
      this.$refs.alarmForm.validate(valid => {
        if (valid) {
          if (!this.next) {
            this.$message({
              message: '请选择下一步岗位',
              type: 'warning'
            })
          } else {
            createAlarm(this.alarm).then(response => {
              if (response.code === 200) {
                const sendData = {
                  caseId: response.id,
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
      this.next = null;
    },

  }
}
</script>

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
