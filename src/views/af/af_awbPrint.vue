<template>
	<div class="warp-main">
		<el-form :inline="false" :model="query" label-width="80px" class="demo-ruleForm">
			<!--<el-row style="margin:10px 10px 10px 10px;">
				<el-col class="elementWidth" style="font-size: large;">单证制作</el-col>
			</el-row>-->
			<el-row>
				<el-col class="elementWidth">
					<el-form-item label="主运单号">
						<el-input v-model="query.awbNumber" clearable auto-complete="off" style="width: 140px;">
						</el-input>
					</el-form-item>
				</el-col>
				<el-col class="elementWidth">
					<el-form-item label="航班号">
						<el-input v-model="query.flightNumber" clearable auto-complete="off" style="width: 120px;">
						</el-input>
					</el-form-item>
				</el-col>
				<el-col class="elementWidth">
					<el-form-item label="始发港">
						<el-input v-model="query.departureStation" @input="query.departureStation = query.departureStation.toUpperCase()" clearable auto-complete="off" style="width: 80px;">
						</el-input>
					</el-form-item>
				</el-col>
				<el-col class="elementWidth">
					<el-form-item label="目的港" label-width="70px">
						<el-input v-model="query.arrivalStation" @input="query.arrivalStation = query.arrivalStation.toUpperCase()" clearable auto-complete="off" style="width: 80px;">
						</el-input>
					</el-form-item>
				</el-col>
				<el-col class="elementWidth">
					<el-form-item label-width="20px">
						<el-button type="text" size="mini" v-if=showFlag v-on:click="showFlag=false">收起</el-button>
						<el-button type="text" size="mini" v-if=!showFlag v-on:click="showFlag=true">展开</el-button>
						<el-button type="primary" size="small" icon="el-icon-search" @click="queryList">搜索</el-button>
					</el-form-item>
				</el-col>
			</el-row>
			<el-row v-show="showFlag">
				<el-col class="elementWidth">
					<el-form-item label="制单状态">
						<el-select v-model="query.awbStatus" placeholder="请选择" style="width: 140px;">
							<el-option v-for="(awbStatus,index) in awbStatuses" :key="index" :label="awbStatus.paramText" :value="awbStatus.paramText"></el-option>
						</el-select>
					</el-form-item>
				</el-col>
				<el-col class="elementWidth">
					<el-form-item label="运单所属">
						<el-select v-model="query.awbFromType" clearable placeholder="请选择" style="width: 120px;">
							<el-option v-for="(awbFromType,index) in awbFromTypes" :key="index" :label="awbFromType.paramText" :value="awbFromType.paramText"></el-option>
						</el-select>
					</el-form-item>
				</el-col>
				<el-col class="elementWidth">
					<el-form-item label="航班日期">
						<el-date-picker style="width: 140px;" v-model="query.flightDateStart" type="date" value-format="yyyy-MM-dd" placeholder="开始日期">
						</el-date-picker>
						<span>-</span>
						<el-date-picker style="width: 140px;" v-model="query.flightDateEnd" type="date" value-format="yyyy-MM-dd" placeholder="结束日期">
						</el-date-picker>
					</el-form-item>
				</el-col>
			</el-row>
		</el-form>
		<!--<el-table :data="data" v-loading="loading">-->
		<el-table v-loading="loading" :indent="30" row-key="awbPrintId" :tree-props="{children: 'hawbs', hasChildren: true}" stripe :data="data" border>
			<el-table-column fixed type="index" align="center" label="操作" width="60">
				<template slot-scope="scope">
					<el-dropdown trigger="click" @command="handleCommand" @visible-change="handleChange(scope.row)">
						<i class="el-icon-s-operation"></i>
						<el-dropdown-menu slot="dropdown">
							<el-dropdown-item command="saveMawb" v-if="saveMawbFlag&&(scope.row.awbStatus=='待制单'&&scope.row.awbType==0)">制主单</el-dropdown-item>
							<el-dropdown-item command="saveHawb" v-if="saveHawbFlag&&(scope.row.awbStatus!='待制单'&&scope.row.awbType==0)">制分单</el-dropdown-item>
							<el-dropdown-item command="editMawb" v-if="editMawbFlag&&(scope.row.awbStatus=='已暂存'&&scope.row.awbType==0)">编辑</el-dropdown-item>
							<el-dropdown-item command="editHawb" v-if="editHawbFlag&&(scope.row.awbStatus=='已暂存'&&scope.row.awbType==1)">编辑</el-dropdown-item>
							<el-dropdown-item command="viewMawb" v-if="scope.row.awbStatus!='待制单'&&scope.row.awbType==0">查看</el-dropdown-item>
							<el-dropdown-item command="viewHawb" v-if="scope.row.awbStatus!='待制单'&&scope.row.awbType==1">查看</el-dropdown-item>
							<el-dropdown-item command="printMawbG" v-if="scope.row.awbStatus!='待制单'&&scope.row.awbType==0">格打</el-dropdown-item>
							<el-dropdown-item command="printMawbT" v-if="scope.row.awbStatus!='待制单'&&scope.row.awbType==0">套打</el-dropdown-item>
							<el-dropdown-item command="printHawbG" v-if="scope.row.awbStatus!='待制单'&&scope.row.awbType==1">格打</el-dropdown-item>
							<el-dropdown-item command="printHawbT" v-if="scope.row.awbStatus!='待制单'&&scope.row.awbType==1">套打</el-dropdown-item>
							<el-dropdown-item command="deleteMawb" v-if="scope.row.awbStatus=='已暂存'&&scope.row.awbType==0">删除</el-dropdown-item>
							<el-dropdown-item></el-dropdown-item>
						</el-dropdown-menu>
					</el-dropdown>
				</template>
			</el-table-column>
			<el-table-column fixed header-align="center" prop="hawbNumber" width="250" label="主单号/分单号"></el-table-column>
			<el-table-column align="center" prop="awbStatus" label="制单状态"></el-table-column>
			<el-table-column align="center" prop="departureStation" label="始发港"></el-table-column>
			<el-table-column align="center" prop="arrivalStation" label="目的港"></el-table-column>
			<el-table-column align="center" prop="flightNumber" label="航班号" width="120"></el-table-column>
			<el-table-column align="center" prop="flightDate" width="120" label="航班日期"></el-table-column>
			<el-table-column align="center" prop="awbPieces" label="件数"></el-table-column>
			<el-table-column align="center" prop="awbGrossWeight" label="毛重" :formatter="floatMountFormat"></el-table-column>
			<el-table-column align="center" prop="awbVolume" label="体积" :formatter="floatMountFormat"></el-table-column>
			<el-table-column align="center" prop="awbChargeWeight" label="计重" :formatter="floatMountFormat"></el-table-column>
			<el-table-column align="center" prop="createTime" label="制单时间" width="200"></el-table-column>
		</el-table>
		<div>
			<el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="pageConf.pageCode" :page-sizes="pageConf.pageOption" :page-size.sync="pageConf.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="pageConf.totalPage">
			</el-pagination>
		</div>
		<saveMawb ref="addMission" v-if="saveMawbVisible" :visible.sync="saveMawbVisible" :frow="frow">
		</saveMawb>
		<saveHawb ref="addMission" v-if="saveHawbVisible" :visible.sync="saveHawbVisible" :frow="frow">
		</saveHawb>
		<editMawb ref="addMission" v-if="editMawbVisible" :visible.sync="editMawbVisible" :frow="frow">
		</editMawb>
		<editHawb ref="addMission" v-if="editHawbVisible" :visible.sync="editHawbVisible" :frow="frow">
		</editHawb>
		<viewDetailMawb ref="addMission" v-if="viewMawbVisible" :visible.sync="viewMawbVisible" :frow="frow">
		</viewDetailMawb>
		<viewDetailHawb ref="addMission" v-if="viewHawbVisible" :visible.sync="viewHawbVisible" :frow="frow">
		</viewDetailHawb>
	</div>
