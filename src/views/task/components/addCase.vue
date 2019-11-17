<template>
  <div>
    <div class="main task" >
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
        <el-button type="primary" @click="addTask()">确 定</el-button>
      </span>
    </el-dialog>

  </div>
</template>

<script>
import { groupList, createTask, nextTask } from '@/api/task'


export default {
  name: 'AddCase',
  data() {
    const max20 = (rule, value, callback) => {
      if (value.length > 20) {
        callback(new Error('输入过长'))
      } else {
        callback()
      }
    }
    return {
      step: 1,
      showStep: '添加案件',
      nextStep: '',
      task: {
        caseNo: 'A350181',
        instanceNo: '',
        caseCategoryId: '',
        caseAddress: '',
        caseDigest: '',
        lostDetail: ''

      },
      taskRules: {
        taskNo: [{ required: true, trigger: 'change', validator: max20 }],
        caseNo: [{ required: true, trigger: 'change', validator: max20 }],
        caseCategoryId: [{ required: true, trigger: 'blur' }],
        caseAddress: [{ required: true, trigger: 'blur' }],
        caseDigest: [{ required: true, trigger: 'blur' }],
        lostDetail: [{ required: true, trigger: 'blur' }]
      },
      dialogGroup: false,
      groupList: [
        {
          id:1,title:'接警'
        } ,{
          id:2,title:'现勘'
        }
      ],
      next: null,
      taskId: null,


    }
  },
  created() {
  },

  methods: {
    addTask(){

      this.$refs.task.validate(valid => {
        if (valid) {
          if (!this.next) {
            this.$message({
              message: '请选择下一步岗位',
              type: 'warning'
            })
          } else {
            const sendData = {
              caseId: '',
              groupId: this.next
            }
            createTask(this.task).then(response => {
              if (response.code === 200) {
                this.$parent.setNextStep(sendData.groupId,response.id);
                sendData.caseId = response.id;
                nextTask(sendData).then(taskData => {
                  if (taskData.code === 200) {
                    this.$message({
                      message: '操作成功',
                      type: 'success',
                      showClose: true,
                      duration: 2000
                    })
                    this.dialogGroup = false
                  }else{
                    this.$message({
                      message: taskData.reason,
                      type: 'success',
                      showClose: true,
                      duration: 2000
                    })
                  }
                })
              }else{

                this.$message({
                  message: taskData.reason,
                  type: 'success',
                  showClose: true,
                  duration: 2000
                })
              }
            })
          }
        }else{
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
