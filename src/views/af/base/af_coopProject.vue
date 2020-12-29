<template>
  <div >
    <div>
      <el-form :inline="true" :model="query" label-width="100px" class="demo-ruleForm">
        <el-row>
          <el-col :span="20">
            <el-form-item label="业务范畴">
              <el-select v-model="query.businessScope" clearable filterable placeholder="请选择">
              <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
            </el-form-item>
            <el-form-item label="助记码">
              <el-input v-model="query.projectCode"  clearable auto-complete="off">
              </el-input>
            </el-form-item>
            <el-form-item label="项目名称">
              <el-input v-model="query.projectName" clearable auto-complete="off">
              </el-input>
            </el-form-item>
            <el-form-item label="是否锁定">
              <el-select v-model="query.isLock" clearable placeholder="请选择" style="width:100px">
                <el-option label="是" value="1"></el-option>
                <el-option label="否" value="0"></el-option>               
              </el-select>
            </el-form-item>
            <el-form-item label="是否停用">
              <el-select v-model="query.isStop" clearable placeholder="请选择" style="width:100px">
                <el-option label="是" :value="1"></el-option>
                <el-option label="否" :value="0"></el-option>               
              </el-select>
            </el-form-item>
          </el-col>
            <el-col :span="4" style="text-align: center; margin-right: -12px;">
              <el-button type="primary" size="medium"icon="el-icon-search" @click="queryList">搜索</el-button>
              <el-button type="primary" size="medium" v-on:click="showsave">新建</el-button>
            </el-col>
          </el-row>
          <el-row>
          <el-col :span="24">
            <el-form-item label="责任销售">
              <el-input v-model="query.salesName"  clearable auto-complete="off">
              </el-input>
            </el-form-item>
            <el-form-item label="责任客服">
              <el-input v-model="query.servicerName"  clearable auto-complete="off">
              </el-input>
            </el-form-item>
            <el-form-item label="销售经理">
              <el-input v-model="query.salesManagerName" clearable auto-complete="off">
              </el-input>
            </el-form-item>
            <el-form-item label="是否海外项目">
              <el-select v-model="query.isOverseas" clearable placeholder="请选择" style="width:100px">
                <el-option label="是" value="1"></el-option>
                <el-option label="否" value="0"></el-option>               
                </el-select>
            </el-form-item>
            <el-form-item label="是否公司项目">
              <el-select v-model="query.isHeadquarters" clearable placeholder="请选择" style="width:100px">
                <el-option label="是" value="1"></el-option>
                <el-option label="否" value="0"></el-option>               
                </el-select>
            </el-form-item>
          </el-col>

          </el-row>
        </el-form>
      </div>
      <div>
      <el-table :data="data1" >
        <el-table-column prop="businessScope" label="业务范畴" width="100"></el-table-column>
        <el-table-column prop="projectCode" label="助记码" ></el-table-column>
        <el-table-column prop="projectName" label="项目名称"></el-table-column>
        <el-table-column prop="salesName" label="责任销售" width="120"></el-table-column>
        <el-table-column prop="servicerName" label="责任客服" width="120"></el-table-column>
        <el-table-column prop="salesManagerName" label="责任经理" width="120"></el-table-column>
        <el-table-column prop="isOverseas" label="海外项目" :formatter="formatIsOverseas" width="100"></el-table-column>
        <el-table-column prop="isHeadquarters" label="公司项目" :formatter="formatIsHeadquarters" width="100"></el-table-column>
        <el-table-column prop="isStop" label="停用" :formatter="formatIsStop" width="100"></el-table-column>
        <el-table-column prop="lockUserId" label="锁定" :formatter="formatIsLock" width="100"></el-table-column>
        <el-table-column prop="openLimit" label="延期开锁至" width="100"></el-table-column>
        <el-table-column  label="操作" width="70">
          <template slot-scope="scope">
            <el-dropdown trigger="click" @command="handleCommand" @visible-change="handleChange(scope.row)">
              <i class="el-icon-s-operation"></i>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item command="edit">修改</el-dropdown-item>
                <el-dropdown-item command="Stop">停用</el-dropdown-item>
                <el-dropdown-item command="Lock">锁定</el-dropdown-item>
                <el-dropdown-item command="Open">解锁</el-dropdown-item>
                <el-dropdown-item command="OpenTime">延期</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </template>
        </el-table-column>
        <!-- <el-table-column fixed="right" label="操作" width="100">
          <template slot-scope="scope">
            <el-button type="text" size="small" @click="showedit(scope.row)">修改</el-button>
            <el-button type="text" size="small" @click="showStop(scope.row)">停用</el-button>
            <el-button type="text" size="small" @click="showLock(scope.row)">锁定</el-button>
            <el-button type="text" size="small" @click="showOpen(scope.row)">解锁</el-button>
            <el-button type="text" size="small" @click="showOpenTime(scope.row)">延期</el-button>
          </template>
        </el-table-column> -->
      </el-table>
      </div>
      <div>
        <el-pagination background
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page.sync="pageConf.pageCode"
          :page-sizes="pageConf.pageOption"
          :page-size.sync="pageConf.pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="pageConf.totalPage">
        </el-pagination>
      </div>
      <page-save ref="addMission" v-if="saveVisible" :visible.sync="saveVisible" :frow="frow">
      </page-save>
      <page-edit ref="addMission" v-if="editVisible" :visible.sync="editVisible" :frow="frow">
      </page-edit>
      <page-stop ref="addMission" v-if="stopVisible" :visible.sync="stopVisible" :frow="frow">
      </page-stop>
      <page-lock ref="addMission" v-if="lockVisible" :visible.sync="lockVisible" :frow="frow">
      </page-lock>
      <page-open ref="addMission" v-if="openVisible" :visible.sync="openVisible" :frow="frow">
      </page-open>
      <page-openTime ref="addMission" v-if="openTimeVisible" :visible.sync="openTimeVisible" :frow="frow">
      </page-openTime>
  </div>