</template>
<script>
	import editMawb from './awbPrint/af_mawbPrint_edit'
	import saveMawb from './awbPrint/af_mawbPrint_save'
	import viewDetailMawb from './awbPrint/af_mawbPrint_view'
	import editHawb from './awbPrint/af_hawbPrint_edit'
	import saveHawb from './awbPrint/af_hawbPrint_save'
	import viewDetailHawb from './awbPrint/af_hawbPrint_view'
	import laydate from "../../../static/laydate/laydate.js"
	export default {
		data() {
			return {
				saveMawbFlag: false,
				saveHawbFlag: false,
				editMawbFlag: false,
				editHawbFlag: false,
				loading: false,
				showFlag: false,
				data: [],
				pageConf: {
					//设置一些初始值(会被覆盖)
					pageCode: 1, //当前页
					pageSize: 10, //每页显示的记录数
					totalPage: 0, //总记录数
					pageOption: [10, 50, 100]
				},
				saveMawbVisible: false,
				saveHawbVisible: false,
				editMawbVisible: false,
				editHawbVisible: false,
				viewMawbVisible: false,
				viewHawbVisible: false,
				frow: {},
				awbStatuses: [],
				awbFromTypes: [],
				query: {
					awbNumber: '',
					orderCode: '',
					departureStation: '',
					arrivalStation: '',
					flightNumber: '',
					awbStatus: '全部',
					nationCode: ''
				},
				currRow: ''
			}
		},
		created: function() {
			//查询制单状态
			this.$axios.get2('/afbase/category/params', {
				categoryName: "制单状态"
			}).then(function(response) {
				this.awbStatuses = response.data.data;
			}.bind(this)).catch(function(error) {
				console.log(error);
			})

			//查询运单所属
			this.$axios.get2('/afbase/category/params', {
				categoryName: "运单所属"
			}).then(function(response) {
				this.awbFromTypes = response.data.data;
			}.bind(this)).catch(function(error) {
				console.log(error);
			})

			let buttonInfo = window.localStorage.getItem('buttonInfo')
			if(buttonInfo.indexOf('af_button_awbPrint_saveMawb') > -1) {
				this.saveMawbFlag = true;
			}
			if(buttonInfo.indexOf('af_button_awbPrint_saveHawb') > -1) {
				this.saveHawbFlag = true;
			}
			if(buttonInfo.indexOf('af_button_awbPrint_editMawb') > -1) {
				this.editMawbFlag = true;
			}
			if(buttonInfo.indexOf('af_button_awbPrint_editHawb') > -1) {
				this.editHawbFlag = true;
			}
		},
		provide() {
			return {
				queryList: this.queryList,
				saveToEdit: this.saveToEdit,
				editToView: this.editToView
			}
		},
		components: {
			'saveMawb': saveMawb,
			'editMawb': editMawb,
			'viewDetailMawb': viewDetailMawb,
			'saveHawb': saveHawb,
			'editHawb': editHawb,
			'viewDetailHawb': viewDetailHawb
		},
		methods: {
			handleCommand(command) {
				if(command == 'editMawb') {
					this.showedit(this.currRow, "mawb")
				} else if(command == 'editHawb') {
					this.showedit(this.currRow, "hawb")
				} else if(command == 'viewMawb') {
					this.showDetail(this.currRow, "mawb")
				} else if(command == 'viewHawb') {
					this.showDetail(this.currRow, "hawb")
				} else if(command == 'saveMawb') {
					this.showsave(this.currRow, "mawb")
				} else if(command == 'saveHawb') {
					this.showsave(this.currRow, "hawb")
				} else if(command == 'printMawbG') {
					this.printMawb(this.currRow, "g")
				} else if(command == 'printMawbT') {
					this.printMawb(this.currRow, "t")
				} else if(command == 'printHawbG') {
					this.printHawb(this.currRow, "g")
				} else if(command == 'printHawbT') {
					this.printHawb(this.currRow, "t")
				} else if(command == 'deleteMawb') {
					this.delete(this.currRow, "mawb")
				} else if(command == 'deleteHawb') {
					this.delete(this.currRow, "hawb")
				}

			},
			handleChange(command) {
				this.currRow = command
				this.currRow.laydate = laydate
			},
			showsave(row, type) {
				this.frow = row;
				if(type == "mawb") {
					this.saveMawbVisible = true;
				} else if(type == "hawb") {
					this.saveHawbVisible = true;
				}
			},
			showedit(row, type) {
				this.frow = row;
				if(type == "mawb") {
					this.editMawbVisible = true;
				} else if(type == "hawb") {
					this.editHawbVisible = true;
				}
			},
			showDetail(row, type) {
				this.frow = row;
				if(type == "mawb") {
					this.viewMawbVisible = true;
				} else if(type == "hawb") {
					this.viewHawbVisible = true;
				}
			},
			saveToEdit(row, type) {
				if(type == "mawb") {
					this.saveMawbVisible = false;
				} else if(type == "hawb") {
					this.saveHawbVisible = false;
				}
				this.showedit(row, type)
			},
			editToView(row, type) {
				if(type == "mawb") {
					this.editMawbVisible = false;
				} else if(type == "hawb") {
					this.editHawbVisible = false;
				}
				this.showDetail(row, type)
			},
			openError(info) {
				this.$notify({
					title: '',
					message: info,
					type: 'error',
					position: 'bottom-right'
				});
			},
			openSuccess(info) {
				this.$notify({
					title: '',
					message: info,
					type: 'success',
					position: 'bottom-right'
				});
			},
			printMawb(row, flag) {
				let printType = ''
				if(flag == 't') {
					printType = 1
				} else if(flag == 'g') {
					printType = 2
				}
				this.$axios.post2('/afbase/awbPrint/downloadAWB', {
						awbPrintType: 'PRINT_MAWB',
						awbUuid: row.awbUuid,
						printType: printType
					})
					.then(function(response) {
						window.open(response.data.data)
					}.bind(this)).catch(function(error) {
						let errorinfo = error.response.data.messageInfo;
						this.openError(errorinfo)
					}.bind(this));
			},
			printHawb(row, flag) {
				let printType = ''
				if(flag == 't') {
					printType = 1
				} else if(flag == 'g') {
					printType = 2
				}
				this.$axios.post2('/afbase/awbPrint/downloadHAWB', {
						awbPrintType: 'PRINT_HAWB',
						awbUuid: row.awbUuid,
						awbPrintId: row.awbPrintId,
						printType: printType
					})
					.then(function(response) {
						window.open(response.data.data)
					}.bind(this)).catch(function(error) {
						let errorinfo = error.response.data.messageInfo;
						this.openError(errorinfo)
					}.bind(this));
			},
			delete(row, type) {
				let typeName = ""
				let printId = ""
				if(type == 'mawb') {
					typeName = '主单'
					printId = row.awbPrintIdCopy
				} else if(type == 'hawb') {
					typeName = '分单'
					printId = row.awbPrintId
				}
				this.$confirm('您将删除' + typeName + ' ' + row.hawbNumber + ', 是否继续?', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning',
					center: true
				}).then(() => {
					this.$axios.deletes('/afbase/awbPrint/' + printId).then((response) => {
						if(response.data.code == '0') {
							this.openSuccess("删除成功！")
							this.queryList();
						} else {
							this.openError("作废失败：" + response.data.data.messageInfo)
						}
					}).catch((error) => {
						this.openError("作废失败：" + error.response.data.messageInfo)
					});
				}).catch(() => {
					this.$message({
						type: 'info',
						message: '已取消删除'
					});
				});

			},
			queryList() {
				//				if(this.query.departureStation == null || this.query.departureStation == '') {
				//					this.openError("请录入始发港")
				//					return
				//				}
				this.loading = true
				this.$axios.get2('/afbase/awbPrint?size=' + this.pageConf.pageSize + '&current=' + this.pageConf.pageCode, this.query).then((response) => {
					this.data = response.data.data.records;
					this.pageConf.totalPage = response.data.data.total;
					if(this.data.length == 0) {
						let current = Math.ceil(this.pageConf.totalPage / this.pageConf.pageSize);
						this.queryList2(current);
					} else {
						this.loading = false
					}
				}).catch((error) => {
					this.loading = false
					console.log(error);
				});
			},
			queryList2(current) {
				this.$axios.get2('/afbase/awbPrint?size=' + this.pageConf.pageSize + '&current=' + current, this.query).then((response) => {
					this.data = response.data.data.records;
					this.pageConf.totalPage = response.data.data.total;
					this.loading = false
				}).catch(function(error) {
					this.loading = false
					console.log(error);
				});
			},
			//pageSize改变时触发的函数
			handleSizeChange() {
				this.queryList();
			},
			//当前页改变时触发的函数
			handleCurrentChange() {
				this.queryList();
			},
			floatMountFormat(row, column) {
				if(column.property == 'awbVolume') {
					if(row[column.property] === 0) {
						return 0
					} else if(row[column.property] == null || row[column.property] == '') {
						return ''
					} else {
						return parseFloat(row[column.property]).toFixed(3)
					}
				} else {
					if(row[column.property] === 0) {
						return 0
					} else if(row[column.property] == null || row[column.property] == '') {
						return ''
					} else {
						return parseFloat(row[column.property]).toFixed(1)
					}
				}
			}

		}
	}
</script>