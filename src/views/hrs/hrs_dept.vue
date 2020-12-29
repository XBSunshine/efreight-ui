<template>
	<div>
		<div>
			<el-row>
				<el-form :inline="false" :model="query" label-width="130px" class="demo-ruleForm">
					<el-row>
						<el-form-item class="pull-right">
							<!-- <el-button type="primary" size="medium" v-on:click="findByPage">查询</el-button> -->
							<!-- <el-button type="primary" size="medium" v-on:click="exportExcel">导出</el-button> -->
							<!-- <el-button type="primary" size="medium" v-on:click="showsave">新建</el-button> -->
						</el-form-item>
					</el-row>
					<el-row>
						<!-- <el-col :span="4">
                <el-form-item label="部门名称">
                <el-input v-model="query.deptName" auto-complete="off" clearable>
                </el-input>
                </el-form-item>
              </el-col> -->
						<!-- <el-col :span="4">
                <el-form-item label="部门编号">
                <el-input v-model="query.deptCode" auto-complete="off" clearable>
                </el-input>
                </el-form-item>
              </el-col> -->
						<!-- <el-col :span="4">
                <el-form-item label="是否末端利润中心">
                <el-select v-model="query.isFinalProfitunit" clearable placeholder="请选择">
                <el-option label="是" value="true"></el-option>
                <el-option label="否" value="false"></el-option>
                </el-select>
                </el-form-item>
              </el-col> -->
						<!-- <el-col :span="4">
                <el-form-item label="是否生效">
                <el-select v-model="query.deptStatus" clearable placeholder="请选择">
                <el-option label="是" :value="true"></el-option>
                </el-select>
                </el-form-item>
              </el-col> default-expand-all-->
					</el-row>
				</el-form>
			</el-row>
			<el-table ref="topicTable" :data="data1" style="width: 100%;margin-bottom: 20px;" :row-key="getRowKeys" border :tree-props="{children: 'children', hasChildren: 'hasChildren'}">
				<el-table-column label="操作" align="center" width="60" type="index">
					<template slot-scope="scope">
						<el-dropdown trigger="click" @command="handleCommand" @visible-change="handleChange(scope.row)">
							<i class="el-icon-s-operation"></i>
							<el-dropdown-menu slot="dropdown">
								<el-dropdown-item></el-dropdown-item>
								<el-dropdown-item command="new" v-if="newButtonFlag">新建</el-dropdown-item>
								<el-dropdown-item command="edit" v-if="editButtonFlag">编辑</el-dropdown-item>
								<el-dropdown-item command="delete" v-show="scope.row.deptCode!='111'" v-if="deleteButtonFlag">删除</el-dropdown-item>
								<el-dropdown-item command="move" v-show="scope.row.deptStatus" v-if="moveButtonFlag">移动</el-dropdown-item>
								<el-dropdown-item command="merge" v-show="scope.row.deptStatus&&!scope.row.children.length>0" v-if="mergeButtonFlag">合并</el-dropdown-item>
								<el-dropdown-item command="sort" v-show="scope.row.deptStatus&&scope.row.children.length>0" v-if="sortButtonFlag">排序</el-dropdown-item>
							</el-dropdown-menu>
						</el-dropdown>

					</template>
					<!-- <template slot-scope="scope">
            <el-button type="text" size="small" v-on:click="showSaveChild(scope.row)" >新建</el-button>
            <el-button type="text" size="small" v-on:click="showedit(scope.row)"  >编辑</el-button>
            <el-button type="text" size="small" v-on:click="doDelete(scope.row)" v-show="scope.row.deptCode!='111'">删除</el-button> -->
					<!-- <el-button type="text" size="small" v-on:click="doStop(scope.row)" v-show="scope.row.deptStatus">停用</el-button>
          <el-button type="text" size="small" v-on:click="doStart(scope.row)" v-show="!scope.row.deptStatus" >启用</el-button> -->
					<!--  <el-button type="text" size="small" v-on:click="showMove(scope.row)" v-show="scope.row.deptStatus" >移动</el-button>
           <el-button type="text" size="small" v-on:click="showMerge(scope.row)" v-show="scope.row.deptStatus&&!scope.row.children.length>0" >合并</el-button>
           <el-button type="text" size="small" v-on:click="showSort(scope.row)" v-show="scope.row.deptStatus&&scope.row.children.length>0" >排序</el-button>
         </template> -->
				</el-table-column>

				<el-table-column prop="deptName" label="部门名称"></el-table-column>
				<!-- <el-table-column prop="deptCode" label="部门编号" ></el-table-column> -->
				<el-table-column prop="shortName" label="部门简称" width="200"></el-table-column>
				<el-table-column prop="fullName" label="显示名称" :formatter="formatFullName"></el-table-column>
				<el-table-column prop="managerName" label="负责人" width="80"></el-table-column>
				<!-- <el-table-column prop="budgetHc" label="预算人数" width="80"></el-table-column> -->
				<el-table-column label="实际人数" width="80">
					<template slot-scope="scope">
						<el-link @click="gotoUserPage(scope.row)" target="_blank">{{scope.row.actualHc}}</el-link>
					</template>
				</el-table-column>
				<!-- <el-table-column prop="isProfitunit" label="是否利润中心" :formatter="formater1" width="110"></el-table-column> -->
				<!-- <el-table-column prop="isFinalProfitunit" label="末端利润中心" :formatter="formater2" width="110"></el-table-column> -->
				<!-- <el-table-column prop="deptStatus" label="是否生效" :formatter="formatDeptStatus" width="80"></el-table-column>       -->
			</el-table>

		</div>
		<saveVisibleTag ref="addMission" v-if="saveVisible" :visible.sync="saveVisible"></saveVisibleTag>
		<saveCVisibleTag ref="addMission" v-if="saveCVisible" :visible.sync="saveCVisible" :frow="frow"></saveCVisibleTag>
		<editVisibleTag ref="addMission" v-if="editVisible" :visible.sync="editVisible" :frow="frow"></editVisibleTag>
		<edit1VisibleTag ref="addMission" v-if="edit1Visible" :visible.sync="edit1Visible" :frow="frow"></edit1VisibleTag>
		<moveVisibleTag ref="addMission" v-if="moveVisible" :visible.sync="moveVisible" :frow="frow"></moveVisibleTag>
		<mergeVisibleTag ref="addMission" v-if="mergeVisible" :visible.sync="mergeVisible" :frow="frow"></mergeVisibleTag>
		<sortVisibleTag ref="addMission" v-if="sortVisible" :visible.sync="sortVisible" :frow="frow"></sortVisibleTag>
		<userVisibleTag ref="addMission" v-if="userVisible" :visible.sync="userVisible" :frow="frow"></userVisibleTag>
	</div>
