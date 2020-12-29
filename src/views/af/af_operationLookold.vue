<template>
  <div class="warp-main">
    <el-form :inline="false" :model="query" label-width="80px" class="orderListPage">
      <div ref="ae_order_header">
        <el-row>
          <el-col class="elementWidth">
            <el-form-item label-width="10px">
              <el-input v-model="query.awbNumber" auto-complete="off" clearable style="width:210px;">
                <template slot="prepend">主运单号</template>
              </el-input>
            </el-form-item>
          </el-col>
          <el-col class="elementWidth">
            <el-form-item label-width="10px">
              <el-input v-model="query.departureStation" auto-complete="off" clearable style="width:152px;" @input="query.departureStation=query.departureStation.toUpperCase()">
                <template slot="prepend">始发港</template>
              </el-input>
            </el-form-item>
          </el-col>
          <el-col class="elementWidth">
            <el-form-item label-width="10px">
              <el-input v-model="query.arrivalStation" auto-complete="off" clearable style="width:152px;" @input="query.arrivalStation=query.arrivalStation.toUpperCase()">
                <template slot="prepend">目的港</template>
              </el-input>
            </el-form-item>
          </el-col>
          <el-col class="elementWidth">
            <el-form-item label-width="10px">
              <el-input style="width:210px;">
                <template slot="prepend">航班日期</template>
                <el-date-picker slot="suffix" v-model="query.flightDateBegin" clearable type="date" value-format="yyyy-MM-dd" placeholder="开始" style="width: 131px;margin-right: -5px;">
                </el-date-picker>
              </el-input>
              <span>-</span>
              <el-date-picker v-model="query.flightDateEnd" clearable type="date" value-format="yyyy-MM-dd" placeholder="结束" style="width: 135px;">
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col class="elementWidth">
            <el-form-item label-width="10px">
              <el-button type="text" size="small" v-if="showFlag" v-on:click="showFlagSearch">收起</el-button>
              <el-button type="text" size="small" v-if="!showFlag" v-on:click="showFlagSearch">展开</el-button>
              <el-button type="primary" size="small" v-on:click="findByPage" style="margin-left: 2px;padding-left: 8px;padding-right: 8px;">查询</el-button>
              <el-button style="margin-left: 4px;padding-left: 8px;padding-right: 8px;" type="primary" size="small" v-on:click="sendShippings" v-if="sendMoreButtonFlag">发送舱单</el-button>
            </el-form-item>
          </el-col>

        </el-row>
        <el-row v-show="showFlag">
          <el-col class="elementWidth">
            <el-form-item label-width="10px">
              <el-input class="widthWithThree" v-model="query.hawbNumber" auto-complete="off" clearable style="width:210px;" @input="query.hawbNumber=query.hawbNumber.toUpperCase()">
                <template slot="prepend">分单号</template>
              </el-input>
            </el-form-item>
          </el-col>
          <el-col class="elementWidth">
            <el-form-item label-width="10px">
              <el-input v-model="query.coopName" auto-complete="off" clearable style="width:220px;">
                <template slot="prepend">客户</template>
              </el-input>
            </el-form-item>
          </el-col>
          <el-col class="elementWidth">
            <el-form-item label-width="10px">
              <el-input v-model="query.expectFlight" auto-complete="off" clearable style="width:220px;" @input="query.expectFlight=query.expectFlight.toUpperCase()">
                <template slot="prepend">航班号</template>
              </el-input>
            </el-form-item>
          </el-col>
          <el-col class="elementWidth">
            <el-form-item label-width="10px">
              <el-input v-model="query.departureWarehouseName" auto-complete="off" clearable style="width:220px;" @input="query.departureWarehouseName=query.departureWarehouseName.toUpperCase()">
                <template slot="prepend">货站</template>
              </el-input>
            </el-form-item>
          </el-col>
          <el-col class="elementWidth">
            <el-form-item label-width="39px">
              <el-button style="margin-left: 4px;padding-left: 8px;padding-right: 8px;background-color:#FFF;color:#409EFF" type="primary" size="small" v-on:click="setting" v-if="setButtonFlag">设置</el-button>
              <el-button style="margin-left: 4px;padding-left: 8px;padding-right: 8px;background-color:#FFF;color:#409EFF" type="primary" size="small" v-on:click="exportExcel" v-if="excelButtonFlag">导出</el-button>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row v-show="showFlag">
          <el-col class="elementWidth">
            <el-form-item label-width="10px">
              <el-input v-model="query.entryPlate" auto-complete="off" clearable style="width:210px;" @input="query.entryPlate=query.entryPlate.toUpperCase()">
                <template slot="prepend">入库车牌</template>
              </el-input>
            </el-form-item>
          </el-col>
          <el-col class="elementWidth">
            <el-form-item label-width="10px">
              <el-input style="width:131px;">
                <template slot="prepend">预配</template>
                <el-select slot="suffix" v-model="query.presets" placeholder="请选择" style="width:90px;margin-right: -5px;">
                  <el-option label="全部" value=""></el-option>
                  <el-option label="成功" value="3"></el-option>
                  <el-option label="人审" value="2"></el-option>
                  <el-option label="失败" value="1"></el-option>
                </el-select>
              </el-input>
            </el-form-item>
          </el-col>
          <el-col class="elementWidth">
            <el-form-item label-width="10px">
              <el-input style="width:131px;">
                <template slot="prepend">审结</template>
                <el-select slot="suffix" v-model="query.audit" placeholder="请选择" style="width:90px;margin-right: -5px;">
                  <el-option label="全部" value=""></el-option>
                  <el-option label="已审结" value="1"></el-option>
                  <el-option label="未审结" value="0"></el-option>
                </el-select>
              </el-input>
            </el-form-item>
          </el-col>
          <el-col class="elementWidth">
            <el-form-item label-width="10px">
              <el-input style="width:131px;">
                <template slot="prepend">运抵</template>
                <el-select slot="suffix" v-model="query.arrived" placeholder="请选择" style="width:90px;margin-right: -5px;">
                  <el-option label="全部" value=""></el-option>
                  <el-option label="已运抵" value="1"></el-option>
                  <el-option label="未运抵" value="0"></el-option>
                </el-select>
              </el-input>
            </el-form-item>
          </el-col>
          <el-col class="elementWidth">
            <el-form-item label-width="10px">
              <el-input style="width:131px;">
                <template slot="prepend">放行</template>
                <el-select slot="suffix" v-model="query.passed" placeholder="请选择" style="width:90px;margin-right: -5px;">
                  <el-option label="全部" value=""></el-option>
                  <el-option label="已放行" value="1"></el-option>
                  <el-option label="未放行" value="0"></el-option>
                </el-select>
              </el-input>
            </el-form-item>
          </el-col>
          <el-col class="elementWidth">
            <el-form-item label-width="10px">
              <el-input style="width:131px;">
                <template slot="prepend">查验</template>
                <el-select slot="suffix" v-model="query.checked" placeholder="请选择" style="width:90px;margin-right: -5px;">
                  <el-option label="全部" value=""></el-option>
                  <el-option label="已查验" value="1"></el-option>
                  <el-option label="未查验" value="0"></el-option>
                </el-select>
              </el-input>
            </el-form-item>
          </el-col>
          <el-col class="elementWidth">
            <el-form-item label-width="10px">
              <el-input style="width:131px;">
                <template slot="prepend">AMS</template>
                <el-select slot="suffix" v-model="query.ams" placeholder="请选择" style="width:90px;margin-right: -5px;">
                  <el-option label="全部" value=""></el-option>
                  <el-option label="成功" value="1"></el-option>
                  <el-option label="退单" value="0"></el-option>
                </el-select>
              </el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </div>
    </el-form>
    <el-table v-loading="loading" :data="data1" show-summary :summary-method="getSummaries" class="AEOrderList table_settle" highlight-current-row
              @selection-change="handleSelectionChange" stripe border :max-height="tableHeight" :cell-class-name="addCellClass"
              @header-dragend="cellWidth">
      <el-table-column fixed type="selection" align="center" width="50">
      </el-table-column>
      <el-table-column label="操作" align="center" fixed width="60">
        <template slot-scope="scope">
          <el-dropdown :hide-on-click="false" trigger="click" @command="handleCommand" @visible-change="handleChange(scope.row)">
            <i class="el-icon-s-operation"></i>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item command="edit" v-if="shippingMakeButtonFlag">编辑舱单</el-dropdown-item>
              <el-dropdown-item command="send" v-if="shippingSendButtonFlag">发送舱单</el-dropdown-item>
              <el-dropdown-item command="delete" v-if="shippingDeleteButtonFlag">删除舱单</el-dropdown-item>
              <el-dropdown-item command="appointment" v-if="appointmentButtonFlag">入区预约</el-dropdown-item>
              <el-dropdown-item command="ams" v-if="amsButtonFlag">发送AMS</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </template>
      </el-table-column>
      <template v-for="(item,index) in tableColumns">
        <el-table-column v-if="item.label != '状态' && item.label != '分单号'"  :prop="item.prop" :label="item.label" :width="item.width"
                         :header-align="item.headerAlign" :align="item.align" :sortable="item.sortable" :formatter="formatter_column"> </el-table-column>

        <el-table-column v-if="item.label == '状态'" :key="index" :prop="item.prop" :label="item.label" :width="item.width" :header-align="item.headerAlign" :align="item.align" :sortable="item.sortable">
          <template slot-scope="scope">
            <a href="javascript:void(0)" @click="cellClick(scope.row,item.label)" style="color: #137DFA;text-decoration: underline;"> {{formatter_column(scope.row, {property: 'presets'})}} </a>
          </template>
        </el-table-column>

        <el-table-column v-else-if="item.label == '分单号'" :key="index" :prop="item.prop" :label="item.label" :width="item.width" :header-align="item.headerAlign" :align="item.align" :sortable="item.sortable">
          <template slot-scope="scope">
            <template v-if="!scope.row['hawbNumber']">
              <a href="javascript:void(0)" @click="printLetter(scope.row)" style="color: #137DFA;text-decoration: underline;">打印托书</a>
              <a href="javascript:void(0)" @click="printTag(scope.row)" style="color: #137DFA;text-decoration: underline;">打印标签</a>
            </template>
            <template v-else> <span>{{scope.row[item.prop]}}</span> </template>
          </template>
        </el-table-column>


      </template>
    </el-table>
    <div class="pagination" ref="ae_order_footer">
      <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="pageConf.pageCode" :page-sizes="pageConf.pageOption" :page-size.sync="pageConf.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="pageConf.totalPage">
      </el-pagination>
    </div>
    <trackVisibleTag ref="addMission" v-if="trackVisible" :visible.sync="trackVisible" :frow="frow"></trackVisibleTag>
    <setVisibleTag ref="addMission" v-if="setVisible" :visible.sync="setVisible"></setVisibleTag>
    <shipperLetter ref="addMission" v-if="shipperLetterVisible" :visible.sync="shipperLetterVisible" :frow="ffrow" @doSave="doSave" @shipperLetterCallback="shipperLetterCallback"></shipperLetter>
    <tagPrint ref="addMission" v-if="tagPrintVisible" :visible.sync="tagPrintVisible" :frow="frow"></tagPrint>
    <selectPrintMethod ref="addMission" v-if="selectPrintMethodVisible" :visible.sync="selectPrintMethodVisible" :frow="frow"></selectPrintMethod>
    <waybillMake ref="addMission" v-if="waybillMakeVisible" :visible.sync="waybillMakeVisible" :frow="frow"></waybillMake>
  </div>
