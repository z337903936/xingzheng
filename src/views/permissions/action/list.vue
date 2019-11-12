<template>
  <div class="app-container">
    <div class="action_container">
      <div class="action_title"><h3>权限列表</h3></div>
      <div class="action_button">
        <el-button :rows="1" type="primary" @click="toToAddActionPage()">添加权限
        </el-button>
      </div>
    </div>

    <el-collapse v-model="activeNames" @change="handleChange">
      <el-collapse-item v-for="(item,index) in list" :key="index" :title="item.moduleName" :name="index+1">
        <el-table :data="item.actionList" border fit highlight-current-row style="width: 100%">
          <el-table-column align="center" label="时间">
            <template slot-scope="scope">
              <span>{{ scope.row.createdTime | parseTime('{y}-{m}-{d} {h}:{i}') }}</span>
            </template>
          </el-table-column>
          <el-table-column label="权限名字">
            <template slot-scope="scope">
              <router-link :to="'/permissions/edit-action/'+scope.row.id" class="link-type">
                <span>{{ scope.row.actionDesc }}</span>
              </router-link>
            </template>
          </el-table-column>
          <el-table-column label="模块">
            <template slot-scope="scope">
              <span>{{ scope.row.moduleDesc }}</span>
            </template>
          </el-table-column>
          <el-table-column label="排序值">
            <template slot-scope="scope">
              <span>{{ scope.row.sort }}</span>
            </template>
          </el-table-column>
          <el-table-column align="center" label="操作">
            <template slot-scope="scope">
              <router-link :to="'/permissions/edit-action/'+scope.row.id">
                <el-button type="primary" size="small" icon="el-icon-edit">编辑</el-button>
              </router-link>
              <el-button size="small" icon="el-icon-delete" @click="deleteAction(scope.row.id)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-collapse-item>
    </el-collapse>

  </div>
</template>

<script>
import { fetchActionList, delAction } from '@/api/permissions'

export default {
  name: 'ActionList',
  components: {},
  filters: {},
  data() {
    return {
      list: [],
      total: 0,
      moduleKey: 0,
      listLoading: true,
      activeNames: ['1'],
      listQuery: {
        page: 1
      }
    }
  },
  computed: {},
  created() {
    // this.getList()
  },
  methods: {
    getList() {
      this.listLoading = true
      fetchActionList(this.listQuery).then(data => {
        this.list = []
        for (var prop in data) {
          var itemList = data[prop]
          if (itemList.length > 0) {
            var moduleName = itemList[0].moduleDesc
            this.list.push({
              moduleName: moduleName,
              actionList: itemList
            })
          }
        }
        this.listLoading = false
      })
    },
    deleteAction(id) {
      this.$confirm('您确认要删除该权限吗, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        var param = {
          id: id,
          operation: 'del'
        }
        delAction(param).then(data => {
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
    toToAddActionPage() {
      this.$router.push({
        path: '/permissions/create-action/',
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
    },
    handleChange(val) {
      console.log(val)
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
