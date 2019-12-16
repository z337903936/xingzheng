<template>
  <div class="app-container">
    <div class="filter-container">

      <div>
        <el-input
                placeholder="输入关键字进行过滤"
                v-model="filterText"
                style="width: 200px;">
        </el-input>
        <el-button
          type="primary"
          icon="el-icon-edit"
          @click="handleCreate">
          新增
        </el-button>
      </div>
    </div>

    <el-tree
            :data="list"
            :expand-on-click-node="false"
            node-key="id"
            style="width: 40%"
            v-loading="listLoading"
            :filter-node-method="filterNode"
            ref="tree"
            draggable
            @node-drop="handleDrop"


    >
      <span slot-scope="{ node, data }" class="custom-tree-node">
        <span>{{ data.name}}</span>
        <span>
          <el-button
                  type="text"
                  size="mini"
                  @click="() => handleAdd(data)">
            添加
          </el-button> <el-button
                  type="text"
                  size="mini"
                  @click="() => handleUpdate(data)">
            修改
          </el-button>
          <el-button
                  type="text"
                  size="mini"
                  @click="() => handleDelete(data)">
            删除
          </el-button>
        </span>
      </span>
    </el-tree>


    <el-dialog
      :visible.sync="dialogDelete"
      title="删除提示"
      width="30%"
      :close-on-click-modal="false"
    >
      <span>是否删除该条数据?</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogDelete = false">取 消</el-button>
        <el-button type="primary" @click="deleteData()">确 定</el-button>
      </span>
    </el-dialog>

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormAdd" width="30%">
      <el-form
        ref="dataForm"
        :rules="rules"
        :model="temp"
        label-position="left"
        label-width="100px"
        style="width: 400px; margin-left:50px;">

        <el-form-item label="名称" prop="name">
          <el-input v-model="temp.name"/>
        </el-form-item>
        <el-form-item label="上级字典" prop="parentId">
          <el-select v-model="temp.parentId" placeholder="请选择" filterable clearable>
            <el-option
              v-for="item in parentId"
              :key="item.id"
              :label="item.title"
              :value="item.id"/>
          </el-select>
        </el-form-item>

        <el-form-item label="排序值" prop="sort">
          <el-input v-model="temp.sort"/>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormAdd = false">
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
import { fetchList, fetchArticle, createArticle, updateArticle, delArticle } from '@/api/dictionary'
import waves from '@/directive/waves' // waves directive
import Pagination from '@/components/Pagination' // secondary package based on el-pagination

export default {
  name: 'Dictionary',
  directives: { waves },
  components: { Pagination },
  data() {
    return {
      filterText: '',
      tableKey: 0,
      list: null,
      total: 0,
      limit: 20,
      listLoading: true,
      listQuery: {
        name: '',
        page: 1
      },
      dialogFormAdd: false,
      dialogStatus: '',
      textMap: {
        update: '修改',
        create: '新增'
      },
      temp: {
        id: undefined,
        name: '',
        sort: 99,
        parentId: ''
      },
      parentId: [],
      rules: {
        name: [{ required: true, message: '请输入名称', trigger: 'change' }],
        sort: [{ required: true, message: '请输入排序值', trigger: 'change' }]

      },
      dialogDelete: false,
      deleteId: ''
    }
  },
  created() {
    this.getList()
  },
  watch: {
    filterText(val) {
      this.$refs.tree.filter(val);
    }
  },
  methods: {
    handleDrop(draggingNode, dropNode, dropType, ev) {

      var parentId;
      if (dropType==='inner'){
        parentId = dropNode.data.id
        const tempData = {
          id: draggingNode.data.id,
          name: draggingNode.data.name,
          sort: draggingNode.data.sort,
          parentId: parentId
        };
      } else{
        parentId = dropNode.data.parentId
        const tempData = {
          id: draggingNode.data.id,
          name: draggingNode.data.name,
          sort: draggingNode.data.sort,
          parentId: parentId,
          place: dropType,
          prependDictId: draggingNode.data.id

        };
      }
      updateArticle(tempData).then(response => {
        if (response.code === 200) {

          this.$notify({
            title: 'Success',
            message: '修改成功',
            type: 'success',
            duration: 2000
          })
          this.getList()
        }
      })
    },
    getList() {
      this.listLoading = true
      fetchList(this.listQuery).then(response => {
        this.list = response.list

        this.parentId = this.processData(response.list);
        // Just to simulate the time of the request

        this.listLoading = false

      })
    },
    processData(data) {
      var sendData = [];
      data.map(item => {
        sendData.push({
          id:item.id,
          title:item.name,
        })
        if (item.children.length > 0) {
          sendData = sendData.concat(this.processData(item.children));
        }
      })
      return sendData
    },
    filterNode(value, data) {
      if (!value) return true;
      return data.name.indexOf(value) !== -1;
    },
    handleFilter() {
      this.listQuery.page = 1
      this.getList()
    },
    handleAdd(data) {
      this.resetTemp();
      this.dialogStatus = 'create'
      this.temp.parentId = data.id
      this.dialogFormAdd = true
    },
    handleCreate() {
      this.resetTemp()
      this.dialogStatus = 'create'
      this.dialogFormAdd = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    resetTemp() {
      this.temp = {
        id: undefined,
        name: '',
        sort: 99,
        parentId: ''
      }
    },
    createData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          createArticle(this.temp).then(response => {
            if (response.code === 200) {
              this.dialogFormAdd = false
              this.$notify({
                title: 'Success',
                message: '创建成功',
                type: 'success',
                duration: 2000
              })
              this.getList()
            }
          })
        }
      })
    },
    handleUpdate(row) {
      this.temp = Object.assign({}, row) // copy obj
      this.dialogStatus = 'update'
      this.dialogFormAdd = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    updateData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          const tempData = Object.assign({}, this.temp)
          updateArticle(tempData).then(response => {
            if (response.code === 200) {
              this.dialogFormAdd = false
              this.$notify({
                title: 'Success',
                message: '修改成功',
                type: 'success',
                duration: 2000
              })
              this.getList()
            }
          })
        }
      })
    },
    handleDelete(row) {
      this.deleteId = row.id // copy obj
      this.dialogDelete = true
    },
    deleteData() {
      delArticle({
        id: this.deleteId,
        operation: 'del'
      }).then(response => {
        if (response.code === 200) {
          this.dialogDelete = false
          this.$notify({
            title: 'Success',
            message: '删除成功',
            type: 'success',
            duration: 2000
          })
          this.getList()
        }
      })
    }
  }
}
</script>

<style scoped>

</style>
