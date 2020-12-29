<template>
	<el-dialog title="财务日期" width="500px" :visible.sync="visible" :close-on-press-escape="false" :close-on-click-modal="false" :before-close="handleClose" append-to-body>
		<el-form label-width="100px" class="demo-ruleForm">
			<el-row>
				<el-col :span="12">
					<el-form-item label="日期">
						<el-date-picker style="width: 133px;" v-model="receiptDate" type="date" value-format="yyyy-MM-dd" placeholder="选择日期">
						</el-date-picker>
					</el-form-item>

				</el-col>
				<el-col :offset="2" :span="2">
					<el-form-item>
						<el-button type="primary" size="small" icon="el-icon-printer" @click="printSubmit">确认</el-button>
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
				receiptDate: ''
			}
		},
		inject: ['findByPage', 'queryIncomeCostList'],
		created: function() {
			this.receiptDate=this.getDateTime(new Date());
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
			getDateTime(theDate) {
				var _year = theDate.getFullYear();
				var _month = theDate.getMonth();
				var _date = theDate.getDate();
				_month = _month + 1;
				if(_month < 10) {
					_month = "0" + _month;
				}
				if(_date < 10) {
					_date = "0" + _date;
				}
				return _year + "-" + _month + "-" + _date;
			},
			printSubmit() {
				if (this.receiptDate) {
				}else{
					this.openError("请选择日期");
					return;
				}
				this.$confirm('请确认,是否财务锁账?', '注意', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning',
					center: false
				}).then(() => {
					let params = {
						orderUuid: this.frow.orderUuid,
						businessScope: this.frow.businessScope,
						orderCode: this.frow.orderCode,
						orderId: this.frow.orderId,
						receiptDate:this.receiptDate
					}
					this.$axios.post2('/afbase/aforder/doFinish', params).then((response) => {
						if(response.data.code == 0) {
							this.openSuccess("操作成功");
							this.findByPage();
							this.queryIncomeCostList();
							this.handleClose();
						} else {
							this.openError(response.data.messageInfo);
						}
					}).catch(function(error) {
						let errorinfo = error.response.data.messageInfo;
						if(errorinfo.indexOf('已经做过财务锁账') > -1) {
							this.openError(errorinfo);
						}
					}.bind(this));
				}).catch(() => {
					// this.$message({
					// 	type: 'info',
					// 	message: '已取消删除'
					// });
				});
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