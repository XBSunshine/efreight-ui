<template>
  <!--<iframe id="iframeView" :src="src" frameBorder="0" width="100%" ref="iframe"></iframe>-->
  <div class="block" id="iframeView">
    <el-image :src="src"></el-image>
  </div>
</template>
<script type="text/javascript">
    export default {
        data() {
            return {
                src: ''
            }
        },
        methods: {
            calculateHeight: function() {
                let height = document.getElementsByClassName("content-container")[0].clientHeight - 20 - 4;
                let iframe = document.getElementById("iframeView");
                iframe.height = height + 'px';
            }
        },
        mounted() {
            this.$axios.get('/hrs/permission/' + 394).then(function(response) {
                if (response.data.code == 0) {
                    this.src = response.data.data.helpDocumentUrl;
                }
            }.bind(this));
            /*this.calculateHeight();
            window.onresize = function() {
                let iframe = document.getElementById("iframeView");
                if(iframe != null && iframe != undefined) {
                    let height = document.getElementsByClassName("content-container")[0].clientHeight - 20 - 4;
                    iframe.height = height + 'px';
                }
            }*/
        }
    }
</script>
<style scoped="scoped">
  html,body {
    height: 200%;
  }
  .block {
    /*position: absolute;*/
    width: 100%;
    text-align: center;
    height: 100%;
  }
  .block img {
    max-width: 100%;
    /*max-height: 100%;*/
  }
</style>
