<template>
	<el-dialog :title="'账单 - '+operationName" width="1300px" :visible.sync="visible" :close-on-press-escape="false" :close-on-click-modal="false" :before-close="handleClose" append-to-body>
		<div>
			<div style="position: relative;left: 21px;top: 30px;z-index: 10;">
				<el-checkbox v-model="allCheck" @change="changeAllCheck"></el-checkbox>
			</div>
			<el-table :span-method="arraySpanMethod" :indent="0" v-loading="loading" stripe :data="data" row-key="debitNoteId" :expand-row-keys="expandRowKeys" border :tree-props="{children: 'children'}">
				<el-table-column fixed type="index" label=" " width="50" align="center">
					<template slot-scope="scope">
						<el-checkbox v-model="scope.row.checkBox" @change="changeRowCheck(scope.row)"></el-checkbox>
					</template>
				</el-table-column>
				<el-table-column header-align="center" fixed width="150" label="账单编号">
					<template slot-scope="scope">
						<span v-if="scope.row.isParent===true">
							<span style="font-weight: bold;">{{scope.row.customerName}}</span>
						</span>
						<span v-else style="margin-left: -20px;">{{scope.row.debitNoteNum}}</span>
					</template>
				</el-table-column>
				<el-table-column fixed align="center" prop="statementNum" width="150" label="清单号"></el-table-column>
				<el-table-column fixed align="center" prop="debitNoteDate" label="账单日期" width="90"></el-table-column>
				<el-table-column v-if="this.frow.businessScope!='IO'&&this.frow.businessScope!='LC'" align="center" prop="awbNumber" width="110" label="主单号">
				</el-table-column>
				<el-table-column align="center" prop="orderCode" label="订单号" width="120"></el-table-column>
				<el-table-column align="center" label="账单金额" width="140">
					<template slot-scope="scope">
						<p v-for="(item,index) in scope.row.currencyAmount.split('  ')" :key="index">
							<font v-if="item.indexOf('CNY')>-1">{{item}}</font>
							<font v-else style="color: red;">{{item}}</font>
						</p>
					</template>
				</el-table-column>
				<el-table-column align="center" prop="functionalAmount" label="本币金额" :formatter="floatMountFormat" width="120"></el-table-column>
				<el-table-column align="center" prop="creatorName" label="操作人" width="200"></el-table-column>
				<el-table-column align="center" prop="createTime" label="操作时间"></el-table-column>
			</el-table>
		</div>
		<div style="margin-top: 10px;margin-bottom: 10px;margin-left: 5px;" v-if="operationName=='删除'">
			<el-button size="small" type="primary" @click="doDelete">删除账单</el-button>
		</div>
		<div style="margin-top: 10px;margin-bottom: 10px;margin-left: 5px;" v-if="operationName=='完成'">
			<el-button size="small" type="primary" @click="doFinish">财务锁账</el-button>
		</div>
		<div style="margin-top: 10px;margin-bottom: 10px;margin-left: 5px;" v-if="operationName=='撤销'">
			<el-button size="small" type="primary" @click="doCancel">撤销完成</el-button>
		</div>

	</el-dialog>
