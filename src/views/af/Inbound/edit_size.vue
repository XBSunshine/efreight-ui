<template>
	<el-dialog title="操作出重 - 编辑尺寸" width="420px" :visible.sync="visible" :close-on-press-escape="false" :close-on-click-modal="false" :before-close="handleClose" append-to-body>
		<el-table :data="data1" height="205px">
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
			<span style="margin-left: 20px;">
			   <span>总件数：{{totalPieces}}</span>
			   <span>总体积：{{totalVolume}}</span>
			</span>
		</div>
		<div style="margin-left: 10px;margin-bottom: 10px;">
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
				editModeEnabled: true,
				data1: []
			}
		},

		inject: ['sizeCallback'],
		created: function() {
			if(this.frow.orderSize) {
				let list = this.frow.orderSize.split(";");
				for(var i = 0; i < list.length; i++) {

					let map = list[i].split("*");
					let j = {
						longs: map[0],
						wides: map[1],
						highs: map[2],
						numbers: map[3]
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
							maps = maps + ";" + this.data1[i].longs + "*" + this.data1[i].wides + "*" + this.data1[i].highs + "*" + this.data1[i].numbers;
							volume = volume + this.data1[i].longs * this.data1[i].wides * this.data1[i].highs * this.data1[i].numbers;
						}
					} else {
						if(this.data1[i].longs && this.data1[i].wides && this.data1[i].highs && this.data1[i].numbers) {
							maps = this.data1[i].longs + "*" + this.data1[i].wides + "*" + this.data1[i].highs + "*" + this.data1[i].numbers;
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
				this.totalPieces = pieces;
				this.totalVolume = (volume / 1000000).toFixed(3);
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
						maps = maps + ";" + this.data1[i].longs + "*" + this.data1[i].wides + "*" + this.data1[i].highs + "*" + this.data1[i].numbers;
					} else {
						maps = this.data1[i].longs + "*" + this.data1[i].wides + "*" + this.data1[i].highs + "*" + this.data1[i].numbers;
					}
				}
				this.sizeCallback(maps);
				this.handleClose();
			},
			doDelete(index, rrow) {
				this.data1.splice(index, 1)
			},
			doAdd() {
				let j = {
					longs: '',
					wides: '',
					highs: '',
					numbers: ''
				};
				this.data1.push(j);
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
			handleClose() {
				this.$emit('update:visible', false);
			}

			//--------------------- 

		}
	}
</script>
<style type="text/css">

</style>