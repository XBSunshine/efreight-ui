<template>
	<el-dialog title="海运出口订单 - 集装箱量" width="1050px" :visible.sync="visible" :close-on-press-escape="false" :close-on-click-modal="false" :before-close="handleClose" append-to-body style="top:-80px;">
		<div style="margin-right: 10px;float: right;">
			<span style="margin-right: 20px;">订单件数&nbsp;&nbsp;{{orderPiecesShow}}</span>
			<span style="margin-right: 20px;">订单毛重&nbsp;&nbsp;{{orderWeightShow}}</span>
			<span>订单体积&nbsp;&nbsp;{{orderVolumeShow}}</span>
		</div>
		<el-table :data="data" style="width: 1050px;" class="orderEditContainerPage">
			<el-table-column label="箱号" align="center" width="200">
				<template slot-scope="scope">
					<el-input size="small" v-model="scope.row.containerNumber" clearable @input="scope.row.containerNumber=scope.row.containerNumber.toUpperCase()"></el-input>
				</template>
			</el-table-column>
			<el-table-column label="封号" align="center" width="200">
				<template slot-scope="scope">
					<el-input size="small" v-model="scope.row.containerSealNo" clearable></el-input>
				</template>
			</el-table-column>
			<el-table-column label="尺寸" align="center" width="80">
				<template slot-scope="scope">
					<el-select v-model="scope.row.containerSize" clearable placeholder="选择尺寸" @change="countTotal">
						<el-option v-for="(item,index) in containerSizes" :key="index" :label="item.paramText" :value="item.paramText">
						</el-option>
					</el-select>
				</template>
			</el-table-column>
			<el-table-column label="箱型" align="center" width="80">
				<template slot-scope="scope">
					<el-select v-model="scope.row.containerCode" clearable placeholder="选择箱型" @change="countTotal">
						<el-option v-for="(item,index) in containerCodes" :key="index" :label="item.paramText" :value="item.paramText">
						</el-option>
					</el-select>
				</template>
			</el-table-column>
			<el-table-column label="件数" align="center">
				<template slot-scope="scope">
					<el-input size="small" v-model="scope.row.pieces" maxlength="6" clearable @input="checkInt(scope.row,'pieces')" @change="countTotal"></el-input>
				</template>
			</el-table-column>
			<el-table-column label="毛重" align="center">
				<template slot-scope="scope">
					<el-input size="small" v-model="scope.row.weight" clearable @input="checkFloat(scope.row,'weight')" @change="countTotal"></el-input>
				</template>
			</el-table-column>
			<el-table-column label="体积" align="center">
				<template slot-scope="scope">
					<el-input size="small" v-model="scope.row.volume" clearable @input="checkFloat(scope.row,'volume')" @change="countTotal"></el-input>
				</template>
			</el-table-column>
			<el-table-column label="VGM重量" align="center">
				<template slot-scope="scope">
					<el-input size="small" v-model="scope.row.weightVgm" clearable @input="checkFloat(scope.row,'weightVgm')" @change="countTotal"></el-input>
				</template>
			</el-table-column>
			<el-table-column fixed width="60" align="center">
				<template slot="header">
					<i class="iconfont el-icon-myyuanquanjiahao" @click="doAdd" style="cursor: pointer;size: b5;color: #409EFF;"></i>
				</template>
				<template slot-scope="scope">
					<i class="iconfont el-icon-myjianhao" @click="doDelete(scope.$index,scope.row)" style="cursor: pointer;size: b5;color: #409EFF;"></i>
				</template>
			</el-table-column>
		</el-table>
		<div style="width: 1010px;margin-left:10px;margin-top:20px;border-bottom: 15px solid #EBEEF5;border-left: 15px solid #EBEEF5;border-right: 15px solid #EBEEF5;border-radius: 10px 10px;">
			<div style="background-color: #EBEEF5;height: 35px;width: auto;">
				<font style="float:left;margin-top: 10px;">快速填写</font>
			</div>
			<el-input type="textarea" rows="6" cols="35" v-model="inputSize" placeholder="样例：20GP*5;40HQ*1" auto-complete="off">
			</el-input>
			<el-button style="float:left;position: relative;left:810px;top:-45px;" round @click="emptyInputMany">清空</el-button>
			<el-button style="float:left;position: relative;left:805px;top:-45px;" round @click="inputMany">识别</el-button>
		</div>
		<el-divider style="margin: 15px 0;"></el-divider>
		<div style="margin:10px 10px 10px 22px;">
			<div style="margin-right: 20px;">
				<span>合计： {{totalShow}} TEU, 件数 {{totalPiecesShow}}, 毛重 {{totalWeightShow}}, 体积 {{totalVolumeShow}}, VGM {{totalVGMShow}}</span>
			</div>
		</div>
		<div style="margin-left: 10px;margin-bottom: 10px;">
			<el-button type="primary" size="small" @click="empty" style="background: #FFFFFF;color: #409EFF;" plain>清空</el-button>
			<el-button type="primary" size="small" @click="doSelect">确定</el-button>
		</div>
	</el-dialog>
