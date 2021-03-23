<template>
	<div class="warp-main">
		<el-form :inline="false" :model="query" label-width="80px" class="orderListPage">
			<div ref="invoice_writeoff_list_header">
				<el-row>
					<el-col class="elementWidth">
						<el-form-item label="" label-width="10px">
							<el-input style="width:240px;">
								<template slot="prepend">业务范畴</template>
								<el-select slot="suffix" v-model="query.businessScope" @change="queryCssFinacialAccount" style="width:171px;margin-right: -5px;">
									<el-option v-for="item in businessCodes" :key="item.paramRanking" :label="item.paramText" :value="item.paramText">
									</el-option>
								</el-select>
							</el-input>
						</el-form-item>
					</el-col>
					<el-col class="elementWidth">
						<el-form-item label-width="10px">
							<el-input v-model="query.customerName" maxlength="200" auto-complete="off" clearable style="width:350px;">
								<template slot="prepend">收款客户</template>
							</el-input>
						</el-form-item>
					</el-col>
					<el-col class="elementWidth">
						<el-form-item label-width="10px">
							<el-input style="width:210px;">
								<template slot="prepend">
									<span>核销日期</span>
								</template>
								<el-date-picker slot="suffix" v-model="query.writeoffDateStart" clearable type="date" value-format="yyyy-MM-dd" placeholder="开始" style="width: 141px;margin-right: -5px;">
								</el-date-picker>
							</el-input>
							<span>-</span>
							<el-date-picker v-model="query.writeoffDateEnd" clearable type="date" value-format="yyyy-MM-dd" placeholder="结束" style="width: 135px;">
							</el-date-picker>
						</el-form-item>
					</el-col>
					<el-col class="elementWidth">
						<el-form-item label-width="10px">
							<el-button type="text" size="small" v-if=showFlag v-on:click="showFlagSearch">收起</el-button>
							<el-button type="text" size="small" v-if=!showFlag v-on:click="showFlagSearch">展开</el-button>
							<el-button type="primary" size="small" v-on:click="queryList" style="margin-left: 2px;padding-left: 8px;padding-right: 8px;">查询</el-button>
						</el-form-item>
					</el-col>
				</el-row>
				<el-row v-show="showFlag">
					<el-col class="elementWidth">
						<el-form-item label-width="10px">
							<el-input class="widthWithThree" v-model="query.creatorName" maxlength="50" auto-complete="off" clearable style="width:240px;">
								<template slot="prepend">核销人</template>
							</el-input>
						</el-form-item>
					</el-col>

					<el-col class="elementWidth">
						<el-form-item label-width="10px">
							<el-input v-model="query.writeoffNum" maxlength="50" auto-complete="off" clearable style="width:350px;">
								<template slot="prepend">核销单号</template>
							</el-input>
						</el-form-item>
					</el-col>

					<el-col class="elementWidth">
						<el-form-item label-width="10px">
							<el-input style="width:210px;">
								<template slot="prepend">操作时间</template>
								<el-date-picker slot="suffix" v-model="query.createTimeStart" clearable type="date" value-format="yyyy-MM-dd 00:00:00" placeholder="开始" style="width: 141px;margin-right: -5px;">
								</el-date-picker>
							</el-input>
							<span>-</span>
							<el-date-picker v-model="query.createTimeEnd" clearable type="date" value-format="yyyy-MM-dd 23:59:59" placeholder="结束" style="width: 135px;">
							</el-date-picker>
						</el-form-item>
					</el-col>
					<el-col class="elementWidth">
						<el-form-item label-width="38px">
							<el-button style="margin-left: 4px;padding-left: 8px;padding-right: 8px;background-color:#FFF;color:#409EFF" type="primary" size="small" v-on:click="setting">设置</el-button>
							<el-button style="margin-left: 4px;padding-left: 8px;padding-right: 8px;background-color:#FFF;color:#409EFF" type="primary" size="small" v-on:click="exportExcel">导出</el-button>
						</el-form-item>
					</el-col>
				</el-row>
				<el-row v-show="showFlag">
					<el-col class="elementWidth">
						<el-form-item label-width="10px">
							<el-input class="widthWithThree" v-model="query.invoiceNum" maxlength="50" auto-complete="off" clearable style="width:240px;">
								<template slot="prepend">发票号</template>
							</el-input>
						</el-form-item>
					</el-col>
					<el-col class="elementWidth">
						<el-form-item label-width="10px">
							<el-input v-model="query.invoiceTitle" maxlength="50" auto-complete="off" clearable style="width:350px;">
								<template slot="prepend">发票抬头</template>
							</el-input>
						</el-form-item>
					</el-col>
					<el-col class="elementWidth">
						<el-form-item label-width="10px">
							<el-input style="width:210px;">
								<template slot="prepend">
									<span>发票日期</span>
								</template>
								<el-date-picker slot="suffix" v-model="query.invoiceDateStart" clearable type="date" value-format="yyyy-MM-dd" placeholder="开始" style="width: 141px;margin-right: -5px;">
								</el-date-picker>
							</el-input>
							<span>-</span>
							<el-date-picker v-model="query.invoiceDateEnd" clearable type="date" value-format="yyyy-MM-dd" placeholder="结束" style="width: 135px;">
							</el-date-picker>
						</el-form-item>
					</el-col>
				</el-row>
				<el-row v-show="showFlag">
					<el-col class="elementWidth">
						<el-form-item label-width="10px">
							<el-input v-model="query.businessNum" maxlength="50" auto-complete="off" clearable style="width:240px;" >
								<template slot="prepend">账单/清单号</template>
							</el-input>
						</el-form-item>
					</el-col>
					<el-col class="elementWidth">
						<el-form-item label-width="10px">
							<el-input auto-complete="off" style="width:350px;">
								<template slot="prepend">
									<span>&nbsp;&nbsp;科&nbsp;&nbsp;&nbsp;目&nbsp;&nbsp;</span>
								</template>
								<el-select slot="suffix" v-model="query.financialAccountCode" placeholder="请选择" style="width:281px;margin-right: -5px;" clearable>
									<el-option v-for="item in financialAccounts" :key="item.financialAccountId" :label="item.financialAccountName+' '+item.financialAccountCode" :value="item.financialAccountCode">
										<span>{{item.financialAccountName}} {{item.financialAccountCode}}&nbsp;&nbsp;&nbsp;</span>
									</el-option>
								</el-select>
							</el-input>
						</el-form-item>
					</el-col>
				</el-row>
			</div>
		</el-form>
		<div>
			<el-table :indent="0" v-loading="loading" stripe :data="data" border :max-height="tableHeight" :cell-class-name="addPullRightClass" :cell-style="addCellStayle" @header-dragend="cellWidth">
				<el-table-column fixed type="index" align="center" label="操作" width="50">
					<template slot-scope="scope">
						<el-dropdown trigger="click" @command="handleCommand" @visible-change="handleChange(scope.row)">
							<i class="el-icon-s-operation"></i>
							<el-dropdown-menu slot="dropdown">
								<el-dropdown-item v-if="deleteInvoiceFlag" command="deleteInvoice">删除</el-dropdown-item>
								<el-dropdown-item v-if="invoiceFilesFlag" command="invoiceFiles">附件</el-dropdown-item>
							</el-dropdown-menu>
						</el-dropdown>
					</template>
				</el-table-column>
				<template v-for="(item,index) in tableColumns">
					<el-table-column v-if="item.label=='发票金额'" :key="index" :prop="item.prop" :label="item.label" :width="item.width" :align="item.align" :sortable="item.sortable">
						<template slot-scope="scope">
							<font v-if="scope.row.currency=='CNY'">{{amountFormat(scope.row.amount,scope.row.currency)}}</font>
							<font v-else style="color: red;">{{amountFormat(scope.row.amount,scope.row.currency)}}</font>
						</template>
					</el-table-column>
					<el-table-column v-else-if="item.label=='本次核销金额'" :key="index" :prop="item.prop" :label="item.label" :width="item.width" :align="item.align" :sortable="item.sortable">
						<template slot-scope="scope">
							<font v-if="scope.row.currency=='CNY'">{{amountFormat(scope.row.amountWriteoff,scope.row.currency)}}</font>
							<font v-else style="color: red;">{{amountFormat(scope.row.amountWriteoff,scope.row.currency)}}</font>
						</template>
					</el-table-column>
					<el-table-column v-else-if="item.label=='科目名称'" :key="index" :prop="item.prop" :label="item.label" :width="item.width" :align="item.align" :sortable="item.sortable">
						<template slot-scope="scope">
							<span>{{nameFormat(scope.row.financialAccountName)}}</span>
						</template>
					</el-table-column>
					<el-table-column v-else-if="item.label=='核销人'" :key="index" :prop="item.prop" :label="item.label" :width="item.width" :align="item.align" :sortable="item.sortable">
						<template slot-scope="scope">
							<span>{{nameFormat(scope.row.creatorName)}}</span>
						</template>
					</el-table-column>
					<el-table-column v-else-if="item.label=='附件'" :key="index" :prop="item.prop" :label="item.label" :width="item.width" :align="item.align" :sortable="item.sortable">
						<template slot-scope="scope" v-if="scope.row.files">
							<p v-for="(item,index) in scope.row.files.split('  ')" :key="index">
								<a href="javascript:void(0)" @click="orderFileView(item.split(' ')[0])" style="color: #137DFA;text-decoration: underline;">{{item.split(' ')[1]}}</a>
							</p>
						</template>
					</el-table-column>
					<el-table-column v-else :key="index" :prop="item.prop" :label="item.label" :width="item.width" :align="item.align" :sortable="item.sortable">
					</el-table-column>
				</template>

			</el-table>
		</div>
		<div ref="invoice_writeoff_list_footer">
			<el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="pageConf.pageCode" :page-sizes="pageConf.pageOption" :page-size.sync="pageConf.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="pageConf.totalPage">
			</el-pagination>
		</div>
		<settingVisibleTag ref="addMission" v-if="settingVisible" :visible.sync="settingVisible" :frow="frow"></settingVisibleTag>
		<invoiceFilesTag ref="addMission" v-if="invoiceFilesVisible" :visible.sync="invoiceFilesVisible" :frow="frow"></invoiceFilesTag>
	</div>