</template>
<script>
	import saveVisibleVue from './dept/hrs_dept_save'
	import saveCVisibleVue from './dept/hrs_dept_savechild'
	import editVisibleVue from './dept/hrs_dept_edit'
	import edit1VisibleVue from './dept/hrs_dept_edit1'
	import moveVisibleVue from './dept/hrs_dept_move'
	import mergeVisibleVue from './dept/hrs_dept_merge'
	import sortVisibleVue from './dept/hrs_dept_sort'
	import userVisibleVue from './dept/employee/hrs_dept_user'
	//import userVisibleVue from './hrs_user'

	export default {
		data() {
			return {
				loading: false,
				/*表数据*/
				data1: [],
				pageConf: {
					//设置一些初始值(会被覆盖)
					pageCode: 1, //当前页
					pageSize: 10, //每页显示的记录数
					totalPage: 0, //总记录数
					pageOption: [10, 50, 130], //分页选项
					handleCurrentChange: function() {
						console.log("页码改变了");
					}
				},
				query: {
					deptName: '',
					deptCode: '',
					isFinalProfitunit: '',
					deptStatus: ''
				},
				firstLine: '',
				saveVisible: false,
				saveCVisible: false,
				editVisible: false,
				edit1Visible: false,
				moveVisible: false,
				mergeVisible: false,
				sortVisible: false,
				userVisible: false,
				frow: {},
				newButtonFlag: false,
				editButtonFlag: false,
				deleteButtonFlag: false,
				moveButtonFlag: false,
				mergeButtonFlag: false,
				sortButtonFlag: false,
			}
		},
		mounted() {

		},
		updated() {
			if(this.firstLine) {
        // console.log(this.firstLine);
				this.$refs.topicTable.toggleRowExpansion(this.firstLine, true)
			} else {

			}
		},
		components: {
			'saveVisibleTag': saveVisibleVue,
			'saveCVisibleTag': saveCVisibleVue,
			'editVisibleTag': editVisibleVue,
			'edit1VisibleTag': edit1VisibleVue,
			'moveVisibleTag': moveVisibleVue,
			'sortVisibleTag': sortVisibleVue,
			'mergeVisibleTag': mergeVisibleVue,
			'userVisibleTag': userVisibleVue
		},
		provide() {
			return {
				findByPage: this.findByPage
			}
		},
		methods: {

			handleCommand(command) {
				if(command == 'new') {
					this.showSaveChild(this.currRow)
				} else if(command == 'edit') {
					this.showedit(this.currRow)
				} else if(command == 'delete') {
					this.doDelete(this.currRow)
				} else if(command == 'move') {
					this.showMove(this.currRow)
				} else if(command == 'merge') {
					this.showMerge(this.currRow)
				} else if(command == 'sort') {
					this.showSort(this.currRow)
				}
			},
			handleChange(command) {
				this.currRow = command
			},
			gotoUserPage(row) {
				this.frow.deptCode = row.deptCode
				this.userVisible = true
			},
			getRowKeys(row) {
				if(this.firstLine) {

				} else {
          if(row.children&&row.children.length>0){
            this.firstLine = row;
          }
				}
				return row.id;
			},
			showsave() {
				this.saveVisible = true;
			},
			showedit(row) {
				this.frow = row;
				if(row.deptCode.length == 3) {
					this.edit1Visible = true;
				} else {
					this.editVisible = true;
				}

			},
			showSaveChild(row) {
				this.frow = row;
				this.saveCVisible = true;
			},
			showMove(row) {
				this.frow = row;
				this.moveVisible = true;
			},
			showMerge(row) {
				this.frow = row;
				this.mergeVisible = true;
			},
			showSort(row) {
				this.frow = row;
				this.sortVisible = true;
			},
			handleConnectionSearch() {
				//              alert(3);
				this.$refs.topicTable.toggleRowExpansion(this.firstLine, true) // 点击button展开
			},
			findByPage() {
				if(this.query.deptStatus == null) {
					this.query.deptStatus = "";
				}
				let param = "size=" + this.pageConf.pageSize + "&current=" + this.pageConf.pageCode +
					"&deptName=" + this.query.deptName + "&deptCode=" + this.query.deptCode + "&isFinalProfitunit=" + this.query.isFinalProfitunit + "&deptStatus=" + this.query.deptStatus;
				this.$axios.get('/hrs/dept/treeinfo?' + param)
					.then(function(response) {
						this.data1 = response.data.data;
					}.bind(this));
			},
			expandAll() {
				const els = this.$el.getElementsByClassName('el-icon-arrow-right')
				for(let i = 0; i < els.length; i++) {
					els[i].click()
				}
			},
			doDelete(row) {
				this.$confirm('你确定要删除吗?', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning',
					center: true
				}).then(() => {
					let params = '{"deptCode":' + row.deptCode + ',"isFinalProfitunit":' + row.isFinalProfitunit + ',"deptName":"' + row.deptName + '"}';
					this.$axios.post2('/hrs/dept/deleteById', params)
						.then(function(response) {
							if(response.data.code == 0) {
								this.openSuccess();
								this.findByPage();
							} else {
								this.openError(response.data.messageInfo);
							}
						}.bind(this));
				}).catch(() => {
					// this.$message({
					//   type: 'info',
					//   message: '已取消'
					// });
				});
			},
			doStop(row) {
				let params = '{"deptCode":' + row.deptCode + ',"isFinalProfitunit":' + row.isFinalProfitunit + '}';
				this.$axios.post2('/hrs/dept/stopById', params)
					.then(function(response) {
						if(response.data.code == 0) {
							this.openSuccess();
							this.findByPage();
						} else {
							this.openError(response.data.messageInfo);
						}
					}.bind(this));
			},
			doStart(row) {
				let params = '{"deptCode":' + row.deptCode + ',"budgetHc":' + row.budgetHc + ',"isFinalProfitunit":' + row.isFinalProfitunit + '}';
				this.$axios.post2('/hrs/dept/startById', params)
					.then(function(response) {
						if(response.data.code == 0) {
							this.openSuccess();
							this.findByPage();
						} else {
							this.openError(response.data.messageInfo);
						}
					}.bind(this));
			},
			exportExcel() {
				let params = {
					"deptStatus": this.query.deptStatus
				}
				this.$axios.post3('/hrs/dept/exportExcel', params)
					.then(function(response) {
						var blob = new Blob([response.data], {
							type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8'
						});
						var downloadElement = document.createElement('a');
						var href = window.URL.createObjectURL(blob); // 创建下载的链接
						downloadElement.href = href;
						downloadElement.download = '部门列表' + '.xls'; // 下载后文件名
						document.body.appendChild(downloadElement);
						downloadElement.click(); // 点击下载
						document.body.removeChild(downloadElement); // 下载完成移除元素
						window.URL.revokeObjectURL(href); // 释放掉blob对象
					}.bind(this));

			},
			openSuccess() {
				this.$notify({
					title: '',
					message: '操作成功',
					type: 'success',
					position: 'bottom-right'
				});
			},
			openError(info) {
				this.$notify({
					title: '',
					message: '操作失败，' + info,
					type: 'error',
					position: 'bottom-right'
				});
			},
			//pageSize改变时触发的函数
			handleSizeChange() {
				this.findByPage();
			},
			//当前页改变时触发的函数
			handleCurrentChange() {
				this.findByPage();
			},
			load2(tree, treeNode, resolve) {
				//            alert(2);
			},
			expandSelect(row, expandedRows) {
				//            alert("expandSelect");
			},
			load(tree, treeNode, resolve) {

				// console.log(tree);
				this.loading = true;
				if(this.query.deptStatus == null) {
					this.query.deptStatus = "";
				}
				let param = "deptName=" + this.query.deptName + "&deptCode=" + tree.deptCode + "&isFinalProfitunit=" + this.query.isFinalProfitunit + "&deptStatus=" + this.query.deptStatus;
				this.$axios.get('/hrs/dept/listc?' + param)
					.then(function(response) {
						this.loading = true;
						let datachild = response.data.data;
						// this.pageConf.totalPage=response.data.data.totalNum;
						if(datachild.length > 0) {
							setTimeout(() => {
								resolve(datachild)
							}, 1000)
						} else {
							this.$message({
								message: '该客商资料没有子公司',
								type: 'warning',
								duration: 1000
							});
						}
					}.bind(this));

			},
			formatDeptStatus(row, column) {
				return row.deptStatus == true ? "生效" : row.deptStatus == false ? "失效" : "";
			},
			formater1(row, column) {
				return row.isProfitunit == true ? "是" : row.isProfitunit == false ? "否" : "";
			},
			formatFullName(row, column) {
				if(row.deptCode == 111) {
					return "";
				} else {
					return row.fullName;
				}

			},
			formater2(row, column) {
				return row.isFinalProfitunit == true ? "是" : row.isFinalProfitunit == false ? "否" : "";
			}
		},
		created() {
			let buttonInfo = window.localStorage.getItem('buttonInfo')
			if(buttonInfo.indexOf('sys_dept_add') > -1) {
				this.newButtonFlag = true;
			}
			if(buttonInfo.indexOf('sys_dept_edit') > -1) {
				this.editButtonFlag = true;
			}
			if(buttonInfo.indexOf('sys_dept_del') > -1) {
				this.deleteButtonFlag = true;
			}
			if(buttonInfo.indexOf('sys_dept_move') > -1) {
				this.moveButtonFlag = true;
			}
			if(buttonInfo.indexOf('sys_dept_merge') > -1) {
				this.mergeButtonFlag = true;
			}
			if(buttonInfo.indexOf('sys_dept_sort') > -1) {
				this.sortButtonFlag = true;
			}
			this.query.deptStatus = true;
			this.findByPage();
		}
	}
</script>
