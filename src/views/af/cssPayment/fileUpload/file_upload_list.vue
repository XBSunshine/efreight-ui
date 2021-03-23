<template>
	<el-dialog style="top:-80px;" :title="title+' - 附件'" width="800px" :visible.sync="visible" :close-on-press-escape="false" :before-close="handleClose">
		<div>
			<el-button style="margin-left: 10px;margin-bottom: 10px;" type="primary" size="mini" @click="singleFileUpload">附件上传</el-button>
			<el-button style="margin-left: 10px;margin-bottom: 10px;" type="primary" size="mini" @click="batchFileUpload">批量上传</el-button>
			<div>
				<el-table v-loading="loading" :data="data" border stripe>
					<el-table-column align="center" label="操作" width="60" type="index">
						<template slot-scope="scope">
							<i class="iconfont el-icon-myjianhao" @click="doDelete(scope.row)" style="cursor: pointer;size: b5;color: #409EFF;"></i>
						</template>
					</el-table-column>
					<el-table-column prop="fileType" label="附件类型" width="100" align="center"></el-table-column>
					<el-table-column label="文件名称" width="380" align="left" header-align="center">
						<template slot-scope="scope">
							<span style="cursor: pointer;" @click="view(scope.row)">{{scope.row.fileName}}</span>
						</template>
					</el-table-column>
					<el-table-column prop="fileRemark" label="备注" align="left" header-align="center"></el-table-column>
				</el-table>
				<singleFileUpload ref="addMission" v-if="singleFileUploadVisible" :visible.sync="singleFileUploadVisible" :frow="frow"></singleFileUpload>
				<batchFileUpload ref="addMission" v-if="batchFileUploadVisible" :visible.sync="batchFileUploadVisible" :frow="frow"></batchFileUpload>
			</div>
			<el-button style="margin-top: 10px;" type="primary" size="mini" @click="handleClose">取消</el-button>
		</div>
	</el-dialog>
</template>
<script>
	import SingleFileUpload from './file_upload_single'
	import BatchFileUpload from './file_upload_batch'

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
				singleFileUploadVisible: false,
				batchFileUploadVisible: false,
				data: [],
				loading: false,
				title: this.frow.flag == 'invoice'?'发票':'核销'
			}
		},
		inject: ['queryList'],
		components: {
			'singleFileUpload': SingleFileUpload,
			'batchFileUpload': BatchFileUpload,
		},
		provide() {
			return {
				queryUplaodFileList: this.queryUplaodFileList
			}
		},
		methods: {
			openSuccess(info) {
				this.$notify({
					title: '',
					message: info,
					type: 'success',
					position: 'bottom-right'
				});
			},

			openError(info) {
				this.$notify({
					title: '',
					message: info,
					type: 'error',
					position: 'bottom-right'
				});
			},
			singleFileUpload() {
				this.singleFileUploadVisible = true
			},
			batchFileUpload() {
				this.batchFileUploadVisible = true
			},
			doDelete(row) {
				this.$prompt('您将删除' + row.fileName + '附件,此操作不可恢复 , 是否继续?', '提示', {
					showInput: false,
					cancelButtonText: '取消',
					confirmButtonText: '确定',
					type: 'warn',
					center: true
				}).then(() => {
					this.$axios.deletes('/afbase/cssCostFiles/' + row.fileId).then((response) => {
						this.openSuccess("删除成功！")
						this.queryUplaodFileList();
					}).catch((error) => {
						this.openError("删除失败：" + error.response.data.messageInfo)
					});
				}).catch(() => {
					this.$message({
						type: 'info',
						message: '已取消删除'
					});
				});
			},
			queryUplaodFileList() {
				this.loading = true
				this.$axios.get("/afbase/cssCostFiles/" + this.frow.flag + "/" + this.frow.id).then((response) => {
					this.data = response.data.data
					this.loading = false
				}).catch((error) => {
					this.openError(error.response.data.messageInfo)
					this.loading = false
				});
			},
			view(row) {
				window.open(row.fileUrl)
			},
			handleClose() {
				this.queryList()
				this.$emit('update:visible', false);
			}
		},
		created() {
			this.queryUplaodFileList()
		}
	}
</script>
<style>
	.el-table .warning-row2 {
		background: oldlace;
		color: #409EFF;
		font-weight: bold !important;
	}

	.el-table .warning-row1 {
		background: oldlace;
		font-weight: bold !important;
	}

	.el-table .warning-row0 {
		color: #409EFF;
	}

	.el-table .cell {
		white-space: pre-line !important;
		/*保留换行符*/
	}

	.el-table .hidden_row {
		display: none;
		/*保留换行符*/
	}
</style>
