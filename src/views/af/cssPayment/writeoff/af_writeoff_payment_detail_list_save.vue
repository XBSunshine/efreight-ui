<template>
	<el-dialog title="对账单 - 核销" width="1100px" :visible.sync="visible" :close-on-press-escape="false" :close-on-click-modal="false" :before-close="handleClose" style="top:-100px;" append-to-body>
		<el-form :model="ruleForm" ref="ruleForm" label-width="20px" class="demo-ruleForm writeoffPaymentSavePage">
			<el-row>
				<el-col class="elementWidth">
					<el-form-item>
						<el-input auto-complete="off" disabled style="width:725px" v-model="ruleForm.customerName">
							<template slot="prepend">
								<span>付款客户</span>
							</template>
						</el-input>
					</el-form-item>
				</el-col>
				<el-col class="elementWidth">
					<el-form-item>
						<el-input auto-complete="off" disabled style="width:295px" v-model="ruleForm.paymentNum">
							<template slot="prepend">
								<span>对账编号</span>
							</template>
						</el-input>
					</el-form-item>
				</el-col>

			</el-row>
			<el-row>
				<el-col class="elementWidth">
					<el-form-item>
						<el-input v-if="ruleForm.currency=='CNY'" v-model="ruleForm.currency" style="width:160px;" disabled>
							<template slot="prepend">
								<span>核销金额</span>
							</template>
						</el-input>
						<el-input v-else v-model="ruleForm.currency" class="currencyRedColor" style="width:160px;" disabled>
							<template slot="prepend">
								<span>核销金额</span>
							</template>
						</el-input>
					</el-form-item>
				</el-col>
				<el-col class="elementWidth">
					<el-form-item label-width="10px">
						<el-input v-model="ruleForm.amountWriteoff" clearable auto-complete="off" style="width:180px;" @input="formatFloat2">
						</el-input>
					</el-form-item>
					<font style="color: red;font-size: smaller;margin-left: 11px;margin-top: -10px;float: left;">金额范围：0 - {{frow.amountPaymentNoWriteoff}}</font>
				</el-col>
				<el-col class="elementWidth">
					<el-form-item label-width="10px">
						<el-button size="mini" type="primary" @click="automatch">自动匹配</el-button>
					</el-form-item>
				</el-col>
        <el-col class="elementWidth">
          <el-form-item>
            <el-input style="width:275px;margin-left: -10px;">
              <template slot="prepend">
                <span>科目</span>
              </template>
              <el-select slot="suffix" v-model="ruleForm.financialAccountName" filterable placeholder="请选择" style="width:226px;margin-right: -5px;" @change="setFinancialAccount">
                <el-option v-for="(item,index) in financialAccounts" :key="item.financialAccountId" :label="`${item.financialAccountName} ${item.financialAccountCode}`" :value="item.financialAccountId">
                  <span>{{item.financialAccountName}} {{item.financialAccountCode}}&nbsp;&nbsp;&nbsp;</span>
                </el-option>
              </el-select>
            </el-input>
          </el-form-item>
        </el-col>
				<!--<el-col class="elementWidth">
					<el-form-item>
						<el-input auto-complete="off" disabled style="width:265px" v-model="ruleForm.writeoffNum">
							<template slot="prepend">
								<span>核销编号</span>
							</template>
						</el-input>
					</el-form-item>
				</el-col>-->
				<el-col class="elementWidth">
					<el-form-item>
						<el-input style="width:295px;">
							<template slot="prepend">
								<span>核销日期</span>
							</template>
							<el-date-picker slot="suffix" v-model="ruleForm.writeoffDate" auto-complete="off" type="date" value-format="yyyy-MM-dd" placeholder="核销日期" style="width: 218px;margin-right: -5px;">
							</el-date-picker>
						</el-input>
					</el-form-item>
				</el-col>
			</el-row>
			<el-row>
				<el-col class="elementWidth">
					<el-row>
						<el-button type="text" style="margin-left: 20px;margin-top: -15px;" disabled>备注</el-button>
					</el-row>
					<el-row>
						<el-form-item>
							<el-input v-model="ruleForm.writeoffRemark" type="textarea" auto-complete="off" style="width:1040px;" :rows="3" show-word-limit maxlength="200">
							</el-input>
						</el-form-item>
					</el-row>
				</el-col>
			</el-row>

		</el-form>
		<el-table ref="table" v-loading="loading" :data="cssCostWriteoffDetails" border stripe @selection-change="handleSelectionChange">
			<el-table-column :selectable="selectable" type="selection" align="center" width="50"></el-table-column>
			<el-table-column align="center" prop="awbOrOrderNumber" width="120">
				<template slot="header">
					<span v-if="frow.businessScope=='LC'||frow.businessScope=='IO'">客户单号/订单号</span>
					<span v-else>提单号/订单号</span>
				</template>
			</el-table-column>
			<el-table-column align="center" prop="flightDate" width="100">
				<template slot="header">
					<span v-if="frow.businessScope=='AE'||frow.businessScope=='SE'">开航日期</span>
					<span v-if="frow.businessScope=='AI'||frow.businessScope=='SI'">到港日期</span>
					<span v-if="frow.businessScope=='TE'">发车日期</span>
					<span v-if="frow.businessScope=='LC'">用车日期</span>
					<span v-if="frow.businessScope=='IO'">业务日期</span>
				</template>
			</el-table-column>
			<el-table-column align="center" prop="serviceName" label="服务"></el-table-column>
			<el-table-column header-align="center" align="right" label="对账金额" width="140">
				<template slot-scope="scope">
					<font v-if="scope.row.amountPaymentStr!=null&&scope.row.amountPaymentStr.indexOf('CNY')>-1">{{scope.row.amountPaymentStr}}</font>
					<font v-else style="color: red;">{{scope.row.amountPaymentStr}}</font>
				</template>
			</el-table-column>
			<el-table-column header-align="center" align="right" label="已核销金额" width="140">
				<template slot-scope="scope">
					<font v-if="scope.row.amountPaymentWriteoffStr!=null&&scope.row.amountPaymentWriteoffStr.indexOf('CNY')>-1">{{scope.row.amountPaymentWriteoffStr}}</font>
					<font v-else style="color: red;">{{scope.row.amountPaymentWriteoffStr}}</font>
				</template>
			</el-table-column>
			<el-table-column header-align="center" align="right" label="未核销金额" width="140">
				<template slot-scope="scope">
					<font v-if="scope.row.amountPaymentNoWriteoffStr!=null&&scope.row.amountPaymentNoWriteoffStr.indexOf('CNY')>-1">{{scope.row.amountPaymentNoWriteoffStr}}</font>
					<font v-else style="color: red;">{{scope.row.amountPaymentNoWriteoffStr}}</font>
				</template>
			</el-table-column>
			<el-table-column align="center" label="本次核销金额" width="150">
				<template slot-scope="scope">
					<el-input :disabled="scope.row.amountPaymentNoWriteoff==0" @input="formatFloat2ForTableField(scope.row)" @change="changeCostCurrAmountPayment(scope.row)" v-model="scope.row.amountWriteoff" clearable auto-complete="off" style="width:90px;"></el-input>
					<span v-if="scope.row.currency!='CNY'" style="color: red;">({{scope.row.currency}})</span>
					<span v-else>({{scope.row.currency}})</span>
				</template>
			</el-table-column>
		</el-table>
		<div style="margin:10px 10px 10px 10px;">
			<el-button type="primary" size="small" v-on:click="submit">确定</el-button>
			<el-button type="primary" size="small" v-on:click="handleClose">取消</el-button>
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
				cssCostWriteoffDetails: [],
        financialAccounts: [],
				ruleForm: {
					customerName: '',
					customerId: '',
					paymentId: '',
					paymentNum: '',
					amountWriteoff: '',
					businessScope: '',
					writeoffNum: '',
					currency: '',
					writeoffDate: this.getDateTime(new Date()),
					writeoffRemark: '',
					cssCostWriteoffDetails: [],
					rowUuid:'',
          financialAccountName: '',
          financialAccountCode: '',
          financialAccountType: '',
				},
				amountPaymentNoWriteoff: null,
				loading: false,
				initSelect: false
			}
		},
		inject: ['queryList'],
		created: function() {
			console.log(this.frow)
			this.ruleForm.customerName = this.frow.customerName
			this.ruleForm.customerId = this.frow.customerId
			this.ruleForm.paymentNum = this.frow.paymentNum
			this.ruleForm.paymentId = this.frow.paymentId
			this.ruleForm.businessScope = this.frow.businessScope
			this.ruleForm.currency = this.frow.currency
			this.amountPaymentNoWriteoff = this.frow.amountPaymentNoWriteoff
			this.ruleForm.rowUuid = this.frow.rowUuid
			this.queryPaymentDetailList()
      //科目
      this.$axios.post('/afbase/cssIncomeWriteoff/getFinancialAccount/' + this.frow.businessScope + '/' + this.frow.customerId).then((response) => {
          this.financialAccounts = response.data.data;
          this.financialAccounts = this.financialAccounts.filter(item => item.financialAccountCode != '')
          if(this.financialAccounts.length > 0){
              for (var i = 0; i < this.financialAccounts.length; i++) {
                  if(this.financialAccounts[i].financialAccountName === '银行存款'){
                      this.ruleForm.financialAccountName = this.financialAccounts[i].financialAccountName + " " + this.financialAccounts[i].financialAccountCode;
                      this.ruleForm.financialAccountCode = this.financialAccounts[i].financialAccountCode;
                      this.ruleForm.financialAccountType = this.financialAccounts[i].financialAccountType;
                  }
              }
              if(!this.ruleForm.financialAccountName){
                  this.ruleForm.financialAccountName = this.financialAccounts[0].financialAccountName + " " + this.financialAccounts[0].financialAccountCode;
                  this.ruleForm.financialAccountCode = this.financialAccounts[0].financialAccountCode;
                  this.ruleForm.financialAccountType = this.financialAccounts[0].financialAccountType;
              }
          }
      });
		},
		methods: {
      setFinancialAccount(vId) {
          let obj = {};
          obj = this.financialAccounts.find((item) => {
              return item.financialAccountId === vId;
          });
          if (obj) {
              this.ruleForm.financialAccountName = obj.financialAccountName + " " + obj.financialAccountCode;
              this.ruleForm.financialAccountCode = obj.financialAccountCode;
              this.ruleForm.financialAccountType = obj.financialAccountType;
          }
      },
			automatch() {
				if(this.ruleForm.amountWriteoff == '' || parseFloat(this.ruleForm.amountWriteoff) <= 0) {
					this.openError("核销金额无法自动匹配")
					return
				}
				let sum = 0.00
				this.cssCostWriteoffDetails.forEach(item => sum += item.amountPaymentNoWriteoff)
				if(parseFloat(this.ruleForm.amountWriteoff) > parseFloat(sum.toFixed(2))) {
					this.$confirm('查询结果不足核销匹配金额，是否继续', '提示', {
						confirmButtonText: '是',
						cancelButtonText: '否',
						type: 'warning',
						center: true
					}).then(() => {
						this.$refs.table.clearSelection()
						this.$refs.table.toggleAllSelection()
					}).catch(() => {});
				} else if(parseFloat(this.ruleForm.amountWriteoff) == parseFloat(sum.toFixed(2))) {
					this.$refs.table.clearSelection()
					this.$refs.table.toggleAllSelection()
				} else {
					this.loading = true
					this.$axios.get('/afbase/cssCostWriteoff/automatch/' + this.ruleForm.paymentId + '/' + this.ruleForm.amountWriteoff).then((response) => {
						this.$refs.table.clearSelection()
						this.cssCostWriteoffDetails = response.data.data
						this.$nextTick(() => {
							this.initSelect = true
							this.cssCostWriteoffDetails.forEach(row => {
								if(row.amountWriteoff != 0) {
									this.$refs.table.toggleRowSelection(row, true)
								}
							})
							this.initSelect = false
						})
						this.loading = false
					}).catch((error) => {
						this.loading = false
						console.log(error);
					});
				}

			},
			submit() {
        if (!this.ruleForm.financialAccountName) {
            this.openError("请选择科目");
            return;
        }
				if(this.ruleForm.writeoffDate == null || this.ruleForm.writeoffDate == '') {
					this.openError("请录入核销时间")
					return
				}
				if(this.ruleForm.cssCostWriteoffDetails.length == 0) {
					this.openError("请选择核销明细")
					return
				}

				if(this.ruleForm.cssCostWriteoffDetails.some(select => select.amountWriteoff == null || select.amountWriteoff === '')) {
					this.openError("请录入核销明细核销金额")
					return
				}

				if(this.ruleForm.cssCostWriteoffDetails.some(select => !/^(\-)?\d+(\.\d{1,2})?$/g.test(select.amountWriteoff))) {
					this.openError("录入核销明细金额格式有误")
					return
				}

				try {
					this.ruleForm.cssCostWriteoffDetails.forEach(select => {
						if(select.amountPaymentNoWriteoff < 0) {
							if(parseFloat(select.amountWriteoff) > 0) {
								this.openError('单号：' + select.awbOrOrderNumber + '本次核销金额不能>0')
								throw Error("end")
							} else {
								if(parseFloat(select.amountWriteoff) < select.amountPaymentNoWriteoff) {
									this.openError('单号：' + select.awbOrOrderNumber + '本次核销金额不能超出未核销金额')
									throw Error("end")
								}
							}
						} else if(select.amountPaymentNoWriteoff > 0) {
							if(parseFloat(select.amountWriteoff) < 0) {
								this.openError('单号：' + select.awbOrOrderNumber + '本次核销金额不能<0')
								throw Error("end")
							} else {
								if(parseFloat(select.amountWriteoff) > select.amountPaymentNoWriteoff) {
									this.openError('单号：' + select.awbOrOrderNumber + '本次核销金额不能超出未核销金额')
									throw Error("end")
								}
							}
						} else {
							if(parseFloat(select.amountWriteoff) != 0) {
								this.openError('单号：' + select.awbOrOrderNumber + '没有可核销金额')
								throw Error("end")
							}
						}
					})
				} catch(e) {
					if(e.message == 'end') {
						return
					}
				}
				let sum = 0.00
				this.ruleForm.cssCostWriteoffDetails.forEach(item => sum += parseFloat(item.amountWriteoff))
				sum = parseFloat(sum.toFixed(2))
				if(parseFloat(this.ruleForm.amountWriteoff) != sum) {
					this.openError("核销金额与核销明细不符")
					return
				}

				if(sum <= 0 || sum > this.frow.amountPaymentNoWriteoff) {
					this.openError("本次核销总金额必须在0-" + this.frow.amountPaymentNoWriteoff + "范围内")
					return
				} else if(sum == this.frow.amountPaymentNoWriteoff && this.cssCostWriteoffDetails.filter(row => row.amountPaymentNoWriteoff != 0).length != this.ruleForm.cssCostWriteoffDetails.length) {
					this.openError("本次核销总金额等于该对账单未核销金额，必须全部勾选核销")
					return
				}
				console.log(this.ruleForm)
				this.doWriteoff()
			},
			doWriteoff() {

				this.$confirm('您确定要核销' + this.frow.paymentNum + '对账单么?', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning',
					center: true
				}).then(() => {
					this.$axios.post2('/afbase/cssCostWriteoff', this.ruleForm).then((response) => {
						if(response.data.code == '0') {
							this.openSuccess("核销成功！")
							this.queryList();
              this.ruleForm.financialAccountName = '';
              this.ruleForm.financialAccountCode = '';
              this.ruleForm.financialAccountType = '';
              this.financialAccounts = [];
							this.handleClose()
						} else {
							this.openError("核销失败：" + response.data.messageInfo)
						}
					}).catch((error) => {
						this.openError("核销失败：" + error.response.data.messageInfo)
					});
				}).catch(() => {
					this.$message({
						type: 'info',
						message: '已取消'
					});
				});

			},
			queryPaymentDetailList() {
				this.loading = true
				this.$axios.get('/afbase/cssPayment/paymentDetail/' + this.frow.paymentId).then((response) => {
					if(response.data.code == '0') {
						this.cssCostWriteoffDetails = response.data.data;
					} else {
						this.openError(response.data.messageInfo)
					}
					this.loading = false
				}).catch((error) => {
					this.loading = false
					this.openError(error.response.data.messageInfo)
					console.log(error);
				});
			},
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
			formatFloat2() {
				this.ruleForm.amountWriteoff = this.ruleForm.amountWriteoff.replace(/[^0123456789.]/g, "");
				let t = this.ruleForm.amountWriteoff.split('.');
				if(t.length > 1) {
					if(t[0] == '') {
						this.ruleForm.amountWriteoff = "0." + t[1].substr(0, 2);
					} else {
						this.ruleForm.amountWriteoff = t[0] + "." + t[1].substr(0, 2);
					}
				} else {
					if(this.ruleForm.amountWriteoff.startsWith("0")) {
						this.ruleForm.amountWriteoff = this.ruleForm.amountWriteoff.substr(0, 1)
					}
				}
			},
			formatFloat2ForTableField(row) {
				row.amountWriteoff = row.amountWriteoff.replace(/[^-0123456789.]/g, "");
				row.amountWriteoff = row.amountWriteoff.substring(row.amountWriteoff.lastIndexOf('-'))

				let t = row.amountWriteoff.split('.');
				if(t.length > 1) {
					if(t[0] == '') {
						row.amountWriteoff = "0." + t[1].substr(0, 2);
					} else if(t[0] == '-') {
						row.amountWriteoff = "-0." + t[1].substr(0, 2);
					} else {
						row.amountWriteoff = t[0] + "." + t[1].substr(0, 2);
					}
				} else {
					if(row.amountWriteoff.startsWith("-0")) {
						row.amountWriteoff = row.amountWriteoff.substr(0, 2)
					} else if(row.amountWriteoff.startsWith("0")) {
						row.amountWriteoff = row.amountWriteoff.substr(0, 1)
					}
				}
			},
			handleSelectionChange(val) {
				this.ruleForm.cssCostWriteoffDetails = val
				this.cssCostWriteoffDetails.filter(row => {
					if(this.ruleForm.cssCostWriteoffDetails.find(i => i.costId == row.costId) == null) {
						if(!this.initSelect) {
							row.amountWriteoff = '0'
						}
					} else {
						if(row.amountWriteoff == null || row.amountWriteoff == '' || row.amountWriteoff == 0) {
							row.amountWriteoff = row.amountPaymentNoWriteoff + ''
						}
					}
				})
				this.countAmountWriteoffSum()
			},
			changeCostCurrAmountPayment(row) {
				this.countAmountWriteoffSum()
				if(row.amountWriteoff != null && row.amountWriteoff !== '' && row.amountWriteoff != 0) {
					this.$refs.table.toggleRowSelection(row, true)
				} else {
					this.$refs.table.toggleRowSelection(row, false)
				}
			},
			countAmountWriteoffSum() {
				let sum = 0.00
				this.ruleForm.cssCostWriteoffDetails.forEach(item => sum += parseFloat(item.amountWriteoff))
				this.ruleForm.amountWriteoff = sum.toFixed(2)
			},
			selectable(row, index) {
				if(row.amountPaymentNoWriteoff == 0) {
					return false;
				} else {
					return true;
				}
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
			handleClose() {
				this.$emit('update:visible', false);
			}

			//---------------------

		}
	}
</script>
<style type="text/css">
	.writeoffPaymentSavePage .el-input__icon {
		line-height: 30px !important;
	}

	.writeoffPaymentSavePage .el-form-item__content {
		line-height: 30px !important;
	}

	.writeoffPaymentSavePage .el-input-group__prepend {
		padding: 0 10px;
	}

	.currencyRedColor input {
		color: red !important;
	}
</style>
