<template>
	<div class="warp-main">
			<el-form :model="query" label-width="80px" class="afTact-ruleForm">
        <div ref="ae_order_header">
          <el-row>
            <el-col class="elementWidth">
              <el-form-item label-width="10px">
                <el-input v-model="query.productName" auto-complete="off" style="width: 189px;" clearable>
                  <template slot="prepend">产品名称</template>
                </el-input>
              </el-form-item>
            </el-col>
            <el-col class="elementWidth">
              <el-form-item label-width="10px">
                <el-input v-model="query.carrierCode" @input="query.carrierCode=query.carrierCode.toUpperCase()" auto-complete="off" style="width: 189px;" clearable>
                  <template slot="prepend">航空公司</template>
                </el-input>
              </el-form-item>
            </el-col>
            <el-col class="elementWidth">
              <el-form-item label-width="10px">
                <el-input v-model="query.departureStation" auto-complete="off" @input="query.departureStation=query.departureStation.toUpperCase()" style="width: 130px;" clearable>
                  <template slot="prepend">始发港</template>
                </el-input>
              </el-form-item>
            </el-col>
            <el-col class="elementWidth">
              <el-form-item label-width="10px">
                <el-input v-model="query.arrivalStation" auto-complete="off" @input="query.arrivalStation=query.arrivalStation.toUpperCase()" style="width: 130px;" clearable>
                  <template slot="prepend">目的港</template>
                </el-input>
              </el-form-item>
            </el-col>
            <el-col class="elementWidth">
              <el-form-item label-width="10px">
                <el-input style="width:210px;">
                  <template slot="prepend">航班日期</template>
                  <el-date-picker slot="suffix" style="width: 142px;margin-right: -5px;" v-model="query.flightDate" clearable type="date" value-format="yyyy-MM-dd 00:00:00" placeholder="选择航班日期">
                  </el-date-picker>
                </el-input>
              </el-form-item>
            </el-col>
            <el-col class="elementWidth">
              <el-form-item label-width="10px">
                <el-button type="text" size="small" v-if="showFlag" v-on:click="showFlagSearch">收起</el-button>
                <el-button type="text" size="small" v-if="!showFlag" v-on:click="showFlagSearch">展开</el-button>
                <el-button type="primary" @click="queryList" size="small" style="margin-left: 2px;padding-left: 8px;padding-right: 8px;">查询</el-button>
                <el-button style="margin-left: 2px;padding-left: 8px;padding-right: 8px;" type="primary" @click="showSave" size="small" v-if="permission.sys_base_tact_public_add.isShow">新增</el-button>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row v-show="showFlag">
            <el-col class="elementWidth">
              <el-form-item label-width="10px">
                <el-input style="width:189px;" v-model="query.goodsType" auto-complete="off" clearable>
                  <template slot="prepend">货物类型</template>
                </el-input>
              </el-form-item>
            </el-col>
            <el-col class="elementWidth">
              <el-form-item label-width="10px">
                <el-input v-model="query.densityClass" auto-complete="off" style="width: 189px;" clearable>
                  <template slot="prepend">密度等级</template>
                </el-input>
              </el-form-item>
            </el-col>
            <el-col class="elementWidth">
              <el-form-item label-width="10px">
                <el-input v-model="query.transitStation" auto-complete="off" @input="query.transitStation=query.transitStation.toUpperCase()" style="width: 130px;" clearable>
                  <template slot="prepend">中转港</template>
                </el-input>
              </el-form-item>
            </el-col>
            <el-col class="elementWidth" style="margin-left: 388px;">
              <el-form-item label-width="10px">
                <el-button style="margin-left: 4px;padding-left: 8px;padding-right: 8px;background-color:#FFF;color:#409EFF" type="primary" size="small" v-on:click="setting">设置</el-button>
                <el-button style="margin-left: 2px;padding-left: 8px;padding-right: 8px;background-color:#FFF;color:#409EFF" type="primary" @click="exportExcel" size="small">导出</el-button>
              </el-form-item>
            </el-col>
          </el-row>
        </div>
			</el-form>
			<el-table :data="data1" border :cell-class-name="addPullRightClass" :cell-style="addCellStayle" @header-dragend="cellWidth">
				<el-table-column label="操作" align="center" fixed width="60" v-if="operation.isShow">
					<template slot-scope="scope">
						<el-dropdown trigger="click" @command="handleCommand" @visible-change="handleChange(scope.row)">
							<i class="el-icon-s-operation"></i>
							<el-dropdown-menu slot="dropdown">
								<el-dropdown-item command="edit" v-if="permission.sys_base_tact_public_edit.isShow">编辑</el-dropdown-item>
                <el-dropdown-item command="copy" v-if="permission.sys_base_tact_public_copy.isShow">复制</el-dropdown-item>
                <el-dropdown-item command="delete" v-if="permission.sys_base_tact_public_del.isShow">删除</el-dropdown-item>
							</el-dropdown-menu>
						</el-dropdown>
					</template>
				</el-table-column>
        <template v-for="(item,index) in tableColumns">
          <el-table-column :key="index" :prop="item.prop" :label="item.label" :width="item.width" :align="item.align" :sortable="item.sortable" :formatter="formatter_column">
          </el-table-column>
        </template>
			</el-table>

		<div>
			<el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="pageConf.pageCode" :page-sizes="pageConf.pageOption" :page-size.sync="pageConf.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="pageConf.totalPage">
			</el-pagination>
		</div>

    <setVisibleTag ref="addMission" v-if="setVisible" :visible.sync="setVisible"></setVisibleTag>
		<saveVisibleTag ref="addMission" v-if="saveVisible" :visible.sync="saveVisible" :frow="frow"></saveVisibleTag>
