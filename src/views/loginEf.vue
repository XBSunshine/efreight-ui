<template>
	<div class="body-bg">
		<el-form ref="AccountForm"  >
      <el-row class="login-container-ef"
                      v-loading="loading"
                      element-loading-text="拼命授权加载中"
                      element-loading-spinner="el-icon-loading"
                      element-loading-background="rgb(128, 194, 254)"
                      :data="tableData"
                      >
                      <span v-if="messageFlag" style="font-size:30px;color: red;">用户信息无效,无法访问</span>
                   </el-row>

  	</el-form>

  </div>


</template>
<script>
	export default {
		data() {
        return{
          tableData: [{
                    message: ''
                  }],
          loading: true,
          messageFlag:false,
          token:'',
          orgCode:'',
          orgName:'',
          browserFlag:true
        }
		},
		created() {
      let browserInfo = navigator.userAgent.toLowerCase();
      console.log(browserInfo);
      //特殊排除webkit(谷歌内核) 其他浏览器 edge/搜狗/qq/UC/遨游/opera
      if(browserInfo.indexOf("chrome")<0||browserInfo.indexOf("edge")>=0||browserInfo.indexOf("se")>=0
        ||browserInfo.indexOf("qqbrowser")>=0||browserInfo.indexOf("ubrowser")>=0||browserInfo.indexOf("maxthon")>=0
        ||browserInfo.indexOf("opr")>=0){
         this.browserFlag = false;
      }
      if(this.$route.query.token){
        this.token = this.$route.query.token;
      }
      if(this.token&&this.token!='unfinded'){
          // this.loading = false;
          // let token = window.localStorage.getItem('access_token')
          // if(token) {
          // 	this.$router.push({
          // 		path: '/'
          // 	});
          // }else{
            this.handleLogin();
          // }
      }else{
          this.loading=false;
          this.messageFlag = true;
          this.tableData[0].message ="用户信息无效,无法访问";
      }

		},
		methods: {
			handleLogin() {
				let that = this;
				let authori = 'ZWZyZWlnaHQ6ZWZyZWlnaHQ=';
					//邮箱登录
					this.$axios.post('/hrs/org/sourceLoginOfEf', {
						token: this.$route.query.token,
					}).then(function(response) {
            console.log(response.data.data);
						if(response.data.code == '0') {
                  // console.log(response);
                  localStorage.setItem('logintype', 0);
                  localStorage.setItem('browserFlag', this.browserFlag);
                  localStorage.setItem('orgCode', response.data.data.orgCode);
                  localStorage.setItem('orgName', response.data.data.orgName);
                  localStorage.setItem('orgType', response.data.data.orgType);
                  localStorage.setItem('userEmail', response.data.data.userEmail);
                  localStorage.setItem('username', response.data.data.userName);
                  localStorage.setItem('nickname', response.data.data.userCname);
				  localStorage.setItem('phoneNumber', response.data.phoneNumber);
                  localStorage.setItem('orgVersion', response.data.data.orgVersion);
                  localStorage.setItem('access_token', response.data.data.access_token);
                  localStorage.setItem('token_type', response.data.data.token_type);
                  localStorage.setItem('refresh_token', response.data.data.refresh_token);
                  localStorage.setItem('expires_in', response.data.data.expires_in);
                  localStorage.setItem('scope', response.data.data.scope);
                  localStorage.setItem('license', response.data.data.license);
                  localStorage.setItem('deptId', response.data.data.deptId);
                  localStorage.setItem('userId', response.data.data.userId);
                  localStorage.setItem('orgId', response.data.data.orgId);
                  localStorage.setItem('source', response.data.data.source);
				  localStorage.setItem('orderEditNewPage',response.data.data.orderEditNewPage)
				  localStorage.setItem('orderSaveClosePage',response.data.data.orderSaveClosePage)
          localStorage.setItem('orderFinanceLockView',response.data.data.orderFinanceLockView)
                  //获取当前用户的菜单,，放到localStorage中
                  that.getUserMenu();
                  that.getButtonInfo();
                  // that.getUserMenuForAdmin();
                  this.loading=false;
                  this.messageFlag = false;
						} else {

							this.$notify.error({
								title: '错误',
								message: '用户信息异常访问失效',
							});
                this.loading = false;
                this.messageFlag = true;
						}
					}.bind(this)).catch(function(error) {
						console.log(error)
            that.loading = false;
            that.messageFlag = true;
            //     that.$message.error("授权失败: " + error.response.data.messagInfo);
            //     that.loading = false;
            //     that.messageFlag = true;
					});
			},

			//获取按钮权限
			getButtonInfo() {
				this.$axios.get('/hrs/permission/getButtonInfo')
					.then(function(response) {
						let buttonInfo = response.data.data;
						localStorage.setItem('buttonInfo', JSON.stringify(buttonInfo));
					}.bind(this)).catch(function(error) {
						console.log(error);
             this.messageFlag = true;
					}).finally(function() {
						this.loading = false;

					}.bind(this));
			},
			//获取菜单
			getUserMenu() {
				let user = window.localStorage.getItem('access_token')
				if(!user) {
					this.loading = false;
					next({
						path: '/login'
					})

				} else {
            this.$axios.get('/hrs/permission/getAllPermissionAndHave')
                .then(function(response) {
                    // console.log(response);
                    let menu = response.data.data;
                    localStorage.setItem('menuinfo', JSON.stringify(menu));
                    this.$router.push({
                        path: '/'
                    });
                    //							road.$emit('goto', '/');
                }.bind(this)).catch(function(error) {
                console.log(error);
                this.messageFlag = true;
            }).finally(function() {
                this.loading = false;

            }.bind(this));
				}
			},
      //获取菜单
      getUserMenuForAdmin() {
          let user = window.localStorage.getItem('access_token')
          if(!user) {
              this.loading = false;
              next({
                  path: '/login'
              })

          } else {
              this.$axios.get('/hrs/permission')
                  .then(function(response) {
                      console.log(response);
                      let menu = response.data.data;
                      localStorage.setItem('menuinfo', JSON.stringify(menu));
                      this.$router.push({
                          path: '/'
                      });
                      //							road.$emit('goto', '/');
                  }.bind(this)).catch(function(error) {
                  console.log(error);
                  this.messageFlag = true;
              }).finally(function() {
                  this.loading = false;
              }.bind(this));
          }
      },
			openError(info) {
				this.$notify({
					title: '',
					message: info,
					type: 'error',
					position: 'bottom-right'
				});
			}
		}
	}
