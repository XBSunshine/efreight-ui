<template>
	<div class="warp-main">
		<el-form :inline="false" :model="query" label-width="90px" class="orderListPage">
			<div ref="af_debit_note_writeoff_header">
				<el-row>
					<el-col class="elementWidth">
						<el-form-item label="" label-width="10px">
							<el-input style="width:210px;">
								<template slot="prepend">业务范畴</template>
								<el-select slot="suffix" v-model="query.businessScope" style="width:141px;margin-right: -5px;">
									<el-option v-for="item in businessCodes" :key="item.paramRanking" :label="item.paramText" :value="item.paramText">
									</el-option>
								</el-select>
							</el-input>
						</el-form-item>
					</el-col>
					<el-col class="elementWidth">
						<el-form-item label-width="10px">
							<el-input v-model="query.customerName" auto-complete="off" clearable style="width:245px;">
								<template slot="prepend">收款客户</template>
							</el-input>
						</el-form-item>
					</el-col>
					<el-col class="elementWidth">
						<el-form-item label-width="10px">
							<el-input style="width:210px;">
								<template slot="prepend">核销日期</template>
								<el-date-picker slot="suffix" v-model="query.writeoffDateStart" clearable type="date" value-format="yyyy-MM-dd" placeholder="开始" style="width: 141px;margin-right: -5px;">
								</el-date-picker>
							</el-input>
							<span>-</span>
							<el-date-picker v-model="query.writeoffDateEnd" clearable type="date" value-format="yyyy-MM-dd" placeholder="结束" style="width: 135px;">
							</el-date-picker>
						</el-form-item>
					</el-col>
					<el-col class="elementWidth">
						<el-form-item label-width="10px">
							<el-button type="text" size="small" v-if=showFlag v-on:click="showFlagSearch">收起</el-button>
							<el-button type="text" size="small" v-if=!showFlag v-on:click="showFlagSearch">展开</el-button>
							<el-button type="primary" size="small" v-on:click="queryList" style="margin-left: 2px;padding-left: 8px;padding-right: 8px;">查询</el-button>
						</el-form-item>
					</el-col>

				</el-row>
				<el-row v-show="showFlag">
					<el-col class="elementWidth">
						<el-form-item label-width="10px">
							<el-input class="widthWithThree" v-model="query.creatorName" auto-complete="off" clearable style="width:210px;">
								<template slot="prepend">核销人</template>
							</el-input>
						</el-form-item>
					</el-col>
					<el-col class="elementWidth">
						<el-form-item label-width="10px">
							<el-input v-model="query.writeoffNum" auto-complete="off" clearable style="width:245px;" @input="query.writeoffNum=query.writeoffNum.toUpperCase()">
								<template slot="prepend">核销单号</template>
							</el-input>
						</el-form-item>
					</el-col>
					<el-col class="elementWidth">
						<el-form-item label-width="10px">
							<el-input style="width:210px;">
								<template slot="prepend">核销时间</template>
								<el-date-picker slot="suffix" v-model="query.createTimeBegin" clearable type="date" value-format="yyyy-MM-dd 00:00:00" placeholder="开始" style="width: 141px;margin-right: -5px;">
								</el-date-picker>
							</el-input>
							<span>-</span>
							<el-date-picker v-model="query.createTimeEnd" clearable type="date" value-format="yyyy-MM-dd 23:59:59" placeholder="结束" style="width: 135px;">
							</el-date-picker>
						</el-form-item>
					</el-col>
					<el-col class="elementWidth">
						<el-form-item label-width="38px">
							<el-button style="margin-left: 4px;padding-left: 8px;padding-right: 8px;background-color:#FFF;color:#409EFF" type="primary" size="small" v-on:click="setting">设置</el-button>
							<el-button style="margin-left: 4px;padding-left: 8px;padding-right: 8px;background-color:#FFF;color:#409EFF" type="primary" size="small" v-on:click="exportExcel">导出</el-button>
						</el-form-item>
					</el-col>

				</el-row>
				<el-row v-show="showFlag">
					<el-col class="elementWidth">
						<el-form-item label-width="10px">
							<el-input v-model="query.debitNoteNum" auto-complete="off" clearable style="width:292px;" @input="query.debitNoteNum=query.debitNoteNum.toUpperCase()">
								<template slot="prepend">账单号/清单号</template>
							</el-input>
						</el-form-item>
					</el-col>
					<el-col class="elementWidth">
						<el-form-item label-width="10px">
							<el-input v-model="query.orderCode" auto-complete="off" clearable style="width:292px;" @input="query.orderCode=query.orderCode.toUpperCase()">
								<template v-if="query.businessScope!='LC'&&query.businessScope!='IO'" slot="prepend">主单号/订单号</template>
                <template v-if="query.businessScope=='IO'" slot="prepend">客户单号/订单号</template>
                <template v-if="query.businessScope=='LC'" slot="prepend">订单号</template>
							</el-input>
						</el-form-item>
					</el-col>

				</el-row>
			</div>
		</el-form>
		<div>

			<el-table v-loading="loading" stripe :data="data" border :max-height="tableHeight" @header-dragend="cellWidth">

				<el-table-column fixed type="index" align="center" label="操作" width="50">
					<template slot-scope="scope">
						<el-dropdown v-if="scope.row.writeoffNum!='合计'" trigger="click" @command="handleCommand" @visible-change="handleChange(scope.row)">
							<i class="el-icon-s-operation"></i>
							<el-dropdown-menu slot="dropdown">
								<el-dropdown-item command="view">查看</el-dropdown-item>
								<el-dropdown-item command="delete" v-if="deleteButtonFlag">删除</el-dropdown-item>
							</el-dropdown-menu>
						</el-dropdown>
						<span v-else>合计</span>
					</template>
				</el-table-column>

				<template v-for="(item,index) in tableColumns">

					<el-table-column v-if="item.label=='核销单号'" :key="index" :prop="item.prop" :label="item.label" :width="item.width" :align="item.align" :sortable="item.sortable" :formatter="formatterNumber5">
						<template slot-scope="scope">
							<a href="javascript:void(0)" @click="doView2(scope.row)" style="color: #137DFA;text-decoration: underline;">{{formatterNumber5(scope.row)}}</a>
						</template>
					</el-table-column>
					<el-table-column v-if="item.label=='核销日期'" :key="index" :prop="item.prop" :label="item.label" :width="item.width" :align="item.align" :sortable="item.sortable" :formatter="formatter1">
					</el-table-column>

					<el-table-column v-if="item.label=='收款客户'" :key="index" :prop="item.prop" :label="item.label" :width="item.width" :align="item.align" :sortable="item.sortable" header-align="center">
					</el-table-column>
					<el-table-column v-if="item.label=='账单号/清单号'" :key="index" :prop="item.prop" :label="item.label" :width="item.width" :align="item.align" :sortable="item.sortable">
					</el-table-column>
					<el-table-column v-if="item.label=='应收金额（原币）'" :key="index" :prop="item.prop" :label="item.label" :width="item.width" :align="item.align" :sortable="item.sortable">
						<template slot-scope="scope">
							<p v-for="(item,index) in scope.row.currencyAmount.split('  ')" :key="index">
								<font v-if="item.indexOf('CNY')>-1">{{item}}</font>
								<font v-else style="color: red;">{{item}}</font>
							</p>
						</template>
					</el-table-column>
					<el-table-column v-if="item.label=='本次核销金额（原币）'" :key="index" :prop="item.prop" :label="item.label" :width="item.width" :align="item.align" :sortable="item.sortable">
						<template slot-scope="scope">
							<p v-for="(item,index) in scope.row.currencyAmount2.split('  ')" :key="index">
								<font v-if="item.indexOf('CNY')>-1">{{item}}</font>
								<font v-else style="color: red;">{{item}}</font>
							</p>
						</template>
					</el-table-column>
					<el-table-column v-if="item.label=='应收金额（本币）'" :key="index" :prop="item.prop" :label="item.label" :width="item.width" :align="item.align" :sortable="item.sortable" :formatter="formatterNumber6">
					</el-table-column>
					<el-table-column v-if="item.label=='本次核销金额（本币）'" :key="index" :prop="item.prop" :label="item.label" :width="item.width" :align="item.align" :sortable="item.sortable" :formatter="formatterNumber8">
					</el-table-column>
					<el-table-column v-if="item.label=='备注'" :key="index" :prop="item.prop" :label="item.label" :width="item.width" :align="item.align" :sortable="item.sortable">
					</el-table-column>
					<el-table-column v-if="item.label=='核销人'" :key="index" :prop="item.prop" :label="item.label" :width="item.width" :align="item.align" :sortable="item.sortable" :formatter="formatter_creatorName">
					</el-table-column>
					<el-table-column v-if="item.label=='核销时间'" :key="index" :prop="item.prop" :label="item.label" :width="item.width" :align="item.align" :sortable="item.sortable">
					</el-table-column>
          <el-table-column v-if="item.label=='科目代码'" :key="index" :prop="item.prop" :label="item.label" :width="item.width" :align="item.align" :sortable="item.sortable">
          </el-table-column>
          <el-table-column v-if="item.label=='科目名称'" :key="index" :prop="item.prop" :label="item.label" :width="item.width" :align="item.align" :sortable="item.sortable">
          </el-table-column>
				</template>
				<!-- <el-table-column align="left" prop="writeoffNum" width="140" label="核销单号" :formatter="formatterNumber5"></el-table-column> -->
				<!-- <el-table-column align="left" prop="writeoffNum" width="140" label="核销单号" :formatter="formatterNumber5">
					<template slot-scope="scope">
			          <a href="javascript:void(0)" @click="doView2(scope.row)" style="color: #137DFA;text-decoration: underline;">{{formatterNumber5(scope.row)}}</a>
			        </template>
				</el-table-column>
				<el-table-column  align="center" prop="writeoffDate" label="核销日期" width="100" :formatter="formatter1"></el-table-column>
				<el-table-column align="center" prop="customerName" width="240" label="收款客户"></el-table-column>
				<el-table-column align="center" prop="debitNoteNumStatementNum" width="140" label="账单号/清单号"></el-table-column>

				<el-table-column align="right" label="应收金额（原币）" width="140">
					<template slot-scope="scope">
						<p v-for="(item,index) in scope.row.currencyAmount.split('  ')" :key="index">
							<font v-if="item.indexOf('CNY')>-1">{{item}}</font>
							<font v-else style="color: red;">{{item}}</font>
						</p>
					</template>
				</el-table-column>
				<el-table-column align="right" label="本次核销金额（原币）" width="160">
					<template slot-scope="scope">
						<p v-for="(item,index) in scope.row.currencyAmount2.split('  ')" :key="index">
							<font v-if="item.indexOf('CNY')>-1">{{item}}</font>
							<font v-else style="color: red;">{{item}}</font>
						</p>
					</template>
				</el-table-column> -->
				<!-- <el-table-column align="right" prop="functionalAmount" label="应收金额（本币）"  :formatter="formatterNumber6" width="140"></el-table-column> -->
				<!-- <el-table-column align="right" prop="amountWriteoff" label="核销金额" width="140" :formatter="formatterNumber7"></el-table-column> -->
				<!-- <el-table-column align="right" prop="functionalAmountWriteoff" label="本次核销金额（本币）" width="160" :formatter="formatterNumber8"></el-table-column> -->
				<!-- <el-table-column align="right" prop="functionalAmountWriteoff" label="未核销金额（本币）" width="140" :formatter="formatterNumber9">
        </el-table-column> -->
				<!-- <el-table-column align="center" prop="writeoffRemark" min-width="400" label="备注"></el-table-column>
				 <el-table-column align="center" prop="creatorName" width="100" label="核销人" :formatter="formatter_creatorName"></el-table-column>
				<el-table-column align="center" prop="createTime" width="150" label="核销时间"></el-table-column> -->
			</el-table>
		</div>
		<div ref="af_debit_note_writeoff_footer">
			<el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="pageConf.pageCode" :page-sizes="pageConf.pageOption" :page-size.sync="pageConf.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="pageConf.totalPage">
			</el-pagination>
		</div>
		<setVisibleTag ref="addMission" v-if="setVisible" :visible.sync="setVisible"></setVisibleTag>
		<billViewIncome ref="addMission" v-if="billViewIncome" :visible.sync="billViewIncome" :frow="frow"></billViewIncome>

	</div>
