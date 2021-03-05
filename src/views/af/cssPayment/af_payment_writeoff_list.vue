<template>
	<div class="warp-main">
		<el-form :model="query" label-width="10px" class="paymentWriteoffListPage">
			<el-row>
				<el-col class="elementWidth">
					<el-form-item>
						<el-input style="width:155px;">
							<template slot="prepend">业务范畴</template>
							<el-select slot="suffix" v-model="query.businessScope" placeholder="请选择" style="width:86px;margin-right: -5px;">
								<el-option v-for="item in businessCodes" :key="item.paramRanking" :label="item.paramText" :value="item.paramText">
								</el-option>
							</el-select>
						</el-input>
					</el-form-item>
				</el-col>
				<el-col class="elementWidth">
					<el-form-item>
						<el-input v-model="query.customerName" clearable auto-complete="off" clearable style="width:245px;">
							<template slot="prepend">供&nbsp;&nbsp;&nbsp;&nbsp;应&nbsp;&nbsp;&nbsp;商</template>
						</el-input>
					</el-form-item>
				</el-col>
				<el-col class="elementWidth">
					<el-form-item>
						<el-input style="width: 245px;" v-model="query.awbNumberOrOrderCode" clearable auto-complete="off">
							<template v-if="query.businessScope!='LC'" slot="prepend">主单/订单号</template>
              <template v-if="query.businessScope=='LC'" slot="prepend">订单号</template>
						</el-input>
					</el-form-item>
				</el-col>
				<el-col class="elementWidth">
					<el-form-item>
						<el-input style="width:219px;">
							<template slot="prepend">核&nbsp;销&nbsp;&nbsp;日&nbsp;期</template>
							<el-date-picker slot="suffix" v-model="query.writeoffDateStart" clearable type="date" value-format="yyyy-MM-dd" placeholder="开始日期" style="width: 135px;margin-right: -5px;">
							</el-date-picker>
						</el-input>
						<span>-</span>
						<el-date-picker v-model="query.writeoffDateEnd" clearable type="date" value-format="yyyy-MM-dd" placeholder="结束日期" style="width: 135px;">
						</el-date-picker>
					</el-form-item>
				</el-col>
				<el-col class="elementWidth">
					<el-form-item label-width="20px">
						<el-button type="text" size="mini" v-if=showFlag v-on:click="showFlag=false">收起</el-button>
						<el-button type="text" size="mini" v-if=!showFlag v-on:click="showFlag=true">展开</el-button>
						<el-button style="padding: 9px 7px;margin-left: 0px;" type="primary" size="small" @click="queryList">查询</el-button>
					</el-form-item>
				</el-col>
			</el-row>
			<el-row v-show="showFlag">
				<el-col class="elementWidth">
					<el-form-item>
						<el-input style="width:155px;">
							<template slot="prepend">币&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;种</template>
							<el-select slot="suffix" v-model="query.currency" placeholder="请选择" style="width:86px;margin-right: -5px;">
								<el-option v-for="item in currencys" :key="item.currencyCode" :label="item.currencyCode" :value="item.currencyCode">
								</el-option>
							</el-select>
						</el-input>
					</el-form-item>
				</el-col>
				<el-col class="elementWidth">
					<el-form-item>
						<el-input style="width: 245px;" v-model="query.writeoffNum" clearable auto-complete="off">
							<template slot="prepend">核&nbsp;销&nbsp;单&nbsp;号</template>
						</el-input>
					</el-form-item>
				</el-col>
				<el-col class="elementWidth">
					<el-form-item>
						<el-input style="width: 245px;" v-model="query.paymentNum" clearable auto-complete="off">
							<template slot="prepend">对账单编号&nbsp;</template>
						</el-input>
					</el-form-item>
				</el-col>
				<el-col class="elementWidth">
					<el-form-item>
						<el-input style="width: 366px;" v-model="query.creatorName" clearable auto-complete="off">
							<template slot="prepend">核&nbsp;&nbsp;&nbsp;销&nbsp;&nbsp;&nbsp;人&nbsp;</template>
						</el-input>
					</el-form-item>
				</el-col>
        <el-col class="elementWidth">
          <el-form-item label-width="33px">
            <el-button style="margin-left: 17px;padding-left: 8px;padding-right: 8px;background-color:#FFF;color:#409EFF" type="primary" size="small" v-on:click="setting">设置</el-button>
            <el-button style="margin-left: 7px;padding-left: 8px;padding-right: 8px;background-color:#FFF;color:#409EFF" type="primary" size="small" v-on:click="exportExcel">导出</el-button>
          </el-form-item>
        </el-col>
			</el-row>
		</el-form>
		<div>
			<el-table v-loading="loading" stripe :data="data" border :cell-class-name="addPullRightClass" :cell-style="addCellStayle" @header-dragend="cellWidth">
				<el-table-column fixed type="index" align="center" label="操作" width="60">
					<template slot-scope="scope">
						<el-dropdown v-if="scope.row.writeoffDate!=null" trigger="click" @command="handleCommand" @visible-change="handleChange(scope.row)">
							<i class="el-icon-s-operation"></i>
							<el-dropdown-menu slot="dropdown">
								<el-dropdown-item command="view">查看</el-dropdown-item>
								<el-dropdown-item command="delete">删除</el-dropdown-item>
							</el-dropdown-menu>
						</el-dropdown>
						<span v-else>合计</span>
					</template>
				</el-table-column>

        <template v-for="(item,index) in tableColumns">
          <el-table-column v-if="item.label=='核销日期'" :key="index" :prop="item.prop" :label="item.label" :width="item.width" :align="item.align" :sortable="item.sortable"></el-table-column>
          <el-table-column v-if="item.label=='核销单号'" :key="index" :prop="item.prop" :label="item.label" :width="item.width" :align="item.align" :sortable="item.sortable">
            <template slot-scope="scope">
              <a href="javascript:void(0)" @click="showView2(scope.row)" style="color: #137DFA;text-decoration: underline;">{{scope.row.writeoffNum}}</a>
            </template>
          </el-table-column>
          <el-table-column v-if="item.label=='供应商'" :key="index" :prop="item.prop" :label="item.label" :width="item.width" :align="item.align" :sortable="item.sortable" header-align="center"></el-table-column>
          <el-table-column v-if="item.label=='对账单编号'" :key="index" :prop="item.prop" :label="item.label" :width="item.width" :align="item.align" :sortable="item.sortable"></el-table-column>
          <el-table-column v-if="item.label=='对账单金额'" :key="index" :prop="item.prop" :label="item.label" :width="item.width" :align="item.align" :sortable="item.sortable" header-align="center">
            <template slot-scope="scope">
              <span v-if="scope.row.writeoffDate!=null">
                 <p style="color: red;" v-if="scope.row.amountPaymentStr.indexOf('CNY')==-1">{{scope.row.amountPaymentStr}}</p>
                 <p v-else>{{scope.row.amountPaymentStr}}</p>
              </span>
            </template>
          </el-table-column>
          <el-table-column v-if="item.label=='本次核销金额'" :key="index" :prop="item.prop" :label="item.label" :width="item.width" :align="item.align" :sortable="item.sortable" header-align="center">
            <template slot-scope="scope">
              <span v-if="scope.row.writeoffDate!=null">
                <p style="color: red;" v-if="scope.row.amountWriteoffStr.indexOf('CNY')==-1">{{scope.row.amountWriteoffStr}}</p>
                  <p v-else>{{scope.row.amountWriteoffStr}}</p>
              </span>
              <span v-else v-for="(item,index) in scope.row.amountWriteoffStr.split('|')" :key="index">
                  <p style="color: red;" v-if="item.indexOf('CNY')==-1">{{item}}</p>
                  <p v-else>{{item}}</p>
                </span>
            </template>
          </el-table-column>
          <el-table-column v-if="item.label=='核销人'" :key="index" :prop="item.prop" :label="item.label" :width="item.width" :align="item.align" :sortable="item.sortable">
            <template slot-scope="scope">
              <span v-if="scope.row.creatorName!=null">{{scope.row.creatorName.substring(0,scope.row.creatorName.indexOf(' '))}}</span>
            </template>
          </el-table-column>
          <el-table-column v-if="item.label=='核销时间'" :key="index" :prop="item.prop" :label="item.label" :width="item.width" :align="item.align" :sortable="item.sortable"></el-table-column>
          <el-table-column v-if="item.label=='科目代码'" :key="index" :prop="item.prop" :label="item.label" :width="item.width" :align="item.align" :sortable="item.sortable"></el-table-column>
          <el-table-column v-if="item.label=='科目名称'" :key="index" :prop="item.prop" :label="item.label" :width="item.width" :align="item.align" :sortable="item.sortable"></el-table-column>
        </template>
	<!--			<el-table-column align="center" prop="writeoffNum" width="160" label="核销单号">
					<template slot-scope="scope">
			          <a href="javascript:void(0)" @click="showView2(scope.row)" style="color: #137DFA;text-decoration: underline;">{{scope.row.writeoffNum}}</a>
			        </template>
				</el-table-column>
				<el-table-column fixed align="center" prop="writeoffDate" label="核销日期" width="120"></el-table-column>
				<el-table-column header-align="center" align="left" prop="customerName" width="280" label="供应商"></el-table-column>
				<el-table-column align="center" prop="paymentNum" width="160" label="对账单编号"></el-table-column>
				<el-table-column header-align="center" align="right" label="对账单金额" width="170">
					<template slot-scope="scope">
						<span v-if="scope.row.writeoffDate!=null">
						   <p style="color: red;" v-if="scope.row.amountPaymentStr.indexOf('CNY')==-1">{{scope.row.amountPaymentStr}}</p>
						   <p v-else>{{scope.row.amountPaymentStr}}</p>
						</span>
					</template>
				</el-table-column>
				<el-table-column header-align="center" align="right" width="170" label="本次核销金额">
					<template slot-scope="scope">
						<span v-if="scope.row.writeoffDate!=null">
							<p style="color: red;" v-if="scope.row.amountWriteoffStr.indexOf('CNY')==-1">{{scope.row.amountWriteoffStr}}</p>
						    <p v-else>{{scope.row.amountWriteoffStr}}</p>
						</span>
						<span v-else v-for="(item,index) in scope.row.amountWriteoffStr.split('|')" :key="index">
						    <p style="color: red;" v-if="item.indexOf('CNY')==-1">{{item}}</p>
						    <p v-else>{{item}}</p>
					    </span>
					</template>
				</el-table-column>
				<el-table-column align="center" label="核销人" width="250">
					<template slot-scope="scope">
						<span v-if="scope.row.creatorName!=null">{{scope.row.creatorName.substring(0,scope.row.creatorName.indexOf(' '))}}</span>
					</template>
				</el-table-column>
				<el-table-column align="center" prop="createTime" label="核销时间" width="150"></el-table-column>-->
			</el-table>
		</div>
		<div>
			<el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="pageConf.pageCode" :page-sizes="pageConf.pageOption" :page-size.sync="pageConf.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="pageConf.totalPage">
			</el-pagination>
		</div>
		<viewdetail ref="addMission" v-if="viewVisible" :visible.sync="viewVisible" :frow="frow"></viewdetail>
    <setVisibleTag ref="addMission" v-if="setVisible" :visible.sync="setVisible"></setVisibleTag>
	</div>
