<template>
  <div class="warp-main">
    <div class="aircraftListPage">
      <el-form :inline="false" :model="query" label-width="20px">
        <el-row>
          <el-col class="elementWidth">
            <el-form-item label-width="10px">
              <el-input style="width:201px;">
                <template slot="prepend">创建时间</template>
                <el-date-picker slot="suffix" v-model="query.createTimeStart" clearable type="date" value-format="yyyy-MM-dd"
                 placeholder="开始" style="width: 135px;margin-right: -5px;">
                </el-date-picker>
              </el-input>
              <span>-</span>
              <el-date-picker v-model="query.createTimeEnd" clearable type="date" value-format="yyyy-MM-dd" placeholder="结束"
               style="width: 135px;">
              </el-date-picker>
            </el-form-item>
          </el-col>
          <!-- <el-col class="elementWidth">
            <el-form-item label-width="10px">
              <el-input v-model="query.flightno" auto-complete="off" clearable style="width:160px;" @input="query.flightno = query.flightno.toUpperCase()">
                <template slot="prepend">航班号</template>
              </el-input>
            </el-form-item>
          </el-col> -->
          <el-col class="elementWidth">
            <el-form-item label-width="10px">
              <el-input v-model="query.mawbCode" auto-complete="off" clearable style="width:195px;">
                <template slot="prepend">主单号</template>
              </el-input>
            </el-form-item>
          </el-col>
          <!-- <el-col class="elementWidth">
            <el-form-item label-width="10px">
              <el-input v-model="query.hawbCode" auto-complete="off" clearable style="width:195px;">
                <template slot="prepend">分单号</template>
              </el-input>
            </el-form-item>
          </el-col> -->
          <el-col class="elementWidth">
            <el-form-item label-width="10px">
              <el-input v-model="query.orderCode" auto-complete="off" clearable style="width:217px;">
                <template slot="prepend">订单单号</template>
              </el-input>
            </el-form-item>
          </el-col>
          <el-col class="elementWidth">
            <el-form-item label-width="10px">
              <el-input style="width:175px;">
                <template slot="prepend">预配状态</template>
                <el-select slot="suffix" clearable v-model="query.mft2201Status" placeholder="" style="width:106px;margin-right: -5px;">
                  <el-option label="成功" value="SUCC"></el-option>
                  <el-option label="失败" value="ERROR"></el-option>
                  <el-option label="人审" value="AUDIT"></el-option>
                  <el-option label="正在执行" value="do-"></el-option>
                </el-select>
              </el-input>
            </el-form-item>
          </el-col>
          <el-col class="elementWidth">
            <el-form-item>
              <el-button type="primary" size="small" @click="queryList">查询</el-button>
              <el-button type="primary" size="small" v-if="cellShowFlag" v-on:click="setCellShowFlag">简化</el-button>
              <el-button type="primary" size="small" v-if="!cellShowFlag" v-on:click="setCellShowFlag">详细</el-button>

            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </div>
    <div>
      <el-table v-loading="loading" :data="data"  stripe border row-key="dashboardId" :tree-props="{children: 'fhlLook'}" :cell-style="cellclass" :header-cell-style="headerclass">
        <el-table-column align="center" width="60" label="日志" fixed type="index">
          <template slot-scope="scope">
            <el-button type="text" size="mini" @click="gotoLogPage(scope.row)">详情</el-button>
          </template>
        </el-table-column>
        <el-table-column prop="orderCode" label="订单号" width="150" header-align="center" align="right" fixed></el-table-column>
        <el-table-column prop="customerName" label="客户名称" width="200" align="center" fixed v-if="cellShowFlag"></el-table-column>
        <el-table-column prop="mawbCode" label="主单号"  width="120" align="center" fixed></el-table-column>
        <el-table-column prop="hawbCode" label="分单号"  width="120" align="center" fixed></el-table-column>
        <el-table-column prop="hawbCount" label="分单数量"  width="90" align="center" fixed></el-table-column>
        <el-table-column prop="departure" label="始发港" width="80" align="center" fixed></el-table-column>
        <el-table-column prop="destination" label="目的港" width="80" align="center" fixed></el-table-column>

        <el-table-column align="center" key="1" label="预录入状态" width="100" v-if="!cellShowFlag">
            <template slot-scope="scope">
              <span v-html="formatter_sliStatus2(scope.row.sliStatus)"></span>
              <a href="javascript:void(0)" @click="doDeleteESD(scope.row)" style="color: #137DFA;text-decoration: underline;" v-if="scope.row.mft2201Status!='SUCC' && scope.row.mft2201Status!='AUDIT' &&(scope.row.mft2201Status ? scope.row.mft2201Status.indexOf('do-')!=0 :true)&& (isEmpty(scope.row.sliPiece)||isEmpty(scope.row.sliWeight))">删除</a>
              <i v-else>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</i>
            </template>
          </el-table-column>
        <el-table-column label="预录入信息" align="center" v-if="cellShowFlag" >
          <el-table-column prop="sliStatus" align="center" label="预录入状态" width="100">
            <template slot-scope="scope">
              <span v-html="formatter_sliStatus2(scope.row.sliStatus)"></span>
              <a href="javascript:void(0)" @click="doDeleteESD(scope.row)" style="color: #137DFA;text-decoration: underline;" v-if="scope.row.mft2201Status!='SUCC' && scope.row.mft2201Status!='AUDIT' &&(scope.row.mft2201Status ? scope.row.mft2201Status.indexOf('do-')!=0 :true)&& (isEmpty(scope.row.sliPiece)||isEmpty(scope.row.sliWeight))">删除</a>
              <i v-else>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</i>
            </template>
          </el-table-column>
          <el-table-column prop="sliSendTime" label="预录入时间"  width="145" align="center" > </el-table-column>
          <el-table-column prop="esdPieces" label="件数" width="100" align="center" > </el-table-column>
          <el-table-column prop="esdWeight" label="重量" width="100" align="center" > </el-table-column>
          <el-table-column prop="opLableTime" label="打标签时间" width="145" align="center" > </el-table-column>
          <el-table-column prop="awbPrintsliTime" label="打印托书时间" width="145" align="center" > </el-table-column>
        </el-table-column>

        <el-table-column  prop="mft2201Status" key="2" label="预配状态" width="100" align="center"  v-if="!cellShowFlag" >
             <template slot-scope="scope">
              <span v-html="formatter_mft2201Status2(scope.row.mft2201Status,scope.row.mft2201Optype)"></span>
               <a  href="javascript:void(0)" @click="handleChange(scope.row),dialogFormVisible = true"  style="color: #137DFA;text-decoration: underline;" v-if="scope.row.mft2201Status=='SUCC'&&scope.row.existsMftt2201=='Y'">删除</a>
               <i v-else>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</i>
             </template>
        </el-table-column>

        <el-table-column label="预配数据" align="center" v-if="cellShowFlag" >
          <el-table-column  prop="mft2201Status" key="2" label="预配状态" width="100" align="center"  v-if="!cellShowFlag" >
            <template slot-scope="scope">
              <span v-html="formatter_mft2201Status2(scope.row.mft2201Status,scope.row.mft2201Optype)"></span>
              <a href="javascript:void(0)" @click="handleChange(scope.row),dialogFormVisible = true" style="color: #137DFA;text-decoration: underline;" v-if="scope.row.mft2201Status=='SUCC'&&scope.row.existsMftt2201=='Y'">删除</a>
               <i v-else>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</i>
            </template>
          </el-table-column>
          <el-table-column  prop="mft2201Status" label="状态" width="100" align="center" > </el-table-column>
          <el-table-column  prop="mft2201Pieces" label="件数" width="100" align="center"> </el-table-column>
          <el-table-column prop="mft2201Weight" label="重量"  width="100" align="center"> </el-table-column>
          <el-table-column prop="mft2201Flightno" label="航班" width="100" align="center"> </el-table-column>
          <el-table-column prop="mft2201Flightdate" label="日期" width="100" align="center"> </el-table-column>
          <el-table-column prop="terminalName" label="货栈" width="100" align="center"> </el-table-column>
          <el-table-column prop="mft2201Time" label="发送时间" width="100" align="center"> </el-table-column>
          <el-table-column prop="mft2201Optype" label="操作类型" width="100" align="center"> </el-table-column>
        </el-table-column>

        <el-table-column prop="acFohTime" key="3" label="入库时间" width="145" align="center" v-if="!cellShowFlag" > </el-table-column>
        <el-table-column label="入库" align="center" v-if="cellShowFlag" >
          <el-table-column prop="acFohTime" label="入库时间" width="145" align="center"> </el-table-column>
          <el-table-column  prop="sliPiece" label="件数" width="100" align="center"> </el-table-column>
          <el-table-column prop="sliWeight" label="重量"  width="100" align="center"> </el-table-column>
        </el-table-column>
        <el-table-column align="center" key="4" label="运抵" width="80">
          <template slot-scope='scope'>
            <i class="iconfont el-icon-myduihao" style="color: green;" v-if="scope.row.mft3201Recv!=null && scope.row.mft3201Recv=='YES'"></i>
            <i class="el-icon-question" style="color: orange; font-size:18px" v-if="scope.row.mft3201Recv!=null && scope.row.mft3201Recv=='NO'"></i>
          </template>
        </el-table-column>
        <el-table-column align="center" key="5" label="审结" width="80">
          <template slot-scope='scope'>
            <i class="el-icon-warning-outline" style="color: red; font-size:18px" v-if="scope.row.mft9993Recv!=null && scope.row.mft9993Recv"></i>
          </template>
        </el-table-column>
        <el-table-column align="center" key="6" label="查验" width="80">
          <template slot-scope='scope'>
            <i class="el-icon-warning-outline" style="color: red; font-size:18px" v-if="scope.row.mft99935Recv!=null && scope.row.mft99935Recv"></i>
          </template>
        </el-table-column>
        <el-table-column align="center" key="7" label="放行回执" width="80">
          <template slot-scope='scope'>
            <i class="iconfont el-icon-myduihao" style="color: green;" v-if="scope.row.mft9999Recv!=null && scope.row.mft9999Recv"></i>
          </template>
        </el-table-column>

        <!-- <el-table-column prop="mft3201Recv" key="4" label="运抵" width="80" align="center"></el-table-column>
        <el-table-column prop="mft9993Recv" key="5" label="审结" width="80" align="center"></el-table-column>
        <el-table-column prop="mft99935Recv" key="6" label="查验" width="80" align="center"></el-table-column>
        <el-table-column prop="mft9999Recv"key="7" label="放行回执" width="80" align="center"></el-table-column> -->


        <el-table-column label="电子运单" key="8" align="center" >
          <el-table-column  prop="awbPiece" label="件数" width="100" align="center" v-if="cellShowFlag" > </el-table-column>
          <el-table-column prop="awbWeight" label="重量"  width="100" align="center" v-if="cellShowFlag" > </el-table-column>
          <el-table-column prop="fwbStatus" label="运单状态" width="100" align="center" :formatter="formatter_fwbStatus" v-if="cellShowFlag"> </el-table-column>
          <el-table-column prop="acRcsTime" label="交单时间" width="145" align="center" v-if="cellShowFlag"> </el-table-column>
          <el-table-column prop="fwbStatus" label="运单状态" align="center" :formatter="formatter_fwbStatus" v-if="!cellShowFlag"> </el-table-column>
          <el-table-column prop="acRcsTime" label="交单时间" align="center" v-if="!cellShowFlag"> </el-table-column>
        </el-table-column>
      </el-table>
      <el-dialog title="删除预配" :modal="false" :visible.sync="dialogFormVisible">

            <el-form :model="form">
              <el-form-item label="操作联系人电话" :label-width="formLabelWidth">
                <el-input v-model="form.contactTel" autocomplete="off"></el-input>
              </el-form-item>
              <el-form-item label="删除原因" :label-width="formLabelWidth">
                <el-input type="textarea" v-model="form.deleteReason" autocomplete="off"></el-input>
              </el-form-item>
            </el-form>
            <div slot="footer"  class="dialog-footer">
              <el-button @click="dialogFormVisible = false">取 消</el-button>
              <el-button type="primary" @click="doMft2201_Delete()">确 定</el-button>
            </div>

        </el-dialog>
    </div>
    <div>
      <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="pageConf.pageCode" :page-sizes="pageConf.pageOption" :page-size.sync="pageConf.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="pageConf.totalPage">
      </el-pagination>
    </div>
