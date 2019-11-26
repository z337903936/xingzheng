<template>
  <div class="app-container">
    <div class="action_container">
      <div class="action_title"/>
      <div class="action_button">
        <router-link :to="'/system/createParamConfig/'">
          <el-button type="primary" icon="el-icon-add">添加</el-button>
        </router-link>
      </div>
    </div>
    <el-form :inline="true" class="demo-form-inline">
      <el-form-item label="关键字">
        <el-input v-model="listQuery.key" placeholder="关键字"/>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" @click="getList">查询</el-button>
      </el-form-item>
    </el-form>
    <el-table v-loading="listLoading" :data="list" border fit highlight-current-row style="width: 100%">
      <el-table-column align="center" label="ID" width="80">
        <template slot-scope="scope">
          <span>{{ scope.row.id }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="key">
        <template slot-scope="scope">
          <span>{{ scope.row.key }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="值">
        <template slot-scope="scope">
          <span>{{ scope.row.value }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="备注">
        <template slot-scope="scope">
          <span>{{ scope.row.note }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="操作" width="240">
        <template slot-scope="scope">
          <router-link :to="'/system/editParamConfig/'+scope.row.id">
            <el-button type="primary" size="small" icon="el-icon-edit">编辑</el-button>
          </router-link>
          <el-button size="small" icon="el-icon-delete" @click="del(scope.row.id)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>1" :total="total" :page.sync="listQuery.page" @pagination="getList"/>

  </div>
</template>

<script>
import { fetchList, delInfo } from '@/api/paramConfig'
import Pagination from '@/components/Pagination'

export default {
  name: 'List',
  components: { Pagination },
  data() {
    return {
      list: null,
      total: 0,
      listLoading: true,
      listQuery: {
        key: '',
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
      fetchList(this.listQuery).then(data => {
        this.list = data.list
        this.total = data.pages
        this.listLoading = false
      })
    },
    del(id) {
      this.$confirm('您确认要删除该品牌吗, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        var param = {
          id: id,
          operation: 'del'
        }
        delInfo(param).then(data => {
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
