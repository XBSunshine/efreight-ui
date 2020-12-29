<template>
	<div class="warp-main">
		<el-form :inline="false" :model="query" label-width="80px" class="css_report_no_writeoff">
			<div ref="css_report_no_writeoff_header">
				<el-row>
					<el-col class="elementWidth">
						<el-form-item label-width="10px">
							<el-input style="width: 200px;" v-model="query.coopCode" auto-complete="off" clearable>
								<template slot="prepend">客户代码</template>
							</el-input>
						</el-form-item>
					</el-col>
					<el-col class="elementWidth">
						<el-form-item label-width="10px">
							<el-input style="width: 300px;" v-model="query.coopName" auto-complete="off" clearable>
								<template slot="prepend">客户名称</template>
							</el-input>
						</el-form-item>
					</el-col>

					<el-col class="elementWidth">
						<el-form-item label-width="10px">
							<el-button type="primary" size="small" @click="queryList" style="margin-left: 2px;padding-left: 8px;padding-right: 8px;">查询</el-button>
							<el-button style="margin-left: 4px;padding-left: 8px;padding-right: 8px;background-color:#FFF;color:#409EFF" type="primary" size="small" v-on:click="setting">设置</el-button>
							<el-button style="margin-left: 3px;padding-left: 8px;padding-right: 8px;background-color:#FFF;color:#409EFF" type="primary" size="small" v-on:click="exportExcel">导出</el-button>
						</el-form-item>
					</el-col>
				</el-row>

				</el-row>
			</div>
		</el-form>
		<el-table ref="table" v-loading="loading" :max-height="tableHeight" stripe :data="data" border @header-dragend="cellWidth" :cell-class-name="cellClassName" @cell-click="handleCellClick" show-summary :summary-method="handleSummaryMethod">
			<template v-for="(item,index) in tableColumns">
				<el-table-column v-if="item.label=='客户名称'" :prop="item.prop" :label="item.label" :width="item.width" header-align="center" :align="item.align" :sortable="item.sortable">
					<template slot-scope="scope">
						<a href="javascript:void(0)" @click="cellClick(scope.row,item.label)" style="color: #137DFA;text-decoration: underline;">{{scope.row[item.prop]}}</a>
					</template>
				</el-table-column>
				<el-table-column v-else-if="item.label=='应收未核销本币金额'||item.label=='应付未核销本币金额'" :prop="item.prop" header-align="center" :label="item.label" :width="item.width" :align="item.align" :sortable="item.sortable" :formatter="formatter">
				</el-table-column>
				<el-table-column v-else :prop="item.prop" :label="item.label" :width="item.width" header-align="center" :align="item.align" :sortable="item.sortable" :formatter="formatter"></el-table-column>
			</template>
			<el-table-column></el-table-column>
		</el-table>
		<detail ref="addMission" v-if="detailVisible" :visible.sync="detailVisible" :frow="frow"></detail>
		<setVisibleTag ref="addMission" v-if="setVisible" :visible.sync="setVisible"></setVisibleTag>
	</div>
