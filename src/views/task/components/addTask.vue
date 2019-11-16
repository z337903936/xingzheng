<template>
  <div>
    <el-steps :active="2" align-center finish-status="success" style="margin-top: 20px">
      <el-step style="color: rgb(64, 158, 255)!important;" title="添加案件"/>
      <el-step style="color: rgb(64, 158, 255)!important;" title="接警"/>
    </el-steps>
    <div class="main task" hidden>
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
        <el-button type="primary" style="float: right" @click="dialogGroup = true">下一步</el-button>
      </div>
    </div>

    <div class="main">
      <el-form
        ref="alarmForm"
        :rules="alarmFormRules"
        :model="alarm"
        label-position="left"
        label-width="120px"
        style="width: 700px; margin-left:50px;">
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
              <!--<el-checkbox v-model="checked">短信通知</el-checkbox>-->
            </el-form-item>

          </el-col>
          <el-col :span="12">
            <el-form-item label="值班技术员" prop="techUid">
              <el-input v-model="alarm.techUid"/>
              <!--<el-checkbox v-model="checked">短信通知</el-checkbox>-->
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="大队值班领导" prop="leaderUid">
              <el-input v-model="alarm.leaderUid"/>
              <!--<el-checkbox v-model="checked">短信通知</el-checkbox>-->
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
        <el-button type="primary" style="float: right" @click="dialogGroup = true">下一步</el-button>
      </div>
    </div>

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
import { groupList, createArticle, nextTask } from '@/api/task'

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
      step: 1,
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
      }
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
                  if (response.code === 200) {
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
          })
          return false
        }
      })
    }
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
