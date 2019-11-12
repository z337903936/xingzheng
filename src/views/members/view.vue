<template>
  <div class="createPost-container">
    <el-form ref="postForm" :model="info"  class="form-container">
      <div class="createPost-main-container">
        <div class="postInfo-container">
          <el-row>
            <el-col :span="8">
              <el-form-item style="margin-bottom: 40px;" label-width="150px" label="用户ID:">
                {{ info.id }}
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item style="margin-bottom: 40px;" label-width="150px" label="姓名:">
                {{ info.realName }}
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item style="margin-bottom: 40px;" label-width="150px" label="手机号码:">
                {{ info.phoneNumber }}
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="8">
              <el-form-item style="margin-bottom: 40px;" label-width="150px" label="昵称:">
                {{ info.nickName }}
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item style="margin-bottom: 40px;" label-width="150px" label="身份证号码:">
                {{ info.idCardNo }}
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item style="margin-bottom: 40px;" label-width="150px" label="加入时间:">
                {{ info.createdTime | parseTime('{y}-{m}-{d} {h}:{i}') }}
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="8">
              <el-form-item style="margin-bottom: 40px;" label-width="150px" label="营业执照号码:">
                {{ info.licenseNo }}
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item style="margin-bottom: 40px;" label-width="150px" label="营业执照:">
                <image :src="info.licenseImgUrl" lazy/>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="8">
              <el-form-item style="margin-bottom: 40px;" label-width="150px" label="状态:">
                <el-tag :type="info.status | statusFilter">{{ info.status == 1?'正常':'停用' }}</el-tag>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item style="margin-bottom: 40px;" label-width="150px" label="备注:">
                {{ info.description }}
              </el-form-item>
            </el-col>
          </el-row>
        </div>
      </div>
    </el-form>

    <el-table v-loading="listLoading" :data="info.balanceList" border fit highlight-current-row style="width: 100%">

      <el-table-column class-name="status-col" label="类别" min-width="100px" align="center" >
        <template slot-scope="scope">
          {{ getItemName(scope.row.itemId)}}
        </template>
      </el-table-column>

      <el-table-column label="可用余额" align="center" >
        <template slot-scope="scope">
          <span>{{ getBalance(scope.row.itemId,scope.row.leftBalance) }}</span>
        </template>
      </el-table-column>

      <el-table-column label="冻结余额" align="center" >
        <template slot-scope="scope">
          <span>{{ getBalance(scope.row.itemId,scope.row.freezeBalance) }}</span>
        </template>
      </el-table-column>

      <el-table-column label="总余额" align="center" >
        <template slot-scope="scope">
          <span>{{ getBalance(scope.row.itemId,scope.row.totalBalance) }}</span>
        </template>
      </el-table-column>

    </el-table>
  </div>
</template>

<script>
  import { fetchMembers } from '@/api/members'
  export default {
    name: 'ViewMembers',
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
        info: {},
        listLoading: false,
      }
    },
    computed: {

    },
    created() {
      const id = this.$route.params && this.$route.params.id
      this.fetchData(id)
    },
    methods: {
      fetchData(id) {
        fetchMembers(id).then(data => {
          this.info = data
          console.log(this.info.balanceList)
        }).catch(err => {
          console.log(err)
        })
      },
      getItemName(itemId) {
        if (itemId == 0) {
          return '现金'
        } else if (itemId == 1) {
          return '超级短信'
        } else if (itemId == 2) {
          return '普通短信'
        } else if (itemId == 3) return '视频云'
      },
      getBalance(itemId, balance){
        if (itemId == 0) {
          return balance / 100.00 + "元"
        } else {
          return balance + "条"
        }
      }
    }
  }
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  @import "~@/styles/mixin.scss";

  .createPost-container {
    position: relative;

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

      .editor-container {
        min-height: 500px;
        margin: 0 0 30px;

        .editor-upload-btn-container {
          text-align: right;
          margin-right: 10px;

          .editor-upload-btn {
            display: inline-block;
          }
        }
      }
    }

    .word-counter {
      width: 40px;
      position: absolute;
      right: -10px;
      top: 0px;
    }
  }
</style>
