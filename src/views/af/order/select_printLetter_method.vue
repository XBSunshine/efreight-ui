<template>
	<el-dialog element-loading-text="请稍等,下载中..." element-loading-spinner="el-icon-loading" v-loading="loading" title="打印方式选择" width="250px" :visible.sync="visible" :close-on-press-escape="false" :close-on-click-modal="false" :before-close="handleClose" append-to-body>
		<el-form label-width="100px" class="demo-ruleForm">
			<el-row>
				<el-col class="elementWidth">
					<el-form-item label-width="20px">
						<el-button type="primary" size="small" icon="el-icon-printer" @click="exportExcel" v-if="exportExcelVisible">导出</el-button>
					</el-form-item>
				</el-col>
				<el-col class="elementWidth">
					<el-form-item label-width="10px">
						<el-button type="primary" size="small" icon="el-icon-printer" @click="printSubmit">打印</el-button>
					</el-form-item>
				</el-col>
			</el-row>
		</el-form>
		<selectTemplate ref="addMission" v-if="selectTemplateVisible" :visible.sync="selectTemplateVisible" :frow="frow"></selectTemplate>
	</el-dialog>
</template>
<script>
	import SelectTemplate from './printLetter_template_select'
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
				selectTemplateVisible: false,
				exportExcelVisible: false,
				loading: false
			}
		},

		components: {
			'selectTemplate': SelectTemplate,
		},

		created: function() {
			let params = {
				"awbUUIds": this.frow.awbUuid
			};
			this.$axios.post2('/afbase/operationPlan/isExistExcelTemplate', params)
				.then(function(response) {
					if (response.data.data == 'exist') {
						this.exportExcelVisible = true;
					} else {
						this.exportExcelVisible = false;
					}
				}.bind(this)).catch(function(error) {

				}.bind(this));
		},
		methods: {
			printSubmit() {
				if (this.frow.flag == 'moreTemplate') {
					this.selectTemplateVisible = true;
				} else {
					let pdfUrl = this.frow.pdfUrl;
					if (pdfUrl) {
						window.open(pdfUrl)
					}
				}
			},
			exportExcel() {
				this.loading = true
				this.$axios.post3('/afbase/operationPlan/exportExcel/' + this.frow.awbUuid)
					.then(function(response) {
						this.loading = false
						var blob = new Blob([response.data], {
							type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8'
						});
						var downloadElement = document.createElement('a');
						var href = window.URL.createObjectURL(blob); // 创建下载的链接
						downloadElement.href = href;
						let name = "DELIVERY_NOTE";
						/*if (this.frow.data.length == 1) {
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
						}*/
						downloadElement.download = name + '_' +(this.frow.awbNumber || '') +'_' + new Date().getTime() + '.xlsx'; // 下载后文件名
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
