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
						<el-button type="primary" size="small" icon="el-icon-printer">确认</el-button>
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
		inject: ['printBill', 'sendBill'],
		created: function() {
			alert(123);
			// this.receiptDate=this.getDateTime(new Date());
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
			}

			//--------------------- 

		}
	}
</script>
<style type="text/css">

</style>