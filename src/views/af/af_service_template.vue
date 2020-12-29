<template>
	<div class="warp-main">
		<el-form :inline="false" :model="query" label-width="80px" class="orderListPage">
			<el-row>
				<el-col class="elementWidth">
	                <el-form-item label="" label-width="10px">
	                  <el-input style="width:152px;">
	                    <template slot="prepend">业务范畴</template>
	                    <el-select slot="suffix" v-model="query.businessScope" style="width:83px;margin-right: -5px;" @change="clearData">
	                      <el-option v-for="item in options" :key="item.paramRanking" :label="item.paramText" :value="item.paramText">
	                      </el-option>
	                    </el-select>
	                  </el-input>
	                </el-form-item>
	            </el-col>
	            <el-col class="elementWidth">
                <el-form-item label-width="10px">
                  <el-input style="width:157px;">
                    <template slot="prepend">模板类型</template>
                    <el-select slot="suffix" clearable v-model="query.templateType" placeholder="请选择" style="width:88px;margin-right: -5px;">
                      <el-option label="应收" value="1"></el-option>
                      <el-option label="应付" value="0"></el-option>
                    </el-select>
                  </el-input>
                </el-form-item>
              </el-col>
				<el-col class="elementWidth">
					<el-form-item label-width="10px">
						<el-input v-model="query.templateName" auto-complete="off" clearable style="width:206px;">
							<template slot="prepend">模板名称</template>
						</el-input>
					</el-form-item>
				</el-col>
				<el-col class="elementWidth">
					<el-form-item label-width="10px">
						<el-input v-model="query.portCode" auto-complete="off" clearable style="width:206px;" @input="query.portCode=query.portCode.toUpperCase()">
							<template slot="prepend" v-if="query.businessScope=='AE'||query.businessScope=='SE'">始发港</template>
							<template slot="prepend" v-else>目的港</template>
						</el-input>
					</el-form-item>
				</el-col>

				<el-col class="elementWidth">
					<el-form-item label-width="10px">
						<el-button type="text" size="small" v-if=showFlag v-on:click="showFlag=false">收起</el-button>
						<el-button type="text" size="small" v-if=!showFlag v-on:click="showFlag=true">展开</el-button>
						<el-button type="primary" size="small" v-on:click="findByPage" style="margin-left: 2px;padding-left: 8px;padding-right: 8px;">查询</el-button>
						<el-button style="margin-left: 4px;padding-left: 8px;padding-right: 8px;" type="primary" size="small" v-on:click="showsave(1)" >新增应收模板</el-button>
						<el-button style="margin-left: 4px;padding-left: 8px;padding-right: 8px;" type="primary" size="small" v-on:click="showsave(0)" >新增应付模板</el-button>


					</el-form-item>
				</el-col>

			</el-row>
			<el-row v-show="showFlag">
				<el-col class="elementWidth">
					<el-form-item label-width="10px">
						<el-input style="width:210px;">
							<template slot="prepend">操作日期</template>
							<el-date-picker slot="suffix" v-model="query.createTimeBegin" clearable type="date" value-format="yyyy-MM-dd 00:00:00" placeholder="开始" style="width: 141px;margin-right: -5px;">
							</el-date-picker>
						</el-input>
						<span>-</span>
						<el-date-picker v-model="query.createTimeEnd" clearable type="date" value-format="yyyy-MM-dd 23:59:59" placeholder="结束" style="width: 135px;">
						</el-date-picker>
					</el-form-item>
				</el-col>
        <el-col class="elementWidth">
          <el-form-item label-width="39px">
            <el-button style="margin-left: 397px;padding-left: 8px;padding-right: 8px;background-color:#FFF;color:#409EFF" type="primary" size="small" v-on:click="setting">设置</el-button>
            <el-button style="margin-left: 4px;padding-left: 8px;padding-right: 8px;background-color:#FFF;color:#409EFF" type="primary" size="small" v-on:click="exportExcel">导出</el-button>
          </el-form-item>
        </el-col>
			</el-row>
		</el-form>

          <el-row style="margin-top: 8px;">
		<el-table v-loading="loading" :data="data1" border  ref="table" :cell-class-name="addPullRightClass" :cell-style="addCellStayle" @header-dragend="cellWidth">

			<el-table-column label="操作" align="center" fixed width="45">
				<template slot-scope="scope">
					<el-dropdown :hide-on-click="false" trigger="click" @command="handleCommand" @visible-change="handleChange(scope.row)">
						<i class="el-icon-s-operation"></i>
						<el-dropdown-menu slot="dropdown">
							<el-dropdown-item command="edit" >编辑</el-dropdown-item>
							<el-dropdown-item command="delete" >删除</el-dropdown-item>
						</el-dropdown-menu>
					</el-dropdown>
				</template>
			</el-table-column>
      <template v-for="(item,index) in tableColumns">
        <el-table-column v-if="item.label=='业务范畴'" :key="index" :prop="item.prop" :label="item.label" :width="item.width" :align="item.align" :sortable="item.sortable"></el-table-column>
        <el-table-column v-if="item.label=='模板类型'" :key="index" :prop="item.prop" :label="item.label" :width="item.width" :align="item.align" :sortable="item.sortable" :formatter="formatter_templateType"></el-table-column>
        <el-table-column v-if="item.prop=='portCode' && (query.businessScope=='AE'||query.businessScope=='SE')" label="始发港" :key="index" :prop="item.prop" :width="item.width" :align="item.align" :sortable="item.sortable"></el-table-column>
        <el-table-column v-if="item.prop=='portCode' && (query.businessScope!='AE'&&query.businessScope!='SE')" label="目的港" :key="index" :prop="item.prop" :width="item.width" :align="item.align" :sortable="item.sortable"></el-table-column>
        <el-table-column v-if="item.label=='模板名称'" :key="index" :prop="item.prop" :label="item.label" :width="item.width" :align="item.align" :sortable="item.sortable" header-align="center"></el-table-column>
        <el-table-column v-if="item.label=='备注'" :key="index" :prop="item.prop" :label="item.label" :width="item.width" :align="item.align" :sortable="item.sortable" header-align="center"></el-table-column>
        <el-table-column v-if="item.label=='操作人'" :key="index" :prop="item.prop" :label="item.label" :width="item.width" :align="item.align" :sortable="item.sortable" :formatter="formatter_editorName"></el-table-column>
        <el-table-column v-if="item.label=='操作日期'" :key="index" :prop="item.prop" :label="item.label" :width="item.width" :align="item.align" :sortable="item.sortable"></el-table-column>
      </template>
		</el-table>
		</el-row>
		<div class="pagination">
			<el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="pageConf.pageCode" :page-sizes="pageConf.pageOption" :page-size.sync="pageConf.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="pageConf.totalPage">
			</el-pagination>
		</div>
      <setVisibleTag ref="addMission" v-if="setVisible" :visible.sync="setVisible"></setVisibleTag>
    	<saveVisible ref="addMission" v-if="saveVisible" :visible.sync="saveVisible" :frow="frow"></saveVisible>
    	<editVisible ref="addMission" v-if="editVisible" :visible.sync="editVisible" :frow="frow"></editVisible>
	</div>
