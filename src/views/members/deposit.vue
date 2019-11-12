<template>
  <div class="createPost-container">
    <el-form ref="postForm" :model="postForm" :rules="rules" class="form-container">
      <div class="createPost-main-container">
        <div class="postInfo-container">
          <el-row>
            <el-col :span="8">
              <el-form-item style="margin-bottom: 40px;" label-width="150px" label="用户ID:">
                {{ info.id }}
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="8">
              <el-form-item style="margin-bottom: 40px;" label-width="150px" label="手机号码:">
                {{ info.phoneNumber }}
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="8">
              <el-form-item style="margin-bottom: 40px;" label-width="150px" label="姓名:">
                {{ info.realName }}
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="8">
              <el-form-item style="margin-bottom: 40px;" label-width="150px" label="业务类型:" prop="itemId" required>
                <el-select v-model="postForm.itemId">
                  <el-option key="1" label="富信" value="1"/>
                  <el-option key="2" label="短信" value="2"/>
                  <el-option key="3" label="营销短信" value="3"/>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="8">
              <el-form-item style="margin-bottom: 40px;" label-width="150px" label="条数:" prop="amount" required>
                <el-input v-model="postForm.amount" autosize placeholder="条数"/>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="8">
              <el-form-item style="margin-bottom: 40px;" label-width="150px" label="实收金额:" prop="paidMoney" required>
                <el-input v-model="postForm.paidMoney" autosize placeholder="实收金额"/>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="8">
              <el-form-item style="margin-bottom: 40px;font-size: 24px;color: red;font-weight: bold" label-width="150px"
                            label="价格:" prop="averagePrice">
                {{ postForm.paidMoney / postForm.amount }}元/条
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="8">
              <el-form-item style="margin-bottom: 40px;" label-width="150px" label="密码:" prop="password" required>
                <el-input v-model="postForm.password" type="password" autosize placeholder="密码"/>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="24">
              <el-form-item style="margin-bottom: 40px;" label-width="150px" label="短信验证码:" prop="vcode" required>
                <el-input v-model="postForm.vcode" autosize placeholder="短信验证码" style="width: 150px"/>
                <el-button :disabled="disabled=!show" icon="el-icon-mobile-phone" style="width:120px" type="success"
                           @click="send">
                  <span v-show="show">获取验证码</span>
                  <span v-show="!show" class="count">{{ count }} s</span>
                </el-button>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="8">
              <el-form-item style="margin-bottom: 40px;" label-width="150px" label="备注:" prop="note">
                <el-input :rows="4" type="textarea" v-model="postForm.note" autosize placeholder="备注"/>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item style="margin-bottom: 40px;" label-width="100px">
                <el-button v-loading="loading" style="width: 100%" type="primary" @click="submitForm">充值
                </el-button>
              </el-form-item>
            </el-col>
          </el-row>
        </div>
      </div>

      <div class="btn-container"/>
    </el-form>
  </div>
</template>

<script>
  import { fetchMembers, membersDeposit } from '@/api/members'
  import { requestSMS } from '@/api/sms'

  const TIME_COUNT = 60

  export default {
    name: 'DepositMembers',
    data() {
      const validateRequire = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('该项必填'))
        } else {
          callback()
        }
      }
      return {
        loading: false,
        info: {},
        postForm: {
          itemId: '',
          amount: '',
          paidMoney: '',
          password: '',
          vcode: '',
          note:''
        },
        rules: {
          itemId: [{ validator: validateRequire }],
          amount: [{ validator: validateRequire }],
          paidMoney: [{ validator: validateRequire }],
          password: [{ validator: validateRequire }],
          vcode: [{ validator: validateRequire }]
        },
        show: true,
        count: '',
        timer: null
      }
    },
    created() {
      const id = this.$route.params && this.$route.params.id
      this.fetchData(id)
    },
    methods: {
      fetchData(id) {
        fetchMembers(id).then(data => {
          this.info = data
        }).catch(err => {
          console.log(err)
        })
      },
      submitForm() {
        this.$refs.postForm.validate(valid => {
          if (valid) {
            this.loading = true
            var data = this.postForm
            data.uid = this.$route.params && this.$route.params.id
            membersDeposit(data).then(data => {
              this.loading = false
              if (data.code === 200) {
                this.$message({
                  message: '充值成功',
                  type: 'success',
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
          } else {
            return false
          }
        })
      },
      send() {
        if (!this.timer) {
          this.count = TIME_COUNT
          this.show = false
          this.timer = setInterval(() => {
            if (this.count > 0 && this.count <= TIME_COUNT) {
              this.count--
            } else {
              this.show = true
              clearInterval(this.timer) // 清除定时器
              this.timer = null
            }
          }, 1000)
        }

        requestSMS().then(data => {
          this.loading = false
          if (data.code == 200) {
            this.$message({
              message: '短信已发送，请注意查收',
              type: 'success',
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
