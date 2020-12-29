<template>
	<el-dialog :title="frow.position+' - 编辑尺寸'" width="505px" :visible.sync="visible" :close-on-press-escape="false" :close-on-click-modal="false" :before-close="handleClose" append-to-body>

		<el-table :data="data" height="205px" style="width: 480px;">
			<el-table-column label="长(CM)" align="center">
				<template slot-scope="scope">
					<el-input size="small" v-model="scope.row.longs" @input="checkFloat(scope.row,'longs')" @change="setTotal"></el-input>
				</template>
			</el-table-column>
			<el-table-column label="宽(CM)" align="center">
				<template slot-scope="scope">
					<el-input size="small" v-model="scope.row.wides" @input="checkFloat(scope.row,'wides')" @change="setTotal"></el-input>
				</template>
			</el-table-column>
			<el-table-column label="高(CM)" align="center">
				<template slot-scope="scope">
					<el-input size="small" v-model="scope.row.highs" @input="checkFloat(scope.row,'highs')" @change="setTotal"></el-input>
				</template>
			</el-table-column>
			<el-table-column label="件数" align="center">
				<template slot-scope="scope">
					<el-input size="small" v-model="scope.row.numbers" @input="checkInt(scope.row,'numbers')" @change="setTotal"></el-input>
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
		<div style="width: 460px;height:200px;margin-left:10px;margin-top:20px;border-bottom: 15px solid #EBEEF5;border-left: 15px solid #EBEEF5;border-right: 15px solid #EBEEF5;border-radius: 10px 10px;">
			<div style="background-color: #EBEEF5;height: 35px;width: auto;">
				<font style="float:left;margin-top: 10px;">批量录入尺寸</font>
			</div>
			<el-input class="size_edit" type="textarea" rows="5" cols="35" v-model="inputSize" placeholder="格式：长*宽*高/件数,  每条尺寸分号';'分隔
