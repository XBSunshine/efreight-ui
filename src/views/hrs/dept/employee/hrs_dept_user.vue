<template>
	<el-dialog title="部门管理——人员" top="5vh" width="99%" :visible.sync="visible" :close-on-press-escape="false" :close-on-click-modal="false" :before-close="handleClose">
		<el-col class="toolbar" style="padding-bottom: 0;">
				<el-form :inline="false" :model="query" class="demo-ruleForm">
					<el-row>
						<el-col class="elementWidth">
							<el-form-item label="姓名" label-width="85px">
								<el-input style="width: 135px;" v-model="query.userName" auto-complete="off" clearable>
								</el-input>
							</el-form-item>
						</el-col>
						<el-col class="elementWidth">
							<el-form-item label="邮箱" label-width="85px">
								<el-input style="width: 135px;" v-model="query.userEmail" auto-complete="off" clearable>
								</el-input>
							</el-form-item>
						</el-col>
						<el-col class="elementWidth">
							<el-form-item label="手机" label-width="85px">
								<el-input style="width: 135px;" v-model="query.phoneNumber" auto-complete="off" clearable>
								</el-input>
							</el-form-item>
						</el-col>
            <el-col class="elementWidth">
              <el-form-item style="margin-left: 41px;">
                <el-button type="text" size="medium" v-if=showFlag v-on:click="showFlag=false">收起</el-button>
                <el-button type="text" size="medium" v-if=!showFlag v-on:click="showFlag=true">展开</el-button>
                <el-button type="primary" size="small" v-on:click="findByPage">查询</el-button>
                <el-button type="primary" size="small" v-on:click="exportExcel" v-if="exportExcelButtonFlag">导出</el-button>
                <el-button type="primary" size="small" v-on:click="showsave" v-if="showsaveButtonFlag">新增</el-button>
              </el-form-item>
            </el-col>
					</el-row>
					<el-row v-show=showFlag>
						<!--<el-col class="elementWidth">
							<el-form-item label="是否生效" label-width="85px">
								<el-select style="width: 90px;" v-model="query.userStatus" clearable placeholder="">
									<el-option label="是" :value="true"></el-option>
									<el-option label="否" :value="false"></el-option>
								</el-select>
							</el-form-item>
						</el-col>-->
						<el-col class="elementWidth">
							<el-form-item label="是否黑名单" label-width="85px">
								<el-select style="width: 90px;" v-model="query.ifBlack" clearable placeholder="">
									<el-option label="是" :value="true"></el-option>
									<el-option label="否" :value="false"></el-option>
								</el-select>
							</el-form-item>
						</el-col>
						<el-col class="elementWidth">
							<el-form-item label="是否离职" label-width="130px">
								<el-select style="width: 90px;" v-model="query.ifLeave" clearable placeholder="">
									<el-option label="是" :value="true"></el-option>
									<el-option label="否" :value="false"></el-option>
								</el-select>
							</el-form-item>
						</el-col>
						<el-col class="elementWidth">
							<el-form-item label="劳务类型" prop="employmentType" label-width="130px">
								<el-select style="width: 90px;" v-model="query.employmentType" clearable placeholder="">
									<el-option label="全职" value="全职"></el-option>
									<el-option label="兼职" value="兼职"></el-option>
									<el-option label="外包" value="外包"></el-option>
									<el-option label="实习" value="实习"></el-option>
								</el-select>
							</el-form-item>
						</el-col>
					</el-row>
					<el-row v-show=showFlag>
						<el-col :span="cssSpan" class="elementWidth">
							<el-form-item label="出生日期" label-width="85px">
								<el-date-picker style="width: 133px;" v-model="query.userBirthdayStart" type="date" value-format="yyyy-MM-dd 00:00:00" placeholder="选择日期">
								</el-date-picker>
								<span>-</span>
								<el-date-picker style="width: 133px;" v-model="query.userBirthdayEnd" type="date" value-format="yyyy-MM-dd 23:59:59" placeholder="选择日期">
								</el-date-picker>
							</el-form-item>
						</el-col>
						<el-col :span="cssSpan" class="elementWidth">
							<el-form-item label="入职日期" label-width="85px">
								<el-date-picker style="width: 133px;" v-model="query.hireDateStart" type="date" value-format="yyyy-MM-dd 00:00:00" placeholder="选择日期">
								</el-date-picker>
								<span>-</span>
								<el-date-picker style="width: 133px;" v-model="query.hireDateEnd" type="date" value-format="yyyy-MM-dd 23:59:59" placeholder="选择日期">
								</el-date-picker>
							</el-form-item>
						</el-col>
						<el-col :span="cssSpan" class="elementWidth">
							<el-form-item label="离职日期" label-width="85px">
								<el-date-picker style="width: 133px;" v-model="query.leaveDateStart" type="date" value-format="yyyy-MM-dd 00:00:00" placeholder="选择日期">
								</el-date-picker>
								<span>-</span>
								<el-date-picker style="width: 133px;" v-model="query.leaveDateEnd" type="date" value-format="yyyy-MM-dd 23:59:59" placeholder="选择日期">
								</el-date-picker>
							</el-form-item>
						</el-col>
          </el-row>
          <el-row v-show=showFlag>
						<el-col :span="cssSpan" class="elementWidth">
							<el-form-item label="黑名单日期" label-width="85px">
								<el-date-picker style="width: 133px;" v-model="query.blacklistDateStart" type="date" value-format="yyyy-MM-dd 00:00:00" placeholder="选择日期">
								</el-date-picker>
								<span>-</span>
								<el-date-picker style="width: 133px;" v-model="query.blacklistDateEnd" type="date" value-format="yyyy-MM-dd 23:59:59" placeholder="选择日期">
								</el-date-picker>
							</el-form-item>
						</el-col>
						<el-col :span="cssSpan" class="elementWidth">
							<el-form-item label="修改时间" label-width="85px">
								<el-date-picker style="width: 133px;" v-model="query.editTimeStart" type="date" value-format="yyyy-MM-dd 00:00:00" placeholder="选择日期">
								</el-date-picker>
								<span>-</span>
								<el-date-picker style="width: 133px;" v-model="query.editTimeEnd" type="date" value-format="yyyy-MM-dd 23:59:59" placeholder="选择日期">
								</el-date-picker>
							</el-form-item>
						</el-col>
					</el-row>
				</el-form>
			</el-col>
			<el-table v-loading="loading" height="540" :data="data1" border>
				<el-table-column label="操作" align="center" width="50" :fixed="fixed">
					<template slot-scope="scope">
						<el-dropdown trigger="click" @command="handleCommand" @visible-change="handleChange(scope.row)">
							<i class="el-icon-s-operation"></i>
							<el-dropdown-menu slot="dropdown">
								<el-dropdown-item></el-dropdown-item>
								<el-dropdown-item command="edit" v-if="editButtonFlag">编辑</el-dropdown-item>
								<el-dropdown-item command="leave" :disabled="scope.row.leaveDate!=null" v-if="leaveButtonFlag">离职</el-dropdown-item>
								<el-dropdown-item command="resume" :disabled="scope.row.leaveDate==null" v-if="resumeButtonFlag">复职</el-dropdown-item>
								<el-dropdown-item command="black" v-if="blackButtonFlag">黑名单</el-dropdown-item>
								<!--<el-dropdown-item command="dept" :disabled="scope.row.leaveDate!=null" v-if="deptButtonFlag">兼职</el-dropdown-item>-->
								<!--<el-dropdown-item command="delete">删除</el-dropdown-item>-->
								<el-dropdown-item divided command="resetPass" v-if="resetPassButtonFlag">重置密码</el-dropdown-item>
							</el-dropdown-menu>
						</el-dropdown>
					</template>
				</el-table-column>
				<!--<el-table-column align="center" label="工号" width="150" :fixed="fixed">
					<template slot-scope="scope">
						<span v-if="scope.row.leaveDate!=null&&scope.row.blacklistDate==null"><s>{{scope.row.jobNumber}}</s></span>
						<span style="color: red;" v-if="scope.row.blacklistDate!=null">{{scope.row.jobNumber}}</span>
						<span v-if="scope.row.leaveDate==null&&scope.row.blacklistDate==null">{{scope.row.jobNumber}}</span>
					</template>
				</el-table-column>-->
				<el-table-column align="center" label="姓名" width="100" :fixed="fixed">
					<template slot-scope="scope">
						<span v-if="scope.row.leaveDate!=null&&scope.row.blacklistDate==null"><s>{{scope.row.userName}}</s></span>
						<span style="color: red;" v-if="scope.row.blacklistDate!=null">{{scope.row.userName}}</span>
						<span v-if="scope.row.leaveDate==null&&scope.row.blacklistDate==null">{{scope.row.userName}}</span>
					</template>
				</el-table-column>
				<!--<el-table-column align="center" label="是否生效" width="100">
					<template slot-scope="scope">
						<i class="iconfont el-icon-myduihao" style="color: red;" v-show="scope.row.userStatus=='1'"></i>
					</template>
				</el-table-column>-->
				<el-table-column align="center" label="英文名" width="100">
					<template slot-scope="scope">
						<span v-if="scope.row.leaveDate!=null&&scope.row.blacklistDate==null"><s>{{scope.row.userEname}}</s></span>
						<span style="color: red;" v-if="scope.row.blacklistDate!=null">{{scope.row.userEname}}</span>
						<span v-if="scope.row.leaveDate==null&&scope.row.blacklistDate==null">{{scope.row.userEname}}</span>
					</template>
				</el-table-column>
				<el-table-column align="center" label="邮箱" width="200">
					<template slot-scope="scope">
						<span v-if="scope.row.leaveDate!=null&&scope.row.blacklistDate==null"><s>{{scope.row.userEmail}}</s></span>
						<span style="color: red;" v-if="scope.row.blacklistDate!=null">{{scope.row.userEmail}}</span>
						<span v-if="scope.row.leaveDate==null&&scope.row.blacklistDate==null">{{scope.row.userEmail}}</span>
					</template>
				</el-table-column>
				<el-table-column align="center" label="电话" width="120">
					<template slot-scope="scope">
						<span v-if="scope.row.leaveDate!=null&&scope.row.blacklistDate==null"><s>{{scope.row.phoneNumber}}</s></span>
						<span style="color: red;" v-if="scope.row.blacklistDate!=null">{{scope.row.phoneNumber}}</span>
						<span v-if="scope.row.leaveDate==null&&scope.row.blacklistDate==null">{{scope.row.phoneNumber}}</span>
					</template>
				</el-table-column>
				<el-table-column align="left" label="部门" width="450">
					<template slot-scope="scope">
						<span v-if="scope.row.leaveDate!=null&&scope.row.blacklistDate==null"><s>{{scope.row.deptName}}</s></span>
						<span style="color: red;" v-if="scope.row.blacklistDate!=null">{{scope.row.deptName}}</span>
						<span v-if="scope.row.leaveDate==null&&scope.row.blacklistDate==null">{{scope.row.deptName}}</span>
					</template>
				</el-table-column>
				<el-table-column align="left" label="岗位" width="255">
					<template slot-scope="scope">
						<span v-if="scope.row.leaveDate!=null&&scope.row.blacklistDate==null"><s>{{scope.row.jobPosition}}</s></span>
						<span style="color: red;" v-if="scope.row.blacklistDate!=null">{{scope.row.jobPosition}}</span>
						<span v-if="scope.row.leaveDate==null&&scope.row.blacklistDate==null">{{scope.row.jobPosition}}</span>
					</template>
				</el-table-column>
				<el-table-column align="left" label="角色" >
					<template slot-scope="scope">
						<span v-if="scope.row.leaveDate!=null&&scope.row.blacklistDate==null"><s>{{scope.row.roleName}}</s></span>
						<span style="color: red;" v-if="scope.row.blacklistDate!=null">{{scope.row.roleName}}</span>
						<span v-if="scope.row.leaveDate==null&&scope.row.blacklistDate==null">{{scope.row.roleName}}</span>
					</template>
				</el-table-column>
				<!--<el-table-column prop="userBirthday" label="出生日期" :formatter="formatDate"></el-table-column>
				<el-table-column prop="hireDate" label="入职日期" :formatter="formatDate"></el-table-column>
				<el-table-column prop="employmentType" label="劳务类型"></el-table-column>
				<el-table-column prop="leaveDate" label="离职日期" :formatter="formatDate"></el-table-column>
				<el-table-column prop="blacklistDate" label="黑名单日期" :formatter="formatDate"></el-table-column>
				<el-table-column prop="editTime" label="修改时间"></el-table-column>
				<el-table-column prop="userStatus" label="是否生效" :formatter="formatStatus"></el-table-column>-->
			</el-table>
			<div class="pagination">
				<el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="pageConf.pageCode" :page-sizes="pageConf.pageOption" :page-size.sync="pageConf.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="pageConf.totalPage">
				</el-pagination>
			</div>
		</el-row>
		<saveVisibleTag ref="addMission" v-if="saveVisible" :visible.sync="saveVisible"></saveVisibleTag>
		<editVisibleTag ref="addMission" v-if="editVisible" :visible.sync="editVisible" :frow="ffrow"></editVisibleTag>
		<leave ref="addMission" v-if="leaveVisible" :visible.sync="leaveVisible" :frow="ffrow"></leave>
		<black ref="addMission" v-if="blackVisible" :visible.sync="blackVisible" :frow="ffrow"></black>
		<dept ref="addMission" v-if="deptVisible" :visible.sync="deptVisible" :frow="ffrow"></dept>
	</el-dialog>
