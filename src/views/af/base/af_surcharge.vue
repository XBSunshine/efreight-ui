<template>
	<div class="warp-main">
		<div>
			<el-form :model="query" label-width="80px" class="afSurcharge-ruleForm">
				<el-row>
					<el-col class="elementWidth">
            <el-form-item label-width="10px">
              <el-input v-model="query.carrierCode" auto-complete="off" @input="query.carrierCode=query.carrierCode.toUpperCase()" style="width: 160px;" clearable>
                <template slot="prepend">航司代码</template>
              </el-input>
            </el-form-item>
					</el-col>
					<el-col class="elementWidth">
            <el-form-item label-width="10px">
              <el-input v-model="query.departureStation" auto-complete="off" @input="query.departureStation=query.departureStation.toUpperCase()" style="width: 160px;" clearable>
                <template slot="prepend">始发港</template>
              </el-input>
            </el-form-item>
					</el-col>
					<el-col class="elementWidth">
            <el-form-item label-width="10px">
              <el-input v-model="query.arrivalStation" auto-complete="off" @input="query.arrivalStation=query.arrivalStation.toUpperCase()" style="width: 160px;" clearable>
                <template slot="prepend">目的港</template>
              </el-input>
            </el-form-item>
					</el-col>
          <el-col class="elementWidth">
            <el-form-item label-width="10px">
              <el-input v-model="query.surchargeCode" auto-complete="off" style="width: 160px;" clearable>
                <template slot="prepend">附加费代码</template>
              </el-input>
            </el-form-item>
          </el-col>
					<el-col class="elementWidth">
            <el-form-item label-width="10px">
              <el-input style="width:180px;">
                <template slot="prepend">日期</template>
                <el-date-picker slot="suffix" style="width: 140px;margin-right: -5px;" v-model="query.createTimeBegin" clearable type="date" value-format="yyyy-MM-dd 00:00:00" placeholder="选择日期">
                </el-date-picker>
              </el-input>
            </el-form-item>
					</el-col>
					<el-col class="elementWidth">
						<el-form-item label-width="20px">
							<el-button type="primary" @click="queryList" size="small" style="margin-left: 2px;padding-left: 8px;padding-right: 8px;">查询</el-button>
							<el-button style="margin-left: 2px;padding-left: 8px;padding-right: 8px;" type="primary" @click="showSave" size="small">新增</el-button>
              <el-button style="margin-left: 4px;padding-left: 8px;padding-right: 8px;background-color:#FFF;color:#409EFF" type="primary" size="small" v-on:click="setting">设置</el-button>
              <el-button style="margin-left: 2px;padding-left: 8px;padding-right: 8px;background-color:#FFF;color:#409EFF" type="primary" @click="exportExcel" size="small">导出</el-button>
						</el-form-item>
					</el-col>
				</el-row>
			</el-form>
		</div>
		<div>
			<el-table :data="data1" border :cell-class-name="addPullRightClass" :cell-style="addCellStayle" @header-dragend="cellWidth">
				<el-table-column label="操作" align="center" fixed width="60">
					<template slot-scope="scope">
						<el-dropdown trigger="click" @command="handleCommand" @visible-change="handleChange(scope.row)">
							<i class="el-icon-s-operation"></i>
							<el-dropdown-menu slot="dropdown">
								<el-dropdown-item command="edit">编辑</el-dropdown-item>
                <el-dropdown-item command="delete">删除</el-dropdown-item>
							</el-dropdown-menu>
						</el-dropdown>
					</template>
				</el-table-column>
        <template v-for="(item,index) in tableColumns">
          <el-table-column v-if="item.label=='航司代码'" :key="index" :prop="item.prop" :label="item.label" :width="item.width" :align="item.align" :sortable="item.sortable"></el-table-column>
          <el-table-column v-if="item.label=='始发港'" :key="index" :prop="item.prop" :label="item.label" :width="item.width" :align="item.align" :sortable="item.sortable"></el-table-column>
          <el-table-column v-if="item.label=='目的港'" :key="index" :prop="item.prop" :label="item.label" :width="item.width" :align="item.align" :sortable="item.sortable"></el-table-column>
          <el-table-column v-if="item.label=='目的国'" :key="index" :prop="item.prop" :label="item.label" :width="item.width" :align="item.align" :sortable="item.sortable"></el-table-column>
          <el-table-column v-if="item.label=='IATA分区'" :key="index" :prop="item.prop" :label="item.label" :width="item.width" :align="item.align" :sortable="item.sortable"></el-table-column>
          <el-table-column v-if="item.label=='运单排序'" :key="index" :prop="item.prop" :label="item.label" :width="item.width" :align="item.align" :sortable="item.sortable"></el-table-column>
          <el-table-column v-if="item.label=='附加费代码'" :key="index" :prop="item.prop" :label="item.label" :width="item.width" :align="item.align" :sortable="item.sortable"></el-table-column>
          <el-table-column v-if="item.label=='附加费名称'" :key="index" :prop="item.prop" :label="item.label" :width="item.width" :align="item.align" :sortable="item.sortable" header-align="center"></el-table-column>
          <el-table-column v-if="item.label=='单价'" :key="index" :prop="item.prop" :label="item.label" :width="item.width" :align="item.align" :sortable="item.sortable" :formatter="unitPriceFormat" ></el-table-column>
          <el-table-column v-if="item.label=='收费方式'" :key="index" :prop="item.prop" :label="item.label" :width="item.width" :align="item.align" :sortable="item.sortable"></el-table-column>
          <el-table-column v-if="item.label=='最低收费'" :key="index" :prop="item.prop" :label="item.label" :width="item.width" :align="item.align" :sortable="item.sortable" :formatter="chargeMinFormat"></el-table-column>
          <el-table-column v-if="item.label=='最高收费'" :key="index" :prop="item.prop" :label="item.label" :width="item.width" :align="item.align" :sortable="item.sortable" :formatter="chargeMaxFormat"></el-table-column>
          <el-table-column v-if="item.label=='生效日期'" :key="index" :prop="item.prop" :label="item.label" :width="item.width" :align="item.align" :sortable="item.sortable" :formatter="formatterBeginDate"></el-table-column>
          <el-table-column v-if="item.label=='失效日期'" :key="index" :prop="item.prop" :label="item.label" :width="item.width" :align="item.align" :sortable="item.sortable" :formatter="formatterEndDate"></el-table-column>
        </template>
			</el-table>
		</div>
		<div>
			<el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="pageConf.pageCode" :page-sizes="pageConf.pageOption" :page-size.sync="pageConf.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="pageConf.totalPage">
			</el-pagination>
		</div>

    <setVisibleTag ref="addMission" v-if="setVisible" :visible.sync="setVisible"></setVisibleTag>
		<saveVisibleTag ref="addMission" v-if="saveVisible" :visible.sync="saveVisible" :frow="frow"></saveVisibleTag>
		<editVisibleTag ref="addMission" v-if="editVisible" :visible.sync="editVisible" :frow="frow"></editVisibleTag>
	</div>
