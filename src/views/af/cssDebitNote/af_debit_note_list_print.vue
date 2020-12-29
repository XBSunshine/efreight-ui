<template>
	<el-dialog v-loading="loading" :element-loading-text="loadingText" title="模板选择" width="500px" :visible.sync="visible" :close-on-press-escape="false" :close-on-click-modal="false" :before-close="handleClose" append-to-body>
		<el-form label-width="80px" class="demo-ruleForm">
			<el-row>
				<el-col class="elementWidth">
					<el-form-item label="模板类型">
						<el-select v-model="modelType" placeholder="请选择" required style="width: 120px;">
							<el-option v-for="(modelType,index) in modelTypes" :key="index" :label="modelType.name" :value="modelType.value"></el-option>
						</el-select>
					</el-form-item>
				</el-col>
				<el-col class="elementWidth">
					<el-form-item label-width="10px">
						<el-checkbox v-model="isTrue">打印明细</el-checkbox>
					</el-form-item>
				</el-col>
				<el-col class="elementWidth">
					<el-form-item label-width="10px">
						<el-button type="primary" size="mini" icon="el-icon-printer" @click="exportExcel">导出</el-button>
					</el-form-item>
				</el-col>
				<el-col class="elementWidth">
					<el-form-item label-width="10px">
						<el-button type="primary" size="mini" icon="el-icon-printer" @click="printSubmit">打印</el-button>
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
					name: '中文清单',
					value: 'C'
				}, {
					name: '英文清单',
					value: 'E'
				}],
				isTrue: true,
				loadingText: '',
				loading: false
			}
		},
		created: function() {},
		methods: {
			printSubmit() {
				let statementIds = this.frow.data.map((i) => {
					return i.statementId
				}).join();
				this.$axios.get('/afbase/statement/print/' + statementIds + '/' + this.modelType + '/' + this.frow.frow.businessScope + '/' + this.isTrue).then((response) => {
					this.handleClose()
					window.open(response.data.data)
				}).catch(function(error) {
					console.log(error);
				})
			},
			exportExcel() {
				let statementIds = this.frow.data.map((i) => {
					return i.statementId
				}).join();
				this.loading = true
				this.loadingText = '下载中，请稍等...'
				this.$axios.post3('/afbase/statement/printExcel/' + statementIds + '/' + this.modelType + '/' + this.frow.frow.businessScope + '/' + this.isTrue)
					.then(function(response) {
						this.loading = false
						var blob = new Blob([response.data], {
							type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8'
						});
						var downloadElement = document.createElement('a');
						var href = window.URL.createObjectURL(blob); // 创建下载的链接
						downloadElement.href = href;
						downloadElement.download = 'STATEMENT_' + this.frow.frow.statementNum + '.xlsx'; // 下载后文件名
						document.body.appendChild(downloadElement);
						downloadElement.click(); // 点击下载
						document.body.removeChild(downloadElement); // 下载完成移除元素
						window.URL.revokeObjectURL(href); // 释放掉blob对象
					}.bind(this));
			},
			handleClose() {
				this.$emit('update:visible', false);
			}
		}
	}
</script>
