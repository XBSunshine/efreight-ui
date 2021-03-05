<template>
	<div class="warp-main">
		<el-form :inline="false" :model="query" label-width="80px" class="css_workload">
			<div ref="css_workload_header">
				<el-row>
					<el-col class="elementWidth">
						<el-form-item label-width="10px">
							<el-input style="width:134px;">
								<template slot="prepend">业务范畴</template>
								<el-select slot="suffix" v-model="query.businessScope" style="width: 65px;margin-right: -5px;" @change="changeBusinessScope">
									<el-option v-for="item in businessCodes" :key="item.paramRanking" :label="item.paramText" :value="item.paramText">
									</el-option>
								</el-select>
							</el-input>
						</el-form-item>
					</el-col>
					<el-col class="elementWidth">
						<el-form-item label-width="10px">
							<el-input style="width:209px;">
								<template slot="prepend">{{flightDateName}}</template>
								<el-date-picker slot="suffix" style="width: 140px;margin-right: -5px;" v-model="query.flightDateStart" type="date" value-format="yyyy-MM-dd" placeholder="开始">
								</el-date-picker>
							</el-input>
							<span>-</span>
							<el-date-picker style="width: 140px;" v-model="query.flightDateEnd" type="date" value-format="yyyy-MM-dd" placeholder="结束">
							</el-date-picker>
						</el-form-item>
					</el-col>
					<el-col class="elementWidth">
						<el-form-item label-width="10px">
							<el-input style="width:174px;">
								<template slot="prepend">财务锁账</template>
								<el-select slot="suffix" v-model="query.orderStatus" placeholder="请选择" clearable style="width: 105px;margin-right: -5px;">
									<el-option label="已锁账" value="已锁账">
									</el-option>
									<el-option label="未锁账" value="未锁账">
									</el-option>
								</el-select>
							</el-input>
						</el-form-item>
					</el-col>
					<el-col class="elementWidth">
						<el-form-item label-width="10px">
							<el-input style="width:174px;">
								<template slot="prepend">报表分类</template>
								<el-select slot="suffix" v-model="query.workloadType" placeholder="请选择" style="width: 105px;margin-right: -5px;">
									<el-option label="责任销售" value="责任销售">
									</el-option>
									<el-option label="责任客服" value="责任客服">
									</el-option>
									<el-option label="责任操作" value="责任操作">
									</el-option>
                  <el-option label="责任航线" value="责任航线" v-if="this.query.businessScope === 'AE'">
                  </el-option>
								</el-select>
							</el-input>
						</el-form-item>
					</el-col>

					<el-col class="elementWidth">
						<el-form-item label-width="10px">
							<el-input style="width:174px;">
								<template slot="prepend">部门</template>
								<el-select slot="suffix" clearable v-model="query.dept" placeholder="请选择" style="width: 133px;margin-right: -5px;">
									<el-option v-for="item in deptoptions" :key="item.value" :label="item.label" :value="item.value">
									</el-option>
								</el-select>
							</el-input>
						</el-form-item>
					</el-col>

					<el-col class="elementWidth">
						<el-form-item label-width="10px">
							<el-button type="primary" size="small" @click="queryList" style="margin-left: 2px;padding-left: 8px;padding-right: 8px;">查询</el-button>
							<el-button style="margin-left: 4px;padding-left: 8px;padding-right: 8px;background-color:#FFF;color:#409EFF" type="primary" size="small" v-on:click="setting">设置</el-button>
							<el-button style="margin-left: 3px;padding-left: 8px;padding-right: 8px;background-color:#FFF;color:#409EFF" type="primary" size="small" v-on:click="exportExcel">导出</el-button>
						</el-form-item>
					</el-col>
				</el-row>

				</el-row>
			</div>
		</el-form>
		<el-table v-loading="loading" :max-height="tableHeight" stripe :data="data" @cell-click="handlerCellClick" border :cell-class-name="addPullRightClass" :cell-style="addCellStayle" @header-dragend="cellWidth">
			<el-table-column align="center" label="序号" width="60">
				<template slot-scope="scope">
					<span>{{scope.$index+1}}</span>
				</template>
			</el-table-column>
			<template v-for="(item,index) in tableColumns">
				<el-table-column v-if="item.label=='人员姓名'" :key="index" :prop="item.prop" :label="item.label" :width="item.width" :align="item.align" :sortable="item.sortable" header-align="center">
					<template slot-scope="scope">
						<a href="javascript:void(0)" @click="cellClick(scope.row)" style="color: #137DFA;text-decoration: underline;">{{scope.row.userName}}</a>
					</template>
				</el-table-column>
				<el-table-column v-if="item.label=='部门'" :key="index" :prop="item.prop" :label="item.label" :width="item.width" :align="item.align" :sortable="item.sortable" header-align="center"></el-table-column>
				<el-table-column v-if="item.label=='票数'" :key="index" :prop="item.prop" :label="item.label" :width="item.width" :align="item.align" :sortable="item.sortable"></el-table-column>
				<el-table-column v-if="item.label=='件数'" :key="index" :prop="item.prop" :label="item.label" :width="item.width" :align="item.align" :sortable="item.sortable" :sort-method="sortPieces"></el-table-column>
				<el-table-column v-if="item.label=='毛重'" :key="index" :prop="item.prop" :label="item.label" :width="item.width" :align="item.align" :sortable="item.sortable" :sort-method="sortWeight"></el-table-column>
				<el-table-column v-if="item.label=='体积'" :key="index" :prop="item.prop" :label="item.label" :width="item.width" :align="item.align" :sortable="item.sortable" :sort-method="sortVolume"></el-table-column>
				<el-table-column v-if="item.label=='计费重量'" :key="index" :prop="item.prop" :label="item.label" :width="item.width" :align="item.align" :sortable="item.sortable" :sort-method="sortChargeWeight"></el-table-column>
				<el-table-column v-if="item.label=='计费吨'" :key="index" :prop="item.prop" :label="item.label" :width="item.width" :align="item.align" :sortable="item.sortable" :sort-method="sortChargeWeight"></el-table-column>
				<el-table-column v-if="item.label=='标箱量' && containerNumberFlag" :key="index" :prop="item.prop" :label="item.label" :width="item.width" :align="item.align" :sortable="item.sortable" :sort-method="sortContainerNumber"></el-table-column>
        <el-table-column v-if="item.label=='收入'" :key="index" :prop="item.prop" :label="item.label" :width="item.width" :align="item.align" :sortable="item.sortable">
          <template slot-scope="scope">
            <span v-if="scope.row.incomeFunctionalAmount.indexOf('-')>-1" style="color: red;">{{scope.row.incomeFunctionalAmount}}</span>
            <span v-else>{{scope.row.incomeFunctionalAmount}}</span>
          </template>
        </el-table-column>
        <el-table-column v-if="item.label=='成本'" :key="index" :prop="item.prop" :label="item.label" :width="item.width" :align="item.align" :sortable="item.sortable">
          <template slot-scope="scope">
            <span v-if="scope.row.costFunctionalAmount.indexOf('-')>-1" style="color: red;">{{scope.row.costFunctionalAmount}}</span>
            <span v-else>{{scope.row.costFunctionalAmount}}</span>
          </template>
        </el-table-column>
        <el-table-column v-if="item.label=='毛利'" :key="index" :prop="item.prop" :label="item.label" :width="item.width" :align="item.align" :sortable="item.sortable">
          <template slot-scope="scope">
            <span v-if="scope.row.grossProfit.indexOf('-')>-1" style="color: red;">{{scope.row.grossProfit}}</span>
            <span v-else>{{scope.row.grossProfit}}</span>
          </template>
        </el-table-column>
			</template>
		</el-table>
		<detail ref="addMission" v-if="detailVisible" :visible.sync="detailVisible" :frow="frow"></detail>
		<setVisibleTag ref="addMission" v-if="setVisible" :visible.sync="setVisible" :frow="frow"></setVisibleTag>
	</div>
