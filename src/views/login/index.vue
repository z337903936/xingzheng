<template>
  <div class="login-container">

    <el-form
      ref="loginForm"
      :model="loginForm"
      :rules="loginRules"
      class="login-form"
      auto-complete="on"
      label-position="left">

      <div class="title-container">
        <h3 class="title">管理系统</h3>
      </div>

      <el-form-item prop="username">
        <span class="svg-container">
          <svg-icon icon-class="user"/>
        </span>
        <el-input
          v-model="loginForm.username"
          :placeholder="$t('login.username')"
          name="username"
          type="text"
          auto-complete="on"
          @blur="handleFreshCaptcha()"
        />
      </el-form-item>

      <el-form-item prop="password">
        <span class="svg-container">
          <svg-icon icon-class="password"/>
        </span>
        <el-input
          :type="passwordType"
          v-model="loginForm.password"
          :placeholder="$t('login.password')"
          name="password"
          auto-complete="on"
          @keyup.enter.native="handleLogin"/>
        <span class="show-pwd" @click="showPwd">
          <svg-icon icon-class="eye"/>
        </span>
      </el-form-item>

      <!--<el-form-item prop="captcha" label="" id="captcha-container">-->
      <!--<span class="svg-container">-->
      <!--<svg-icon icon-class="password"/>-->
      <!--</span>-->
      <!--<el-input v-model="loginForm.captcha" placeholder="图形验证码" type="captcha"></el-input>-->
      <!--<a href="javascript:void(0)" title="点击刷新" @click="handleFreshCaptcha">-->
      <!--<img :src="captchaSrc" id="img-captcha"/>-->
      <!--</a>-->
      <!--</el-form-item>-->

      <!--<el-form-item id="sms-container" prop="vcode" label="">-->
        <!--<span class="svg-container">-->
          <!--<svg-icon icon-class="password"/>-->
        <!--</span>-->
        <!--<el-input-->
          <!--v-model="loginForm.vcode"-->
          <!--:placeholder="$t('login.vcode')"-->
          <!--@blur="handleBlur('vcode')"/>-->
        <!--<el-button-->
          <!--id="btn-getsms"-->
          <!--:disabled="sendSmsButtonDisable"-->
          <!--type="primary"-->
          <!--class="btn-primary"-->
        <!--&gt;{{ sendSmsButtonTitle }}-->
        <!--</el-button>-->
      <!--</el-form-item>-->

      <el-button
        :loading="loading"
        type="primary"
        style="width:100%;margin-bottom:30px;"
        @click.native.prevent="handleLogin">{{ $t('login.logIn') }}
      </el-button>
    </el-form>
  </div>
</template>

<script>
// import { isvalidUsername } from '@/utils/validate'
import { loginByUsername, requestSMS } from '@/api/login'

