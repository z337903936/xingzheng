<template>
  <div class="app-container">
    <div class="filter-container">
      <div class="mb10">
        <el-date-picker
          v-model="searchTime"
          type="daterange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          value-format="yyyy-MM-dd"
        />
        <el-input v-model="listQuery.caseNo" placeholder="案件编号" style="width: 200px;margin-left: 5px" @keyup.enter.native="handleFilter" />
        <el-button v-waves type="primary" icon="el-icon-search" @click="handleFilter">
          搜索
        </el-button>
        <!--<router-link :to="'/permissions/edit-role/'">-->
          <!--<el-button style="margin-left: 10px;" type="primary" icon="el-icon-edit" >-->
            <!--添加-->
          <!--</el-button>-->
        <!--</router-link>-->
      </div>

      <div>
        <!--<el-input v-model="listQuery.caseNo" placeholder="案件编号" style="width: 200px;" @keyup.enter.native="handleFilter" />-->
        <!--<el-input v-model="listQuery.status" placeholder="报告单位" style="width: 200px;" @keyup.enter.native="handleFilter" />-->
        <!--<el-input v-model="listQuery.title" placeholder="报告人" style="width: 200px;" @keyup.enter.native="handleFilter" />-->
        <!--<el-select v-model="listQuery.type" placeholder="案件类别" style="width: 140px">-->
        <!--<el-option v-for="item in calendarTypeOptions" :key="item.key" :label="item.display_name+'('+item.key+')'" :value="item.key" />-->
        <!--</el-select>-->

        <!--<el-button style="margin-left: 10px;" type="primary" icon="el-icon-delete" @click="handleCreate">-->
        <!--删除-->
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
      <el-table-column label="案件编号" prop="caseNo" align="center" >
        <template slot-scope="{row}">
          <span>{{ row.caseNo }}</span>
        </template>
      </el-table-column>
      <el-table-column label="任务编号" >
        <template slot-scope="{row}">
          <span>{{ row.instanceNo }}</span>
        </template>
      </el-table-column>

      <el-table-column label="案件分类" >
        <template slot-scope="{row}">
          <span>{{ row.caseCategoryId }}</span>
        </template>
      </el-table-column>
      <el-table-column label="案发地点" align="center">
        <template slot-scope="{row}">
          <span>{{ row.caseAddress }}</span>
        </template>
      </el-table-column>
      <el-table-column label="案发摘要"  align="center">
        <template slot-scope="{row}">
          <span>{{ row.caseDigest }}</span>
        </template>
      </el-table-column>
      <el-table-column label="损失情况" align="center">
        <template slot-scope="{row}">
          <span>{{ row.lostDetail }}</span>
        </template>
      </el-table-column>

      <el-table-column label="状态" class-name="status-col">
        <template slot-scope="{row}">
          <el-tag :type="row.status | statusFilter">
            {{ row.status }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="创建时间" width="150px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.createTime | parseTime('{y}-{m}-{d} {h}:{i}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="230" class-name="small-padding fixed-width">
        <template slot-scope="{row}">
          <el-button type="primary" size="mini" @click="handleUpdate(row)">
            编辑
          </el-button>
          <!--<el-button size="mini" type="success">-->
            <!--查看-->
          <!--</el-button>-->
        </template>
      </el-table-column>
    </el-table>
    <!--<pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />-->
    <pagination v-show="pages>0" :page-count="pages" :total="pages" @pagination="getList"/>
    <el-dialog title="修改" :visible.sync="dialogFormUpdate" width="30%">
      <el-form
              ref="taskRef"
              :model="task"
              :rules="taskRules"
              label-position="center"
              label-width="100px"
              style="width: 400px;">
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
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormAdd = false">
          取 消
        </el-button>
        <el-button type="primary" @click="updateData()">
          确 定
        </el-button>
      </div>
    </el-dialog>

  </div>
</template>

<style>
    .mb10{
        margin-bottom: 10px;
    }
</style>

<script>
import { fetchList, fetchArticle, createArticle, updateArticle } from '@/api/task'
import waves from '@/directive/waves' // waves directive
import { parseTime } from '@/utils'
import Pagination from '@/components/Pagination' // secondary package based on el-pagination

export default {
  name: 'Task',
  components: { Pagination },
  directives: { waves },
  filters: {
    statusFilter(status) {
      const statusMap = {
        published: 'success',
        draft: 'info',
        deleted: 'danger'
      }
      return statusMap[status]
    }

  },
  data() {
    const max20 = (rule, value, callback) => {
      if (value.length > 20) {
        callback(new Error('输入的内容过长'))
      } else {
        callback()
      }
    }
    return {
      tableKey: 0,
      list: null,
      pages: 0,
      listLoading: true,
      listQuery: {
        page: 1,
        beginTime: undefined,
        endTime: undefined,
        caseNo: undefined,
        status: undefined
      },
      searchTime: '',

      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: 'Edit',
        create: 'Create'
      },
      dialogPvVisible: false,
      pvData: [],
      task: {
      },
      taskRules: {
        taskNo: [{ required: true, trigger: 'blur', validator: max20 }],
        caseNo: [{ required: true, trigger: 'blur', validator: max20 }],
        caseCategoryId: [{ required: true, trigger: 'blur' }],
        caseAddress: [{ required: true, trigger: 'blur' }],
        caseDigest: [{ required: true, trigger: 'blur' }],
        lostDetail: [{ required: true, trigger: 'blur' }]
      },
      dialogFormUpdate: false,
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
      this.listQuery.beginTime = this.searchTime[0];
      this.listQuery.endTime = this.searchTime[1];
      console.log(this.listQuery)
      this.listQuery.page = 1
      this.getList()
    },
    handleUpdate(row) {
      this.task = Object.assign({}, row) // copy obj
      this.dialogFormUpdate = true
      this.$nextTick(() => {
        this.$refs['taskRef'].clearValidate()
      })
    },
    updateData() {
      this.$refs['taskRef'].validate((valid) => {
        if (valid) {
          const tempData = Object.assign({}, this.task)
          updateArticle(tempData).then(response => {
            if (response.code === 200) {
              this.dialogFormUpdate = false
              this.$notify({
                title: 'Success',
                message: '修改成功',
                type: 'success',
                duration: 2000
              })
              this.getList()
            }
          })
        }
      })
    },



  }
}
</script>
