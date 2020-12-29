<template>
	<div class="warp-main">
		<el-row v-loading="loading" element-loading-text="拼命加载中">
			<el-col class="toolbar" style="padding-bottom: 0;">
				<el-form :inline="false" :model="query" class="demo-ruleForm">
					<div>
						<el-row>
              <el-col class="elementWidth">
                <el-form-item label="期间" label-width="85px">
                  <el-date-picker v-model="query.statementDate_begin"  type="month" value-format="yyyy-MM" placeholder="" style="width: 135px;">
                  </el-date-picker>
                  <span>-</span>
                  <el-date-picker v-model="query.statementDate_end"  type="month" value-format="yyyy-MM" placeholder="" style="width: 135px;">
                  </el-date-picker>
                </el-form-item>
              </el-col>
              <!--<el-col class="elementWidth">
                <el-form-item label="-" label-width="25px">
                  <el-date-picker v-model="query.statementDate_end"  type="month" value-format="yyyy-MM" placeholder="" style="width: 135px;">
                  </el-date-picker>
                </el-form-item>
              </el-col>-->
              <el-col class="elementWidth">
                <el-form-item label="客户" label-width="55px">
                  <el-input v-model="query.coopName" clearable style="width: 307px;">
                  </el-input>
                </el-form-item>
              </el-col>
              <el-col class="elementWidth">
                <el-form-item label="业务区域" label-width="85px">
                  <el-select v-model="query.billTemplate" style="width: 115px;">
                    <el-option label="全部"   value=""></el-option>
                    <el-option label="华北" value="BJS"></el-option>
                    <el-option label="华南" value="CAN"></el-option>
                    <el-option label="华东" value="SHA"></el-option>
                    <el-option label="西北" value="XIY"></el-option>
                    <el-option label="总部" value="EFT"></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col class="elementWidth">
                <el-form-item style="margin-left: 21px;">
                  <el-button type="text" size="medium" v-if=showFlag v-on:click="showFlag=false">收起</el-button>
                  <el-button type="text" size="medium" v-if=!showFlag v-on:click="showFlag=true">展开</el-button>
                  <el-button type="primary" size="small" v-on:click="findCoopBillSettleList">查询</el-button>
                  <el-button type="primary" size="small" @click="exportExcel">导出</el-button>
                </el-form-item>
              </el-col>
						</el-row>
						<el-row v-show="showFlag">
              <el-col class="elementWidth">
                <el-form-item label="口岸" label-width="85px">
                  <el-input v-model="query.departureStation" clearable style="width: 150px;">
                  </el-input>
                </el-form-item>
              </el-col>
              <el-col class="elementWidth">
                <el-form-item label="账单责任人" label-width="95px">
                  <el-input v-model="query.billConfirmName" clearable style="width: 148px;">
                  </el-input>
                </el-form-item>
              </el-col>
              <el-col class="elementWidth">
                <el-form-item label="销售负责人" label-width="95px">
                  <el-input v-model="query.saleConfirmName" clearable style="width: 157px;">
                  </el-input>
                </el-form-item>
              </el-col>
              <el-col class="elementWidth">
                <el-form-item label="账单状态" label-width="85px">
                  <el-select v-model="query.statementStatus" clearable placeholder="请选择" style="width: 115px;">
                    <el-option label="全部" value=""></el-option>
                    <el-option label="数据未填充" value="数据未填充"></el-option>
                    <el-option label="数据已填充" value="数据已填充"></el-option>
                    <el-option label="待总部确认" value="待总部确认"></el-option>
                    <el-option label="账单已发送" value="账单已发送"></el-option>
                    <el-option label="客户已确认" value="客户已确认"></el-option>
                    <el-option label="发票已开具" value="发票已开具"></el-option>
                    <el-option label="账单已核销" value="账单已核销"></el-option>
                  </el-select>
                </el-form-item>
              </el-col>

						</el-row>
            <el-row v-show="showFlag">
              <el-col class="elementWidth">
                <el-form-item label="有效日期" label-width="85px">
                  <el-date-picker v-model="query.validBeginDate"  type="date" value-format="yyyy-MM-dd" placeholder="" style="width: 135px;">
                  </el-date-picker>
                  <span>-</span>
                  <el-date-picker v-model="query.validEndDate"  type="date" value-format="yyyy-MM-dd" placeholder="" style="width: 135px;">
                  </el-date-picker>
                </el-form-item>
              </el-col>
              <el-col class="elementWidth">
                <el-form-item label="核销日期" label-width="85px">
                  <el-date-picker v-model="query.invoiceWriteoffDateBegin"  type="date" value-format="yyyy-MM-dd" placeholder="" style="width: 134px;">
                  </el-date-picker>
                  <span>-</span>
                  <el-date-picker v-model="query.invoiceWriteoffDateEnd"  type="date" value-format="yyyy-MM-dd" placeholder="" style="width: 132px;">
                  </el-date-picker>
                </el-form-item>
              </el-col>
              <el-col class="elementWidth">
                <el-form-item label="结算方式" label-width="85px">
                  <el-select v-model="query.paymentMethod" clearable placeholder="请选择" style="width: 115px;">
                    <el-option label="全部" value=""></el-option>
                    <el-option label="预付" value="预付"></el-option>
                    <el-option label="到付" value="到付"></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row v-show="showFlag">
              <el-col class="elementWidth">
                <el-form-item label="一级科目" label-width="85px">
                  <el-select style="width: 282px;" v-model="query.serviceNameOne" filterable placeholder="请选择" multiple size="small">
                    <el-option v-for="item in serviceoptions" :key="item.serviceId" :label="item.serviceName" :value="item.serviceId">
                      <span style="float: left">{{ item.serviceName }}</span>
                    </el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col class="elementWidth">
                <el-form-item label="二级科目" label-width="80px">
                  <el-select style="width: 284px;" v-model="query.serviceNameTwo" filterable placeholder="请选择" multiple size="small">
                    <el-option v-for="item in servicetwooptions" :key="item.serviceId" :label="item.serviceName" :value="item.serviceId">
                      <span style="float: left">{{ item.serviceName }}</span>
                    </el-option>
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>
					</div>
				</el-form>
			</el-col>

			<el-table :indent="8" :data="data1" style="width: 100%;margin-bottom: 20px;"  border :summary-method="getSummaries" show-summary>
        <!--<el-table-column align="center" prop="billNumber" label="序号" width="80" fixed>
        </el-table-column>-->
        <el-table-column align="center" prop="statementDate" label="期间" width="80" fixed>
        </el-table-column>
        <el-table-column align="left" prop="coopName" label="客户名称" width="280" fixed>
        </el-table-column>
        <el-table-column align="left" prop="statementName" label="分组名称" width="250">
        </el-table-column>
        <el-table-column align="left" prop="serviceNameOne" label="一级科目" width="180">
        </el-table-column>
        <el-table-column align="left" prop="serviceNameTwo" label="二级科目" width="180">
          <template slot-scope="scope">
            <span v-if="scope.row.billStatus=='数据未填充'" style="color:red">{{ formatter22(scope.row) }}</span>
            <span v-else>{{ formatter22(scope.row) }}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" prop="departureStation" label="口岸" width="80">
        </el-table-column>
        <el-table-column align="center" prop="settlementType" label="结算周期/计费模式" width="150" :formatter="settlementTypeFormat">
        </el-table-column>
        <el-table-column align="center" prop="fillNumber" label="数量" width="80" :formatter="fillNumberFormat">
        </el-table-column>
        <el-table-column align="center" prop="unitPrice" label="单价" width="80">
        </el-table-column>
        <el-table-column align="center" prop="acturalCharge" label="金额" width="100" :formatter="acturalChargeFormat">
        </el-table-column>
        <el-table-column align="center" prop="billTemplate" label="业务区域" width="70">
        </el-table-column>
        <el-table-column align="center" prop="statementStatus" label="账单状态" width="90">
        </el-table-column>
        <el-table-column align="center" prop="saleConfirmName" label="销售负责人" width="90">
        </el-table-column>
        <el-table-column align="center" prop="billConfirmName" label="账单责任人" width="90">
        </el-table-column>
        <el-table-column align="center" prop="salesCollaborativeName" label="协同销售人" width="90">
        </el-table-column>
        <el-table-column align="center" prop="confirmCustomerTime" label="客户确认时间" width="160">
        </el-table-column>
        <el-table-column align="center" prop="invoiceWriteoffUserName" label="核销人" width="80">
        </el-table-column>
        <el-table-column align="center" prop="invoiceWriteoffDate" label="核销日期" width="85" :formatter="formatstopDate1">
        </el-table-column>
        <el-table-column align="center" prop="startChargeTime" label="首次收费月份" width="100" :formatter="formatStartChargeTime">
        </el-table-column>
        <el-table-column align="center" prop="validBeginDate" label="生效日期" width="85">
        </el-table-column>
        <el-table-column align="center" prop="validEndDate" label="截止日期" width="85">
        </el-table-column>
        <el-table-column align="center" prop="itCode" label="IT编码" width="100">
        </el-table-column>
			</el-table>
			 <el-col :span="24" class="pagination">
         <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="currentPage" :page-sizes="[10, 30, 50]" :page-size.sync="pageSize" layout="total, sizes, prev, pager, next, jumper" :total="totalNum">
         </el-pagination>
			</el-col>
		</el-row>

	</div>