</template>
<script>
	import Detail from './cssReportNoWriteoff/css_report_no_writeoff_detail'
	import columns from './cssReportNoWriteoff/css_report_no_writeoff_column.json'
	import setVisibleVue from './cssReportNoWriteoff/css_report_no_writeoff_setting'
	export default {
		data() {
			return {
				tableHeight: "750px",
				loading: false,
				data: [],
				tableColumns: [],
				detailVisible: false,
				setVisible: false,
				query: {
					coopCode: '',
					coopName: '',
					columnStrs: ''
				}
			}
		},
		components: {
			'setVisibleTag': setVisibleVue,
			'detail': Detail
		},
		provide() {
			return {
				queryList: this.queryList
			}
		},
		created: function() {
			//从数据库查询设置信息
			let pageName = '报表统计分析/往来情况查询';
			this.$axios.get2("/hrs/user/getUserPageSet?pageName=" + pageName)
				.then(function(response) {
					let css_report_no_writeoff_list_column = response.data.data;
					if (css_report_no_writeoff_list_column && css_report_no_writeoff_list_column.length > 0) {
						let arrayC = css_report_no_writeoff_list_column
						if (arrayC && arrayC.length > 0) {
							this.tableColumns = this.sortBykey(arrayC, 'index');
						}
					} else {
						let str = JSON.stringify(columns.css_report_no_writeoff);
						this.tableColumns = this.sortBykey(JSON.parse(str), 'index');
					}
				}.bind(this));
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
					localStorage.setItem(userId + '_css_report_no_writeoff_column_width', JSON.stringify(arrayC))
				}
				this.$refs.table.doLayout()
			},
			sortBykey(ary, key) {
				return ary.sort(function(a, b) {
					let x = a[key]
					let y = b[key]
					return ((x < y) ? -1 : (x > y) ? 1 : 0)
				})
			},
			handleCellClick(row, column, cell, event) {
				if (column.property == 'incomeNoWriteoffFunctionalAmount') {
					this.cellClick(row, '应收未核销本币金额')
				} else if (column.property == 'costNoWriteoffFunctionalAmount') {
					this.cellClick(row, '应付未核销本币金额')
				}
			},
			cellClick(row, flag) {
				this.frow = row
				this.frow.flag = flag
				this.detailVisible = true
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
			queryList() {
				//从数据库查询设置信息
				let pageName = '报表统计分析/往来情况查询';
				this.$axios.get2("/hrs/user/getUserPageSet?pageName=" + pageName)
					.then(function(response) {
						let css_report_no_writeoff_list_column = response.data.data;
						if (css_report_no_writeoff_list_column && css_report_no_writeoff_list_column.length > 0) {
							let arrayC = css_report_no_writeoff_list_column
							if (arrayC && arrayC.length > 0) {
								this.tableColumns = this.sortBykey(arrayC, 'index');
							}
						} else {
							let str = JSON.stringify(columns.css_report_no_writeoff);
							this.tableColumns = this.sortBykey(JSON.parse(str), 'index');
						}
						this.loading = true
						this.query.columnStrs = ''
						this.$axios.get2('/afbase/cssReportNoWriteoff', this.query).then((resp) => {
							this.data = resp.data.data;
							this.loading = false
						}).catch((error) => {
							this.loading = false
							console.log(error);
						});
					}.bind(this));
			},
			exportExcel() {
				this.$confirm('是否根据结果字段导出数据？', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning',
					center: true
				}).then(() => {
					this.query.columnStrs = JSON.stringify(this.tableColumns);
					this.exportExcelSure();
				}).catch(() => {
					let str = JSON.stringify(columns.css_report_no_writeoff);
					let excelList = this.sortBykey(JSON.parse(str), 'index');
					this.query.columnStrs = JSON.stringify(excelList);
					this.exportExcelSure();
				});

			},
			exportExcelSure() {
				if (this.data.length == 0) {
					this.openError("查询结果没有数据，不允许导出");
					return;
				}
				this.$axios.post3('/afbase/cssReportNoWriteoff/exportExcelList', this.query)
					.then(function(response) {
						var blob = new Blob([response.data], {
							type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8'
						});
						var downloadElement = document.createElement('a');
						var href = window.URL.createObjectURL(blob); // 创建下载的链接
						downloadElement.href = href;
						downloadElement.download = '往来情况查询' + '.xls'; // 下载后文件名
						document.body.appendChild(downloadElement);
						downloadElement.click(); // 点击下载
						document.body.removeChild(downloadElement); // 下载完成移除元素
						window.URL.revokeObjectURL(href); // 释放掉blob对象
					}.bind(this));
			},
			formatter(row, column, cellValue, index) {
				if (column.property == 'incomeNoWriteoffFunctionalAmount') {
					return row[column.property + 'Str']
				} else if (column.property == 'costNoWriteoffFunctionalAmount') {
					return row[column.property + 'Str']
				} else if (column.property == 'functionalAmountSubstraction') {
					return row[column.property + 'Str']
				} else {
					return row[column.property]
				}
			},
			cellClassName({
				row,
				column,
				rowIndex,
				columnIndex
			}) {
				if (column.property == 'incomeNoWriteoffFunctionalAmount' || column.property == 'costNoWriteoffFunctionalAmount') {
					return 'css_report_no_writeoff_cellstyle'
				}
			},
			handleSummaryMethod({
				columns,
				data
			}) {
				console.log(columns)
				let first = ''
				let second = ''
				let third = ''
				let fourth = ''
				data.forEach(row => {
					if (columns[1] && 'incomeNoWriteoffFunctionalAmount;costNoWriteoffFunctionalAmount;functionalAmountSubstraction'.indexOf(columns[1].property) > -1) {
						if (first !== '') {
							first += row[columns[1].property]
						} else {
							first = row[columns[1].property]
						}
					}
					if (columns[2] && 'incomeNoWriteoffFunctionalAmount;costNoWriteoffFunctionalAmount;functionalAmountSubstraction'.indexOf(columns[2].property) > -1) {
						if (second !== '') {
							second += row[columns[2].property]
						} else {
							second = row[columns[2].property]
						}
					}
					if (columns[3] && 'incomeNoWriteoffFunctionalAmount;costNoWriteoffFunctionalAmount;functionalAmountSubstraction'.indexOf(columns[3].property) > -1) {
						if (third !== '') {
							third += row[columns[3].property]
						} else {
							third = row[columns[3].property]
						}
					}
					if (columns[4] && 'incomeNoWriteoffFunctionalAmount;costNoWriteoffFunctionalAmount;functionalAmountSubstraction'.indexOf(columns[4].property) > -1) {
						if (fourth !== '') {
							fourth += row[columns[4].property]
						} else {
							fourth = row[columns[4].property]
						}
					}
				})
				return ['合计', first !== '' ? first.toFixed(2).replace(/\d{1,3}(?=(\d{3})+(\.\d*)?$)/g, '$&,') : '', second !== '' ? second.toFixed(2).replace(/\d{1,3}(?=(\d{3})+(\.\d*)?$)/g, '$&,') : '', third !== '' ? third.toFixed(2).replace(/\d{1,3}(?=(\d{3})+(\.\d*)?$)/g, '$&,') : '', fourth !== '' ? fourth.toFixed(2).replace(/\d{1,3}(?=(\d{3})+(\.\d*)?$)/g, '$&,') : '']
			}

		}
	}
</script>
<style>
	.css_report_no_writeoff .el-table .cell {
		white-space: pre-line !important;
		/*保留换行符*/
	}

	.css_report_no_writeoff .table_pay tr.current-row>td {
		background: #FDF5E6 !important;
	}

	.css_report_no_writeoff .el-input__icon {
		line-height: 30px !important;
	}

	.css_report_no_writeoff .el-form-item__content {
		line-height: 30px !important;
	}

	.css_report_no_writeoff .el-input-group__prepend {
		padding: 0 6px;
	}

	.css_report_no_writeoff .widthWithThree .el-input-group__prepend {
		padding: 0 13px !important;
	}

	.css_report_no_writeoff .el-checkbox__inner {
		background-color: #FFF !important;
	}

	.css_report_no_writeoff .el-button {
		margin-top: -5px !important
	}

	.css_report_no_writeoff_cellstyle {
		color: #137DFA;
	}
</style>
