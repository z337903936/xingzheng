<template>
  <div class="app-container">
    <el-table v-loading="listLoading" :data="list" border fit highlight-current-row style="width: 100%">
      <el-table-column align="center" label="ID" width="80px">
        <template slot-scope="scope">
          <span>{{ scope.row.id }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="时间">
        <template slot-scope="scope">
          <span>{{ scope.row.createdTime | parseTime('{y}-{m}-{d} {h}:{i}') }}</span>
        </template>
      </el-table-column>

      <el-table-column label="图片">
        <template slot-scope="scope">
          <img
            :src="scope.row.imgUrl"
            class="carousel_img"
            @mouseenter="scaleImage(scope.row.imgUrl)"
          >
        </template>
      </el-table-column>

      <el-table-column align="center" label="操作">
        <template slot-scope="scope">
          <el-button type="primary" size="small" icon="el-icon-delete" @click="deleteImage(scope.row.id)">删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog :visible.sync="dialogVisible">
      <div>
        <img :src="imgUrlInDialog" style="width: 100%;height: 100%">
      </div>
    </el-dialog>

    <pagination v-show="total>1" :total="total" :page.sync="listQuery.page" @pagination="getList"/>

    <div style="border-bottom: 1px solid #ebeef5;margin: 20px auto 10px auto;"/>
    <el-form class="form-container">
      <div class="createPost-main-container">
        <div class="postInfo-container">
          <el-row>
            <el-col :span="24">
              <el-form-item
                style="margin-top: 20px;"
                label-width="100px"
                label="添加图片 560*345"
                prop="headPic"
                required>
                <Upload v-model="headPic"/>
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item style="margin-bottom: 40px;">
                <el-button v-loading="loading" :rows="1" style="width: 100%" type="primary" @click="submitForm">保存
                </el-button>
              </el-form-item>
            </el-col>
          </el-row>
        </div>
      </div>
    </el-form>
  </div>
</template>

<script>
import Upload from '@/components/Upload/singleImage3'
import { listProductImage, deleteProductImage, addProductImage } from '@/api/product'
import Pagination from '@/components/Pagination' // Secondary package based on el-pagination

export default {
  name: 'ProductImageList',
  components: { Pagination, Upload },
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
      productId: 0,
      dialogVisible: false,
      imgUrlInDialog: '',
      headPic: ''
    }
  },
  created() {
    this.productId = this.$route.params && this.$route.params.id
    this.listQuery.productId = this.productId
    this.getList()
  },
  methods: {
    getList() {
      this.listLoading = true
      listProductImage(this.listQuery).then(data => {
        this.list = data.list
        this.total = data.pages
        this.listLoading = false
      })
    },
    deleteImage(id) {
      this.$confirm('您确认要删除该图片吗, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        console.log(id)
        var param = {
          id: id,
          operation: 'del'
        }
        deleteProductImage(param).then(data => {
          this.loading = false
          if (data.code == 200) {
            this.$message({
              message: '已成功删除',
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
          message: '已取消移除'
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
    scaleImage(url) {
      console.log(url)
      this.imgUrlInDialog = url
      this.dialogVisible = true
    },
    submitForm() {
      if (this.headPic.length < 1) {
        this.$message({
          message: '请先上传图片',
          type: 'warning'
        })
        return
      }
      this.loading = true
      var data = {
        productId: this.productId,
        imgUrl: this.headPic
      }
      addProductImage(data).then(data => {
        this.loading = false
        if (data.code == 200) {
          this.$message({
            message: '保存成功',
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
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  @import "~@/styles/mixin.scss";

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

  .createPost-container {
    .createPost-main-container {
      padding: 40px 45px 20px 50px;
      .postInfo-container {
        position: relative;
        @include clearfix;
        margin-bottom: 10px;
        .postInfo-container-item {
          float: left;
        }
      }
    }
  }

</style>