</template>
<script>
  import setVisibleVue from './writeoff/af_writeoff_setting'
  import columns from './writeoff/af_wirteoff_column'
	import View from './writeoff/af_writeoff_view'
	export default {
		data() {
			return {
				loading: false,
				data: [],
        tableColumns: [],
				pageConf: {
					//设置一些初始值(会被覆盖)
					pageCode: 1, //当前页
					pageSize: 10, //每页显示的记录数
					totalPage: 0, //总记录数
					pageOption: [10, 50, 100]
				},
				viewVisible: false,
				frow: {},
				query: {
					businessScope: 'AE',
					currency: '',
					customerName: '',
					writeoffDateStart: this.getDateTime(),
					writeoffDateEnd: '',
					paymentNum: '',
					writeoffNum: '',
					awbNumberOrOrderCode: '',
					creatorName: ''
				},
				businessCodes: [],
				currencys: [],
				showFlag: false,
        setVisible: false,
			}
		},
		created: function() {
			//查询业务范畴
			this.$axios.get2('/afbase/category/paramsNew', {
				categoryName: "业务范畴"
			}).then(function(response) {
				this.businessCodes = response.data.data;
			}.bind(this)).catch(function(error) {
				console.log(error);
			})
			//查询币种
			this.$axios.get('/afbase/currency').then(function(response) {
				this.currencys = response.data.data;
			}.bind(this)).catch(function(error) {
				console.log(error);
			})
      //从数据库查询设置信息
      let pageName = '财务结算管理/成本对账/核销单';
      this.$axios.get2("/hrs/user/getUserPageSet?pageName=" + pageName)
          .then(function(response) {
              let af_list_column = response.data.data;
              if(af_list_column && af_list_column.length>0){
                  if (af_list_column && af_list_column.length > 0) {
                      this.tableColumns = this.sortBykey(af_list_column, 'index');
                  }
              }else{
                  this.tableColumns = this.sortBykey(columns.afWriteoffInfo, 'index');
              }
          }.bind(this));
		},
		provide() {
			return {
				queryList: this.queryList
			}
		},
		components: {
      'setVisibleTag': setVisibleVue,
			'viewdetail': View
		},
		methods: {
      setting() {
          this.setVisible = true;
      },
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
              localStorage.setItem(userId + '_af_writeoff_list_column_width', JSON.stringify(arrayC))
          }
      },
      //标题样式
      addPullRightClass({
                            row,
                            column,
                            rowIndex,
                            columnIndex
                        }) {

      },
      //标题 stly
      addCellStayle(data) {
          if (data.column.property === "incomeAmountStr") {
              let k = '';
              if (data.row.incomeAmountStr.indexOf('CNY')==-1) {
                  k = "color:red;"
              } else {
                  k = "color:#606266;"
              }
              return k;
          } else {
              return "";
          }
      },
      sortBykey(ary, key) {
          return ary.sort(function(a, b) {
              let x = a[key]
              let y = b[key]
              return ((x < y) ? -1 : (x > y) ? 1 : 0)
          })
      },
			handleCommand(command) {
				if(command == 'view') {
					this.showView()
				} else if(command == 'delete') {
					this.doDelete()
				}
			},
			handleChange(command) {
				this.frow = command
			},
			showPrint() {
				this.printVisible = true;
			},
			showView() {
				this.viewVisible = true;
			},
			showView2(row) {
				this.frow = row
				this.viewVisible = true;
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
					message: info,
					type: 'success',
					position: 'bottom-right'
				});
			},
			doDelete() {
          this.$confirm('您将删除' + this.frow.writeoffNum + '核销单,此操作不可恢复 , 是否继续?', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning',
              center: true
          }).then(() => {
              this.$axios.get2("/afbase/cssCostWriteoff/getVoucherDate", {
                  costWriteoffId: this.frow.costWriteoffId
              }).then(function(response) {
                  if(response.data.data && response.data.data.voucherDate){
                      this.$confirm('当前核销单已制作凭证, 是否继续?', '提示', {
                          confirmButtonText: '是',
                          cancelButtonText: '否',
                          type: 'warning'
                      }).then(() => {
                          this.$axios.deletes('/afbase/cssCostWriteoff/' + this.frow.costWriteoffId).then((response) => {
                              if(response.data.code == '0') {
                                  this.openSuccess("删除成功！")
                                  this.queryList();
                              } else {
                                  this.openError("删除失败：" + response.data.messageInfo)
                              }
                          }).catch((error) => {
                              this.openError("删除失败：" + error.response.data.messageInfo)
                          });
                      }).catch(() => {
                          this.$message({
                              type: 'info',
                              message: '已取消删除'
                          });
                      });
                  }else{
                      this.$axios.deletes('/afbase/cssCostWriteoff/' + this.frow.costWriteoffId).then((response) => {
                          if(response.data.code == '0') {
                              this.openSuccess("删除成功！")
                              this.queryList();
                          } else {
                              this.openError("删除失败：" + response.data.messageInfo)
                          }
                      }).catch((error) => {
                          this.openError("删除失败：" + error.response.data.messageInfo)
                      });
                  }
              }.bind(this));

          }).catch(() => {
              this.$message({
                  type: 'info',
                  message: '已取消删除'
              });
          });

			},

			queryList() {
        //从数据库查询设置信息
        let pageName = '财务结算管理/成本对账/核销单';
        this.$axios.get2("/hrs/user/getUserPageSet?pageName=" + pageName)
            .then(function(response) {
                let af_list_column = response.data.data;
                if(af_list_column && af_list_column.length>0){
                    this.tableColumns = this.sortBykey(af_list_column, 'index');
                }else{
                    this.tableColumns = this.sortBykey(columns.afWriteoffInfo, 'index');
                }
                this.loading = true
                this.$axios.get2('/afbase/cssCostWriteoff?size=' + this.pageConf.pageSize + '&current=' + this.pageConf.pageCode, this.query).then((response) => {
                    this.data = response.data.data.records;
                    this.pageConf.totalPage = response.data.data.total;
                    if(this.data.length == 0) {
                        let current = Math.ceil(this.pageConf.totalPage / this.pageConf.pageSize);
                        this.queryList2(current);
                    } else {
                        this.loading = false
                    }
                }).catch((error) => {
                    this.loading = false
                    console.log(error);
                });
            }.bind(this));
			},
			queryList2(current) {
				this.$axios.get2('/afbase/cssCostWriteoff?size=' + this.pageConf.pageSize + '&current=' + current, this.query).then((response) => {
					this.data = response.data.data.records;
					this.pageConf.totalPage = response.data.data.total;
					this.loading = false
				}).catch((error) => {
					this.loading = false
					console.log(error);
				});
			},
      exportExcel() {
          this.$confirm('是否根据结果字段导出数据？', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning',
              center: true
          }).then(() => {
              this.query.columnStrs = JSON.stringify(this.tableColumns)
              this.exportExcelSure()
          }).catch(() => {
              let excelList = this.sortBykey(columns.afWriteoffInfo, 'index')
              this.query.columnStrs = JSON.stringify(excelList)
              this.exportExcelSure();
          });
      },
      exportExcelSure() {
          this.$axios.post3('/afbase/cssCostWriteoff/exportWriteoffExcel', this.query)
              .then(function(response) {
                  var blob = new Blob([response.data], {
                      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8'
                  });
                  var downloadElement = document.createElement('a');
                  var href = window.URL.createObjectURL(blob); // 创建下载的链接
                  downloadElement.href = href;
                  downloadElement.download = '成本对账核销单' + '.xls'; // 下载后文件名
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
			milliFormat(s) { //添加千位符
				s = s.replace(/^(\d*)$/, "$1.")
				s = (s + "00").replace(/(\d*\.\d\d)\d*/, "$1")
				s = s.replace(".", ",")
				let re = /(\d)(\d{3},)/
				while(re.test(s)) {
					s = s.replace(re, "$1,$2")
				}
				s = s.replace(/,(\d\d)$/, ".$1")
				return s.replace(/^\./, "0.")
			},
			getSummaries(param) {
				console.log(param)
				const {
					columns,
					data
				} = param;
				const sums = [];
				columns.forEach((column, index) => {
					if(index === 0) {
						sums[index] = '合计';
						return;
					}
					if(column.property == 'amountPaymentStr' || column.property == 'amountWriteoffStr') {
						let map = {}
						data.forEach(row => {
							if(row[column.property.replace("Str", "")] != null) {
								if(map[row.currency] == null) {
									map[row.currency] = row[column.property.replace("Str", "")]
								} else {
									map[row.currency] += row[column.property.replace("Str", "")]
								}
							}
						})
						for(let key in map) {
							if(sums[index] == null) {
								sums[index] = this.getNumber(map[key]) + ' (' + key + ')'
							} else {
								sums[index] += '\n' + this.getNumber(map[key]) + ' (' + key + ')'
							}
						}
					} else {
						sums[index] = ''
					}
				});

				return sums;
			},
			getNumber(data) {
				return data.toFixed(2).replace(/\d{1,3}(?=(\d{3})+(\.\d*)?$)/g, '$&,');
			},
			getDateTime() {
				let theDate = new Date()
				let _year = theDate.getFullYear();
				let _month = theDate.getMonth();
				let _date = theDate.getDate();
        if (_month === 0) {
            _year = parseInt(_year) - 1;
            _month = 12;
        }
				if (_month < 10) {
					_month = "0" + _month;
				}
				if (_date < 10) {
					_date = "0" + _date;
				}
				return _year + "-" + _month + "-01";
			}
		}
	}
</script>
<style>
	.paymentWriteoffListPage .el-input__icon {
		line-height: 30px !important;
	}

	.paymentWriteoffListPage .el-form-item__content {
		line-height: 30px !important;
	}

	.paymentWriteoffListPage .el-input-group__prepend {
		padding: 0 6px;
	}
	.el-table .cell {
		white-space: pre-line !important;
		/*保留换行符*/
	}
</style>
