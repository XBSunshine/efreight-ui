<template>
	<div class="warp-main">
		<el-form :inline="false" :model="query" label-width="85px" class="afOperationPlan-ruleForm">
			<!--<el-row style="margin:10px 10px 10px 10px;">
				<el-col class="elementWidth" style="font-size: large;">操作计划</el-col>
			</el-row>-->
      <div ref="table_header">
			<el-row>
				<el-col class="elementWidth">
          <el-form-item label-width="10px">
            <el-input style="width: 180px;" v-model="query.departureStation" auto-complete="off" @blur="findWarehouse" @input="query.departureStation = query.departureStation.toUpperCase()" clearable>
              <template slot="prepend">始发港</template>
            </el-input>
          </el-form-item>
				</el-col>
				<el-col class="elementWidth">
          <el-form-item label-width="10px">
            <el-input style="width:204px;">
              <template slot="prepend">到货日期</template>
              <el-date-picker slot="suffix" style="width: 135px;margin-right: -5px;" v-model="query.receiptDateStart" type="date" value-format="yyyy-MM-dd 00:00:00" placeholder="选择日期">
              </el-date-picker>
            </el-input>
            <span>-</span>
            <el-date-picker style="width: 135px;" v-model="query.receiptDateEnd" type="date" value-format="yyyy-MM-dd 23:59:59" placeholder="选择日期">
            </el-date-picker>
          </el-form-item>
				</el-col>
				<el-col class="elementWidth">
          <el-form-item label-width="10px">
            <el-input style="width: 235px;" v-model="query.awbNumber" auto-complete="off" clearable>
              <template slot="prepend">主运单号</template>
            </el-input>
          </el-form-item>
				</el-col>
				<el-col class="elementWidth">
					<el-form-item label-width="5px">
						<el-button type="text" size="mini" v-if=showFlag v-on:click="showFlag=false">收起</el-button>
						<el-button type="text" size="mini" v-if=!showFlag v-on:click="showFlag=true">展开</el-button>
						<el-button style="margin-left: 1px;padding: 9px 10px;" type="primary" size="small" v-on:click="findByPage">查询</el-button>
						<!--<el-button type="primary" size="small" v-on:click="exportExcel">导出</el-button>-->
						<!--<el-button style="margin-left: 1px;padding: 9px 10px;" type="primary" size="small">发送预配</el-button>-->
						<el-button style="margin-left: 1px;padding: 9px 10px;" type="primary" size="small" @click="printPlan">导出计划</el-button>
						<el-button style="margin-left: 1px;padding: 9px 10px;" type="primary" size="small" @click="printLetters">托书打印</el-button>
						<el-button style="margin-left: 1px;padding: 9px 10px;" type="primary" size="small" @click="showTagPrint">标签打印</el-button>
						<!--<el-button type="primary" size="small">托书信息</el-button>-->
					</el-form-item>
				</el-col>
			</el-row>
			<el-row v-show="showFlag">
				<el-col class="elementWidth">
          <el-form-item label-width="10px">
            <el-input style="width: 180px;" v-model="query.arrivalStation" auto-complete="off" @input="query.arrivalStation = query.arrivalStation.toUpperCase()" clearable>
              <template slot="prepend">目的港</template>
            </el-input>
          </el-form-item>
				</el-col>
				<!--<el-col class="elementWidth">
					<el-form-item label="舱单状态" label-width="95px">
						<el-select v-model="query.employmentType" clearable placeholder="请选择" style="width: 100px;">
							<el-option label="全部" value=""></el-option>
							<el-option label="已发送" value="已发送"></el-option>
							<el-option label="未发送" value="未发送"></el-option>
						</el-select>
					</el-form-item>
				</el-col>-->

        <el-col class="elementWidth">
          <el-form-item label-width="10px">
            <el-input style="width:200px;">
              <template slot="prepend">货站</template>
              <el-select slot="suffix" v-model="query.departureWarehouseId" style="width:161px;margin-right: -5px;" @focus="checkDeparture" clearable>
                <el-option v-for="(warehouse,index) in warehouseList" :label="warehouse.warehouseNameCn" :value="warehouse.warehouseId" :key="index"></el-option>
              </el-select>
            </el-input>
          </el-form-item>
        </el-col>
        <el-col class="elementWidth">
          <el-form-item label-width="10px">
            <el-input style="width:200px;">
              <template slot="prepend">库房</template>
              <el-select slot="suffix" v-model="query.departureStorehouseId" style="width:161px;margin-right: -5px;" clearable>
                <el-option v-for="(storehouse,index) in storehouseList" :label="storehouse.warehouseNameCn" :value="storehouse.warehouseId" :key="index"></el-option>
              </el-select>
            </el-input>
          </el-form-item>
        </el-col>
        <el-col class="elementWidth">
          <el-form-item label-width="10px">
            <el-input style="width:204px;">
              <template slot="prepend">入库日期</template>
              <el-date-picker slot="suffix" style="width: 135px;margin-right: -5px;" v-model="query.inboundDateStart" type="date" value-format="yyyy-MM-dd" placeholder="开始日期">
              </el-date-picker>
            </el-input>
            <span>-</span>
            <el-date-picker style="width: 135px;" v-model="query.inboundDateEnd" type="date" value-format="yyyy-MM-dd" placeholder="结束日期">
            </el-date-picker>
          </el-form-item>
        </el-col>
        <el-col class="elementWidth">
          <el-form-item label-width="5px">
            <el-button style="margin-left: 25px;padding: 9px 10px;background: #FFFFFF;color: #409EFF;" type="primary" size="small" v-on:click="setting" plain>设置</el-button>
            <el-button style="margin-left: 5px;padding: 9px 10px;background: #FFFFFF;color: #409EFF;" type="primary" size="small" v-on:click="exportExcel" plain>导出</el-button>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row v-show="showFlag">
        <el-col class="elementWidth">
          <el-form-item label-width="10px">
            <el-input style="width: 180px;" v-model="query.coopName" auto-complete="off" clearable @input="query.coopName = query.coopName.toUpperCase()">
              <template slot="prepend">客户</template>
            </el-input>
          </el-form-item>
        </el-col>
       <el-col class="elementWidth">
         <el-form-item label-width="10px">
           <el-input style="width:200px;">
             <template slot="prepend">责任客服</template>
             <el-select slot="suffix" v-model="query.servicerId" style="width:131px;margin-right: -5px;" clearable>
               <el-option v-for="item in useroptions" :key="item.value" :label="item.label" :value="item.value">
                 <span style="float: left">{{ item.label }}</span>
                 <span style="float: right; color: #8492a6; font-size: 13px">{{ item.label2 }}</span>
               </el-option>
             </el-select>
           </el-input>
         </el-form-item>
       </el-col>
       <el-col class="elementWidth">
         <el-form-item label-width="10px">
           <el-input style="width:200px;">
             <template slot="prepend">责任销售</template>
             <el-select slot="suffix" v-model="query.salesId" style="width:131px;margin-right: -5px;" clearable>
               <el-option v-for="item in useroptions" :key="item.value" :label="item.label" :value="item.value">
                 <span style="float: left">{{ item.label }}</span>
                 <span style="float: right; color: #8492a6; font-size: 13px">{{ item.label2 }}</span>
               </el-option>
             </el-select>
           </el-input>
         </el-form-item>
       </el-col>
       <el-col class="elementWidth">
         <el-form-item label-width="10px">
           <el-input style="width:204px;">
             <template slot="prepend">航班日期</template>
             <el-date-picker slot="suffix" style="width: 135px;margin-right: -5px;" v-model="query.flightDateBegin" type="date" value-format="yyyy-MM-dd" placeholder="开始日期">
             </el-date-picker>
           </el-input>
           <span>-</span>
           <el-date-picker style="width: 135px;" v-model="query.flightDateEnd" type="date" value-format="yyyy-MM-dd" placeholder="结束日期">
           </el-date-picker>
         </el-form-item>
       </el-col>
			</el-row>
      </div>
		</el-form>
    <el-row style="margin: 10px 0px 22px 12px">
      <el-col style="width: 70px">勾选合计：</el-col>
      <el-col :span="3">
        <span>预报件数：{{aggregateChecked.number}}</span>
      </el-col>
      <el-col :span="3">
        <span>预报毛重：{{aggregateChecked.weight}}</span>
      </el-col>
      <el-col :span="3">
        <span>预报体积：{{aggregateChecked.volume}}</span>
      </el-col>
    </el-row>
		<el-table border v-loading="loading" class="table_settle" :data="data1" highlight-current-row
              @selection-change="handleSelectionChange"
              :cell-class-name="addPullRightClass"
              @header-dragend="cellWidth"
              :max-height="tableHeight"
    >
			<el-table-column type="selection" width="50" align="center"></el-table-column>
      <template v-for="(item,index) in tableColumns">
        <el-table-column v-if="item.label!='主运单号' && item.label!='操作要求'" :key="index" :prop="item.prop" :label="item.label" :width="item.width" :align="item.align" :sortable="item.sortable" :formatter="formatter_column">
        </el-table-column>
        <el-table-column v-if="item.label=='操作要求'" :key="index" :prop="item.prop" :label="item.label" :width="item.width" :align="item.align" :sortable="item.sortable">
          <template slot-scope="scope">
            <p v-if="scope.row.operationRemark != '' && scope.row.operationRemark != null">
              <font>库内操作：{{scope.row.operationRemark}}</font>
            </p>
            <p v-if="scope.row.outfieldRemark !== '' && scope.row.outfieldRemark != null">
              <font>库外操作：{{scope.row.outfieldRemark}}</font>
            </p>
          </template>
        </el-table-column>
        <el-table-column v-if="item.label=='主运单号'" :key="index" :label="item.label" :width="item.width" :align="item.align" :sortable="item.sortable">
          <template slot-scope="scope">
            <a href="javascript:void(0)" @click="cellClick(scope.row,item.label)" style="color: #137DFA;text-decoration: underline;">{{scope.row[item.prop]}}</a>
          </template>
        </el-table-column>
      </template>
			<!--<el-table-column label="操作" align="center" fixed width="50">
					<template slot-scope="scope">
						<el-dropdown trigger="click" @command="handleCommand" @visible-change="handleChange(scope.row)">
							<i class="el-icon-s-operation"></i>
							<el-dropdown-menu slot="dropdown">
								<el-dropdown-item command="edit">编辑</el-dropdown-item>
							</el-dropdown-menu>
						</el-dropdown>
					</template>
				</el-table-column>-->
			<!--<el-table-column align="center" prop="awbNumber" fixed label="主运单号"  width="150">
        <template slot-scope="scope">
        	<span style="text-decoration: underline;">{{scope.row.awbNumber}}</span>
        </template>
      </el-table-column>
			&lt;!&ndash;<el-table-column align="center" prop="coopName" fixed label="客户" width="230"></el-table-column>&ndash;&gt;
			<el-table-column align="center" prop="customerNumber" fixed label="客户单号" width="150"></el-table-column>
			<el-table-column align="center" prop="receiptDate" width="130" label="到货日期"></el-table-column>
			<el-table-column align="center" prop="planPieces" label="预报件数" width="100"></el-table-column>
			<el-table-column align="center" prop="packageType" label="包装类型" width="220"></el-table-column>
			<el-table-column align="center" prop="planWeight" label="预报毛重" width="100"></el-table-column>
			<el-table-column align="center" prop="planVolume" label="预报体积" width="100"></el-table-column>
			<el-table-column align="center" prop="goodsNameCn" label="中文品名"></el-table-column>
			<el-table-column align="center" prop="batteryType" label="电池情况"></el-table-column>
			&lt;!&ndash;<el-table-column align="center" prop="hawbQuantity" label="分单情况"></el-table-column>&ndash;&gt;
			<el-table-column align="center" prop="operationRemark" label="提货要求"></el-table-column>
      <el-table-column align="left" prop="salesName" label=" 责任销售" width="200"></el-table-column>
      <el-table-column align="left" prop="servicerName" label="责任客服" width="200"></el-table-column>-->

			<!--<el-table-column align="center" prop="expectFlight" label="预定航班" width="120"></el-table-column>-->
			<!--<el-table-column align="center" prop="expectDeparture" width="120" label="ETD"></el-table-column>-->
			<!--<el-table-column align="center" prop="servicerName" label="责任客服" width="220"></el-table-column>-->

		</el-table>
		<div class="pagination" ref="table_footer">
			<el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="pageConf.pageCode" :page-sizes="pageConf.pageOption" :page-size.sync="pageConf.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="pageConf.totalPage">
			</el-pagination>
		</div>
		<tagPrint ref="addMission" v-if="tagPrintVisible" :visible.sync="tagPrintVisible" :frow="frow"></tagPrint>
    <editVisibleTag ref="addMission" v-if="editVisible" :visible.sync="editVisible" :frow="frow"></editVisibleTag>
    <selectTemplate ref="addMission" v-if="selectTemplateVisible" :visible.sync="selectTemplateVisible" :frow="frow"></selectTemplate>
    <setVisibleTag ref="addMission" v-if="setVisible" :visible.sync="setVisible"></setVisibleTag>
	</div>
