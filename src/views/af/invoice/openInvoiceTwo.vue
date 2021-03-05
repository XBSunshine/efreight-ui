<template>
	<el-dialog title="发票 - 开票" width="1200px" :visible.sync="visible" :close-on-press-escape="false" :close-on-click-modal="false" :before-close="handleClose" style="top:-100px;">
		 <el-form :model="ruleForm" ref="ruleForm" label-width="15px" class="demo-ruleForm">
      <el-row>
				<el-col class="elementWidth">
					<el-form-item>
						<el-input auto-complete="off" disabled style="width:650px" v-model="ruleForm.customerName">
							<template slot="prepend">收款客户</template>
						</el-input>
					</el-form-item>
				</el-col>
				<el-col class="elementWidth">
					<el-form-item>
						<el-input auto-complete="off" disabled style="width:496px" v-model="ruleForm.businessNum">
							<template slot="prepend">
								<span>账单/清单</span>
							</template>
						</el-input>
					</el-form-item>
				</el-col>
			</el-row>

			<el-row>
				<el-col class="elementWidth">
					<el-row>
						<el-button type="text" style="margin-left: 20px;margin-top: -15px;" disabled>收款金额</el-button>
					</el-row>
          <el-row style="width:665px;">
          <template v-for="(item,index) in ruleForm.dataTwo">
              <el-row  :gutter="10">
                  <el-col :span="4" align="right"><span>{{getNumber(item.amount)}}</span></el-col>
                  <el-col :span="3"><span :class="{currencyRedColor:item.currency!='CNY'}">{{item.currency}}</span></el-col>
                  <el-col :span="3"><span>开票金额:</span></el-col>
                  <el-col :span="4"  align="right"><span>{{getNumber(item.amountInvoice)}}</span></el-col>
                  <el-col :span="4"><span><font color="#0183DD">待开票金额:</font></span></el-col>
                  <el-col :span="4" align="right"><span><font color="#0183DD">{{getNumber2(item.amount,item.amountInvoice)}}</font></span></el-col>
              </el-row>
          </template>
          </el-row>
				</el-col>
				<el-col class="elementWidth">
						<el-row>
							<el-button type="text" style="margin-left: 20px;margin-top: -15px;" disabled>开票要求</el-button>
						</el-row>
						<el-row>
							<el-form-item>
								<el-input v-model="ruleForm.applyRemark" type="textarea" auto-complete="off" style="width:496px;" :rows="3" disabled>
								</el-input>
							</el-form-item>
						</el-row>
				</el-col>
			</el-row>
      </el-form>
		<el-row style="margin-left: 20px;margin-top: 10px;margin-bottom: 10px;">
			<i class="iconfont el-icon-myyuanquanjiahao" @click="showAdd" style="cursor: pointer;size: b5;color: #409EFF;"></i>
			<span style="margin-left: 10px;cursor: pointer;" @click="showAdd">新增发票</span>
		</el-row>
		<div>
			<el-table :data="dataOne" border stripe>
				<el-table-column fixed type="index" align="center" label="操作" width="60">
					<template slot-scope="scope">
						<i class="iconfont el-icon-myjianhao" v-if="deleteInvoiceFlag" @click="doDelete(scope.$index,scope.row)" style="cursor: pointer;size: b5;color: #409EFF;"></i>
					</template>
				</el-table-column>
				<el-table-column align="center" prop="invoiceNum" label="发票号" width="130">
				</el-table-column>
				<el-table-column align="center" prop="invoiceDate" label="发票日期" width="110">
				</el-table-column>
				<el-table-column align="center" label="开票人" width="100">
          <template slot-scope="scope">
          		<span>{{nameFormat(scope.row.creatorName)}}</span>
          </template>
        </el-table-column>
				<el-table-column align="center" prop="createTime" label="开票时间" width="150">
				</el-table-column>
				<el-table-column align="center" prop="invoiceType" label="发票类型" width="100"></el-table-column>
				<el-table-column header-align="center" align="right" label="金额">
					<template slot-scope="scope">
						<font v-if="scope.row.currency.indexOf('CNY')>-1">{{amountFormat(scope.row.amount,scope.row.currency)}}</font>
						<font v-else style="color: red;">{{amountFormat(scope.row.amount,scope.row.currency)}}</font>
					</template>
				</el-table-column>
        <el-table-column align="center" prop="invoiceTitle" label="抬头"></el-table-column>
				<el-table-column align="center" prop="invoiceRemark" label="备注"></el-table-column>
			</el-table>
		</div>
		<div style="margin:10px 10px 10px 10px;">
			<el-button type="primary" size="small" v-on:click="handleClose">取消</el-button>
		</div>
		<invoiceDetailSave ref="addMission" v-if="invoiceDetailSaveVisible" :visible.sync="invoiceDetailSaveVisible" :frow="ffrow"></invoiceDetailSave>
	</el-dialog>
