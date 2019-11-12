<template>
  <div class="app-container">
    <div class="action_container">
      <div class="action_title"><h3>管理员列表</h3></div>
      <div class="action_button">
        <el-button :rows="1" type="primary" @click="toToAddMemberPage()">添加管理员
        </el-button>
      </div>
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

      <el-table-column label="名字" align="center">
        <template slot-scope="scope">
          <router-link :to="'/permissions/edit-admin-member/'+scope.row.id" class="link-type">
            <span>{{ scope.row.realName }}</span>
          </router-link>
        </template>
      </el-table-column>
      <el-table-column label="帐号" align="center">
        <template slot-scope="scope">
          <router-link :to="'/permissions/edit-admin-member/'+scope.row.id" class="link-type">
            <span>{{ scope.row.userName }}</span>
          </router-link>
        </template>
      </el-table-column>

      <el-table-column label="角色" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.groupName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="最后登录IP" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.lastLoginIP }}</span>
        </template>
      </el-table-column>

      <el-table-column class-name="status-col" label="状态" width="110" align="center">
        <template slot-scope="scope">
          <el-tag :type="scope.row.status | statusFilter">{{ scope.row.status == 1?"正常":"锁定" }}</el-tag>
        </template>
      </el-table-column>

      <el-table-column align="center" label="操作" width="240">
        <template slot-scope="scope">
          <router-link :to="'/permissions/edit-admin-member/'+scope.row.id">
            <el-button type="primary" size="small" icon="el-icon-edit">编辑</el-button>
          </router-link>
          <el-button size="small" icon="el-icon-delete" @click="deleteAdminMember(scope.row.id)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>1" :total="total" :page.sync="listQuery.page" @pagination="getList" />

  </div>
</template>

<script>
import { fetchAdminMemberList, delAdminMember } from '@/api/permissions'
import Pagination from '@/components/Pagination' // Secondary package based on el-pagination

export default {
  name: 'ArticleList',
  components: { Pagination },
  filters: {
    statusFilter(status) {
      const statusMap = {
        1: 'success',
        2: 'danger'
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
    // this.getList()
  },
  methods: {
    getList() {
      this.listLoading = true
      fetchAdminMemberList(this.listQuery).then(data => {
        this.list = data.list
        if (data.pages) this.total = data.pages
        this.listLoading = false
      })
    },
    deleteAdminMember(id) {
      this.$confirm('您确认要删除该成员吗, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        console.log(id)
        var param = {
          id: id,
          operation: 'del'
        }
        delAdminMember(param).then(data => {
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
    toToAddMemberPage() {
      this.$router.push({
        path: '/permissions/create-admin-member/',
        query: {
          t: +new Date()
        }
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
  .action_container {
    display: flex;
  }

  .action_title {
    flex: 24 auto;
    align-self: flex-start;
  }

  .action_button {
    margin-top: -10px;
    padding-bottom: 20px;
    flex: 1 auto;
    align-self: flex-end;
  }
</style>
