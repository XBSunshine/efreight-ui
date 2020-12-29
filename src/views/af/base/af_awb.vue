<template>
	<div class="warp-main">
		<div>
			<el-form :model="query" class="afAwb-ruleForm">
        <div ref="af_awb_header">
          <el-row>
            <el-col class="elementWidth">
              <el-form-item label-width="10px">
                <el-input v-model="query.awbNumber" auto-complete="off" @input="query.awbNumber=query.awbNumber.toUpperCase()" clearable style="width: 180px;">
                  <template slot="prepend">主运单号</template>
                </el-input>
              </el-form-item>
            </el-col>
            <el-col class="elementWidth">
              <el-form-item label-width="10px">
                <el-input v-model="query.departureStation" auto-complete="off" @input="query.departureStation=query.departureStation.toUpperCase()" clearable style="width: 140px;">
                  <template slot="prepend">始发港</template>
                </el-input>
              </el-form-item>
            </el-col>
            <el-col class="elementWidth">
              <el-form-item label-width="10px">
                <el-input style="width:165px;">
                  <template slot="prepend">主单状态</template>
                  <el-select slot="suffix" clearable v-model="query.awbStatus" filterable placeholder="请选择" style="width:96px;margin-right: -5px;">
                    <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value">
                    </el-option>
                  </el-select>
                </el-input>
              </el-form-item>
            </el-col>
            <el-col class="elementWidth">
              <el-form-item label-width="10px">
                <el-button type="text" size="small" v-if="showFlag" v-on:click="showFlagSearch">收起</el-button>
                <el-button type="text" size="small" v-if="!showFlag" v-on:click="showFlagSearch">展开</el-button>
                <el-button type="primary" size="small" v-on:click="queryList" style="margin-left: 2px;padding-left: 8px;padding-right: 8px;">查询</el-button>
                <el-button style="margin-left: 4px;padding-left: 8px;padding-right: 8px;" type="primary" size="small" v-on:click="showsave" v-show="permission.sys_base_awb_add.isShow">新增</el-button>
                <el-button style="margin-left: 4px;padding-left: 8px;padding-right: 8px;" type="primary" size="small" v-on:click="doDelete" v-show="permission.sys_base_awb_del.isShow">删除</el-button>
              </el-form-item>

              <!--<el-button type="text" size="medium" v-show=showFlag v-on:click="showFlag=false">收起</el-button>
              <el-button type="text" size="medium" v-show=!showFlag v-on:click="showFlag=true">展开</el-button>
              <el-form-item style="margin-left: 20px;">
                <el-button type="primary" size="small" v-on:click="queryList">查询</el-button>
                <el-button style="margin-left: 4px;" type="primary" size="small" v-on:click="showsave" v-show="permission.sys_base_awb_add.isShow">新增</el-button>
                <el-button style="margin-left: 4px;" type="primary" size="small" v-on:click="doDelete" v-show="permission.sys_base_awb_del.isShow">删除</el-button>
              </el-form-item>-->
            </el-col>
          </el-row>
          <el-row v-show="showFlag">
            <el-col class="elementWidth">
              <el-form-item label-width="10px">
                <el-input style="width:180px;">
                  <template slot="prepend">运单来源</template>
                  <el-select slot="suffix" clearable v-model="query.awbFromType" filterable placeholder="请选择" style="width:111px;margin-right: -5px;">
                    <el-option v-for="item in options2" :key="item.value" :label="item.label" :value="item.value">
                    </el-option>
                  </el-select>
                </el-input>
              </el-form-item>
            </el-col>
            <el-col class="elementWidth">
              <el-form-item label-width="10px">
                <el-input v-model="query.awbFromName" auto-complete="off" clearable style="width: 315px;">
                  <template slot="prepend">运单来源公司</template>
                </el-input>
              </el-form-item>
            </el-col>
            <el-col class="elementWidth">
              <el-form-item label-width="39px">
                <el-button style="margin-left: 4px;padding-left: 8px;padding-right: 8px;background-color:#FFF;color:#409EFF" type="primary" size="small" v-on:click="exportExcel">导出</el-button>
              </el-form-item>
            </el-col>
          </el-row>
        </div>
			</el-form>
		</div>
		<div>
			<el-table :data="data1" @selection-change="handleSelectionChange" border @cell-click="handlerAwbNumberCellClick">
				<el-table-column type="selection" align="center" width="60" fixed> </el-table-column>
				<el-table-column prop="awbNumber" align="center" label="主运单号" fixed width="120">
          <template slot-scope="scope">
            <span style="text-decoration: underline;cursor: pointer;">{{scope.row.awbNumber}}</span>
          </template>
        </el-table-column>
				<el-table-column prop="departureStation" align="center" label="始发港" width="60"></el-table-column>
				<el-table-column prop="awbStatus" label="运单来源" min-width="300" :formatter="formatter1"></el-table-column>
				<el-table-column prop="awbStatus" align="center" label="主单状态" width="70"></el-table-column>
				<!--   <el-table-column prop="reservedCoopName" label="预订代理" min-width="300" ></el-table-column>
        <el-table-column prop="reservedUser" label="预订人" min-width="200"></el-table-column>
        <el-table-column prop="reservedTime" label="预订时间" min-width="180"></el-table-column>
        <el-table-column prop="lockerName" label="锁定人" min-width="200"></el-table-column>
        <el-table-column prop="lockTime" label="锁定时间" min-width="200"></el-table-column>-->
				<el-table-column prop="creatorName" align="center" label="创建人" min-width="220"></el-table-column>
				<el-table-column prop="creatTime" align="center" label="创建时间" width="160"></el-table-column>
				<!-- :formatter="formatter1" -->
			</el-table>
		</div>
		<div ref="af_awb_footer">
			<el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="pageConf.pageCode" :page-sizes="pageConf.pageOption" :page-size.sync="pageConf.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="pageConf.totalPage">
			</el-pagination>
		</div>
		<saveVisibleTag ref="addMission" v-if="saveVisible" :visible.sync="saveVisible"></saveVisibleTag>
		<bookVisibleTag ref="addMission" v-if="bookVisible" :visible.sync="bookVisible" :frow="frow"></bookVisibleTag>
    <logVisibleTag ref="addMission" v-if="logVisible" :visible.sync="logVisible" :frow="frow"></logVisibleTag>
	</div>
