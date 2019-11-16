<template>
  <div class="app-container">
    <div class="filter-container">
      <el-button
        class="filter-item"
        style="margin-left: 10px;"
        type="primary"
        icon="el-icon-edit"
        @click="handleCreate">
        新增
      </el-button>
    </div>
    <el-tree
      :data="list"
      :expand-on-click-node="false"
      node-key="id"
      default-expand-all
      style="width: 30%"
      v-loading="listLoading"
    >
      <span slot-scope="{ node, data }" class="custom-tree-node">
        <span>{{ data.title}}</span>
        <span>
          <el-button
            type="text"
            size="mini"
            @click="() => handleUpdate(data)">
            修改
          </el-button>
          <el-button
            type="text"
            size="mini"
            @click="() => handleModifyStatus(data,'del')">
            删除
          </el-button>
        </span>
      </span>
    </el-tree>


    <el-dialog
      :visible.sync="deleteMenuDialog"
      title="提示"
      width="30%">
      <span>确定删除这条数据吗？</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="deleteMenuDialog = false">取 消</el-button>
        <el-button type="primary" @click="handleDelete()">确 定</el-button>
      </span>
    </el-dialog>

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form
        ref="dataForm"
        :rules="rules"
        :model="temp"
        label-position="left"
        label-width="100px"
        style="width: 400px; margin-left:50px;">

        <el-form-item label="前端路径" prop="path">
          <el-input v-model="temp.path"/>
        </el-form-item>
        <el-form-item label="组件" prop="component">
          <el-input v-model="temp.component"/>
        </el-form-item>
        <el-form-item label="定向地址" prop="redirect">
          <el-input v-model="temp.redirect"/>
        </el-form-item>
        <el-form-item label="分类名称" prop="name">
          <el-input v-model="temp.name"/>
        </el-form-item>
        <el-form-item label="标题" prop="title">
          <el-input v-model="temp.title"/>
        </el-form-item>
        <el-form-item label="图标" prop="icon">
          <el-input v-model="temp.icon"/>
        </el-form-item>
        <el-form-item label="上级菜单" prop="parentId">

          <el-select v-model="temp.parentId" placeholder="请选择">
            <el-option
                    v-for="item in menuId"
                    :key="item.id"
                    :label="item.title"
                    :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="是否隐藏" prop="sort">
          <el-checkbox v-model="temp.hidden"></el-checkbox>
        </el-form-item>
        <el-form-item label="排序值" prop="sort">
          <el-input v-model="temp.sort"/>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">
          取 消
        </el-button>
        <el-button type="primary" @click="dialogStatus==='create'?createData():updateData()">
          确 定
        </el-button>
      </div>
    </el-dialog>

  </div>
</template>

<style scoped>
    .custom-tree-node {
        flex: 1;
        display: flex;
        align-items: center;
        justify-content: space-between;
        font-size: 14px;
        padding-right: 8px;
    }
</style>

<script>
import { fetchList, fetchMenu, createMenu, updateMenu, delMenu } from '@/api/menu'
import { parseTime } from '@/utils'


export default {
  name: 'Menu',
  components: { },

  filters: {
  },
  data() {
    return {
      tableKey: 0,
      list: null,
      listLoading: true,
      temp: {
        id: '',
        sort: '99',
        path: '',
        name: '',
        component: '',
        title: '',
        redirect: '',
        icon: '',
        hidden: false
      },
      menuId: [],
      deleteMenuDialog: false,
      deleteData: {
        id: '',
        operation: ''
      },
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: '修改',
        create: '新增'
      },
      rules: {
        // type: [{ required: true, message: 'type is required', trigger: 'change' }],
        // timestamp: [{ type: 'date', required: true, message: 'timestamp is required', trigger: 'change' }],
        // title: [{ required: true, message: 'title is required', trigger: 'blur' }]
      },
      downloadLoading: false
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      this.listLoading = true

      fetchList({}).then(response => {
        this.list = response.list;
         var menu = response.list.map(data=>{
            var menuData = [];
            if (data.children){
                menuData = data.children.map(item=>{
                    return {
                        id:item.id,
                        title:item.title,
                    };
                })
            }
            menuData = menuData.concat([{
                id:data.id,
                title:data.title,
            }]);

            return menuData;
        });
          this.menuId = menu.flat(Infinity);


        // Just to simulate the time of the request
        setTimeout(() => {
          this.listLoading = false
        }, 1.5 * 1000)
      })
    },

    handleModifyStatus(row, status) {
      if (status === 'del') {
        this.deleteData = {
          id: row.id,
          operation: status
        }
        console.log(this.deleteData)
        this.deleteMenuDialog = true
      }
    },
    resetTemp() {
      this.temp = {
        id: '',
        sort: '99',
        path: '',
        name: '',
        component: '',
        title: '',
        redirect: '',
        icon: '',
        parentId: '',
        hidden: false
      }
    },
    handleCreate() {
      this.resetTemp()
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    createData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          createMenu(this.temp).then((ref) => {
            if (ref.code === 200) {
                this.dialogFormVisible = false
              this.getList()
            }
            this.$notify({
              message: ref.reason,
              type: 'success',
              duration: 2000
            })
          })
        }
      })
    },
    handleUpdate(row) {
        this.temp = {
            id: row.id,
            sort: row.sort,
            path: row.path,
            name: row.name,
            component: row.component,
            title: row.meta.title,
            redirect: row.meta.redirect,
            icon: row.meta.icon,
            parentId: row.parentId,
            hidden: row.hidden
        }
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    updateData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          const tempData = Object.assign({}, this.temp)
          updateMenu(tempData).then((ref) => {
            this.getList()
            this.dialogFormVisible = false
            this.$notify({
              title: 'Success',
              message: '',
              type: 'success',
              duration: 2000
            })
          })
        }
      })
    },
    handleDelete() {
      var row = this.deleteData
      delMenu(row).then(() => {
        this.$notify({
          title: 'Success',
          message: 'Delete Successfully',
          type: 'success',
          duration: 2000
        })
        this.getList()
      })
    },


  }
}
</script>
