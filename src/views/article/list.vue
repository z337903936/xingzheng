<template>
  <div class="app-container">

    <el-form class="form-container">
      <div class="createPost-main-container">
        <div class="postInfo-container">
          <el-row>
            <el-col :span="24">
              <el-form-item style="margin-bottom: 40px;" label-width="150px" label="请先选择分类:" prop="categoryId">
                <el-select v-model="categoryId" placeholder="请选择" @change="getList">
                  <el-option
                    v-for="item in categories"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id"/>
                </el-select>
              </el-form-item>
            </el-col>

          </el-row>
        </div>
      </div>
    </el-form>

    <el-table v-loading="listLoading" :data="list" border fit highlight-current-row style="width: 100%">
      <el-table-column align="center" label="ID" width="80">
        <template slot-scope="scope">
          <span>{{ scope.row.id }}</span>
        </template>
      </el-table-column>

      <el-table-column width="180px" align="center" label="发布时间">
        <template slot-scope="scope">
          <span>{{ scope.row.publishTime | parseTime('{y}-{m}-{d} {h}:{i}') }}</span>
        </template>
      </el-table-column>

      <el-table-column min-width="200px" label="标题">
        <template slot-scope="scope">
          <router-link :to="'/example/edit/'+scope.row.id" class="link-type">
            <span>{{ scope.row.title }}</span>
          </router-link>
        </template>
      </el-table-column>
      <el-table-column min-width="200px" label="摘要">
        <template slot-scope="scope">
          <router-link :to="'/article/edit/'+scope.row.id" class="link-type">
            <span>{{ scope.row.digest }}</span>
          </router-link>
        </template>
      </el-table-column>

      <el-table-column class-name="status-col" label="状态" width="110">
        <template slot-scope="scope">
          <el-tag :type="scope.row.status | statusFilter">{{ scope.row.status == 1?'正常':'停用' }}</el-tag>
        </template>
      </el-table-column>

      <el-table-column align="center" label="操作" width="240">
        <template slot-scope="scope">
          <router-link :to="'/article/edit/'+scope.row.id">
            <el-button type="primary" size="small" icon="el-icon-edit">编辑</el-button>
          </router-link>
          <el-button size="small" icon="el-icon-delete" @click="deleteArticle(scope.row.id)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>1" :total="total" :page.sync="listQuery.page" @pagination="getList"/>

  </div>
</template>

<script>
  import { fetchAllCateList } from '@/api/category'
  import { fetchList, delArticle } from '@/api/article'
  import Pagination from '@/components/Pagination' // Secondary package based on el-pagination

  export default {
    name: 'ArticleList',
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
        },
        categoryId: '全部',
        categories: []
      }
    },
    created() {
      this.init()
    },

    methods: {
      init() {
        this.listLoading = true
        fetchAllCateList().then(data => {
          this.categories = [{
            id: '0',
            name: '全部'
          }]
          data.list.map(each => {
            this.categories.push({
              id: each.id + '',
              name: each.name
            })
          })
          if (data.list.length > 0) {
            var first = this.categories[0]
            this.categoryId = first.id + ''
            this.getList()
          } else {
            this.listLoading = false
          }
        }).catch(err => {
          this.listLoading = false
          console.log(err)
        })
      },
      getList() {
        this.listLoading = true
        this.listQuery.cateId = this.categoryId
        fetchList(this.listQuery).then(data => {
          this.list = data.list
          this.total = data.pages
          this.listLoading = false
        })
      },
      deleteArticle(id) {
        this.$confirm('您确认要删除该文章吗, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          var param = {
            articleId: id,
            operation: 'del'
          }
          delArticle(param).then(data => {
            this.loading = false
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
</style>