</script>
<style>
	.body-bg {
		position: absolute;
		width: 100%;
		height: 100%;
		top: 0;
		left: 0;
		overflow-y: auto;
		background-color: #80c2fe;
		background-image: url(../assets/login_background.jpg);
		background-repeat: no-repeat;
		background-position: 100% 100%;
		background-size: contain;
	}

	.background-foot {
		background-image: url(../assets/login_background.jpg);
		width: 100%;
		height: 145px;
	}

	.header-content {
		top: 0;
		width: 370px;
		height: 68px;
		padding: 20px 40px;
		border-bottom: 1px solid #ddd;
		/*box-shadow: 0 0 2px #80c2fe;*/
		/*background: linear-gradient(left, #137DFA, #479BFF);*/
		background: -webkit-gradient(linear, left top, right top, from(#137DFA), to(#479BFF));
		margin: 0px 0px 25px -48px;
	}

	.header-content .logo-part {
		font-size: 20px;
		color: white;
	}

	.header-content .logo-part img {
		vertical-align: middle;
	}

	.login-container-ef {
		/*box-shadow: 0 0px 8px 0 rgba(0, 0, 0, 0.06), 0 1px 0px 0 rgba(0, 0, 0, 0.02);*/
		-webkit-border-radius: 5px;
		/* border-radius: 5px; */
		-moz-border-radius: 5px;
		/* background-clip: padding-box; */
		margin: 130px auto auto;
		width: 370px;
    height: 340px;
    font-size: 50px;
		/* padding: 0px 40px 5px 48px; */
		/* background: #fff; */
		/*border: 1px solid #eaeaea;*/
		/* box-shadow: 0 0 25px #80c2fe; */
		background: -ms-linear-gradient(top, #ace, #00C1DE);
		/* IE 10 */
		background: -moz-linear-gradient(top, #ace, #00C1DE);
		/*火狐*/
		background: -webkit-gradient(linear, 0% 0%, 0% 100%, from(#ace), to(#00C1DE));
		/*谷歌*/
		background: -webkit-linear-gradient(top, #ace, #00C1DE);
		/*Safari5.1 Chrome 10+*/
	/* 	 */background: -o-linear-gradient(top, #ace, #00C1DE);
		/*Opera 11.10+*/
	}


	.login-container-ef .title {
		margin: 0px auto 40px auto;
		text-align: center;
		color: #505458;
	}

	.login-container-ef .remember {
		margin: 0px 0px 35px 0px;
	}

	.extra-text {
		position: relative;
		margin-bottom: 5px;
		padding-left: 205px;
	}

	.extra-text a {
		font-size: 12px;
		color: #aaa;
	}

	.extra-text a:hover {
		color: #29e;
	}

	.extra-text .reg-text {
		position: absolute;
		top: 4px;
		right: 2px;
	}

	.el-form-item {
		margin-bottom: 20px;
	}



  .login-container-ef .el-loading-text{
        color: #0d558d;
        margin: 3px 0;
        font-size: 30px !important;
  }
  .login-container-ef .el-loading-spinner i {
    color: #0d558d;
   }
</style>
