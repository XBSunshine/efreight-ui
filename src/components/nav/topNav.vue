<template>
	<el-row class="container top-nav">
		<!--头部-->
		<el-col :span="24" class="topbar-wrap">
			<div class="topbar-logo topbar-btn">
				<a href="/"><img src="../../assets/logo.png" style="padding-left:8px;"></a>
			</div>
			<div class="topbar-logos" style="color: #ffff">
        <a href="/" style="color: #fff;"><span v-show="!$store.state.collapsed">EF物流生态云应用平台</span>  </a>
        <template v-if="isSmallDevice">
          <span v-if="showIcon" style="font-size: 23px; margin-left: 10px; color:#fff" @click="showIcon=false"><i class="el-icon-s-unfold"></i></span>
        </template>
        <template v-else>
          <span v-if="showIcon" style="font-size: 23px;  position: absolute; margin-left: 10px;" @click="showIcon=false"><i class="el-icon-s-unfold"></i></span>
        </template>
        <template v-if="!showIcon">
          <a href="javascript:void(0)"  @click="showIcon=true" style="color: #fff"> · {{orgName}}<span style="font-size: 12px;vertical-align: middle;"> ({{orgVersion}})</span>  </a>
        </template>
			</div>
			<div class="topbar-title" v-show="false">
				<!-- 注意：这里就是topNavState作用之处，根据当前路由所在根路由的type值判断显示不同顶部导航菜单 -->
				<el-row>
					<el-col :span="24">
						<el-menu active-text-color="#E6E6E6" :default-active="defaultActiveIndex" class="el-menu-demo" mode="horizontal" @select="handleSelect" :router="true">
							<el-submenu index="/">
								<template slot="title">{{value}}</template>
								<el-menu-item index="/dashboard">电子货运从这里开始</el-menu-item>
								<el-menu-item :key="item.id" :index="item.path" v-for="(item,index) in menuInfo">{{item.name}}</el-menu-item>
								<!--<el-menu-item index="/prmManager">PRM 商务客商资料管理系统</el-menu-item>
								<el-menu-item index="/afManager">AF 空运运输管理系统</el-menu-item>
								<el-menu-item index="/cssManager">CSS 清结算管理系统</el-menu-item>-->
							</el-submenu>
						</el-menu>
					</el-col>
				</el-row>
			</div>
      <div class="topbar-account topbar-btn">
				<el-dropdown trigger="click">
					<span class="el-dropdown-link userinfo-inner">
                       <i style="font-size: 16px" class="el-icon-user-solid"></i>
                          {{nickname}}
                       <i class="el-icon-caret-bottom"></i>
					</span>
					<el-dropdown-menu slot="dropdown">
						<el-dropdown-item :disabled="infoFlag">
							<div @click="editInfo" ><span style="font-size: 14px;">个人信息</span></div>
						</el-dropdown-item>
            <el-dropdown-item>
							<div @click="jumpTo('/resetPassword')"><span style="color: #555;font-size: 14px;">修改密码</span></div>
						</el-dropdown-item>
            <el-dropdown-item divided> <div @click="jumpTo('/tutorial')"><span style="font-size: 14px;">视频教程</span></div> </el-dropdown-item>
            <el-dropdown-item> <div @click="openHelpDoc"><span style="color: #555;font-size: 14px;">用户手册</span></div> </el-dropdown-item>
						<el-dropdown-item divided @click.native="logout">退出登录</el-dropdown-item>
					</el-dropdown-menu>
				</el-dropdown>
			</div>

      <div style="float: right; display: flex; margin-right: 20px;">
        <div class="top-nav-banner" v-if="stopDateShow && stopDateFlag">
          <span style="font-size: 14px;color: #ffffff;">有效期至:</span> <span style="font-size: 14px;color: #ffffff;">{{stopDate}}</span>
        </div>
        <div class="top-nav-banner" v-if="stopDateShow && !stopDateFlag">
          <span style="font-size: 14px;color: #ffffff;">有效期至:</span> <span style="font-size: 14px;color: red;font-weight: bold">{{stopDate}}</span>
        </div>
          <div class="top-nav-banner">
            <a href="javascript:void(0)" @click="jumpTo('/contactUs')" style="color:#ffffff; "> <i style="font-size: 16px" class="el-icon-phone"></i> 联系我们 </a>
          </div>
      </div>
      <edit ref="addMission" v-if="editVisible" :visible.sync="editVisible"></edit>


		</el-col>
	</el-row>
