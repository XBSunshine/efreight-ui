<template>
	<el-dialog title="模板选择" width="500px" :visible.sync="visible" :close-on-press-escape="false" :close-on-click-modal="false" :before-close="handleClose" append-to-body>
		<el-form label-width="100px" class="demo-ruleForm">
			<el-row>
				<el-col class="elementWidth">
					<el-form-item label="模板类型">
						<el-select v-model="modelType" placeholder="请选择" style="width: 150px;" required>
							<el-option v-for="(modelType,index) in modelTypes" :key="index" :label="modelType.name" :value="modelType.value"></el-option>
						</el-select>
					</el-form-item>

				</el-col>
				<el-col class="elementWidth">
					<el-form-item label-width="20px">
						<el-button type="primary" size="small" icon="el-icon-printer" @click="exportExcel">导出</el-button>
					</el-form-item>
				</el-col>
				<el-col class="elementWidth">
					<el-form-item label-width="10px">
						<el-button type="primary" size="small" icon="el-icon-printer" @click="printSubmit">打印</el-button>
					</el-form-item>
				</el-col>
			</el-row>
		</el-form>
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
				modelType: 'C',
				modelTypes: [{
					name: '中文账单',
					value: 'C'
				}, {
					name: '英文账单',
					value: 'E'
				}]
			}
		},

		created: function() {
			//			if(this.frow.currency.length == 3) {
			//				if(this.frow.currency == 'CNY') {
			//					this.modelType = 'C'
			//				} else {
			//					this.modelType = 'E'
			//				}
			//			} else {
			//				this.modelType = 'C'
			//			}
		},
		methods: {
			printSubmit() {
				let debitNoteIds = this.frow.data.map((i) => {
					return i.debitNoteId
				}).join();
				// if(this.frow.businessScope=="AE"){
				this.$axios.post('/afbase/debitNote/printManynew/' + this.modelType + '/' + debitNoteIds + '/' + this.frow.businessScope).then((response) => {
					this.handleClose()
					window.open(response.data.data)
				}).catch(function(error) {
					console.log(error);
				});
				// }else{
				// 	this.$axios.post('/afbase/debitNote/printManynew/' + this.modelType + '/' + debitNoteIds+'/AI').then((response) => {
				// 		this.handleClose()
				// 		window.open(response.data.data)
				// 	}).catch(function(error) {
				// 		console.log(error);
				// 	});
				// }
			},
			exportExcel() {
				let debitNoteIds = this.frow.data.map((i) => {
					return i.debitNoteId
				}).join();
				this.$axios.post3('/afbase/debitNote/exportExcel/' + this.modelType + '/' + debitNoteIds + '/' + this.frow.businessScope)
					.then(function(response) {
						var blob = new Blob([response.data], {
							type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8'
						});
						var downloadElement = document.createElement('a');
						var href = window.URL.createObjectURL(blob); // 创建下载的链接
						downloadElement.href = href;
						let name = ""
						if (this.frow.data.length == 1) {
							if (this.frow.data[0].awbNumber) {
								name = this.frow.data[0].awbNumber + '_' + this.frow.data[0].debitNoteNum
							} else {
								name = this.frow.data[0].orderCode + '_' + this.frow.data[0].debitNoteNum
							}
						} else {
							if (this.frow.data[0].awbNumber) {
								name = this.frow.data[0].awbNumber
							} else {
								name = this.frow.data[0].orderCode
							}
						}
						downloadElement.download = name + '.xlsx'; // 下载后文件名
						document.body.appendChild(downloadElement);
						downloadElement.click(); // 点击下载
						document.body.removeChild(downloadElement); // 下载完成移除元素
						window.URL.revokeObjectURL(href); // 释放掉blob对象
					}.bind(this));
			},
			handleClose() {
				this.$emit('update:visible', false);
			}

			//---------------------

		}
	}
</script>