</template>
<script>
	import setVisibleVue from './af_debit_note_writeoff_setting'
	import billViewIncome from './af_debit_note_bill_writeoff_view'
	import columns from './af_debit_note_writeoff_column.json'
	export default {
		data() {
			return {
				tableHeight: '800px',
				loading: false,
				data: [],
				expandRowKeys: [],
				allCheck: false,
				pageConf: {
					//设置一些初始值(会被覆盖)
					pageCode: 1, //当前页
					pageSize: 10, //每页显示的记录数
					totalPage: 0, //总记录数
					pageOption: [10, 50, 100]
				},
				printVisible: false,
				setVisible: false,
				billViewIncome: false,
				saveVisible: false,
				deleteButtonFlag: false,
				frow: {},
				query: {
					businessScope: 'AE',
					debitNoteNum: '',
					orderCode: '',
					writeoffNum: '',
					customerName: '',
					writeoffDateStart: '',
					writeoffDateEnd: '',
					createTimeBegin: '',
					createTimeEnd: '',
					creatorName: '',
					columnStrs: ''
				},
				form2: {
					incomeWriteoffId: '',
					businessScope: '',
					debitNoteId: '',
					statementId: '',
					currency: ''
				},
				businessCodes: [],
				selectionData: [],
				tableColumns: [],
				debitNoteStatus: ['发票开具', '制作账单'],
				debitNoteStatuss: [{
					label: '发票开具',
					value: '发票开具'
				}, {
					label: '制作账单',
					value: '制作账单'
				}, {
					label: '制作清单',
					value: '制作清单'
				}],
				showFlag: false
			}
		},
		created: function() {
			//按钮权限开始
			let buttonInfo = window.localStorage.getItem('buttonInfo')
			if (buttonInfo.indexOf('af-writeoff-bill-delete') > -1) {
				this.deleteButtonFlag = true;
			}
			//查询业务范畴
			this.$axios.get2('/afbase/category/paramsNew', {
				categoryName: "业务范畴"
			}).then(function(response) {
				this.businessCodes = response.data.data;
			}.bind(this)).catch(function(error) {
				console.log(error);
			})
			//
			this.query.writeoffDateStart = this.getDateTime(new Date());
      //从数据库查询设置信息
      let pageName = '财务结算管理/收入对账/核销单';
      this.$axios.get2("/hrs/user/getUserPageSet?pageName=" + pageName)
          .then(function(response) {
              let af_debit_note_writeoff_column = response.data.data;
              if(af_debit_note_writeoff_column && af_debit_note_writeoff_column.length>0){
                  this.tableColumns = this.sortBykey(af_debit_note_writeoff_column, 'index');
              }else{
                  this.tableColumns = this.sortBykey(columns.info, 'index');
              }
          }.bind(this));
/*			let userId = window.localStorage.getItem('userId');
			let list_column = window.localStorage.getItem(userId + '_af_debit_note_writeoff_column');
			if (list_column) {
				let arrayC = JSON.parse(list_column)
				if (arrayC && arrayC.length > 0) {
					this.tableColumns = this.sortBykey(arrayC, 'index');
				}
			} else {
				this.tableColumns = this.sortBykey(columns.info, 'index');
			}*/
		},
		mounted() {
			this.setHeight();
		},
		provide() {
			return {
				queryList: this.queryList
			}
		},
		components: {
			'setVisibleTag': setVisibleVue,
			'billViewIncome': billViewIncome
		},
		methods: {
      cellWidth(newWidth, oldWidth, column, event) {
          let strColumn = JSON.stringify(this.tableColumns);
          let userId = window.localStorage.getItem('userId');
          let arrayC = JSON.parse(strColumn);
          if (arrayC && arrayC.length > 0) {
              arrayC.forEach(function(item, index) {
                  if (column.label == item.label) {
                      item.width = newWidth;
                  }
              });
              arrayC = this.sortBykey(arrayC, 'index');
              localStorage.setItem(userId + '_af_debit_note_writeoff_column_width', JSON.stringify(arrayC))
          }
      },
			sortBykey(ary, key) {
				return ary.sort(function(a, b) {
					let x = a[key]
					let y = b[key]
					return ((x < y) ? -1 : (x > y) ? 1 : 0)
				})
			},
			setting() {
				this.setVisible = true;
			},
			showFlagSearch() {
				this.showFlag = !this.showFlag;
				this.setHeight();
			},
			setHeight() {
				this.$nextTick(() => {
					let af_debit_note_writeoff_header = this.$refs.af_debit_note_writeoff_header.offsetHeight;
					let af_debit_note_writeoff_footer = this.$refs.af_debit_note_writeoff_footer.offsetHeight;
					let heightS = window.innerHeight - 147 - af_debit_note_writeoff_header - af_debit_note_writeoff_footer;
					this.tableHeight = heightS + "px";
				});
			},
			toUpperCaseValue(val) {
				return val.toUpperCase();
			},
			handleCommand(command) {
				if (command == 'view') {
					this.doView()
				} else if (command == 'delete') {
					this.doDelete()
				}

			},
			handleChange(command) {
				this.frow = command
			},
			doView() {
				this.doView2(this.frow)
			},
			doView2(row) {
				if (row.debitNoteNumStatementNum.indexOf("ST") > -1) {
					this.frow.statementNum = row.debitNoteNumStatementNum
					this.frow.debitNoteNum = ''
				} else {
					this.frow.statementNum = ''
					this.frow.debitNoteNum = row.debitNoteNumStatementNum
				}
				this.frow.incomeWriteoffId = row.incomeWriteoffId
				this.billViewIncome = true;
			},
			openError(info) {
				this.$notify({
					title: '',
					message: info,
					type: 'error',
					position: 'bottom-right'
				});
			},
			openSuccess(info) {
				this.$notify({
					title: '',
					message: '操作成功',
					type: 'success',
					position: 'bottom-right'
				});
			},

			doDelete(row) {
				row = this.frow;
        if (row.debitNoteId) {
            this.$confirm('你确定要删除核销吗?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning',
                center: true
            }).then(() => {
                this.$axios.get2("/afbase/cssIncomeWriteoff/getVoucherDate", {
                    incomeWriteoffId: this.frow.incomeWriteoffId
                }).then(function(response) {
                    if(response.data.data && response.data.data.voucherDate){
                        this.$confirm('当前核销单已制作凭证, 是否继续?', '提示', {
                            confirmButtonText: '是',
                            cancelButtonText: '否',
                            type: 'warning'
                        }).then(() => {

                            this.form2.incomeWriteoffId = row.incomeWriteoffId;
                            this.form2.debitNoteId = row.debitNoteId;
                            this.form2.currency = row.currency;
                            this.form2.businessScope = row.businessScope;
                            this.$axios.post2('/afbase/cssIncomeWriteoff/doDeleteBillWriteoff', this.form2)
                                .then(function(response) {
                                    if (response.data.code == 0) {
                                        this.openSuccess();
                                        this.queryList();
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
                    }else{
                        this.form2.incomeWriteoffId = row.incomeWriteoffId;
                        this.form2.debitNoteId = row.debitNoteId;
                        this.form2.currency = row.currency;
                        this.form2.businessScope = row.businessScope;
                        this.$axios.post2('/afbase/cssIncomeWriteoff/doDeleteBillWriteoff', this.form2)
                            .then(function(response) {
                                if (response.data.code == 0) {
                                    this.openSuccess();
                                    this.queryList();
                                } else {
                                    this.openError(response.data.messageInfo);
                                }
                            }.bind(this));
                    }
                }.bind(this));

            }).catch(() => {
            });
        } else {
            this.$confirm('你确定要删除核销吗?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning',
                center: true
            }).then(() => {
                this.$axios.get2("/afbase/cssIncomeWriteoff/getVoucherDate", {
                    incomeWriteoffId: this.frow.incomeWriteoffId
                }).then(function(response) {
                    if(response.data.data && response.data.data.voucherDate){
                        this.$confirm('当前核销单已制作凭证, 是否继续?', '提示', {
                            confirmButtonText: '是',
                            cancelButtonText: '否',
                            type: 'warning'
                        }).then(() => {

                            this.form2.incomeWriteoffId = row.incomeWriteoffId;
                            this.form2.statementId = row.statementId;
                            this.form2.currency = row.currency;
                            this.form2.businessScope = row.businessScope;
                            this.$axios.post2('/afbase/cssIncomeWriteoff/doDeleteListWriteoff', this.form2)
                                .then(function(response) {
                                    if (response.data.code == 0) {
                                        this.openSuccess();
                                        this.queryList();
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
                    }else{
                        this.form2.incomeWriteoffId = row.incomeWriteoffId;
                        this.form2.statementId = row.statementId;
                        this.form2.currency = row.currency;
                        this.form2.businessScope = row.businessScope;
                        this.$axios.post2('/afbase/cssIncomeWriteoff/doDeleteListWriteoff', this.form2)
                            .then(function(response) {
                                if (response.data.code == 0) {
                                    this.openSuccess();
                                    this.queryList();
                                } else {
                                    this.openError(response.data.messageInfo);
                                }
                            }.bind(this));
                    }
                }.bind(this));

            }).catch(() => {
            });
        }

			},
			queryList() {
				this.query.columnStrs = '';
				this.setHeight();
        //从数据库查询设置信息
        let pageName = '财务结算管理/收入对账/核销单';
        this.$axios.get2("/hrs/user/getUserPageSet?pageName=" + pageName)
            .then(function(response) {
                let af_debit_note_writeoff_column = response.data.data;
                if(af_debit_note_writeoff_column && af_debit_note_writeoff_column.length>0){
                    this.tableColumns = this.sortBykey(af_debit_note_writeoff_column, 'index');
                }else{
                    this.tableColumns = this.sortBykey(columns.info, 'index');
                }
                this.loading = true
                this.$axios.get2('/afbase/cssIncomeWriteoff/page2?size=' + this.pageConf.pageSize + '&current=' + this.pageConf.pageCode, this.query).then((response) => {
                    this.data = response.data.data.records;
                    this.pageConf.totalPage = response.data.data.total;
                    if (this.data.length == 0) {
                        let current = Math.ceil(this.pageConf.totalPage / this.pageConf.pageSize);
                        this.queryList2(current);
                    } else {
                        this.getTotal();
                    }
                    this.loading = false
                }).catch((error) => {
                    this.loading = false
                    console.log(error);
                });
            }.bind(this));

/*				this.loading = true;
				let userId = window.localStorage.getItem('userId');
				let list_column = window.localStorage.getItem(userId + '_af_debit_note_writeoff_column');
				if (list_column) {
					let arrayC = JSON.parse(list_column)
					if (arrayC && arrayC.length > 0) {
						this.tableColumns = this.sortBykey(arrayC, 'index');
					}
				} else {
					this.tableColumns = this.sortBykey(columns.info, 'index');
				}
				this.$axios.get2('/afbase/cssIncomeWriteoff/page2?size=' + this.pageConf.pageSize + '&current=' + this.pageConf.pageCode, this.query).then((response) => {
					this.data = response.data.data.records;
					this.pageConf.totalPage = response.data.data.total;
					if (this.data.length == 0) {
						let current = Math.ceil(this.pageConf.totalPage / this.pageConf.pageSize);
						this.queryList2(current);
					} else {
						this.getTotal();
					}
					this.loading = false
				}).catch((error) => {
					this.loading = false
					console.log(error);
				});*/

			},
			queryList2(current) {
				this.$axios.get2('/afbase/cssIncomeWriteoff/page2?size=' + this.pageConf.pageSize + '&current=' + current, this.query).then((response) => {
					this.data = response.data.data.records;
					this.pageConf.totalPage = response.data.data.total;
					if (this.data.length > 0) {
						this.getTotal();
					}
					this.loading = false
				}).catch((error) => {
					this.loading = false
					console.log(error);
				});
			},
			getTotal() {
				this.$axios.get2("/afbase/cssIncomeWriteoff/getTatol", this.query)
					.then(function(response) {
						if (this.data[this.data.length - 1].writeoffNum != '合计') { //避免当不在第一页的时候切换每页记录数时合计会有多个
							this.data = this.data.concat(response.data.data);
						}
						// this.getSummaries();
					}.bind(this));
			},
			exportExcel() {
				this.$confirm('是否根据结果字段导出数据？', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning',
					center: true
				}).then(() => {
          //从数据库查询设置信息
          let pageName = '财务结算管理/收入对账/核销单';
          this.$axios.get2("/hrs/user/getUserPageSet?pageName=" + pageName)
              .then(function(response) {
                  let af_debit_note_writeoff_column = response.data.data;
                  if(af_debit_note_writeoff_column && af_debit_note_writeoff_column.length>0){
                      this.query.columnStrs = JSON.stringify(af_debit_note_writeoff_column);
                  }else{
                      this.query.columnStrs = '';
                  }
                  this.exportExcelSure();
              }.bind(this));
					/*let userId = window.localStorage.getItem('userId');
					let list_column = window.localStorage.getItem(userId + '_af_debit_note_writeoff_column');
					if (list_column) {
						this.query.columnStrs = list_column;
					} else {
						this.query.columnStrs = '';
					}
					this.exportExcelSure();*/
				}).catch(() => {
					this.query.columnStrs = '';
					this.exportExcelSure();
				});
			},
			exportExcelSure() {
				this.$axios.post3('/afbase/cssIncomeWriteoff/exportExcelList', this.query)
					.then(function(response) {
						var blob = new Blob([response.data], {
							type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8'
						});
						var downloadElement = document.createElement('a');
						var href = window.URL.createObjectURL(blob); // 创建下载的链接
						downloadElement.href = href;
						downloadElement.download = '收入对账核销单列表' + '.xls'; // 下载后文件名
						document.body.appendChild(downloadElement);
						downloadElement.click(); // 点击下载
						document.body.removeChild(downloadElement); // 下载完成移除元素
						window.URL.revokeObjectURL(href); // 释放掉blob对象
					}.bind(this));
			},
			//pageSize改变时触发的函数
			handleSizeChange() {
				this.queryList();
			},
			//当前页改变时触发的函数
			handleCurrentChange() {
				this.queryList();
			},
			floatMountFormat(row, column) {
				if (row[column.property] === 0) {
					return '0.00'
				} else if (row[column.property] == null || row[column.property] == '') {
					return ''
				} else {
					return this.milliFormat(row[column.property].toString())
				}
			},
			milliFormat(s) { //添加千位符
				s = s.replace(/^(\d*)$/, "$1.")
				s = (s + "00").replace(/(\d*\.\d\d)\d*/, "$1")
				s = s.replace(".", ",")
				let re = /(\d)(\d{3},)/
				while (re.test(s)) {
					s = s.replace(re, "$1,$2")
				}
				s = s.replace(/,(\d\d)$/, ".$1")
				return s.replace(/^\./, "0.")
			},
			changeCustomerId() {
				if (this.query.customerName == null || this.query.customerName === '') {
					this.query.customerId = null
				}
			},
			arraySpanMethod({
				row,
				column,
				rowIndex,
				columnIndex
			}) {
				if (row.isParent === true) {
					if (columnIndex === 1) {
						return [1, 12]
					} else if (columnIndex === 0) {
						return [1, 1]
					} else {
						return [0, 0]
					}
				}
			},
			changeAllCheck(selection) {
				this.data.forEach((row) => {
					if (selection) {
						row.checkBox = true
					} else {
						row.checkBox = false
					}
					this.changeRowCheck(row)
				})
			},
			changeRowCheck(row) {
				if (row.isParent) {
					row.children.forEach((child) => {
						if (row.checkBox) {
							child.checkBox = true
						} else {
							child.checkBox = false
						}
					})
				}
				this.fillSelectionData()
			},
			formatter1(row, column) {
				if (row.writeoffDate) {
					return row.writeoffDate.substr(0, 10);
				}

			},
			formatterNumber5(row, column) {
				if (row.writeoffNum == '合计') {
					return '';
				} else {
					return row.writeoffNum;
				}
			},
			formatterNumber6(row, column) {
				if (row.functionalAmount === '' || row.functionalAmount === 'null' || row.functionalAmount == null) {
					return "";
				} else {
					return this.getNumber(row.functionalAmount);
				}
			},
			formatterNumber7(row, column) {
				if (row.amountWriteoff === '' || row.amountWriteoff === 'null' || row.amountWriteoff == null) {
					return "";
				} else {
					return this.getNumber(row.amountWriteoff);
				}
			},
			formatterNumber8(row, column) {
				if (row.functionalAmountWriteoff === '' || row.functionalAmountWriteoff === 'null' || row.functionalAmountWriteoff == null) {
					return "";
				} else {
					return this.getNumber(row.functionalAmountWriteoff);
				}
			},
			formatter_creatorName(row, column) {
				if (row.creatorName) {
					return row.creatorName.split(' ')[0];
				}
			},
			formatterNumber9(row, column) {
				if (row.functionalAmountWriteoff === '' || row.functionalAmountWriteoff === 'null' || row.functionalAmountWriteoff == null) {
					return "";
				} else if (row.functionalAmount === '' || row.functionalAmount === 'null' || row.functionalAmount == null) {
					return "";
				} else {
					let numW = row.functionalAmount - row.functionalAmountWriteoff
					if (numW > 0) {
						return this.getNumber(numW);
					} else {
						return "";
					}
				}
			},
			getNumber(data) {
				return data.toFixed(2).replace(/\d{1,3}(?=(\d{3})+(\.\d*)?$)/g, '$&,');
			},
			getDateTime(theDate) {
				// theDate.setDate(theDate.getDate()-30);
				var _year = theDate.getFullYear();
				var _month = theDate.getMonth();
				var _date = theDate.getDate();
				// _month = _month + 1;
				if (_month < 10) {
					_month = "0" + _month;
				}
				if (_date < 10) {
					_date = "0" + _date;
				}
				return _year + "-" + _month + "-01 00:00:00";
				// return _year + "-" + _month + "-" + _date;
			},
			fillSelectionData() {
				let arr = []
				this.data.forEach((row) => {
					arr = arr.concat(row.children.filter(item => item.checkBox))
				})
				this.selectionData = arr
			}
		}
	}
</script>
<style scoped="scoped">

</style>
