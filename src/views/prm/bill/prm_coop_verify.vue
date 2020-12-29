<template>
	<el-dialog title="发票核销" width="400px" :visible.sync="visible" :close-on-press-escape="false" :close-on-click-modal="false" :before-close="handleClose">
		<el-form ref="form" :model="form" class="demo-ruleForm">
			<el-row>
				<el-col class="elementWidth">
					<el-form-item label="核销日期" required label-width="115px">
            <el-date-picker v-model="form.invoiceWriteoffDate"  type="date" value-format="yyyy-MM-dd 00:00:00" placeholder="" style="width: 150px;">
            </el-date-picker>
					</el-form-item>
				</el-col>
			</el-row>
			<el-row>
				<el-col class="elementWidth">
          <el-form-item style="margin-left: 15px;">
					   <el-button size="small" type="primary" @click="submitForm">确定</el-button>
             <el-button size="small" type="primary" @click="cancelSubmitForm" plain>取消</el-button>
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
				form: {
          statement_id: '',
          invoiceAmount: '',
          invoiceWriteoffDate: this.getCurrDateAndCurrMonthLastDay()[0],
				}
			}
		},
		created: function() {
			this.form.statement_id = this.frow.statement_id;
			this.form.invoiceAmount = this.frow.invoiceAmount;
		},
		inject: ['findMadeCoopBillList'],
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
			submitForm() {
				if(this.form.invoiceWriteoffDate == '') {
					this.openError("请选择核销日期")
					return
				}

        let currthis = this
        currthis.$axios.put('/prm/coopBill/verify/' + this.form.statement_id + '/' + this.form.invoiceAmount + '/' + this.form.invoiceWriteoffDate).then((response) => {
            if(response.data.code == '0') {
                currthis.$notify({
                    title: '成功',
                    message: '核销成功',
                    type: 'success'
                });
                currthis.findMadeCoopBillList();
                currthis.handleClose();
            } else {
                currthis.$notify.error({
                    title: '错误',
                    message: response.data.messageInfo
                });
            }
        }).catch((error) => {
            currthis.$notify.error({
                title: '错误',
                message: error.response.data.messageInfo
            });
        });
			},
      cancelSubmitForm(){
        this.handleClose();
      },
			// 关闭
			handleClose() {
				this.$emit('update:visible', false);
			},
      getCurrDateAndCurrMonthLastDay() {
          //获取当前日期
          let date = new Date();
          let months = parseInt(date.getMonth() + 1);
          let days = date.getDate()-1;
          if(months < 10) {
              months = '0' + months
          }
          if(days < 10) {
              days = '0' + days
          }
          let datas = date.getFullYear() + '-' + months + '-' + days + " 00:00:00";

          //获取当月最后一天
          let currentMonth = date.getMonth();
          let nextMonth = ++currentMonth;
          let nextMonthFirstDay = new Date(date.getFullYear(), nextMonth, 1);
          let oneDay = 1000 * 60 * 60 * 24;
          let lastTime = new Date(nextMonthFirstDay - oneDay);
          let month = parseInt(lastTime.getMonth() + 1);
          let day = lastTime.getDate();
          if(month < 10) {
              month = '0' + month
          }
          if(day < 10) {
              day = '0' + day
          }
          //当月最后一天
          let data = date.getFullYear() + '-' + month + '-' + day + " 23:59:59";
          let result = []
          result.push(datas)
          result.push(data)
          return result
      },
		}
	}
</script>
