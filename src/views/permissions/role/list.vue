<template>
  <div class="app-container">
    <div class="create_container">
      <el-button v-loading="listLoading" :rows="1" type="primary" @click="toToAddRolePage()">添加岗位
      </el-button>
    </div>

    <el-table v-loading="listLoading" :data="list" border fit highlight-current-row style="width: 100%">
      <el-table-column align="center" label="ID" width="80">
        <template slot-scope="scope">
          <span>{{ scope.row.id }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="时间">
        <template slot-scope="scope">
          <span>{{ scope.row.createdTime | parseTime('{y}-{m}-{d} {h}:{i}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="名字">
        <template slot-scope="scope">
          <router-link :to="'/permissions/edit-role/'+scope.row.id" class="link-type">
            <span>{{ scope.row.groupName }}</span>
          </router-link>
        </template>
      </el-table-column>
      <el-table-column label="备注">
        <template slot-scope="scope">
          <span>{{ scope.row.description }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作" width="700">
        <template slot-scope="scope">
          <router-link :to="'/permissions/edit-role/'+scope.row.id">
            <el-button type="primary" size="small" icon="el-icon-edit">编辑</el-button>
          </router-link>
          <router-link :to="'/permissions/bind-group-user/'+scope.row.id">
            <el-button type="primary" size="small" icon="el-icon-menu">设置权限</el-button>
          </router-link>
          <router-link :to="'/permissions/bind-group-menu/'+scope.row.id" >
            <el-button type="primary" size="small" icon="el-icon-menu">设置菜单</el-button>
          </router-link>
          <el-button size="small" icon="el-icon-delete" @click="deleteRole(scope.row.id)">删除</el-button>

        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>1" :total="total" :page.sync="listQuery.page" @pagination="getList"/>

  </div>
</template>

<script>
import { fetchRoleList, delRole } from '@/api/permissions'
import Pagination from '@/components/Pagination' // Secondary package based on el-pagination

export default {
  name: 'RoleList',
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
      fetchRoleList(this.listQuery).then(data => {
        this.list = data.list
        if (data.pages) this.total = data.pages
        this.listLoading = false
      })
    },
    deleteRole(id) {
      this.$confirm('您确认要删除该角色吗, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        var param = {
          id: id,
          operation: 'del'
        }
        delRole(param).then(data => {
          this.listLoading = false
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
          this.listLoading = false
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
    },
    toToAddRolePage() {
      this.$router.push({
        path: '/permissions/create-role/',
        query: {
          t: +new Date()
        }
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

  .create_container {
    float: right;
    margin:10px 20px;
  }
</style>
