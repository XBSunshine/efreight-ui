<template>
	<el-dialog title="单证制作 - 编辑尺寸" width="480px" :visible.sync="visible" :close-on-press-escape="false" :close-on-click-modal="false" :before-close="handleClose" append-to-body>
		<div>
			<el-button type="text" size="small" v-on:click="doAdd">增加</el-button>
			<el-button type="text" size="small" v-on:click="doSelect">确定</el-button>
		</div>
		<div>
			<el-table :data="data1">
				<el-table-column label="长(CM)" width="100" align="center">
					<template slot-scope="scope">
						<el-input size="small" v-model="scope.row.awbSizeLength" @input="checkFloat(scope.row,'awbSizeLength')"></el-input>
					</template>
				</el-table-column>
				<el-table-column label="宽(CM)" width="100" align="center">
					<template slot-scope="scope">
						<el-input size="small" v-model="scope.row.awbSizeWidth" @input="checkFloat(scope.row,'awbSizeWidth')"></el-input>
					</template>
				</el-table-column>
				<el-table-column label="高(CM)" width="100" align="center">
					<template slot-scope="scope">
						<el-input size="small" v-model="scope.row.awbSizeHeight" @input="checkFloat(scope.row,'awbSizeHeight')"></el-input>
					</template>
				</el-table-column>
				<el-table-column label="件数" width="100" align="center">
					<template slot-scope="scope">
						<el-input size="small" v-model="scope.row.awbSizePieces" @input="checkInt(scope.row,'awbSizePieces')"></el-input>
					</template>
				</el-table-column>
				<el-table-column label="操作" width="60" align="center">
					<template slot-scope="scope">
						<el-button type="text" size="small" v-on:click="doDelete(scope.$index,scope.row)">删除</el-button>

					</template>
				</el-table-column>
			</el-table>
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
				editModeEnabled: true,
				data1: []
			}
		},

		inject: ['callback'],
		created: function() {
			if(this.frow.size) {
				let list = this.frow.size.split("\n");
				for(var i = 0; i < list.length; i++) {

					let map = list[i].split("*");
					let j = {
						awbSizeLength: map[0],
						awbSizeWidth: map[1],
						awbSizeHeight: map[2].split(" CM/")[0],
						awbSizePieces: map[2].split(" CM/")[1]
					};
					this.data1.push(j);
				}

			} else {
				this.data1 = [{
					awbSizeLength: '',
					awbSizeWidth: '',
					awbSizeHeight: '',
					awbSizePieces: ''
				}]
			}
			// this.queryList();
		},

		methods: {

			doSelect() {
				let maps = '';
				let volume = 0.000
				for(var i = 0; i < this.data1.length; i++) {
					if(this.data1[i].awbSizeLength == null || this.data1[i].awbSizeLength == '' || this.data1[i].awbSizeLength == ".") {
						this.$notify({
							title: '',
							message: '第' + (i + 1) + '行的长为空或数据有误，请重新填写',
							type: 'error',
							position: 'bottom-right'
						});
						return;
					}
					if(this.data1[i].awbSizeWidth == null || this.data1[i].awbSizeWidth == '' || this.data1[i].awbSizeWidth == ".") {
						this.$notify({
							title: '',
							message: '第' + (i + 1) + '行的宽为空或数据有误，请重新填写',
							type: 'error',
							position: 'bottom-right'
						});
						return;
					}
					if(this.data1[i].awbSizeHeight == null || this.data1[i].awbSizeHeight == '' || this.data1[i].awbSizeHeight == ".") {
						this.$notify({
							title: '',
							message: '第' + (i + 1) + '行的高为空或数据有误，请重新填写',
							type: 'error',
							position: 'bottom-right'
						});
						return;
					}
					if(this.data1[i].awbSizePieces == null || this.data1[i].awbSizePieces == '' || this.data1[i].awbSizePieces == ".") {
						this.$notify({
							title: '',
							message: '第' + (i + 1) + '行的件数为空，请重新填写',
							type: 'error',
							position: 'bottom-right'
						});
						return;
					}
					if(maps.length > 0) {
						maps = maps + "\n" + this.data1[i].awbSizeLength + "*" + this.data1[i].awbSizeWidth + "*" + this.data1[i].awbSizeHeight + " CM/" + this.data1[i].awbSizePieces;
					} else {
						maps = this.data1[i].awbSizeLength + "*" + this.data1[i].awbSizeWidth + "*" + this.data1[i].awbSizeHeight + " CM/" + this.data1[i].awbSizePieces;
					}
					volume+=parseFloat(this.data1[i].awbSizeLength)*parseFloat(this.data1[i].awbSizeWidth)*parseFloat(this.data1[i].awbSizeHeight)*parseFloat(this.data1[i].awbSizePieces)
				}
				volume = (volume/1000000).toFixed(3)
				let data = {}
				data.size = maps
				data.sizeList = this.data1
				data.volume = volume
				this.callback(data, 'size');
				this.handleClose();
			},
			doDelete(index, rrow) {
				this.data1.splice(index, 1)
			},
			doAdd() {
				let j = {
					awbSizeLength: '',
					awbSizeWidth: '',
					awbSizeHeight: '',
					awbSizePieces: ''
				};
				this.data1.push(j);
			},
			checkInt(row, prop) {
				row[prop] = row[prop].replace(/[^0123456789]/g, "");
				if(row[prop].substr(0, 1) == 0) {
					row[prop] = row[prop].substr(1, row[prop].length - 1)
				}
			},
			checkFloat(row, prop) {
				row[prop] = row[prop].replace(/[^0123456789.]/g, "");
				let t = row[prop].split('.');
				if(t.length > 1) {
					if(t[0] == '') {
						row[prop] = "0." + t[1].substr(0, 2);
					} else {
						row[prop] = t[0] + "." + t[1].substr(0, 2);
					}
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