例如：35*40*30/3;35*45*50/2;" auto-complete="off">
			</el-input>
			<el-button style="float:left;position: relative;left:290px;top:5px;padding: 5px 15px;" round @click="emptyInputMany">清空</el-button>
			<el-button style="float:left;position: relative;left:285px;top:5px;padding: 5px 15px;" round @click="inputMany">识别</el-button>
		</div>
		<el-divider style="margin: 15px 0;"></el-divider>
		<div style="margin:10px 10px 10px 22px;">
			<div style="margin-top: -20px;width: 430px;">
				<span>件数：{{totalPieces}} 件 , </span>
				<span>体积：{{totalVolume}} CBM , </span>
				<span>体积重量：{{totalVolumeWeight}} KG</span>
			</div>
		</div>
		<div style="margin-left: 10px;margin-bottom: 10px;">
			<el-button type="primary" size="small" @click="empty" plain style="background: #FFFFFF;color: #409EFF;">清空</el-button>
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
				totalPieces: 0,
				totalVolume: 0,
				totalVolumeWeight: 0,
				editModeEnabled: true,
				data: [],
				inputSize: ''
			}
		},

		inject: ['sizeEditCallBack'],
		created: function() {
			if(this.frow.planDimensions) {
				let list = this.frow.planDimensions.split(";");
				for(var i = 0; i < list.length; i++) {

					let map = list[i].split("*");
					let map1 = list[i].split("/");
					let j = {
						longs: map[0],
						wides: map[1],
						highs: map[2].split('/')[0],
						numbers: map1[1]
					};
					this.data.push(j);
				}

			} else {
				this.data = [{
					longs: '',
					wides: '',
					highs: '',
					numbers: ''
				}]
			}
			this.setTotal();
			// this.queryList();
		},

		methods: {
			setTotal() {
				let maps = '';
				let pieces = 0;
				let volume = 0;
				for(var i = 0; i < this.data.length; i++) {
					if(maps.length > 0) {
						if(this.data[i].longs && this.data[i].wides && this.data[i].highs && this.data[i].numbers) {
							maps = maps + ";" + this.data[i].longs + "*" + this.data[i].wides + "*" + this.data[i].highs + "/" + this.data[i].numbers;
							volume = volume + this.data[i].longs * this.data[i].wides * this.data[i].highs * this.data[i].numbers;
						}
					} else {
						if(this.data[i].longs && this.data[i].wides && this.data[i].highs && this.data[i].numbers) {
							maps = this.data[i].longs + "*" + this.data[i].wides + "*" + this.data[i].highs + "/" + this.data[i].numbers;
							volume = this.data[i].longs * this.data[i].wides * this.data[i].highs * this.data[i].numbers;
						}
					}
					if(pieces != null) {
						if(this.data[i].longs && this.data[i].wides && this.data[i].highs && this.data[i].numbers) {
							pieces += parseInt(this.data[i].numbers)
						}
					} else {
						if(this.data[i].longs && this.data[i].wides && this.data[i].highs && this.data[i].numbers) {
							pieces = parseInt(this.data[i].numbers)
						}
					}
				}
				this.totalPieces = pieces
				this.totalVolume = (volume / 1000000).toFixed(3)
				this.totalVolumeWeight = (volume / 6000).toFixed(1)
			},
			doSelect() {
				let maps = '';
				let pieces = 0;
				let volume = 0;
				for(let i = 0; i < this.data.length; i++) {
					if(this.data[i].longs == null || this.data[i].longs == '' || this.data[i].longs == ".") {
						this.$notify({
							title: '',
							message: '第' + (i + 1) + '行的长为空或数据有误，请重新填写',
							type: 'error',
							position: 'bottom-right'
						});
						return;
					}
					if(this.data[i].wides == null || this.data[i].wides == '' || this.data[i].wides == ".") {
						this.$notify({
							title: '',
							message: '第' + (i + 1) + '行的宽为空或数据有误，请重新填写',
							type: 'error',
							position: 'bottom-right'
						});
						return;
					}
					if(this.data[i].highs == null || this.data[i].highs == '' || this.data[i].highs == ".") {
						this.$notify({
							title: '',
							message: '第' + (i + 1) + '行的高为空或数据有误，请重新填写',
							type: 'error',
							position: 'bottom-right'
						});
						return;
					}
					if(this.data[i].numbers == null || this.data[i].numbers == '' || this.data[i].numbers == ".") {
						this.$notify({
							title: '',
							message: '第' + (i + 1) + '行的件数为空，请重新填写',
							type: 'error',
							position: 'bottom-right'
						});
						return;
					}

					if(maps.length > 0) {
						maps += ";" + this.data[i].longs + "*" + this.data[i].wides + "*" + this.data[i].highs + "/" + this.data[i].numbers;
					} else {
						maps = this.data[i].longs + "*" + this.data[i].wides + "*" + this.data[i].highs + "/" + this.data[i].numbers;
					}
					volume += parseFloat(this.data[i].longs) * parseFloat(this.data[i].wides) * parseFloat(this.data[i].highs) * parseInt(this.data[i].numbers)
					pieces += parseInt(this.data[i].numbers)
				}
				this.sizeEditCallBack({
					value: maps,
					pieces: pieces,
					volume: volume
				});
				this.handleClose();
			},
			doDelete(index, rrow) {
				this.data.splice(index, 1)
				this.setTotal();
			},
			doAdd() {
				let j = {
					longs: '',
					wides: '',
					highs: '',
					numbers: ''
				};
				this.data.push(j);
				this.setTotal();
			},
			checkInt(row, prop) {
				row[prop] = row[prop].replace(/[^0123456789]/g, "")
				if(row[prop].startsWith('0')) {
					row[prop] = '0'
				}
			},
			checkFloat(row, prop) {
				row[prop] = row[prop].replace(/[^0123456789.]/g, "");
				let t = row[prop].split('.');
				if(t.length > 1) {
					row[prop] = t[0] + "." + t[1].substr(0, 2);
				} else {
					if(row[prop].startsWith('0')) {
						row[prop] = '0'
					}
				}
			},
			empty() {
				this.data = []
			},
			inputMany() {
				if(this.inputSize != '') {
					this.inputSize = this.inputSize.replace(/\n/g, ';').replace(/ /g, '').replace(/；/g, ';').replace(/；/g, ';').replace('x', '*').replace('X', '*').replace(/[ ]/g, '').replace(/;+/g, ';')
					if(!this.inputSize.endsWith(";")) {
						this.inputSize += ";"
					}
					let regx = /^((0|[1-9]\d*)(\.\d{1,2})?\*(0|[1-9]\d*)(\.\d{1,2})?\*(0|[1-9]\d*)(\.\d{1,2})?\/(0|[1-9]\d*);)+$/g
					if(!regx.test(this.inputSize)) {
						this.openError("批量录入格式有误")
						return
					}
					let sumSizeData = {}
					this.inputSize.split(";").forEach((row) => {
						if(row != null && row !== '') {
							let key = row.split('*')[0] + "*" + row.split('*')[1] + "*" + row.split('*')[2].split('/')[0]
							let val = parseInt(row.split('/')[1])
							if(sumSizeData[key] == null) {
								sumSizeData[key] = val
							} else {
								sumSizeData[key] += val
							}

						}
					})
					this.data = []
					for(let prop in sumSizeData) {
						let long = prop.split("*")[0]
						let width = prop.split("*")[1]
						let high = prop.split("*")[2]
						let number = sumSizeData[prop]
						let j = {
							longs: long,
							wides: width,
							highs: high,
							numbers: number
						};
						this.data.push(j)
						this.setTotal()
					}
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
					message: '操作失败，' + info,
					type: 'error',
					position: 'bottom-right'
				});
			}

			//---------------------

		}
	}
</script>
<style type="text/css">
	.size_edit textarea {
		border: none;
		resize: none;
	}
</style>
