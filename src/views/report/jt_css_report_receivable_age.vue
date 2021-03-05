<template>
	<div class="warp-main">
		<el-form :inline="false" :model="query" label-width="100px" class="css_report_receivable_age">
			<div ref="css_receivable_header">
				<el-row>
					<el-col class="elementWidth">
						<el-form-item label-width="10px">
							<el-input style="width:149px;">
								<template slot="prepend">业务范畴</template>
								<el-select slot="suffix" v-model="query.businessScope" filterable placeholder="请选择" style="width: 80px;margin-right: -5px;">
									<el-option v-for="item in businessCodes" :key="item.paramRanking" :label="item.paramText" :value="item.paramText">
									</el-option>
								</el-select>
							</el-input>
						</el-form-item>
					</el-col>
					<el-col class="elementWidth">
						<el-form-item label-width="10px">
							<el-input style="width:180px;">
								<template slot="prepend">客户类型</template>
								<el-select slot="suffix" v-model="query.customerType" style="width: 111px;margin-right: -5px;">
									<el-option label="订单客户" value="1">
									</el-option>
									<el-option label="收款客户" value="2">
									</el-option>
								</el-select>
							</el-input>
						</el-form-item>
					</el-col>
					<el-col class="elementWidth">
						<el-form-item label-width="10px">
							<el-input style="width: 260px;" v-model="query.customerName" auto-complete="off" clearable>
								<template slot="prepend">客&emsp;&emsp;户</template>
							</el-input>
						</el-form-item>
					</el-col>
					<el-col class="elementWidth">
						<el-form-item label-width="20px">
							<el-button type="text" size="mini" v-if="showFlag" v-on:click="showFlagSearch">收起</el-button>
							<el-button type="text" size="mini" v-if="!showFlag" v-on:click="showFlagSearch">展开</el-button>
							<el-button type="primary" size="small" v-on:click="findByPage" style="margin-left: 2px;padding-left: 8px;padding-right: 8px;">查询</el-button>
						</el-form-item>
					</el-col>
				</el-row>
        <el-row v-show="showFlag">
          <el-col class="elementWidth">
          	<el-form-item label-width="10px">
          		<el-input style="width:339px;">
          			<template slot="prepend">分公司&emsp;</template>
          			<el-select slot="suffix" v-model="query.otherOrg" filterable placeholder="请选择"  style="width: 271px;margin-right: -5px">
          				<el-option v-for="item in otherOrgs" :key="item.orgId" :label="item.orgName" :value="item.orgId">
          				</el-option>
          			</el-select>
          		</el-input>
          	</el-form-item>
          </el-col>
          <el-col class="elementWidth">
            <el-form-item label-width="10px">
              <el-input style="width: 260px;" v-model="query.salesName" auto-complete="off" clearable>
                <template slot="prepend">责任销售</template>
              </el-input>
            </el-form-item>
          </el-col>
          <el-col class="elementWidth">
          	<el-form-item label-width="39px">
          		<el-button :loading="buttonLoading" style="margin-left: 13px;padding-left: 8px;padding-right: 8px;background-color:#FFF;color:#409EFF" type="primary" size="small" v-on:click="exportExcelList">导出</el-button>
          	</el-form-item>
          </el-col>
        </el-row>
				<el-row v-if=showFlag>
					<el-col class="elementWidth">
						<el-form-item label-width="10px">
							<el-input style="width:149px;">
								<template slot="prepend">是否超期</template>
								<el-select slot="suffix" v-model="query.overdueValid" style="width: 80px;margin-right: -5px;">
									<el-option label="全部" value="3">
									</el-option>
									<el-option label="是" value="1">
									</el-option>
									<el-option label="否" value="0">
									</el-option>
								</el-select>
							</el-input>
						</el-form-item>
					</el-col>
					<el-col class="elementWidth">
						<el-form-item label-width="10px">
							<el-input style="width:180px;">
								<template slot="prepend">是否超额</template>
								<el-select slot="suffix" v-model="query.durationValid" style="width: 111px;margin-right: -5px;">
									<el-option label="全部" value="全部">
									</el-option>
									<el-option label="是" value="1">
									</el-option>
									<el-option label="否" value="0">
									</el-option>
								</el-select>
							</el-input>
						</el-form-item>
					</el-col>
					<el-col class="elementWidth">
						<el-form-item label-width="10px">
							<el-input style="width: 260px;" v-model="countRanges" auto-complete="off" clearable>
								<template slot="prepend">分布区间</template>
							</el-input>
						</el-form-item>
						<span style="float: left;margin-left: 80px;margin-top: -12px;font-size: smaller;color: red;">格式：正整数以';'分隔,最多五个数值</span>
					</el-col>
				</el-row>
			</div>
		</el-form>
		<!-- @cell-click="handlerCellClick" -->
		<el-table border v-loading="loading" :max-height="tableHeight" class="table_rec" highlight-current-row :data="data" stripe>
			<!-- 			<el-table-column fixed label="操作" align="center" width="60">
				<template slot-scope="scope">
					<el-dropdown v-if="scope.row.business_scope!=null" trigger="click" @command="handleCommand" @visible-change="handleChange(scope.row)">
						<i class="el-icon-s-operation"></i>
						<el-dropdown-menu slot="dropdown">
							<el-dropdown-item command="view">查看</el-dropdown-item>
						</el-dropdown-menu>
					</el-dropdown>
					<span v-else>合计</span>
				</template>
			</el-table-column> -->
			<el-table-column align="center" label="序号" width="60">
				<template slot-scope="scope">
					<span v-if="scope.row.business_scope!=null&&scope.row.business_scope!='合计'">{{scope.$index+1}}</span>
				</template>
			</el-table-column>
			<el-table-column align="center" prop="business_scope" label="业务范畴" width="70"></el-table-column>
			<el-table-column align="left" prop="coop_code" header-align="center" label="客户代码" width="100">
				<template slot-scope="scope">
					<span>{{scope.row.coop_code}}</span>
				</template>
			</el-table-column>
			<el-table-column v-if="customerType==1" align="left" prop="coop_name" header-align="center" label="订单客户" width="260">
				<template slot-scope="scope">
					<a href="javascript:void(0)" @click="cellClick(scope.row)" style="color: #137DFA;text-decoration: underline;">{{scope.row.coop_name}}</a>
				</template>
			</el-table-column>
			<el-table-column v-if="customerType==2" align="left" prop="coop_name" header-align="center" label="收款客户" width="260">
				<template slot-scope="scope">
					<a href="javascript:void(0)" @click="cellClick(scope.row)" style="color: #137DFA;text-decoration: underline;">{{scope.row.coop_name}}</a>
				</template>
			</el-table-column>
			<!-- <el-table-column align="center" prop="servicer_name" label="责任客服" width="150"></el-table-column> -->
			<!-- <el-table-column align="center" prop="sales_name" label="责任销售" width="150"></el-table-column> -->
			<el-table-column align="center" label="白名单" width="60">
				<template slot-scope="scope">
					<i class="iconfont el-icon-myduihao" style="color: red;" v-show="scope.row.white_valid==1"></i>
				</template>
			</el-table-column>
			<el-table-column align="center" prop="credit_level" label="信用等级" width="70"></el-table-column>
			<el-table-column align="center" label="授信额度(万元)" width="120">
				<template slot-scope="scope">
					<span v-if="scope.row.duration_valid==1" style="color: red;">{{scope.row.credit_limit}}</span>
					<span v-else>{{scope.row.credit_limit}}</span>
				</template>
			</el-table-column>
			<el-table-column align="center" prop="settlement_period" label="EQ" width="100"></el-table-column>
			<el-table-column align="center" prop="credit_duration" label="授信期限(天)" width="100"></el-table-column>
			<el-table-column align="center" label="超期天数" width="70">
				<template slot-scope="scope">
					<span v-if="scope.row.overdue_valid==1" style="color: red;">{{scope.row.overdue_days}}</span>
					<span v-else>{{scope.row.overdue_days}}</span>
				</template>
			</el-table-column>
			<el-table-column header-align="center" align="right" label="应收金额(本币)" width="120">
				<template slot-scope="scope">
					<span v-if="scope.row.duration_valid==1" style="color: red;">{{scope.row.functional_amount}}</span>
					<span v-else>{{scope.row.functional_amount}}</span>
				</template>
			</el-table-column>
			<el-table-column header-align="center" align="right" prop="no_functional_amount_writeoff_valid_0" label="账期内金额(本币)" width="120"></el-table-column>
			<el-table-column header-align="center" align="right" label="超期金额(本币)" width="120">
				<template slot-scope="scope">
					<span v-if="scope.row.overdue_valid==1" style="color: red;">{{scope.row.no_functional_amount_writeoff_valid_1}}</span>
					<span v-else>{{scope.row.no_functional_amount_writeoff_valid_1}}</span>
				</template>
			</el-table-column>
			<el-table-column v-if="column.length!=0&&columnFlag" label="超期应收账款分布情况" header-align="center">
				<el-table-column v-for="(name,index) in column" :key="index" :prop="'colName_'+name" :label="name" header-align="center" align="right" width="120">
				</el-table-column>
			</el-table-column>
			<el-table-column v-if="column.length!=0&&!columnFlag" label="超期应收账款分布情况" header-align="center" :render-header="renderHeader">
				<el-table-column v-for="(name,index) in column" :key="index" :prop="'colName_'+name" :label="name" :formatter="stateFormat" header-align="center" align="right" width="120">
				</el-table-column>
			</el-table-column>
			<el-table-column align="center" prop="" label=""></el-table-column>
		</el-table>
		<!--<div class="pagination">
			<el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="pageConf.pageCode" :page-sizes="pageConf.pageOption" :page-size.sync="pageConf.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="pageConf.totalPage">
			</el-pagination>
		</div>-->
		<detail ref="addMission" v-if="detailVisible" :visible.sync="detailVisible" :frow="frow"></detail>
	</div>
