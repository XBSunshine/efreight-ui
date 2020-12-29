<template>
	<el-dialog title="单证制作 - 编辑费用" width="480px" :visible.sync="visible" :close-on-press-escape="false" :close-on-click-modal="false" :before-close="handleClose" append-to-body>
		<div>
			<el-button style="margin-left: 4px;padding-left: 8px;padding-right: 8px;background-color:#FFF;color:#409EFF" type="primary" size="small" v-on:click="doAdd">增加</el-button>
			<el-button style="margin-left: 4px;padding-left: 8px;padding-right: 8px;" type="primary" size="small" v-on:click="doSelect">确定</el-button>
      <el-button style="margin-left: 4px;padding-left: 8px;padding-right: 8px;background-color:#FFF;color:#409EFF" type="primary" size="small" v-on:click="doAddFee">生成附加费</el-button>
		</div>
		<div>
			<el-table :data="data1">
				<el-table-column label="fee code" width="100" align="center">
					<template slot-scope="scope">
						<el-input size="small" v-model="scope.row.awbChargesCode" @change="scope.row.awbChargesCode=strTrim(scope.row.awbChargesCode).toUpperCase()"></el-input>
					</template>
				</el-table-column>
				<el-table-column label="Rate" width="100" align="center">
					<template slot-scope="scope">
						<el-input size="small" v-model="scope.row.awbChargesRate" @input="checkFloat(scope.row,'awbChargesRate')"></el-input>
					</template>
				</el-table-column>
				<el-table-column label="Fee" width="100" align="center">
					<template slot-scope="scope">
						<el-input size="small" v-model="scope.row.awbChargesQuantity" @input="checkFloat(scope.row,'awbChargesQuantity')"></el-input>
					</template>
				</el-table-column>
				<el-table-column label="Amount" width="100" align="center">
					<template slot-scope="scope">
						<el-input :disabled="true" size="small" v-model="scope.row.awbChargesAmount"></el-input>
					</template>
				</el-table-column>
				<el-table-column label="操作" width="60" align="center">
					<template slot-scope="scope">
						<el-button type="text" size="small" v-on:click="doDelete(scope.$index,scope.row)">删除</el-button>
					</template>
				</el-table-column>
				<!-- :formatter="formatter1" -->
			</el-table>
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
				editModeEnabled: true,
				data1: []
			}
		},

		inject: ['callback'],
		created: function() {
			if(this.frow.fee) {
				let list = this.frow.fee.split("\n");
				for(var i = 0; i < list.length; i++) {
					let map = list[i].split("*");
					let j = {
						awbChargesCode: map[0],
						awbChargesRate: map[1],
						awbChargesQuantity: map[2],
						awbChargesAmount: map[3]
					};
					this.data1.push(j);
				}

			} else {
				this.data1 = [{
					awbChargesCode: '',
					awbChargesRate: '1',
					awbChargesQuantity: this.frow.awbChargeWeight,
					awbChargesAmount: this.frow.awbChargeWeight
				}]
			}
			// this.queryList();
		},

		methods: {

			doSelect() {
				let maps = '';
				for(var i = 0; i < this.data1.length; i++) {
					if(this.data1[i].awbChargesCode == null || this.data1[i].awbChargesCode == '' || this.data1[i].awbChargesCode == ".") {
						this.$notify({
							title: '',
							message: '第' + (i + 1) + '行的fee code为空或数据有误，请重新填写',
							type: 'error',
							position: 'bottom-right'
						});
						return;
					}
					if((this.data1[i].awbChargesRate == null || this.data1[i].awbChargesRate == '' || this.data1[i].awbChargesRate == ".") && this.data1[i].awbChargesRate !== 0) {
						this.$notify({
							title: '',
							message: '第' + (i + 1) + '行的Rate为空或数据有误，请重新填写',
							type: 'error',
							position: 'bottom-right'
						});
						return;
					}
					if((this.data1[i].awbChargesQuantity == null || this.data1[i].awbChargesQuantity == '' || this.data1[i].awbChargesQuantity == ".") && this.data1[i].awbChargesQuantity !== 0) {
						this.$notify({
							title: '',
							message: '第' + (i + 1) + '行的Fee为空或数据有误，请重新填写',
							type: 'error',
							position: 'bottom-right'
						});
						return;
					}
					if((this.data1[i].awbChargesAmount == null || this.data1[i].awbChargesAmount == '' || this.data1[i].awbChargesAmount == ".") && this.data1[i].awbChargesQuantity !== 0) {
						this.$notify({
							title: '',
							message: '第' + (i + 1) + '行的Amount为空或数据有误，请重新填写',
							type: 'error',
							position: 'bottom-right'
						});
						return;
					}
					if(maps.length > 0) {
						maps = maps + "\n" + this.data1[i].awbChargesCode + "*" + this.data1[i].awbChargesRate + "*" + this.data1[i].awbChargesQuantity + "*" + this.data1[i].awbChargesAmount;
					} else {
						maps = this.data1[i].awbChargesCode + "*" + this.data1[i].awbChargesRate + "*" + this.data1[i].awbChargesQuantity + "*" + this.data1[i].awbChargesAmount;
					}
				}
				let data = {}
				data.fee = maps
				data.feeList = this.data1
				this.callback(data, 'fee');
				this.handleClose();
			},
			doDelete(index, rrow) {
				this.data1.splice(index, 1)
			},
			doAdd() {
				let j = {
					awbChargesCode: '',
					awbChargesRate: '1',
					awbChargesQuantity: this.frow.awbChargeWeight,
					awbChargesAmount: this.frow.awbChargeWeight
				};
				this.data1.push(j);
			},
			checkInt(row, prop) {
				row[prop] = row[prop].replace(/[^0123456789]/g, "");
			},
			checkFloat(row, prop) {
				row[prop] = row[prop].replace(/[^0123456789.]/g, "");
				let t = row[prop].split('.');
				if(t.length > 1) {
					if(t[0] == '') {
						row[prop] = "0." + t[1].substr(0, 2);
					} else {
						row[prop] = t[0] + "." + t[1].substr(0, 2);
					}
				}
				this.computeAmount(row)
			},
			computeAmount(row) {
				if(row.awbChargesRate != null && row.awbChargesRate !== '' && row.awbChargesQuantity != null && row.awbChargesQuantity !== '') {
					row.awbChargesAmount = (parseFloat(row.awbChargesRate) * parseFloat(row.awbChargesQuantity)).toFixed(2)
				} else {
					row.awbChargesAmount = null
				}
			},
			handleClose() {
				this.$emit('update:visible', false);
			},

      doAddFee() {
          this.data1 = [];
          if(this.frow.departureStation == null || this.frow.departureStation == ''){
              this.openError("获取费率，请填写始发港");
              return;
          }
          if((this.frow.arrivalStation == null || this.frow.arrivalStation == '') && (this.frow.transitStation == null || this.frow.transitStation == '') && (this.frow.transitStation2 == null || this.frow.transitStation2 == '')){
              this.openError("获取费率，请填写目的港或者中转港");
              return;
          }
          if(this.frow.flightDate == null || this.frow.flightDate == ''){
              this.openError("获取费率，请填写航班日期");
              return;
          }
          //以最终目的港为判断港口
          let arrivalStation;
          if(this.frow.transitStation2 == null || this.frow.transitStation2 == ''){
              if(this.frow.transitStation == null || this.frow.transitStation == ''){
                  arrivalStation = this.frow.arrivalStation;
              }else{
                  arrivalStation = this.frow.transitStation;
              }
          }else{
              arrivalStation = this.frow.transitStation2;
          }
          let param = "awbNumberPrefix=" + this.frow.awbNumberPrefix + "&departureStation=" + this.frow.departureStation +
              "&arrivalStation=" + arrivalStation + "&flightDate=" + this.frow.flightDate;
          let that = this;
          //获取附加费
          this.$axios.get('/afbase/surcharge/getSurchargeForBillMake?' + param).then(function(response) {
              if(response.data.data != null && response.data.data.length > 0){
                  let feeList = []
                  let surcharges = response.data.data;
                  for(let i=0;i<response.data.data.length;i++){
                      let awbChargesCode;
                      let awbChargesRate;
                      let awbChargesQuantity;
                      let awbChargesAmount;
                      awbChargesCode = surcharges[i].surchargeCode;
                      if(surcharges[i].chargeMethod == '计重'){
                          if(that.frow.awbChargeWeight){
                              awbChargesRate = that.frow.awbChargeWeight;
                          }else{
                              awbChargesRate = 0;
                          }
                      }else if(surcharges[i].chargeMethod == '毛重'){
                          if(that.frow.awbGrossWeight){
                              awbChargesRate = that.frow.awbGrossWeight;
                          }else{
                              awbChargesRate = 0;
                          }
                      }else{
                          awbChargesRate = 1;
                      }
                      awbChargesQuantity = surcharges[i].unitPrice;
                      awbChargesAmount = (awbChargesRate*awbChargesQuantity).toFixed(2);
                      if(surcharges[i].chargeMin != null && awbChargesAmount < surcharges[i].chargeMin){
                          awbChargesAmount = surcharges[i].chargeMin;
                      }
                      if(surcharges[i].chargeMax != null && awbChargesAmount > surcharges[i].chargeMax){
                          awbChargesAmount = surcharges[i].chargeMax;
                      }
                      let j = {
                          awbChargesCode: awbChargesCode,
                          awbChargesRate: awbChargesRate,
                          awbChargesQuantity: awbChargesQuantity,
                          awbChargesAmount: awbChargesAmount
                      };
                      feeList.push(j);
                  }
                  that.data1 = feeList;
              }else{
                  that.openError("获取附加费失败，无数据");
              }
          }).catch(function(error) {
              console.log(error);
          });
      }

			//---------------------

		}
	}
</script>
<style type="text/css">

</style>
