<template>
	<div class="warp-main">
		<el-form :model="query" label-width="5px" class="paymentListPage">
			<div ref="css_invoice_header">
				<el-row>
					<el-col class="elementWidth">
						<el-form-item>
							<el-input style="width:200px;">
								<template slot="prepend">业务范畴</template>
								<el-select slot="suffix" v-model="query.businessScope" placeholder="请选择" style="width:131px;margin-right: -5px;">
									<el-option v-for="item in businessScopes" :key="item.paramText" :label="item.paramText" :value="item.paramText">
									</el-option>
								</el-select>
							</el-input>
						</el-form-item>
					</el-col>
					<el-col class="elementWidth">
						<el-form-item>
							<el-input style="width:200px;">
								<template slot="prepend">发票状态</template>
								<el-select slot="suffix" v-model="query.status" placeholder="请选择" style="width:131px;margin-right: -5px;" clearable>
									<el-option label="待收票" value="待收票">
									</el-option>
									<el-option label="部分收票" value="部分收票">
									</el-option>
									<el-option label="收票完毕" value="收票完毕">
									</el-option>
									<el-option label="部分核销" value="部分核销">
									</el-option>
									<el-option label="核销完毕" value="核销完毕">
									</el-option>
									<el-option label="未核销完毕" value="未核销完毕">
									</el-option>
								</el-select>
							</el-input>
						</el-form-item>
					</el-col>
					<el-col class="elementWidth">
						<el-form-item>
							<el-input v-model="query.customerName" clearable auto-complete="off" clearable style="width:230px;" maxlength="200">
								<template slot="prepend">&nbsp;供&nbsp;应&nbsp;商</template>
							</el-input>
						</el-form-item>
					</el-col>

					<el-col class="elementWidth">
						<el-form-item>
							<el-input style="width:204px;">
								<template slot="prepend">申请日期</template>
								<el-date-picker slot="suffix" v-model="query.invoiceTimeStart" clearable type="date" value-format="yyyy-MM-dd 00:00:00" placeholder="开始日期" style="width: 135px;margin-right: -5px;">
								</el-date-picker>
							</el-input>
							<span>-</span>
							<el-date-picker v-model="query.invoiceTimeEnd" clearable type="date" value-format="yyyy-MM-dd 23:59:59" placeholder="结束日期" style="width: 135px;">
							</el-date-picker>
						</el-form-item>
					</el-col>
					<el-col class="elementWidth">
						<el-form-item label-width="10px">
							<el-button type="text" size="mini" v-if=showFlag v-on:click="showFlag=false;setHeight()">收起</el-button>
							<el-button type="text" size="mini" v-if=!showFlag v-on:click="showFlag=true;setHeight()">展开</el-button>
							<el-button style="padding: 9px 7px;margin-left: 0px;" type="primary" size="small" @click="queryList">查询</el-button>
						</el-form-item>
					</el-col>
				</el-row>
				<el-row v-show="showFlag">
					<el-col class="elementWidth">
						<el-form-item>
							<el-input v-model="query.invoiceName" auto-complete="off" clearable style="width:200px;" maxlength="50">
								<template slot="prepend">&nbsp;申&nbsp;请&nbsp;人</template>
							</el-input>
						</el-form-item>
					</el-col>

					<el-col class="elementWidth">
						<el-form-item>
							<el-input v-model="query.invoiceNum" auto-complete="off" clearable style="width:200px;" maxlength="50">
								<template slot="prepend">&nbsp;发&nbsp;票&nbsp;号</template>
							</el-input>
						</el-form-item>
					</el-col>
					<el-col class="elementWidth">
						<el-form-item>
							<el-input style="width: 230px;" v-model="query.paymentNum" clearable auto-complete="off" maxlength="50">
								<template slot="prepend">对账单号</template>
							</el-input>
						</el-form-item>
					</el-col>
					<el-col class="elementWidth">
						<el-form-item>
							<el-input style="width:204px;">
								<template slot="prepend">收票日期</template>
								<el-date-picker slot="suffix" v-model="query.createTimeStart" clearable type="date" value-format="yyyy-MM-dd 00:00:00" placeholder="开始日期" style="width: 135px;margin-right: -5px;">
								</el-date-picker>
							</el-input>
							<span>-</span>
							<el-date-picker v-model="query.createTimeEnd" clearable type="date" value-format="yyyy-MM-dd 23:59:59" placeholder="结束日期" style="width: 135px;">
							</el-date-picker>
						</el-form-item>
					</el-col>
					<el-col class="elementWidth">
						<el-form-item label-width="33px">
							<el-button style="margin-left: 7px;padding: 9px 7px;background-color:#FFF;color:#409EFF" type="primary" size="small" v-on:click="setting">设置</el-button>
							<el-button style="margin-left: 2px;padding: 9px 7px;background-color:#FFF;color:#409EFF" type="primary" size="small" v-on:click="exportExcel">导出</el-button>
						</el-form-item>
					</el-col>
				</el-row>
				<el-row v-show="showFlag">
					<el-col class="elementWidth">
						<el-form-item>
							<el-input style="width: 200px;" v-model="query.creatorName" clearable auto-complete="off" maxlength="50">
								<template slot="prepend">&nbsp;收&nbsp;票&nbsp;人</template>
							</el-input>
						</el-form-item>
					</el-col>
					<el-col class="elementWidth">
						<el-form-item>
							<el-input style="width:200px;">
								<template slot="prepend">发票类型</template>
								<el-select slot="suffix" v-model="query.invoiceType" style="width:131px;margin-right: -5px;" clearable>
									<el-option v-for="item,index in invoiceTypes" :key="index" :label="item.paramText" :value='item.paramText'>
									</el-option>
								</el-select>
							</el-input>
						</el-form-item>
					</el-col>
					<el-col class="elementWidth">
						<el-form-item>
							<el-input style="width: 230px;" v-model="query.awbNumberOrOrderCode" clearable auto-complete="off" maxlength="50">
								<template v-if="query.businessScope=='IO'||query.businessScope=='LC'" slot="prepend">订单/客户单号</template>
								<template v-else slot="prepend">提单/订单号</template>
							</el-input>
						</el-form-item>
					</el-col>
					<el-col class="elementWidth">
						<el-form-item>
							<el-input style="width:204px;">
								<template slot="prepend">发票日期</template>
								<el-date-picker slot="suffix" v-model="query.invoiceDateStart" clearable type="date" value-format="yyyy-MM-dd" placeholder="开始日期" style="width: 135px;margin-right: -5px;">
								</el-date-picker>
							</el-input>
							<span>-</span>
							<el-date-picker v-model="query.invoiceDateEnd" clearable type="date" value-format="yyyy-MM-dd" placeholder="结束日期" style="width: 135px;">
							</el-date-picker>
						</el-form-item>
					</el-col>
				</el-row>
			</div>
		</el-form>
		<el-row style="margin-bottom: 10px;margin-left: 5px;">
			<el-col class="elementWidth">
				<div>勾选合计：</div>
			</el-col>
			<el-col style="margin-left: 10px;margin-top: 2px;" class="elementWidth" v-for="item,index in checkedAmountSum" :key="index">
				<span v-if="item.indexOf('CNY')>-1">{{item}}</span>
				<span v-else style="color: red;">{{item}}</span>
			</el-col>
		</el-row>
		<div>
			<el-table v-loading="loading" :max-height="tableHeight" stripe :data="data" border :cell-style="addCellStayle" @header-dragend="cellWidth" @selection-change="handleSelectionChange">
				<el-table-column fixed type="selection" align="center" width="50">
				</el-table-column>
				<el-table-column fixed type="index" align="center" label="操作" width="60">
					<template slot-scope="scope">
						<el-dropdown trigger="click" @command="handleCommand" @visible-change="handleChange(scope.row)">
							<i class="el-icon-s-operation"></i>
							<el-dropdown-menu slot="dropdown">
								<el-dropdown-item command="invoice" v-if="cssCostInvoiceCollectionPermission">收票</el-dropdown-item>
								<el-dropdown-item command="writeoff" v-if="cssCostInvoiceDoWriteoffPermission">核销</el-dropdown-item>
								<el-dropdown-item command="view">查看</el-dropdown-item>
								<el-dropdown-item command="delete" v-if="cssCostInvoiceDeletePermission">删除</el-dropdown-item>
								<el-dropdown-item command="rollback" v-if="cssCostInvoiceRollbackPermission">退回</el-dropdown-item>
							</el-dropdown-menu>
						</el-dropdown>
					</template>
				</el-table-column>
				<template v-for="(item,index) in tableColumns">
					<el-table-column :key="index" :prop="item.prop" :label="item.label" :width="item.width" header-align="center" :align="item.align" :sortable="item.sortable" :formatter="formatter"></el-table-column>
				</template>
			</el-table>
		</div>
		<div ref="css_invoice_footer">
			<el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="pageConf.pageCode" :page-sizes="pageConf.pageOption" :page-size.sync="pageConf.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="pageConf.totalPage">
			</el-pagination>
		</div>
		<viewdetail ref="addMission" v-if="viewVisible" :visible.sync="viewVisible" :frow="frow"></viewdetail>
		<invoiceWriteoff ref="addMission" v-if="writeoffVisible" :visible.sync="writeoffVisible" :frow="frow"></invoiceWriteoff>
		<setVisibleTag ref="addMission" v-if="setVisible" :visible.sync="setVisible"></setVisibleTag>
		<invoice ref="addMission" v-if="invoiceVisible" :visible.sync="invoiceVisible" :frow="frow"></invoice>
	</div>