</template>
<script>
	import Detail from '.././css/cssReportReceivableAge/css_report_receivable_age_detail'
	export default {
		data() {
			return {
				tableHeight: '750px',
				/*表数据*/
				data: [],
				column: [],
        otherOrgs:[],
				pageConf: {
					//设置一些初始值(会被覆盖)
					pageCode: 1, //当前页
					pageSize: 10, //每页显示的记录数
					totalPage: 0, //总记录数
					pageOption: [5, 10, 20]
				},
				query: {
					businessScope: 'AE',
					customerType: '1',
					customerName: '',
					countRanges: '',
					overdueValid: '全部',
					durationValid: '全部',
					orgEditionName: '',
          otherOrg:-1,
          salesName: '',
				},
				countRanges: '15;30;60;90',
				customerType: '1',
				businessCodes: [],
				loading: false,
				showFlag: false,
				detailVisible: false,
				columnFlag: false,
				buttonLoading: false,
				currRow: {},
				frow: {}
			}
		},
		created() {
      let param ={
         checkJt:'jt'
      }
      //分公司集合
      this.$axios.get2('/hrs/org/getOrgChild',param).then((response) => {
      	  if(response.data.data&&response.data.data.length>0){
            this.otherOrgs=response.data.data;
            this.otherOrgs.unshift(
            {
              orgId:-1,
              orgName:'全部'
            }
            );
          }else{
             this.otherOrgs.unshift(
             {
               orgId:-1,
               orgName:'全部'
             }
             );
          }
      })
			//查询业务范畴
			this.$axios.get2('/afbase/category/paramsNew', {
				categoryName: "业务范畴"
			}).then(function(response) {
				this.businessCodes = response.data.data;

			}.bind(this)).catch(function(error) {
				console.log(error);
			})

			let orgVersion = window.localStorage.getItem('orgVersion')
			if (orgVersion) {
				this.query.orgEditionName = orgVersion;
				if (orgVersion.indexOf("专业版") >= 0 || orgVersion.indexOf("旗舰版")>-1 || orgVersion.indexOf("标准版")>-1) {
					this.columnFlag = true;
				}
			}
		},
		components: {
			'detail': Detail
		},
		methods: {
			renderHeader(h, {
				column,
				$index
			}) {
				return h('div', [
					h('span', {
						// attrs:{
						//      class:'cell'
						//    },
						domProps: {
							innerHTML: column.label + "<span style='color: red;'>(此功能仅限标准版,专业版和旗舰版使用)</span>"
						}
					})
				])
			},
			showFlagSearch() {
				this.showFlag = !this.showFlag;
				this.setHeight();
			},
			setHeight() {
				this.$nextTick(() => {
					let css_receivable_header = this.$refs.css_receivable_header.offsetHeight;
					let heightS = window.innerHeight - 92 - css_receivable_header;
					this.tableHeight = heightS + "px";
				});
			},
			stateFormat() {
				return "";
			},
			handlerCellClick(row, column, cell, event) {
				if (!row.coop_name) {
					return false;
				}
				if ("订单客户" == column['label'] || "收款客户" == column['label']) {
					this.viewdetail(row)
				}
			},
			cellClick(row) {
				if (!row.coop_name) {
					return false;
				}
				// if ("订单客户" == label||"收款客户" == label) {
				this.viewdetail(row);
				// }
			},
			// handleCommand(command) {
			// 	if(command == 'view') {
			// 		this.viewdetail(this.currRow)
			// 	}
			// },
			// handleChange(command) {
			// 	this.currRow = command
			// },
			viewdetail(row) {
				this.frow.customerId = row.customer_id
				this.frow.customerType = this.customerType
				this.frow.businessScope = row.business_scope
        this.frow.otherOrg = this.query.otherOrg;
        this.frow.salesName = this.query.salesName
        this.frow.otherOrgFlag = true;
				this.detailVisible = true;
			},
			findByPage() {
				this.setHeight();
				let regx = /^(\d+(;\d+)*)?$/g
				if (!regx.test(this.countRanges)) {
					this.openError('统计区间格式有误,必须是正整数以";"分隔')
					return
				}
				if (this.countRanges.split(';').length > 5) {
					this.openError('统计区间最多录入5个数值')
					return
				}
				if (Array.from(new Set(this.countRanges.split(';'))).length != this.countRanges.split(';').length) {
					this.openError('统计区间录入数值不可重复')
					return
				}
				this.query.countRanges = this.countRanges.split(';').sort((e1, e2) => parseInt(e1) - parseInt(e2)).join()
				this.customerType = this.query.customerType
				this.loading = true
				this.$axios.get2("/afbase/reportReceivableAge", this.query)
					.then(function(response) {
						this.column = response.data.data.column
						this.data = response.data.data.data
						// console.log(this.column)
						//						this.pageConf.totalPage = response.data.data.total;
						//						if(this.data1.length == 0) {
						//							let current = Math.ceil(this.pageConf.totalPage / this.pageConf.pageSize);
						//							this.findByPage2(current);
						//						} else {
						//						}
						this.loading = false
					}.bind(this));
			},
			findByPage2(current) {
				this.$axios.get2("/afbase/reportReceivableAge", this.query)
					.then(function(response) {
						this.loading = false
						this.data1 = response.data.data.records;
						this.pageConf.totalPage = response.data.data.total;
					}.bind(this));
			},
			exportExcelList() {
				if(this.data.length==0){
					this.openError('列表数据为空，无法导出')
					return
				}
				let regx = /^(\d+(;\d+)*)?$/g
				if (!regx.test(this.countRanges)) {
					this.openError('统计区间格式有误,必须是正整数以";"分隔')
					return
				}
				if (this.countRanges.split(';').length > 5) {
					this.openError('统计区间最多录入5个数值')
					return
				}
				if (Array.from(new Set(this.countRanges.split(';'))).length != this.countRanges.split(';').length) {
					this.openError('统计区间录入数值不可重复')
					return
				}
				this.query.countRanges = this.countRanges.split(';').sort((e1, e2) => parseInt(e1) - parseInt(e2)).join();
				this.customerType = this.query.customerType;
				this.loading = true
				this.buttonLoading = true
				this.$axios.post3('/afbase/reportReceivableAge/exportExcelList', this.query)
					.then(function(response) {
						this.loading = false
						this.buttonLoading = false
						var blob = new Blob([response.data], {
							type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8'
						});
						var downloadElement = document.createElement('a');
						var href = window.URL.createObjectURL(blob); // 创建下载的链接
						downloadElement.href = href;
						downloadElement.download = '应收账龄报表' + '.xls'; // 下载后文件名
						document.body.appendChild(downloadElement);
						downloadElement.click(); // 点击下载
						document.body.removeChild(downloadElement); // 下载完成移除元素
						window.URL.revokeObjectURL(href); // 释放掉blob对象
					}.bind(this));

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
					message: info,
					type: 'error',
					position: 'bottom-right'
				});
			},
			//pageSize改变时触发的函数
			handleSizeChange() {
				this.findByPage();
			},
			//当前页改变时触发的函数
			handleCurrentChange() {
				this.findByPage();
			}
		},

	}
</script>
<style>
	.css_report_receivable_age .el-table .cell {
		white-space: pre-line !important;
		/*保留换行符*/
	}

	.css_report_receivable_age .table_rec tr.current-row>td {
		background: #FDF5E6 !important;
	}

	.css_report_receivable_age .el-input__icon {
		line-height: 30px !important;
	}

	.css_report_receivable_age .el-form-item__content {
		line-height: 30px !important;
	}

	.css_report_receivable_age .el-input-group__prepend {
		padding: 0 6px;
	}

	.css_report_receivable_age .widthWithThree .el-input-group__prepend {
		padding: 0 13px !important;
	}

	.css_report_receivable_age .el-checkbox__inner {
		background-color: #FFF !important;
	}

	.css_report_receivable_age .el-button {
		margin-top: -5px !important
	}
</style>
