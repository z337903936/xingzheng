<template>
  <div class="app-container">
    <el-tree
      ref="tree"
      :data="list"
      :props="defaultProps"
      show-checkbox
      node-key="id"
      highlight-current
    />
    <div class="save_container">
      <el-button v-loading="saveLoading" :rows="1" type="primary" @click="saveRoleActions()">保存
      </el-button>
    </div>
  </div>
</template>

<script>
import { fetchActionList, getRoleActionByRoleId, updateGroupAction } from '@/api/permissions'

export default {
  name: 'ActionList',
  components: {},
  filters: {},
  data() {
    return {
      list: [],
      listLoading: false,
      saveLoading: false,
      roleId: 0,
      defaultProps: {
        children: 'children',
        label: 'actionDesc'
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
      this.roleId = this.$route.params && this.$route.params.id
      fetchActionList(this.listQuery).then(data => {
        if (data.code === 200) {
          for (var prop in data) {
            var itemList = data[prop]
            if (itemList.length > 0) {
              var moduleName = itemList[0].moduleDesc
              var id = 'T:' + itemList[0].id
              this.list.push({
                id: id,
                actionDesc: moduleName,
                children: itemList
              })
            }
          }
          getRoleActionByRoleId(this.roleId).then(data => {
            if (data.list) {
              var checkedList = []
              data.list.map(each => {
                checkedList.push({
                  id: each.id,
                  actionDesc: each.actionDesc
                })
              })
              this.$refs.tree.setCheckedNodes(checkedList)
            }
          })
        }

        this.listLoading = false
      })
    },
    saveRoleActions() {
      var checkedKeys = this.$refs.tree.getCheckedKeys()
      var resultKeys = []
      checkedKeys.map(each => {
        var index = each.indexOf('T:')
        if (index !== 0) {
          resultKeys.push(each)
        }
      })
      this.saveLoading = true
      var data = {
        groupId: this.roleId,
        actionId: resultKeys.toString()
      }
      updateGroupAction(data).then(res => {
        if (res.code === 200) {
          this.$message({
            message: '已保存',
            type: 'success',
            showClose: true,
            duration: 1000
          })
        } else {
          this.$message({
            message: res.reason,
            type: 'error',
            showClose: true,
            duration: 2000
          })
        }
        this.saveLoading = false
      }).catch(err => {
        console.log(err)
        this.saveLoading = false
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

  .save_container {
    margin:20px;
    padding-bottom: 10px;
    display: flex;
    justify-content: flex-start;
  }
</style>
