<template>
  <div class="app-container">
    <el-tree
            :data="list"
            show-checkbox
            default-expand-all
            node-key="id"
            ref="tree"
            highlight-current
            :props="defaultProps">
    </el-tree>
    <div class="save_container">
      <el-button v-loading="saveLoading" :rows="1" type="primary" @click="saveMemberGroup()">保存
      </el-button>
    </div>
  </div>
</template>

<script>
import { fetchList,fetchListGroup } from '@/api/menu'
import { bindMemberToMenu } from '@/api/permissions'

export default {
  name: 'BindGroupMenu',
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
      fetchList({}).then(response => {
        if (response.code === 200) {
          this.list  = response.list.map(data=>{
            var menuData = [];
            menuData = {
              id:data.id,
              label:data.title,
              children:[]
            };
            if (data.children){
              var childrenTotal = 0;
              data.children.map(item=>{
                if (!item.hidden){
                  childrenTotal++
                  menuData.children.push({
                    id:item.id,
                    label:item.title,
                  })
                }
              })
            }

            return menuData;
          });
          fetchListGroup({groupId:this.memberId}).then(checked=>{
            if (checked.list){
              var checkedList = [];
               checked.list.map(each => {
                 checkedList.push({
                   id:each.menuId,
                   label:each.title
                 })
                if (each.children){
                  var childrenTotal = 0;
                  each.children.map(item=>{
                    if (!item.hidden){
                      checkedList.push({
                        id:each.menuId,
                        label:each.title
                      })
                    }
                  })
                }


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
      bindMemberToMenu(data).then(res => {
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