</template>
<script>
	// import API from '../../api/api_enterprise'
	export default {
		data() {
			return {
        spanArr: [],
        position: 0,
				loading: false,
				showFlag: false,
				data1: [],
        data2: [],
        currentPage: 1,
        pageSize: 10,
        totalNum: 0,
				query: {
          coopName: '',
          billTemplate: '',
          departureStation: '',
          billConfirmName: '',
          saleConfirmName: '',
          statementStatus: '',
          statementDate_begin: '',
          statementDate_end: '',
          validBeginDate: '',
          validEndDate: '',
          serviceNameOne: '',
          invoiceWriteoffDateBegin: '',
          invoiceWriteoffDateEnd: '',
          paymentMethod: '',
          serviceNameTwo: '',
				},
        serviceoptions: [],
        servicetwooptions: [],
				frow: {},
				currRow: ''
			}
		},
		created: function() {
        let buttonInfo = window.localStorage.getItem('buttonInfo')
        if (buttonInfo.indexOf('sys_coop_export')>-1) {
            this.exportButtonFlag=true;
        }
        this.query.statementDate_begin=this.getDateTime(new Date());
        this.query.statementDate_end=this.getDateTime(new Date());
        this.findCoopBillSettleList();
        this.$axios.get2('/prm/coopBill/queryServiceIsValid'
            )
            .then(function(response) {
                this.serviceoptions = response.data.data;
            }.bind(this));

        this.$axios.get2('/prm/coopBill/queryServiceTwoIsValid'
        )
            .then(function(response) {
                this.servicetwooptions = response.data.data;
            }.bind(this));

		},
		provide() {
		},
		components: {
		},
		methods: {
      formatStartChargeTime(row, column) {
          if (row.startChargeTime) {
              return row.startChargeTime.substring(0,7);
          }else{
              return "";
          }
      },
      formatstopDate1(row, column) {
          if (row.invoiceWriteoffDate) {
              return row.invoiceWriteoffDate.substring(0,10);
          }else{
              return "";
          }
      },
      getDateTime(theDate) {
          var _year = theDate.getFullYear();
          var _month = theDate.getMonth();
          var _date = theDate.getDate();
          _month = _month + 1;
          if(_month < 10){_month = "0" + _month;}
          if(_date<10){_date="0"+_date  ;}
          return  _year + "-" + _month;
      },
      getSummaries(param) {

          const sums = [];
          sums[0] = '合计';
          if(this.data2.length > 0) {
              sums[9] = this.getNumber1(this.data2[0].acturalChargeTotal);
              //sums[4] = this.getNumber1(this.data2[0].amountReceivedTotal);
          }
          return sums;
      },
      getNumber1(data) {
          return data.toFixed(2).replace(/\d{1,3}(?=(\d{3})+(\.\d*)?$)/g, '$&,');
      },
      acturalChargeFormat(row, column) {
          let acturalCharge='';
          if(row.acturalCharge==null){

          }else if(row.acturalCharge==0){
              acturalCharge='0.00';
          }else{
              row.acturalCharge = Number(row.acturalCharge)
              if(isNaN(row.acturalCharge)){
                  acturalCharge='';
              }else{
                  acturalCharge = row.acturalCharge.toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,')
              }
          }
          if(acturalCharge!=''){
              return acturalCharge;
          }
      },
      fillNumberFormat(row, column) {
          let fillNumber='';
          if(row.fillNumber==null){

          }else if(row.fillNumber==0){
              fillNumber='0';
          }else{
              row.fillNumber = Number(row.fillNumber)
              if(isNaN(row.fillNumber)){
                  fillNumber='';
              }else{
                  fillNumber = row.fillNumber.toString().replace(/(\d)(?=(\d{3})+$)/g, '$1,')
              }
          }
          if(fillNumber!=''){
              return fillNumber;
          }
      },
      formatter22(row, column) {
          return row.serviceNameTwo;
      },
      settlementTypeFormat(row, column) {
          let settlementType='';
          let settlementPeriod='';

          if(row.settlementType == '0') {
              settlementType= "包月计费";
          } else if(row.settlementType == '1') {
              settlementType=  "按量计费";
          }else if(row.settlementType == '2'){
              settlementType=  "包年计费";
          }else if(row.settlementType == '3'){
              settlementType=  "包半年计费";
          }else if(row.settlementType == '4'){
              settlementType=  "包季度计费";
          }


          if(row.settlementPeriod == '0') {
              settlementPeriod= "按月";
          } else if(row.settlementPeriod == '1'){
              settlementPeriod=  "按年";
          }else if(row.settlementPeriod == '2'){
              settlementPeriod=  "按季度";
          }else if(row.settlementPeriod == '3'){
              settlementPeriod=  "按半年";
          }
          if(settlementPeriod!='' && settlementType!=''){
              return row.paymentMethod+"/"+settlementPeriod+'/'+settlementType;
          }
      },
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
      findCoopBillSettleList() {
          this.loading = true;
          let coopName1 = "";
          if(this.query.coopName){
              coopName1 = this.query.coopName.toUpperCase();
          }
          this.$axios.post('/prm/coopBill/searchCoopBillSettleList', {
              coopName: coopName1,
              billTemplate: this.query.billTemplate,
              departureStation: this.query.departureStation,
              billConfirmName: this.query.billConfirmName,
              saleConfirmName: this.query.saleConfirmName,
              billConfirmName: this.query.billConfirmName,
              statementStatus: this.query.statementStatus,
              statementDate_begin: this.query.statementDate_begin,
              statementDate_end: this.query.statementDate_end,
              validBeginDate: this.query.validBeginDate,
              validEndDate: this.query.validEndDate,
              invoiceWriteoffDateBegin: this.query.invoiceWriteoffDateBegin,
              invoiceWriteoffDateEnd: this.query.invoiceWriteoffDateEnd,
              serviceNameOne: this.query.serviceNameOne.toString(),
              serviceNameTwo: this.query.serviceNameTwo.toString(),
              paymentMethod: this.query.paymentMethod,
              currentPage: this.currentPage,
              pageSize: this.pageSize
          }, {
              headers: {
                  'Content-Type': 'application/x-www-form-urlencoded'
              }
          }).then(function(response) {
              if(response.status = '200') {
                  this.loading = false
                  this.data1 = response.data.paramList
                  this.totalNum = response.data.totalNum
                  //this.getSpanArr(this.data1)
              } else {
                  this.loading = false
                  this.$notify.error({
                      title: '错误',
                      message: '查询失败'
                  });
              }
          }.bind(this)).catch(function(error) {
              this.loading = false
              console.log(error)
          });

          this.$axios.get2("/prm/coopBill/getTotalSettle", {
            coopName: coopName1,
            billTemplate: this.query.billTemplate,
            departureStation: this.query.departureStation,
            billConfirmName: this.query.billConfirmName,
            saleConfirmName: this.query.saleConfirmName,
            billConfirmName: this.query.billConfirmName,
            statementStatus: this.query.statementStatus,
            statementDate_begin: this.query.statementDate_begin,
            statementDate_end: this.query.statementDate_end,
            validBeginDate: this.query.validBeginDate,
            validEndDate: this.query.validEndDate,
            invoiceWriteoffDateBegin: this.query.invoiceWriteoffDateBegin,
            invoiceWriteoffDateEnd: this.query.invoiceWriteoffDateEnd,
            serviceNameOne: this.query.serviceNameOne.toString(),
            serviceNameTwo: this.query.serviceNameTwo.toString(),
            paymentMethod: this.query.paymentMethod,
          }, {
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded'
            }
          }).then(function(response) {
                  this.data2 = response.data.data;
                  this.getSummaries();
              }.bind(this));
      },

      getSpanArr(data) {
          this.spanArr = [] // 避免表格错乱！
          data.forEach((item, index) => {
              if (index === 0) {
                  this.spanArr.push(1)
                  this.position = 0
              } else {
                  if (data[index].statementId === data[index - 1].statementId) { // 这里是要合并行
                      this.spanArr[this.position] += 1
                      this.spanArr.push(0)
                  } else {
                      this.spanArr.push(1)
                      this.position = index
                  }
              }
          })
      },
      cellMerge({ row, column, rowIndex, columnIndex }) {
          if (columnIndex === 0 || columnIndex === 1 || columnIndex === 2) {
              const _row = this.spanArr[rowIndex]
              const _col = _row > 0 ? 1 : 0
              return {
                  rowspan: _row,
                  colspan: _col
              }
          }
      },

			//pageSize改变时触发的函数
			handleSizeChange() {
				this.findCoopBillSettleList();
			},
			//当前页改变时触发的函数
			handleCurrentChange(val) {
				this.findCoopBillSettleList();
			},

			exportExcel() {
        if(this.data1.length == 0){
            this.openError("查询结果没有数据，不允许导出");
            return;
        }
        let coopName1 = "";
        if(this.query.coopName){
            coopName1 = this.query.coopName.toUpperCase();
        }
				let params = {
            "coopName": coopName1,
            "billTemplate": this.query.billTemplate,
            "departureStation": this.query.departureStation,
            "billConfirmName": this.query.billConfirmName,
            "saleConfirmName": this.query.saleConfirmName,
            "billConfirmName": this.query.billConfirmName,
            "statementStatus": this.query.statementStatus,
            "statementDate_begin": this.query.statementDate_begin,
            "statementDate_end": this.query.statementDate_end,
            "validBeginDate": this.query.validBeginDate,
            "validEndDate": this.query.validEndDate,
            "serviceNameOne": this.query.serviceNameOne.toString(),
            "invoiceWriteoffDateBegin": this.query.invoiceWriteoffDateBegin,
            "invoiceWriteoffDateEnd": this.query.invoiceWriteoffDateEnd,
            "paymentMethod": this.query.paymentMethod,
            "serviceNameTwo": this.query.serviceNameTwo.toString(),

				}
				this.$axios.post3('/prm/coopBill/exportSettleExcel', params)
					.then(function(response) {
						var blob = new Blob([response.data], {
							type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8'
						});
						var downloadElement = document.createElement('a');
						var href = window.URL.createObjectURL(blob); // 创建下载的链接
						downloadElement.href = href;
						downloadElement.download = '结算报表' + '.xls'; // 下载后文件名
						document.body.appendChild(downloadElement);
						downloadElement.click(); // 点击下载
						document.body.removeChild(downloadElement); // 下载完成移除元素
						window.URL.revokeObjectURL(href); // 释放掉blob对象
					}.bind(this));

			},
		}
	}
</script>

