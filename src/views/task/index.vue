<template>
  <div>
    <el-steps :active="step" finish-status="success" simple style="margin-top: 20px">
      <el-step title="生成案件" />
      <el-step title="" />
    </el-steps>
    <div class="part-1">
      <el-form
        :model="temp"
        label-position="center"
        label-width="100px"
        style="width: 600px; margin:auto;">
        <el-form-item label="案件编号" prop="sort">
          <el-input v-model="temp.thirdCaseNo"/>
        </el-form-item>
        <el-form-item label="任务编号" prop="path">
          <el-input v-model="temp.taskNo"/>
        </el-form-item>
        <el-form-item label="案件分类" prop="component">
          <el-input v-model="temp.caseCategoryId"/>
        </el-form-item>
        <el-form-item label="案发地点" prop="redirect">
          <el-input v-model="temp.caseAddress"/>
        </el-form-item>
        <el-form-item label="案发摘要" prop="name">
          <el-input v-model="temp.caseDigest"/>
        </el-form-item>
        <el-form-item label="损失情况" prop="title">
          <el-input v-model="temp.lostDetails"/>
        </el-form-item>
      </el-form>

    </div>

  </div>
</template>

<script>
export default {
  name: 'Task',
  data() {
    return {
      step: 1,
      temp: {
        thirdCaseNo: '',
        taskNo: '',
        caseCategoryId: '',
        caseAddress: '',
        caseDigest: '',
        lostDetails: ''

      }
    }
  }
}
</script>

<style scoped>
.part-1{
    width: 100%;
    margin-top: 100px;
}
</style>
