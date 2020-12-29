<template>
	<div class="warp-main">
		<el-form :inline="false" :model="query" label-width="85px" class="demo-ruleForm">
			<!--<el-row style="margin:10px 10px 10px 10px;">
				<el-col class="elementWidth" style="font-size: large;">操作出重</el-col>
			</el-row>-->
			<el-row>
				<el-col class="elementWidth">
					<el-form-item label="主运单号">
						<el-input style="width: 145px;" v-model="query.awbNumber" auto-complete="off" clearable>
						</el-input>
					</el-form-item>
				</el-col>
				<el-col class="elementWidth">
					<el-form-item label="订单号" label-width="70px">
						<el-input style="width: 150px;" v-model="query.orderCode" auto-complete="off" clearable>
						</el-input>
					</el-form-item>
				</el-col>
				<el-col class="elementWidth">
					<el-form-item label="始发港" label-width="70px">
						<el-input style="width: 70px;" v-model="query.departureStation" auto-complete="off" @input="query.departureStation = query.departureStation.toUpperCase()">
						</el-input>
					</el-form-item>
				</el-col>
				<el-col class="elementWidth">
					<el-form-item label="出重状态" label-width="80px">
						<el-select style="width: 100px;" v-model="query.inboundStatus" placeholder="请选择">
							<el-option v-for="(inbound,index) in inbounds" :key="index" :label="inbound.paramText" :value="inbound.paramText"></el-option>
						</el-select>
					</el-form-item>
				</el-col>
				<el-col class="elementWidth">
					<el-form-item label-width="20px">
						<el-button type="text" size="mini" v-if=showFlag v-on:click="showFlag=false">收起</el-button>
						<el-button type="text" size="mini" v-if=!showFlag v-on:click="showFlag=true">展开</el-button>
						<el-button type="primary" size="small" v-on:click="findByPage">搜索</el-button>
					</el-form-item>
				</el-col>
			</el-row>
			<el-row v-if="showFlag">
				<el-col class="elementWidth">
					<el-form-item label="出重日期">
						<el-date-picker style="width: 135px;" v-model="query.inboundDateStart" type="date" value-format="yyyy-MM-dd 00:00:00" placeholder="选择日期">
						</el-date-picker>
						<span>-</span>
						<el-date-picker style="width: 135px;" v-model="query.inboundDateEnd" type="date" value-format="yyyy-MM-dd 23:59:59" placeholder="选择日期">
						</el-date-picker>
					</el-form-item>
				</el-col>
			</el-row>
		</el-form>
		<el-table border v-loading="loading" height="540" :data="data1">
			<el-table-column fixed label="操作" align="center" width="60">
				<template slot-scope="scope">
					<el-dropdown trigger="click" @command="handleCommand" @visible-change="handleChange(scope.row)">
						<!--<el-dropdown :hide-on-click="false" trigger="click" @command="handleCommand" @visible-change="handleChange(scope.row)">-->
						<i class="el-icon-s-operation"></i>
						<el-dropdown-menu slot="dropdown">
							<el-dropdown-item command="inbound" v-if="inboundFlag&&(scope.row.inboundChargeWeight==null)">出重</el-dropdown-item>
							<el-dropdown-item command="view" v-if="scope.row.inboundChargeWeight!=null">查看</el-dropdown-item>
							<el-dropdown-item command="delete" v-if="deleteFlag&&(scope.row.inboundChargeWeight!=null)">删除</el-dropdown-item>

							<!--<el-dropdown-item>
									<el-dropdown placement="right-start" trigger="click" @command="handleCommand" @visible-change="handleChange(scope.row)">
										<span class="el-dropdown-link">下拉菜单<i class="el-icon-arrow-right el-icon--right"></i></span>
										<el-dropdown-menu slot="dropdown">
											<el-dropdown-item command="inbound">出重</el-dropdown-item>
											<el-dropdown-item command="view">查看</el-dropdown-item>
											<el-dropdown-item command="delete">删除</el-dropdown-item>
										</el-dropdown-menu>
									</el-dropdown>
								</el-dropdown-item>
								<el-dropdown-item command="view">查看</el-dropdown-item>
								<el-dropdown-item command="delete">删除</el-dropdown-item>-->

						</el-dropdown-menu>
					</el-dropdown>
				</template>
			</el-table-column>
			<el-table-column fixed align="center" prop="awbNumber" label="主运单号" width="120"></el-table-column>
			<el-table-column fixed align="center" prop="orderCode" label="订单号" :formatter="formatOrderCode" width="130"></el-table-column>
			<el-table-column align="center" prop="inboundPieces" label="入库件数" width="100"></el-table-column>
			<el-table-column align="center" prop="inboundGrossWeight" label="入库毛重" :formatter="formatWeight" width="100"></el-table-column>
			<el-table-column align="center" prop="inboundVolume" label="入库体积" :formatter="formatVolumn" width="100"></el-table-column>
			<el-table-column align="center" prop="inboundChargeWeight" label="计费重量" :formatter="formatWeight" width="100"></el-table-column>
			<el-table-column align="center" prop="creatorName" label="录入人" width="250"></el-table-column>
			<el-table-column align="center" prop="createTime" label="录入时间" width="180"></el-table-column>
		</el-table>
		<div class="pagination">
			<el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="pageConf.pageCode" :page-sizes="pageConf.pageOption" :page-size.sync="pageConf.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="pageConf.totalPage">
			</el-pagination>
		</div>
		<viewdetail ref="addMission" v-if="viewVisible" :visible.sync="viewVisible" :frow="frow"></viewdetail>
		<inbound ref="addMission" v-if="inboundVisible" :visible.sync="inboundVisible" :frow="frow"></inbound>
	</div>
