<template>
  <div class="app-container">

    <el-table v-loading="listLoading" :data="list" border fit highlight-current-row style="width: 100%">
      <el-table-column align="center" label="ID" width="80">
        <template slot-scope="scope">
          <span>{{ scope.row.id }}</span>
        </template>
      </el-table-column>

      <el-table-column width="180px" align="center" label="时间">
        <template slot-scope="scope">
          <span>{{ scope.row.updateTime | parseTime('{y}-{m}-{d} {h}:{i}') }}</span>
        </template>
      </el-table-column>

      <el-table-column min-width="200px" label="项目名">
        <template slot-scope="scope">
          <router-link :to="'/product/edit/'+scope.row.id" class="link-type">
            <span>{{ scope.row.title }}</span>
          </router-link>
        </template>
      </el-table-column>

      <el-table-column width="300px" label="图片">
        <template slot-scope="scope">
          <img :src="scope.row.headPic" class="carousel_img">
        </template>
      </el-table-column>

      <el-table-column class-name="status-col" label="状态" width="110">
        <template slot-scope="scope">
          <el-tag :type="scope.row.status | statusFilter">{{ scope.row.status == 1?"正常":"停用" }}</el-tag>
        </template>
      </el-table-column>

      <el-table-column align="center" label="操作" width="400">
        <template slot-scope="scope">
          <router-link :to="'/product/edit/'+scope.row.id">
            <el-button type="primary" size="small" icon="el-icon-edit">编辑</el-button>
          </router-link>
          <el-button type="primary" size="small" icon="el-icon-plus" @click="addToHotList(scope.row.id)">加入热销楼盘
          </el-button>
          <router-link :to="'/product/imageList/'+scope.row.id">
            <el-button type="primary" size="small" icon="el-icon-picture-outline">管理项目图片</el-button>
          </router-link>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" @pagination="getList"/>

  </div>
</template>

<script>
import { fetchProductList, addProductCarousel } from '@/api/product'
import Pagination from '@/components/Pagination' // Secondary package based on el-pagination

export default {
  name: 'ProductList',
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
      fetchProductList(this.listQuery).then(data => {
        this.list = data.list
        this.total = data.pages
        this.listLoading = false
      })
    },
    addToHotList(id) {
      var param = {
        productId: id
      }
      addProductCarousel(param).then(data => {
        this.loading = false
        if (data.code == 200) {
          this.$message({
            message: '已成功加入热销楼盘',
            type: 'success',
            showClose: true,
            duration: 1000
          })
        } else if (data.code == 40001) {
          this.$message({
            message: '已在热销列表中，无需再加',
            type: 'warn',
            showClose: true,
            duration: 1000
          })
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