</template>
<script>
	import TagPrint from './operationPlan/af_operationPlan_tagPrint'
  import SelectTemplate from './order/printLetter_template_select'
  import editVisibleVue from './order/af_order_edit_tabs'
  import setVisibleVue from './order/af_operationPlan_setting'
  import columns from './order/af_operationPlan_column.json'
	export default {
		data() {
			return {
        aggregateChecked: {
          number: '0', //预报件数
          weight: '0.00', //计重(预)
          volume: '0.00', //体积(预)
        },
				/*表数据*/
				data1: [],
        useroptions: [],
        tableColumns: [],
				pageConf: {
					//设置一些初始值(会被覆盖)
					pageCode: 1, //当前页
					pageSize: 10, //每页显示的记录数
					totalPage: 0, //总记录数
          pageOption: [10, 50, 100,500], //分页选项
				},
				query: {
					coopName: '',
					departureStation: '',
					//employmentType: '',
					departureWarehouseId: '',
					arrivalStation: '',
					awbNumber: '',
					departureStorehouseId: '',
					receiptDateStart: this.getCurrDateAndCurrMonthLastDay()[0],
          receiptDateEnd:'',
          salesId:'',
          servicerId:'',
          inboundDateStart:'',
          inboundDateEnd:'',
          flightDateBegin:'',
          flightDateEnd:'',
          salesName:'',
          servicerName:'',
          businessScope:'AE'
					//receiptDateEnd: this.getCurrDateAndCurrMonthLastDay()[1]
					// receiptDateStart: this.getCurrDateAndCurrMonthLastDay()[0],
					// receiptDateEnd: this.getCurrDateAndCurrMonthLastDay()[1]
				},
				selectionIds: [],
				multipleSelection: [],
				storehouseList: [],
				warehouseList: [],
				tagPrintVisible: false,
				showFlag: false,
				frow: {},
				loading: false,
        selectTemplateVisible: false,
        editVisible: false,
        setVisible: false,
        tableHeight: '550px',
			}
		},
		components: {
			'tagPrint': TagPrint,
      'selectTemplate': SelectTemplate,
      'editVisibleTag': editVisibleVue,
      'setVisibleTag': setVisibleVue,
		},
		provide() {
			return {
				findByPage: this.findByPage,
        setValue: this.setValue,
			}
		},
		methods: {
      setting() {
          this.setVisible = true;

      },
      sortBykey(ary, key) {
          return ary.sort(function(a, b) {
              let x = a[key]
              let y = b[key]
              return ((x < y) ? -1 : (x > y) ? 1 : 0)
          })
      },
      //标题样式
      addPullRightClass({
          row,
          column,
          rowIndex,
          columnIndex
      }) {
          if (column.property === "awbNumber" || column.property === "orderCode") {
              return "awbNumber"
          }
      },

      cellWidth(newWidth, oldWidth, column, event) {
          let strColumn = JSON.stringify(this.tableColumns);
          let userId = window.localStorage.getItem('userId');
          let arrayC = JSON.parse(strColumn);
          if (arrayC && arrayC.length > 0) {
              arrayC.forEach(function (item, index) {
                  if (column.label == item.label) {
                      item.width = newWidth;
                  }
              });
              arrayC = this.sortBykey(arrayC, 'index');
              localStorage.setItem(userId + '_operationPlan_list_column_width', JSON.stringify(arrayC))
          }
      },

      formatter_column(row, column) {
        let key = column.property;
        if (column.property==='salesName'){
            if(row.salesName){
                return row.salesName.split(' ')[0];
            }else{
                return "";
            }
        }else if (column.property==='servicerName'){
            if(row.servicerName){
                return row.servicerName.split(' ')[0];
            }else{
                return "";
            }
        }else if(key == 'planPieces' || key == 'planWeight' || key == 'planVolume'){
          return this.formatToKCs(row[key]);
        }else{
            return row[column.property];
        }
      },
      formatter_column1(row, column){
          if (column.property==='operationRemark'){
              let operationRemark='';
              if(row.operationRemark){
                  operationRemark += '库内操作：'+row.operationRemark+'\r\n'
              }
              if(row.outfieldRemark){
                  operationRemark += '库外操作：'+row.outfieldRemark
              }
              return operationRemark;
          }
      },
      // setServicerName(vId) {
      // 	let obj = {};
      // 	obj = this.useroptions.find((item) => {
      // 		return item.value === vId;
      // 	});
      // 	this.query.servicerName = obj.label3;
      // },
      // setSalesName(vId) {
      // 	let obj = {};
      // 	obj = this.useroptions.find((item) => {
      // 		return item.value === vId;
      // 	});
      // 	this.query.salesName = obj.label3;
      // },
      handlerCellClick(row, column, cell, event) {
        if ("主运单号" == column['label']) {
          if (row.awbNumber) {
            this.awbNumberClick(row);
          }
        }
      },
      cellClick(row,label){
          if ("主运单号" ==label) {
              this.awbNumberClick(row);
          }
      },
			handleCommand(command) {},
			handleChange(command) {
				this.frow = command
			},
			showTagPrint() {
				if(this.multipleSelection.length == 0) {
					this.openError("请选择一个选项再操作！")
					return
				} else {
					try {
						this.multipleSelection.forEach((item) => {
							if((item.awbNumber == null || item.awbNumber === '')) {
								throw new Error("ending")
							}
						})
					} catch(e) {
						if(e.message == "ending") {
							this.openError("请选择有主单号的选项再操作！")
							return
						}
					}
				}
				this.frow.data = this.multipleSelection
        this.frow.pageName = '操作计划';
				this.tagPrintVisible = true;
			},
      awbNumberClick(row){
       if(row.awbNumber){
         this.frow = row;
         this.frow.viewFlag = true;
         this.frow.activeName = "editTab";
         this.$axios.get('/afbase/aforder/selectOrderStatus?node_name=财务锁账&order_uuid=' + this.frow.orderUuid).then(function(response) {
         	if(!response.data.data) {
         		this.frow.editButtonFlag2 = true;
         		this.frow.letterButtonFlag2 = true;
         		this.frow.weighttagButtonFlag2 = true;
         		if(localStorage.getItem("orderEditNewPage")&&localStorage.getItem("orderEditNewPage")=='true'){
         			this.frow.ifFullscreen = true
         		    this.jumpToNewPage('edit', this.frow)
         		}else{
         			this.frow.ifFullscreen = false
         		    this.editVisible = true;
         		}
         	} else {
         		this.openError("订单已财务锁账");
         	}
         }.bind(this));
       }
      },
	  jumpToNewPage(name, frow) {
	  	let param = {
	  		flag: true,
	  		name: name,
	  		frow: this.base64Encode(JSON.stringify(frow))
	  	}
	  	let routeUrl = this.$router.resolve({
	  		path: "/af_order",
	  		query: param
	  	});
	  	window.open(routeUrl.href, '_blank');
	  },
	  base64Encode(input) {
	  	let _keyStr = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/="
	  	let output = "";
	  	let chr1, chr2, chr3, enc1, enc2, enc3, enc4;
	  	let i = 0;
	  	input = this.utf8Encode(input);
	  	while (i < input.length) {
	  		chr1 = input.charCodeAt(i++);
	  		chr2 = input.charCodeAt(i++);
	  		chr3 = input.charCodeAt(i++);
	  		enc1 = chr1 >> 2;
	  		enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
	  		enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
	  		enc4 = chr3 & 63;
	  		if (isNaN(chr2)) {
	  			enc3 = enc4 = 64;
	  		} else if (isNaN(chr3)) {
	  			enc4 = 64;
	  		}
	  		output = output +
	  			_keyStr.charAt(enc1) + _keyStr.charAt(enc2) +
	  			_keyStr.charAt(enc3) + _keyStr.charAt(enc4);
	  	}
	  	return output;
	  },
	  utf8Encode(string) {
	  	string = string.replace(/\r\n/g, "\n");
	  	let utftext = "";
	  	for (let n = 0; n < string.length; n++) {
	  		let c = string.charCodeAt(n);
	  		if (c < 128) {
	  			utftext += String.fromCharCode(c);
	  		} else if ((c > 127) && (c < 2048)) {
	  			utftext += String.fromCharCode((c >> 6) | 192);
	  			utftext += String.fromCharCode((c & 63) | 128);
	  		} else {
	  			utftext += String.fromCharCode((c >> 12) | 224);
	  			utftext += String.fromCharCode(((c >> 6) & 63) | 128);
	  			utftext += String.fromCharCode((c & 63) | 128);
	  		}

	  	}
	  	return utftext;
	  },
			findByPage() {
        //从数据库查询设置信息
        let pageName = '订单操作管理/空运出口/操作计划';
        this.$axios.get2("/hrs/user/getUserPageSet?pageName=" + pageName)
            .then(function(response) {
                let operationPlan_list_column = response.data.data;
                if(operationPlan_list_column && operationPlan_list_column.length>0){
                    this.tableColumns = this.sortBykey(operationPlan_list_column, 'index');
                }else{
                    this.tableColumns = this.sortBykey(columns.afOperationPlanInfo, 'index');
                }
                this.loading = true
                this.$axios.get2("/afbase/operationPlan?size=" + this.pageConf.pageSize + "&current=" + this.pageConf.pageCode, this.query)
                    .then(function(response) {
                        this.data1 = response.data.data.records;
                        this.pageConf.totalPage = response.data.data.total;
                        if(this.data1.length == 0) {
                            let current = Math.ceil(this.pageConf.totalPage / this.pageConf.pageSize);
                            this.findByPage2(current);
                        } else {
                            this.loading = false
                        }
                    }.bind(this));
            }.bind(this));

        /*let userId = window.localStorage.getItem('userId');
        let af_list_column = window.localStorage.getItem(userId + '_af_operationPlan_list_column');
        if (af_list_column) {
            let arrayC = JSON.parse(af_list_column)
            if (arrayC && arrayC.length > 0) {
                this.tableColumns = this.sortBykey(arrayC, 'index');
            }
        } else {
            this.tableColumns = this.sortBykey(columns.afOperationPlanInfo, 'index');
        }

				this.loading = true
				this.$axios.get2("/afbase/operationPlan?size=" + this.pageConf.pageSize + "&current=" + this.pageConf.pageCode, this.query)
					.then(function(response) {
						this.data1 = response.data.data.records;
						this.pageConf.totalPage = response.data.data.total;
						if(this.data1.length == 0) {
							let current = Math.ceil(this.pageConf.totalPage / this.pageConf.pageSize);
							this.findByPage2(current);
						} else {
							this.loading = false
						}
					}.bind(this));*/
			},
			findByPage2(current) {
				this.$axios.get2("/afbase/operationPlan?size=" + this.pageConf.pageSize + "&current=" + current, this.query)
					.then(function(response) {
						this.loading = false
						this.data1 = response.data.data.records;
						this.pageConf.totalPage = response.data.data.total;
					}.bind(this));
			},
			doDelete(row) {
				this.$confirm('此操作将永久删除,不可恢复, 是否继续?', '注意', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning',
					center: true
				}).then(() => {
					this.$axios.deletes('/hrs/user/' + row.userId)
						.then(function(response) {
							if(response.data.code == 0) {
								this.openSuccess();
								this.findByPage();
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
              let excelList = this.sortBykey(columns.afOperationPlanInfo, 'index')
              this.query.columnStrs = JSON.stringify(excelList)
              this.exportExcelSure();
          });
      },
      exportExcelSure() {
          this.$axios.post3('/afbase/operationPlan/exportOperationPlanExcel', this.query)
              .then(function(response) {
                  var blob = new Blob([response.data], {
                      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8'
                  });
                  var downloadElement = document.createElement('a');
                  var href = window.URL.createObjectURL(blob); // 创建下载的链接
                  downloadElement.href = href;
                  downloadElement.download = '操作计划' + '.xls'; // 下载后文件名
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
			//pageSize改变时触发的函数
			handleSizeChange() {
				this.findByPage();
			},
			//当前页改变时触发的函数
			handleCurrentChange() {
				this.findByPage();
			},
			formatStatus(row, column) {
				return row.userStatus == true ? "生效" : row.userStatus == false ? "失效" : "";
			},
			formatIsFinalProfitunit(row, column) {
				return row.isFinalProfitunit == true ? "是" : row.isFinalProfitunit == false ? "否" : "";
			},
			formatDate(row, column) {
				if(row[column.property]) {
					return(row[column.property]).substr(0, 10)
				} else {
					return ""
				}

			},
			getCurrDateAndCurrMonthLastDay() {
				//获取当前日期
				let date = new Date();
				let months = parseInt(date.getMonth() + 1);
				let days = date.getDate();
				if(months < 10) {
					months = '0' + months
				}
				if(days < 10) {
					days = '0' + days
				}
				let datas = date.getFullYear() + '-' + months + '-' + days + " 00:00:00";

				//获取当月最后一天
				let currentMonth = date.getMonth();
				let nextMonth = ++currentMonth;
				let nextMonthFirstDay = new Date(date.getFullYear(), nextMonth, 1);
				let oneDay = 1000 * 60 * 60 * 24;
				let lastTime = new Date(nextMonthFirstDay - oneDay);
				let month = parseInt(lastTime.getMonth() + 1);
				let day = lastTime.getDate();
				if(month < 10) {
					month = '0' + month
				}
				if(day < 10) {
					day = '0' + day
				}
				//当月最后一天
				let data = date.getFullYear() + '-' + month + '-' + day + " 23:59:59";
				let result = []
				result.push(datas)
				result.push(data)
				return result
			},
			handleSelectionChange(val) {
				this.multipleSelection = val;
				val.forEach((row) => {
					this.selectionIds.push(row.orderId)
				})
        this.aggregate(val);
			},
			printPlan() {
				let orderIds = '';
				for(var i = 0; i < this.multipleSelection.length; i++) {
					if(orderIds == '') {
						orderIds = orderIds + this.multipleSelection[i].orderId;
					} else {
						orderIds = orderIds + ',' + this.multipleSelection[i].orderId;
					}
				}
				if(orderIds.length == 0) {
					this.$message.error('请选择要操作的记录');
					return;
				}
				let params = {
					'orderIds': orderIds,
				}
				this.$axios.post3('/afbase/operationPlan/printPlan', params)
					.then(function(response) {
						var blob = new Blob([response.data], {
							type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8'
						});
						var downloadElement = document.createElement('a');
						var href = window.URL.createObjectURL(blob); // 创建下载的链接
						downloadElement.href = href;
						downloadElement.download = '操作计划列表' + '.xls'; // 下载后文件名
						document.body.appendChild(downloadElement);
						downloadElement.click(); // 点击下载
						document.body.removeChild(downloadElement); // 下载完成移除元素
						window.URL.revokeObjectURL(href); // 释放掉blob对象
					}.bind(this));
			},
			printLetters() {

				let flag = 1;
				let customerNumbers = '';
				let awbUUIds = '';
				for(var i = 0; i < this.multipleSelection.length; i++) {
					if(awbUUIds == '') {
						awbUUIds = awbUUIds + this.multipleSelection[i].awbUuid;
					} else {
						awbUUIds = awbUUIds + ',' + this.multipleSelection[i].awbUuid;
					}
					if(this.multipleSelection[i].awbNumber == null || this.multipleSelection[i].awbNumber.length != 12) {
						flag = 0;
						if(customerNumbers == '') {
							customerNumbers = customerNumbers + this.multipleSelection[i].customerNumber;
						} else {
							customerNumbers = customerNumbers + ',' + this.multipleSelection[i].customerNumber;
						}
					}
				}
				if(flag == 1) {
					//打印
					if(awbUUIds.length == 0) {
						this.$message.error('请选择要操作的记录');
						return;
					}
					let host = window.location.host;
					let hostName = host.split(":")[0];
					let orgId = window.localStorage.getItem("orgId");

					let params={
					    "awbUUIds":awbUUIds
					  };
					this.$axios.post2('/afbase/operationPlan/checkLetters',params)
					.then(function(response) {
						if(response.data.code == 0) {
                if(response.data.data == '货站存在托书模板'){
                    this.$axios.get('/afbase/operationPlan/printLetters1/' + awbUUIds).then((response) => {
                        window.open(response.data.data)
                    }).catch(function(error) {
                        console.log(error);
                    });
                }else if(response.data.data.indexOf('没有选择交货货站，无法打印交货托书') >-1 || response.data.data == '当前机场没有可使用的托书模板，请联系翌飞管理员' || response.data.data.indexOf('没有可使用的托书模板，无法打印交货托书') >-1){
                    this.openError(response.data.data);
                }else if(response.data.data == '当前机场有一个可使用的托书模板'){
                    this.$axios.get('/afbase/operationPlan/printLetters2/' + awbUUIds).then((response) => {
                        window.open(response.data.data)
                    }).catch(function(error) {
                        console.log(error);
                    });
                }else if(response.data.data == '当前机场有多个可使用的托书模板'){
                    this.frow.awbUuid = awbUUIds
                    this.selectTemplateVisible = true;
                }
              /*this.$axios.get('/afbase/operationPlan/printLetters1/' + awbUUIds).then((response) => {
                window.open(response.data.data)
              }).catch(function(error) {
                console.log(error);
              });*/
						} else {

						}

					}.bind(this)).catch(function(error) {
					  console.log(error);
						let errorinfo = error.response.data.messageInfo;
						if (errorinfo.indexOf('没有托书模板')>-1) {
							this.$message.error(errorinfo+"不能打印");
						}

					}.bind(this));

				} else {
					this.$message.error(customerNumbers + '必须录入主单号');
				}
			},
      setValue(rrow) {
          this.$axios.get('/afbase/operationPlan/printLetters3?awbUuid=' + this.frow.awbUuid + '&shipperTemplateFile=' + rrow.shipperTemplateFile).then((response) => {
              window.open(response.data.data)
          }).catch(function(error) {
              console.log(error);
          });

      },
			openPostWindow(url, orgId, awbUUIds) {

				var newWin = window.open(),
					formStr = '';
				//设置样式为隐藏，打开新标签再跳转页面前，如果有可现实的表单选项，用户会看到表单内容数据
				formStr = '<form style="visibility:hidden;" method="POST" action="' + url + '">' +
					'<input type="hidden" name="orgId" value="' + orgId + '" />' +
					'<input type="hidden" name="awbUUIds" value="' + awbUUIds + '" />' +
					'</form>';

				newWin.document.body.innerHTML = formStr;
				newWin.document.forms[0].submit();

				return newWin;
			},
			findWarehouse() {
				this.query.departureWarehouseId = ''
				this.warehouseList = []
				if(this.query.departureStation != '') {
					this.$axios.get2('/afbase/operationPlan/findWarehouse', {
						departure: this.query.departureStation
					}).then(function(response) {
						this.warehouseList = response.data.data;
					}.bind(this)).catch(function(error) {
						console.log(error);
					});
				}
			},
			checkDeparture() {
				if(this.query.departureStation == '') {
					this.openError("请录入始发港")
				}
			},
      aggregate(rows){
        let planPieces = 0, planVolume = 0, planWeight = 0;
        rows.forEach((item)=>{
          planPieces += item.planPieces;
          planVolume += item.planVolume;
          planWeight += item.planWeight;
        })
        this.aggregateChecked.number = this.formatToKCs(planPieces);
        this.aggregateChecked.volume = this.formatToKCs(planVolume.toFixed(3));
        this.aggregateChecked.weight = this.formatToKCs(planWeight.toFixed(3));
      },
      formatToKCs(data){
        return data.toString().replace(/\d{1,3}(?=(\d{3})+(\.\d*)?$)/g, '$&,');
      },
      setHeight() {
        this.$nextTick(() => {
          let table_header = this.$refs.table_header.offsetHeight;
          let table_footer = this.$refs.table_footer.offsetHeight;
          let heightS = window.innerHeight - 90 - table_header - table_footer;

          this.tableHeight = heightS + "px";
        });
      },
		},
		created() {
      //从数据库查询设置信息
      let pageName = '订单操作管理/空运出口/操作计划';
      this.$axios.get2("/hrs/user/getUserPageSet?pageName=" + pageName)
          .then(function(response) {
              let operationPlan_list_column = response.data.data;
              if(operationPlan_list_column && operationPlan_list_column.length>0){
                  this.tableColumns = this.sortBykey(operationPlan_list_column, 'index');
              }else{
                  this.tableColumns = this.sortBykey(columns.afOperationPlanInfo, 'index');
              }
          }.bind(this));
      /*let userId = window.localStorage.getItem('userId');
      let af_list_column = window.localStorage.getItem(userId + '_af_operationPlan_list_column');
      if (af_list_column) {
          let arrayC = JSON.parse(af_list_column)
          if (arrayC && arrayC.length > 0) {
              this.tableColumns = this.sortBykey(arrayC, 'index');
          }
      } else {
          this.tableColumns = this.sortBykey(columns.afOperationPlanInfo, 'index');
      }*/

      this.$axios.get('/hrs/dept/selectUser').then(function(response) {
      	this.useroptions = response.data.data;
      }.bind(this));
      this.$axios.get2('/afbase/operationPlan/findStorehouse', {
      	departure: this.query.departureStation
      }).then(function(response) {
      	this.storehouseList = response.data.data;
      }.bind(this)).catch(function(error) {
      	console.log(error);
      });
    }
	}
</script>
<style>

  .awbNumber {
    text-decoration: underline;
  }

  .afOperationPlan-ruleForm .el-input__icon {
    line-height: 30px !important;
  }

  .afOperationPlan-ruleForm .el-form-item__content {
    line-height: 30px !important;
  }

  .afOperationPlan-ruleForm .el-input-group__prepend {
    padding: 0 6px;
  }
</style>