</template>
<script>
	import saveVisibleVue from './awb/af_awb_save'
	import bookVisibleVue from './awb/af_awb_book'
  import logVisibleVue from './awb/af_awb_log'
	export default {
		data() {
			return {
				loading: false,
				data1: [],
				options: [],
				options2: [],
				multipleSelection: [],
				pageConf: {
					//设置一些初始值(会被覆盖)
					pageCode: 1, //当前页
					pageSize: 10, //每页显示的记录数
					totalPage: 0, //总记录数
					pageOption: [10, 50, 100]
				},
				query: {
					awbNumber: '',
					departureStation: '',
					awbStatus: '',
					awbFromType: '',
					awbFromName: ''
				},
				frow: {
					awbIds: ''
				},
				saveVisible: false,
				bookVisible: false,
        logVisible: false,
        showFlag: false,
				permission: {
					sys_base_awb_add: {
						isShow: false
					},
					sys_base_awb_del: {
						isShow: false
					},
				}
			}
		},
		created: function() {
			this.$axios.get('/afbase/awb/selectCategory?category=主单状态').then(function(response) {
				this.options = response.data.data;
			}.bind(this));
			this.$axios.get('/afbase/awb/selectCategory?category=运单所属').then(function(response) {
				this.options2 = response.data.data;
			}.bind(this));
			this.query.awbStatus = '未使用';
			// this.queryList();
			this.loadPermission(this.permission);
		},
		provide() {
			return {
				queryListp: this.queryList,
				queryList: this.queryList
			}
		},
		components: {
			'saveVisibleTag': saveVisibleVue,
			'bookVisibleTag': bookVisibleVue,
      'logVisibleTag': logVisibleVue,
		},
		methods: {
      showFlagSearch() {
          this.showFlag = !this.showFlag;
          this.setHeight();
      },
      setHeight() {
          this.$nextTick(() => {
              let af_awb_header = this.$refs.af_awb_header.offsetHeight;
              let af_awb_footer = this.$refs.af_awb_footer.offsetHeight;
              let heightS = window.innerHeight - 90 - af_awb_header - af_awb_footer;
              this.tableHeight = heightS + "px";
          });
      },
      handlerAwbNumberCellClick(row, column, cell, event){
          if("主运单号" == column['label']) {
              this.showAwbLog(row);
          }
      },
      showAwbLog(row) {
          this.frow = row;
          this.logVisible = true;
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
			showsave() {
				this.saveVisible = true;
			},
			doDelete() {
				let showAwbNumbers = ''
				this.multipleSelection.forEach((item) => {
					if(item.awbNumber != null && item.awbNumber !== '') {
						if(showAwbNumbers == '') {
							showAwbNumbers = item.awbNumber
						} else {
							showAwbNumbers += ',' + item.awbNumber
						}
					}
				})
				if(showAwbNumbers == '') {
					this.$message.error('请选择主单')
					return
				}
				this.$confirm('提示', {
					title: '提示',
					message: this.$createElement('div', null, [this.$createElement('p', null, '您将删除主单 : ' + showAwbNumbers + ','), this.$createElement('p', null, '操作不可恢复, 是否继续?')]),
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning',
					center: false
				}).then(() => {
					let flag = 1;
					let awbNumbers = '';
					let awbIds = '';
					for(var i = 0; i < this.multipleSelection.length; i++) {
						if(awbIds == '') {
							awbIds = awbIds + this.multipleSelection[i].awbId;
						} else {
							awbIds = awbIds + ',' + this.multipleSelection[i].awbId;
						}
						if(this.multipleSelection[i].awbStatus != '未使用') {
							flag = 0;
							if(awbNumbers == '') {
								awbNumbers = awbNumbers + this.multipleSelection[i].awbNumber;
							} else {
								awbNumbers = awbNumbers + ',' + this.multipleSelection[i].awbNumber;
							}
						}
					}
					if(flag == 1) {
						if(awbIds.length == 0) {
							this.$message.error('请选择要操作的记录');
							return;
						}
						let params = {
							"awbIds": awbIds
						};
						this.$axios.post2('/afbase/awb/doDelete', params)
							.then(function(response) {
								if(response.data.code == 0) {
									this.openSuccess();
									this.queryList();
								} else {
									this.openError(response.data.messageInfo);
								}

							}.bind(this)).catch(function(error) {
								let errorinfo = error.response.data.messageInfo;
								this.openError(error);
							}.bind(this));
					} else {
						this.$message.error(awbNumbers + '必须为未使用状态');
					}
				}).catch(() => {
					this.$message({
						type: 'info',
						message: '已取消删除'
					});
				});
			},
			doCancelLock() {
				let flag = 1;
				let awbNumbers = '';
				let awbIds = '';
				for(var i = 0; i < this.multipleSelection.length; i++) {
					if(awbIds == '') {
						awbIds = awbIds + this.multipleSelection[i].awbId;
					} else {
						awbIds = awbIds + ',' + this.multipleSelection[i].awbId;
					}
					if(this.multipleSelection[i].awbStatus != '未使用' || !this.multipleSelection[i].lockerName) {
						flag = 0;
						if(awbNumbers == '') {
							awbNumbers = awbNumbers + this.multipleSelection[i].awbNumber;
						} else {
							awbNumbers = awbNumbers + ',' + this.multipleSelection[i].awbNumber;
						}
					}
				}
				if(flag == 1) {
					if(awbIds.length == 0) {
						this.$message.error('请选择要操作的记录');
						return;
					}
					let params = {
						"awbIds": awbIds
					};
					this.$axios.post2('/afbase/awb/doCancelLock', params)
						.then(function(response) {
							if(response.data.code == 0) {
								this.openSuccess();
								this.queryList();
							} else {
								this.openError(response.data.messageInfo);
							}

						}.bind(this)).catch(function(error) {
							let errorinfo = error.response.data.messageInfo;
							this.openError(error);
						}.bind(this));
				} else {
					this.$message.error(awbNumbers + '未锁定或不为未使用状态');
				}
			},
			doLock() {
				let flag = 1;
				let awbNumbers = '';
				let awbIds = '';
				for(var i = 0; i < this.multipleSelection.length; i++) {
					if(awbIds == '') {
						awbIds = awbIds + this.multipleSelection[i].awbId;
					} else {
						awbIds = awbIds + ',' + this.multipleSelection[i].awbId;
					}
					if(this.multipleSelection[i].awbStatus != '未使用' || this.multipleSelection[i].lockerName) {
						flag = 0;
						if(awbNumbers == '') {
							awbNumbers = awbNumbers + this.multipleSelection[i].awbNumber;
						} else {
							awbNumbers = awbNumbers + ',' + this.multipleSelection[i].awbNumber;
						}
					}
				}
				if(flag == 1) {
					if(awbIds.length == 0) {
						this.$message.error('请选择要操作的记录');
						return;
					}
					let params = {
						"awbIds": awbIds
					};
					this.$axios.post2('/afbase/awb/doLock', params)
						.then(function(response) {
							if(response.data.code == 0) {
								this.openSuccess();
								this.queryList();
							} else {
								this.openError(response.data.messageInfo);
							}

						}.bind(this)).catch(function(error) {
							let errorinfo = error.response.data.messageInfo;
							this.openError(error);
						}.bind(this));
				} else {
					this.$message.error(awbNumbers + '已锁定或不为未使用状态');
				}
			},
			cancelBook() {
				let flag = 1;
				let awbNumbers = '';
				let awbIds = '';
				for(var i = 0; i < this.multipleSelection.length; i++) {
					if(awbIds == '') {
						awbIds = awbIds + this.multipleSelection[i].awbId;
					} else {
						awbIds = awbIds + ',' + this.multipleSelection[i].awbId;
					}
					if(this.multipleSelection[i].awbStatus != '未使用' || !this.multipleSelection[i].reservedUser
						// (this.multipleSelection[i].reservedUser!='null' && this.multipleSelection[i].reservedUser!='')
					) {
						flag = 0;
						if(awbNumbers == '') {
							awbNumbers = awbNumbers + this.multipleSelection[i].awbNumber;
						} else {
							awbNumbers = awbNumbers + ',' + this.multipleSelection[i].awbNumber;
						}
					}
				}
				if(flag == 1) {
					if(awbIds.length == 0) {
						this.$message.error('请选择要操作的记录');
						return;
					}
					let params = {
						"awbIds": awbIds
					};
					this.$axios.post2('/afbase/awb/cancelBook', params)
						.then(function(response) {
							if(response.data.code == 0) {
								this.openSuccess();
								this.queryList();
							} else {
								this.openError(response.data.messageInfo);
							}

						}.bind(this)).catch(function(error) {
							let errorinfo = error.response.data.messageInfo;
							this.openError(error);
						}.bind(this));
				} else {
					this.$message.error(awbNumbers + '未预订或不为未使用状态');
				}
			},
			showBook() {
				let flag = 1;
				let awbNumbers = '';
				let awbIds = '';
				for(var i = 0; i < this.multipleSelection.length; i++) {
					if(awbIds == '') {
						awbIds = awbIds + this.multipleSelection[i].awbId;
					} else {
						awbIds = awbIds + ',' + this.multipleSelection[i].awbId;
					}
					if(this.multipleSelection[i].awbStatus != '未使用' || this.multipleSelection[i].reservedUser
						// (this.multipleSelection[i].reservedUser!='null' && this.multipleSelection[i].reservedUser!='')
					) {
						flag = 0;
						if(awbNumbers == '') {
							awbNumbers = awbNumbers + this.multipleSelection[i].awbNumber;
						} else {
							awbNumbers = awbNumbers + ',' + this.multipleSelection[i].awbNumber;
						}
					}
				}
				if(flag == 1) {
					if(awbIds.length == 0) {
						this.$message.error('请选择要操作的记录');
						return;
					}
					this.frow.awbIds = awbIds;
					this.bookVisible = true;
				} else {
					this.$message.error(awbNumbers + '已预订或不为未使用状态');
				}
			},
			handleSelectionChange(val) {
				this.multipleSelection = val;
			},
			queryList() {
				if(this.query.awbFromType == null) {
					this.query.awbFromType = "";
				}
				if(this.query.awbStatus == null) {
					this.query.awbStatus = "";
				}
				if(this.query.awbNumber.trim() || this.query.departureStation.trim() || this.query.awbStatus.trim() || this.query.awbFromType.trim() || this.query.awbFromName.trim()) {
					let param = "size=" + this.pageConf.pageSize + "&current=" + this.pageConf.pageCode +
						"&awbNumber=" + this.query.awbNumber + "&departureStation=" + this.query.departureStation +
						"&awbStatus=" + this.query.awbStatus + "&awbFromType=" + this.query.awbFromType + "&awbFromName=" + this.query.awbFromName;
					let that = this;
					this.$axios.get('/afbase/awb/page?' + param).then(function(response) {
						that.data1 = response.data.data.records;
						that.pageConf.totalPage = response.data.data.total;
						if(that.data1.length == 0) {
							let current = Math.ceil(that.pageConf.totalPage / that.pageConf.pageSize);
							that.queryList2(current);
						}
					}).catch(function(error) {
						console.log(error);
					});
				} else {
					this.data1 = [];
					this.pageConf.totalPage = 0;
					// this.openError('请输入查询条件');
					this.$message.error('查询失败，请输入查询条件！');
				}

			},
			queryList2(current) {
				let param = "size=" + this.pageConf.pageSize + "&current=" + current +
					"&awbNumber=" + this.query.awbNumber + "&departureStation=" + this.query.departureStation +
					"&awbStatus=" + this.query.awbStatus + "&awbFromType=" + this.query.awbFromType + "&awbFromName=" + this.query.awbFromName;
				let that = this;
				this.$axios.get('/afbase/awb/page?' + param).then(function(response) {
					that.data1 = response.data.data.records;
					that.pageConf.totalPage = response.data.data.total;
				}).catch(function(error) {
					console.log(error);
				});
			},
      exportExcel() {
          if(this.query.awbFromType == null) {
              this.query.awbFromType = "";
          }
          if(this.query.awbStatus == null) {
              this.query.awbStatus = "";
          }
          this.$axios.post3('/afbase/awb/exportExcel', this.query)
              .then(function(response) {
                  var blob = new Blob([response.data], {
                      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8'
                  });
                  var downloadElement = document.createElement('a');
                  var href = window.URL.createObjectURL(blob); // 创建下载的链接
                  downloadElement.href = href;
                  downloadElement.download = '主单号管理' + '.xls'; // 下载后文件名
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

			formatter1(row, column) {
				return row.awbFromType + ' - ' + row.awbFromName;
			},
			formatter2(row, column) {
				if(row.apLongitude && row.apLatitude) {
					return row.apLongitude + "," + row.apLatitude;
				} else {
					return "";
				}
			}

			//---------------------

		}
	}
</script>
<style type="text/css">

  .afAwb-ruleForm .el-input__icon {
    line-height: 30px !important;
  }

  .afAwb-ruleForm .el-form-item__content {
    line-height: 30px !important;
  }

  .afAwb-ruleForm .el-input-group__prepend {
    padding: 0 6px;
  }

</style>
