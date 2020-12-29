<template>
  <div class="context">
    <img src="../assets/images/not_found.png">
    <p>您无权访问该页面...</p>
    <div>
      <router-link :to="{path: '/'}"><el-button type="primary" plain>返回首页</el-button></router-link>
    </div>
  </div>
</template>
<style scoped="scoped">
  html,body {
    height: 100%;
  }
  #app {
    height: 100%;
    margin-top: 0;
  }
  .context {
    position: absolute;
    top: 20%;
    width: 100%;
    text-align: center;
  }
  .context img {
    max-width: 100%;
    max-height: 100%;
  }
  .context p {
    margin: 20px;
    font-size: 16px;
    color: #0d3349;
  }
</style>