</template>
<script>
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
				operationName: '',
				expandRowKeys: [],
				allCheck: false,
				loading: false,
				data: [],
				ffrow: {
					data: []
				},
				query: {
					orderCode: '',
					businessScope: ''
				},
				businessCodes: [],
				selectionData: []
			}
		},
		inject: ['queryIncomeCostList', 'queryLogList'],
		created: function() {
			this.operationName = this.frow.operationName;
			this.query.orderCode = this.frow.orderCode;
			this.query.businessScope = this.frow.businessScope;
			this.queryList();
		},

		methods: {

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
				this.loading = true
				this.$axios.get2('/afbase/debitNote/selectOperation', this.query).then(
					(response) => {
						this.data = response.data.data
						if (this.data.length != 0) {
							this.data.forEach((row) => {
								if (row.isParent == true) {
									this.expandRowKeys.push(row.debitNoteId)
								}
							})
						}
						this.loading = false
					}).catch((error) => {
					this.loading = false
					console.log(error);
				});
			},
			handleClose() {
				this.$emit('update:visible', false);
			},
			floatMountFormat(row, column) {
				if (row[column.property] === 0) {
					return '0.00'
				} else if (row[column.property] == null || row[column.property] == '') {
					return ''
				} else {
					return this.milliFormat(row[column.property].toString())
				}
			},
			milliFormat(s) { //添加千位符
				s = s.replace(/^(\d*)$/, "$1.")
				s = (s + "00").replace(/(\d*\.\d\d)\d*/, "$1")
				s = s.replace(".", ",")
				let re = /(\d)(\d{3},)/
				while (re.test(s)) {
					s = s.replace(re, "$1,$2")
				}
				s = s.replace(/,(\d\d)$/, ".$1")
				return s.replace(/^\./, "0.")
			},
			handleSelectionChange(val) {
				this.ffrow.data = val
			},
			doDelete() {
				if (this.selectionData.length == 0) {
					this.openError('请至少选择一个账单')
					return
				}

				let aFlag = 0;
				let bFlag = 0;
				let cFlag = 0;
				let aDebitNoteNums = '';
				let bDebitNoteNums = '';
				let cDebitNoteNums = '';
				let debitNoteNums = '';
				let debitNoteIds = '';
				this.selectionData.forEach((row) => {
					if (row.statementId) {
						aFlag = 1;
						aDebitNoteNums = aDebitNoteNums + row.debitNoteNum + ',';
					}
					if (row.invoiceId) {
						bFlag = 1;
						bDebitNoteNums = bDebitNoteNums + row.debitNoteNum + ',';
					}
					if (row.writeoffComplete != null) {
						cFlag = 1;
						cDebitNoteNums = cDebitNoteNums + row.debitNoteNum + ',';
					}
					if (debitNoteIds == '') {
						debitNoteIds = debitNoteIds + row.debitNoteId;
					} else {
						debitNoteIds = debitNoteIds + ',' + row.debitNoteId;
					}
					if (debitNoteNums == '') {
						debitNoteNums = debitNoteNums + row.debitNoteNum;
					} else {
						debitNoteNums = debitNoteNums + ',' + row.debitNoteNum;
					}

				})
				if (aFlag === 1) {
					this.openError(aDebitNoteNums + "已做清单的账单 不能删除");
					return;
				}
				if (bFlag === 1) {
					this.openError(bDebitNoteNums + "已做发票的账单 不能删除");
					return;
				}
				if (cFlag === 1) {
					this.openError(cDebitNoteNums + "已核销的账单 不能删除");
					return;
				}
				this.$confirm('此操作将永久删除,不可恢复, 是否继续?', '注意', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning',
					center: false
				}).then(() => {
					let params = {
						debitNoteIds: debitNoteIds,
						debitNoteNums: debitNoteNums,
						orderCode: this.frow.orderCode,
						orderUuid: this.frow.orderUuid,
						awbNumber: this.frow.awbNumber,
						businessScope: this.frow.businessScope,
						awbUuid: this.frow.awbUuid
					}
					this.$axios.post('/afbase/debitNote/doDelete', params).then((response) => {
						if (response.data.code == 0) {
							this.openSuccess("删除成功");
							this.queryIncomeCostList();
							// this.queryLogList();
							this.handleClose();
						} else {
							this.openError(response.data.messageInfo);
						}
					}).catch(function(error) {
						console.log(error);
					});

				}).catch(() => {
				});

			},
			doFinish() {
				if (this.selectionData.length == 0) {
					this.openError('请至少选择一个账单')
					return
				}

			},
			doCancel() {
				if (this.selectionData.length == 0) {
					this.openError('请至少选择一个账单')
					return
				}

			},
			arraySpanMethod({
				row,
				column,
				rowIndex,
				columnIndex
			}) {
				if (row.isParent === true) {
					if (columnIndex === 1) {
						if (this.frow.businessScope == 'IO' || this.frow.businessScope == 'LC') {
							return [1, 11]
						} else {
							return [1, 12]
						}
					} else if (columnIndex === 0) {
						return [1, 1]
					} else {
						return [0, 0]
					}
				}
			},
			changeAllCheck(selection) {
				this.data.forEach((row) => {
					if (selection) {
						row.checkBox = true
					} else {
						row.checkBox = false
					}
					this.changeRowCheck(row)
				})
			},
			changeRowCheck(row) {
				if (row.isParent) {
					row.children.forEach((child) => {
						if (row.checkBox) {
							child.checkBox = true
						} else {
							child.checkBox = false
						}
					})
				}
				this.fillSelectionData()
			},
			fillSelectionData() {
				let arr = []
				this.data.forEach((row) => {
					arr = arr.concat(row.children.filter(item => item.checkBox))
				})
				this.selectionData = arr
			}
		}
	}
</script>