</template>
<script>
	import 'element-ui/lib/theme-chalk/display.css';
	import { road } from '../../road.js'
  import Edit from '../../views/hrs/user/hrs_personal_edit.vue'


	export default {
		data() {
			return {
				value: '电子货运从这里开始',
				loading: false,
				companyName: '',
				nickname: '',
        orgName: '',
        orgVersion: '',
				defaultActiveIndex: '/dashboard',
				homeMenu: false,
				messageCount: 5,
				menuInfo: localStorage.menuinfo ? JSON.parse(localStorage.menuinfo) : [],
        editVisible: false,
        showIcon: true,
        infoFlag: false,
        helpDocUrl: '',
        stopDate: '',
        stopDateFlag: false,
        stopDateShow: false,
        isSmallDevice: false,
			}
		},
		created() {

      if(window.screen.width < 768){
        this.isSmallDevice = true;
      }
      let orgName = window.localStorage.getItem('orgName');
      this.orgName = orgName;
      let orgVersion = window.localStorage.getItem('orgVersion');
      this.orgVersion = orgVersion;
      let stopDate = window.localStorage.getItem('stopDate');
      if(stopDate){
          this.stopDate = stopDate.substring(0,10);
          var day1 = new Date();
          var s1 = day1.getFullYear()+"-" + (day1.getMonth()+1) + "-" + day1.getDate();
          let days = this.getDaysBetween(s1,stopDate);
          if(days < 30){
              this.stopDateFlag = false;
          }else{
              this.stopDateFlag = true;
          }
      }else{
          this.stopDate = '2099-12-31'
          this.stopDateFlag = true;
      }

      let adminRole = window.localStorage.getItem('adminRole');
      if(adminRole == 'superAdmin'){
          this.stopDateShow = false
      }else{
          this.stopDateShow = true
      }
			road.$on('setNickName', (text) => {
				this.nickname = text;
			});

			road.$on('goto', (url) => {
				if(url === "/login") {
					localStorage.removeItem('access-user');
					this.$router.push(url);
				}
			});
			// 组件创建完后获取数据
			//			this.fetchNavData();
			let currPath = this.$route.path;
			let paths = currPath.split("/")[1].split("_")[0];
			for(let i = 0; i < this.menuInfo.length; i++) {
				if(this.menuInfo[i].path == "/" + paths) {
					this.value = this.menuInfo[i].name;
					this.defaultActiveIndex = this.menuInfo[i].path;
					break;
				}
			}
			this.$store.state.leftNavState = "/" + paths;
		},
    components: {
        'edit': Edit,
    },
		methods: {
      getDaysBetween(dateString1,dateString2){
        var  startDate = Date.parse(dateString1);
        var  endDate = Date.parse(dateString2);
        var days=(endDate - startDate)/(1*24*60*60*1000);
        return  days;
      },
      editInfo(){
          this.editVisible = true;
      },
			jumpTo(url) {
				this.$router.push(url); //用go刷新
			},
			handleSelect(index) {
				this.defaultActiveIndex = index;
				if(index == '/dashboard') {
					this.value = '电子货运从这里开始';
				} else {
					for(let i = 0; i < this.menuInfo.length; i++) {
						if(this.menuInfo[i].path == index) {
							this.value = this.menuInfo[i].name;
						}
					}
				}
//				this.$store.state.leftNavState = index;
			},
			logout() {
				//logout
				this.$confirm('确认退出吗?', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {

					this.$axios.deletes('/auth/token/logout')
						.then(function(response) {
							//确认
							// localStorage.removeItem('logintype');
							localStorage.removeItem('orgCode');
							localStorage.removeItem('username');
							localStorage.removeItem('nickname');
							localStorage.removeItem('token_type');
							localStorage.removeItem('access_token');
							localStorage.removeItem('license');
							localStorage.removeItem('scope');
							localStorage.removeItem('refresh_token');
							localStorage.removeItem('expires_in');
							localStorage.removeItem('deptId');
							localStorage.removeItem('userId');
							localStorage.removeItem('orgId');
							localStorage.removeItem('menuinfo');
							localStorage.removeItem('buttonInfo');
							localStorage.removeItem('phoneNumber');
							localStorage.removeItem('orgName');
							let source = window.localStorage.getItem('source');
							if(source){
							  localStorage.removeItem('source');
							  window.open("http://"+source,"_self");
							}else{
								road.$emit('goto', '/login');
							}
						}.bind(this)).catch(function(error) {
							console.log(error);
							that.$message.error("登录失败: " + error.response.data.messagInfo);
						});
				}).catch(() => {});
			},
      openHelpDoc(){
        window.open(this.helpDocUrl);
      },
      loadHelpDoc(){
        this.$axios.get("/hrs/permission/helpDoc/新手指引").then(function (response) {
          if(response.data.code == 0){
            this.helpDocUrl = response.data.data['helpDocUrl'];
          }
        }.bind(this))
      },
		},
		mounted() {
			let user = window.localStorage.getItem('nickname');
			if(user) {
				this.nickname = user || '';
			}
			this.loadHelpDoc();

		},
		watch: {
			'$route': function(to, from) { // 路由改变时执行
				let currPath = this.$route.path;
				let paths = currPath.split("/")[1].split("_")[0];
				for(let i = 0; i < this.menuInfo.length; i++) {
					if(this.menuInfo[i].path == "/" + paths) {
						this.value = this.menuInfo[i].name;
						this.defaultActiveIndex = this.menuInfo[i].path;
						break;
					}
				}
				this.$store.state.leftNavState = "/" + paths;
			}
		}
	}
</script>
<style type="text/css">
  .top-nav .top-nav-banner{
    background-color: #3a94fe;
    padding: 0px 20px;
  }
</style>