</template>
<script>
	import setVisibleVue from './invoice/invoice_setting'
	import columns from './invoice/invoice_column'
	import View from './payment/af_payment_view'
	import InvoiceWriteoff from './invoice/invoice_writeoff'
	import Invoice from './invoice/invoice_list_save'
	export default {
		data() {
			return {
				loading: false,
				data: [],
				tableColumns: [],
				tableHeight: '550px',
				pageConf: {
					//设置一些初始值(会被覆盖)
					pageCode: 1, //当前页
					pageSize: 10, //每页显示的记录数
					totalPage: 0, //总记录数
					pageOption: [10, 30, 50]
				},
				viewVisible: false,
				writeoffVisible: false,
				invoiceVisible: false,
				frow: {},
				query: {
					businessScope: 'AE',
					status: '待收票',
					customerName: '',
					invoiceName: '',
					invoiceTimeStart: this.getDateTime(),
					invoiceTimeEnd: '',
					paymentNum: '',
					invoiceNum: '',
					invoiceType: '',
					awbNumberOrOrderCode: '',
					invoiceDateStart: '',
					invoiceDateEnd: '',
					creatorName: '',
					createTimeStart: '',
					createTimeEnd: '',
					columnStrs: ''
				},
				businessScopes: [],
				invoiceTypes: [],
				checkedAmountSum: [],
				showFlag: false,
				setVisible: false,
				cssCostInvoiceCollectionPermission: false,
				cssCostInvoiceDoWriteoffPermission: false,
				cssCostInvoiceDeletePermission: false,
				cssCostInvoiceRollbackPermission: false
			}
		},
		created: function() {
			//按钮权限
			let buttonInfo = window.localStorage.getItem('buttonInfo')
			if (buttonInfo.indexOf('css_cost_invoice_collection') > -1) {
				this.cssCostInvoiceCollectionPermission = true
			}
			if (buttonInfo.indexOf('css_cost_invoice_doWriteoff') > -1) {
				this.cssCostInvoiceDoWriteoffPermission = true
			}
			if (buttonInfo.indexOf('css_cost_invoice_delete') > -1) {
				this.cssCostInvoiceDeletePermission = true
			}
			if (buttonInfo.indexOf('css_cost_invoice_rollback') > -1) {
				this.cssCostInvoiceRollbackPermission = true
			}
			//查询业务范畴
			this.$axios.get2('/afbase/category/paramsNew', {
				categoryName: "业务范畴"
			}).then(function(response) {
				this.businessScopes = response.data.data
			}.bind(this)).catch(function(error) {
				console.log(error);
			})
			//发票类型
			this.$axios.get('/afbase/category/queryCategoryByCategoryType/28')
				.then((response) => {
					this.invoiceTypes = response.data.data
				})
			//从数据库查询设置信息
			this.$axios.get2("/hrs/user/getUserPageSet?pageName=财务结算管理/成本对账/发票")
				.then(function(response) {
					let af_list_column = response.data.data;
					if (af_list_column && af_list_column.length > 0) {
						if (af_list_column && af_list_column.length > 0) {
							this.tableColumns = this.sortBykey(af_list_column, 'index');
						}
					} else {
						this.tableColumns = this.sortBykey(columns.invoiceInfo, 'index');
					}
				}.bind(this));
		},
		provide() {
			return {
				queryList: this.queryList,
				colomnSetCallback: this.colomnSetCallback
			}
		},
		components: {
			'setVisibleTag': setVisibleVue,
			'viewdetail': View,
			'invoiceWriteoff': InvoiceWriteoff,
			'invoice': Invoice
		},
		methods: {
			formatter(row, column) {
				if (column.property == 'invoiceName' || column.property == 'creatorName') {
					if (row[column.property]) {
						return row[column.property].substring(0, row[column.property].indexOf(' '))
					} else {
						return ""
					}
				} else if (column.property == 'amountWriteoff' || column.property == 'amountNoWriteoff' || column.property == 'amount') {
					return row[column.property + 'Str']
				} else {
					return row[column.property]
				}
			},
			setting() {
				this.setVisible = true;
			},
			cellWidth(newWidth, oldWidth, column, event) {
				let strColumn = JSON.stringify(this.tableColumns);
				let userId = window.localStorage.getItem('userId');
				let arrayC = JSON.parse(strColumn);
				if (arrayC && arrayC.length > 0) {
					arrayC.forEach(function(item, index) {
						if (column.label == item.label) {
							item.width = newWidth;
						}
					});
					arrayC = this.sortBykey(arrayC, 'index');
					localStorage.setItem(userId + '_css_invoice_list_column_width', JSON.stringify(arrayC))
				}
			},
			colomnSetCallback(columns) {
				this.tableColumns = columns
			},
			//标题 stly
			addCellStayle(data) {
				if (data.column.property === "amount") {
					let k = '';
					if (data.row.amountStr.indexOf('CNY') == -1) {
						k = "color:red;"
					} else {
						k = "color:#606266;"
					}
					return k;
				} else {
					return "";
				}
			},
			sortBykey(ary, key) {
				return ary.sort(function(a, b) {
					let x = a[key]
					let y = b[key]
					return ((x < y) ? -1 : (x > y) ? 1 : 0)
				})
			},
			handleCommand(command) {
				if (command == 'writeoff') {
					this.showWriteoff()
				} else if (command == 'view') {
					this.showView()
				} else if (command == 'delete') {
					this.doDelete()
				} else if (command == 'invoice') {
					this.invoiceVisible = true
				} else if (command == 'rollback') {
					this.rollback()
				}
			},
			handleChange(command) {
				this.frow = command
			},
			showView() {
				this.openSuccess('功能开发中...敬请期待')
				return
				this.frow.businessScope = this.query.businessScope;
				this.viewVisible = true;
			},
			showWriteoff() {
				if (this.frow.invoiceDetailId == null) {
					this.openError('当前申请未做付款发票，无法核销')
				} else {
					this.$axios.get("/afbase/cssCostInvoiceDetail/checkIfWriteoffComplete/" + this.frow.invoiceDetailId).then(response => {
						this.writeoffVisible = true
					}).catch(error => {
						this.openError(error.response.data.messageInfo)
					})
				}
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
			doDelete() {
				if (this.frow.invoiceDetailId == null) {
					this.openError("您好，未做收票 不允许 删除")
					return
				}
				this.$confirm('您好，删除发票号' + this.frow.invoiceNum + '，是否继续', '提示', {
					confirmButtonText: '是',
					cancelButtonText: '否',
					type: 'warning',
					center: true
				}).then(() => {
					this.$axios.deletes("/afbase/cssCostInvoiceDetail/" + this.frow.invoiceDetailId + "/" + this.frow.invoiceRowUuid).then(response => {
						this.openSuccess("删除成功")
						this.queryList();
					}).catch(error => {
						this.openError(error.response.data.messageInfo)
					})
				}).catch(() => {
					this.$message({
						type: 'info',
						message: '已取消删除'
					});
				})
			},
			rollback() {
				this.$confirm('请确认 是否退回付款申请？', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning',
					center: true
				}).then(() => {
					this.$axios.deletes('/afbase/cssCostInvoice/' + this.frow.paymentId + '/' + this.frow.paymentRowUuid)
						.then((response) => {
							this.openSuccess("回退成功");
							this.queryList();
						}).catch((error) => {
							let errorinfo = error.response.data.messageInfo;
							this.openError(errorinfo)
						})
				}).catch(() => {
					this.$message({
						type: 'info',
						message: '已取消回退'
					});
				});
			},
			handleSelectionChange(val) {
				let checkedAmountSumMap = {}
				val.forEach(item => {
					if (item.invoiceDetailId) {
						if (checkedAmountSumMap[item.currency]) {
							checkedAmountSumMap[item.currency] = checkedAmountSumMap[item.currency] + item.amount
						} else {
							checkedAmountSumMap[item.currency] = item.amount
						}
					}
				})
				this.checkedAmountSum = []
				for (let key in checkedAmountSumMap) {
					this.checkedAmountSum.push(this.formatQWF(checkedAmountSumMap[key]) + ' (' + key + ')')
				}

			},
			queryList() {
				this.loading = true
				this.setHeight()
				this.query.columnStrs = ''
				this.$axios.get2('/afbase/cssCostInvoiceDetail?size=' + this.pageConf.pageSize + '&current=' + this.pageConf.pageCode, this.query).then((response) => {
					this.data = response.data.data.records;
					this.pageConf.totalPage = response.data.data.total;
					if (this.data.length == 0) {
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
				this.$axios.get2('/afbase/cssCostInvoiceDetail?size=' + this.pageConf.pageSize + '&current=' + current, this.query).then((response) => {
					this.data = response.data.data.records;
					this.pageConf.totalPage = response.data.data.total;
					this.loading = false
				}).catch((error) => {
					this.loading = false
					console.log(error);
				});
			},
			setHeight() {
				this.$nextTick(() => {
					let css_invoice_header = this.$refs.css_invoice_header.offsetHeight;
					let css_invoice_footer = this.$refs.css_invoice_footer.offsetHeight;
					let heightS = window.innerHeight - 180 - css_invoice_header - css_invoice_footer;
					this.tableHeight = heightS + "px";
				});
			},
			exportExcel() {
				this.$confirm('是否根据结果字段导出数据？', '提示', {
					distinguishCancelAndClose: true,
					confirmButtonText: '是',
					cancelButtonText: '否',
					type: 'warning',
					center: true
				}).then(() => {
					this.query.columnStrs = JSON.stringify(this.tableColumns)
					this.exportExcelSure()
				}).catch((action) => {
					if (action === 'close') {
						return
					}
					let excelList = this.sortBykey(columns.invoiceInfo, 'index')
					this.query.columnStrs = JSON.stringify(excelList)
					this.exportExcelSure();
				});
			},
			exportExcelSure() {
				this.$axios.post3('/afbase/cssCostInvoiceDetail/exportExcel', this.query)
					.then(function(response) {
						var blob = new Blob([response.data], {
							type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8'
						});
						var downloadElement = document.createElement('a');
						var href = window.URL.createObjectURL(blob); // 创建下载的链接
						downloadElement.href = href;
						downloadElement.download = '成本对账发票' + '.xls'; // 下载后文件名
						document.body.appendChild(downloadElement);
						downloadElement.click(); // 点击下载
						document.body.removeChild(downloadElement); // 下载完成移除元素
						window.URL.revokeObjectURL(href); // 释放掉blob对象
					}.bind(this));
			},
			//pageSize改变时触发的函数
			handleSizeChange() {
				this.queryList();
			},
			//当前页改变时触发的函数
			handleCurrentChange() {
				this.queryList();
			},
			formatQWF(data) {
				return data.toFixed(2).replace(/\d{1,3}(?=(\d{3})+(\.\d*)?$)/g, '$&,');
			},
			getDateTime() {
				let theDate = new Date()
				let _year = theDate.getFullYear();
				let _month = theDate.getMonth();
				let _date = theDate.getDate();
				_month++
				if (_month < 10) {
					_month = "0" + _month;
				}
				if (_date < 10) {
					_date = "0" + _date;
				}
				return _year + "-" + _month + "-01 00:00:00";
			}
		}
	}
</script>
<style>
	.paymentListPage .el-input__icon {
		line-height: 30px !important;
	}

	.paymentListPage .el-form-item__content {
		line-height: 30px !important;
	}

	.paymentListPage .el-input-group__prepend {
		padding: 0 6px;
	}

	.el-table .cell {
		white-space: pre-line !important;
		/*保留换行符*/
	}

	.statusSelect .el-select__tags {
		overflow: hidden !important;
	}
</style>
