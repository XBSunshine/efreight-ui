<template>
	<div>
		<div v-show="!inbound.ifInbound||!frow.viewFlag">
			<el-table border v-loading="inbound.loading" :data="inbound.data" :row-class-name="inboundTableRowClassName">
				<el-table-column align="center" prop="orderCode" label="订单号" width="125"></el-table-column>
				<el-table-column align="center" prop="customerNumber" label="客户单号" width="130"></el-table-column>
				<el-table-column align="center" prop="orderSize" label="货物尺寸" :formatter="orderSizeFormat"></el-table-column>
				<el-table-column align="center" prop="orderPieces" label="入库件数" width="100"></el-table-column>
				<el-table-column align="center" prop="orderGrossWeight" label="入库毛重" width="120">
				</el-table-column>
				<el-table-column align="center" prop="orderVolume" label="入库体积" width="120">
				</el-table-column>
				<el-table-column align="center" prop="orderVolumeWeight" label="体积重量" :formatter="formatterNumber13" width="120">
				</el-table-column>
				<el-table-column align="center" prop="orderChargeWeight" label="计费重量" width="120">
				</el-table-column>
				<el-table-column align="center" prop="orderDimensions" label="密度" width="120">
				</el-table-column>
			</el-table>
			<el-row style="margin-top: 20px;;">
				<el-col class="elementWidth">
					<el-button :loading="inbound.buttonLoading" style="margin-left: 10px;margin-bottom: 10px;" size="small" type="primary" @click="deleteInbound" v-if="inbound.deleteInboundButtonFlag&&frow.viewFlag">删除出重</el-button>
					<el-button :loading="inbound.buttonLoading" style="margin-left: 10px;margin-bottom: 10px;" size="small" type="primary" @click="editInbound" v-if="inbound.editInboundButtonFlag&&frow.viewFlag">编辑出重</el-button>
				</el-col>
			</el-row>
		</div>
		<div v-show="inbound.ifInbound&&frow.viewFlag">
			<el-table border v-loading="inbound.loading" :data="inbound.data" :row-class-name="inboundTableRowClassName">
				<el-table-column align="center" prop="orderCode" label="订单号" width="125"></el-table-column>
				<el-table-column align="center" prop="customerNumber" label="客户单号" width="130"></el-table-column>
				<el-table-column align="center" prop="orderSize" label="货物尺寸" :formatter="orderSizeFormat"></el-table-column>
				<el-table-column align="center" label="编辑" width="80">
					<template slot-scope="scope">
						<div slot="reference" class="name-wrapper">
							<el-button style="padding: 7px 6px;" @click="editSize(scope.row)" size="mini" type="primary">编辑尺寸</el-button>
						</div>
					</template>
				</el-table-column>
				<el-table-column align="center" prop="orderPieces" label="入库件数" width="100">
					<template slot-scope="scope">
						<el-input @input="checkFloat(scope.row,'orderPieces')" maxlength="8" size="small" v-model="scope.row.orderPieces"></el-input>
					</template>
				</el-table-column>
				<el-table-column align="center" label="入库毛重" width="130">
					<template slot-scope="scope">
						<el-input @input="checkFloat(scope.row,'orderGrossWeight')" maxlength="9" @change="countChargeWeight();formatDecimalPlaces(scope.row,'orderGrossWeight')" size="small" v-model="scope.row.orderGrossWeight"></el-input>
					</template>
				</el-table-column>
				<el-table-column align="center" label="入库体积" width="110">
					<template slot-scope="scope">
						<el-input @input="checkFloat(scope.row,'orderVolume')" maxlength="11" @change="countVolumeWeightAndChargeWeight();formatDecimalPlaces(scope.row,'orderVolume')" size="small" v-model="scope.row.orderVolume"></el-input>
					</template>
				</el-table-column>
				<el-table-column align="center" label="体积重量" width="120">
					<template slot-scope="scope">
						<el-input @input="checkFloat(scope.row,'orderVolumeWeight')" @change="formatDecimalPlaces(scope.row,'orderVolumeWeight');countChargeWeight()" maxlength="9" size="small" v-model="scope.row.orderVolumeWeight"></el-input>
					</template>
				</el-table-column>
				<el-table-column align="center" label="计费重量" width="130">
					<template slot-scope="scope">
						<el-input @input="checkFloat(scope.row,'orderChargeWeight')" @change="formatDecimalPlaces(scope.row,'orderChargeWeight')" maxlength="9" size="small" v-model="scope.row.orderChargeWeight"></el-input>
					</template>
				</el-table-column>
				<el-table-column align="center" label="密度" width="110">
					<template slot-scope="scope">
						<el-input disabled @input="checkFloat(scope.row,'orderDimensions')" maxlength="9" size="small" v-model="scope.row.orderDimensions"></el-input>
					</template>
				</el-table-column>
			</el-table>
			<el-row style="margin-top: 20px;">
				<el-col class="elementWidth">
					<el-button :loading="inbound.buttonLoading" v-if="inbound.inboundButtonFlag&&inbound.inboundButtonPermission" size="small" style="margin-left: 10px;margin-bottom: 10px;" type="primary" @click="submitInbound">保存</el-button>
					<el-button :loading="inbound.buttonLoading" v-if="inbound.inboundEditButtonFlag" size="small" style="margin-left: 10px;margin-bottom: 10px;" type="primary" @click="submitEditInbound">保存</el-button>
				</el-col>
			</el-row>
			<size ref="addMission" v-if="inbound.sizeVisible" :visible.sync="inbound.sizeVisible" :frow="inbound.ffrow"></size>
		</div>
	</div>
