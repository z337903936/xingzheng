<template>
  <div class="createPost-container">

    <el-form ref="postForm" :model="postForm" :rules="rules" class="form-container">
      <div class="createPost-main-container">

        <div class="postInfo-container">
          <el-row>
            <el-col :span="8">
              <el-form-item style="margin-bottom: 40px;" label-width="100px" label="名字:" prop="realName" required>
                <el-input v-model="postForm.realName" :rows="1" autosize placeholder="选填，请输入名字" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="8">
              <el-form-item style="margin-bottom: 40px;" label-width="100px" label="帐号:" prop="userName" required>
                <el-input v-model="postForm.userName" :rows="1" autosize placeholder="必填，请输入帐号" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="6">
              <el-form-item style="margin-bottom: 40px;" label-width="100px" label="角色:" prop="groupId" required>
                <el-select v-model="postForm.groupId" placeholder="请选择">
                  <el-option
                    v-for="item in roles"
                    :key="item.id"
                    :label="item.groupName"
                    :value="item.id"
                  />
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="6">
              <el-form-item style="margin-bottom: 40px;" label-width="100px" label="状态:" prop="status">
                <el-select v-model="postForm.status" placeholder="请选择">
                  <el-option
                    v-for="item in lockStatus"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id"
                  />
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="8">
              <el-form-item style="margin-bottom: 40px;" label-width="100px" label="密码:">
                <el-input v-model="postForm.password" :rows="1" type="password" autocomplete="off" placeholder="选填" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="8">
              <el-form-item style="margin-bottom: 40px;" label-width="100px" label="确认密码:">
                <el-input v-model="postForm.checkPass" :rows="1" type="password" autocomplete="off" placeholder="选填" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="8">
              <el-form-item style="margin-bottom: 40px;" label-width="100px">
                <el-button v-loading="loading" :rows="1" style="width: 100%" type="primary" @click="submitForm">保存
                </el-button>
              </el-form-item>
            </el-col>
          </el-row>
        </div>
      </div>

      <div class="btn-container" />
    </el-form>
  </div>
</template>

<script>
import { fetchAdminMember, updateAdminMember, createAdminMember, fetchRoleList } from '@/api/permissions'

const defaultForm = {
  realName: '',
  userName: '',
  groupId: '',
  status: '',
  password: '',
  checkPass: '',
  id: 0
}

export default {
  name: 'RoleDetail',
  components: {},
  props: {
    isEdit: {
      type: Boolean,
      default: false
    }
  },
  data() {
    const validateRequire = (rule, value, callback) => {
      if (value === '') {
        this.$message({
          message: '为必传项',
          type: 'error'
        })
        callback(new Error('为必传项'))
      } else {
        callback()
      }
    }
    return {
      postForm: Object.assign({}, defaultForm),
      loading: false,
      userListOptions: [],
      roles: [],
      lockStatus: [{ id: '1', name: '正常' }, { id: '2', name: '锁定' }],
      rules: {
        groupName: [{ validator: validateRequire }]
      },
      tempRoute: {}
    }
  },
  computed: {
    lang() {
      return this.$store.getters.language
    }
  },
  created() {
    fetchRoleList().then(data => {
      if (data.code === 200) {
        data.list.map((each) => {
          this.roles.push({
            id: each.id + '',
            groupName: each.groupName
          })
        })
      }
    }).catch(err => {
      console.log(err)
    })

    if (this.isEdit) {
      const id = this.$route.params && this.$route.params.id
      this.postForm.id = id
      this.fetchData(id)
    } else {
      this.postForm = Object.assign({}, defaultForm)
    }
    this.tempRoute = Object.assign({}, this.$route)
  },
  methods: {
    fetchData(id) {
      fetchAdminMember(id).then(data => {
        data.status = data.status + ''
        data.groupId = data.groupId + ''
        this.postForm = data
        delete this.postForm.createdTime
        delete this.postForm.lastLoginTime
        delete this.postForm.lastLoginIP
        this.setTagsViewTitle()
      }).catch(err => {
        console.log(err)
      })
    },
    setTagsViewTitle() {
      const title = this.lang === 'zh' ? '修改管理员信息' : 'Edit Admin Member'
      const route = Object.assign({}, this.tempRoute, { title: `${title}-${this.postForm.realName}` })
      this.$store.dispatch('updateVisitedView', route)
    },
    submitForm() {
      var data = this.postForm
      if (data.password !== data.checkPass) {
        this.$message({
          message: '两次输入密码不一致!',
          type: 'error',
          showClose: true,
          duration: 1000
        })
        return
      }
      this.$refs.postForm.validate(valid => {
        if (valid) {
          this.loading = true
          if (this.isEdit) {
            updateAdminMember(data).then(data => {
              this.loading = false
              if (data.code === 200) {
                this.$message({
                  message: '保存成功',
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
            createAdminMember(data).then(data => {
              this.loading = false
              if (data.code === 200) {
                this.$message({
                  message: '保存成功',
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
