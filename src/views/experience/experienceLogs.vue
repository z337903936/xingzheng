<template>
  <div class="app-container">
    <el-form :inline="true" class="demo-form-inline">
      <el-form-item label="项目类型">
        <el-select v-model="listQuery.itemId">
          <el-option key="0" label="全部" value="0" />
          <el-option key="1" label="超级短信" value="1" />
          <el-option key="2" label="普通短信" value="2"/>
        </el-select>
      </el-form-item>
      <el-form-item label="开始时间">
        <el-date-picker
          v-model="listQuery.beginTime"
          type="datetime"
          format="yyyy-MM-dd"
          value-format="timestamp"
          placeholder="请选择开始时间"/>
      </el-form-item>
      <el-form-item label="结束时间">
        <el-date-picker
          v-model="listQuery.endTime"
          type="datetime"
          format="yyyy-MM-dd"
          value-format="timestamp"
          placeholder="请选择结束时间"/>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" @click="getList">查询</el-button>
      </el-form-item>
    </el-form>
    <el-table v-loading="listLoading" :data="list" border fit highlight-current-row style="width: 100%">

      <el-table-column align="center" label="项目">
        <template slot-scope="scope">
          <span v-if="scope.row.itemId==1">超级短信</span>
          <span v-else-if="scope.row.itemId==2">普通短信</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="手机号码">
        <template slot-scope="scope">
          <span>{{ scope.row.phoneNumber }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="内容">
        <template slot-scope="scope">
          <span>{{ scope.row.content }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="富信模板ID">
        <template slot-scope="scope">
          <span>{{ scope.row.templateId }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="状态">
        <template slot-scope="scope">
          <span v-if="scope.row.status==1">未联系</span>
          <span v-else-if="scope.row.status==2">已联系</span>
          <span v-else-if="scope.row.status==3">需要跟进</span>
          <span v-else-if="scope.row.status==4">已加盟</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="备注">
        <template slot-scope="scope">
          <span>{{ scope.row.note }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作员">
        <template slot-scope="scope">
          <span>{{ scope.row.handler }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="提交时间">
        <template slot-scope="scope">
          <span>{{ scope.row.createTime | parseTime('{y}-{m}-{d} {h}:{i}') }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="操作">
        <template slot-scope="scope">
          <el-button type="primary" size="small" icon="el-icon-edit" @click="edit(scope.row.id,scope.row.status,note)">
            编辑
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" @pagination="getList"/>

    <el-dialog title="修改状态" :visible.sync="dialogFormVisible">
      <el-form>
        <el-form-item label="状态列表" :label-width="formLabelWidth">
          <el-select v-model="status" placeholder="状态列表">
            <el-option label="未联系" value="1"></el-option>
            <el-option label="已联系" value="2"></el-option>
            <el-option label="需要跟进" value="3"></el-option>
            <el-option label="已加盟" value="4"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="备注" :label-width="formLabelWidth">
          <el-input v-model="note" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="handleChangeStatus">确 定</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
  import { fetchExperienceLogs, setExperienceLogStatus } from '@/api/dealerExperience'
  import Pagination from '@/components/Pagination'

  export default {
    name: 'DealerSubmitLogs',
    components: { Pagination },
    filters: {
      statusFilter(status) {
        const statusMap = {
          true: 'success',
          false: 'danger'
        }
        return statusMap[status]
      }
    },
    data() {
      return {
        list: null,
        total: 0,
        listLoading: true,
        dialogFormVisible: false,
        status: '',
        note: '',
        formLabelWidth: '120px',
        listQuery: {
          uid: '',
          itemId: '0',
          beginTime: '',
          endTime: '',
          page: 1
        }
      }
    },
    created() {
      this.getList()
    },
    methods: {
      edit(id, status, note) {
        this.currentId = id
        this.status = status + ''
        this.note = note
        this.dialogFormVisible = true
      },
      handleChangeStatus() {
        this.loading = true
        var data = {
          id: this.currentId,
          status: this.status,
          note: this.note
        }
        setExperienceLogStatus(data).then(data => {
          this.loading = false
          if (data.code == 200) {
            this.$message({
              message: '保存成功',
              type: 'success',
              showClose: true,
              duration: 1000
            })
            this.getList()
          } else {
            this.$message({
              message: data.reason,
              type: 'error',
              showClose: true,
              duration: 1000
            })
          }
          this.dialogFormVisible = false
        }).catch(err => {
          console.log(err)
          this.loading = false
          this.dialogFormVisible = false
        })
        this.dialogFormVisible = false
      },
      getList() {
        this.listLoading = true
        const param = {}
        if (this.listQuery.itemId) {
          param.itemId = this.listQuery.itemId
        }
        if (this.listQuery.beginTime) {
          param.beginTime = this.listQuery.beginTime
        }
        if (this.listQuery.endTime) {
          param.endTime = this.listQuery.endTime
        }
        param.page = this.listQuery.page
        fetchExperienceLogs(param).then(data => {
          this.list = data.list
          this.total = data.pages
          this.listLoading = false
        })
      }
    }
  }
</script>

<style scoped>
  .edit-input {
    padding-right: 100px;
  }

  .cancel-btn {
    position: absolute;
    right: 15px;
    top: 10px;
  }

  .carousel_img {
    width: 30%;
  }
</style>
