<template>
  <el-row class="container">
    <!--头部-->
    <el-col :span="24"><router-view name="top"></router-view></el-col>
    <el-col :span="24" class="main">
      <!--左侧导航-->
      <router-view name="aside"></router-view>
      <!--右侧内容区-->
      <section class="content-container">
        <div class="grid-content bg-purple-light">
          <transition name="fade" mode="out-in">
            <router-view></router-view>
          </transition>
          <div class="dialog_home">
            <el-dialog
               title="重要提示"
               :visible.sync="dialogVisible"
                width="666px"
               :before-close="handleClose">
               <span><p>&emsp;&emsp;尊敬的客户，您好：</p>
               <p>&emsp;&emsp;本系统推荐使用的浏览器是：360浏览器（极速模式），或Chrome浏览器（谷歌浏览器）</p>
               <p>&emsp;&emsp;您当前所使用的浏览器，与本系统推荐使用的浏览器不一致，<span style="color:red">可能会造成业务数据的显示和保存异常</span></p>
               <p>&emsp;&emsp;为了您更好的使用体验，建议您更换浏览器</p></span>
               <span slot="footer" class="dialog_home_footer" >
                 <el-button type="primary"  @click="dialogVisible = false">我知道了</el-button>
               </span>
             </el-dialog>
          </div>
          <div class="dialog_home">
            <el-dialog
              title="重要提示"
              :visible.sync="dialogVisible1"
              width="666px"
              :before-close="handleClose">
               <span><p>&emsp;&emsp;尊敬的客户，您好：</p>
               <p>&emsp;&emsp;为了您更好的使用体验，建议您在电脑上进行访问</p></span>
              <span slot="footer" class="dialog_home_footer" >
                 <el-button type="primary"  @click="dialogVisible1 = false">我知道了</el-button>
               </span>
            </el-dialog>
          </div>

        </div>
      </section>
    </el-col>
  </el-row>
</template>
<script>
  export default {
    name: 'home',
    data () {
      return {
        loading: false,
        dialogVisible:false,
        dialogVisible1: false
      }
    },
    created: function() {
      let  browserFlag = window.localStorage.getItem('browserFlag');
      if(browserFlag!='true'){
         this.dialogVisible = true;
      }
      if (this._isMobile()) {
          this.dialogVisible1 = true;
          this.dialogVisible = false;
      } else {
          this.dialogVisible1 = false;
      }
    },
    methods:{
      handleClose(done) {
           done();
      },
      _isMobile() {
          let flag = navigator.userAgent.match(/(phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone)/i)
          return flag;
      }
    }
  }
</script>
<style scoped>
  .dialog_home{
    line-height: 27px;
    font-size: 18px;
    color: #303133;
  }
  .dialog_home_footer{
    padding: 10px 265px 20px;
    text-align: center;
    box-sizing: border-box;
  }

</style>