</template>
<script>
  import setVisibleVue from './order/af_operationLook_setting'
  import shipperLetter from './order/shipperLetter/af_operate_look_shipper_letter'
  import trackVisibleVue from './order/af_operationLook_track'
  import TagPrint from './operationPlan/af_operationPlan_tagPrint'
  import SelectPrintMethod from './order/select_printLetter_method'
  import waybillMake from './order/billMake/waybillMake'
  import {
    orderDisplayRule
  } from "../../common/order/orderDisplayRule";
  import columns from './order/af_operationLook_column.json'
  import WaybillMake from "./order/billMake/waybillMake";
  export default {
    data() {
      return {
        tableHeight: '550px',
        setButtonFlag: true,
        excelButtonFlag: true,
        sendMoreButtonFlag: true,
        shippingMakeButtonFlag: true,
        shippingSendButtonFlag:true,
        shippingDeleteButtonFlag: true,
        appointmentButtonFlag: true,
        amsButtonFlag: true,

        customerSelectVisible: false,
        orderShareQrcodeVisible:false,
        orderShareQrcodeEmailVisible:false,
        useroptions2: [],
        orderContacts: [],
        /*表数据*/
        data1: [],
        //合计数据
        summaryData: [],
        tableColumns: [],
        multipleSelection: [],
        total: null,
        frow: {},
        pageConf: {
          //设置一些初始值(会被覆盖)
          pageCode: 1, //当前页
          pageSize: 10, //每页显示的记录数
          totalPage: 0, //总记录数
          pageOption: [10, 50, 100,500], //分页选项
          handleCurrentChange: function() {
            console.log("页码改变了");
          }
        },
        ruleForm: {
          pickUpDeliveryService: false,
          pickUpDeliveryCompany: '',
          pickUpAddress: '',
          pickUpDeliveryDate: '',
          pickUpDeliveryAddress: '',
          pickUpDeliveryRemark: '',

          warehouseService: false,
          warehouseOperator: '',
          inboundDate: '',
          outboundDate: '',
          damageRemark: '',
          operationRemark: '',

          outfieldService: false,
          outfieldDeliveryCompany: '',
          outfieldTruckNumber: '',
          outfieldDriver: '',
          receiptDate: '',
          buildUpCompany: '',
          outfieldRemark: '',

          customsClearanceService: false,
          customsClearanceCompany: '',
          customsInspectionDate: '',
          customsClearanceDate: '',
          customsInspectionRemark: '',
          customsDeclaresRemark: '',

          arrivalCustomsClearanceService: false,
          arrivalCustomsClearanceCompany: '',
          arrivalCustomsInspectionDate: '',
          arrivalCustomsClearanceDate: '',
          arrivalCustomsInspectionRemark: '',
          arrivalCustomsDeclaresRemark: '',

          deliveryService: false,
          deliveryCompany: '',
          deliveryDriver: '',
          deliverySigner: '',
          deliveryAddress: '',
          deliveryDate: '',
          deliverySignDate: '',
          deliveryRemark: '',

          orderCode: '',
          projectId: '',
          projectName: '',
          salesName: '',
          servicerName: '',
          coopId: '',
          coopName: '',
          servicerId: '',
          salesId: '',
          awbNumber: '',
          orderContacts: [],
          customerNumber: '',
          isConsol: 0,
          hawbFlag: '直单',
          hawbQuantity: 0,
          departureStation: '',
          transitStation: '',
          transitStation2: '',
          arrivalStation: '',
          expectFlight: '',
          expectDeparture: null,
          expectArrival: '',
          businessProduct: '',

          goodsType: '',
          goodsNameCn: '',
          batteryType: '',
          departureWarehouseId: '',
          departureStorehouseId: '',
          planPieces: '0',
          packageType: '',
          planWeight: '0',
          planChargeWeight: '0',
          planVolume: '0',
          planDimensions: '',
          planDensity: '',
          currecnyCode: 'CNY',
          msrCurrecnyCode: 'CNY',
          priceType: '单价',
          priceValue: '',
          freightUnitprice: '',
          freightAmount: '',
          shipperLetters: [],
          priceType2: '单价',
          priceValue2: '',
          msrUnitprice: '',
          msrAmount: '',
          appraisalNote: '',
          airborneDocument: '',
          shippingMarks: '',
          handlingInfo: '',
          customsStatusCode: '',
          orderRemark: '',
          freightProfitRatioRemark: '',
          msrProfitRatioRemark: '',
          priceRemark: '',
          notifierRemark: '',
          arrivalAgent: '',
          appraisalCompany: '',
          dangerousType: '',
          paymentMethod: 'PP',
          paymentMethodOther: 'PP',
          undgCode: '',
          undgContactName: '',
          undgContactCommunicationType: 'TE',
          undgContactCommunicationNo: '',
          loadingDate: '',
          partialShipment: false,
          afOrderShipperConsignee1: {
            scType: 1,
            scName: '',
            scPrintRemark: ''
          },
          afOrderShipperConsignee2: {
            scType: 0,
            scName: '',
            scPrintRemark: ''
          },
          orderInquiryId: '',
          orderInquiryQuotationId: '',
          orderInquiryRowUuid: '',
          goodsSourceCode: '',
        },
        query: {
          awbNumber: '',
          hawbNumber: '',
          departureStation: '',
          arrivalStation: '',
          expectFlight: '',
          flightDateBegin:'',
          flightDateEnd:'',
          coopName: '',
          departureWarehouseName: '',
          presets: '',
          audit: '',
          arrived: '',
          passed: '',
          checked: '',
          ams: '',
          entryPlate: '',
          columnStrs: ''
        },
        lockDate: this.getDateTime(new Date()),
        setVisible: false,
        waybillMakeVisible: false,
        trackVisible: false,
        shipperLetterVisible: false,
        currRow: '',
        ffrow: {
          awbFromType: ''
        },
        loading: false,
        showFlag: false,
        selectionIds: [],
        useroptions: [],
        tagPrintVisible: false,
        selectPrintMethodVisible: false
      }
    },
    components: {
      'setVisibleTag': setVisibleVue,
      'trackVisibleTag': trackVisibleVue,
      'tagPrint': TagPrint,
      'waybillMake': waybillMake,
      'selectPrintMethod': SelectPrintMethod,
      shipperLetter
    },
    provide() {
      return {
        //setValue: this.setValue,
        findByPage: this.findByPage,
        continueOperation: this.continueOperation
      }
    },
    methods: {
      continueOperation(){},
      showFlagSearch() {
        this.showFlag = !this.showFlag;
        this.setHeight();
      },
      handleSelectionChange(val) {
        this.multipleSelection = val;
        val.forEach((row) => {
          this.selectionIds.push(row.orderId)
        })
      },
      handleChange(command) {
        this.currRow = command
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
          localStorage.setItem(userId + '_af_list_column_width', JSON.stringify(arrayC))
        }
      },
      //标题样式
      addCellClass({row, column, rowIndex, columnIndex}) {
        let className = '';
        switch (column.property) {
          case "audit":
          case "arrived":
          case "passed":
          case "checked":
          case "tag":
            if(row[column.property] == 1){
              className = 'duihao_af duihao_icn';
            }
            break;
          default:
            className = '';
            break;
        }
        return className;
      },
      formatter_column(row, column) {
        let tempString = '';
        switch (column.property) {
          case "planPieces":
            tempString = "-";
            if (row.planPieces || row.planPieces == 0) {
              tempString = this.getNumber4(row.planPieces)
            }
            break;
          case "planWeight":
            let planWeight = "-";
            if (row.planWeight || row.planWeight == 0) {
              planWeight = this.getNumber4(row.planWeight);
            }
            tempString = planWeight;
            break;
          case "planVolume":
            let planVolume = "-";
            if (row.planVolume || row.planVolume == 0) {
              planVolume = this.getNumber4(row.planVolume);
            }
            tempString = planVolume;
            break;
          case "confirmPieces" :
            tempString = this.formatter11(row, column);
            break;
          case "confirmWeight" :
            tempString = this.formatter22(row, column);
            break;
          case "confirmVolume" :
            tempString = this.formatter33(row, column);
            break;
          case "audit":
          case "arrived":
          case "passed":
          case "checked":
          case "tag":
            tempString = '';
            break;
          default:
            tempString =row[column.property];
            break;
        }
        return tempString;
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
      piecesFlag(row) {
        return orderDisplayRule.checkPieces(row.planPieces, row.confirmPieces);
      },
      weightFlag(row) {
        return orderDisplayRule.checkFlag(row.planWeight, row.confirmWeight);
      },
      volumeFlag(row) {
        return orderDisplayRule.volumeFlag(row.planVolume, row.confirmVolume)
      },
      handleCommand(command) {
        if (command == 'edit') {
          this.shipperLetterEdit(this.currRow)
        } else if (command == 'send') {
          this.shippingOneSend(this.currRow)
        } else if (command == 'delete') {
          this.delete(this.currRow)
        } else if (command == 'appointment') {
          this.appointment(this.currRow)
        } else if (command == 'ams'){
          // let buttonInfo = window.localStorage.getItem('buttonInfo')
          // if (buttonInfo == null || buttonInfo.indexOf('af-operation-ams') == -1) {
          //   this.openError("您无权访问")
          //   return
          // }
          // this.waybillMakeVisible = true
          this.sendAms(this.currRow)
        }
      },
      // setValue(orderId,letterId) {
      //   let uPath = '/afbase/aforder/view/' + orderId ;
      //   if(letterId != null){
      //     uPath = uPath + '/' + letterId;
      //   }
      //   this.$axios.get(uPath)
      //     .then(function(response) {
      //       this.ruleForm = response.data.data;
      //     }.bind(this));
      // },
      shipperLetterEdit(row) {//编辑舱单
        this.ffrow = row;
        let orderId = row['orderId']
        let letterId = row['letterId'] //分单id
        if (!letterId) {
          letterId=null;
          this.ffrow.mawbChecked = true
          this.ffrow.index = -1
        } else {
          this.ffrow.mawbChecked = false
          // this.ffrow.index = index
        }
        // this.setValue(orderId,letterId)
        let uPath = '/afbase/aforder/view/' + orderId ;
        if(letterId != null){
          uPath = uPath + '/' + letterId;
        }
        this.$axios.get(uPath)
          .then(function(response) {
            this.ruleForm = response.data.data;
            this.ffrow.shipperLetter = {
              awbNumber: this.ruleForm.awbNumber || this.ruleForm.orderCode,
              hawbNumber: '',
              departureStation: this.ruleForm.departureStation,
              transitStation: this.ruleForm.transitStation,
              arrivalStation: this.ruleForm.arrivalStation,
              expectFlight: this.ruleForm.expectFlight,
              expectDeparture: this.ruleForm.expectDeparture,
              loadingDate: this.ruleForm.loadingDate,
              planPieces: this.ruleForm.planPieces,
              planWeight: this.ruleForm.planWeight,
              planVolume: this.ruleForm.planVolume,
              customsStatusCode: this.ruleForm.customsStatusCode,
              planDimensions: this.ruleForm.planDimensions,
              partialShipment: this.ruleForm.partialShipment,
              paymentMethod: this.ruleForm.paymentMethod,
              undgCode: this.ruleForm.undgCode,
              undgContactName: this.ruleForm.undgContactName,
              undgContactCommunicationType: this.ruleForm.undgContactCommunicationType,
              undgContactCommunicationNo: this.ruleForm.undgContactCommunicationNo,
              afOrderShipperConsignee1: this.ruleForm.afOrderShipperConsignee1,
              afOrderShipperConsignee2: this.ruleForm.afOrderShipperConsignee2,
              goodsNameCn: this.ruleForm.goodsNameCn,
              goodsNameEn: this.ruleForm.goodsNameEn,
              shippingMarks: this.ruleForm.shippingMarks,
              handlingInfo: this.ruleForm.handlingInfo
            }
            this.ffrow.hawbList = JSON.parse(JSON.stringify(this.ruleForm.shipperLetters))
            this.shipperLetterVisible = true
          }.bind(this));

      },

      doSave(){
        this.$axios.post2('/afbase/aforder/saveShippers', this.ruleForm)
          .then(function(response) {
            if (response.data.code == 0) {
              this.openSuccess();
              this.shipperLetterVisible = false
              this.loading = false
            } else {
              this.openError(response.data.messageInfo);
              this.loading = false
            }
          }.bind(this)).catch(function(error) {
          let errorinfo = error.response.data.messageInfo;
          this.openError(errorinfo);
          this.loading = false
          //唯一性错误

        }.bind(this));
      },
      shipperLetterCallback({
                              orderInfo,
                              hawbList
                            }) {
        this.ruleForm.departureStation = orderInfo.departureStation
        this.ruleForm.transitStation = orderInfo.transitStation
        this.ruleForm.arrivalStation = orderInfo.arrivalStation
        this.ruleForm.expectFlight = orderInfo.expectFlight
        this.ruleForm.expectDeparture = orderInfo.expectDeparture
        this.ruleForm.planPieces = orderInfo.planPieces
        this.ruleForm.planWeight = orderInfo.planWeight
        this.ruleForm.planVolume = orderInfo.planVolume
        this.ruleForm.customsStatusCode = orderInfo.customsStatusCode
        this.ruleForm.planDimensions = orderInfo.planDimensions
        this.ruleForm.paymentMethod = orderInfo.paymentMethod
        this.ruleForm.undgCode = orderInfo.undgCode
        this.ruleForm.undgContactName = orderInfo.undgContactName
        this.ruleForm.undgContactCommunicationType = orderInfo.undgContactCommunicationType
        this.ruleForm.undgContactCommunicationNo = orderInfo.undgContactCommunicationNo
        this.ruleForm.afOrderShipperConsignee1 = orderInfo.afOrderShipperConsignee1
        this.ruleForm.afOrderShipperConsignee2 = orderInfo.afOrderShipperConsignee2
        this.ruleForm.goodsNameCn = orderInfo.goodsNameCn
        this.ruleForm.goodsNameEn = orderInfo.goodsNameEn
        this.ruleForm.shippingMarks = orderInfo.shippingMarks
        this.ruleForm.handlingInfo = orderInfo.handlingInfo
        this.ruleForm.loadingDate = orderInfo.loadingDate
        this.ruleForm.partialShipment = orderInfo.partialShipment

        this.ruleForm.shipperLetters = hawbList
        this.ruleForm.hawbQuantity = this.ruleForm.shipperLetters.length
        if (this.ruleForm.hawbQuantity + '' == '0') {
          this.ruleForm.hawbFlag = "直单"
        } else {
          this.ruleForm.hawbFlag = "分单"
        }
        this.setPlanChargeWeight()
      },

      setPlanChargeWeight() {
        let planChargeWeight = this.ruleForm.planVolume * 1000000 / 6000;
        if (this.ruleForm.planWeight > planChargeWeight) {
          if ((this.ruleForm.planWeight + "").split(".").length > 1) {
            this.ruleForm.planChargeWeight = parseFloat(this.ruleForm.planWeight + "").toFixed(this.orderAeDigitsChargeWeight);
          } else {
            this.ruleForm.planChargeWeight = parseInt(this.ruleForm.planWeight + "").toFixed(this.orderAeDigitsChargeWeight);
          }
        } else {
          this.ruleForm.planChargeWeight = planChargeWeight.toFixed(this.orderAeDigitsChargeWeight);
        }
        if (this.ruleForm.planVolume != null && this.ruleForm.planVolume !== '' && parseFloat(this.ruleForm.planVolume + '') != 0 && this.ruleForm.planWeight != null && this.ruleForm.planWeight !== '') {
          this.ruleForm.planDensity = parseFloat(this.ruleForm.planWeight + '') / parseFloat(this.ruleForm.planVolume + '') + ''
          this.ruleForm.planDensity = this.ruleForm.planDensity.split('.')[0]
        } else {
          this.ruleForm.planDensity = ''
        }
      },
      // 关闭
      handleClose() {
        if (this.ifFullscreen) {
          setTimeout(() => {
            let userAgent = navigator.userAgent;
            if (userAgent.indexOf("Firefox") != -1 || userAgent.indexOf("Chrome") != -1) {
              window.open('', '_self').close()
            } else {
              window.opener = null;
              window.open("about:blank", "_self");
              window.close();
            }
          }, 2000)
        } else {
          this.$emit('update:visible', false);
        }
      },
      openFormWind(url, params, target) {
        let tempForm = document.createElement("form");
        tempForm.id = "tempForm1";
        tempForm.method = "post";
        tempForm.action = url;
        tempForm.target = target; // _blank - URL加载到一个新的窗口
        //构建请求参数
        for (let key in params) {
          let value = params[key];
          let nextHideInput = document.createElement("input");
          nextHideInput.type = "hidden";
          nextHideInput.name = key;
          nextHideInput.value = value;
          tempForm.appendChild(nextHideInput);
        }

        document.body.appendChild(tempForm);
        //提交
        //tempForm.dispatchEvent(new Event("submit"));
        tempForm.submit();
        document.body.removeChild(tempForm);
      },

      setHeight() {
        this.$nextTick(() => {
          let ae_order_header = this.$refs.ae_order_header.offsetHeight;
          let ae_order_footer = this.$refs.ae_order_footer.offsetHeight;
          let heightS = window.innerHeight - 90 - ae_order_header - ae_order_footer;

          this.tableHeight = heightS + "px";
        });
      },
      findByPage() {
        this.query.columnStrs = '';
        this.setHeight();

        //从数据库查询设置信息
        let pageName = '订单操作管理/空运出口/操作看板';
        this.$axios.get2("/hrs/user/getUserPageSet?pageName=" + pageName)
          .then(function(response) {
            let af_list_column = response.data.data;
            if(af_list_column && af_list_column.length>0){
              this.tableColumns = this.sortBykey(af_list_column, 'index');
            }else{
              this.tableColumns = this.sortBykey(columns.afInfo, 'index');
            }
            this.loading = true

            this.$axios.get2("/afbase/aforder/operaLookPage?size=" + this.pageConf.pageSize + "&current=" + this.pageConf.pageCode, this.query)
              .then(function(response) {
                this.data1 = response.data.data['resultOne'] || [];
                this.summaryData = response.data.data['resultTwo'] || [];

                if(this.data1.length > 0){
                  this.pageConf.totalPage = response.data.data['resultOne'][0].total;
                }else{
                  this.pageConf.totalPage = 0;
                }

                if (this.data1.length == 0) {
                  let current = Math.ceil(this.pageConf.totalPage / this.pageConf.pageSize);
                  this.findByPage2(current);
                } else {
                  this.loading = false
                }
              }.bind(this));
          }.bind(this));
      },
      findByPage2(current) {
        this.$axios.get2("/afbase/aforder/operaLookPage?size=" + this.pageConf.pageSize + "&current=" + current, this.query)
          .then(function(response) {
            this.loading = false
            this.data1 = response.data.data['resultOne'] || [];
            this.summaryData = response.data.data['resultTwo'] || [];

            if(this.data1.length > 0){
              this.pageConf.totalPage = response.data.data['resultOne'][0].total;
            }else{
              this.pageConf.totalPage = 0;
            }
          }.bind(this));
      },
      delete(row) {
            this.$confirm('你确定要删除舱单吗?', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning',
              center: true
            }).then(() => {
            this.$axios.get('/afbase/aforder/getShippingData/AE_CD_AWB').then(function(response) {
                if (response.data.code == 0 && response.data.data) {
                  this.$axios.post('/afbase/aforder/deleteShipper/'+row.orderUuid+'/'+(row.letterId || ''))
                    .then(function(response) {
                      if (response.data.code == 0) {
                        if(response.data.data.status=='success'){
                            this.openSuccess('删除成功');
                        }else{
                          this.openError(response.data.data.message);
                        }
                      } else {
                        this.openError(response.data.messageInfo);
                      }
                    }.bind(this));
                } else { //请求未成功或配置不存在
                  this.openError1("未获取到舱单相关信息!");
                }
              }.bind(this)).catch((error) => {
                this.openError(error.response.data.messageInfo)
              });
            }).catch(() => {
              // this.$message({
              //   type: 'info',
              //   message: '已取消'
              // });
            });

      },
      sendShippings() { //多条 舱单发送
        let letterIds = '';
        let orderUuid = '';
        let hasMwb = 'hawb';
        for(let i = 0; i < this.multipleSelection.length; i++) {
          if(orderUuid == '') {
            orderUuid = this.multipleSelection[i].orderUuid;
          } else if(orderUuid != this.multipleSelection[i].orderUuid){
            this.$message.error('请选择相同主单下的数据');
            return false;
          }
          if(!!this.multipleSelection[i].letterId){
            if(letterIds == '') {
              letterIds = this.multipleSelection[i].letterId;
            } else {
              letterIds = letterIds + ',' + this.multipleSelection[i].letterId;
            }
          }else{
            hasMwb = 'mwb';
          }

        }
        if(orderUuid == '' && letterIds.length == 0) {
          this.$message.error('请选择要操作的记录');
          return;
        }
        this.shippingSend('more',orderUuid,letterIds,hasMwb)

      },
      exportExcel() {

        if (this.data1.length == 0) {
          this.openError("查询结果列表为空，不允许导出")
          return;
        }
        this.$confirm('是否根据结果字段导出数据？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
          center: true
        }).then(() => {
          this.query.columnStrs = JSON.stringify(this.tableColumns);
          this.exportExcelSure();
        }).catch(() => {
          let excelList = this.sortBykey(columns.afInfo, 'index');
          this.query.columnStrs = JSON.stringify(excelList);
          this.exportExcelSure();
        });

      },
      exportExcelSure() {
        this.$axios.post3('/afbase/aforder/operationLook/exportExcel', this.query)
          .then(function(response) {
            let blob = new Blob([response.data], {
              type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8'
            });
            let downloadElement = document.createElement('a');
            let href = window.URL.createObjectURL(blob); // 创建下载的链接
            downloadElement.href = href;
            downloadElement.download = 'AE操作看板列表' + '.xls'; // 下载后文件名
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
      formatStatus(row, column) {
        return row.userStatus == true ? "生效" : row.userStatus == false ? "失效" : "";
      },
      formatter1(row, column) {
        return row.isConsol == true ? "√" : row.isConsol == false ? "" : "";
      },
      formatter11(row, column) {
        let planPieces = '-';
        let confirmPieces = '-';
        if (row.planPieces || row.planPieces === 0) {
          planPieces = row.planPieces
        }
        if (row.confirmPieces || row.confirmPieces === 0) {
          confirmPieces = row.confirmPieces
        }
        if (planPieces != '-') {
          planPieces = this.getNumber4(planPieces);
        }
        if (confirmPieces != '-') {
          confirmPieces = this.getNumber4(confirmPieces);
        }
        // return planPieces + " / " + confirmPieces;
        return confirmPieces;
      },
      formatter22(row, column) {
        let planWeight = '-';
        let confirmWeight = '-';
        if (row.planWeight || row.planWeight === 0) {
          planWeight = row.planWeight
        }
        if (row.confirmWeight || row.confirmWeight === 0) {
          confirmWeight = row.confirmWeight
        }
        if (planWeight != '-') {
          planWeight = this.getNumber4(planWeight);
        }
        if (confirmWeight != '-') {
          confirmWeight = this.getNumber4(confirmWeight);
        }
        return confirmWeight;
      },
      formatter33(row, column) {
        let planVolume = '-';
        let confirmVolume = '-';
        if (row.planVolume || row.planVolume === 0) {
          planVolume = row.planVolume
        }
        if (row.confirmVolume || row.confirmVolume === 0) {
          confirmVolume = row.confirmVolume
        }
        return confirmVolume;
      },
      formatDate(row, column) {
        if (row[column.property]) {
          return (row[column.property]).substr(0, 10)
        } else {
          return ""
        }

      },
      getDateTime(theDate) {
        let _year = theDate.getFullYear();
        let _month = theDate.getMonth();
        let _date = theDate.getDate();
        if (_month < 10) {
          _month = "0" + _month;
        }
        if (_date < 10) {
          _date = "0" + _date;
        }
        return _year + "-" + _month + "-01 00:00:00";
      },
      getNumber4(data) {
        return data.toString().replace(/\d{1,3}(?=(\d{3})+(\.\d*)?$)/g, '$&,');
      },
      dgdMake() {
        let routeUrl = this.$router.resolve({
          path: "/af_order",
          query: {
            flag: true,
            data: this.currRow.orderUuid,
            name: 'dgdMake'
          }
        });
        window.open(routeUrl.href, '_blank');
      },
      shippingOneSend(){
        this.shippingSend('one',this.currRow['orderUuid'],(this.currRow['letterId'] || ''),!this.currRow['letterId'] ? 'mwb' :'hawb')
      },
      shippingSend(type,orderUUID,letterIds,hasMwb) {//发送舱单20200827
        // if (this.currRow.awbNumber) {
          this.$axios.get('/afbase/aforder/getShippingData/AE_CD_AWB').then(function(response) {
            if (response.data.code == 0 && response.data.data) { //发送舱单数据
              // let orderUUID = this.currRow['orderUuid'];
              this.$axios.get("/afbase/aforder/shippingSendCheckHasSend/" + orderUUID).then(function(response) {// 校验是否发送过舱单
                function extracted() {
                  this.checkSendWaybill(hasMwb,orderUUID,letterIds);//校验必填项
                }
                if (response.data.code == 0) {
                  if (!response.data.data) {//为发送过舱单
                    extracted.call(this);
                  }else{//已发送过舱单
                    this.$confirm('舱单已经发送，是否将再次发送？', '提示', {
                      confirmButtonText: '确定',
                      cancelButtonText: '取消',
                      type: 'warning',
                      center: true
                    }).then(() => {
                      extracted.call(this);
                    }).catch(() => {});
                  }
                }
              }.bind(this));
            } else { //请求未成功或配置不存在
              this.openError1("未获取到舱单相关信息!");
            }
          }.bind(this)).catch((error) => {
            this.openError(error.response.data.messageInfo)
          });
        // } else {
        //   this.openError1("未配主单号，不能发送舱单");
        // }
      },
      insertOrderLog(url, params, target) {
        let tempForm = document.createElement("form");
        tempForm.id = "tempForm1";
        tempForm.method = "post";
        tempForm.action = url;
        tempForm.target = target; // _blank - URL加载到一个新的窗口
        //构建请求参数
        for (let key in params) {
          let value = params[key];
          let nextHideInput = document.createElement("input");
          nextHideInput.type = "hidden";
          nextHideInput.name = key;
          nextHideInput.value = value;
          tempForm.appendChild(nextHideInput);
        }

        document.body.appendChild(tempForm);
        //提交
        //tempForm.dispatchEvent(new Event("submit"));
        tempForm.submit();
        document.body.removeChild(tempForm);
      },
      checkSendWaybill(hasMwb,orderUUID,letterIds) {
        this.$axios.get("/afbase/aforder/shippingBillDataCheck/AE_CD_AWB/" + hasMwb +'/' + orderUUID + '/' + letterIds).then(function(response) {
          function extracted() {
            this.$axios.post("/afbase/aforder/sendShippersData/"+hasMwb+'/'+orderUUID+'/'+letterIds).then(function (response) {
              // 调用发送舱单后台接口
              if (response.data.code == 0) {
                if(response.data.data.status=='success'){
                  this.openSuccess('发送成功');
                }else{
                  this.openError(response.data.data.message);
                }
              } else {
                this.openError(response.data.messageInfo || "发送舱单失败!");
              }
            }.bind(this));
          }

          if (response.data.code == 0) {
            if (response.data.data == null) {
              extracted.call(this);
            }else{
              this.$alert(response.data.data, '提示', {
                dangerouslyUseHTMLString: true,
                distinguishCancelAndClose: true,
                showCancelButton:false,
                showConfirmButton:false,
                type: 'warning',
                center: true
              });
            }

          }
        }.bind(this));
      },
      sendWaybillAndLog(hasMwb,orderUUID,letterIds,data) {
          let params = {
            hasMwb:hasMwb,
            orderUuid:orderUUID,
            letterIds:letterIds,
            logRemarkLarge:JSON.stringify(data)
          }

          this.$axios.post3("/afbase/aforder/insertLogAfterSendShipper",params).then(function(response) {
            if (response.data.code == 0) {
              this.openSuccess("发送成功!");
            }else{
              this.openError1("发送成功，记录日志失败!");
            }
          }.bind(this));
      },
      sendAms() {
        if (this.currRow.awbNumber) {
          this.$axios.get('/afbase/aforder/getShippingData/AE_DZ_MWB').then(function(response) {
            if (response.data.code == 0 && response.data.data) { //发送运单数据
              this.sendWaybill(this.currRow['orderUuid'])
            } else { //请求未成功或配置不存在跳转到自己舱单制作
              this.jumpToWaybillMak()
            }
          }.bind(this)).catch((error) => {
            this.openError(error.response.data.messageInfo)
          });
        } else {
          this.openError1("未配主单号，不能制作运单");
        }
      },
      jumpToWaybillMak() {
        let routeUrl = this.$router.resolve({
          path: "/af_order",
          query: {
            flag: true,
            orderCode: this.currRow.orderCode,
            orderUuid: this.currRow.orderUuid,
            awbNumber: this.currRow.awbNumber,
            flightNumber: this.currRow.expectFlight,
            name: 'waybillMake'
          }
        });
        window.open(routeUrl.href, '_blank');
      },
      init() {
        //按钮权限开始
        let buttonInfo = window.localStorage.getItem('buttonInfo')
        if (buttonInfo.indexOf('af-operation-send') > -1) {
          this.sendMoreButtonFlag = true;
        }
        if (buttonInfo.indexOf('af-operation-excel') > -1) {
          this.excelButtonFlag = true;
        }
        if (buttonInfo.indexOf('af-operation-shippingMake') > -1) {
          this.shippingMakeButtonFlag = true;
        }
        if (buttonInfo.indexOf('af-operation-shippingSend') > -1) {
          this.shippingSendButtonFlag = true;
        }
        if (buttonInfo.indexOf('af-operation-shippingDelete') > -1) {
          this.shippingDeleteButtonFlag = true;
        }
        if (buttonInfo.indexOf('af-operation-appointment') > -1) {
          this.appointmentButtonFlag = true;
        }
        if (buttonInfo.indexOf('af-operation-ams') > -1) {
          this.amsButtonFlag = true;
        }
        //按钮权限结束
        this.query.flightDateBegin = this.getDateTime(new Date());
      },
      cellClick(row, label) {
        row.trackType=label;
        if ("状态" == label) {
          this.showTrack(row)
        }
      },
      showTrack(row) {
        this.frow = row;
        this.trackVisible = true;
      },

      // sendAms() {
      //   this.waybillMakeVisible = true
      //   this.openError1("功能暂未开通，敬请期待");
      //   return;
      // },
      appointment() {
        this.openError1("功能暂未开通，敬请期待");
        return;
      },
      printTag(row){
        let data = [];
        data.push({"awbNumber": row.awbNumber, "orderUuid": row.orderUuid});
        this.frow = {"data": data};
        this.frow.pageName = '操作看板';
        this.tagPrintVisible = true;
      },
      printLetter(row){
        let flag = 1;
        let customerNumbers = '';
        let awbUUIds = row.awbUuid;
        if (row.awbNumber == null || row.awbNumber.length != 12) {
          flag = 0;
          if (customerNumbers == '') {
            customerNumbers = customerNumbers + row.customerNumber;
          } else {
            customerNumbers = customerNumbers + ',' + row.customerNumber;
          }
        }
        if (flag == 1) {
          //打印
          if (awbUUIds.length == 0) {
            this.$message.error('请选择要操作的记录');
            return;
          }
          let params = {
            "awbUUIds": awbUUIds
          };
          this.$axios.post2('/afbase/operationPlan/checkLetters', params)
            .then(function(response) {
              if (response.data.code == 0) {
                if (response.data.data == '货站存在托书模板') {
                  this.$axios.get('/afbase/operationPlan/printLetters1/' + row.awbUuid).then(function(response){
                    this.frow.awbUuid = row.awbUuid
                    this.frow.pdfUrl = response.data.data
                    this.frow.awbNumber = row.awbNumber;
                    this.selectPrintMethodVisible = true;
                  }.bind(this)).catch(function(error) {
                    console.log(error);
                  });
                } else if (response.data.data.indexOf('没有选择交货货站，无法打印交货托书') > -1 || response.data.data == '当前机场没有可使用的托书模板，请联系翌飞管理员' || response.data.data.indexOf('没有可使用的托书模板，无法打印交货托书') > -1) {
                  this.openError1(response.data.data);
                } else if (response.data.data == '当前机场有一个可使用的托书模板') {
                  this.$axios.get('/afbase/operationPlan/printLetters2/' + row.awbUuid).then(function(response){
                    this.frow.awbUuid = row.awbUuid
                    this.frow.pdfUrl = response.data.data
                    this.selectPrintMethodVisible = true;
                  }.bind(this)).catch(function(error) {
                    console.log(error);
                  });
                } else if (response.data.data == '当前机场有多个可使用的托书模板') {
                  this.frow.awbUuid = row.awbUuid
                  this.frow.flag = 'moreTemplate'
                  this.selectPrintMethodVisible = true;
                }
              } else {

              }
            }.bind(this)).catch(function(error) {
            this.openError1(response.data.messageInfo);

          }.bind(this));

        } else {
          this.$message.error(" 订单号" + customerNumbers + ',未配主单号');
        }
      },
      getSummaries(param){
        let summaries = [];
        if(this.data1.length == 0){
          return summaries
        }
        let { columns,  } = param;
        columns.forEach((column, index)=>{
          let v = this.summaryData[column.property]
          summaries[index] = index === 0 ? '合计' : (v === 0 || v) ?  v : '';
        });
        return summaries;
      },
    },
    created() {
      //从数据库查询设置信息
      let pageName = '订单操作管理/空运出口/操作看板';
      this.$axios.get2("/hrs/user/getUserPageSet?pageName=" + pageName)
        .then(function(response) {
          let af_list_column = response.data.data;
          if(af_list_column && af_list_column.length>0){
            this.tableColumns = this.sortBykey(af_list_column, 'index');
          }else{
            this.tableColumns = this.sortBykey(columns.afInfo, 'index');
          }
        }.bind(this));

      this.$axios.get('/hrs/dept/selectUser').then(function(response) {
        this.useroptions2 = response.data.data;
      }.bind(this))

        this.init()
    },
    mounted() {
      this.setHeight();
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

  .afOrderListPageCheckBox .el-checkbox__inner {
    background-color: #FFF !important;
  }

  .awbNumber {
    text-decoration: underline;
  }

  .duihao_af {
    font-family: "iconfont" !important;
    font-size: 16px;
    color: black;
    font-style: normal;
    -webkit-font-smoothing: antialiased;
    display: "table-cell" !important;
  }

  .duihao_icn :before {
    content: "\E608";
  }
</style>
