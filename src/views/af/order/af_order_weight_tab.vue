<template>
	<div>
		<div v-show="!inbound.ifInbound||!frow.viewFlag">
			<el-table border v-loading="inbound.loading" :data="inbound.data" :row-class-name="inboundTableRowClassName">
				<el-table-column align="center" prop="awbNumber" label="主单号/订单号" width="125"></el-table-column>
				<el-table-column align="center" prop="customerNumber" label="客户单号" width="130"></el-table-column>
				<el-table-column align="center" prop="orderSize" label="货物尺寸" :formatter="orderSizeFormat"></el-table-column>
				<el-table-column align="center" prop="inboundPieces" label="入库件数" width="100"></el-table-column>
				<el-table-column align="center" prop="inboundGrossWeight" label="入库毛重" width="120">
				</el-table-column>
				<el-table-column align="center" prop="inboundVolume" label="入库体积" width="120">
				</el-table-column>
				<el-table-column align="center" prop="inboundVolumeWeight" label="体积重量" :formatter="formatterNumber13" width="120">
				</el-table-column>
				<el-table-column align="center" prop="inboundChargeWeight" label="计费重量" width="120">
				</el-table-column>
				<el-table-column align="center" prop="orderDimensions" label="密度" width="120">
				</el-table-column>
				<!--<el-table-column label="操作" align="center" width="80">
							<template slot-scope="scope">
								<el-button style="padding: 7px 6px;" v-if="!(scope.$index==0&&frow.awbNumber!=null&&frow.awbNumber!='')" size="mini" type="primary" @click="uploadFileView(scope.row)">查看图片</el-button>
							</template>
						</el-table-column>-->
			</el-table>
			<el-row style="margin-top: 20px;;">
				<el-col class="elementWidth">
					<el-button :loading="inbound.buttonLoading" style="margin-left: 10px;margin-bottom: 10px;" size="small" type="primary" @click="deleteInbound" v-if="inbound.deleteInboundButtonFlag&&frow.viewFlag">删除出重</el-button>
					<el-button :loading="inbound.buttonLoading" style="margin-left: 10px;margin-bottom: 10px;" size="small" type="primary" @click="editInbound" v-if="inbound.editInboundButtonFlag&&frow.viewFlag">编辑出重</el-button>
          <el-button :loading="inbound.buttonLoading" style="margin-left: 10px;margin-bottom: 10px;" size="small" type="primary" @click="shareInbound" v-if="inbound.editInboundButtonFlag&&frow.viewFlag&&shareInboundFlag">协作传输</el-button>
				</el-col>
			</el-row>
		</div>
		<div v-show="inbound.ifInbound&&frow.viewFlag">
			<el-table border v-loading="inbound.loading" :data="inbound.data" :row-class-name="inboundTableRowClassName">
				<el-table-column align="center" prop="awbNumber" label="主单号/订单号" width="125"></el-table-column>
				<el-table-column align="center" prop="customerNumber" label="客户单号" width="130"></el-table-column>
				<el-table-column align="center" prop="orderSize" label="货物尺寸" :formatter="orderSizeFormat"></el-table-column>
				<el-table-column align="center" label="编辑" width="80">
					<template slot-scope="scope">
						<div slot="reference" class="name-wrapper">
							<el-button style="padding: 7px 6px;" @click="editSize(scope.row)" size="mini" type="primary" v-show="scope.$index!=0||!scope.row.ifAwb">编辑尺寸</el-button>
						</div>
					</template>
				</el-table-column>
				<!--<el-table-column align="center" label="编辑" width="80">
							<template slot-scope="scope">
								<div slot="reference" class="name-wrapper">
									<el-button style="padding: 7px 6px;" :disabled="inbound.inboundAfterFlag" @click="editSize(scope.row)" size="mini" type="primary" v-show="scope.$index!=0||!scope.row.ifAwb">编辑尺寸</el-button>
								</div>
							</template>
						</el-table-column>
						<el-table-column align="center" prop="inboundPieces" label="入库件数" width="100"></el-table-column>
						<el-table-column align="center" label="入库毛重" width="140">
							<template slot-scope="scope">
								<el-input :disabled="inbound.inboundAfterFlag" @input="checkFloat(scope.row,'inboundGrossWeight')" @change="sumGrossWeight(scope.row)" size="small" v-model="scope.row.inboundGrossWeight" v-if="scope.$index!=0||!scope.row.ifAwb"></el-input>
								<span v-else>{{scope.row.inboundGrossWeight}}</span>
							</template>
						</el-table-column>
						<el-table-column align="center" label="入库体积" width="120">
							<template slot-scope="scope">
								<el-input :disabled="inbound.inboundAfterFlag" @input="checkFloat(scope.row,'inboundVolume')" @change="countVolumeWeightAndChargeWeight" size="small" v-model="scope.row.inboundVolume" v-if="scope.$index==0&&scope.row.ifAwb"></el-input>
								<span v-else>{{scope.row.inboundVolume}}</span>
							</template>
						</el-table-column>
						<el-table-column align="center" label="体积重量" width="130">
							<template slot-scope="scope">
								<span>{{scope.row.inboundVolumeWeight}}</span>
							</template>
						</el-table-column>
						<el-table-column align="center" label="计费重量" width="140">
							<template slot-scope="scope">
								<el-input :disabled="inbound.inboundAfterFlag" @input="checkFloat(scope.row,'inboundChargeWeight')" size="small" v-model="scope.row.inboundChargeWeight" v-if="scope.$index==0"></el-input>
								<span v-else>{{scope.row.inboundChargeWeight}}</span>
							</template>
						</el-table-column>
						<el-table-column v-if="inbound.inboundAfterFlag" label="操作" align="center" width="80">
							<template slot-scope="scope">
								<el-button style="padding: 7px 6px;" v-if="!(scope.$index==0&&scope.row.ifAwb)" size="mini" type="primary" @click="uploadFile(scope.row)">上传图片</el-button>
							</template>
						</el-table-column>-->
				<el-table-column align="center" prop="inboundPieces" label="入库件数" width="100">
					<template slot-scope="scope">
						<el-input :disabled="inbound.inboundAfterFlag" @input="checkFloat(scope.row,'inboundPieces')" maxlength="8" size="small" v-model="scope.row.inboundPieces"></el-input>
					</template>
				</el-table-column>
				<el-table-column align="center" label="入库毛重" width="130">
					<template slot-scope="scope">
						<el-input :disabled="inbound.inboundAfterFlag" @input="checkFloat(scope.row,'inboundGrossWeight')" maxlength="9" @change="sumGrossWeight(scope.row);formatDecimalPlaces(scope.row,'inboundGrossWeight')" size="small" v-model="scope.row.inboundGrossWeight"></el-input>
					</template>
				</el-table-column>
				<el-table-column align="center" label="入库体积" width="110">
					<template slot-scope="scope">
						<el-input :disabled="inbound.inboundAfterFlag" @input="checkFloat(scope.row,'inboundVolume')" maxlength="11" @change="countVolumeWeightAndChargeWeight();formatDecimalPlaces(scope.row,'inboundVolume')" size="small" v-model="scope.row.inboundVolume"></el-input>
					</template>
				</el-table-column>
				<el-table-column align="center" label="体积重量" width="120">
					<template slot-scope="scope">
						<el-input :disabled="inbound.inboundAfterFlag" @input="checkFloat(scope.row,'inboundVolumeWeight')" @change="formatDecimalPlaces(scope.row,'inboundVolumeWeight');countChargeWeight()" maxlength="9" size="small" v-model="scope.row.inboundVolumeWeight"></el-input>
					</template>
				</el-table-column>
				<el-table-column align="center" label="计费重量" width="130">
					<template slot-scope="scope">
						<el-input :disabled="inbound.inboundAfterFlag" @input="checkFloat(scope.row,'inboundChargeWeight')" @change="formatDecimalPlaces(scope.row,'inboundChargeWeight')" maxlength="9" size="small" v-model="scope.row.inboundChargeWeight"></el-input>
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
					<el-button :loading="inbound.buttonLoading" v-if="inbound.inboundButtonFlag" size="small" style="margin-left: 10px;margin-bottom: 10px;" type="primary" @click="submitInbound1">保存</el-button>
					<el-button :loading="inbound.buttonLoading" v-if="inbound.inboundEditButtonFlag" size="small" style="margin-left: 10px;margin-bottom: 10px;" type="primary" @click="submitEditInbound1">保存</el-button>
				</el-col>
				<!--<el-col class="elementWidth" v-if="inbound.inboundAfterFlag">
							<el-button size="small" style="margin-left: 10px;margin-bottom: 10px;" type="primary" @click="completeInbound">完成出重</el-button>
						</el-col>-->
			</el-row>
			<size ref="addMission" v-if="inbound.sizeVisible" :visible.sync="inbound.sizeVisible" :frow="inbound.ffrow"></size>
			<upload ref="addMission" v-if="inbound.uploadVisible" :visible.sync="inbound.uploadVisible" :frow="inbound.ffrow"></upload>
			<uploadView ref="addMission" v-if="inbound.uploadViewVisible" :visible.sync="inbound.uploadViewVisible" :frow="inbound.ffrow"></uploadView>
			<edit ref="addMission" v-if="inbound.editVisible" :visible.sync="inbound.editVisible" :frow="inbound.ffrow"></edit>

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
	import Size from './orderInbound/af_order_inbound_edit_size'
	import upload from './orderInbound/af_order_inbound_upload'
	import uploadView from './orderInbound/af_order_inbound_upload_view'

	import Edit from './orderInbound/af_aorder_inbound_edit'

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
        shareInboundFlagTwo:true,
        shareInboundFlag:false,
				helpDocumentUrl: '',
				firstUrl: '',
				fourthUrl: '',
				secondUrl: '',
				fifthUrl: '',
				finishButtonFlag: false,
				cancelButtonFlag: false,
				editButtonFlag: false,
				editButtonFlag2: false,
				letterButtonFlag: false,
				letterButtonFlag2: false,
				servicesButtonFlag: false,
				weighttagButtonFlag: false,
				weighttagButtonFlag2: false,
				logtagButtonFlag: false,
				activeName: 'first',
				currRow: '',
				currRow2: '',
				data1: [],
				options2: [],
				selections: [],
				contactsOptions: [],
				useroptions: [],
				productOptions: [],
				transitClauseOptions: [],
				goodsTypeOptions: [],
				batteryTypeOptions: [],
				arrivalMethodOptions: [],
				departureWarehouseOptions: [],
				departureStorehouseOptions: [],
				packageTypeOptions: [],
				paymentMethodOptions: [],
				currencyCodeOptions: [],
				msrCurrecnyCodeOptions: [],
				codeOptions: [],
				showFlag1: false,
				showFlag2: false,
				showFlag3: false,
				shipperConsignee2: false,
				save: false,
				save2: false,
				saveawb: false,
				saveIncome: false,
				editIncome: false,
				billIncome: false,
				billEditIncome: false,
				orderDate: false,
				billSelectIncome: false,
				saveCost: false,
				editCost: false,
				printVisible: false,
				printMoreVisible: false,
				operationMore: false,
				billSendVisible: false,
				selectSendOrPrint: false,
				billSendListVisible: false,
				editVisible: false,
				disabledFlag: false,
				priceValueFlag: false,
				disabledFlag2: false,
				disabledFlag3: false,
				letterFlag: true,
				ffrow: {
					selections: [],
					awbFromType: ''
				},
				planVolume1: '',


				//inbound---出重开始-----
				inbound: {
					loading: false,
					buttonLoading: false,
					data: [],
					sizeVisible: false,
					uploadViewVisible: false,
					uploadVisible: false,
					editVisible: false,
					ffrow: '',
					actionPath: 'http://up-z1.qiniu.com',
					accept: "image/jpeg,image/gif,image/png,image/bmp",
					token: '',
					currRow: '',
					ifInbound: false,
					inboundAfterFlag: false,
					inboundButtonFlag: false,
					deleteInboundButtonFlag: false,
					editInboundButtonFlag: false,
					inboundEditButtonFlag: false
				},
				//inbound---出重结束-----
				orderAeDigitsWeight: 1,
				orderAeDigitsVolume: 3,
				orderAeDigitsChargeWeight: 2
			};
		},
		inject: ['findByPage'],
		components: {

			'size': Size,
			'upload': upload,
			'uploadView': uploadView,
			'edit': Edit

		},
		provide() {
			return {
				sizeCallback: this.sizeCallback,
				queryInboundList: this.queryInboundList
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
				if (row.inboundVolumeWeight === '' || row.inboundVolumeWeight === 'null' || row.inboundVolumeWeight == null) {
					return "";
				} else {
					return parseFloat(row.inboundVolumeWeight).toFixed(1);
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
			completeInbound() {
				this.handleClose()
			},
			uploadFile(row) {
				this.inbound.ffrow = row
				this.inbound.uploadVisible = true
			},
			uploadFileView(row) {
				this.inbound.ffrow = row
				this.inbound.uploadViewVisible = true
			},
			queryInboundList() {
				this.inbound.loading = true
				this.$axios.get2("/afbase/inbound/detail", {
						number: this.frow.orderCode,
						flag: 'order'
					})
					.then(function(response) {
						if (response.data.code == 0) {
							this.inbound.data = response.data.data
							this.inbound.ifInbound = false
							this.inbound.inboundAfterFlag = false
							//							if(this.inbound.ffrow.ifAwb) {
							//								//计算总计
							//								let sumSizeData = {}
							//								let sumSize = null
							//								for(var i = 1; i < this.inbound.data.length; i++) {
							//									if(this.inbound.data[i].orderSize != null && this.inbound.data[i].orderSize !== '') {
							//										let sizeList = this.inbound.data[i].orderSize.split(';')
							//										sizeList.forEach((size) => {
							//											let key = size.split('*')[0] + "*" + size.split('*')[1] + "*" + size.split('*')[2].split('/')[0]
							//											let val = parseInt(size.split('/')[1])
							//											if(sumSizeData[key] == null) {
							//												sumSizeData[key] = val
							//											} else {
							//												sumSizeData[key] += val
							//											}
							//										})
							//									}
							//
							//								}
							//								for(let prop in sumSizeData) {
							//									if(sumSize == null) {
							//										sumSize = prop + "/" + sumSizeData[prop]
							//									} else {
							//										sumSize += ";" + prop + "/" + sumSizeData[prop]
							//									}
							//								}
							//								this.inbound.data[0].orderSize = sumSize
							//							}
						}
						this.inbound.loading = false
					}.bind(this));
			},
			orderSizeFormat(row, column) {
				if (row[column.property]) {
					return (row[column.property]).replace(/;/g, ";\n");
				} else {
					return ""
				}
			},

			init() {
				//计算总计
				let sumSizeData = {}
				let sumSize = null
				let sumPieces = null
				let sumVolume = null
				let sumVolumeWeight = null
				for (var i = 1; i < this.inbound.data.length; i++) {
					if (this.inbound.data[i].inboundPieces != null) {
						if (sumPieces == null) {
							sumPieces = parseInt(this.inbound.data[i].inboundPieces)
						} else {
							sumPieces += parseInt(this.inbound.data[i].inboundPieces)
						}
					}
					if (this.inbound.data[i].inboundVolume != null) {
						if (sumVolume == null) {
							sumVolume = parseFloat(this.inbound.data[i].inboundVolume)
						} else {
							sumVolume += parseFloat(this.inbound.data[i].inboundVolume)
						}
					}
					if (this.inbound.data[i].inboundVolumeWeight != null) {
						if (sumVolumeWeight == null) {
							sumVolumeWeight = parseFloat(this.inbound.data[i].inboundVolumeWeight)
						} else {
							sumVolumeWeight += parseFloat(this.inbound.data[i].inboundVolumeWeight)
						}
					}
					if (this.inbound.data[i].orderSize != null && this.inbound.data[i].orderSize !== '') {
						let sizeList = this.inbound.data[i].orderSize.split(';')
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

				}

				for (let prop in sumSizeData) {
					if (sumSize == null) {
						sumSize = prop + "/" + sumSizeData[prop]
					} else {
						sumSize += ";" + prop + "/" + sumSizeData[prop]
					}
				}
				this.inbound.data[0].inboundPieces = sumPieces
				if (sumVolume != null) {
					this.inbound.data[0].inboundVolume = sumVolume.toFixed(this.orderAeDigitsVolume)
				}
				if (sumVolumeWeight != null) {
					this.inbound.data[0].inboundVolumeWeight = sumVolumeWeight.toFixed(this.orderAeDigitsWeight)
				}
				this.inbound.data[0].orderSize = sumSize

				let sumGrossWeight = null
				for (var i = 1; i < this.inbound.data.length; i++) {
					if (this.inbound.data[i].inboundGrossWeight != null) {
						if (sumGrossWeight == null) {
							sumGrossWeight = parseFloat(this.inbound.data[i].inboundGrossWeight)
						} else {
							sumGrossWeight += parseFloat(this.inbound.data[i].inboundGrossWeight)
						}
					}
				}
				if (sumGrossWeight != null) {
					sumGrossWeight = sumGrossWeight.toFixed(this.orderAeDigitsWeight)
				}
				this.inbound.data[0].inboundGrossWeight = sumGrossWeight

				this.countChargeWeight()
			},
			sizeCallback(val) {
				this.inbound.ffrow.orderSize = val
				if (val != '') {
					//当前行自动赋值
					let pieces = null
					let volume = null
					let volume1 = null
					let volumeWeight = null

					val.split(';').forEach((size) => {
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
						volumeWeight = 0 + "." + "000".substr(0, this.orderAeDigitsWeight)
					} else {
						volume1 = (volume / 1000000).toFixed(this.orderAeDigitsVolume)
						volumeWeight = (volume / 6000).toFixed(this.orderAeDigitsWeight)
					}

					this.inbound.ffrow.inboundPieces = pieces
					this.inbound.ffrow.inboundVolume = volume1
					this.inbound.ffrow.inboundVolumeWeight = volumeWeight
					this.countOrderChargeWeight(this.inbound.ffrow)
				} else {
					this.inbound.ffrow.inboundPieces = null
					this.inbound.ffrow.inboundVolume = null
					this.inbound.ffrow.inboundVolumeWeight = null
				}
				if (this.inbound.ffrow.ifAwb) {
					//计算总计
					let sumSizeData = {}
					let sumSize = null
					let sumPieces = null
					let sumVolume = null
					let sumVolumeWeight = null
					for (var i = 1; i < this.inbound.data.length; i++) {
						if (this.inbound.data[i].inboundPieces != null && this.inbound.data[i].inboundPieces !== '') {
							if (sumPieces == null) {
								sumPieces = parseInt(this.inbound.data[i].inboundPieces)
							} else {
								sumPieces += parseInt(this.inbound.data[i].inboundPieces)
							}
						}
						if (this.inbound.data[i].inboundVolume != null && this.inbound.data[i].inboundVolume !== '') {
							if (sumVolume == null) {
								sumVolume = parseFloat(this.inbound.data[i].inboundVolume)
							} else {
								sumVolume += parseFloat(this.inbound.data[i].inboundVolume)
							}
						}
						if (this.inbound.data[i].inboundVolumeWeight != null && this.inbound.data[i].inboundVolumeWeight !== '') {
							if (sumVolumeWeight == null) {
								sumVolumeWeight = parseFloat(this.inbound.data[i].inboundVolumeWeight)
							} else {
								sumVolumeWeight += parseFloat(this.inbound.data[i].inboundVolumeWeight)
							}
						}
						if (this.inbound.data[i].orderSize != null && this.inbound.data[i].orderSize !== '') {
							let sizeList = this.inbound.data[i].orderSize.split(';')
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

					}

					for (let prop in sumSizeData) {
						if (sumSize == null) {
							sumSize = prop + "/" + sumSizeData[prop]
						} else {
							sumSize += ";" + prop + "/" + sumSizeData[prop]
						}
					}
					this.inbound.data[0].inboundPieces = sumPieces
					if (sumVolume != null) {
						this.inbound.data[0].inboundVolume = sumVolume.toFixed(this.orderAeDigitsVolume)
					} else {
						if (this.orderAeDigitsVolume === 0) {
							this.inbound.data[0].inboundVolume = 0
						} else {
							this.inbound.data[0].inboundVolume = 0 + "." + "000".substr(0, this.orderAeDigitsVolume)
						}
					}
					if (sumVolumeWeight != null) {
						this.inbound.data[0].inboundVolumeWeight = sumVolumeWeight.toFixed(this.orderAeDigitsWeight)
					} else {
						if (this.orderAeDigitsWeight === 0) {
							this.inbound.data[0].inboundVolumeWeight = 0
						} else {
							this.inbound.data[0].inboundVolumeWeight = 0 + "." + "000".substr(0, this.orderAeDigitsWeight)
						}
					}
					this.inbound.data[0].orderSize = sumSize

				}
				this.countChargeWeight()

			},
			ifOrderHaveSizeValCountOther() {
				this.inbound.data.forEach((item) => {
					this.inbound.ffrow = item
					if (item.orderSize != null && item.orderSize != '' && item.orderPieces == null) {
						this.sizeCallback(item.orderSize)
					}
				})
			},
			editSize(row) {
				this.inbound.ffrow = row;
				this.inbound.sizeVisible = true;
			},
      submitInbound1(){
          if(this.frow.signState === 1){
              this.$confirm('已签单，是否继续保存？', '提示', {
                  confirmButtonText: '确定',
                  cancelButtonText: '取消',
                  type: 'warning',
                  center: true
              }).then(() => {
                  this.submitInbound()
              }).catch((e) => {

              });
          }else{
              this.submitInbound()
          }
      },
			submitInbound() {
				this.inbound.buttonLoading = true
				this.$axios.get('/afbase/aforder/selectOrderStatus?node_name=财务锁账&order_uuid=' + this.frow.orderUuid).then(function(response) {
					if (!response.data.data) {
						let BreakException = {}
						try {
							this.inbound.data.forEach((item) => {
								if (item.inboundPieces === '' || item.inboundPieces == null) {
									this.openError("件数不能为空")
									throw BreakException;
								}
								if (item.inboundVolume === '' || item.inboundVolume == null) {
									this.openError("体积不能为空")
									throw BreakException;
								}
								if (item.inboundVolumeWeight === '' || item.inboundVolumeWeight == null) {
									this.openError("体积重量不能为空")
									throw BreakException;
								}
								if (item.inboundGrossWeight === '' || item.inboundGrossWeight == null) {
									this.openError("毛重不能为空")
									throw BreakException;
								}
								if (item.inboundChargeWeight === '' || item.inboundChargeWeight == null) {
									this.openError("计费重量不能为空")
									throw BreakException;
								}
							})
						} catch (e) {
							this.inbound.buttonLoading = false
							return
						}

            this.inbound.data[0].rountingSign = localStorage.getItem("rountingSign")
            this.inbound.data[0].rountingSignBusinessProduct = localStorage.getItem("rountingSignBusinessProduct")
						this.inbound.data[0].pageName=this.frow.pageName
						let params = {
							data: this.inbound.data
						};
						
						this.$axios.post2('/afbase/inbound/saveInbound', params)
							.then(function(respo) {
								if (respo.data.code == 0) {
									this.inboundSuccess('出重完成')
									this.queryInboundList()
									this.findByPage()

								} else {
									this.openError(respo.data.messageInfo);
								}
								this.inbound.buttonLoading = false
							}.bind(this)).catch(function(error) {
								this.inbound.buttonLoading = false
								let errorinfo = error.response.data.messageInfo;
								this.openError(errorinfo);
							}.bind(this));

					} else {
						this.inbound.buttonLoading = false
						this.openError("财务已锁账，不允许操作");
					}
				}.bind(this));
			},
      shareInbound(){
        if(!this.shareInboundFlagTwo){
            this.openError("当前订单没有订单协作,不能操作协作传输");
            return false;
        }
        if(this.frow.businessScope=='AE'){
          this.$axios.get2('/afbase/afOrderShare/check/'+this.frow.orderId+'/货物出重'+'/null').then((response)=> {
            if(response.data.data){
               let param = {
                 orderId:this.frow.orderId
               }
                this.$axios.post2('/afbase/afOrderShare/shareInbound', param)
                  .then(function(response){
                    this.loading = false;
                    if(0 == response.data.code){
                      this.openSuccess();
                      // this.handleClose();
                    }else{
                      this.openError(response.data.messageInfo || "分享出重失败");
                    }
                  }.bind(this))
                  .catch(function(){
                    this.loading = false;
                    this.openError("分享出重失败，请稍后再试");
                  }.bind(this))
            }else{
              this.openError("已传输协作 不能多次操作");
            }
          }).catch((error)=> {
          	console.log(error);
          });
        }

      },
			deleteInbound() {
				this.$confirm('此操作将永久删除,不可恢复, 是否继续?', '注意', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning',
					center: true
				}).then(() => {
					this.inbound.buttonLoading = true
					//					if(this.frow.awbNumber != null && this.frow.awbNumber != '') {
					//						this.$axios.deletes('/afbase/inbound/' + this.frow.awbUuid + '/awb').then(function(response) {
					//							if(response.data.code == 0) {
					//								this.openSuccess();
					//								this.findByPage();
					//								this.inbound.loading = true
					//								this.$axios.get2("/afbase/inbound/inbound", {
					//									number: this.frow.awbId,
					//									flag: 'awb'
					//								}).then(function(response) {
					//									if(response.data.code == 0) {
					//										this.inbound.data = response.data.data
					//										this.ifOrderHaveSizeValCountOther()
					//										this.init()
					//										this.inbound.ifInbound = true
					//									} else {
					//										this.openError(response.data.messageInfo)
					//									}
					//									this.inbound.loading = false
					//								}.bind(this));
					//							} else {
					//								this.openError(response.data.messageInfo);
					//							}
					//							this.inbound.buttonLoading = false
					//						}.bind(this)).catch(function(error) {
					//							this.inbound.buttonLoading = false
					//							let errorinfo = error.response.data.messageInfo;
					//							this.openError(errorinfo);
					//						}.bind(this))
					//					} else {
					this.$axios.deletes('/afbase/inbound/' + this.frow.orderUuid + '/order/'+this.frow.pageName)
						.then(function(response) {
							if (response.data.code == 0) {
								this.openSuccess();
								this.findByPage();
								this.inbound.loading = true
								this.$axios.get2("/afbase/inbound/inbound", {
									number: this.frow.orderCode,
									flag: 'order'
								}).then(function(response) {
									if (response.data.code == 0) {
										this.inbound.data = response.data.data
										this.ifOrderHaveSizeValCountOther()
										this.countOrderDimensions()
										this.inbound.ifInbound = true
									} else {
										this.openError(response.data.messageInfo)
									}
									this.inbound.loading = false
								}.bind(this));
							} else {
								this.openError(response.data.messageInfo);
							}
							this.inbound.buttonLoading = false
						}.bind(this)).catch(function(error) {
							this.inbound.buttonLoading = false
							let errorinfo = error.response.data.messageInfo;
							this.openError(errorinfo);
						}.bind(this));
					//					}
				}).catch(() => {
					this.$message({
						type: 'info',
						message: '已取消删除'
					});
				});

			},
			editInbound() {
				//未出重
				this.inbound.loading = true
				this.$axios.get2("/afbase/inbound/inbound", {
						number: this.frow.orderCode,
						flag: 'order'
					})
					.then(function(response) {
						if (response.data.code == 0) {
							this.inbound.data = response.data.data
							this.ifOrderHaveSizeValCountOther()
						} else {
							this.openError(response.data.messageInfo)
						}
						this.inbound.loading = false
					}.bind(this));
				this.frow.viewFlag = true;
				this.inbound.ifInbound = true;
				this.inbound.inboundEditButtonFlag = true;
				this.inbound.inboundButtonFlag = false;
			},
      submitEditInbound1(){
          if(this.frow.signState === 1){
              this.$confirm('已签单，是否继续保存？', '提示', {
                  confirmButtonText: '确定',
                  cancelButtonText: '取消',
                  type: 'warning',
                  center: true
              }).then(() => {
                  this.submitEditInbound()
              }).catch((e) => {

              });
          }else{
              this.submitEditInbound()
          }
      },
			submitEditInbound() {
				this.inbound.data.forEach((item) => {
					//						if(item.orderSize === '' || item.orderSize == null) {
					//							this.openError("尺寸不能为空")
					//							throw BreakException;
					//						}
					if (item.inboundPieces === '' || item.inboundPieces == null) {
						this.openError("件数不能为空")
						throw BreakException;
					}
					if (item.inboundVolume === '' || item.inboundVolume == null) {
						this.openError("体积不能为空")
						throw BreakException;
					}
					if (item.inboundVolumeWeight === '' || item.inboundVolumeWeight == null) {
						this.openError("体积重量不能为空")
						throw BreakException;
					}
					if (item.inboundGrossWeight === '' || item.inboundGrossWeight == null) {
						this.openError("毛重不能为空")
						throw BreakException;
					}
					if (item.inboundChargeWeight === '' || item.inboundChargeWeight == null) {
						this.openError("计费重量不能为空")
						throw BreakException;
					}
				});
				let params = {
					orderSize: this.inbound.data[0].orderSize,
					inboundPieces: this.inbound.data[0].inboundPieces,
					inboundGrossWeight: this.inbound.data[0].inboundGrossWeight,
					inboundVolume: this.inbound.data[0].inboundVolume,
					inboundChargeWeight: this.inbound.data[0].inboundChargeWeight,
					orderDimensions: this.inbound.data[0].orderDimensions,
					inboundId: this.inbound.data[0].inboundId,
          			rountingSign: localStorage.getItem("rountingSign"),
          			rountingSignBusinessProduct: localStorage.getItem("rountingSignBusinessProduct"),
          			pageName:this.frow.pageName
				};
				this.$axios.post2('/afbase/inbound/modifyInbound', params).then(function(response) {
					if (response.data.code == 0) {
						this.frow.viewFlag = true;
						this.inbound.ifInbound = false;
						this.inbound.inboundEditButtonFlag = false;
						this.inbound.inboundButtonFlag = true;
						this.queryInboundList();
						this.findByPage();
						this.frow.updateLogTab=true;
					} else {
						this.openError(response.data.messageInfo);
					}

				}.bind(this)).catch((error) => {
					this.openError(error.response.data.messageInfo);
				});
			},
			checkFloat(row, prop) {
				if (prop == 'inboundGrossWeight' || prop == 'inboundVolumeWeight') {
					if (this.orderAeDigitsWeight === 0) {
						row[prop] = row[prop].replace(/[^0123456789]/g, "");
					} else {
						row[prop] = row[prop].replace(/[^0123456789.]/g, "");
					}
					let t = row[prop].split('.');
					if (t.length > 1) {
						if (t[0] == '') {
							row[prop] = "0." + t[1].substr(0, this.orderAeDigitsWeight);
						} else {
							row[prop] = t[0] + "." + t[1].substr(0, this.orderAeDigitsWeight);
						}
					}
				} else if (prop == 'inboundChargeWeight') {
					if (this.orderAeDigitsChargeWeight === 0) {
						row[prop] = row[prop].replace(/[^0123456789]/g, "");
					} else {
						row[prop] = row[prop].replace(/[^0123456789.]/g, "");

					}
					let t = row[prop].split('.');
					if (t.length > 1) {
						if (t[0] == '') {
							row[prop] = "0." + t[1].substr(0, this.orderAeDigitsChargeWeight);
						} else {
							row[prop] = t[0] + "." + t[1].substr(0, this.orderAeDigitsChargeWeight);
						}
					}
				} else if (prop == 'inboundVolume') {
					if (this.orderAeDigitsVolume === 0) {
						row[prop] = row[prop].replace(/[^0123456789]/g, "");
					} else {
						row[prop] = row[prop].replace(/[^0123456789.]/g, "");
					}
					let t = row[prop].split('.');
					if (t.length > 1) {
						if (t[0] == '') {
							row[prop] = "0." + t[1].substr(0, this.orderAeDigitsVolume);
						} else {
							row[prop] = t[0] + "." + t[1].substr(0, this.orderAeDigitsVolume);
						}
					}
				} else if (prop == 'inboundPieces') {
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
				if (prop == 'inboundGrossWeight' || prop == 'inboundVolumeWeight') {
					if (row[prop]) {
						let t = (row[prop] + "").split('.');
						if (t.length > 1) {
							if (t[1].length < this.orderAeDigitsWeight) {
								row[prop] = t[0] + "." + t[1] + "000".substr(0, this.orderAeDigitsWeight - t[1].length);
							}
						} else {
							if (this.orderAeDigitsWeight !== 0) {
								row[prop] = t[0] + "." + "000".substr(0, this.orderAeDigitsWeight);
							}
						}
					}
				} else if (prop == 'inboundChargeWeight') {
					if (row[prop]) {
						let t = (row[prop] + "").split('.');
						if (t.length > 1) {
							if (t[1].length < this.orderAeDigitsChargeWeight) {
								row[prop] = t[0] + "." + t[1] + "000".substr(0, this.orderAeDigitsChargeWeight - t[1].length);
							}
						} else {
							if (this.orderAeDigitsChargeWeight !== 0) {
								row[prop] = t[0] + "." + "000".substr(0, this.orderAeDigitsChargeWeight);
							}
						}
					}
				} else if (prop == 'inboundVolume') {
					if (row[prop]) {
						let t = (row[prop] + "").split('.');
						if (t.length > 1) {
							if (t[1].length < this.orderAeDigitsVolume) {
								row[prop] = t[0] + "." + t[1] + "000".substr(0, this.orderAeDigitsVolume - t[1].length);
							}
						} else {
							if (this.orderAeDigitsVolume !== 0) {
								row[prop] = t[0] + "." + "000".substr(0, this.orderAeDigitsVolume);
							}
						}
					}
				}
			},
			sumGrossWeight(row) {
				if (row.ifAwb) {
					let sumGrossWeight = null
					for (var i = 1; i < this.inbound.data.length; i++) {
						if (this.inbound.data[i].inboundGrossWeight != null && this.inbound.data[i].inboundGrossWeight !== '') {
							if (sumGrossWeight == null) {
								sumGrossWeight = parseFloat(this.inbound.data[i].inboundGrossWeight)
							} else {
								sumGrossWeight += parseFloat(this.inbound.data[i].inboundGrossWeight)
							}
						}
					}
					if (sumGrossWeight != null) {
						sumGrossWeight = sumGrossWeight.toFixed(this.orderAeDigitsWeight)
					}
					this.inbound.data[0].inboundGrossWeight = sumGrossWeight

					//计算订单计费重量
					this.countOrderChargeWeight(row)
				}
				this.countChargeWeight()

			},
			countChargeWeight() {
				this.countOrderDimensions()
				if (this.inbound.data[0].inboundGrossWeight != null && this.inbound.data[0].inboundGrossWeight !== '' && this.inbound.data[0].inboundVolumeWeight != null && this.inbound.data[0].inboundVolumeWeight !== '') {
					if (parseFloat(this.inbound.data[0].inboundGrossWeight) > parseFloat(this.inbound.data[0].inboundVolumeWeight)) {
						this.inbound.data[0].inboundChargeWeight = this.inbound.data[0].inboundGrossWeight
					} else {
						this.inbound.data[0].inboundChargeWeight = this.inbound.data[0].inboundVolumeWeight
					}

					if ((this.inbound.data[0].inboundChargeWeight + "").indexOf(".") > -1) {
						if (this.orderAeDigitsChargeWeight !== 0) {
							this.inbound.data[0].inboundChargeWeight = parseFloat(this.inbound.data[0].inboundChargeWeight + "").toFixed(1)
							let arr = (this.inbound.data[0].inboundChargeWeight + "").split(".");
							if (parseInt(arr[1]) > 0 && parseInt(arr[1]) < 5) {
								this.inbound.data[0].inboundChargeWeight = arr[0] + ".5" + "000".substr(0, this.orderAeDigitsChargeWeight - 1)
							} else if (parseInt(arr[1]) > 5 && parseInt(arr[1]) < 10) {
								this.inbound.data[0].inboundChargeWeight = (parseInt(arr[0]) + 1) + "." + "000".substr(0, this.orderAeDigitsChargeWeight)
							} else if (parseInt(arr[1]) === 0) {
								this.inbound.data[0].inboundChargeWeight = arr[0] + "." + "000".substr(0, this.orderAeDigitsChargeWeight)
							} else if (parseInt(arr[1]) === 5) {
								this.inbound.data[0].inboundChargeWeight = arr[0] + ".5" + "000".substr(0, this.orderAeDigitsChargeWeight - 1)
							}
						} else {
							this.inbound.data[0].inboundChargeWeight = parseFloat(this.inbound.data[0].inboundChargeWeight + "").toFixed(0)
						}
					} else {
						if (this.orderAeDigitsChargeWeight !== 0) {
							this.inbound.data[0].inboundChargeWeight = this.inbound.data[0].inboundChargeWeight + "." + "000".substr(0, this.orderAeDigitsChargeWeight)
						}
					}
				} else {
					this.inbound.data[0].inboundChargeWeight = null
				}
			},
			countOrderDimensions() {
				if (this.inbound.data[0].inboundVolume != null && this.inbound.data[0].inboundVolume !== '' && parseFloat(this.inbound.data[0].inboundVolume + '') != 0 && this.inbound.data[0].inboundGrossWeight != null && this.inbound.data[0].inboundGrossWeight !== '') {
					this.inbound.data[0].orderDimensions = parseFloat(this.inbound.data[0].inboundGrossWeight + '') / parseFloat(this.inbound.data[0].inboundVolume + '') + ''
					this.inbound.data[0].orderDimensions = this.inbound.data[0].orderDimensions.split('.')[0]
				} else {
					this.inbound.data[0].orderDimensions = ''
				}
			},
			countVolumeWeightAndChargeWeight() {
				if (this.inbound.data[0].inboundVolume != null && this.inbound.data[0].inboundVolume !== '') {
					this.inbound.data[0].inboundVolumeWeight = (parseFloat(this.inbound.data[0].inboundVolume) * 1000000 / 6000).toFixed(1)
				} else {
					this.inbound.data[0].inboundVolumeWeight = null
				}
				this.countChargeWeight()
			},
			countOrderChargeWeight(row) {
				if (row.inboundGrossWeight != null && row.inboundGrossWeight !== '' && row.inboundVolumeWeight != null && row.inboundVolumeWeight !== '') {
					if (parseFloat(row.inboundGrossWeight) > parseFloat(row.inboundVolumeWeight)) {
						row.inboundChargeWeight = row.inboundGrossWeight
					} else {
						row.inboundChargeWeight = row.inboundVolumeWeight
					}
					if ((row.inboundChargeWeight + "").indexOf(".") > -1) {
						if (this.orderAeDigitsChargeWeight !== 0) {
							row.inboundChargeWeight = parseFloat(row.inboundChargeWeight + "").toFixed(1)
							let arr = (row.inboundChargeWeight + "").split(".");
							if (parseInt(arr[1]) > 0 && parseInt(arr[1]) < 5) {
								row.inboundChargeWeight = arr[0] + ".5" + "000".substr(0, this.orderAeDigitsChargeWeight - 1)
							} else if (parseInt(arr[1]) > 5 && parseInt(arr[1]) < 10) {
								row.inboundChargeWeight = (parseInt(arr[0]) + 1) + "." + "000".substr(0, this.orderAeDigitsChargeWeight)
							} else if (parseInt(arr[1]) === 0) {
								row.inboundChargeWeight = arr[0] + "." + "000".substr(0, this.orderAeDigitsChargeWeight)
							} else if (parseInt(arr[1]) === 5) {
								row.inboundChargeWeight = arr[0] + ".5" + "000".substr(0, this.orderAeDigitsChargeWeight - 1)
							}
						} else {
							row.inboundChargeWeight = parseFloat(row.inboundChargeWeight + "").toFixed(0)
						}
					} else {
						if (this.orderAeDigitsChargeWeight !== 0) {
							row.inboundChargeWeight = row.inboundChargeWeight + "." + "000".substr(0, this.orderAeDigitsChargeWeight)
						}
					}
				} else {
					row.inboundChargeWeight = null
				}
			},
			handleRemove(row) {
				row.orderFileName = null
				row.orderFileUrl = null
			},
			uploadSuccess(response, file, fileList) { //上传成功后在图片框显示图片
				this.inbound.currRow.orderFileUrl = "http://doc.yctop.com/" + response.key;
				this.inbound.currRow.orderFileName = file.name
			},
			clickUploadButton(row) {
				this.inbound.currRow = row
			},

			//出重结束

		},
		created() {
			if (!this.frow.pageName) {
				this.frow.pageName='AE订单';
			}
			//按钮权限开始
			let buttonInfo = window.localStorage.getItem('buttonInfo')

			if (buttonInfo.indexOf('af-order-weighttag') > -1) {
				/*if(this.frow.businessProduct == "放单业务") {
					this.weighttagButtonFlag2 = false;
				} else {
					this.weighttagButtonFlag2 = this.frow.weighttagButtonFlag2;
				}*/
				this.weighttagButtonFlag2 = this.frow.weighttagButtonFlag2;
				this.weighttagButtonFlag = true;
			}
			if (buttonInfo.indexOf('af-order-logtag') > -1) {
				this.logtagButtonFlag = true;
			}
			if (buttonInfo.indexOf('af_button_inbound_inbound') > -1) {
				this.inbound.inboundButtonFlag = true;
			}
			if (buttonInfo.indexOf('af_button_inbound_delete') > -1) {
				this.inbound.deleteInboundButtonFlag = true;
			}

			if (buttonInfo.indexOf('af_button_inbound_edit') > -1) {
				this.inbound.editInboundButtonFlag = true;
			}
			//按钮权限结束

			//查询用户设置小数位
			this.$axios.get("/hrs/user/getUserAboutKeepDecimalPlaces")
				.then((resp) => {
					if (resp.data.code == 0) {
						if (resp.data.data.orderAeDigitsWeight != null) {
							this.orderAeDigitsWeight = resp.data.data.orderAeDigitsWeight
						}
						if (resp.data.data.orderAeDigitsVolume != null) {
							this.orderAeDigitsVolume = resp.data.data.orderAeDigitsVolume
						}
						if (resp.data.data.orderAeDigitsChargeWeight != null) {
							this.orderAeDigitsChargeWeight = resp.data.data.orderAeDigitsChargeWeight
						}
						//出重开始
						if (this.frow.inboundOrderChargeWeight == null && this.frow.inboundAwbChargeWeight == null && this.frow.viewFlag) {
							//未出重
							this.inbound.ifInbound = true
							this.inbound.loading = true
							this.$axios.get2("/afbase/inbound/inbound", {
									number: this.frow.orderCode,
									flag: 'order'
								})
								.then(function(response) {
									if (response.data.code == 0) {
										this.inbound.data = response.data.data
										this.formatDecimalPlaces(this.inbound.data[0], 'inboundGrossWeight')
										this.formatDecimalPlaces(this.inbound.data[0], 'inboundVolume')
										this.formatDecimalPlaces(this.inbound.data[0], 'inboundVolumeWeight')
										this.formatDecimalPlaces(this.inbound.data[0], 'inboundChargeWeights')
										this.ifOrderHaveSizeValCountOther()
										this.countOrderDimensions()
									} else {
										this.openError(response.data.messageInfo)
									}
									this.inbound.loading = false
								}.bind(this));
						} else {
							this.queryInboundList()
						}
						//出重结束
					} else {
						this.openError(resp.data.messageInfo)
					}
				}).catch((error) => {
					this.openError(error.response.data.messageInfo)
				});

      //shareInboundFlag
      if(this.frow.businessScope=='AE'){
        this.shareInboundFlag = true;
        this.$axios.get2('/afbase/afOrderShare/check/'+this.frow.orderId+'/订单协作'+'/null').then((response)=> {
          if(response.data.data){
           this.shareInboundFlagTwo = true;
          }
        }).catch((error)=> {
        	console.log(error);
        });
      }
		},
		mounted: function() {
			this.$axios.get('/hrs/org/getUpToken')
				.then(function(response) {
					this.inbound.token = response.data.data;
				}.bind(this));
		}
	}
</script>