</template>
<script>
	import saveVisible from './serviceTemplate/af_service_template_save'
	import editVisible from './serviceTemplate/af_service_template_edit'
  import columns from './serviceTemplate/af_service_template_column.json'
  import setVisibleVue from './serviceTemplate/af_service_template_setting'
	export default {
		data() {
			return {
				showFlag: false,
				saveVisible: false,
				editVisible: false,
        setVisible: false,
				frow: {},
				currRow: '',
				/*表数据*/
				data1: [],
        tableColumns: [],
				customerNameOptions1:[],
				customerNameOptions2: [],
				pageConf: {
					//设置一些初始值(会被覆盖)
					pageCode: 1, //当前页
					pageSize: 10, //每页显示的记录数
					totalPage: 0, //总记录数
					pageOption: [10, 30, 50], //分页选项
					handleCurrentChange: function() {
						console.log("页码改变了");
					}
				},
				options: [],
				query: {
					businessScope:'AE',
					templateType: '',
					templateName: '',
					portCode:'',
					createTimeBegin:'',
					createTimeEnd:''
				},
				loading: false,
			}
		},
		components: {
      'setVisibleTag': setVisibleVue,
			'saveVisible': saveVisible,
			'editVisible': editVisible
		},
		provide() {
			return {
				findByPage: this.findByPage,
			}
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
              localStorage.setItem(userId + '_af_service_template_list_column_width', JSON.stringify(arrayC))
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
			clearData(){
				this.data1=[];
			},
     		handleChange(command) {
				this.currRow = command
			},
			handleCommand(command) {
				if (command == 'edit') {
					this.showedit(this.currRow)
				} else if (command == 'delete') {
					this.confirmDelete(this.currRow)
				}
			},
			showsave(templateType) {
				this.frow.businessScope = this.query.businessScope;
				this.frow.templateType = templateType;
				this.saveVisible = true;
			},
			confirmDelete(row) {
				this.$confirm('删除后不能还原，是否继续？', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning',
					center: true
				}).then(() => {
					this.doDelete(row);
				}).catch(() => {
					// this.$message({
					//   type: 'info',
					//   message: '已取消'
					// });
				});
			},
			doDelete(row) {
				this.$axios.post2('/afbase/servicetemplate/doDelete', row)
					.then(function(response) {
						if (response.data.code == 0) {
							this.openSuccess();
							this.findByPage();
						} else {
							this.openError(response.data.messageInfo);
						}
					}.bind(this));
			},
			showedit(row) {
				this.frow.row=row;
				// this.frow.customerNameOptions1=this.customerNameOptions1;
				// this.frow.customerNameOptions2=this.customerNameOptions2
				this.editVisible = true;
			},
			findByPage() {

        //从数据库查询设置信息
        let pageName = '基础数据维护/公共信息/服务模板';
        this.$axios.get2("/hrs/user/getUserPageSet?pageName=" + pageName)
            .then(function(response) {
                let af_service_template_list_column = response.data.data;
                if(af_service_template_list_column && af_service_template_list_column.length>0){
                    this.tableColumns = this.sortBykey(af_service_template_list_column, 'index');
                }else{
                    this.tableColumns = this.sortBykey(columns.info, 'index');
                }
                this.loading = true
                this.$axios.get2("/afbase/servicetemplate/page?size=" + this.pageConf.pageSize + "&current=" + this.pageConf.pageCode, this.query)
                    .then(function(response) {
                        this.data1 = response.data.data.records;
                        this.pageConf.totalPage = response.data.data.total;
                        if (this.data1.length == 0) {
                            let current = Math.ceil(this.pageConf.totalPage / this.pageConf.pageSize);
                            this.findByPage2(current);
                        } else {
                            this.loading = false
                        }
                    }.bind(this));
            }.bind(this));

	/*			this.loading = true
				this.$axios.get2("/afbase/servicetemplate/page?size=" + this.pageConf.pageSize + "&current=" + this.pageConf.pageCode, this.query)
					.then(function(response) {
						this.data1 = response.data.data.records;
						this.pageConf.totalPage = response.data.data.total;
						if (this.data1.length == 0) {
							let current = Math.ceil(this.pageConf.totalPage / this.pageConf.pageSize);
							this.findByPage2(current);
						} else {
							this.loading = false
						}
					}.bind(this));*/

			},
			findByPage2(current) {
				this.$axios.get2("/afbase/servicetemplate/page?size=" + this.pageConf.pageSize + "&current=" + current, this.query)
					.then(function(response) {
						this.loading = false
						this.data1 = response.data.data.records;
						this.pageConf.totalPage = response.data.data.total;
					}.bind(this));
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
              let excelList = this.sortBykey(columns.info, 'index')
              this.query.columnStrs = JSON.stringify(excelList)
              this.exportExcelSure();
          });

      },
      exportExcelSure() {
          this.$axios.post3('/afbase/servicetemplate/exportExcel', this.query)
              .then(function(response) {
                  var blob = new Blob([response.data], {
                      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8'
                  });
                  var downloadElement = document.createElement('a');
                  var href = window.URL.createObjectURL(blob); // 创建下载的链接
                  downloadElement.href = href;
                  downloadElement.download = '服务模板列表' + '.xls'; // 下载后文件名
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
					message: '操作失败，' + info,
					type: 'error',
					position: 'bottom-right'
				});
			},
			inboundSuccess(info) {
				this.$notify({
					title: '',
					message: info,
					type: 'success',
					position: 'bottom-right'
				});
			},
			openError1(info) {
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
			},
			formatterLegalFirstUnit(row, column) {
		        return row.legalFirstUnitCode+' '+row.legalFirstUnit+' / '+row.secondUnitCode+' '+row.secondUnit;
		    },
			formatter_editorName(row, column) {
				return row.editorName.split(' ')[0];
			},
			formatter_templateType(row, column) {
				if (row.templateType==1) {
					return '应收';
				}else{
					return '应付';
				}
			}

		},
		created() {
			this.$axios.get2('/afbase/awb/queryList', {
				awbFromType: "'外部客户','互为代理','业务类结算对象'",
				awbFromName: this.frow.businessScope
			}).then(function(response) {
				this.customerNameOptions1 = response.data.data;
			}.bind(this)).catch(function(error) {});
			this.$axios.get2('/afbase/awb/queryList', {
				awbFromType: "'干线承运人','互为代理','延伸服务供应商','业务类结算对象'",
				awbFromName: this.frow.businessScope
			}).then(function(response) {
				this.customerNameOptions2 = response.data.data;
			}.bind(this)).catch(function(error) {});
			//业务范畴
			this.$axios.get2('/afbase/category/paramsNew', {
			categoryName: "业务范畴"
			}).then(function(response) {
			this.options = response.data.data;

			}.bind(this)).catch(function(error) {

			})
      //从数据库查询设置信息
      let pageName = '基础数据维护/公共信息/服务模板';
      this.$axios.get2("/hrs/user/getUserPageSet?pageName=" + pageName)
          .then(function(response) {
              let af_service_template_list_column = response.data.data;
              if(af_service_template_list_column && af_service_template_list_column.length>0){
                  this.tableColumns = this.sortBykey(af_service_template_list_column, 'index');
              }else{
                  this.tableColumns = this.sortBykey(columns.info, 'index');
              }
          }.bind(this));
		}
	}
</script>
<style type="text/css">
	.orderListPage .el-input__icon {
		line-height: 30px !important;
	}

	.orderListPage .el-form-item__content {
		line-height: 30px !important;
	}

	.orderListPage .el-input-group__prepend {
		padding: 0 6px;
	}

	.orderListPage .widthWithThree .el-input-group__prepend {
		padding: 0 13px !important;
	}

  .awbNumber {
    text-decoration: underline;
  }

  .duihao_af {
    font-family: "iconfont" !important;
    font-size: 16px;
    font-style: normal;
    -webkit-font-smoothing: antialiased;
    display: "table-cell" !important;
  }

  .duihao_icn :before {
    content: "\E608";
  }
</style>