</template>
<script>
	import InvoiceDetailSave from './invoice_detail_save'
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
				invoiceDetailSaveVisible: false,
        deleteInvoiceFlag:false,
        dataOne:[],
        invoiceStatus:null,
        ruleForm: {
           customerName:'',
           businessNum:'',
           applyRemark:'',
           dataTwo:[]
        },
				ffrow: {}
			}
		},
		inject: ['queryList'],
		components: {
			'invoiceDetailSave': InvoiceDetailSave
		},
		provide() {
			return {
				queryInfo: this.queryInfo
			}
		},
		created: function() {
      let buttonInfo = window.localStorage.getItem('buttonInfo');
      if (buttonInfo.indexOf('af-invoice-delete') > -1) {
           this.deleteInvoiceFlag = true;
      }
			this.ruleForm.businessNum = this.frow.businessNum;
			this.ruleForm.customerName = this.frow.customerName;
      this.ruleForm.applyRemark = this.frow.applyRemark;
      this.queryInfo();
		},

		methods: {
      queryInfo(){
        //查询账单或者清单 币种以及开票明细
        let param={
           debitNoteId:this.frow.debitNoteId,
           statementId:this.frow.statementId,
           invoiceId:this.frow.invoiceId
        }
        this.$axios.get2('/afbase/cssIncomeInvoice/open/view', param).then((response) => {
        	this.dataOne = response.data.data.dataOne;
          this.ruleForm.dataTwo = response.data.data.dataTwo;
        }).catch((error) => {
        	console.log(error);
        });
        this.$axios.get2('/afbase/cssIncomeInvoice/view/'+this.frow.invoiceId).then((response) => {
        	this.frow.rowUuid =  response.data.data.rowUuid
          this.invoiceStatus = response.data.data.invoiceStatus;
        }).catch((error) => {
        	console.log(error);
        });
      },
      nameFormat(name){
        if(name){
         return name.split(" ")[0];
        }else{
          return "";
        }
      },
      amountFormat(amount,currency){
        if(amount){
           return this.getNumber(amount)+"("+currency+")";
        }else{
          return "";
        }
      },
      getNumber(data) {
        if(data){
          return data.toFixed(2).replace(/\d{1,3}(?=(\d{3})+(\.\d*)?$)/g, '$&,');
        }else{
          return 0;
        }
      },
      getNumber2(data1,data2) {
        if(data2){
          let a = data1 - data2;
           return a.toFixed(2).replace(/\d{1,3}(?=(\d{3})+(\.\d*)?$)/g, '$&,');
        }else{
           return data1.toFixed(2).replace(/\d{1,3}(?=(\d{3})+(\.\d*)?$)/g, '$&,');
        }
        
      },
			showAdd() {
        if(this.invoiceStatus!=1){
          this.ffrow = this.frow;
          this.ffrow.dataTwo = this.ruleForm.dataTwo;
          this.invoiceDetailSaveVisible = true
        }else{
          this.openError("该发票申请单已开票完毕");
        }

			},
			// doAdd(details) {
			// 	details.forEach(detail => {
			// 		let row = {
			// 			orderId: detail.orderId,
			// 			awbOrOrderNumber: detail.orderCode,
			// 			customerNumber: detail.customerNumber,
			// 			flightDate: detail.flightDate,
			// 			costId: detail.costId,
			// 			currency: detail.costCurrency,
			// 			amountPaymentStr: this.getNumber(parseFloat(detail.costCurrAmountPayment)) + ' (' + detail.costCurrency + ')',
			// 			amountPayment: parseFloat(detail.costCurrAmountPayment),
			// 			costAmount: detail.costAmount,
			// 			costAmountStr: detail.costAmountStr,
			// 			serviceName: detail.serviceName,
			// 			rowUuid: detail.rowUuid
			// 		}
			// 		this.ruleForm.details.push(row)
			// 	})
			// 	this.countAmountPayment()
			// },
			doDelete(index, row) {
        // if(!row.writeoffComplete){
            this.$confirm('请确认 是否删除 发票？', '提示', {
            	confirmButtonText: '是',
            	cancelButtonText: '否',
            	type: 'warning',
            	center: true
            }).then(() => {
              // this.dataTwo.splice(index, 1);
            	this.$axios.deletes('/afbase/cssIncomeInvoiceDetail/' + row.invoiceDetailId+'/'+this.frow.rowUuid).then((response) => {
            		if (response.data.code == '0') {
                  // this.dataTwo.splice(index, 1);
                  this.queryInfo();
            		} else {
            			this.openError("删除失败：" + response.data.messageInfo)
            		}
            	}).catch((error) => {
            		this.openError("删除失败：" + error.response.data.messageInfo)
            	});
            }).catch(() => {

            });
        // }else{
        //   this.openError("发票已有核销记录不可删除")
        // }
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
					message: '操作失败，' + info,
					type: 'error',
					position: 'bottom-right'
				});
			},
			handleClose() {
				this.$emit('update:visible', false);
        this.queryList();
			}

			//---------------------

		}
	}
</script>
<style type="text/css">
	.currencyRedColor input {
		color: red !important;
	}

	.invoiceDetailNoWriteoff input {
		color: blue !important;
	}
</style>