</template>

<script>
	//import saveVisibleVue from './hrs_dept_user_save'
	//import editVisibleVue from './hrs_dept_user_edit'
	//import Leave from './hrs_dept_user_leave'
	//import Black from './hrs_dept_user_black'
	//import Dept from './hrs_dept_user_dept'
	import saveVisibleVue from '../../user/hrs_user_save'
	import editVisibleVue from '../../user/hrs_user_edit'
	import Leave from '../../user/hrs_user_leave'
	import Black from '../../user/hrs_user_black'
	import Dept from '../../user/hrs_user_dept'
	export default {
		props: {
			visible: {
				type: Boolean,
				default: false
			},
			frow: Object
		},
		data() {
			return {

				/*表数据*/
				data1: [],
				pageConf: {
					//设置一些初始值(会被覆盖)
					pageCode: 1, //当前页
					pageSize: 10, //每页显示的记录数
					totalPage: 0, //总记录数
					pageOption: [10, 30, 50], //分页选项
					handleCurrentChange: function() {
						console.log("页码改变了");
					}
				},
				query: {
					userName: '',
					employmentType: '',
					userEmail: '',
					phoneNumber: '',
					userBirthdayStart: '',
					userBirthdayEnd: '',
					hireDateStart: '',
					hireDateEnd: '',
					leaveDateStart: '',
					leaveDateEnd: '',
					blacklistDateStart: '',
					blacklistDateEnd: '',
					editTimeStart: '',
					editTimeEnd: '',
					editTimeEnd: '',
					deptCode: '',
					userStatus: true,
					ifBlack: false,
					ifLeave: false
				},
				saveVisible: false,
				editVisible: false,
				leaveVisible: false,
				blackVisible: false,
				deptVisible: false,
				showFlag: false,
				ffrow: {},
				currRow: '',
				loading: false,
				cssSpan: 8,
				fixed: false,
				exportExcelButtonFlag: false,
				showsaveButtonFlag: false,
				editButtonFlag: false,
				leaveButtonFlag: false,
				resumeButtonFlag: false,
				blackButtonFlag: false,
				deptButtonFlag: false,
				resetPassButtonFlag: false,
			}
		},
		created() {
			let buttonInfo = window.localStorage.getItem('buttonInfo')
			if(buttonInfo.indexOf('sys_user_export') > -1) {
				this.exportExcelButtonFlag = true;
			}
			if(buttonInfo.indexOf('sys_user_add') > -1) {
				this.showsaveButtonFlag = true;
			}
			if(buttonInfo.indexOf('sys_user_edit') > -1) {
				this.editButtonFlag = true;
			}
			if(buttonInfo.indexOf('sys_user_leave') > -1) {
				this.leaveButtonFlag = true;
			}
			if(buttonInfo.indexOf('sys_user_resume') > -1) {
				this.resumeButtonFlag = true;
			}
			if(buttonInfo.indexOf('sys_user_black') > -1) {
				this.blackButtonFlag = true;
			}
			if(buttonInfo.indexOf('sys_user_parttime') > -1) {
				this.deptButtonFlag = true;
			}
			if(buttonInfo.indexOf('sys_user_resetpass') > -1) {
				this.resetPassButtonFlag = true;
			}
			if(this.frow.deptCode) {
				this.query.deptCode = this.frow.deptCode;
			} else {
				this.query.deptCode = "";
			}
			this.query.userStatus = true;
			this.findByPage();

			this.computedSpan();
		},
		mounted() {
			let that = this;
			window.onresize = () => {
				that.computedSpan();
			}
		},
		components: {
			'saveVisibleTag': saveVisibleVue,
			'editVisibleTag': editVisibleVue,
			'black': Black,
			'leave': Leave,
			'dept': Dept,
		},
		provide() {
			return {
				findByPage: this.findByPage
			}
		},
		methods: {
			handleCommand(command) {
				if(command == 'edit') {
					this.showedit(this.currRow)
				} else if(command == 'leave') {
					this.showleave(this.currRow)
				} else if(command == 'resume') {
					this.resume(this.currRow)
				} else if(command == 'black') {
					this.showblack(this.currRow)
				} else if(command == 'dept') {
					this.showdept(this.currRow)
				} else if(command == 'delete') {
					this.doDelete(this.currRow)
				} else if(command == 'resetPass') {
					this.resetPassward(this.currRow)
				}
			},
			handleChange(command) {
				this.currRow = command
			},
			showsave() {
				this.saveVisible = true;
			},
			showedit(row) {
				this.ffrow = row;
				this.editVisible = true;
			},
			showleave(row) {
				this.ffrow = row;
				this.leaveVisible = true;
			},
			showblack(row) {
				this.ffrow = row;
				this.blackVisible = true;
			},
			showdept(row) {
				this.ffrow = row;
				this.deptVisible = true;
			},
			resume(row) {
				this.$axios.put('/hrs/user/resume/' + row.userId)
					.then(function(response) {
						if(response.data.code == 0) {
							this.openSuccess();
							this.findByPage();
						} else {
							this.openError(response.data.messageInfo);
						}
					}.bind(this)).catch(function(error) {
						if(!(error.response.status == '401' || error.response.status == '403' || error.response.status == '404' || error.response.status == '501' || error.response.status == '503' || error.response.status == '504')) {
							let errorinfo = error.response.data.messageInfo;
							this.openError(errorinfo);
						}
					}.bind(this));

			},
			findByPage() {
				this.loading = true
				this.$axios.get2("/hrs/user/getUserList?size=" + this.pageConf.pageSize + "&current=" + this.pageConf.pageCode, this.query)
					.then(function(response) {
						this.data1 = response.data.data.records;
						this.pageConf.totalPage = response.data.data.total;
						if(this.data1.length == 0) {
							let current = Math.ceil(this.pageConf.totalPage / this.pageConf.pageSize);
							this.findByPage2(current);
						} else {
							this.loading = false
						}
					}.bind(this));
			},
			findByPage2(current) {
				this.$axios.get2("/hrs/user/getUserList?size=" + this.pageConf.pageSize + "&current=" + current, this.query)
					.then(function(response) {
						this.loading = false
						this.data1 = response.data.data.records;
						this.pageConf.totalPage = response.data.data.total;
					}.bind(this));
			},
			doDelete(row) {
				this.$confirm('此操作将永久删除,不可恢复, 是否继续?', '注意', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning',
					center: true
				}).then(() => {
					this.$axios.deletes('/hrs/user/' + row.userId)
						.then(function(response) {
							if(response.data.code == 0) {
								this.openSuccess();
								this.findByPage();
							} else {
								this.openError(response.data.messageInfo);
							}
						}.bind(this));
				}).catch(() => {
					this.$message({
						type: 'info',
						message: '已取消删除'
					});
				});

			},
			exportExcel() {

				this.$axios.post3('/hrs/user/exportExcel', this.query)
					.then(function(response) {
						var blob = new Blob([response.data], {
							type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8'
						});
						var downloadElement = document.createElement('a');
						var href = window.URL.createObjectURL(blob); // 创建下载的链接
						downloadElement.href = href;
						downloadElement.download = '用户列表' + '.xls'; // 下载后文件名
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
			formatStatus(row, column) {
				return row.userStatus == true ? "生效" : row.userStatus == false ? "失效" : "";
			},
			formatIsFinalProfitunit(row, column) {
				return row.isFinalProfitunit == true ? "是" : row.isFinalProfitunit == false ? "否" : "";
			},
			formatDate(row, column) {
				if(row[column.property]) {
					return(row[column.property]).substr(0, 10)
				} else {
					return ""
				}

			},
			resetPassward(row) {
				this.$confirm('你确定要重置密码么, 是否继续?', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning',
					center: true
				}).then(() => {
					this.$axios.put('/hrs/user/resetPassward/' + row.userId).then((response) => {
						if(response.status = '200') {
							this.$notify({
								title: '成功',
								message: '重置成功,请查看您的邮件',
								type: 'success'
							});
						} else {
							this.$notify({
								title: '失败',
								message: '重置失败,原因：' + response.data.data.messageInfo,
								type: 'error'
							});
						}
					}).catch((error) => {
						if(!(error.response.status == '401' || error.response.status == '403' || error.response.status == '404' || error.response.status == '501' || error.response.status == '503' || error.response.status == '504')) {
							this.$notify.error({
								title: '错误',
								message: error.response.data.messageInfo
							});
						}
					});
				}).catch(() => {
					this.$message({
						type: 'info',
						message: '已取消'
					});
				});
			},
			computedSpan() {
				this.cssSpan = window.screen.width == 1360 ? 9 : 8;
				this.fixed = window.screen.width == 1360 ? true : false;
			},
			// 关闭
			handleClose() {
				this.$emit('update:visible', false);
			}
		},

	}
</script>