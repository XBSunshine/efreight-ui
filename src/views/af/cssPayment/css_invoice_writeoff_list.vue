<template>
	<div class="warp-main">
		<el-form :model="query" label-width="10px" class="paymentWriteoffListPage">
			<div ref="css_invoice_writeoff_header">
				<el-row>
					<el-col class="elementWidth">
						<el-form-item>
							<el-input style="width:155px;">
								<template slot="prepend">业务范畴</template>
								<el-select slot="suffix" v-model="query.businessScope" @change="queryCssFinacialAccount" placeholder="请选择" style="width:86px;margin-right: -5px;">
									<el-option v-for="item in businessCodes" :key="item.paramRanking" :label="item.paramText" :value="item.paramText">
									</el-option>
								</el-select>
							</el-input>
						</el-form-item>
					</el-col>
					<el-col class="elementWidth">
						<el-form-item>
							<el-input v-model="query.customerName" clearable auto-complete="off" clearable style="width:245px;">
								<template slot="prepend">供&nbsp;&nbsp;&nbsp;&nbsp;应&nbsp;&nbsp;&nbsp;商</template>
							</el-input>
						</el-form-item>
					</el-col>
					<el-col class="elementWidth">
						<el-form-item>
							<el-input style="width: 245px;" v-model="query.invoiceNum" clearable auto-complete="off">
								<template slot="prepend">&nbsp;&nbsp;发&nbsp;&nbsp;票&nbsp;&nbsp;号&nbsp;&nbsp;</template>
							</el-input>
						</el-form-item>
					</el-col>
					<el-col class="elementWidth">
						<el-form-item>
							<el-input style="width:219px;">
								<template slot="prepend">核&nbsp;销&nbsp;日&nbsp;期</template>
								<el-date-picker slot="suffix" v-model="query.writeoffDateStart" clearable type="date" value-format="yyyy-MM-dd" placeholder="开始日期" style="width: 138px;margin-right: -5px;">
								</el-date-picker>
							</el-input>
							<span>-</span>
							<el-date-picker v-model="query.writeoffDateEnd" clearable type="date" value-format="yyyy-MM-dd" placeholder="结束日期" style="width: 135px;">
							</el-date-picker>
						</el-form-item>
					</el-col>
					<el-col class="elementWidth">
						<el-form-item label-width="20px">
							<el-button type="text" size="mini" v-if=showFlag v-on:click="showFlag=false;setHeight()">收起</el-button>
							<el-button type="text" size="mini" v-if=!showFlag v-on:click="showFlag=true;setHeight()">展开</el-button>
							<el-button style="padding: 9px 7px;margin-left: 0px;" type="primary" size="small" @click="queryList">查询</el-button>
						</el-form-item>
					</el-col>
				</el-row>
				<el-row v-show="showFlag">
					<el-col class="elementWidth">
						<el-form-item>
							<el-input style="width:155px;">
								<template slot="prepend">币&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;种</template>
								<el-select slot="suffix" v-model="query.currency" placeholder="请选择" style="width:86px;margin-right: -5px;" clearable>
									<el-option v-for="item in currencys" :key="item.currencyCode" :label="item.currencyCode" :value="item.currencyCode">
									</el-option>
								</el-select>
							</el-input>
						</el-form-item>
					</el-col>
					<el-col class="elementWidth">
						<el-form-item>
							<el-input style="width: 245px;" v-model="query.writeoffNum" clearable auto-complete="off">
								<template slot="prepend">核&nbsp;销&nbsp;单&nbsp;号</template>
							</el-input>
						</el-form-item>
					</el-col>
					<el-col class="elementWidth">
						<el-form-item>
							<el-input style="width: 245px;" v-model="query.paymentNum" clearable auto-complete="off">
								<template slot="prepend">对账单编号&nbsp;</template>
							</el-input>
						</el-form-item>
					</el-col>
					<el-col class="elementWidth">
						<el-form-item>
							<el-input style="width:219px;">
								<template slot="prepend">操&nbsp;作&nbsp;时&nbsp;间</template>
								<el-date-picker slot="suffix" v-model="query.createTimeStart" clearable type="date" value-format="yyyy-MM-dd 00:00:00" placeholder="开始日期" style="width: 138px;margin-right: -5px;">
								</el-date-picker>
							</el-input>
							<span>-</span>
							<el-date-picker v-model="query.createTimeEnd" clearable type="date" value-format="yyyy-MM-dd 23:59:59" placeholder="结束日期" style="width: 135px;">
							</el-date-picker>
						</el-form-item>
					</el-col>
					<el-col class="elementWidth">
						<el-form-item label-width="33px">
							<el-button style="margin-left: 17px;padding-left: 8px;padding-right: 8px;background-color:#FFF;color:#409EFF" type="primary" size="small" v-on:click="setting">设置</el-button>
							<el-button style="margin-left: 7px;padding-left: 8px;padding-right: 8px;background-color:#FFF;color:#409EFF" type="primary" size="small" v-on:click="exportExcel">导出</el-button>
						</el-form-item>
					</el-col>
				</el-row>
				<el-row v-show="showFlag">
					<el-col class="elementWidth">
						<el-form-item>
							<el-input style="width:410px;" v-model="query.creatorName" clearable auto-complete="off">
								<template slot="prepend">核&nbsp;&nbsp;销&nbsp;&nbsp;人</template>
							</el-input>
						</el-form-item>
					</el-col>
					<el-col class="elementWidth">
						<el-form-item>
							<el-input auto-complete="off" style="width:245px;">
								<template slot="prepend">
									<span>&nbsp;&nbsp;&nbsp;&nbsp;科&nbsp;&nbsp;&nbsp;&nbsp;目&nbsp;&nbsp;&nbsp;&nbsp;</span>
								</template>
								<el-select slot="suffix" v-model="query.financialAccountCode" placeholder="请选择" style="width:158px;margin-right: -5px;" clearable>
									<el-option v-for="item in financialAccounts" :key="item.financialAccountId" :label="item.financialAccountName+' '+item.financialAccountCode" :value="item.financialAccountCode">
										<span>{{item.financialAccountName}} {{item.financialAccountCode}}&nbsp;&nbsp;&nbsp;</span>
									</el-option>
								</el-select>
							</el-input>
						</el-form-item>
					</el-col>
					<el-col class="elementWidth">
						<el-form-item>
							<el-input style="width:219px;">
								<template slot="prepend">发&nbsp;票&nbsp;日&nbsp;期</template>
								<el-date-picker slot="suffix" v-model="query.invoiceDateStart" clearable type="date" value-format="yyyy-MM-dd" placeholder="开始日期" style="width: 138px;margin-right: -5px;">
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
		<div>
			<el-table v-loading="loading" :max-height="tableHeight" stripe :data="data" border :cell-style="addCellStayle" @header-dragend="cellWidth">
				<el-table-column fixed type="index" align="center" label="操作" width="60">
					<template slot-scope="scope">
						<el-dropdown v-if="scope.row.writeoffDate!=null" trigger="click" @command="handleCommand" @visible-change="handleChange(scope.row)">
							<i class="el-icon-s-operation"></i>
							<el-dropdown-menu slot="dropdown">
								<el-dropdown-item command="fileUpload" v-if="cssCostInvoiceWriteoffFileUploadPermission">附件</el-dropdown-item>
								<el-dropdown-item command="delete" v-if="cssCostInvoiceWriteoffDeletePermission">删除</el-dropdown-item>
								<el-dropdown-item></el-dropdown-item>
							</el-dropdown-menu>
						</el-dropdown>
						<span v-else>合计</span>
					</template>
				</el-table-column>
				<template v-for="(item,index) in tableColumns">
					<el-table-column v-if="item.prop=='amountWriteoff'" :key="index" :prop="item.prop" :label="item.label" :width="item.width" :align="item.align" :sortable="item.sortable" header-align="center">
						<template slot-scope="scope">
							<span v-if="scope.row.writeoffDate!=null">
								<p style="color: red;" v-if="scope.row.amountWriteoffStr.indexOf('CNY')==-1">{{scope.row.amountWriteoffStr}}</p>
								<p v-else>{{scope.row.amountWriteoffStr}}</p>
							</span>
							<span v-else v-for="(item,index) in scope.row.amountWriteoffStr.split('|')" :key="index">
								<p style="color: red;" v-if="item.indexOf('CNY')==-1">{{item}}</p>
								<p v-else>{{item}}</p>
							</span>
						</template>
					</el-table-column>
					<el-table-column v-else-if="item.prop=='filesList'" :key="index" :label="item.label" :width="item.width" header-align="center" :align="item.align">
						<template slot-scope="scope">
							<p v-for="file,index in scope.row.filesList" :key="index" style="cursor: pointer;color: blue;text-decoration: underline;" @click="clickFile(file.fileUrl)">{{file.fileName}}</p>
						</template>
					</el-table-column>
					<el-table-column v-else :prop="item.prop" :key="index" :label="item.label" :width="item.width" :align="item.align" :sortable="item.sortable" header-align="center" :formatter="formatter"></el-table-column>
				</template>
			</el-table>
		</div>
		<div ref="css_invoice_writeoff_footer">
			<el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="pageConf.pageCode" :page-sizes="pageConf.pageOption" :page-size.sync="pageConf.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="pageConf.totalPage">
			</el-pagination>
		</div>
		<setVisibleTag ref="addMission" v-if="setVisible" :visible.sync="setVisible"></setVisibleTag>
		<fileUpload ref="addMission" v-if="fileUploadVisible" :visible.sync="fileUploadVisible" :frow="frow"></fileUpload>
	</div>