</template>
<script>
	import columns from './invoice_writeoff_list_column.json'
	import setting from './invoice_writeoff_list_setting.vue'
	import invoiceFiles from './invoice_files.vue'
	export default {
		data() {
			return {
				tableHeight: '800px',
				loading: false,
				data: [],
				tableColumns: [],
				invoiceTypeList: [],
				pageConf: {
					//设置一些初始值(会被覆盖)
					pageCode: 1, //当前页
					pageSize: 10, //每页显示的记录数
					totalPage: 0, //总记录数
					pageOption: [10, 50, 100]
				},
				settingVisible: false,
				deleteInvoiceFlag: false,
				invoiceFilesFlag: false,
				invoiceFilesVisible: false,
				columnStrs: '',
				frow: {},
				query: {
					businessScope: 'AE',
					financialAccountCode: '',
					customerName: '',
					createTimeStart: '',
					createTimeEnd: '',
					creatorName: '',
					invoiceNum: '',
					businessNum: '',
					writeoffDateStart: this.getDateTime(new Date()),
					writeoffDateEnd: '',
					invoiceDateStart: '',
					invoiceDateEnd: '',
					invoiceTitle: '',
					columnStrs: ''
				},
				businessCodes: [],
				financialAccounts: [],
				showFlag: false
			}
		},
		created: function() {
			this.columnStrs = JSON.stringify(columns.info);
			let buttonInfo = window.localStorage.getItem('buttonInfo');
			if (buttonInfo.indexOf('af-writeoff-delete') > -1) {
				this.deleteInvoiceFlag = true;
			}
			if (buttonInfo.indexOf('af-writeoff-files') > -1) {
				this.invoiceFilesFlag = true;
			}
			//科目
			this.queryCssFinacialAccount()
			//查询业务范畴
			this.$axios.get2('/afbase/category/paramsNew', {
				categoryName: "业务范畴"
			}).then(function(response) {
				this.businessCodes = response.data.data;
			}.bind(this)).catch(function(error) {
				console.log(error);
			})

			//从数据库查询设置信息
			let pageName = '财务结算管理/收入对账/发票核销单';
			this.$axios.get2("/hrs/user/getUserPageSet?pageName=" + pageName)
				.then(function(response) {
					let invoice_list_column = response.data.data;
					if (invoice_list_column && invoice_list_column.length > 0) {
						this.tableColumns = this.sortBykey(invoice_list_column, 'index');
					} else {
						this.tableColumns = this.sortBykey(columns.info, 'index');
					}
					this.tableColumns = this.setLabel(this.tableColumns);
				}.bind(this));
		},
		mounted() {
			this.setHeight();
		},
		provide() {
			return {
				queryList: this.queryList
			}
		},
		components: {
			'settingVisibleTag': setting,
			'invoiceFilesTag': invoiceFiles
		},
		methods: {
			orderFileView(fileUrl) {
				window.open(fileUrl)
			},
			//时间
			getDateTime(theDate) {
				var _year = theDate.getFullYear();
				var _month = theDate.getMonth();
				var _date = theDate.getDate();
				_month = _month;
				if (_month == 13) {
					_month = 1;
				}
				if (_month == 0) {
					_month = 12;
					_year = _year - 1;
				}
				if (_month < 10) {
					_month = "0" + _month;
				}
				return _year + "-" + _month + "-01";
			},
			nameFormat(name) {
				if (name != null) {
					return name.split(' ')[0];
				} else {
					return "";
				}
			},
			amountFormat(amount, currency) {
				if (amount != null) {
					return amount.toFixed(2).replace(/\d{1,3}(?=(\d{3})+(\.\d*)?$)/g, '$&,') + "(" + currency + ")";
				} else {
					return "";
				}
			},
			queryCssFinacialAccount() {
				//科目
				this.query.financialAccountCode = ''
				this.$axios.get('/afbase/cssFinancialAccount/' + this.query.businessScope).then((response) => {
					this.financialAccounts = response.data.data.filter(item => item.financialAccountCode != '')
					// if (this.financialAccounts && this.financialAccounts.length > 0) {
					// 	this.query.financialAccountCode = this.financialAccounts[0].financialAccountCode
					// }
				})
			},
			//deleteInvoice
			deleteInvoice(row) {
				//查询
				this.$axios.get2('/afbase/cssIncomeInvoiceDetailWriteoff/view/' + row.invoiceDetailWriteoffId).then((response) => {
					if (response.data.code == '0') {
						if (response.data.data) {
							let content = "";
							if (response.data.data.voucherNumber) {
								content = "当前核销单已导凭证，是否继续删除核销单？";
							} else {
								content = "是否确认删除？";
							}
							this.deleteSure(row, content);
						} else {
							this.openError("删除失败，数据有变化，请刷新再试");
						}
					} else {
						this.openError("删除失败，数据有变化，请刷新再试");
					}
				}).catch((error) => {
					console.log(error);
				});
			},
			deleteSure(row, content) {
				this.$confirm(content, '提示', {
					confirmButtonText: '是',
					cancelButtonText: '否',
					type: 'warning',
					center: true
				}).then(() => {
					this.$axios.deletes('/afbase/cssIncomeInvoiceDetailWriteoff/delete/' + row.invoiceDetailWriteoffId).then((response) => {
						if (response.data.code == '0') {
							this.openSuccess("删除成功！")
							this.queryList();
						} else {
							this.openError(response.data.messageInfo)
						}
					}).catch((error) => {
						this.openError("删除失败：" + error.response.data.messageInfo)
					});
				}).catch(() => {

				});
			},
			invoiceFiles() {
				if (this.frow.invoiceDetailId) {
					this.frow.businessType = 'writeoff';
					this.invoiceFilesVisible = true;
				} else {
					this.openError("您好，开票后才可上传发票附件。")
				}
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
					localStorage.setItem(userId + '_invoice_writeoff_list_column_width', JSON.stringify(arrayC))
				}
			},
			setting() {
				this.settingVisible = true;
				this.frow.businessScope = this.query.businessScope
			},
			showFlagSearch() {
				this.showFlag = !this.showFlag;
				this.setHeight();
			},
			setHeight() {
				this.$nextTick(() => {
					let invoice_writeoff_list_header = this.$refs.invoice_writeoff_list_header.offsetHeight;
					let invoice_writeoff_list_footer = this.$refs.invoice_writeoff_list_footer.offsetHeight;
					let heightS = window.innerHeight - 165 - invoice_writeoff_list_header - invoice_writeoff_list_footer;
					this.tableHeight = heightS + "px";
				});
			},
			sortBykey(ary, key) {
				return ary.sort(function(a, b) {
					let x = a[key]
					let y = b[key]
					return ((x < y) ? -1 : (x > y) ? 1 : 0)
				})
			},
			addPullRightClass({
				row,
				column,
				rowIndex,
				columnIndex
			}) {
				return ""
			},
			//标题 style
			addCellStayle(data) {
				return "";
			},

			toUpperCaseValue(val) {
				return val.toUpperCase();
			},
			handleCommand(command) {
				if (command == 'deleteInvoice') {
					this.deleteInvoice(this.frow);
				} else if (command == 'invoiceFiles') {
					this.invoiceFiles();
				}
			},
			handleChange(command) {
				this.frow = command
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

			exportExcel() {
				this.$confirm('是否根据结果字段导出数据？', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning',
					center: true
				}).then(() => {
					//从数据库查询设置信息
					let pageName = '财务结算管理/收入对账/发票核销单';
					this.$axios.get2("/hrs/user/getUserPageSet?pageName=" + pageName)
						.then(function(response) {
							let invoice_writeoff_list_column = response.data.data;
							if (invoice_writeoff_list_column && invoice_writeoff_list_column.length > 0) {
								this.query.columnStrs = JSON.stringify(invoice_writeoff_list_column);
							} else {
								this.query.columnStrs = this.columnStrs;
							}
							this.exportExcelSure();
						}.bind(this));
				}).catch(() => {
					this.query.columnStrs = this.columnStrs;
					this.exportExcelSure();
				});
			},
			exportExcelSure() {
				if (this.query.columnStrs) {
					let columnList = JSON.parse(this.query.columnStrs);
					columnList = this.setLabel(columnList);
					this.query.columnStrs = JSON.stringify(columnList);
				}
				this.$axios.post3('/afbase/cssIncomeInvoiceDetailWriteoff/exportExcelList', this.query)
					.then(function(response) {
						var blob = new Blob([response.data], {
							type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8'
						});
						var downloadElement = document.createElement('a');
						var href = window.URL.createObjectURL(blob); // 创建下载的链接
						downloadElement.href = href;
						downloadElement.download = '收入对账核销单列表' + '.xls'; // 下载后文件名
						document.body.appendChild(downloadElement);
						downloadElement.click(); // 点击下载
						document.body.removeChild(downloadElement); // 下载完成移除元素
						window.URL.revokeObjectURL(href); // 释放掉blob对象
					}.bind(this));
			},
			queryList() {
				this.query.columnStrs = '';
				this.setHeight()

				//从数据库查询设置信息
				let pageName = '财务结算管理/收入对账/发票核销单';
				this.$axios.get2("/hrs/user/getUserPageSet?pageName=" + pageName)
					.then(function(response) {
						let invoice_list_column = response.data.data;
						if (invoice_list_column && invoice_list_column.length > 0) {
							this.tableColumns = this.sortBykey(invoice_list_column, 'index');
						} else {
							this.tableColumns = this.sortBykey(columns.info, 'index');
						}
						this.loading = true

						this.tableColumns = this.setLabel(this.tableColumns);

						this.$axios.get2('/afbase/cssIncomeInvoiceDetailWriteoff/invoiceWriteoffList?size=' + this.pageConf.pageSize + '&current=' + this.pageConf.pageCode, this.query).then((response) => {
							this.data = response.data.data.records;
							this.pageConf.totalPage = response.data.data.total;
							if (this.data.length == 0) {
								let current = Math.ceil(this.pageConf.totalPage / this.pageConf.pageSize);
								this.queryList2(current);
							} else {

								this.allCheck = false
								this.loading = false
							}
						}).catch((error) => {
							this.loading = false
							console.log(error);
						});
					}.bind(this));
			},
			queryList2(current) {
				this.$axios.get2('/afbase/cssIncomeInvoiceDetailWriteoff/invoiceWriteoffList?size=' + this.pageConf.pageSize + '&current=' + current, this.query).then((response) => {
					this.data = response.data.data.records;
					this.pageConf.totalPage = response.data.data.total;
					this.data.forEach((row) => {
						if (row.isParent == true) {
							this.expandRowKeys.push(row.debitNoteId)
						}
					})
					this.selectionData = []
					this.allCheck = false
					this.loading = false
				}).catch((error) => {
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
			setLabel(tableColumns) {
				return tableColumns;
			}
		}
	}
</script>
<style type="text/css">
	.orderListPage .el-input__icon {
		line-height: 30px !important;
	}

	.orderListPage .el-form-item__content {
		line-height: 30px !important;
	}

	.orderListPage .el-input-group__prepend {
		padding: 0 6px;
	}

	.orderListPage .widthWithThree .el-input-group__prepend {
		padding: 0 13px !important;
	}
</style>
