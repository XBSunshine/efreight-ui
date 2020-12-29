<template>
	<el-dialog title="查看文件" width="650px" :visible.sync="visible" :close-on-press-escape="false" :close-on-click-modal="false" :before-close="handleClose" append-to-body>
		<el-upload v-if="false" class="upload-demo" :action="actionPath" :data="param" :accept="accept" :on-preview="handlePreview" :on-success="uploadSuccess" :before-upload="beforeUpload" :on-remove="handleRemove" list-type="picture-card" :show-file-list=false>
			<i class="el-icon-plus"></i>
			<div slot="tip" class="el-upload__tip">只能上传jpeg/gif/jpg/png/bmp文件，且不超过500kb</div>
		</el-upload>
		<ul class="el-upload-list el-upload-list--picture-card">
			<li v-for="(file,index) in fileList" :key="index" class="el-upload-list__item is-success">
				<img :src="file.fileUrl" alt="图片未找到" class="el-upload-list__item-thumbnail">
				<a class="el-upload-list__item-name"><i class="el-icon-document"></i>{{file.fileName}}</a>
				<label class="el-upload-list__item-status-label">
                    <i class="el-icon-upload-success el-icon-check"></i>
                    </label>
				<!--<span class="el-upload-list__item-actions">
					<span class="el-upload-list__item-preview">
						<i class="el-icon-zoom-in"></i>
					</span>
				<span class="el-upload-list__item-delete">
						<i class="el-icon-delete" @click="handleRemove(file.fileId,index)"></i>
					</span>
				</span>-->
			</li>
		</ul>
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
				actionPath: 'http://up-z1.qiniu.com',
				param: {
					token: '',
					key: ''
				},
				fileList: [],
				accept: "image/jpeg,image/gif,image/png,image/bmp,image/jpg",
				token: '',
				loading: true
			}
		},

		created: function() {
			this.$axios.get('/hrs/org/getUpToken')
				.then(function(response) {
					this.param.token = response.data.data;
					this.loading = false
				}.bind(this));

			let inboundId = this.frow.inboundId
			this.$axios.get2('/afbase/inboundFiles', {
				inboundId: inboundId
			}).then((response) => {
				if(response.data.code == 0) {
					this.fileList = response.data.data;
				}
			});

		},

		methods: {
			openSuccess() {
				this.$notify({
					title: '',
					message: '操作成功',
					type: 'success',
					position: 'bottom-right'
				});
			},
			openError(info) {
				this.$notify({
					title: '',
					message: '操作失败，' + info,
					type: 'error',
					position: 'bottom-right'
				});
			},
			handleClose() {
				this.$emit('update:visible', false);
			},
			beforeUpload(file) {
				console.log(file)
				this.param.key = this.frow.orderCode + '_' + new Date().getTime() + '_' + file.name
			},
			handlePreview(file) {

			},
			uploadSuccess(response, file, fileList) {
				//新上传文件

				this.$axios.post2('/afbase/inboundFiles', {
						fileName: file.name,
						fileUrl: 'http://doc.yctop.com/' + response.key,
						inboundId: this.frow.inboundId
					})
					.then((resp) => {
						if(resp.data.code == 0) {
							this.fileList.push({
								fileName: file.name,
								fileUrl: "http://doc.yctop.com/" + response.key,
								fileId: resp.data.data
							})
						} else {
							this.openError(resp.data.messageInfo);
						}

					}).catch((error) => {
						let errorinfo = error.response.data.messageInfo;
						this.openError(errorinfo);
					});
			},
			handleRemove(id, index) {
				console.log(id)
				console.log(index)
				//删除操作
				this.$confirm('此操作将永久删除,不可恢复, 是否继续?', '注意', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning',
					center: true
				}).then(() => {
					this.$axios.deletes('/afbase/inboundFiles/' + id)
						.then(function(response) {
							if(response.data.code == 0) {
								this.fileList.splice(index, 1)
							} else {
								this.openError(response.data.messageInfo);
							}
						}.bind(this));
				}).catch(() => {
					this.$message({
						type: 'info',
						message: '已取消删除'
					});
				});
			}

			//--------------------- 

		}
	}
</script>