</template>
<script>
	import setVisibleVue from './writeoff/css_writeoff_setting'
	import columns from './writeoff/css_wirteoff_column'
	import FileUpload from './fileUpload/file_upload_list'
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
					pageOption: [10, 50, 100]
				},
				viewVisible: false,
				fileUploadVisible: false,
				frow: {},
				query: {
					businessScope: 'AE',
					financialAccountCode: '',
					currency: '',
					customerName: '',
					writeoffDateStart: this.getDateTime(),
					writeoffDateEnd: '',
					paymentNum: '',
					writeoffNum: '',
					invoiceNum: '',
					creatorName: '',
					columnStrs: ''
				},
				businessCodes: [],
				financialAccounts: [],
				currencys: [],
				showFlag: false,
				setVisible: false,
				cssCostInvoiceWriteoffDeletePermission: false,
				cssCostInvoiceWriteoffFileUploadPermission: false
			}
		},
		created: function() {
			//按钮权限
			let buttonInfo = window.localStorage.getItem('buttonInfo')
			if (buttonInfo.indexOf('css_cost_invoice_writeoff_delete') > -1) {
				this.cssCostInvoiceWriteoffDeletePermission = true
			}
			if (buttonInfo.indexOf('css_cost_invoice_writeoff_fileUpload') > -1) {
				this.cssCostInvoiceWriteoffFileUploadPermission = true
			}
			//查询业务范畴
			this.$axios.get2('/afbase/category/paramsNew', {
				categoryName: "业务范畴"
			}).then(function(response) {
				this.businessCodes = response.data.data
			}.bind(this)).catch(function(error) {
				console.log(error);
			})
			//科目
			this.queryCssFinacialAccount()
			//查询币种
			this.$axios.get('/afbase/currency').then(function(response) {
				this.currencys = response.data.data;
			}.bind(this)).catch(function(error) {
				console.log(error);
			})
			//从数据库查询设置信息
			this.$axios.get("/hrs/user/getUserPageSet?pageName=财务结算管理/成本对账/核销单")
				.then(function(response) {
					let af_list_column = response.data.data;
					if (af_list_column && af_list_column.length > 0) {
						if (af_list_column && af_list_column.length > 0) {
							this.tableColumns = this.sortBykey(af_list_column, 'index');
						}
					} else {
						this.tableColumns = this.sortBykey(columns.cssWriteoffInfo, 'index');
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
			'fileUpload': FileUpload
		},
		methods: {
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
					localStorage.setItem(userId + '_css_payment_invoice_writeoff_list_column_width', JSON.stringify(arrayC))
				}
			},
			colomnSetCallback(columns) {
				this.tableColumns = columns
			},
			formatter(row, column) {
				if (column.property == 'creatorName') {
					if (row[column.property]) {
						return row[column.property].split(" ")[0]
					} else {
						return ''
					}
				} else if (column.property == 'invoiceAmount') {
					if (row[column.property]) {
						return row[column.property + 'Str']
					} else {
						return ''
					}
				} else {
					return row[column.property]
				}
			},
			//标题 stly
			addCellStayle(data) {
				if (data.column.property === "invoiceAmount") {
					let k = '';
					if (data.row.invoiceAmountStr && data.row.invoiceAmountStr.indexOf('CNY') == -1) {
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
				if (command == 'view') {
					this.showView()
				} else if (command == 'delete') {
					this.doDelete()
				} else if (command == 'fileUpload') {
					this.showFileUpload()
				}
			},
			handleChange(command) {
				this.frow = command
			},
			showFileUpload() {
				this.fileUploadVisible = true
				this.frow.flag = 'writeoff'
				this.frow.id = this.frow.invoiceDetailWriteoffId
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
				this.$confirm('您将删除' + this.frow.writeoffNum + '核销单,此操作不可恢复 , 是否继续?', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning',
					center: true
				}).then(() => {
					this.$axios.get("/afbase/cssCostInvoiceDetailWriteoff/checkIfCompleteVoucher/" + this.frow.invoiceDetailWriteoffId).then((response) => {
						this.$axios.deletes('/afbase/cssCostInvoiceDetailWriteoff/' + this.frow.invoiceDetailWriteoffId + '/' + this.frow.rowUuid).then((response) => {
							this.openSuccess("删除成功！")
							this.queryList();
						}).catch((error) => {
							this.openError("删除失败：" + error.response.data.messageInfo)
						})
					}).catch(error => {
						this.$confirm('当前核销单已制作凭证, 是否继续?', '提示', {
							confirmButtonText: '是',
							cancelButtonText: '否',
							type: 'warning'
						}).then(() => {
							this.$axios.deletes('/afbase/cssCostInvoiceDetailWriteoff/' + this.frow.invoiceDetailWriteoffId + '/' + this.frow.rowUuid).then((response) => {
								this.openSuccess("删除成功！")
								this.queryList();
							}).catch((error) => {
								this.openError("删除失败：" + error.response.data.messageInfo)
							});
						}).catch(() => {
							this.$message({
								type: 'info',
								message: '已取消删除'
							});
						});
					})

				}).catch(() => {
					this.$message({
						type: 'info',
						message: '已取消删除'
					});
				});

			},
			clickFile(url) {
				window.open(url)
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
			queryList() {
				this.loading = true
				this.setHeight()
				this.query.columnStrs = ''
				this.$axios.get2('/afbase/cssCostInvoiceDetailWriteoff?size=' + this.pageConf.pageSize + '&current=' + this.pageConf.pageCode, this.query).then((response) => {
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
				this.$axios.get2('/afbase/cssCostInvoiceDetailWriteoff?size=' + this.pageConf.pageSize + '&current=' + current, this.query).then((response) => {
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
					let css_invoice_writeoff_header = this.$refs.css_invoice_writeoff_header.offsetHeight;
					let css_invoice_writeoff_footer = this.$refs.css_invoice_writeoff_footer.offsetHeight;
					let heightS = window.innerHeight - 150 - css_invoice_writeoff_header - css_invoice_writeoff_footer;
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
					let excelList = this.sortBykey(columns.cssWriteoffInfo, 'index')
					this.query.columnStrs = JSON.stringify(excelList)
					this.exportExcelSure();
				});
			},
			exportExcelSure() {
				this.$axios.post3('/afbase/cssCostInvoiceDetailWriteoff/exportExcel', this.query)
					.then(function(response) {
						var blob = new Blob([response.data], {
							type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8'
						});
						var downloadElement = document.createElement('a');
						var href = window.URL.createObjectURL(blob); // 创建下载的链接
						downloadElement.href = href;
						downloadElement.download = '成本对账发票核销单' + '.xls'; // 下载后文件名
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
			getNumber(data) {
				return data.toFixed(2).replace(/\d{1,3}(?=(\d{3})+(\.\d*)?$)/g, '$&,');
			},
			getDateTime() {
				let theDate = new Date()
				let _year = theDate.getFullYear();
				let _month = theDate.getMonth();
				let _date = theDate.getDate();
				if (_month === 0) {
					_year = parseInt(_year) - 1;
					_month = 12;
				}
				if (_month < 10) {
					_month = "0" + _month;
				}
				if (_date < 10) {
					_date = "0" + _date;
				}
				return _year + "-" + _month + "-01";
			}
		}
	}
</script>
<style>
	.paymentWriteoffListPage .el-input__icon {
		line-height: 30px !important;
	}

	.paymentWriteoffListPage .el-form-item__content {
		line-height: 30px !important;
	}

	.paymentWriteoffListPage .el-input-group__prepend {
		padding: 0 6px;
	}

	.el-table .cell {
		white-space: pre-line !important;
		/*保留换行符*/
	}
</style>
