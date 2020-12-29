<template>
	<el-dialog title="请选择制作方式" width="300px" :visible.sync="visible" :close-on-press-escape="false" :close-on-click-modal="false" :before-close="handleClose" append-to-body>
		<el-form label-width="100px" class="demo-ruleForm">
			<el-row>
				<el-col class="elementWidth">
					<el-form-item label-width="20px">
						<el-button type="primary" size="small" icon="el-icon-printer" @click="exportExcel">导出Excel</el-button>
					</el-form-item>
				</el-col>
				<el-col class="elementWidth">
					<el-form-item label-width="10px">
						<el-button type="primary" size="small" icon="el-icon-printer" @click="printSubmit">打印预览</el-button>
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
		},
		methods: {
			printSubmit() {
				this.$axios.post('/sc/scOrder/printHawMake/' + this.frow.orderId + '/' + this.frow.businessScope).then((response) => {
					this.handleClose()
					window.open(response.data.data)
				}).catch(function(error) {
					console.log(error);
				});
			},
			exportExcel() {
				this.$axios.post3('/sc/scOrder/exportHawMakeExcel/' + this.frow.orderId + '/' + this.frow.businessScope)
					.then(function(response) {
						var blob = new Blob([response.data], {
							type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8'
						});
						var downloadElement = document.createElement('a');
						var href = window.URL.createObjectURL(blob); // 创建下载的链接
						downloadElement.href = href;
						let name = "分提单制作"
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