</template>
<style>
	.el-table .warning-row2 {
		background: oldlace;
		color: #409EFF;
		font-weight: bold !important;
	}

	.el-table .warning-row1 {
		background: oldlace;
		font-weight: bold !important;
	}

	.el-table .warning-row0 {
		color: #409EFF;
	}

	.el-table .cell {
		white-space: pre-line !important;
		/*保留换行符*/
	}

	.el-table .hidden_row {
		display: none;
		/*保留换行符*/
	}
</style>
<script>
	//出重
	import Size from '@/views/public/size_edit'
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
				inbound: {
					loading: false,
					buttonLoading: false,
					data: [],
					sizeVisible: false,
					ffrow: {},
					ifInbound: false,
					inboundButtonFlag: false,
					inboundButtonPermission: false,
					deleteInboundButtonFlag: false,
					editInboundButtonFlag: false,
					inboundEditButtonFlag: false
				},
				orderLCDigitsWeight: 1,
				orderLCDigitsVolume: 3,
				orderLCDigitsChargeWeight: 2
			};
		},
		inject: ['findByPage'],
		components: {
			Size
		},
		provide() {
			return {
				sizeEditCallBack: this.sizeCallback
			}
		},
		methods: {
			openSuccess() {
				this.$notify({
					title: '',
					message: '操作成功',
					type: 'success',
					position: 'bottom-right'
				});
			},
			inboundSuccess(info) {
				this.$notify({
					title: '',
					message: info,
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

			//出重开始
			formatterNumber13(row, column) {
				if (row.orderVolumeWeight === '' || row.orderVolumeWeight === 'null' || row.orderVolumeWeight == null) {
					return "";
				} else {
					return parseFloat(row.orderVolumeWeight).toFixed(1);
				}
			},
			inboundTableRowClassName({
				row,
				rowIndex
			}) {
				if (this.inbound.data != null && this.inbound.data.length > 1 && rowIndex == 0) {
					return 'hidden_row'
				}
				return ''
			},
			queryInboundList() {
				this.inbound.loading = true
				this.$axios.get("/sc/lcInbound/" + this.frow.orderId).then(response => {
					if (response.data.code == 0) {
						this.inbound.data = response.data.data
						this.formatDecimalPlaces(this.inbound.data[0], 'orderGrossWeight')
						this.formatDecimalPlaces(this.inbound.data[0], 'orderVolume')
						this.formatDecimalPlaces(this.inbound.data[0], 'orderVolumeWeight')
						this.formatDecimalPlaces(this.inbound.data[0], 'orderChargeWeight')
						this.formatSize(this.inbound.data[0])
						if (response.data.data[0].orderId) {
							//已出重
							this.inbound.ifInbound = false
							this.inbound.inboundEditButtonFlag = true
							this.inbound.inboundButtonFlag = false
						} else {
							//未出重
							if (this.inbound.data[0].orderDimensions == null) {
								this.countOrderDimensions()
							}
							this.inbound.ifInbound = true
							this.inbound.inboundEditButtonFlag = false
							this.inbound.inboundButtonFlag = true
							if (!this.frow.viewFlag) {
								this.inbound.data = []
							}
						}
						this.inbound.loading = false
					} else {
						this.frow.viewFlag = false
						this.openError(response.data.messageInfo)
					}
				}).catch(error => {
					this.frow.viewFlag = false
					this.openError(error.response.data.messsageInfo)
				})
				this.afterOperationGetRowUuid()
			},
			orderSizeFormat(row, column) {
				if (row[column.property]) {
					return (row[column.property]).replace(/;/g, ";\n");
				} else {
					return ""
				}
			},

			formatSize(row) {
				//计算总计
				let sumSizeData = {}
				let sumSize = null
				if (row.orderSize != null && row.orderSize !== '') {
					let sizeList = row.orderSize.split(';')
					sizeList.forEach((size) => {
						let key = size.split('*')[0] + "*" + size.split('*')[1] + "*" + size.split('*')[2].split('/')[0]
						let val = parseInt(size.split('/')[1])
						if (sumSizeData[key] == null) {
							sumSizeData[key] = val
						} else {
							sumSizeData[key] += val
						}
					})
				}
				for (let prop in sumSizeData) {
					if (sumSize == null) {
						sumSize = prop + "/" + sumSizeData[prop]
					} else {
						sumSize += ";" + prop + "/" + sumSizeData[prop]
					}
				}
				row.orderSize = sumSize
			},
			sizeCallback(val) {
				if (val.value != '') {
					let pieces = null
					let volume = null
					let volume1 = null
					let volumeWeight = null

					val.value.split(';').forEach((size) => {
						if (pieces == null) {
							pieces = parseInt(size.split('/')[1])
						} else {
							pieces += parseInt(size.split('/')[1])
						}
						if (volume == null) {
							volume = parseInt(size.split('/')[1]) * parseFloat(size.split('*')[0]) * parseFloat(size.split('*')[1]) * parseFloat(size.split('*')[2].split('/')[0])
						} else {
							volume += parseInt(size.split('/')[1]) * parseFloat(size.split('*')[0]) * parseFloat(size.split('*')[1]) * parseFloat(size.split('*')[2].split('/')[0])
						}
					})
					if (volume == null || volume === '') {
						volumeWeight = 0 + "." + "000".substr(0, this.orderLCDigitsWeight)
					} else {
						volume1 = (volume / 1000000).toFixed(this.orderLCDigitsVolume)
						volumeWeight = (volume / 6000).toFixed(this.orderLCDigitsWeight)
					}

					this.inbound.data[0].orderPieces = pieces
					this.inbound.data[0].orderVolume = volume1
					this.inbound.data[0].orderVolumeWeight = volumeWeight
					this.inbound.data[0].orderSize = val.value
					this.formatSize(this.inbound.data[0])
				} else {
					this.inbound.data[0].orderPieces = null
					this.inbound.data[0].orderVolume = null
					this.inbound.data[0].orderVolumeWeight = null
					this.inbound.data[0].orderSize = ''
				}
				this.countChargeWeight()

			},
			editSize(row) {
				this.inbound.ffrow.planDimensions = row.orderSize
				this.inbound.ffrow.position = '陆运出重'
				this.inbound.sizeVisible = true;
			},
			submitInbound() {
				this.inbound.buttonLoading = true
				let BreakException = {}
				try {
					this.inbound.data.forEach((item) => {
						if (item.orderPieces === '' || item.orderPieces == null) {
							this.openError("件数不能为空")
							throw BreakException;
						}
						if (item.orderVolume === '' || item.orderVolume == null) {
							this.openError("体积不能为空")
							throw BreakException;
						}
						if (item.orderVolumeWeight === '' || item.orderVolumeWeight == null) {
							this.openError("体积重量不能为空")
							throw BreakException;
						}
						if (item.orderGrossWeight === '' || item.orderGrossWeight == null) {
							this.openError("毛重不能为空")
							throw BreakException;
						}
						if (item.orderChargeWeight === '' || item.orderChargeWeight == null) {
							this.openError("计费重量不能为空")
							throw BreakException;
						}
					})
				} catch (e) {
					this.inbound.buttonLoading = false
					return
				}
				this.inbound.data[0].rowUuid = this.frow.rowUuid
				this.inbound.data[0].orderId = this.frow.orderId
				this.inbound.data[0].orderUuid = this.frow.orderUuid
				this.$axios.post2('/sc/lcInbound', this.inbound.data[0])
					.then((respo) => {
						if (respo.data.code == 0) {
							this.inboundSuccess('出重完成')
							this.queryInboundList()
							this.findByPage()
						} else {
							this.openError(respo.data.messageInfo);
						}
						this.inbound.buttonLoading = false
					}).catch((error) => {
						this.inbound.buttonLoading = false
						this.openError(error.response.data.messageInfo);
					});

			},
			deleteInbound() {
				this.$confirm('此操作将永久删除,不可恢复, 是否继续?', '注意', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning',
					center: true
				}).then(() => {
					this.inbound.buttonLoading = true
					this.$axios.deletes('/sc/lcInbound/' + this.inbound.data[0].inboundId + '/' + this.frow.rowUuid)
						.then((response) => {
							if (response.data.code == 0) {
								this.openSuccess();
								this.findByPage();
								this.queryInboundList()
							} else {
								this.openError(response.data.messageInfo);
							}
							this.inbound.buttonLoading = false
						}).catch((error) => {
							this.inbound.buttonLoading = false
							this.openError(error.response.data.messageInfo);
						});
				}).catch(() => {
					this.$message({
						type: 'info',
						message: '已取消删除'
					});
				});

			},
			afterOperationGetRowUuid() {
				this.inbound.buttonLoading = true
				this.$axios.get('/sc/lcOrder/' + this.frow.orderId).then((response) => {
					if (response.data.code == 0) {
						this.inbound.buttonLoading = false
						this.frow.rowUuid = response.data.data.rowUuid
					} else {
						this.openError(response.data.messageInfo)
					}
				}).catch((error) => {
					this.openError(error.response.data.messageInfo)
				})
			},
			editInbound() {
				this.inbound.loading = true
				this.$axios.get("/sc/lcInbound/" + this.frow.orderId).then(response => {
					if (response.data.code == 0) {
						this.inbound.data = response.data.data
						this.formatDecimalPlaces(this.inbound.data[0], 'orderGrossWeight')
						this.formatDecimalPlaces(this.inbound.data[0], 'orderVolume')
						this.formatDecimalPlaces(this.inbound.data[0], 'orderVolumeWeight')
						this.formatDecimalPlaces(this.inbound.data[0], 'orderChargeWeight')
						this.formatSize(this.inbound.data[0])

						if (this.inbound.data[0].orderId == null) {
							if (this.inbound.data[0].orderDimensions == null) {
								this.countOrderDimensions()
							}
							this.inbound.inboundEditButtonFlag = false
							this.inbound.inboundButtonFlag = true
						} else {
							this.inbound.inboundEditButtonFlag = true
							this.inbound.inboundButtonFlag = false
						}
						this.inbound.ifInbound = true
						this.inbound.loading = false
					} else {
						this.frow.viewFlag = false
						this.openError(response.data.messageInfo)
					}
				}).catch(error => {
					this.frow.viewFlag = false
					this.openError(error.response.data.messsageInfo)
				})
				this.afterOperationGetRowUuid()
			},
			submitEditInbound() {
				this.inbound.data.forEach((item) => {
					if (item.orderPieces === '' || item.orderPieces == null) {
						this.openError("件数不能为空")
						throw BreakException;
					}
					if (item.orderVolume === '' || item.orderVolume == null) {
						this.openError("体积不能为空")
						throw BreakException;
					}
					if (item.orderVolumeWeight === '' || item.orderVolumeWeight == null) {
						this.openError("体积重量不能为空")
						throw BreakException;
					}
					if (item.orderGrossWeight === '' || item.orderGrossWeight == null) {
						this.openError("毛重不能为空")
						throw BreakException;
					}
					if (item.orderChargeWeight === '' || item.orderChargeWeight == null) {
						this.openError("计费重量不能为空")
						throw BreakException;
					}
				});

				this.inbound.data[0].rowUuid = this.frow.rowUuid
				this.$axios.put('/sc/lcInbound', this.inbound.data[0]).then((response) => {
					if (response.data.code == 0) {
						this.queryInboundList()
						this.findByPage()
						this.inboundSuccess('保存成功')
					} else {
						this.openError(response.data.messageInfo);
					}
				}).catch((error) => {
					this.openError(error.response.data.messageInfo);
				});
			},
			checkFloat(row, prop) {
				if (prop == 'orderGrossWeight' || prop == 'orderVolumeWeight') {
					if (this.orderLCDigitsWeight === 0) {
						row[prop] = row[prop].replace(/[^0123456789]/g, "");
					} else {
						row[prop] = row[prop].replace(/[^0123456789.]/g, "");
					}
					let t = row[prop].split('.');
					if (t.length > 1) {
						if (t[0] == '') {
							row[prop] = "0." + t[1].substr(0, this.orderLCDigitsWeight);
						} else {
							row[prop] = t[0] + "." + t[1].substr(0, this.orderLCDigitsWeight);
						}
					}
				} else if (prop == 'orderChargeWeight') {
					if (this.orderLCDigitsChargeWeight === 0) {
						row[prop] = row[prop].replace(/[^0123456789]/g, "");
					} else {
						row[prop] = row[prop].replace(/[^0123456789.]/g, "");

					}
					let t = row[prop].split('.');
					if (t.length > 1) {
						if (t[0] == '') {
							row[prop] = "0." + t[1].substr(0, this.orderLCDigitsChargeWeight);
						} else {
							row[prop] = t[0] + "." + t[1].substr(0, this.orderLCDigitsChargeWeight);
						}
					}
				} else if (prop == 'orderVolume') {
					if (this.orderLCDigitsVolume === 0) {
						row[prop] = row[prop].replace(/[^0123456789]/g, "");
					} else {
						row[prop] = row[prop].replace(/[^0123456789.]/g, "");
					}
					let t = row[prop].split('.');
					if (t.length > 1) {
						if (t[0] == '') {
							row[prop] = "0." + t[1].substr(0, this.orderLCDigitsVolume);
						} else {
							row[prop] = t[0] + "." + t[1].substr(0, this.orderLCDigitsVolume);
						}
					}
				} else if (prop == 'orderPieces') {
					row[prop] = row[prop].replace(/[^0123456789]/g, "");
					while (row[prop].indexOf('0') == 0) {
						row[prop] = row[prop].substr(1, row[prop].length - 1)
					}
				} else if (prop == 'orderDimensions') {
					row[prop] = row[prop].replace(/[^0123456789]/g, "");
					while (row[prop].indexOf('0') == 0) {
						row[prop] = row[prop].substr(1, row[prop].length - 1)
					}
				}
			},
			formatDecimalPlaces(row, prop) {
				if (prop == 'orderGrossWeight' || prop == 'orderVolumeWeight') {
					if (row[prop]) {
						let t = (row[prop] + "").split('.');
						if (t.length > 1) {
							if (t[1].length < this.orderLCDigitsWeight) {
								row[prop] = t[0] + "." + t[1] + "000".substr(0, this.orderLCDigitsWeight - t[1].length);
							}
						} else {
							if (this.orderLCDigitsWeight !== 0) {
								row[prop] = t[0] + "." + "000".substr(0, this.orderLCDigitsWeight);
							}
						}
					}
				} else if (prop == 'orderChargeWeight') {
					if (row[prop]) {
						let t = (row[prop] + "").split('.');
						if (t.length > 1) {
							if (t[1].length < this.orderLCDigitsChargeWeight) {
								row[prop] = t[0] + "." + t[1] + "000".substr(0, this.orderLCDigitsChargeWeight - t[1].length);
							}
						} else {
							if (this.orderLCDigitsChargeWeight !== 0) {
								row[prop] = t[0] + "." + "000".substr(0, this.orderLCDigitsChargeWeight);
							}
						}
					}
				} else if (prop == 'orderVolume') {
					if (row[prop]) {
						let t = (row[prop] + "").split('.');
						if (t.length > 1) {
							if (t[1].length < this.orderLCDigitsVolume) {
								row[prop] = t[0] + "." + t[1] + "000".substr(0, this.orderLCDigitsVolume - t[1].length);
							}
						} else {
							if (this.orderLCDigitsVolume !== 0) {
								row[prop] = t[0] + "." + "000".substr(0, this.orderLCDigitsVolume);
							}
						}
					}
				}
			},
			countChargeWeight() {
				this.countOrderDimensions()
				if (this.inbound.data[0].orderGrossWeight != null && this.inbound.data[0].orderGrossWeight !== '' && this.inbound.data[0].orderVolumeWeight != null && this.inbound.data[0].orderVolumeWeight !== '') {
					if (parseFloat(this.inbound.data[0].orderGrossWeight) > parseFloat(this.inbound.data[0].orderVolumeWeight)) {
						this.inbound.data[0].orderChargeWeight = this.inbound.data[0].orderGrossWeight
					} else {
						this.inbound.data[0].orderChargeWeight = this.inbound.data[0].orderVolumeWeight
					}

					if ((this.inbound.data[0].orderChargeWeight + "").indexOf(".") > -1) {
						if (this.orderLCDigitsChargeWeight !== 0) {
							this.inbound.data[0].orderChargeWeight = parseFloat(this.inbound.data[0].orderChargeWeight + "").toFixed(1)
							let arr = (this.inbound.data[0].orderChargeWeight + "").split(".");
							if (parseInt(arr[1]) > 0 && parseInt(arr[1]) < 5) {
								this.inbound.data[0].orderChargeWeight = arr[0] + ".5" + "000".substr(0, this.orderLCDigitsChargeWeight - 1)
							} else if (parseInt(arr[1]) > 5 && parseInt(arr[1]) < 10) {
								this.inbound.data[0].orderChargeWeight = (parseInt(arr[0]) + 1) + "." + "000".substr(0, this.orderLCDigitsChargeWeight)
							} else if (parseInt(arr[1]) === 0) {
								this.inbound.data[0].orderChargeWeight = arr[0] + "." + "000".substr(0, this.orderLCDigitsChargeWeight)
							} else if (parseInt(arr[1]) === 5) {
								this.inbound.data[0].orderChargeWeight = arr[0] + ".5" + "000".substr(0, this.orderLCDigitsChargeWeight - 1)
							}
						} else {
							this.inbound.data[0].orderChargeWeight = parseFloat(this.inbound.data[0].orderChargeWeight + "").toFixed(0)
						}
					} else {
						if (this.orderLCDigitsChargeWeight !== 0) {
							this.inbound.data[0].orderChargeWeight = this.inbound.data[0].orderChargeWeight + "." + "000".substr(0, this.orderLCDigitsChargeWeight)
						}
					}
				} else {
					this.inbound.data[0].orderChargeWeight = null
				}
			},
			countOrderDimensions() {
				if (this.inbound.data[0].orderVolume != null && this.inbound.data[0].orderVolume !== '' && parseFloat(this.inbound.data[0].orderVolume + '') != 0 && this.inbound.data[0].orderGrossWeight != null && this.inbound.data[0].orderGrossWeight !== '') {
					this.inbound.data[0].orderDimensions = parseFloat(this.inbound.data[0].orderGrossWeight + '') / parseFloat(this.inbound.data[0].orderVolume + '') + ''
					this.inbound.data[0].orderDimensions = this.inbound.data[0].orderDimensions.split('.')[0]
				} else {
					this.inbound.data[0].orderDimensions = ''
				}
			},
			countVolumeWeightAndChargeWeight() {
				if (this.inbound.data[0].orderVolume != null && this.inbound.data[0].orderVolume !== '') {
					this.inbound.data[0].orderVolumeWeight = (parseFloat(this.inbound.data[0].orderVolume) * 1000000 / 6000).toFixed(1)
				} else {
					this.inbound.data[0].orderVolumeWeight = null
				}
				this.countChargeWeight()
			}
		},
		created() {

			//按钮权限开始
			let buttonInfo = window.localStorage.getItem('buttonInfo')

			if (buttonInfo.indexOf('lc_order_inbound_save') > -1) {
				this.inbound.inboundButtonPermission = true;
			}
			if (buttonInfo.indexOf('lc_order_inbound_delete') > -1) {
				this.inbound.deleteInboundButtonFlag = true;
			}
			if (buttonInfo.indexOf('lc_order_inbound_edit') > -1) {
				this.inbound.editInboundButtonFlag = true;
			}

			//查询用户设置小数位
			this.inbound.loading = true
			this.$axios.get("/hrs/user/getUserAboutKeepDecimalPlaces")
				.then((resp) => {
					if (resp.data.code == 0) {
						if (resp.data.data.orderLCDigitsWeight != null) {
							this.orderLCDigitsWeight = resp.data.data.orderLCDigitsWeight
						}
						if (resp.data.data.orderLCDigitsVolume != null) {
							this.orderLCDigitsVolume = resp.data.data.orderLCDigitsVolume
						}
						if (resp.data.data.orderLCDigitsChargeWeight != null) {
							this.orderLCDigitsChargeWeight = resp.data.data.orderLCDigitsChargeWeight
						}

						this.queryInboundList()

					} else {
						this.openError(resp.data.messageInfo)
					}
				}).catch((error) => {
					this.openError(error.response.data.messageInfo)
				})
		}
	}
</script>
