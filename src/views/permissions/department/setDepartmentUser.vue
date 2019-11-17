<template>
  <div class="app-container">
    <el-tree
      ref="tree"
      :data="list"
      :props="defaultProps"
      show-checkbox
      node-key="id"
      highlight-current/>
    <div class="save_container">
      <el-button v-loading="saveLoading" :rows="1" type="primary" @click="saveMemberGroup()">保存
      </el-button>
    </div>
  </div>
</template>

<script>
import { fetchAdminMemberList } from '@/api/permissions'
import { setUser, getUser } from '@/api/department'

export default {
  name: 'GroupUserList',
  components: {},
  filters: {},
  data() {
    return {
      list: [],
      listLoading: false,
      saveLoading: false,
      memberId: 0,
      defaultProps: {
        children: 'children',
        label: 'label'
      }
    }
  },
  computed: {},
  created() {
    this.getList()
  },
  methods: {
    getList() {
      this.listLoading = true
      this.memberId = this.$route.params && this.$route.params.id
      fetchAdminMemberList(this.listQuery).then(data => {
        if (data.code === 200) {
          const itemList = data.list
          itemList.map((each) => {
            this.list.push({
              id: each.id,
              label: each.realName,
              children: []
            })
          })
          getUser({
            orgId:this.memberId
          }).then(data => {
            if (data.list) {
              var checkedList = []
              data.list.map(each => {
                checkedList.push({
                  id: each.id,
                  label: each.realName
                })
              })
              this.$refs.tree.setCheckedNodes(checkedList)
            }
          })
        }

        this.listLoading = false
      })
    },
    saveMemberGroup() {
      var checkedKeys = this.$refs.tree.getCheckedKeys()
      var resultKeys = []
      checkedKeys.map(each => {
        resultKeys.push(each)
      })
      this.saveLoading = true
      var data = {
        uid: this.memberId,
        list: resultKeys
      }
      setUser(data).then(res => {
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
