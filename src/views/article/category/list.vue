<template>
  <div class="app-container">
    <div class="action_container">
      <div class="action_title"/>
      <div class="action_button">
        <router-link :to="'/article/createCategory/'">
          <el-button type="primary" icon="el-icon-add">添加类型</el-button>
        </router-link>
      </div>
    </div>
    <el-table v-loading="listLoading" :data="list" border fit highlight-current-row style="width: 100%">
      <el-table-column align="center" label="ID" width="80">
        <template slot-scope="scope">
          <span>{{ scope.row.id }}</span>
        </template>
      </el-table-column>

      <el-table-column width="180px" align="center" label="时间">
        <template slot-scope="scope">
          <span>{{ scope.row.updateTime | parseTime('{y}-{m}-{d} {h}:{i}') }}</span>
        </template>
      </el-table-column>

      <el-table-column min-width="200px" label="名字">
        <template slot-scope="scope">
          <router-link :to="'/article/editCategory/'+scope.row.id" class="link-type">
            <span>{{ scope.row.name }}</span>
          </router-link>
        </template>
      </el-table-column>

      <el-table-column class-name="status-col" label="状态" width="110">
        <template slot-scope="scope">
          <el-tag :type="scope.row.status | statusFilter">{{ scope.row.status == 1?"显示":"隐藏" }}</el-tag>
        </template>
      </el-table-column>

      <el-table-column align="center" label="操作" width="240">
        <template slot-scope="scope">
          <router-link :to="'/article/editCategory/'+scope.row.id">
            <el-button type="primary" size="small" icon="el-icon-edit">编辑</el-button>
          </router-link>
          <el-button  type="danger" size="small" icon="el-icon-delete" @click="deleteCategory(scope.row.id)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" @pagination="getList"/>

  </div>
</template>

<script>
import { fetchAllCateList, delCategory } from '@/api/category'
import Pagination from '@/components/Pagination' // Secondary package based on el-pagination

export default {
  name: 'CategoryList',
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
      fetchAllCateList(this.listQuery).then(data => {
        this.list = data.list
        this.total = data.pages
        this.listLoading = false
      })
    },
    deleteCategory(id) {
      this.$confirm('您确认要删除该分类吗, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        console.log(id)
        var param = {
          categoryId: id,
          operation: 'del'
        }
        delCategory(param).then(data => {
          this.loading = false
          if (data.code === 200) {
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
