<template>
	<!--左侧导航-->
	<aside :class="{showSidebar:!collapsed}">
		<!--展开折叠开关-->
		<div class="menu-toggle" @click.prevent="collapse">
			<i class="el-icon-d-arrow-left" v-show="!collapsed" title="收起"></i>
			<i class="el-icon-d-arrow-right" v-show="collapsed" title="展开"></i>
		</div>
		<el-menu :default-active="$route.path" :unique-opened="true" :router="true" mode="vertical" :collapse="collapsed">
			<template v-for="(item,index) in menu">

				<el-submenu v-if="item.children.length !== 0" :index="item.id+''">

					<template slot="title">
						<i :class="item.icon"></i>
						<!--<span slot="title">{{item.name}}</span>-->
						<span slot="title" v-if="item.path=='/unDevelop' || item.path=='/unPermission'" style="color: #909399">{{item.name}}</span>
						<span slot="title" v-else>{{item.name}}</span>
					</template>

					<template v-for="(child, sub_index) in item.children">
						<el-submenu v-if="child.children.length !==0" :index="child.id+''">
							<template slot="title">
								<i :class="child.icon"></i>
								<!--<span slot="title">{{child.name}}</span>-->
								<span slot="title" v-if="child.path=='/unDevelop' || child.path=='/unPermission'" style="color: #909399">{{child.name}}</span>
								<span slot="title" v-else>{{child.name}}</span>
							</template>
							<el-menu-item v-for="(sub_child,index) in child.children" :index="sub_child.path" :key="index">
								<i :class="sub_child.icon"></i>
								<!--<span slot="title">{{sub_child.name}}</span>-->
								<span slot="title" v-if="sub_child.path=='/unDevelop' || sub_child.path=='/unPermission'" style="color: #909399">{{sub_child.name}}</span>
								<span slot="title" v-else>{{sub_child.name}}</span>
							</el-menu-item>
						</el-submenu>
						<el-menu-item v-else :index="child.path">
							<i :class="child.icon"></i>
							<!--<span slot="title">{{child.name}}</span>-->
							<span slot="title" v-if="child.path=='/unDevelop' || child.path=='/unPermission'" style="color: #909399">{{child.name}}</span>
							<span slot="title" v-else>{{child.name}}</span>
						</el-menu-item>

					</template>

				</el-submenu>

				<el-menu-item v-else :index="item.path">
					<i :class="item.icon"></i>
					<!--<span slot="title">{{item.name}}</span>-->
					<span slot="title" v-if="item.path=='/unDevelop' || item.path=='/unPermission'" style="color: #909399">{{item.name}}</span>
					<span slot="title" v-else>{{item.name}}</span>
				</el-menu-item>
			</template>
		</el-menu>
		<!--<el-menu :default-active="$route.path" :unique-opened="true" :router="true" mode="vertical" :collapse="collapsed">
			<template v-for="(item,index) in menu">

				<el-submenu v-if="item.children.length !== 0" :index="index+''" :key="index">

					<template slot="title">
						<i :class="item.icon"></i>
						<span slot="title">{{item.name}}</span>
					</template>

					<template v-for="(child, sub_index) in item.children">
						<el-submenu v-if="child.children.length !==0" :index="'sub'+sub_index" :key="child.id">
							<template slot="title">
								<i :class="child.icon"></i>
								<span slot="title">{{child.name}}</span>
							</template>
							<el-menu-item v-for="(sub_child,index) in child.children" :index="sub_child.path" :key="sub_child.path">
								<i :class="sub_child.icon"></i>
								<span slot="title">{{sub_child.name}}</span>
							</el-menu-item>
						</el-submenu>
						<el-menu-item v-else :index="child.path" :key="child.path">
							<i :class="child.icon"></i>
							<span slot="title">{{child.name}}</span>
						</el-menu-item>

					</template>

				</el-submenu>

				<el-menu-item v-else :index="item.path" :key="item.path">
					<i :class="item.icon"></i>
					<span slot="title">{{item.name}}</span>
				</el-menu-item>
			</template>
		</el-menu>-->
	</aside>
</template>
<script>
	export default {
		name: 'leftNav',
		data() {
			return {
				loading: false,
				collapsed: false,
				menu: localStorage.menuinfo ? JSON.parse(localStorage.menuinfo) : [],
				leftMenu: [],
				menuMap: {}, //key:path value:id
			}
		},
		created() {
			this.buildMenuMap(this.menu);
		},
		methods: {
			//折叠导航栏
			collapse: function() {
				this.collapsed = !this.collapsed;
			},
			// 左侧导航栏根据当前路径默认打开子菜单（如果当前是二级菜单，则父级子菜单默认打开）
			defaultLeftNavOpened() {
				let cur_path = this.$route.path; //获取当前路由
				let paths = cur_path.split("/")[1].split("_")[0];
				let routers = this.menu; // 获取路由对象
				let flag = false
				for (let i = 0; i < routers.length; i++) {
					if (routers[i].path == "/" + paths) {
						if (routers[i].children) {
							this.leftMenu = routers[i].children;
							flag = true
						}
						break;
					}
				}
				if (!flag) {
					this.leftMenu = []
				}
			},
			buildMenuMap(menu) {
				menu.forEach((item) => {
					if (item.path && item.id && item.name) {
						this.menuMap[item.path] = {
							"id": item.id,
							"name": item.name
						};
					}
					let children = item['children'];
					if (children.length > 0) {
						this.buildMenuMap(children);
					}
				})
			},
			recordMenu(path) {
				if (!path) {
					return;
				}
				let param = this.menuMap[path.trim()] || '';
				if (!param) {
					return;
				}
				try {
					param['path'] = path;
					this.$axios.post("/hrs/userAccessRecord/recordMenu", param);
				} catch (e) {
					console.error(e);
				}
			}
		},
		watch: {
			'$route': function(to, from) { // 路由改变时执行
				if (to.path == '/unDevelop') {
					let routeUrl = this.$router.resolve({
						path: "/unDevelop",
						query: {
							flag: true,
							name: 'unDevelop'
						}
					});
					window.open(routeUrl.href, '_self');
				} else if (to.path == '/unPermission') {
					let routeUrl = this.$router.resolve({
						path: "/unPermission",
						query: {
							flag: true,
							name: 'unPermission'
						}
					});
					window.open(routeUrl.href, '_self');
				} else {
					//记录访问信息
					this.recordMenu(to.path);
				}


			},
			index: function(val) {
				//this.defaultLeftNavOpened();
			}
		},
		computed: {
			index: function() {
				//return this.$store.state.leftNavState
			}
		},
		mounted() {
			//this.defaultLeftNavOpened();
		},
	}
</script>
<style>
	.el-menu-item:hover {
		outline: 0 !important;
		background: #EEF5FF !important;
	}
</style>
