<template>
  <div class="context">
    <img src="../assets/images/unpermission.png">
    <p style="color: #479BFF">当前用户无此权限，请联系管理员！</p>
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
    /*position: absolute;*/
    top: 10%;
    width: 100%;
    text-align: center;
    height: 899px;
  }
  .context img {
    max-width: 100%;
    max-height: 100%;
    margin-top: 100px;
  }
  .context p {
    margin: 20px;
    font-size: 16px;
    color: #0d3349;
  }
</style>
