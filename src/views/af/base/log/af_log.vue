<template>
	<div>
		<div>
			<el-row>
				<el-form :inline="true" :model="query" label-width="80px" class="demo-ruleForm">
					<el-row>
						<el-col class="elementWidth">
							<el-form-item label="业务范畴" required label-width="100px">
								<el-select v-model="query.businessScope" style="width: 70px;">
									<el-option v-for="(item,index) in businessScopes" :key="index" :label="item.paramText" :value="item.paramText"></el-option>
								</el-select>
							</el-form-item>
						</el-col>
						<el-col class="elementWidth">
							<el-form-item label="日志分类">
								<el-select v-model="query.logType" placeholder="请选择" style="width: 120px;">
									<el-option v-for="(item,index) in logTypes" :key="index" :label="item.paramText" :value="item.paramText"></el-option>
								</el-select>
							</el-form-item>
						</el-col>
						<el-col class="elementWidth">
							<el-form-item label="操作节点">
								<el-input maxLength="20" v-model="query.nodeName" placeholder="操作节点" auto-complete="off" clearable style="width: 120px;">
								</el-input>
							</el-form-item>
						</el-col>
						<el-col class="elementWidth">
							<el-form-item style="margin-left: 20px;">
								<el-button type="text" size="medium" v-if=showFlag v-on:click="showFlag=false">收起</el-button>
								<el-button type="text" size="medium" v-if=!showFlag v-on:click="showFlag=true">展开</el-button>
								<el-button type="primary" v-on:click="findByPage" size="small">查询</el-button>
							</el-form-item>
						</el-col>
					</el-row>
					<el-row v-show="showFlag">
						<el-col class="elementWidth">
							<el-form-item label="主单号" label-width="100px">
								<el-input maxLength="11" v-model="query.awbNumber" placeholder="主单号" auto-complete="off" clearable style="width: 150px;">
								</el-input>
							</el-form-item>
						</el-col>
						<el-col class="elementWidth">
							<el-form-item label="订单号" label-width="60px">
								<el-input maxLength="20" v-model="query.orderNumber" placeholder="订单号" auto-complete="off" clearable style="width: 150px;">
								</el-input>
							</el-form-item>
						</el-col>
						<el-col class="elementWidth">
							<el-form-item label="操作日期" required>
								<el-date-picker style="width: 135px;" v-model="query.createTimeStart" type="date" value-format="yyyy-MM-dd 00:00:00" placeholder="开始时间" clearable>
								</el-date-picker>
								<span>-</span>
								<el-date-picker style="width: 135px;" v-model="query.createTimeEnd" type="date" value-format="yyyy-MM-dd 23:59:59" placeholder="结束时间" clearable>
								</el-date-picker>
							</el-form-item>
						</el-col>
					</el-row>
				</el-form>
			</el-row>
			<el-table v-loading="loading" :data="data" border>
				<el-table-column prop="awbNumber" label="主单号" width="150" align="center"></el-table-column>
				<el-table-column prop="orderNumber" label="订单号" width="150" align="center"></el-table-column>
				<!--<el-table-column prop="projectName" label="客户项目" width="100" align="center"></el-table-column>-->
				<el-table-column prop="logType" label="日志分类" width="80" align="center"></el-table-column>
				<el-table-column prop="nodeName" label="操作节点" width="80" align="center"></el-table-column>
				<el-table-column prop="pageName" label="操作页面" width="100" align="center"></el-table-column>
				<el-table-column prop="pageFunction" label="操作功能" width="150" align="center"></el-table-column>
				<el-table-column prop="logRemark" label="日志明细" min-width="300" align="center"></el-table-column>
				<el-table-column prop="creatorName" label="操作人" width="250" align="center"></el-table-column>
				<el-table-column prop="creatTime" label="操作时间" width="180" align="center"></el-table-column>
			</el-table>
			<div class="pagination">
				<el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="pageConf.pageCode" :page-sizes="pageConf.pageOption" :page-size.sync="pageConf.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="pageConf.totalPage">
				</el-pagination>
			</div>
		</div>
	</div>
</template>
<script>
	export default {
		data() {
			return {
				/*表数据*/
				data: [],
				businessScopes: [],
				logTypes: [],
				pageConf: {
					//设置一些初始值(会被覆盖)
					pageCode: 1, //当前页
					pageSize: 10, //每页显示的记录数
					totalPage: 0, //总记录数
					pageOption: [5, 10, 30] //分页选项
				},
				query: {
					logType: '',
					businessScope: '',
					nodeName: '',
					projectName: '',
					createTimeStart: this.getCurrMonthFirstDayAndLastDay()[0],
					createTimeEnd: this.getCurrMonthFirstDayAndLastDay()[1],
					awbNumber: '',
					orderNumber: '',
					orgId: ''
				},
				loading: false,
				showFlag: false
			}
		},
		methods: {
			findByPage() {
				if(this.query.businessScope.trim() == '') {
					this.openError("请选择业务范畴", "查询")
					return
				}
				if(this.query.createTimeStart == null || this.query.createTimeStart == '') {
					this.openError("请录入开始时间", "查询")
					return
				}
				if(this.query.createTimeEnd == null || this.query.createTimeEnd == '') {
					this.openError("请录入结束时间", "查询")
					return
				}
				if(new Date(this.query.createTimeEnd).getTime() < new Date().getTime()) {
					this.openError("截止时间小于当前时间", "查询")
					return
				}
				if(new Date(this.query.createTimeEnd).getTime() < new Date(this.query.createTimeStart).getTime()) {
					this.openError("截止时间小于开始时间", "查询")
					return
				}
				this.loading = true
				this.$axios.get2('/afbase/log?current=' + this.pageConf.pageCode + '&size=' + this.pageConf.pageSize, this.query)
					.then(function(response) {
						this.data = response.data.data.records;
						this.pageConf.totalPage = response.data.data.total;
						if(this.data.length == 0) {
							let current = Math.ceil(this.pageConf.totalPage / this.pageConf.pageSize);
							this.findByPage2(current);
						} else {
							this.loading = false
						}
					}.bind(this));
			},
			findByPage2(current) {
				this.$axios.get2('/afbase/log?current=' + current + '&size=' + this.pageConf.pageSize, this.query)
					.then(function(response) {
						this.loading = false
						this.data = response.data.data.records;
						this.pageConf.totalPage = response.data.data.total;
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
			openError(info, flag) {
				this.$notify({
					title: '',
					message: flag + '失败，' + info,
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
			formatCarrierStatus(row, column) {
				return row.carrierStatus == "0" ? "失效" : row.carrierStatus == "1" ? "生效" : "-";
			},
			init() {
				this.$axios.get2('/afbase/category/params', {
					categoryName: '业务范畴'
				}).then((response) => {
					if(response.data.code == '0') {
						this.businessScopes = response.data.data;
					} else {
						this.openError(response.data.messageInfo, "查询业务范畴")
					}
				}).catch(function(error) {
					console.log(error);
				});
				this.$axios.get2('/afbase/category/params', {
					categoryName: '日志分类'
				}).then((response) => {
					if(response.data.code == '0') {
						this.logTypes = response.data.data;
					} else {
						this.openError(response.data.messageInfo, "查询日志分类")
					}
				}).catch(function(error) {
					console.log(error);
				});
			},
			getCurrMonthFirstDayAndLastDay() {
				//获取当前月份第一天
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
			this.init();
			this.query.orgId = localStorage.getItem("orgId");
		}
	}
</script>
<style>

</style>