<!--		<copyTag ref="addMission" v-if="copyVisible" :visible.sync="copyVisible" :frow="frow"></copyTag>-->
		<!--<editVisibleTag ref="addMission" v-if="editVisible" :visible.sync="editVisible" :fRow="frow"></editVisibleTag>-->
	</div>
</template>
<script>
	import saveVisibleVue from './tactPublic/af_tact_public_save'
	// import copy from './tactPublic/af_tact_public_copy'
  import columns from './tactPublic/af_tact_public_column.json'
  import setVisibleVue from './tactPublic/af_tact_public_setting'

	export default {
		data() {
			return {
				loading: false,
				data1: [],
        tableColumns: [],
				pageConf: {
					//设置一些初始值(会被覆盖)
					pageCode: 1, //当前页
					pageSize: 10, //每页显示的记录数
					totalPage: 0, //总记录数
					pageOption: [10, 50, 100,500]
				},
				query: {
					carrierCode: '',
					departureStation: '',
          transitStation: '',
					arrivalStation: '',
          densityClass:'',
          goodsType:'',
					flightDate: '',
          productName:''
				},
				saveVisible: false,
				// editVisible: false,
				// copyVisible: false,
        setVisible: false,
        showFlag: false,
				frow: {},
				currRow: {},
				permission: {
					sys_base_tact_public_add: {
						isShow: false
					},
          sys_base_tact_public_edit: {
						isShow: false
					},
					sys_base_tact_public_del: {
						isShow: false
					},
					sys_base_tact_public_copy: {
						isShow: false
					},
          operation :{
            isShow: true
          }
				},
        operation :{
            isShow: true
        }
			}
		},
		created: function() {
			this.loadPermission(this.permission);
      if(this.permission.sys_base_tact_public_copy.isShow == false){
        this.operation.isShow = false
      }
     this.query.flightDate = this.getDateTime(new Date());
     //从数据库查询设置信息
     let pageName = '基础数据维护/空运信息/TACT公布价';
     this.$axios.get2("/hrs/user/getUserPageSet?pageName=" + pageName)
        .then(function(response) {
            let af_tact_list_column = response.data.data;
            if(af_tact_list_column && af_tact_list_column.length>0){
                this.tableColumns = this.sortBykey(af_tact_list_column, 'index');
            }else{
                this.tableColumns = this.sortBykey(columns.info, 'index');
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
			'saveVisibleTag': saveVisibleVue
    // ,'copyTag': copy
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
              localStorage.setItem(userId + '_af_tact_list_column_width', JSON.stringify(arrayC))
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
          let ae_order_header = this.$refs.ae_order_header.offsetHeight;
          let ae_order_footer = this.$refs.ae_order_footer.offsetHeight;
          let heightS = window.innerHeight - 90 - ae_order_header - ae_order_footer;

          this.tableHeight = heightS + "px";
        });
      },
      showFlagSearch() {
        this.showFlag = !this.showFlag;
        this.setHeight();
      },
			openError(info) {
				this.$notify({
					title: '',
					message: '操作失败，' + info,
					type: 'error',
					position: 'bottom-right'
				});
			},
			openSuccess() {
				this.$notify({
					title: '',
					message: '操作成功',
					type: 'success',
					position: 'bottom-right'
				});
			},
			queryList() {
        //从数据库查询设置信息
        let pageName = '基础数据维护/空运信息/TACT公布价';
        this.$axios.get2("/hrs/user/getUserPageSet?pageName=" + pageName)
            .then(function(response) {
                let af_tact_list_column = response.data.data;
                if(af_tact_list_column && af_tact_list_column.length>0){
                    this.tableColumns = this.sortBykey(af_tact_list_column, 'index');
                }else{
                    this.tableColumns = this.sortBykey(columns.info, 'index');
                }
              let params={
                'size': this.pageConf.pageSize,
                'current': this.pageConf.pageCode,
                'carrierCode':this.query.carrierCode,
                'departureStation':this.query.departureStation,
                'arrivalStation':this.query.arrivalStation,
                'transitStation':this.query.transitStation,
                'densityClass':this.query.densityClass,
                'goodsType':this.query.goodsType,
                'flightDate':this.query.flightDate,
                'productName':this.query.productName
              }
                let that = this;
                this.$axios.post('/afbase/tactPublic/page',params)
                  .then(function(response) {
                        that.data1 = response.data.data.records;
                        that.pageConf.totalPage = response.data.data.total;
                        if(that.data1.length == 0) {
                            let current = Math.ceil(that.pageConf.totalPage / that.pageConf.pageSize);
                            that.queryList2(current,params);
                        }
                    }).catch(function(error) {
                        console.log(error);
                    });
                // } else {
                //     this.data1 = [];
                //     this.pageConf.totalPage = 0;
                //     this.$message.error('查询失败，请输入始发港、目的港、航班日期！');
                // }
            }.bind(this));

/*				if(this.query.createTimeBegin == null) {
					this.query.createTimeBegin = "";
				}
				if(this.query.departureStation.trim() && this.query.arrivalStation.trim() && this.query.createTimeBegin.trim()) {
					let param = "size=" + this.pageConf.pageSize + "&current=" + this.pageConf.pageCode +
						"&carrierCode=" + this.query.carrierCode + "&departureStation=" + this.query.departureStation +
						"&arrivalStation=" + this.query.arrivalStation + "&isTrue=" + this.query.isTrue + "&createTimeBegin=" + this.query.createTimeBegin + "&dataSource=" + this.query.dataSource;
					let that = this;
					this.$axios.get('/afbase/tactPublic/page?' + param).then(function(response) {
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
          this.$message.error('查询失败，请输入始发港、目的港、航班日期！');
				}*/

			},
			queryList2(current,params) {
				// let param = "size=" + this.pageConf.pageSize + "&current=" + current +
				// 	"&carrierCode=" + this.query.carrierCode + "&departureStation=" + this.query.departureStation +
				// 	"&arrivalStation=" + this.query.arrivalStation + "&isTrue=" + this.query.isTrue + "&createTimeBegin=" + this.query.createTimeBegin + "&dataSource=" + this.query.dataSource;
				let that = this;
				this.$axios.post('/afbase/tactPublic/page', params).then(function(response) {
					that.data1 = response.data.data.records;
					that.pageConf.totalPage = response.data.data.total;
				}).catch(function(error) {
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
              let excelList = this.sortBykey(columns.info, 'index')
              this.query.columnStrs = JSON.stringify(excelList)
              this.exportExcelSure();
          });

      },
      exportExcelSure() {
          this.$axios.post3('/afbase/tactPublic/exportExcel', this.query)
              .then(function(response) {
                  var blob = new Blob([response.data], {
                      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8'
                  });
                  var downloadElement = document.createElement('a');
                  var href = window.URL.createObjectURL(blob); // 创建下载的链接
                  downloadElement.href = href;
                  downloadElement.download = 'TACT公布价列表' + '.xls'; // 下载后文件名
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
      getNumber(data) {
        return data.toString().replace(/\d{1,3}(?=(\d{3})+(\.\d*)?$)/g, '$&,');
      },
      formatter_column(row, column) {
        if (column.property === "tactM"
          || column.property === "tactN"
          || column.property === "tact45"
          || column.property === "tact100"
          || column.property === "tact300"
          || column.property === "tact500"
          || column.property === "tact700"
          || column.property === "tact1000"
          || column.property === "tact2000"
          || column.property === "tact3000"
          || column.property === "tact5000"
        ) {
          let tactVal = "-";
          if (row[column.property]) {
            tactVal = this.getNumber(row[column.property])
          }
          return tactVal;
        } else if (column.property === "beginDate") {
          return this.formatterBeginDate(row, column);
        } else if (column.property === "endDate") {
          return this.formatterEndDate(row, column);
        }else{
          return row[column.property];
        }
      },

      formatterBeginDate(row, column){
        if(row.beginDate){
          var t=new Date(row.beginDate);
            　　var year=t.getFullYear(),
               　　 month=t.getMonth()+1,
               　　 day=t.getDate();
          　　  var newTime=year+'-'+
              　　  (month<10?'0'+month:month)+'-'+
             　　   (day<10?'0'+day:day);
          　　  return newTime;
        }else{
          return "";
        }
      },
      formatterEndDate(row, column){
        if(row.endDate){
          var t=new Date(row.endDate);
            　　var year=t.getFullYear(),
               　　 month=t.getMonth()+1,
               　　 day=t.getDate();
          　　  var newTime=year+'-'+
              　　  (month<10?'0'+month:month)+'-'+
             　　   (day<10?'0'+day:day);
          　　  return newTime;
        }else{
          return "";
        }
      },
			handleCommand(command) {
        if("edit" == command) {
          this.currRow.tabType = 'edit';
          this.showSave(this.currRow);
        } else if("delete" == command) {
          let row = this.currRow;
          this.handleDelete(row['publishPriceId']);
        }else if("copy" == command) {
          let org_id = window.localStorage.getItem('orgId');
          this.currRow.tabType = 'copy';
          if(org_id != this.currRow.orgId){
                 this.$confirm('请确认是否从EF公共数据中复制？', '提示', {
                  confirmButtonText: '确定',
                  cancelButtonText: '取消',
                  type: 'warning',
                  center: true
                 }).then(() => {
                      this.showSave(this.currRow);
                 }).catch((e) => {

                 });
          }else{
				   	this.showSave(this.currRow);
          }
				}
			},
			handleChange(row) {
				this.currRow = row;
			},
			showSave(row) {
				this.frow = row;
				this.saveVisible = true;
			},
      getDateTime(theDate) {
        let _year = theDate.getFullYear();
        let _month = theDate.getMonth();
        let _day = theDate.getDate();
        console.log(_day);
        _month = _month + 1;
        if (_month < 10) {
          _month = "0" + _month;
        }
        return _year + "-" + _month +"-"+ _day+" 00:00:00";
      },
			handleDelete(id) {
				// console.log("id--->", id);
				this.$confirm('你确定要删除吗?', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning',
					center: true
				}).then(() => {
					this.$axios.deletes('/afbase/tactPublic/deleteTact/' + id)
						.then(function(response) {
							if(response.data.code == 0) {
								this.openSuccess();
								this.queryList();
							} else {
								this.openError(response.data.messageInfo);
							}
						}.bind(this));
				}).catch((e) => {

				});
			}
		}
	}
</script>
<style type="text/css">

  .afTact-ruleForm .el-input__icon {
    line-height: 30px !important;
  }

  .afTact-ruleForm .el-form-item__content {
    line-height: 30px !important;
  }

  .afTact-ruleForm .el-input-group__prepend {
    padding: 0 6px;
  }

</style>