export default {
  name: 'Login',
  components: { },
  data() {
    const validateUsername = (rule, value, callback) => {
      if (value.length < 3) {
        callback(new Error('Please enter the correct user name'))
      } else {
        callback()
      }
    }
    const validatePassword = (rule, value, callback) => {
      if (value.length < 6) {
        callback(new Error('The password can not be less than 6 digits'))
      } else {
        callback()
      }
    }
    return {
      loginForm: {
        username: '',
        password: '',
        vcode: ''
        // captcha: ''
      },
      errMsg: '',
      imgSrc: '/v1/user/captcha',
      captchaSrc: this.imgSrc,
      needCaptcha: true,
      needVerifyCode: true,
      sendSmsButtonDisable: false,
      sendSmsButtonName: '发送验证码',
      countDown: 0,
      loginRules: {
        username: [{ required: true, trigger: 'blur', validator: validateUsername }],
        vcode: [{ required: true }],
        password: [{ required: true, trigger: 'blur', validator: validatePassword }]
      },
      passwordType: 'password',
      loading: false,
      showDialog: false,
      redirect: undefined
    }
  },
  computed: {
    sendSmsButtonTitle() {
      return this.countDown ? `${this.sendSmsButtonName}(${this.countDown})` : this.sendSmsButtonName
    }
  },
  watch: {
    $route: {
      handler: function(route) {
        this.redirect = route.query && route.query.redirect
      },
      immediate: true
    }
  },
  created() {
    // window.addEventListener('hashchange', this.afterQRScan)
  },
  destroyed() {
    // window.removeEventListener('hashchange', this.afterQRScan)
  },
  methods: {
    showPwd() {
      if (this.passwordType === 'password') {
        this.passwordType = ''
      } else {
        this.passwordType = 'password'
      }
    },

    async sendSms() {
      var requestData = { phoneNumber: this.loginForm.username, captcha: this.loginForm.captcha }
      requestSMS(requestData).then(data => {
        this.loading = false
        if (data.code === 200) {
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
    },
    handleFreshCaptcha() {
      this.captchaSrc = `${this.imgSrc}/${this.loginForm.username}/?rnd=${Math.random()}`
    },
    handleLogin() {
      this.$refs.loginForm.validate(valid => {
        if (valid) {
          this.loading = true
          this.$store.dispatch('LoginByUsername', this.loginForm)
            .then(() => {
              this.loading = false
              this.$message({
                message: '登录成功，欢迎回来',
                type: 'success',
                showClose: true,
                duration: 1000
              })
              this.$store.dispatch('Backlog').then(data=>{
                if (data.list.length >0){
                  this.$notify({
                    title: '系统消息',
                    message: '您有新的待办任务',
                    duration: 0,
                    type: 'success',
                    position: 'top-left',

                  });
                }
              })
              this.$router.push({ path: this.redirect || '/' })
            }).catch((res) => {
              this.$message({
                message: res.reason,
                type: 'error',
                showClose: true,
                duration: 2000
              })
              this.loading = false
            })
        } else {
          this.$message({
            message: '登录失败，请检查用户名/密码',
            type: 'error',
            showClose: true,
            duration: 2000
          })
          return false
        }
      })
    },
    afterQRScan() {
      // const hash = window.location.hash.slice(1)
      // const hashObj = getQueryObject(hash)
      // const originUrl = window.location.origin
      // history.replaceState({}, '', originUrl)
      // const codeMap = {
      //   wechat: 'code',
      //   tencent: 'code'
      // }
      // const codeName = hashObj[codeMap[this.auth_type]]
      // if (!codeName) {
      //   alert('第三方登录失败')
      // } else {
      //   this.$store.dispatch('LoginByThirdparty', codeName).then(() => {
      //     this.$router.push({ path: '/' })
      //   })
      // }
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss">
  /* 修复input 背景不协调 和光标变色 */
  /* Detail see https://github.com/PanJiaChen/vue-element-admin/pull/927 */
.el-notification{
  padding: 10px 16px !important;
  width: 246px !important;
}
  $bg: #283443;
  $light_gray: #eee;
  $cursor: #fff;

  @supports (-webkit-mask: none) and (not (cater-color: $cursor)) {
    .login-container .el-input input {
      color: $cursor;

      &::first-line {
        color: $light_gray;
      }
    }
  }

  /* reset element-ui css */
  .login-container {
    background-image: url("../../../static/img/login.jpg");
    background-repeat:no-repeat;
    background-size:100% 100%;
    -moz-background-size:100% 100%;
    .el-input {
      display: inline-block;
      height: 47px;
      width: 85%;

      input {
        background: transparent;
        border: 0px;
        -webkit-appearance: none;
        border-radius: 0px;
        padding: 12px 5px 12px 15px;
        color: $light_gray;
        height: 47px;
        caret-color: $cursor;

        &:-webkit-autofill {
          -webkit-box-shadow: 0 0 0px 1000px $bg inset !important;
          -webkit-text-fill-color: $cursor !important;
        }
      }
    }

    .el-form-item {
      border: 1px solid rgba(255, 255, 255, 0.1);
      background: rgba(0, 0, 0, 0.1);
      border-radius: 5px;
      color: #454545;
    }
  }
</style>

<style rel="stylesheet/scss" lang="scss" scoped>
  $bg: #2d3a4b;
  $dark_gray: #889aa4;
  $light_gray: #eee;

  .login-container {
    position: fixed;
    height: 100%;
    width: 100%;
    background-color: $bg;

    .login-form {
      position: absolute;
      right: 7%;
      width: 520px;
      max-width: 100%;
      padding: 35px 35px 15px 35px;
      margin: 181px 0 120px 0;

    }

    .tips {
      font-size: 14px;
      color: #fff;
      margin-bottom: 10px;

      span {
        &:first-of-type {
          margin-right: 16px;
        }
      }
    }

    .svg-container {
      padding: 6px 5px 6px 15px;
      color: $dark_gray;
      vertical-align: middle;
      width: 30px;
      display: inline-block;
    }

    .title-container {
      position: relative;

      .title {
        font-size: 26px;
        color: $light_gray;
        margin: 0px auto 40px auto;
        text-align: center;
        font-weight: bold;
      }

      .set-language {
        color: #fff;
        position: absolute;
        top: 5px;
        right: 0px;
      }
    }

    .show-pwd {
      position: absolute;
      right: 10px;
      top: 7px;
      font-size: 16px;
      color: $dark_gray;
      cursor: pointer;
      user-select: none;
    }

    .thirdparty-button {
      position: absolute;
      right: 35px;
      bottom: 28px;
    }
  }

  #sms-container .el-form-item__content #btn-getsms {
    position: absolute;
    top: 5px;
    right: 5px;
    border-radius: 3px;
    /* border: 0px; */
  }

  #img-captcha {
    position: absolute;
    top: 5px;
    right: 5px;
    bottom: 2px;
    border-radius: 0px 3px 3px 0px;
    /* border: 0px; */
  }

  .login-container img {
    height: 36px;
    width: 100px;
    -webkit-filter: invert(100%);
    filter: invert(100%);
  }

</style>