</template>
<script>
	import Detail from './cssWorkload/css_workload_detail'
	import columns from './cssWorkload/css_workload_column.json'
	import setVisibleVue from './cssWorkload/css_workload_setting'
	export default {
		data() {
			return {
				tableHeight: "750px",
				loading: false,
				showFlag: false,
				containerNumberFlag: false,
				data: [],
        frow: {},
				tableColumns: [],
				pageConf: {
					//设置一些初始值(会被覆盖)
					pageCode: 1, //当前页
					pageSize: 10, //每页显示的记录数
					totalPage: 0, //总记录数
					pageOption: [10, 50, 100]
				},
				businessCodes: [],
				deptoptions: [],
				chargeWeightName: '计费重量',
				flightDateName: '开航日期',
				businessScope: 'AE',
				detailVisible: false,
				setVisible: false,
				query: {
					businessScope: 'AE',
					flightDateStart: '',
					flightDateEnd: '',
					orderStatus: '',
					workloadType: '责任销售',
					dept: ''
				},
			}
		},
		components: {
			'setVisibleTag': setVisibleVue,
			'detail': Detail
		},
		provide() {
			return {
				queryList: this.queryList
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
			//部门
			this.$axios.post('/prm/coopagreement/selectDept').then(function(response) {
				this.deptoptions = response.data.data.dataList;
			}.bind(this));

			this.query.flightDateStart = this.getDateTime(new Date());
			//从数据库查询设置信息
			let pageName = '报表统计分析/工作量统计';
			this.$axios.get2("/hrs/user/getUserPageSet?pageName=" + pageName)
				.then(function(response) {
					let css_workload_list_column = response.data.data;
					if (css_workload_list_column && css_workload_list_column.length > 0) {
						let arrayC = css_workload_list_column
						if (arrayC && arrayC.length > 0) {
							for (let i = 0; i < arrayC.length; i++) {
								if ((this.query.businessScope === 'AE' || this.query.businessScope === 'AI' || this.query.businessScope === 'LC' || this.query.businessScope === 'IO') && arrayC[i].prop === 'chargeWeight') {
									arrayC[i].label = "计费重量";
								}
								if ((this.query.businessScope === 'SE' || this.query.businessScope === 'SI' || this.query.businessScope === 'TE' || this.query.businessScope === 'TI') && arrayC[i].prop === 'chargeWeight') {
									arrayC[i].label = "计费吨";
								}
                if((this.query.businessScope === 'AE' || this.query.businessScope === 'AI' || this.query.businessScope === 'LC'|| this.query.businessScope === 'IO') && arrayC[i].prop === 'containerNumber'){
                  this.$delete(arrayC,i);
                }
							}
							this.tableColumns = this.sortBykey(arrayC, 'index');
						}
					} else {
						let str = JSON.stringify(columns.info);
						this.tableColumns = this.sortBykey(JSON.parse(str), 'index');
						for (let i = 0; i < this.tableColumns.length; i++) {
							if ((this.query.businessScope === 'AE' || this.query.businessScope === 'AI' || this.query.businessScope === 'LC' || this.query.businessScope === 'IO') && this.tableColumns[i].prop === 'chargeWeight') {
								this.tableColumns[i].label = "计费重量";
							}
							if ((this.query.businessScope === 'SE' || this.query.businessScope === 'SI' || this.query.businessScope === 'TE' || this.query.businessScope === 'TI') && this.tableColumns[i].prop === 'chargeWeight') {
								this.tableColumns[i].label = "计费吨";
							}
              if((this.query.businessScope === 'AE' || this.query.businessScope === 'AI' || this.query.businessScope === 'LC'|| this.query.businessScope === 'IO') && this.tableColumns[i].prop === 'containerNumber'){
                this.$delete(this.tableColumns,i);
              }
						}
					}
				}.bind(this));
		},
		methods: {
      sortPieces(a,b){
          return a.pieces.replace(/,/g, "") - b.pieces.replace(/,/g, "")
      },
      sortWeight(a,b){
          return a.weight.replace(/,/g, "") - b.weight.replace(/,/g, "")
      },
      sortVolume(a,b){
          return a.volume.replace(/,/g, "") - b.volume.replace(/,/g, "")
      },
      sortChargeWeight(a,b){
          return a.chargeWeight.replace(/,/g, "") - b.chargeWeight.replace(/,/g, "")
      },
      sortContainerNumber(a,b){
          return a.containerNumber.replace(/,/g, "") - b.containerNumber.replace(/,/g, "")
      },
			setting() {
        this.frow.businessScope = this.query.businessScope;

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
					localStorage.setItem(userId + '_css_workload_column_width', JSON.stringify(arrayC))
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
				return "";
			},
			sortBykey(ary, key) {
				return ary.sort(function(a, b) {
					let x = a[key]
					let y = b[key]
					return ((x < y) ? -1 : (x > y) ? 1 : 0)
				})
			},
			setHeight() {
				this.$nextTick(() => {
					let css_workload_header = this.$refs.css_workload_header.offsetHeight;
					let heightS = window.innerHeight - 92 - css_workload_header;
					this.tableHeight = heightS + "px";
				});
			},
			userName(str) {
				if (str) {
					return str.split(" ")[0];
				} else {
					return "";
				}
			},
			handlerCellClick(row, column, cell, event) {
				if ("人员姓名" == column['label']) {
					this.showView(row);
				}
			},
			cellClick(row) {
				this.showView(row);
			},
			showView(row) {
				this.frow = row;
				this.frow.businessScope = this.query.businessScope;
				this.frow.workloadType = this.query.workloadType;
				this.frow.orderStatus = this.query.orderStatus;
				this.frow.flightDateStart = this.query.flightDateStart;
				this.frow.flightDateEnd = this.query.flightDateEnd;
				this.detailVisible = true;
			},
			changeBusinessScope(val) {
        if(val !== 'AE' && this.query.workloadType === '责任航线'){
            this.query.workloadType = '责任销售';
        }
				this.query.serviceId = ''
				this.$axios.get2('/afbase/service/queryList', {
					businessScope: this.query.businessScope
				}).then(function(response) {
					this.serviceOptions = response.data.data;
				}.bind(this)).catch(function(error) {
					console.log(error);
				});
				if (val == 'SE' || val == 'SI' || val == 'TE' || val == 'TI') {
					this.containerNumberFlag = true;
				} else {
					this.containerNumberFlag = false;
				}
				if (val == 'AE' || val == 'SE') {
					this.flightDateName = '开航日期'
				} else if (val == 'AI' || val == 'SI') {
					this.flightDateName = '到港日期'
				} else if (val == 'LC') {
					this.flightDateName = '用车日期'
				} else if (val == 'TE') {
					this.flightDateName = '发车日期'
				} else if (val == 'TI') {
          this.flightDateName = '到达日期'
        } else if(val == "IO"){
				  this.flightDateName = "业务日期"
        }
				if (val == 'SE' || val == 'SI' || val == 'TE' || val == 'TI') {
					this.chargeWeightName = "计费吨";
				} else {
					this.chargeWeightName = "计费重量";
				}
				this.queryList();
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
			queryList() {
				this.setHeight();
				//从数据库查询设置信息
				let pageName = '报表统计分析/工作量统计';
				this.$axios.get2("/hrs/user/getUserPageSet?pageName=" + pageName)
					.then(function(response) {
						let css_workload_list_column = response.data.data;
						if (css_workload_list_column && css_workload_list_column.length > 0) {
							let arrayC = css_workload_list_column
							if (arrayC && arrayC.length > 0) {
								for (let i = 0; i < arrayC.length; i++) {
									if ((this.query.businessScope === 'AE' || this.query.businessScope === 'AI' || this.query.businessScope === 'LC' || this.query.businessScope === 'IO') && arrayC[i].prop === 'chargeWeight') {
										arrayC[i].label = "计费重量";
									}
									if ((this.query.businessScope === 'SE' || this.query.businessScope === 'SI' || this.query.businessScope === 'TE' || this.query.businessScope === 'TI') && arrayC[i].prop === 'chargeWeight') {
										arrayC[i].label = "计费吨";
									}
                  if((this.query.businessScope === 'AE' || this.query.businessScope === 'AI' || this.query.businessScope === 'LC'|| this.query.businessScope === 'IO') && arrayC[i].prop === 'containerNumber'){
                    this.$delete(arrayC,i);
                  }
								}
								this.tableColumns = this.sortBykey(arrayC, 'index');
							}
						} else {
							let str = JSON.stringify(columns.info);
							this.tableColumns = this.sortBykey(JSON.parse(str), 'index');
							for (let i = 0; i < this.tableColumns.length; i++) {
								if ((this.query.businessScope === 'AE' || this.query.businessScope === 'AI' || this.query.businessScope === 'LC' || this.query.businessScope==="IO") && this.tableColumns[i].prop === 'chargeWeight') {
									this.tableColumns[i].label = "计费重量";
								}
								if ((this.query.businessScope === 'SE' || this.query.businessScope === 'SI' || this.query.businessScope === 'TE' || this.query.businessScope === 'TI') && this.tableColumns[i].prop === 'chargeWeight') {
									this.tableColumns[i].label = "计费吨";
								}
                if((this.query.businessScope === 'AE' || this.query.businessScope === 'AI' || this.query.businessScope === 'LC'|| this.query.businessScope === 'IO') && this.tableColumns[i].prop === 'containerNumber'){
                  this.$delete(this.tableColumns,i);
                }
							}
						}
						this.loading = true
						this.$axios.get2('/afbase/workload', this.query).then((response) => {
							this.data = response.data.data;
							this.loading = false
						}).catch((error) => {
							this.loading = false
							console.log(error);
						});
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
					// let pageName = '报表统计分析/工作量统计';
					// this.$axios.get2("/hrs/user/getUserPageSet?pageName=" + pageName)
					// 	.then(function(response) {
					// 		let css_workload_list_column = response.data.data;
					// 		if (css_workload_list_column && css_workload_list_column.length > 0) {
					// 			let arrayC = css_workload_list_column
					// 			if (arrayC && arrayC.length > 0) {
					// 				for (let i = 0; i < arrayC.length; i++) {
					// 					if ((this.query.businessScope === 'AE' || this.query.businessScope === 'AI' || this.query.businessScope === 'LC' || this.query.businessScope === 'IO') && arrayC[i].prop === 'chargeWeight') {
					// 						arrayC[i].label = "计费重量";
					// 					}
					// 					if ((this.query.businessScope === 'SE' || this.query.businessScope === 'SI' || this.query.businessScope === 'TE') && arrayC[i].prop === 'chargeWeight') {
					// 						arrayC[i].label = "计费吨";
					// 					}
					// 					if ((this.query.businessScope !== 'SE' && this.query.businessScope !== 'SI' && this.query.businessScope !== 'TE') && arrayC[i].prop === 'containerNumber') {
					// 						this.$delete(arrayC, i);
					// 					}
					// 				}
					// 				this.query.columnStrs = JSON.stringify(arrayC);
					// 			}
					// 		} else {
					// 			this.query.columnStrs = '';
					// 		}
					// 	}.bind(this));
            this.query.columnStrs = JSON.stringify(this.tableColumns);
            this.exportExcelSure();
				}).catch(() => {
					let str = JSON.stringify(columns.info);
					let excelList = this.sortBykey(JSON.parse(str), 'index');
					for (let i = 0; i < excelList.length; i++) {
						if ((this.query.businessScope === 'AE' || this.query.businessScope === 'AI' || this.query.businessScope === 'LC' || this.query.businessScope === 'IO') && excelList[i].prop === 'chargeWeight') {
							excelList[i].label = "计费重量";
						}
						if ((this.query.businessScope === 'SE' || this.query.businessScope === 'SI' || this.query.businessScope === 'TE' || this.query.businessScope === 'TI') && excelList[i].prop === 'chargeWeight') {
							excelList[i].label = "计费吨";
						}
						if ((this.query.businessScope !== 'SE' && this.query.businessScope !== 'SI' && this.query.businessScope !== 'TE' && this.query.businessScope !== 'TI') && excelList[i].prop === 'containerNumber') {
							this.$delete(excelList, i);
						}
					}
					this.query.columnStrs = JSON.stringify(excelList);
					this.exportExcelSure();
				});

			},
			exportExcelSure() {
				if (this.data.length == 0) {
					this.openError("查询结果没有数据，不允许导出");
					return;
				}
				this.$axios.post3('/afbase/workload/exportExcel', this.query)
					.then(function(response) {
						var blob = new Blob([response.data], {
							type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8'
						});
						var downloadElement = document.createElement('a');
						var href = window.URL.createObjectURL(blob); // 创建下载的链接
						downloadElement.href = href;
						downloadElement.download = '工作量统计列表' + '.xls'; // 下载后文件名
						document.body.appendChild(downloadElement);
						downloadElement.click(); // 点击下载
						document.body.removeChild(downloadElement); // 下载完成移除元素
						window.URL.revokeObjectURL(href); // 释放掉blob对象
            this.query.columnStrs ="";
					}.bind(this));

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
	.css_workload .el-table .cell {
		white-space: pre-line !important;
		/*保留换行符*/
	}

	.css_workload .table_pay tr.current-row>td {
		background: #FDF5E6 !important;
	}

	.css_workload .el-input__icon {
		line-height: 30px !important;
	}

	.css_workload .el-form-item__content {
		line-height: 30px !important;
	}

	.css_workload .el-input-group__prepend {
		padding: 0 6px;
	}

	.css_workload .widthWithThree .el-input-group__prepend {
		padding: 0 13px !important;
	}

	.css_workload .el-checkbox__inner {
		background-color: #FFF !important;
	}

	.css_workload .el-button {
		margin-top: -5px !important
	}
</style>