</template>
<script>
	import DigitCheckTable from '@/views/public/containerNumber_checkDigit_codeTable.json'
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
				orderPieces: '',
				orderVolume: '',
				orderWeight: '',
				orderPiecesShow: '',
				orderVolumeShow: '',
				orderWeightShow: '',
				total: '',
				totalPieces: '',
				totalWeight: '',
				totalVolume: '',
				totalVGM: '',
				totalShow: '',
				totalPiecesShow: '',
				totalWeightShow: '',
				totalVolumeShow: '',
				totalVGMShow: '',
				data: [],
				containerSizes: [],
				containerCodes: [],
				inputSize: '',
				val: ''
			}
		},

		inject: ['containerCallback'],
		created: function() {
			this.$axios.get('/sc/vScCategory/集装箱尺寸').then((response) => {
				this.containerSizes = response.data.data;
			})
			this.$axios.get('/sc/vScCategory/集装箱型').then((response) => {
				this.containerCodes = response.data.data;
			})
			if (this.frow.containerDetails.length != 0) {
				this.data = this.frow.containerDetails
			} else {
				this.data = [{
					containerNumber: '',
					containerSealNo: '',
					containerSize: '20',
					containerCode: 'GP',
					number: '1',
					numberTeu: '1',
					pieces: '',
					weight: '',
					volume: '',
					weightVgm: ''
				}]
			}
			this.orderPieces = this.frow.planPieces
			this.orderVolume = this.frow.planVolume
			this.orderWeight = this.frow.planWeight
			if (this.frow.planPieces || this.frow.planPieces === 0) {
				this.orderPiecesShow = this.formatQWF(this.frow.planPieces + '', 'int')
			} else {
				this.orderPiecesShow = ''
			}
			if (this.frow.planVolume || this.frow.planVolume === 0) {
				this.orderVolumeShow = this.formatQWF(parseFloat(this.frow.planVolume), 'float')
			} else {
				this.orderVolumeShow = ''
			}
			if (this.frow.planWeight || this.frow.planWeight === 0) {
				this.orderWeightShow = this.formatQWF(parseFloat(this.frow.planWeight), 'float')
			} else {
				this.orderWeightShow = ''
			}
			this.countTotal()
		},

		methods: {
			formatQWF(data, flag) {
				if (flag == 'float') {
					return data.toFixed(3).replace(/\d{1,3}(?=(\d{3})+(\.\d*)?$)/g, '$&,')
				} else if (flag == 'int') {
					return data.replace(/\d{1,3}(?=(\d{3})+(\.\d*)?$)/g, '$&,')
				}
			},
			countTotal() {
				this.total = 0
				this.totalPieces = 0
				this.totalWeight = 0
				this.totalVolume = 0
				this.totalVGM = 0
				this.data.forEach(row => {
					if (row.containerSize && row.containerCode) {
						if (row.containerSize == '20') {
							row.numberTeu = 1
							this.total += 1
						} else {
							row.numberTeu = 2
							this.total += 2
						}
						row.number = 1
					}
					if (row.pieces) {
						this.totalPieces += parseInt(row.pieces)
					}
					if (row.weight) {
						this.totalWeight += parseFloat(row.weight)
					}
					if (row.volume) {
						this.totalVolume += parseFloat(row.volume)
					}
					if (row.weightVgm) {
						this.totalVGM += parseFloat(row.weightVgm)
					}
				})
				this.totalShow = this.formatQWF(this.total + '', 'int')
				this.totalPiecesShow = this.formatQWF(this.totalPieces + '', 'int')
				this.totalWeightShow = this.formatQWF(this.totalWeight, 'float')
				this.totalVolumeShow = this.formatQWF(this.totalVolume, 'float')
				this.totalVGMShow = this.formatQWF(this.totalVGM, 'float')

				this.totalWeight = this.totalWeight.toFixed(3)
				this.totalVolume = this.totalVolume.toFixed(3)
				this.totalVGM = this.totalVGM.toFixed(3)
			},
			doSelect() {
				if (this.data.some(row => row.containerSize == '')) {
					this.openError('请选择尺寸')
					return
				}
				if (this.data.some(row => row.containerCode == '')) {
					this.openError('请选择箱型')
					return
				}
				//校验箱号
				if(!this.checkContainerNumber()){
					return
				}
				//校验箱号封号唯一性
				let list = this.data.map(item => item.containerNumber + item.containerSealNo)
				if (Array.from(new Set(list)).length != list.length) {
					this.openError("箱号+封号不可以重复")
					return
				}

				//拼接
				let result = {}
				this.data.forEach((row) => {
					if (row != null && row !== '') {
						let key = row.containerSize + row.containerCode
						if (result[key] == null) {
							result[key] = 1
						} else {
							result[key] += 1
						}

					}
				})
				for (let prop in result) {
					if (this.val) {
						this.val += ";" + prop + "*" + result[prop]
					} else {
						this.val = prop + "*" + result[prop]
					}
				}
				if (this.totalPieces != 0 || parseFloat(this.totalWeight) != 0 || parseFloat(this.totalVolume) != 0) {
					if (this.orderPieces != this.totalPieces || parseFloat(this.orderWeight) != parseFloat(this.totalWeight) || parseFloat(this.orderVolume) != parseFloat(this.totalVolume)) {
						this.$confirm('总件数、总重量、总体积与订单不符，是否覆盖原订单数据', '提示', {
							distinguishCancelAndClose: true,
							cancelButtonText: '否',
							confirmButtonText: '是',
							type: 'warning',
							center: true
						}).then(() => {
							this.containerCallback({
								val: this.val,
								total: this.total,
								flag: 'replace',
								totalPieces: this.totalPieces,
								totalWeight: this.totalWeight,
								totalVolume: this.totalVolume,
								containerDetails: this.data
							})
							this.handleClose()
						}).catch(() => {
							this.containerCallback({
								val: this.val,
								total: this.total,
								containerDetails: this.data
							})
							this.handleClose()
						})
					} else {
						this.containerCallback({
							val: this.val,
							total: this.total,
							containerDetails: this.data
						})
						this.handleClose()
					}
				} else {
					this.containerCallback({
						val: this.val,
						total: this.total,
						containerDetails: this.data
					})
					this.handleClose()
				}
			},
			doDelete(index, rrow) {
				this.data.splice(index, 1)
				this.countTotal();
			},
			doAdd() {
				this.data.push({
					containerNumber: '',
					containerSealNo: '',
					containerSize: '20',
					containerCode: 'GP',
					number: '1',
					numberTeu: '1',
					pieces: '',
					weight: '',
					volume: '',
					weightVgm: ''
				})
				this.countTotal();
			},
			checkInt(row, prop) {
				row[prop] = row[prop].replace(/[^0123456789]/g, "");
				if (row[prop].startsWith("0")) {
					row[prop] = row[prop].substr(0, 1)
				}
			},
			checkFloat(row, prop) {
				row[prop] = row[prop].replace(/[^0123456789.]/g, "");
				let t = row[prop].split('.');
				if (t.length > 1) {
					if (t[0] == '') {
						row[prop] = "0." + t[1].substr(0, 3);
					} else {
						row[prop] = t[0] + "." + t[1].substr(0, 3);
					}
				} else {
					if (row[prop].startsWith("0")) {
						row[prop] = row[prop].substr(0, 1)
					}
				}
			},
			empty() {
				this.data = []
				this.countTotal()
			},
			checkContainerNumber() {
				try {
					this.data.forEach((item, index) => {
						let containerNumber = item.containerNumber
						if (containerNumber) {
							let regx = /^[A-Z]{4}\d{7}$/g
							if (!regx.test(containerNumber)) {
								// this.openError('第' + (index + 1) + '行箱号格式有误，建议4位字母+7位数字')
								this.openError('第' + (index + 1) + '行箱号，不符合 集装箱号 ISO6346（1995）标准 校验规则，请确认。')
								throw new Error('finish')
							} else {
								let checkDigit = (DigitCheckTable[containerNumber.substr(0, 1)] +
									DigitCheckTable[containerNumber.substr(1, 1)] * 2 +
									DigitCheckTable[containerNumber.substr(2, 1)] * 4 +
									DigitCheckTable[containerNumber.substr(3, 1)] * 8 +
									DigitCheckTable[containerNumber.substr(4, 1)] * 16 +
									DigitCheckTable[containerNumber.substr(5, 1)] * 32 +
									DigitCheckTable[containerNumber.substr(6, 1)] * 64 +
									DigitCheckTable[containerNumber.substr(7, 1)] * 128 +
									DigitCheckTable[containerNumber.substr(8, 1)] * 256 +
									DigitCheckTable[containerNumber.substr(9, 1)] * 512) % 11
								if (checkDigit != containerNumber.substr(10, 1)&&!(checkDigit===10&&containerNumber.substr(10, 1)==='0')) {
									// this.openError('第' + (index + 1) + '行箱号最后校验位有误，建议' + (checkDigit===10?'0':checkDigit))
									this.openError('第' + (index + 1) + '行箱号，不符合 集装箱号 ISO6346（1995）标准 校验规则，请确认。')
									throw new Error('finish')
								}
							}
						}
					})
				} catch (e) {
					if (e.message === 'finish') {
						return false
					} else {
						throw new Error(e.message)
						return false
					}
				}
				return true
			},
			inputMany() {
				let tempData = this.data
				this.data = []
				if (this.inputSize) {
					this.inputSize = this.inputSize.replace(/\n/g, ';').replace(/ /g, '').replace(/；/g, ';').replace(/；/g, ';').replace('x', '*').replace('X', '*').replace(/[ ]/g, '').replace(/;+/g, ';').toUpperCase()
					try {
						this.inputSize.split(";").forEach((item) => {
							if (item) {
								if (this.containerSizes.every(size => size.paramText != item.substr(0, 2))) {
									throw Error('error')
								}
								if (this.containerCodes.every(containerCode => containerCode.paramText != item.substr(2, 2))) {
									throw Error('error')
								}
								if (item.substr(4, 1) != '*') {
									throw Error('error')
								}
								let regx = /^(0|\+?[1-9][0-9]*)$/g
								if (!regx.test(item.substring(5))) {
									throw Error('error')
								}
								let numVal = item.substring(5)
								if (item.substring(5).startsWith('0')) {
									numVal = '0'
								}
								if (numVal != '0') {
									if (item.substr(0, 2) == '20') {
										for (let i = 0; i < parseInt(numVal); i++) {
											this.data.push({
												containerNumber: '',
												containerSealNo: '',
												containerSize: item.substr(0, 2),
												containerCode: item.substr(2, 2),
												number: '1',
												numberTeu: '1',
												pieces: '',
												weight: '',
												volume: '',
												weightVgm: ''
											})
										}
									} else {
										for (let i = 0; i < parseInt(numVal); i++) {
											this.data.push({
												containerNumber: '',
												containerSealNo: '',
												containerSize: item.substr(0, 2),
												containerCode: item.substr(2, 2),
												number: '1',
												numberTeu: '2',
												pieces: '',
												weight: '',
												volume: '',
												weightVgm: ''
											})
										}
									}
								}
							}
						})
						this.countTotal()
					} catch (e) {
						if (e.message == 'error') {
							this.openError('格式有误')
							this.data = tempData
						}
					}
				} else {
					this.countTotal()
				}
			},
			emptyInputMany() {
				this.inputSize = ''
			},
			handleClose() {
				this.$emit('update:visible', false);
			},
			openError(info) {
				this.$notify({
					title: '',
					message: info,
					type: 'error',
					position: 'bottom-right'
				});
			}
			//---------------------

		}
	}
</script>
<style type="text/css">
	.orderEditContainerPage .el-input__icon {
		line-height: 30px !important;
	}
</style>