</template>
<script>
	import saveVisibleVue from './surcharge/af_surcharge_save'
	import editVisibleVue from './surcharge/af_surcharge_edit'
  import columns from './surcharge/af_surcharge_column.json'
  import setVisibleVue from './surcharge/af_surcharge_setting'

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
					pageOption: [10, 50, 100]
				},
				query: {
					carrierCode: '',
					departureStation: '',
					arrivalStation: '',
					createTimeBegin: '',
          isTrue: false,
          surchargeCode: '',
				},
				saveVisible: false,
				editVisible: false,
        setVisible: false,
				frow: {},
				currRow: {},
			}
		},
		created: function() {
     this.query.createTimeBegin = this.getDateTime(new Date());
      //从数据库查询设置信息
      let pageName = '基础数据维护/空运信息/附加费';
      this.$axios.get2("/hrs/user/getUserPageSet?pageName=" + pageName)
          .then(function(response) {
              let af_surcharge_list_column = response.data.data;
              if(af_surcharge_list_column && af_surcharge_list_column.length>0){
                  this.tableColumns = this.sortBykey(af_surcharge_list_column, 'index');
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
			'saveVisibleTag': saveVisibleVue,
      'editVisibleTag': editVisibleVue
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
              localStorage.setItem(userId + '_af_surcharge_list_column_width', JSON.stringify(arrayC))
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
      unitPriceFormat(row, column) {
          let unitPrice='';
          if(row.unitPrice==null){

          }else if(row.unitPrice==0){
              unitPrice='0.00';
          }else{
              row.unitPrice = Number(row.unitPrice)
              if(isNaN(row.unitPrice)){
                  unitPrice='';
              }else{
                  unitPrice = row.unitPrice.toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,')
              }
          }
          return unitPrice
      },
      chargeMinFormat(row, column) {
          let chargeMin='';
          if(row.chargeMin==null){

          }else if(row.chargeMin==0){
              chargeMin='0.00';
          }else{
              row.chargeMin = Number(row.chargeMin)
              if(isNaN(row.chargeMin)){
                  chargeMin='';
              }else{
                  chargeMin = row.chargeMin.toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,')
              }
          }
          return chargeMin
      },
      chargeMaxFormat(row, column) {
          let chargeMax='';
          if(row.chargeMax==null){

          }else if(row.chargeMax==0){
              chargeMax='0.00';
          }else{
              row.chargeMax = Number(row.chargeMax)
              if(isNaN(row.chargeMax)){
                  chargeMax='';
              }else{
                  chargeMax = row.chargeMax.toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,')
              }
          }
          return chargeMax
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
          if(row[column.property]) {
              return(row[column.property]).substr(0, 10)
          } else {
              if (column.property == 'endDate') {
                  return "2099-12-31"
              } else {
                  return ""
              }
          }
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
        let pageName = '基础数据维护/空运信息/附加费';
        this.$axios.get2("/hrs/user/getUserPageSet?pageName=" + pageName)
            .then(function(response) {
                let af_surcharge_list_column = response.data.data;
                if(af_surcharge_list_column && af_surcharge_list_column.length>0){
                    this.tableColumns = this.sortBykey(af_surcharge_list_column, 'index');
                }else{
                    this.tableColumns = this.sortBykey(columns.info, 'index');
                }
                if(this.query.createTimeBegin == null) {
                    this.query.createTimeBegin = "";
                }
                let param = "size=" + this.pageConf.pageSize + "&current=" + this.pageConf.pageCode +
                    "&carrierCode=" + this.query.carrierCode + "&departureStation=" + this.query.departureStation +
                    "&arrivalStation=" + this.query.arrivalStation + "&surchargeCode=" + this.query.surchargeCode + "&createTimeBegin=" + this.query.createTimeBegin;
                let that = this;
                this.$axios.get('/afbase/surcharge/page?' + param).then(function(response) {
                    that.data1 = response.data.data.records;
                    that.pageConf.totalPage = response.data.data.total;
                    if(that.data1.length == 0) {
                        let current = Math.ceil(that.pageConf.totalPage / that.pageConf.pageSize);
                        that.queryList2(current);
                    }
                }).catch(function(error) {
                    console.log(error);
                });
            }.bind(this));

/*				if(this.query.createTimeBegin == null) {
					this.query.createTimeBegin = "";
				}
        let param = "size=" + this.pageConf.pageSize + "&current=" + this.pageConf.pageCode +
            "&carrierCode=" + this.query.carrierCode + "&departureStation=" + this.query.departureStation +
            "&arrivalStation=" + this.query.arrivalStation + "&surchargeCode=" + this.query.surchargeCode + "&createTimeBegin=" + this.query.createTimeBegin;
        let that = this;
        this.$axios.get('/afbase/surcharge/page?' + param).then(function(response) {
            that.data1 = response.data.data.records;
            that.pageConf.totalPage = response.data.data.total;
            if(that.data1.length == 0) {
                let current = Math.ceil(that.pageConf.totalPage / that.pageConf.pageSize);
                that.queryList2(current);
            }
        }).catch(function(error) {
            console.log(error);
        });*/

			},
			queryList2(current) {
				let param = "size=" + this.pageConf.pageSize + "&current=" + current +
					"&carrierCode=" + this.query.carrierCode + "&departureStation=" + this.query.departureStation +
					"&arrivalStation=" + this.query.arrivalStation + "&surchargeCode=" + this.query.surchargeCode + "&createTimeBegin=" + this.query.createTimeBegin;
				let that = this;
				this.$axios.get('/afbase/surcharge/page?' + param).then(function(response) {
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
          if(this.query.createTimeBegin == null) {
              this.query.createTimeBegin = "";
          }
          this.$axios.post3('/afbase/surcharge/exportExcel', this.query)
              .then(function(response) {
                  var blob = new Blob([response.data], {
                      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8'
                  });
                  var downloadElement = document.createElement('a');
                  var href = window.URL.createObjectURL(blob); // 创建下载的链接
                  downloadElement.href = href;
                  downloadElement.download = '附加费列表' + '.xls'; // 下载后文件名
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
			handleCommand(command) {
        if("edit" == command) {
          this.showEdit(this.currRow);
        } else if("delete" == command) {
          let row = this.currRow;
          this.handleDelete(row['surchargeId']);
        }
			},
			handleChange(row) {
				this.currRow = row;
			},
			showSave(row) {
				this.frow = row;
				this.saveVisible = true;
			},
			showEdit(row) {
				this.frow = row;
				this.editVisible = true;
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
				this.$confirm('你确定要删除吗?', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning',
					center: true
				}).then(() => {
					this.$axios.deletes('/afbase/surcharge/' + id)
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

  .afSurcharge-ruleForm .el-input__icon {
    line-height: 30px !important;
  }

  .afSurcharge-ruleForm .el-form-item__content {
    line-height: 30px !important;
  }

  .afSurcharge-ruleForm .el-input-group__prepend {
    padding: 0 6px;
  }

</style>
