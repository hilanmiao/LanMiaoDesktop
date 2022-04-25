<template>
  <el-container>
    <el-aside width="200px">
      <sidebar></sidebar>
    </el-aside>
    <el-container>
      <el-header>
        <navbar></navbar>
      </el-header>
      <el-main>
        <app-main/>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
import AppMain from './components/AppMain'
import Navbar from './components/Navbar'
import Sidebar from './components/Sidebar'

export default {
  name: "index",
  components: {
    AppMain,
    Navbar,
    Sidebar
  },
}
</script>

<style scoped>
.el-aside {
  border-right: 1px solid #dfe6ec;
}
.el-header {
  border-bottom: 1px solid #dfe6ec;
}
.el-main {
  background-color: #f8f9fb;
  height: calc(100vh - 60px);
}
</style>
