<template>
  <!-- 容器 -->
  <el-container class="Container">
    <!-- 头部 -->
    <el-header>
      <div>
        <el-avatar :src="require('@/assets/哆啦A梦.jpg')"></el-avatar>
        <span>电商管理系统</span>
      </div>
      <el-button type="info" @click="logout">退出</el-button>
    </el-header>
    <!-- 中间 -->
    <el-container>
      <!-- 侧边栏 -->
      <el-aside :width="isCollapse?'64px':'200px'">
        <!-- 折叠按钮 -->
        <div class="toggle-button" @click="toggleCollapse">|||</div>
        <el-menu
          default-active="2"
          class="el-menu-vertical-demo"
          background-color="#333744"
          text-color="#fff"
          active-text-color="#409BFF"
          :unique-opened="true"
          :collapse="isCollapse"
          :collapse-transition="false"
          :defaultActive="$route.path"
          router
        >
          <!-- 一级菜单 -->
          <el-submenu
            :index="itemParent.id + ''"
            v-for="itemParent in leftNavInfo"
            :key="itemParent.id"
          >
            <!-- 一级菜单模板区域 -->
            <template slot="title">
              <i :class="iconsObj[itemParent.id]"></i>
              <span>{{ itemParent.authName }}</span>
            </template>
            <!-- 二级菜单 -->
            <el-menu-item
              :index="'/'+itemChild.path"
              v-for="itemChild in itemParent.children"
              :key="itemChild.id"
            >
              <template slot="title">
                <i class="el-icon-menu"></i>
                <span>{{ itemChild.authName }}</span>
              </template>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <!-- 中间主体 -->
      <el-main>
        <!-- home 子路由的路由占位符 -->
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
  data () {
    return {
      leftNavInfo: null,
      iconsObj: {
        125: 'iconfont icon-users',
        103: 'iconfont icon-tijikongjian',
        101: 'iconfont icon-shangpin',
        102: 'iconfont icon-danju',
        145: 'iconfont icon-baobiao'
      },
      // 是否折叠
      isCollapse: false
      // 当前激活路径
      // activePath: ''
    }
  },
  created () {
    this.getLeftNav()
  },
  methods: {
    //   退出
    logout () {
      sessionStorage.clear()
      this.$router.push('/login')
    },
    // 获取侧边栏数据
    async getLeftNav () {
      const { data: res } = await this.$http.get('menus')
      if (res.meta.status === 200) {
        this.leftNavInfo = res.data
        // console.log(res)
      }
    },
    // 侧边栏折叠事件
    toggleCollapse () {
      this.isCollapse = !this.isCollapse
    }
    // 保存当前激活的侧边栏路径到sessionStorage
    // saveActivePath (active) {
    //   sessionStorage.setItem('active', active)
    // }
  }
}
</script>

<style lang="less" scoped>
.Container {
  height: 100%;
}
.el-header {
  background-color: #373d41;
  display: flex;
  justify-content: space-between;
  padding-left: 0;
  align-items: center;
  color: white;
  font-size: 20px;
  > div {
    display: flex;
    justify-content: space-between;
    align-items: center;
    span {
      margin-left: 10px;
    }
  }
}
.el-aside {
  background-color: #333744;
  transition: width .3s;
  .el-menu {
    border-right: 0;
  }
  .toggle-button {
    background-color: #4A5064;
    color: white;
    text-align: center;
    line-height: 26px;
    letter-spacing: 0.2em;
    cursor: pointer;
  }
}
.el-main {
  background-color: #eaedf1;
}
.iconfont {
  margin-right: 10px;
}
</style>