</template>
<script>
	import Inbound from './Inbound/Inbound'
	import ViewDetail from './Inbound/view'
	export default {
		data() {
			return {

				/*表数据*/
				data1: [],
				pageConf: {
					//设置一些初始值(会被覆盖)
					pageCode: 1, //当前页
					pageSize: 10, //每页显示的记录数
					totalPage: 0, //总记录数
					pageOption: [5, 10, 20]
				},
				query: {
					awbNumber: '',
					orderCode: '',
					departureStation: '',
					inboundStatus: '未出重',
					//					inboundDateStart: this.getCurrDateAndCurrMonthLastDay()[0],
					//					inboundDateEnd: this.getCurrDateAndCurrMonthLastDay()[1]
					inboundDateStart: '',
					inboundDateEnd: ''
				},
				inbounds: [],
				viewVisible: false,
				inboundVisible: false,
				frow: {},
				currRow: '',
				loading: false,
				inboundFlag: false,
				deleteFlag: false,
				showFlag: false
			}
		},
		components: {
			'inbound': Inbound,
			'viewdetail': ViewDetail
		},

		provide() {
			return {
				findByPage: this.findByPage
			}
		},
		methods: {
			handleCommand(command) {
				if(command == 'inbound') {
					this.inbound(this.currRow)
				} else if(command == 'view') {
					this.viewdetail(this.currRow)
				} else if(command == 'delete') {
					this.doDelete(this.currRow)
				}
			},
			handleChange(command) {
				this.currRow = command
			},
			inbound(row) {
				this.frow = row;
				this.inboundVisible = true;
			},
			viewdetail(row) {
				this.frow = row;
				this.viewVisible = true;
			},
			findByPage() {
				this.loading = true
				this.$axios.get2("/afbase/inbound?size=" + this.pageConf.pageSize + "&current=" + this.pageConf.pageCode, this.query)
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
				this.$axios.get2("/afbase/inbound?size=" + this.pageConf.pageSize + "&current=" + current, this.query)
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
					if(row.awbNumber != null && row.awbNumber != '') {
						this.$axios.deletes('/afbase/inbound/' + row.awbUuid + '/awb')
							.then(function(response) {
								if(response.data.code == 0) {
									this.openSuccess();
									this.findByPage();
								} else {
									this.openError(response.data.messageInfo);
								}
							}.bind(this));
					} else {
						this.$axios.deletes('/afbase/inbound/' + row.orderUuid + '/order')
							.then(function(response) {
								if(response.data.code == 0) {
									this.openSuccess();
									this.findByPage();
								} else {
									this.openError(response.data.messageInfo);
								}
							}.bind(this));
					}
				}).catch(() => {
					this.$message({
						type: 'info',
						message: '已取消删除'
					});
				});

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
			formatOrderCode(row, column) {
				if(row[column.property]) {
					return(row[column.property]).replace(/,/g, "\n");
				} else {
					return ""
				}
			},
			formatWeight(row, column) {
				if(row[column.property] != null) {
					return parseFloat(row[column.property]).toFixed(1)
				} else {
					return ""
				}
			},
			formatVolumn(row, column) {
				if(row[column.property] != null) {
					return parseFloat(row[column.property]).toFixed(3)
				} else {
					return ""
				}
			},
			getCurrDateAndCurrMonthLastDay() {
				//获取当前日期
				let date = new Date();
				date.setDate(1);
				let months = parseInt(date.getMonth() + 1);
				let days = date.getDate();
				if(months < 10) {
					months = '0' + months
				}
				if(days < 10) {
					days = '0' + days
				}
				let datas = date.getFullYear() + '-' + months + '-' + days + " 00:00:00";

				//获取当月最后一天
				let currentMonth = date.getMonth();
				let nextMonth = ++currentMonth;
				let nextMonthFirstDay = new Date(date.getFullYear(), nextMonth, 1);
				let oneDay = 1000 * 60 * 60 * 24;
				let lastTime = new Date(nextMonthFirstDay - oneDay);
				let month = parseInt(lastTime.getMonth() + 1);
				let day = lastTime.getDate();
				if(month < 10) {
					month = '0' + month
				}
				if(day < 10) {
					day = '0' + day
				}
				//当月最后一天
				let data = date.getFullYear() + '-' + month + '-' + day + " 23:59:59";
				let result = []
				result.push(datas)
				result.push(data)
				return result
			}
		},
		created() {
			this.$axios.get2('/afbase/category/params', {
				categoryName: "出重状态"
			}).then(function(response) {
				this.inbounds = response.data.data;
			}.bind(this)).catch(function(error) {
				console.log(error);
			})

			let buttonInfo = window.localStorage.getItem('buttonInfo')
			if(buttonInfo.indexOf('af_button_inbound_delete') > -1) {
				this.deleteFlag = true;
			}
			if(buttonInfo.indexOf('af_button_inbound_inbound') > -1) {
				this.inboundFlag = true;
			}
		}
	}
</script>
<style>
	.el-table .cell {
		white-space: pre-line !important;
		/*保留换行符*/
	}
</style>
