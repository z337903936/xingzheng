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
        <el-form-item label="案件分类" prop="caseCategory">
          <el-input v-model="task.caseCategory"/>
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
      <div class="action" v-if="showNext && lastStep">
        <el-button type="primary" style="float: right" @click="addTask(lastStep&& !is_detail)">下一个步骤</el-button>
      </div>

      <div class="action" v-if="showNext&&!lastStep">
        <el-button type="primary" style="float: right" @click="addTask(lastStep)">保存</el-button>
      </div>

    </div>
  </div>
</template>

<script>
  import { fetchList,fetchTask,createTask,updateTask,nextTask,groupList } from '@/api/task'


export default {
  name: 'AddCase',
  props: {
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
        id:'',
        caseNo: 'A350181',
        instanceNo: '',
        caseCategory: '',
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
      showNext:true,
      lastStep:true,

    }
  },
  created() {
    if (this.is_detail) {
      if (this.detailData.currentUserId !== this.detailData.stepHanlderUid){
        this.showNext=false;
      }
      this.lastStep = this.detailData.isLast;
      this.task = Object.assign({}, this.detailData)// copy obj
    }
  },

  methods: {
    addTask(judge){
      this.$refs.task.validate(valid => {
        if (valid) {
          if (judge) {
            createTask(this.task).then(response => {
              if (response.code === 200) {
                this.$parent.setNextStep(response.id);
                this.$message({
                  message: '操作成功',
                  type: 'success',
                  showClose: true,
                  duration: 2000
                })
                this.dialogGroup = false
              }else{
                this.$message({
                  message: response.reason,
                  type: 'success',
                  showClose: true,
                  duration: 2000
                })
              }
            })
          }else{
            updateTask(this.task).then(response => {
              if (response.code === 200) {
                this.$message({
                  message: '操作成功',
                  type: 'success',
                  showClose: true,
                  duration: 2000
                })
                this.dialogGroup = false
              }else{
                this.$message({
                  message: response.reason,
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