<logVisible ref="addMission" v-if="logVisible" :visible.sync="logVisible" :frow="frow"></logVisible>
  </div>
</template>
<script>
import logVisible from './mns/af_mns_log'

  export default {
    data() {
      return {
        logVisible:false,
        loading: false,
        cellShowFlag:false,
        dialogFormVisible: false,
        form: {
          contactTel:'',
          deleteReason:''
        },
        currRow: '',
        formLabelWidth: '120px',
        data: [],
        multipleSelection: [],
            frow: {},
            currRow: '',
        pageConf: {
          //设置一些初始值(会被覆盖)
          pageCode: 1, //当前页
          pageSize: 10, //每页显示的记录数
          totalPage: 0, //总记录数
          pageOption: [10, 50, 100], //分页选项
          handleCurrentChange: function() {
            console.log("页码改变了");
          }
        },
        query: {
          createTimeStart: '',
          createTimeEnd: '',
          mawbCode: '',
          hawbCode: '',
          orderCode: '',
          mft2201Status: ''
        },

      }
    },
  components: {
      'logVisible': logVisible
    },
  created: function() {

    },
    methods: {
      setCellShowFlag() {
        this.cellShowFlag = !this.cellShowFlag;
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
      openSuccess() {
        this.$notify({
          title: '',
          message: '操作成功',
          type: 'success',
          position: 'bottom-right'
        });
      },
      isEmpty(str) {

        if (str!=null && str!='null' && str!='' && str!='undefined') {
            return false;
        }else{
          return true;
        }
      },
      doDeleteESD(row) {
        var str="";
        var url="";
        var orderCode="";
        orderCode = this.selectOrderCode(orderCode,row.mawbCode)

        if (row.hawbCode) {

          str='此操作将删除分单预录入(主单:'+row.mawbCode+'，分单:'+row.hawbCode+')';
          url="doEawbPreDeleteFHL/"+row.mawbCode+"/"+row.hawbCode+"/"+orderCode;
        } else{

          str='此操作将删除主单预录入(主单:'+row.mawbCode+')';

          url="doEawbPreDeleteAwb/"+row.mawbCode+"/"+orderCode;
        }
          this.$confirm(str+', 是否继续?', '注意', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
          center: true
          }).then(() => {
            this.$axios.post("/afbase/send/"+url).then(function (response) {
                    if (response.data.code == 0) {
                        if(response.data.data.status=='success'){
                          this.openSuccess('删除成功');
                          this.queryList();
                      }else{
                            this.openError(response.data.data.message);
                      }
                    } else {
                        this.openError(response.data.messageInfo || "删除失败!");
                    }
                  }.bind(this));

                }).catch(() => {});


      },
      selectOrderCode(orderCode,mawbCode){
        for(var i = 0; i< this.data.length ; i++){

            if(this.data[i].mawbCode==mawbCode){
                orderCode = this.data[i].orderCode;
                return orderCode;
            }
        }
      },
      doMft2201_Delete(){
        var str="";
        var orderCode = "";

        if (this.currRow.hawbCode!=null && this.currRow.hawbCode !="" && this.currRow.hawbCode!=" ") {
          str='此操作将删除分单预配(主单:'+this.currRow.mawbCode+'，分单:'+this.currRow.hawbCode+')';
        } else {

          str='此操作将删除主单预配(主单:'+this.currRow.mawbCode+')';
          this.currRow.hawbCode=" ";
        }

        orderCode=this.selectOrderCode(orderCode,this.currRow.mawbCode);

        var url="doMft2201_Delete/"+this.currRow.mawbCode+"/"+this.currRow.hawbCode+"/"+orderCode+"/"+this.form.contactTel+"/"+this.form.deleteReason;

        if(this.form.contactTel){
          if(this.form.deleteReason){
              this.$confirm(str+', 是否继续?', '注意', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning',
              center: true
              }).then(() => {
                this.$axios.post("/afbase/send/"+url).then(function (response) {

                        if (response.data.code == 0) {
                            if(response.data.data.status=='success'){

                              this.openSuccess('删除成功');
                              this.dialogFormVisible=false;
                              this.queryList();
                          }else{
                                this.openError(response.data.data.message);
                          }
                        } else {
                            this.openError(response.data.messageInfo || "删除失败!");
                        }
                      }.bind(this));

                    }).catch(() => {});
          }else{
            this.openError1("请说明删除原因");
          }
        }else{
          this.openError1("请写明操作联系人电话号码");
        }
      },
      handleChange(command) {

				this.currRow = command
			},
      queryList() {
        let params={
                  'currentPage': this.pageConf.pageCode,
                  'pageSize': this.pageConf.pageSize,
                  'createTimeStart':this.query.createTimeStart,
                  'createTimeEnd':this.query.createTimeEnd,
                  'mawbCode':this.query.mawbCode,
                  'hawbCode':this.query.hawbCode,
                  'orderCode':this.query.orderCode,
                  'mft2201Status':this.query.mft2201Status,
                }
                this.$axios.post('/afbase/fhl/queryLookList',params)
                .then(function(response) {
                    if (response.data.code == 1) {
                      this.openError(response.data.messageInfo)
                      return
                    }
                    if (response.data.data.code=='01') {
                      this.data=response.data.data.dataList;
                      this.pageConf.totalPage=response.data.data.totalNum;
                    }else{
                      this.openError(response.data.data.message)
                    }
                 }.bind(this)
                );

      },
      gotoLogPage(row){
        this.frow=row;
        this.logVisible = true;
      },
      //pageSize改变时触发的函数
      handleSizeChange() {
        this.queryList();
      },
      //当前页改变时触发的函数
      handleCurrentChange() {
        this.queryList();
      },
      cellclass({ row, column, rowIndex, columnIndex }){

        if (this.cellShowFlag) {
          if (column.property=='sliStatus'||column.property=='esdPieces'||column.property=='sliSendTime'||column.property=='esdWeight'||column.property=='opLableTime'||column.property=='awbPrintsliTime') {
            return 'background-color:#EDF3E9 ;border-color:#FFFFFF'
          }else
          if (column.property=='mft2201Status' ||column.property=='mft2201Pieces'||column.property=='mft2201Weight'||column.property=='mft2201Flightno'||column.property=='mft2201Flightdate'||column.property=='terminalName'||column.property=='mft2201Time'||column.property=='mft2201Optype') {
            return 'background-color:#E9EFFF ;border-color:#FFFFFF'

          }else if (column.property=='acFohTime'||column.property=='sliPiece'||column.property=='sliWeight') {
            return 'background-color:#FFF2E8 ;border-color:#FFFFFF'

          }else{
            return ''
          }
        }else{
          return ''
        }
      },
       headerclass ({ row, column, rowIndex, columnIndex }){
        if (this.cellShowFlag) {
          if (rowIndex==0 && column.label=='预录入信息') {
            return 'background-color:#AFCF6A'
          }else if (rowIndex==0 && column.label=='预配数据') {
            return 'background-color:#8498FF'
          }else if (rowIndex==0 && column.label=='入库') {
            return 'background-color:#FEB048'
          }else if (rowIndex==1 && (column.property=='sliStatus'||column.property=='esdPieces'||column.property=='sliSendTime'||column.property=='esdWeight'||column.property=='opLableTime'||column.property=='awbPrintsliTime')) {
            return 'background-color:#D8E6D0'
          }else if (rowIndex==1 && (column.property=='mft2201Status' ||column.property=='mft2201Pieces'||column.property=='mft2201Weight'||column.property=='mft2201Flightno'||column.property=='mft2201Flightdate'||column.property=='terminalName'||column.property=='mft2201Time'||column.property=='mft2201Optype')) {
            return 'background-color:#CED8FF'
          }else if (rowIndex==1 && (column.property=='acFohTime'||column.property=='sliPiece'||column.property=='sliWeight')) {
            return 'background-color:#FDE4CE'
          }else{
            return ''
          }
        }else{
          return ''
        }
      },


      formatter_sliStatus(row, column) {
        if ('SUCC'==row.sliStatus) {
            return "成功";
        }else if ('ERROR'==row.sliStatus) {
            return "失败";
        }else if ('SEND'==row.sliStatus) {
            return "发送";
        }else{
          return "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;";
        }
      },
      formatter_sliStatus2(sliStatus) {
        if ('SUCC'==sliStatus) {
            return "成功&nbsp;&nbsp;";
        }else if ('ERROR'==sliStatus) {
            return "失败&nbsp;&nbsp;";
        }else if ('SEND'==sliStatus) {
            return "发送&nbsp;&nbsp;";
        }else{
          return "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;";
        }
      },
       formatter_mft2201Status2(mft2201Status,mft2201Optype) {
          
        if ('SUCC'==mft2201Status && ('new'==mft2201Optype || 'modify'==mft2201Optype)) {
            return "成功&nbsp;&nbsp;";
        }else if ('ERROR'==mft2201Status) {
            return "失败&nbsp;&nbsp;";
        }else if ('AUDIT'==mft2201Status) {
            return "人审&nbsp;&nbsp;";
        }else if (mft2201Status && mft2201Status.indexOf('do-')==0) {
            return "正在执行&nbsp;&nbsp;";
        }else if (mft2201Status &&'SAVE'==mft2201Status.toUpperCase()) {
            return "暂存&nbsp;&nbsp;";
        }else{
          return "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;";
        }
      },
      formatter_fwbStatus(row, column) {
        if ('SUCC'==row.fwbStatus) {
            return "成功";
        }else if ('ERROR'==row.fwbStatus) {
            return "失败";
        }else if ('SEND'==row.fwbStatus) {
            return "发送";
        }else{
          return "";
        }
      },
      getDateTime() {
        let theDate = new Date()
        var _year = theDate.getFullYear()
        var _month = theDate.getMonth()
        _month++
        var _date = theDate.getDate()
        if (_month < 10) {
          _month = "0" + _month;
        }
        if (_date < 10) {
          _date = "0" + _date;
        }
        return _year + "-" + _month + "-" + _date
      },
      getDateTime2() {
        let theDate = new Date()
        theDate.setDate(theDate.getDate()+1);
        var _year = theDate.getFullYear()
        var _month = theDate.getMonth()
        _month++
        var _date = theDate.getDate()
        if (_month < 10) {
          _month = "0" + _month;
        }
        if (_date < 10) {
          _date = "0" + _date;
        }
        return _year + "-" + _month + "-" + _date
      }
      //---------------------

    }
  }
</script>
<style type="">
  .aircraftListPage .el-input__icon {
    line-height: 30px !important;
  }

  .aircraftListPage .el-form-item__content {
    line-height: 30px !important;
  }

  .aircraftListPage .el-input-group__prepend {
    padding: 0 6px;
  }

</style>
