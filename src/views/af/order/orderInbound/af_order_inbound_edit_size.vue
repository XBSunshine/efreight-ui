<template>
	<el-dialog title="出重 - 编辑尺寸" width="850px" :visible.sync="visible" :close-on-press-escape="false" :close-on-click-modal="false" :before-close="handleClose" append-to-body>
		<el-table :data="data1" height="205px" style="width: 480px;">
			<el-table-column label="长(CM)" align="center">
				<template slot-scope="scope">
					<el-input size="small" v-model="scope.row.longs" @input="checkInt(scope.row,'longs')" maxlength="4" @change="setTotal"></el-input>
				</template>
			</el-table-column>
			<el-table-column label="宽(CM)" align="center">
				<template slot-scope="scope">
					<el-input size="small" v-model="scope.row.wides" @input="checkInt(scope.row,'wides')" maxlength="4" @change="setTotal"></el-input>
				</template>
			</el-table-column>
			<el-table-column label="高(CM)" align="center">
				<template slot-scope="scope">
					<el-input size="small" v-model="scope.row.highs" @input="checkInt(scope.row,'highs')" maxlength="4" @change="setTotal"></el-input>
				</template>
			</el-table-column>
			<el-table-column label="件数" align="center">
				<template slot-scope="scope">
					<el-input size="small" v-model="scope.row.numbers" @input="checkInt(scope.row,'numbers')" maxlength="4" @change="setTotal"></el-input>
				</template>
			</el-table-column>
			<el-table-column fixed label="操作" width="60" align="center">
				<template slot-scope="scope">
					<!--<el-button type="text" v-on:click="doDelete(scope.$index,scope.row)">删除</el-button>-->
					<i class="iconfont el-icon-myjianhao" @click="doDelete(scope.$index,scope.row)" style="cursor: pointer;size: b5;color: #409EFF;"></i>
				</template>
			</el-table-column>
			<!-- :formatter="formatter1" -->
		</el-table>
		<div style="margin:10px 10px 10px 22px;">
			<i class="iconfont el-icon-myyuanquanjiahao" @click="doAdd" style="cursor: pointer;size: b5;color: #409EFF;"></i>
			<div style="margin-left: 30px;margin-top: -20px;width: 430px;">
				<span>总件数：{{totalPieces}} 件 , </span>
				<span>总体积：{{totalVolume}} CBM , </span>
				<span>总体积重量：{{totalVolumeWeight}} KG</span>
			</div>
		</div>
		<div style="margin-left: 10px;margin-bottom: 10px;">
			<el-button type="primary" size="small" @click="doSelect">确定</el-button>
			<el-button type="primary" size="small" @click="empty">清空列表</el-button>
		</div>
		<div style="position: relative;left: 500px;top: -292px;float: left;">
			<el-form class="demo-ruleForm">
				<el-row>
					<el-col class="elementWidth">
						<el-form-item label-width="120px" label="批量录入尺寸">

						</el-form-item>
					</el-col>
				</el-row>
				<el-row>
					<el-col class="elementWidth">
						<el-form-item label-width="20px">
							<el-input type="textarea" rows="6" cols="35" v-model="inputSize" auto-complete="off" @keyup.enter.native="formatInputSize">
							</el-input>
						</el-form-item>
					</el-col>
				</el-row>
				<el-row>
					<el-col class="elementWidth">
						<p style="margin-left: 25px;">格式：长*宽*高/件数;&nbsp;&nbsp;每条尺寸分号';'分隔</p>
						<p style="margin-left: 25px;">例如：35*40*30/3;35*45*50/2;</p>
					</el-col>
				</el-row>
				<el-row>
					<el-col class="elementWidth">
						<el-form-item label-width="20px">
							<el-button style="margin-top: 10px;margin-left: 145px;" type="primary" size="small" @click="inputMany">批量录入</el-button>
							<el-button type="primary" size="small" @click="emptyInputMany">清空</el-button>
						</el-form-item>
					</el-col>
				</el-row>
			</el-form>
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
				data1: [],
				inputSize: ''
			}
		},

		inject: ['sizeCallback'],
		created: function() {
			if(this.frow.orderSize) {
				let list = this.frow.orderSize.split(";");
				for(var i = 0; i < list.length; i++) {

					let map = list[i].split("*");
					let map1 = list[i].split("/");
					let j = {
						longs: map[0],
						wides: map[1],
						highs: map[2].split('/')[0],
						numbers: map1[1]
					};
					this.data1.push(j);
				}

			} else {
				this.data1 = [{
					longs: '',
					wides: '',
					highs: '',
					numbers: ''
				}]
			}
			// this.queryList();
			this.setTotal();
		},

		methods: {
			setTotal() {
				let maps = '';
				let pieces = 0;
				let volume = 0;
				for(var i = 0; i < this.data1.length; i++) {
					if(maps.length > 0) {
						if(this.data1[i].longs && this.data1[i].wides && this.data1[i].highs && this.data1[i].numbers) {
							maps = maps + ";" + this.data1[i].longs + "*" + this.data1[i].wides + "*" + this.data1[i].highs + "/" + this.data1[i].numbers;
							volume = volume + this.data1[i].longs * this.data1[i].wides * this.data1[i].highs * this.data1[i].numbers;
						}
					} else {
						if(this.data1[i].longs && this.data1[i].wides && this.data1[i].highs && this.data1[i].numbers) {
							maps = this.data1[i].longs + "*" + this.data1[i].wides + "*" + this.data1[i].highs + "/" + this.data1[i].numbers;
							volume = this.data1[i].longs * this.data1[i].wides * this.data1[i].highs * this.data1[i].numbers;
						}
					}
					if(pieces != null) {
						if(this.data1[i].longs && this.data1[i].wides && this.data1[i].highs && this.data1[i].numbers) {
							pieces += parseInt(this.data1[i].numbers)
						}
					} else {
						if(this.data1[i].longs && this.data1[i].wides && this.data1[i].highs && this.data1[i].numbers) {
							pieces = parseInt(this.data1[i].numbers)
						}
					}
				}
				this.totalPieces = pieces
				this.totalVolume = (volume / 1000000).toFixed(3)
				this.totalVolumeWeight = (volume / 6000).toFixed(1)
			},
			doSelect() {
				let maps = '';
				for(var i = 0; i < this.data1.length; i++) {
					if(this.data1[i].longs == null || this.data1[i].longs == '' || this.data1[i].longs == ".") {
						this.$notify({
							title: '',
							message: '第' + (i + 1) + '行的长为空或数据有误，请重新填写',
							type: 'error',
							position: 'bottom-right'
						});
						return;
					}
					if(this.data1[i].wides == null || this.data1[i].wides == '' || this.data1[i].wides == ".") {
						this.$notify({
							title: '',
							message: '第' + (i + 1) + '行的宽为空或数据有误，请重新填写',
							type: 'error',
							position: 'bottom-right'
						});
						return;
					}
					if(this.data1[i].highs == null || this.data1[i].highs == '' || this.data1[i].highs == ".") {
						this.$notify({
							title: '',
							message: '第' + (i + 1) + '行的高为空或数据有误，请重新填写',
							type: 'error',
							position: 'bottom-right'
						});
						return;
					}
					if(this.data1[i].numbers == null || this.data1[i].numbers == '' || this.data1[i].numbers == ".") {
						this.$notify({
							title: '',
							message: '第' + (i + 1) + '行的件数为空，请重新填写',
							type: 'error',
							position: 'bottom-right'
						});
						return;
					}
					if(maps.length > 0) {
						maps = maps + ";" + this.data1[i].longs + "*" + this.data1[i].wides + "*" + this.data1[i].highs + "/" + this.data1[i].numbers;
					} else {
						maps = this.data1[i].longs + "*" + this.data1[i].wides + "*" + this.data1[i].highs + "/" + this.data1[i].numbers;
					}
				}
				this.sizeCallback(maps);
				this.handleClose();
			},
			doDelete(index, rrow) {
				this.data1.splice(index, 1)
				this.setTotal();
			},
			doAdd() {
				let j = {
					longs: '',
					wides: '',
					highs: '',
					numbers: ''
				};
				this.data1.push(j);
				this.setTotal();
			},
			checkInt(row, prop) {
				row[prop] = row[prop].replace(/[^0123456789]/g, "");
			},
			checkFloat(row, prop) {
				row[prop] = row[prop].replace(/[^0123456789.]/g, "");
				let t = row[prop].split('.');
				if(t.length > 1) {
					row[prop] = t[0] + "." + t[1].substr(0, 2);
				}
			},
			empty() {
				this.data1 = []
			},
      formatInputSize(){
         /* if(this.inputSize.endsWith(";")) {
              this.inputSize = this.inputSize.substring(0,this.inputSize.length-1);
          }
          this.inputSize = this.inputSize.replace(/\n/g, ';');*/
      },
			inputMany() {
        this.data1 = []
				if(this.inputSize != '') {
					this.inputSize = this.inputSize.replace(/\n/g, ';').replace(/ /g, '').replace(/；/g, ';').replace(/；/g, ';').replace('x','*').replace('X','*').replace(/[ ]/g,'').replace(';;',';')
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
						this.data1.push(j)
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

</style>
