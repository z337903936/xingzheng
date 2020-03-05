<template>
  <div class="navbar">

    <div class="webName">
      <el-image
        style="width: 50px; height: 50px;top: 15px;"
        src="../../../../static/img/bannerb.png"
        fit="fill"/>
      {{ this.$store.getters.webName }}
    </div>

    <!--<breadcrumb class="breadcrumb-container"/>-->

    <div class="right-menu">
      <template v-if="device!=='mobile'">
        <!--<error-log class="errLog-container right-menu-item"/>-->

        <!--<el-tooltip :content="$t('navbar.screenfull')" effect="dark" placement="bottom">-->
        <!--<screenfull class="screenfull right-menu-item"/>-->
        <!--</el-tooltip>-->

        <!--<el-tooltip :content="$t('navbar.size')" effect="dark" placement="bottom">-->
        <!--<size-select class="international right-menu-item"/>-->
        <!--</el-tooltip>-->

        <!--<lang-select class="international right-menu-item"/>-->

        <!--<el-tooltip :content="$t('navbar.theme')" effect="dark" placement="bottom">-->
        <!--<theme-picker class="theme-switch right-menu-item"/>-->
        <!--</el-tooltip>-->
      </template>
      <div class="user-container">
        <hamburger :toggle-click="toggleSideBar" :is-active="sidebar.opened" class="hamburger-container"/>
        <span class="username">
          {{ this.$store.getters.userName }}
        </span>
        <el-dropdown class="avatar-container right-menu-item" trigger="click">
          <div class="avatar-wrapper">
            <img :src="avatar+'?imageView2/1/w/80/h/80'" class="user-avatar">
            <i class="el-icon-caret-bottom"/>
          </div>
          <el-dropdown-menu slot="dropdown">
            <router-link to="/">
              <el-dropdown-item>
                {{ $t('navbar.dashboard') }}
              </el-dropdown-item>
            </router-link>
            <!--<router-link to="/change-password/">-->
            <!--<el-dropdown-item divided>-->
            <!--<span style="display:block;" @click="logout">{{ $t('navbar.modifyPassword') }}</span>-->
            <!--</el-dropdown-item>-->
            <!--</router-link>-->
            <el-dropdown-item divided>
              <span style="display:block;" @click="logout">{{ $t('navbar.logOut') }}</span>
            </el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </div>

    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import Breadcrumb from '@/components/Breadcrumb'
import Hamburger from '@/components/Hamburger'
import ErrorLog from '@/components/ErrorLog'
import Screenfull from '@/components/Screenfull'
import SizeSelect from '@/components/SizeSelect'
import LangSelect from '@/components/LangSelect'
import ThemePicker from '@/components/ThemePicker'

export default {
  components: {
    Breadcrumb,
    Hamburger,
    ErrorLog,
    Screenfull,
    SizeSelect,
    LangSelect,
    ThemePicker
  },
  computed: {
    ...mapGetters([
      'sidebar',
      'name',
      'avatar',
      'device'
    ])
  },
  methods: {
    toggleSideBar() {
      this.$store.dispatch('toggleSideBar')
    },
    logout() {
      this.$store.dispatch('LogOut').then(() => {
        location.reload()// In order to re-instantiate the vue-router object to avoid bugs
      })
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>

    .webName{
    position: fixed;
    color: white;
    letter-spacing: 11px;
    font-size: 30px;
    width: 100%;
    text-align: center;
  }

  .navbar {
    position: fixed;
    height: 80px;
    line-height: 80px;
    border-radius: 0px !important;
    background-image: url("../../../../static/img/bannera.png");
    background-repeat:no-repeat;
    background-size: 100% 80px;
    -moz-background-size: 100% 100%;
    left: 0;
    right: 0;
    top: 0;
    z-index: 1000;
    .hamburger-container {
      line-height: 58px;
      height: 50px;
      float: left;
      padding: 0 10px;
      margin-top: 17px;
      color: white;
    }

    .breadcrumb-container {
      float: left;
    }

    .errLog-container {
      display: inline-block;
      vertical-align: top;
    }

    .right-menu {
      float: right;
      height: 100%;

      &:focus {
        outline: none;
      }

      .right-menu-item {
        display: inline-block;
        margin: 0 8px;
      }

      .screenfull {
        height: 20px;
      }

      .international {
        vertical-align: top;
      }

      .theme-switch {
        vertical-align: 15px;
      }
      .user-container {
        display: flex;
      }
      .username {
        margin: 2px 10px 0 10px;
        color: #ffffff;
      }
      .avatar-container {
        height: 50px;
        margin-right: 30px;
        margin-top: 11px;
        .avatar-wrapper {
          margin-top: 5px;
          position: relative;

          .user-avatar {
            cursor: pointer;
            width: 40px;
            height: 40px;
            border-radius: 10px;
          }

          .el-icon-caret-bottom {
            cursor: pointer;
            position: absolute;
            right: -20px;
            top: 25px;
            font-size: 12px;
          }
        }
      }
    }
  }
</style>
