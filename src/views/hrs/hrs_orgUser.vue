<template>
  <div class="warp-main">
    <el-row v-loading="loading" element-loading-text="拼命加载中">
      <el-col class="toolbar" style="padding-bottom: 0;">
        <el-form :inline="false" :model="query" class="demo-ruleForm">
          <div>
            <el-row>
              <el-col class="elementWidth">
                <el-form-item label="创建日期" label-width="85px">
                  <el-date-picker style="width: 135px" v-model="query.createTimeStart" type="date" value-format="yyyy-MM-dd 00:00:00" placeholder="起始日期">
                  </el-date-picker>
                  <span>-</span>
                  <el-date-picker style="width: 135px" v-model="query.createTimeEnd" type="date" value-format="yyyy-MM-dd 23:59:59" placeholder="截至日期">
                  </el-date-picker>
                </el-form-item>
              </el-col>
              <el-col class="elementWidth">
                <el-form-item label="是否失效" label-width="80px">
                  <el-select v-model="query.isStatus" placeholder="" style="width: 80px;">
                    <el-option v-for="item in isStatuss" :key="item.value" :label="item.label" :value="item.value">
                    </el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col class="elementWidth">
                <el-form-item label="版本类型" label-width="80px">
                  <el-select v-model="query.orgEditionId"  clearable placeholder="" style="width: 105px;">
                    <el-option v-for="item in orgEditions" :key="item.orgId" :label="item.orgName" :value="item.orgId">
                    </el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col class="elementWidth">
                <el-form-item label="需求人" label-width="80px">
                  <el-select v-model="query.demandPersonId" clearable placeholder="" style="width: 105px;">
                    <el-option v-for="item in useroptions" :key="item.id" :label="item.name" :value="item.id">
                    </el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col class="elementWidth">
                <el-form-item style="margin-left: 38px;">
                  <el-button type="primary" size="small" v-on:click="querySettleList">查询</el-button>

                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col class="elementWidth">
                <el-form-item label="公司名称" label-width="85px">
                  <el-input v-model="query.orgName" auto-complete="off" style="width: 280px;">
                  </el-input>
                </el-form-item>
              </el-col>
              <el-col class="elementWidth">
                <el-form-item label="意向用户" label-width="80px">
                  <el-select v-model="query.intendedUser" placeholder="" clearable style="width: 80px;">
                    <el-option v-for="item in intendedUsers" :key="item.value" :label="item.label" :value="item.value">
                    </el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col class="elementWidth">
                <el-form-item label="管理员邮箱" label-width="93px">
                  <el-input v-model="query.adminEmail" auto-complete="off" style="width: 180px;">
                  </el-input>
                </el-form-item>
              </el-col>
              <el-col class="elementWidth">
                <el-form-item label="管理员电话" label-width="93px">
                  <el-input v-model="query.adminTel" auto-complete="off" style="width: 180px;">
                  </el-input>
                </el-form-item>
              </el-col>
            </el-row>
          </div>
        </el-form>
      </el-col>
      <el-table :indent="8" :data="data1"  class="table_settle" highlight-current-row  stripe border max-height="700px">
        <el-table-column fixed="left" align="center" label="操作" width="60">
          <template slot-scope="scope">
            <el-dropdown trigger="click" @command="handleCommand" @visible-change="handleChange(scope.row)">
              <i class="el-icon-s-operation"></i>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item command="edit">修改</el-dropdown-item>
                <el-dropdown-item command="interface">接口</el-dropdown-item>
                <el-dropdown-item command="leave">配置</el-dropdown-item>
                <el-dropdown-item command="additionalServices">附加服务</el-dropdown-item>
                <!--<el-dropdown-item command="enabledIntendedUser">设为意向用户</el-dropdown-item>-->
                <el-dropdown-item command="unenabledIntendedUser">设为非意向用户</el-dropdown-item>
                <el-dropdown-item command="disabledIntendedUser">取消非意向用户</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </template>
        </el-table-column>
        <el-table-column align="left" prop="orgType" label="账户类型" width="80">
          <template slot-scope="scope">
            <span>{{orgTypeStr(scope.row.orgType)}}</span>
          </template>
        </el-table-column>
        <el-table-column align="left" prop="orgCode" label="企业编码" width="150">
          <template slot-scope="scope">
            <span>{{scope.row.orgCode}}</span>
          </template>
        </el-table-column>
        <el-table-column align="left" prop="orgName" label="签约公司名称" width="350">
          <template slot-scope="scope">
            <span>{{scope.row.orgName}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" prop="isIntendedUser" label="意向用户" width="70">
          <template slot-scope="scope">
            <span v-if="checkFlagUser(scope.row)"><i class="iconfont el-icon-myduihao" style="color: red;"></i></span>
            <span v-else></span>
          </template>
        </el-table-column>
        <el-table-column align="left" prop="demandPersonName" label="需求人" width="80">
          <template slot-scope="scope">
            <span>{{scope.row.demandPersonName}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" prop="orgEditionName" label="版本类型" width="120" >
          <template slot-scope="scope">
            <span >{{scope.row.orgEditionName}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" prop="userCount" label="用户限制" width="70" >
          <template slot-scope="scope">
            <span >{{scope.row.userCount}}</span>
          </template>
        </el-table-column>
        <el-table-column align="left" prop="createTime" label="创建日期" width="150" >
          <template slot-scope="scope">
            <span >{{scope.row.createTime}}</span>
          </template>
        </el-table-column>
        <el-table-column align="left" prop="stopDate" label="失效日期" width="150" >
          <template slot-scope="scope">
            <span >{{scope.row.stopDate}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center"  label="是否失效" width="70" >
          <template slot-scope="scope">
            <span v-if="checkFlagStatus(scope.row)"><i class="iconfont el-icon-myduihao" style="color: red;"></i></span>
            <span v-else></span>
          </template>
        </el-table-column>
        <el-table-column align="center" prop="orgUserCount" label="用户数量" width="80" >
          <template slot-scope="scope">
            <span >{{scope.row.orgUserCount}}</span>
          </template>
        </el-table-column>

        <el-table-column align="center" prop="orgCoopCount" label="客商数量" min-width="90">
          <template slot-scope="scope">
            <span>{{scope.row.orgCoopCount}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" prop="orgOrderCount" label="订单数量" width="70" >
          <template slot-scope="scope">
            <span >{{scope.row.orgOrderCount}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" prop="" label="订单日期" width="100" >
          <template slot-scope="scope">
            <span >{{orderDate(scope.row)}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" prop="subscriptionNum" label="订阅数量" width="70" >
          <template slot-scope="scope">
            <span >{{scope.row.subscriptionNum}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" prop="" label="订阅日期" width="100" >
          <template slot-scope="scope">
            <span >{{paseDate(scope.row)}}</span>
          </template>
        </el-table-column>
        <el-table-column align="left" prop="orgFromRemark" label="注册来源" width="220" >
          <template slot-scope="scope">
            <span >{{scope.row.orgFromRemark}}</span>
          </template>
        </el-table-column>
        <el-table-column align="left" prop="adminName" label="管理员账户" width="150">
          <template slot-scope="scope">
            <span >{{scope.row.adminName}}</span>
          </template>
        </el-table-column>
        <el-table-column align="left" prop="adminEmail" label="管理员邮箱" width="180">
          <template slot-scope="scope">
            <span >{{scope.row.adminEmail}}</span>
          </template>
        </el-table-column>
        <el-table-column align="left" prop="adminTel" label="管理员电话" width="220" >
          <template slot-scope="scope">
            <span >{{scope.row.adminInternationalCountryCode}} {{scope.row.adminTel}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" prop="orgRemark" label="备注信息" width="300">
          <template slot-scope="scope">
            <span >{{scope.row.orgRemark}}</span>
          </template>
        </el-table-column>
      </el-table>
      <el-col :span="24" class="pagination">
        <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="pageConf.pageCode" :page-sizes="pageConf.pageOption" :page-size.sync="pageConf.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="pageConf.totalPage">
        </el-pagination>
      </el-col>
    </el-row>

    <page-save ref="addMission" v-if="save1Visible" :visible.sync="save1Visible"></page-save>
    <page-edit ref="addMission" v-if="editVisible" :visible.sync="editVisible" :frow="frow"></page-edit>
    <page-permission ref="addMission" v-if="permissionVisible" :visible.sync="permissionVisible" :frow="frow"></page-permission>
    <page-interfacee ref="addMission" v-if="interfaceVisible" :visible.sync="interfaceVisible" :frow="frow"></page-interfacee>
    <additional-services ref="addMission" v-if="additionalServicesVisible" :visible.sync="additionalServicesVisible" :frow="frow"></additional-services>

  </div>
</template>
<script>

  import save from './org/hrs_org_save'
  import edit from './org/hrs_org_edit'
  import permission from './org/hrs_org_permission'
  import pageInterface from './org/hrs_org_interface'
  import additionalServices from './org/hrs_org_additional_services'

  export default {
    data() {
      return {
        loading: false,
        showFlag: false,
        useroptions:[],
        orgEditions:[],
        isStatuss: [
          { code: '1', label: '全部', value: "" },
          { code: '2', label: '有效', value: "1" },
          { code: '3', label: '失效', value: "0" }
        ],
        intendedUsers:[
          { code: 0, label: '全部', value: "0" },
          { code: 1, label: '是', value: "1" }
        ],
        data1: [],
        pageConf: {
          //设置一些初始值(会被覆盖)
          pageCode: 1, //当前页
          pageSize: 10, //每页显示的记录数
          totalPage: 0, //总记录数
          pageOption: [10, 30, 50], //分页选项
          handleCurrentChange: function() {
          }
        },
        query: {
          isStatus:"1",
          demandPersonId:"",
          orgEditionId:"",
          createTimeEnd:"",
          createTimeStart:"",
          orgType:"2",
          orgName:"",
          intendedUser:"",
          adminEmail: '',
          adminTel: '',
        },
        isIndeterminate: false,
        save1Visible: false,
        save2Visible: false,
        editVisible: false,
        permissionVisible: false,
        interfaceVisible: false,
        additionalServicesVisible: false,
        frow: {}
      }

    },
    created: function() {
      this.query.createTimeStart = this.getDateTime2(new Date());
      //ef 公司 有效员工
      this.$axios.get('/hrs/user/searchUserByOrg')
        .then(function(response) {
          this.useroptions = response.data.data;
        }.bind(this));
      this.loadPermission(this.permission);

      this.$axios.get('/hrs/org/queryModelOrg')
        .then(function(response) {
          this.orgEditions = response.data.data;
        }.bind(this));
    },
    provide() {
      return {
        queryList: this.queryList
      }
    },
    components: {
      'page-save': save,
      'page-edit': edit,
      'page-permission': permission,
      'page-interfacee': pageInterface,
      'additional-services': additionalServices,
    },

    methods: {
      orgTypeStr(str){
        if(str==1){
          return "公司";
        }
        if(str==2){
          return "个人";
        }
        return "";
      },
      //订单时间
      orderDate(row){
        let timeAfFlag = false;
        let timeScFlag = false;
        let timeAf = null;
        let timeSc= null;
        if(row.createTimeAf){
          timeAfFlag = true;
          timeAf = Date.parse(row.createTimeAf);
        }
        if(row.createTimeSc){
          timeScFlag = true;
          timeSc = Date.parse(row.createTimeSc);
        }
        if(timeAfFlag&&timeScFlag){
          if(timeAf>timeSc){
            return row.createTimeAf;
          }else{
            return row.createTimeSc;
          }
        }
        if(timeAfFlag&&!timeScFlag){
          return row.createTimeAf;
        }
        if(!timeAfFlag&&timeScFlag){
          return row.createTimeSc;
        }
        if(!timeAfFlag&&!timeScFlag){
          return "";
        }
      },
      paseDate(row){
          if(row.subscriptionTime){
              return row.subscriptionTime.substring(0,10);
          }
      },
      //是否失效
      checkFlagStatus(row){
        if(row.orgStatus>0&& new Date()<Date.parse(row.stopDate)){
          return false;
        }else{
          return true;
        }
      },
      //是否是意向客户
      checkFlagUser(row){
        let flagUser = true;
        if((row.intendedUser == null || row.intendedUser == '') && row.intendedUser !== 0){
            row.intendedUser = -1;
        }
        if(row.orgEditionName.indexOf('内部')>0||row.orgEditionName=='标准版' || row.orgEditionName=='专业版' || row.orgEditionName=='创业版' || row.orgEditionName=='旗舰版'){
           flagUser = false;
        }
        if((row.orgOrderCount>0||row.orgCoopCount>2 || row.intendedUser == 1 || row.subscriptionNum > 0) && row.intendedUser !== 0 && flagUser){
          return true;
        }else{
          return false;
        }
      },
      querySettleList() {
        let param = "size=" + this.pageConf.pageSize + "&current=" + this.pageConf.pageCode;
        let that = this;
        this.$axios.get2('/hrs/org/page?'+param,that.query).then(function(response) {
          that.data1 = response.data.data.records;
          that.pageConf.totalPage = response.data.data.total;
          if (that.data1.length==0) {
            let current=Math.ceil(that.pageConf.totalPage/that.pageConf.pageSize);
            that.queryList2(current);
          }
        }).catch(function(error) {
          console.error(error);
        });
      },
      queryList2(current) {
        let param = "size=" + this.pageConf.pageSize + "&current=" + current;
        let that = this;
        this.$axios.get2('/hrs/org/page?' + param,that.query).then(function(response) {
          that.data1 = response.data.data.records;
          that.pageConf.totalPage = response.data.data.total;
        }).catch(function(error) {
          console.error(error);
        });

      },
      //pageSize改变时触发的函数
      handleSizeChange() {
        this.querySettleList();
      },
      //当前页改变时触发的函数
      handleCurrentChange(val) {
        this.querySettleList();
      },
      getDateTime(theDate) {
        let _year = theDate.getFullYear();
        let _month = theDate.getMonth();
        _month = _month;
        if (_month < 10) {
          _month = "0" + _month;
        }
        return _year + "-" + _month + "-01 23:59:59";
      },
      getDateTime2(theDate) {
        let _year = theDate.getFullYear();
        let _month = theDate.getMonth();
        if (_month === 0) {
            _year = parseInt(_year) - 1;
            _month = 12;
        }
        _month = _month;
        if (_month < 10) {
          _month = "0" + _month;
        }
        return _year + "-" + _month + "-01 00:00:00";
      },
      handleCommand(command) {
        if(command == 'edit') {
          this.showedit(this.currRow)
        } else if(command == 'leave') {
          this.showpermission(this.currRow)
        } else if(command == 'interface') {
          this.showinterface(this.currRow)
        } else if(command == 'enabledIntendedUser'){
          this.enabledIntendedUser(this.currRow['orgId']);
        }else if(command == 'disabledIntendedUser'){
          this.disabledIntendedUser(this.currRow['orgId']);
        }else if(command == 'unenabledIntendedUser'){
            this.unenabledIntendedUser(this.currRow['orgId']);
        }else if(command == 'additionalServices'){
          this.additionalServices(this.currRow);
        }
      },
      handleChange(command) {
        this.currRow = command
      },
      // 添加弹窗
      showsave() {
        this.save1Visible = true;
      },
      showsave2(row) {
        this.frow = row;
        this.save2Visible = true;
      },
      showedit(row) {
        this.frow = row;
        this.editVisible = true;
      },
      showpermission(row) {
        this.frow = row;
        this.permissionVisible = true;
      },
      showinterface(row) {
        this.frow = row;
        this.interfaceVisible = true;
      },
      // 关闭所有弹窗
      cancelVisible() {
        this.save1Visible = false;
        this.save2Visible = false;
        this.editVisible = false;
        this.permissionVisible = false;
      },
      enabledIntendedUser(orgId){
        this.$confirm(' 是否 将该签约用户 设为意向用户？', '注意', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
          center: true
        }).then(() => {
          this.$axios.put('/hrs/org/editIntended/enabled/' + orgId)
            .then(function(response) {
              if(response.data.code == 0) {
                this.querySettleList();
              } else {
                this.openError(response.data.messageInfo);
              }
            }.bind(this));
        }).catch(() => {
        });
      },
      disabledIntendedUser(orgId){
        this.$confirm('是否 将该签约用户 取消非意向用户？', '注意', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
          center: true
        }).then(() => {
          this.$axios.put('/hrs/org/editIntended/disabled/' + orgId)
            .then(function(response) {
              if(response.data.code == 0) {
                this.querySettleList();
              } else {
                this.openError(response.data.messageInfo);
              }
            }.bind(this));
        }).catch(() => {
        });
      },
      unenabledIntendedUser(orgId){
          this.$confirm('是否 将该签约公司 设为非意向用户？', '注意', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning',
              center: true
          }).then(() => {
              this.$axios.put('/hrs/org/editIntended/unenabled/' + orgId)
                  .then(function(response) {
                      if(response.data.code == 0) {
                          this.querySettleList();
                      } else {
                          this.openError(response.data.messageInfo);
                      }
                  }.bind(this));
          }).catch(() => {
          });
      },
      openError(info) {
        this.$notify({
          title: '',
          message: info,
          type: 'error',
          position: 'bottom-right'
        });
      },
      additionalServices(currRow) {
        this.frow = currRow;
        this.additionalServicesVisible = true;
      }
    },

  }
</script>