</template>
<script>
  import save from './coopProject/af_coopProject_save'
  import edit from './coopProject/af_coopProject_edit'
  import stop from './coopProject/af_coopProject_stop'
  import lock from './coopProject/af_coopProject_lock'
  import open from './coopProject/af_coopProject_open'
  import openTime from './coopProject/af_coopProject_openTime'
  export default {
    data() {
      return {
        loading: false,
        data1: [],
        options:[],
        pageConf: {
            //设置一些初始值(会被覆盖)
            pageCode: 1, //当前页
            pageSize: 10, //每页显示的记录数
            totalPage: 0, //总记录数
            pageOption: [10, 50, 100], //分页选项
            handleCurrentChange: function () {
            console.log("页码改变了");
            }
        },
        fileList:[],
        saveVisible: false,
        editVisible: false,
        stopVisible: false,
        lockVisible: false,
        openVisible: false,
        openTimeVisible: false,
        frow:{},
        query: {
          businessScope:'',
          projectCode: '',
          projectName: '',
          isLock: '',
          isStop: 0,
          salesName:'',
          servicerName: '',
          salesManagerName: '',
          isOverseas: '',
          isHeadquarters: ''
        }
      }
    },
    created: function(){
      this.$axios.get('/afbase/awb/selectCategory?category=业务范畴').then(function(response) {
          this.options=response.data.data;
       }.bind(this)
      );
      // this.queryList();
    },
    provide(){
        return{
            queryList:this.queryList
        }
    },
    components: {
      'page-save': save,
      'page-edit': edit,
      'page-stop': stop,
      'page-lock': lock,
      'page-open': open,
      'page-openTime': openTime
    },
    methods: {
      handleCommand(command) {
        if(command == 'edit') {
          this.showedit(this.currRow)
        } else if(command == 'Stop') {
          this.showStop(this.currRow)
        } else if(command == 'Lock') {
          this.showLock(this.currRow)
        } else if(command == 'Open') {
          this.showOpen(this.currRow)
        } else if(command == 'OpenTime') {
          this.showOpenTime(this.currRow)
        } 
      },
      handleChange(command) {
        this.currRow = command
      },
      showsave(){
        this.frow.businessScope=this.query.businessScope;
        this.saveVisible = true;
      },
      showedit(row){
        this.frow=row;
        this.editVisible = true;
      },
      showStop(row){
        this.frow=row;
        this.stopVisible = true;
      },
      showLock(row){
        this.frow=row;
        this.lockVisible = true;
      },
      showOpen(row){
        this.frow=row;
        this.openVisible = true;
      },
      showOpenTime(row){
        this.frow=row;
        this.openTimeVisible = true;
      },
      openError(info) {
        this.$notify({
          title: '',
          message: '操作失败，'+info,
          type: 'error',
          position: 'bottom-right'
        });
      },
      queryList(){
        if (this.query.businessScope=='null') {
          this.query.businessScope='';
        }
        if (this.query.isLock=='null') {
          this.query.isLock='';
        }
        if (this.query.isStop=='null') {
          this.query.isStop='';
        }
        if (this.query.isOverseas=='null') {
          this.query.isOverseas='';
        }
        if (this.query.isHeadquarters=='null') {
          this.query.isHeadquarters='';
        }
        // if(this.query.businessScope.trim() == '') {
        //   this.openError("请选择业务范畴", "查询")
        //   return
        // }
        // if (this.query.apCode.trim()||this.query.warehouseCode.trim()||this.query.warehouseNameCn.trim()) {
          let param = "size="+this.pageConf.pageSize+"&current="+this.pageConf.pageCode
          +"&businessScope="+this.query.businessScope+"&projectCode="+this.query.projectCode
          +"&projectName="+this.query.projectName+"&isLock="+this.query.isLock
          +"&isStop="+this.query.isStop+"&salesName="+this.query.salesName
          +"&servicerName="+this.query.servicerName+"&salesManagerName="+this.query.salesManagerName
          +"&isOverseas="+this.query.isOverseas+"&isHeadquarters="+this.query.isHeadquarters
          ;
          let that  = this;
          this.$axios.get('/afbase/coopProject/page?'+param).then(function(response){
              that.data1 = response.data.data.records;
              that.pageConf.totalPage=response.data.data.total;
              if (that.data1.length==0) {
                let current=Math.ceil(that.pageConf.totalPage/that.pageConf.pageSize);
                that.queryList2(current);
              }
          }).catch(function (error) {
            console.log(error);
          });
        // } else{
        //   this.data1 =[];
        //   this.pageConf.totalPage=0;
        //    this.$message.error('查询失败，请输入查询条件！');
        // }      
        
      },
      queryList2(current){   
      let param = "size="+this.pageConf.pageSize+"&current="+current
          +"&businessScope="+this.query.businessScope+"&projectCode="+this.query.projectCode
          +"&projectName="+this.query.projectName+"&isLock="+this.query.isLock
          +"&isStop="+this.query.isStop+"&salesName="+this.query.salesName
          +"&servicerName="+this.query.servicerName+"&salesManagerName="+this.query.salesManagerName
          +"&isOverseas="+this.query.isOverseas+"&isHeadquarters="+this.query.isHeadquarters
          ;
        let that  = this;
        this.$axios.get('/afbase/coopProject/page?'+param).then(function(response){
            that.data1 = response.data.data.records;
            that.pageConf.totalPage=response.data.data.total;
        }).catch(function (error) {
          console.log(error);
        });
      },
      //pageSize改变时触发的函数
      handleSizeChange() {
        this.queryList();
      },
      //当前页改变时触发的函数
      handleCurrentChange() {
        this.queryList();
      },
      
      formatStatus(row, column){
        return row.apStatus == true ? "生效" : row.apStatus == false ? "失效" : "";
      },
      formatIsOverseas(row, column){
        if (row.isOverseas=='1') {
          return '√';
        }else{
          return "";
        } 
      },
      formatIsHeadquarters(row, column){
        if (row.isHeadquarters=='1') {
          return '√';
        }else{
          return "";
        } 
      },
      formatIsLock(row, column){
        if (row.isLock=='1') {
          return '√';
        }else{
          return "";
        } 
      },
      formatIsStop(row, column){
        if (row.isStop=='1') {
          return '√';
        }else{
          return "";
        } 
      }
   

    }
  }
</script>

