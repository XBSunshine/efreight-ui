<template>
	<el-dialog title="海运进口订单 - 集装箱量" width="450px" :visible.sync="visible" :close-on-press-escape="false" :close-on-click-modal="false" :before-close="handleClose" append-to-body style="top:-80px;">
		<el-table :data="data" style="width: 450px;" class="orderEditContainerPage">
			<el-table-column label="尺寸" align="center">
				<template slot-scope="scope">
					<el-select v-model="scope.row.containerSize" clearable placeholder="选择尺寸" style="width:90px;" @change="countTotal">
						<el-option v-for="(item,index) in containerSizes" :key="index" :label="item.paramText" :value="item.paramText">
						</el-option>
					</el-select>
				</template>
			</el-table-column>
			<el-table-column label="箱型" align="center">
				<template slot-scope="scope">
					<el-select v-model="scope.row.containerCode" clearable placeholder="选择箱型" style="width:90px;">
						<el-option v-for="(item,index) in containerCodes" :key="index" :label="item.paramText" :value="item.paramText">
						</el-option>
					</el-select>
				</template>
			</el-table-column>
			<el-table-column label="数量" align="center">
				<template slot-scope="scope">
					<el-input size="small" v-model="scope.row.number" clearable @input="checkInt(scope.row,'number')" @change="countTotal"></el-input>
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
		<div style="width: 400px;margin-left:10px;margin-top:20px;border-bottom: 15px solid #EBEEF5;border-left: 15px solid #EBEEF5;border-right: 15px solid #EBEEF5;border-radius: 10px 10px;">
			<div style="background-color: #EBEEF5;height: 35px;width: auto;">
				<font style="float:left;margin-top: 10px;">智能填写</font>
			</div>
			<el-input type="textarea" rows="6" cols="35" v-model="inputSize" placeholder="样例：20GP*5;40HQ*1" auto-complete="off">
			</el-input>
			<el-button style="float:left;position: relative;left:180px;top:-45px;" round @click="emptyInputMany">清空</el-button>
			<el-button style="float:left;position: relative;left:175px;top:-45px;" round @click="inputMany">识别</el-button>
		</div>
		<el-divider style="margin: 15px 0;"></el-divider>
		<div style="margin:10px 10px 10px 22px;">
			<div style="float: right;margin-right: 20px;">
				<span>合计：{{total}} TEU</span>
			</div>
		</div>
		<div style="margin-left: 10px;margin-bottom: 10px;">
			<el-button type="primary" size="small" @click="empty" plain>清空</el-button>
			<el-button type="primary" size="small" @click="doSelect">确定</el-button>
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
				total: 0,
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
			if(this.frow.containerDetails.length != 0) {
				this.data = this.frow.containerDetails
			} else {
				this.data = [{
					containerSize: '20',
					containerCode: 'GP',
					number: '1',
					numberTeu: '1'
				}]
			}
			this.countTotal();
		},

		methods: {
			countTotal() {
				this.total = 0
				this.data.forEach(row => {
					if(row.containerSize && row.number) {
						if(row.containerSize == 20) {
							this.total += parseInt(row.number)
							row.numberTeu = parseInt(row.number)
						} else {
							this.total += parseInt(row.number) * 2
							row.numberTeu = parseInt(row.number) * 2
						}
					}
				})
			},
			doSelect() {
				if(this.data.some(row => row.containerSize == '')) {
					this.openError('请选择尺寸')
					return
				}
				if(this.data.some(row => row.containerCode == '')) {
					this.openError('请选择箱型')
					return
				}
				if(this.data.some(row => row.number == '')) {
					this.openError('请录入数量')
					return
				}
				//拼接
				let result = {}
				this.data.forEach((row) => {
					if(row != null && row !== '') {
						let key = row.containerSize + row.containerCode
						let val = parseInt(row.number)
						if(result[key] == null) {
							result[key] = val
						} else {
							result[key] += val
						}

					}
				})
				for(let prop in result) {
					if(this.val) {
						this.val += ";" + prop + "*" + result[prop]
					} else {
						this.val = prop + "*" + result[prop]
					}
				}
				this.containerCallback({
					val: this.val,
					total: this.total,
					containerDetails: this.data
				})
				this.handleClose()
			},
			doDelete(index, rrow) {
				this.data.splice(index, 1)
				this.countTotal();
			},
			doAdd() {
				this.data.push({
					containerSize: '20',
					containerCode: 'GP',
					number: '1',
					numberTeu: '1'
				})
				this.countTotal();
			},
			checkInt(row, prop) {
				row[prop] = row[prop].replace(/[^0123456789]/g, "");
				if(row[prop].startsWith("0")) {
					row[prop] = row[prop].substring(1)
				}
			},
			checkFloat(row, prop) {
				row[prop] = row[prop].replace(/[^0123456789.]/g, "");
				let t = row[prop].split('.');
				if(t.length > 1) {
					row[prop] = t[0] + "." + t[1].substr(0, 2);
				}
			},
			empty() {
				this.data = []
				this.countTotal()
			},
			inputMany() {
				let tempData = this.data
				this.data = []
				if(this.inputSize) {
					this.inputSize = this.inputSize.replace(/\n/g, ';').replace(/ /g, '').replace(/；/g, ';').replace(/；/g, ';').toUpperCase()
					try {
						this.inputSize.split(";").forEach((item) => {
							if(item) {
								if(this.containerSizes.every(containerSize => containerSize.paramText != item.substr(0, 2))) {
									throw Error('error')
								}
								if(this.containerCodes.every(containerCode => containerCode.paramText != item.substr(2, 2))) {
									throw Error('error')
								}
								if(item.substr(4, 1) != '*') {
									throw Error('error')
								}
								let regx = /^(\+?[1-9][0-9]*)$/g
								if(!regx.test(item.substring(5))) {
									throw Error('error')
								}
								let numVal = item.substring(5)
								if(item.substring(5).startsWith('0')) {
									numVal = '0'
								}
								if(item.substr(0, 2) == '20') {
									this.data.push({
										containerSize: item.substr(0, 2),
										containerCode: item.substr(2, 2),
										number: numVal,
										numberTeu: numVal
									})
								} else {
									this.data.push({
										containerSize: item.substr(0, 2),
										containerCode: item.substr(2, 2),
										number: numVal,
										numberTeu: parseInt(numVal) * 2
									})
								}
							}
						})
						this.countTotal()
					} catch(e) {
						if(e.message == 'error') {
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