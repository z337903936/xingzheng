<template>
  <div class="app-container">

    <el-table v-loading="listLoading" :data="list" border fit highlight-current-row style="width: 100%">
      <el-table-column align="center" label="ID" width="80">
        <template slot-scope="scope">
          <span>{{ scope.row.id }}</span>
        </template>
      </el-table-column>

      <el-table-column min-width="200px" label="职位">
        <template slot-scope="scope">
          <router-link :to="'/job/edit/'+scope.row.id" class="link-type">
            <span>{{ scope.row.title }}</span>
          </router-link>
        </template>
      </el-table-column>

      <el-table-column width="100px" label="数量">
        <template slot-scope="scope">
          <span>{{ scope.row.number }}</span>
        </template>
      </el-table-column>
      <el-table-column width="100px" label="部门">
        <template slot-scope="scope">
          <span>{{ scope.row.partment }}</span>
        </template>
      </el-table-column>

      <el-table-column width="180px" align="center" label="招聘时间">
        <template slot-scope="scope">
          <span>{{ scope.row.publishDay }}</span>
        </template>
      </el-table-column>
      <el-table-column width="180px" align="center" label="结束时间">
        <template slot-scope="scope">
          <span>{{ scope.row.endDay }}</span>
        </template>
      </el-table-column>

      <el-table-column class-name="status-col" label="状态" width="110">
        <template slot-scope="scope">
          <el-tag :type="scope.row.needShow | statusFilter">{{ scope.row.needShow == 1?"显示":"隐藏" }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作" width="240">
        <template slot-scope="scope">
          <router-link :to="'/job/edit/'+scope.row.id">
            <el-button type="primary" size="small" icon="el-icon-edit">编辑</el-button>
          </router-link>
          <el-button size="small" icon="el-icon-delete" @click="deleteJob(scope.row.id)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" @pagination="getList"/>

  </div>
</template>

<script>
import { fetchJobList, delJob } from '@/api/job'
import Pagination from '@/components/Pagination' // Secondary package based on el-pagination

export default {
  name: 'JobList',
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
      listQuery: {
        page: 1
      }
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      this.listLoading = true
      fetchJobList(this.listQuery).then(data => {
        this.list = data.list
        this.total = data.pages
        this.listLoading = false
      })
    },
    deleteJob(id) {
      this.$confirm('您确认要删除该职位吗, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        console.log(id)
        var param = {
          id: id,
          operation: 'del'
        }
        delJob(param).then(data => {
          this.loading = false
          if (data.code == 200) {
            this.$message({
              message: '已删除成功',
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
        }).catch(err => {
          console.log(err)
          this.loading = false
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    handleSizeChange(val) {
      this.listQuery.limit = val
      this.getList()
    },
    handleCurrentChange(val) {
      this.listQuery.page = val
      this.getList()
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
