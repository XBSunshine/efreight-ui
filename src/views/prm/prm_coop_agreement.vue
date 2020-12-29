<template>
  <div class="warp-main">
    <el-row v-loading="loading" element-loading-text="拼命加载中">
      <el-col class="toolbar" style="padding-bottom: 0;">
        <el-form :inline="false" :model="query" class="demo-ruleForm">
            <el-row>
              <el-col class="elementWidth">
                <el-form-item label="客户名称" label-width="85px">
                  <el-input v-model="query.coop_name" auto-complete="off" clearable style="width: 135px;">
                  </el-input>
                </el-form-item>
              </el-col>
               <el-col class="elementWidth">
                <el-form-item label="合同类型" label-width="85px">
                <el-select v-model="query.agreement_type" clearable placeholder="" style="width: 120px;">
                <el-option label="商务合作类" value="商务合作类"></el-option>
                <el-option label="人力行政类" value="人力行政类"></el-option>
                <el-option label="IT研发类" value="IT研发类"></el-option>
                <el-option label="财务管理类" value="财务管理类"></el-option>
                <el-option label="法务审计类" value="法务审计类"></el-option>
                </el-select>
                </el-form-item>
              </el-col>
              <el-col class="elementWidth">
                <el-form-item label="合同编号" label-width="85px">
                  <el-input v-model="query.serial_number" auto-complete="off" clearable style="width: 135px;">
                  </el-input>
                </el-form-item>
              </el-col>

              <el-col class="elementWidth">
                <el-form-item style="margin-left: 25px;">
                  <el-button type="text" size="medium" v-if=showFlag v-on:click="showFlag=false">收起</el-button>
                  <el-button type="text" size="medium" v-if=!showFlag v-on:click="showFlag=true">展开</el-button>
                  <el-button type="primary" size="small" v-on:click="findByPage">查询</el-button>
                  <el-button type="primary" size="small" v-on:click="exportExcel" v-if="exportButtonFlag">导出</el-button>
                  <el-button type="primary" size="small" v-on:click="showsave" v-if="addButtonFlag">新增</el-button>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row v-show=showFlag>
              <el-col class="elementWidth">
                <el-form-item label="经办人" label-width="85px">
                  <el-input v-model="query.incharge_name" auto-complete="off" clearable style="width: 135px;">
                </el-input>
                </el-form-item>
              </el-col>
              <el-col class="elementWidth">
                <el-form-item label="是否有效" label-width="85px">
                <el-select v-model="query.agreement_status" clearable placeholder="" style="width: 80px;">
                <el-option label="是" value="1"></el-option>
                <el-option label="否" value="0"></el-option>
                </el-select>
                </el-form-item>
              </el-col>
              <el-col class="elementWidth">
                <el-form-item label="有效期" label-width="125px">
                  <el-date-picker v-model="query.begin_date"  type="date" value-format="yyyy-MM-dd" placeholder="选择开始时间" style="width: 150px;">
                  </el-date-picker>
                </el-form-item>
              </el-col>
              <el-col class="elementWidth">
                <el-form-item label="到" label-width="55px">
                  <el-date-picker v-model="query.end_date"  type="date" value-format="yyyy-MM-dd" placeholder="选择结束时间" style="width: 150px;">
                  </el-date-picker>
                </el-form-item>
              </el-col>
              <el-col class="elementWidth">
                <el-form-item label="业务范畴" label-width="85px">
                <el-input v-model="query.business_scope" auto-complete="off" v-show="false"></el-input>
                <el-checkbox-group v-model="checkedCities" @change="handleCheckedCitiesChange" clearable>
                  <el-checkbox v-for="city in cities" :label="city" :key="city">{{city}}</el-checkbox>
                </el-checkbox-group>
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
      </el-col>
      <el-table :data="data1" border>
        <el-table-column  label="操作" width="60" fixed="left" align="center">
          <template slot-scope="scope">
            <el-dropdown trigger="click" @command="handleCommand" @visible-change="handleChange(scope.row)">
              <i class="el-icon-s-operation"></i>
              <el-dropdown-menu slot="dropdown">
              	<el-dropdown-item></el-dropdown-item>
                <el-dropdown-item command="edit" v-if="editButtonFlag">编辑</el-dropdown-item>
                <el-dropdown-item command="stop" v-if="stopButtonFlag">废止</el-dropdown-item>
                <el-dropdown-item command="extension" v-if="extensionButtonFlag">延期</el-dropdown-item>
                <el-dropdown-item command="renew" v-if="renewButtonFlag">续签</el-dropdown-item>
                <el-dropdown-item command="list" v-if="listButtonFlag">记录</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </template>
        </el-table-column>
        <el-table-column prop="coop_name" label="客户名称" width="250"></el-table-column>
        <el-table-column prop="agreement_type" label="合同类型" sortable width="100"></el-table-column>
        <el-table-column prop="template" label="合同模板" width="70"></el-table-column>
        <el-table-column prop="serial_number" label="合同编号" width="160"></el-table-column>
        <el-table-column prop="begin_date" label="开始时间" width="90"></el-table-column>
        <el-table-column prop="end_date" label="结束时间" width="90"></el-table-column>
        <el-table-column prop="incharge_name" label="经办人" width="70"></el-table-column>
        <el-table-column prop="business_scope" label="业务范畴" width="80"></el-table-column>
        <el-table-column prop="settlement_period" label="结算周期" width="70"></el-table-column>
        <el-table-column prop="payment_standard" label="账期标准" width="80"></el-table-column>
        <el-table-column prop="payment_period" label="合同账期" width="80"></el-table-column>
        <el-table-column prop="total_amount" label="合同额度" width="80" :formatter="formatMoney"></el-table-column>
        <el-table-column ></el-table-column>
      </el-table>
    <div class="pagination">
        <el-pagination
                background
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :current-page.sync="pageConf.pageCode"
                :page-sizes="pageConf.pageOption"
                :page-size.sync="pageConf.pageSize"
                layout="total, sizes, prev, pager, next, jumper"
                :total="pageConf.totalPage">
        </el-pagination>
    </div>
    </el-row>
  <saveVisibleTag ref="addMission" v-if="saveVisible" :visible.sync="saveVisible"></saveVisibleTag>
  <editVisibleTag ref="addMission" v-if="editVisible" :visible.sync="editVisible" :frow="frow"></editVisibleTag>
  <stopVisibleTag ref="addMission" v-if="stopVisible" :visible.sync="stopVisible" :frow="frow"></stopVisibleTag>
  <extensionVisibleTag ref="addMission" v-if="extensionVisible" :visible.sync="extensionVisible" :frow="frow"></extensionVisibleTag>
  <renewVisibleTag ref="addMission" v-if="renewVisible" :visible.sync="renewVisible" :frow="frow"></renewVisibleTag>
  <listVisibleTag ref="addMission" v-if="listVisible" :visible.sync="listVisible" :frow="frow"></listVisibleTag>
</div>
</template>
<script>
import saveVisibleVue from './agreement/prm_coop_agreement_save'
import editVisibleVue from './agreement/prm_coop_agreement_edit'
import stopVisibleVue from './agreement/prm_coop_agreement_stop'
import extensionVisibleVue from './agreement/prm_coop_agreement_extension'
import renewVisibleVue from './agreement/prm_coop_agreement_renew'
import listVisibleVue from './agreement/prm_coop_agreement_signing'
// const cityOptions = ['EF','AE','AI','SE','SI','TE','TI'];
  export default {
        data () {
            return {

              /*表数据*/
              showFlag:false,
              checkedCities: [],
              cities: [],
              data1: [],
              loading: false,
              pageConf: {
                  //设置一些初始值(会被覆盖)
                  pageCode: 1, //当前页
                  pageSize: 10, //每页显示的记录数
                  totalPage: 0, //总记录数
                  pageOption: [10, 30, 50], //分页选项
                  handleCurrentChange: function () {
                  console.log("页码改变了");
                }
              },
              query: {
                coop_name: '',
                business_scope: '',
                agreement_type: '',
                begin_date: '',
                end_date: '',
                serial_number: '',
                signing_dept_name: '',
                incharge_name: '',
                agreement_status: '',
                org_id: '',
                dept_id: ''
              },
               saveVisible:false,
               editVisible:false,
               stopVisible:false,
               extensionVisible:false,
               renewVisible:false,
               listVisible:false,
               frow:{},
               exportButtonFlag:false,
               addButtonFlag:false,
               editButtonFlag:false,
               stopButtonFlag:false,
               extensionButtonFlag:false,
               renewButtonFlag:false,
               listButtonFlag:false,
          }
        },
        created(){
            let buttonInfo = window.localStorage.getItem('buttonInfo')
            if (buttonInfo.indexOf('sys_coop_agreement_export')>-1) {
                this.exportButtonFlag=true;
            }
            if (buttonInfo.indexOf('sys_coop_agreement_add')>-1) {
                this.addButtonFlag=true;
            }
            if (buttonInfo.indexOf('sys_coop_agreement_edit')>-1) {
                this.editButtonFlag=true;
            }
            if (buttonInfo.indexOf('sys_coop_agreement_stop')>-1) {
                this.stopButtonFlag=true;
            }
            if (buttonInfo.indexOf('sys_coop_agreement_extension')>-1) {
                this.extensionButtonFlag=true;
            }
            if (buttonInfo.indexOf('sys_coop_agreement_renew')>-1) {
                this.renewButtonFlag=true;
            }
            if (buttonInfo.indexOf('sys_coop_agreement_list')>-1) {
                this.listButtonFlag=true;
            }
            this.findByPage();
        },
        mounted(){
          if (window.localStorage.getItem("orgCode").toUpperCase()=="EFTBJS") {
            this.cities=['EF','AE','AI','SE','SI','TE','TI'];
          }else{
            this.cities=['AE','AI','SE','SI','TE','TI'];
          }
        },
        components: {
          'saveVisibleTag': saveVisibleVue,
          'editVisibleTag': editVisibleVue,
          'stopVisibleTag': stopVisibleVue,
          'extensionVisibleTag': extensionVisibleVue,
          'renewVisibleTag': renewVisibleVue,
          'listVisibleTag': listVisibleVue
        },
        provide(){
            return{
                findByPage:this.findByPage
            }
        },
        methods:{
          formatMoney(row, column){
              if(row.total_amount === '' || row.total_amount === 0) return ''
              row.total_amount = Number(row.total_amount)
              if(isNaN(row.total_amount)) return ''
              return row.total_amount.toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,')
          },
          handleCommand(command) {
            if(command == 'edit') {
              this.showedit(this.currRow)
            } else if(command == 'stop') {
              this.showStop(this.currRow)
            } else if(command == 'extension') {
              this.showExtension(this.currRow)
            } else if(command == 'renew') {
              this.showRenew(this.currRow)
            } else if(command == 'list') {
              this.showlist(this.currRow)
            }
          },
          handleChange(command) {
            this.currRow = command
          },
              showsave(){
                this.saveVisible = true;
              } ,
              showlist(row){
                this.frow=row;
                this.listVisible = true;
              } ,
              showedit(row){
                this.frow=row;
                this.editVisible = true;
              } ,
              showStop(row){
                this.frow=row;
                this.stopVisible = true;
              } ,
              showExtension(row){
                this.frow=row;
                this.extensionVisible = true;
              } ,
              showRenew(row){
                this.frow=row;
                this.renewVisible = true;
              } ,
             findByPage() {
                let params={
                  'currentPage': this.pageConf.pageCode,
                  'pageSize': this.pageConf.pageSize,
                  'coop_name':this.query.coop_name,
                  'business_scope':this.query.business_scope,
                  'agreement_type':this.query.agreement_type,
                  'begin_date':this.query.begin_date,
                  'end_date':this.query.end_date,
                  'serial_number':this.query.serial_number,
                  'signing_dept_name':this.query.signing_dept_name,
                  'incharge_name':this.query.incharge_name,
                  'agreement_status':this.query.agreement_status,
                  'org_id':this.query.org_id
                }
                this.$axios.post('/prm/coopagreement/queryList',params)
                .then(function(response) {
                    this.data1=response.data.data.dataList;
                    this.pageConf.totalPage=response.data.data.totalNum;
                 }.bind(this)
                );
            },
            exportExcel() {
              // let params={
              //     'coop_name':this.query.coop_name,
              //     'business_scope':this.query.business_scope,
              //     'agreement_type':this.query.agreement_type,
              //     'begin_date':this.query.begin_date,
              //     'end_date':this.query.end_date,
              //     'serial_number':this.query.serial_number,
              //     'signing_dept_name':this.query.signing_dept_name,
              //     'incharge_name':this.query.incharge_name,
              //     'agreement_status':this.query.agreement_status,
              //     'org_id':this.query.org_id
              //   }
              //   let paramsStr = encodeURI(JSON.stringify(params));
              //     let url = '/prm/coopagreement/exportExcel?paramsStr='+paramsStr;
              //     window.location.href = url
              //   }

                // window.location.href='http://localhost:8082/coopagreement/exportExcel';
                let params={

                  'coop_name':this.query.coop_name,
                  'business_scope':this.query.business_scope,
                  'agreement_type':this.query.agreement_type,
                  'begin_date':this.query.begin_date,
                  'end_date':this.query.end_date,
                  'serial_number':this.query.serial_number,
                  'signing_dept_name':this.query.signing_dept_name,
                  'incharge_name':this.query.incharge_name,
                  'agreement_status':this.query.agreement_status,
                  'org_id':this.query.org_id
                }
                this.$axios.post3('/prm/coopagreement/exportExcel',params
                 )
                .then(function(response) {
                  // let blob = new Blob([res.data], {type: "application/vnd.ms-excel"});
                  // let objectUrl = URL.createObjectURL(blob);
                  // window.location.href = objectUrl;
    //===================
                  // if(res.status == "200") {
                  //   const aLink = document.createElement("a");
                  //   let blob = new Blob([res.data], {type: "application/vnd.ms-excel"})
                  //   aLink.href = URL.createObjectURL(blob)
                  //   aLink.setAttribute('download', '客户资源' + '.xlsx') // 设置下载文件名称
                  //   aLink.click()
                  //   //document.body.appendChild(aLink)
                  //   this.$refs.loadElement.appendChild(aLink)
                  // }
//=================
                  //   const link = document.createElement('a')
                  // let blob = new Blob([res.data],{type: 'application/vnd.ms-excel'});
                  // link.style.display = 'none'
                  // link.href = URL.createObjectURL(blob);
                  // let num = ''
                  // for(let i=0;i < 10;i++){
                  //   num += Math.ceil(Math.random() * 10)
                  // }
                  // link.setAttribute('download', '用户_' + num + '.xls')
                  // document.body.appendChild(link)
                  // link.click()
                  // document.body.removeChild(link)
//===================
                  // const blob  = new Blob([res.data],{type: 'application/octet-stream'});
                  //  const fileName = 'xxx.xls';
                  //   const linkNode = document.createElement('a');

                  //   linkNode.download = fileName; //a标签的download属性规定下载文件的名称
                  //   linkNode.style.display = 'none';
                  //   linkNode.href = URL.createObjectURL(blob); //生成一个Blob URL
                  //   document.body.appendChild(linkNode);
                  //   linkNode.click();  //模拟在按钮上的一次鼠标单击

                  //   URL.revokeObjectURL(linkNode.href); // 释放URL 对象
                  //   document.body.removeChild(linkNode);
          //let fileName = res.headers['content-disposition'].match(/fushun(\S*)xls/)[0];
          // var fileDownload = require('js-file-download');
          // fileDownload(res.data,'客户资源' + '.xls');



          //============
           var blob = new Blob([response.data], {type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8'});
                    var downloadElement = document.createElement('a');
                    var href = window.URL.createObjectURL(blob); // 创建下载的链接
                    downloadElement.href = href;
                    downloadElement.download = '客户协议列表'+'.xls'; // 下载后文件名
                    document.body.appendChild(downloadElement);
                    downloadElement.click(); // 点击下载
                    document.body.removeChild(downloadElement); // 下载完成移除元素
                    window.URL.revokeObjectURL(href); // 释放掉blob对象
                 }.bind(this)
                );





            },
            //pageSize改变时触发的函数
            handleSizeChange() {
                this.findByPage();
            },
            //当前页改变时触发的函数
            handleCurrentChange() {
                this.findByPage();
            },
            handleCheckedCitiesChange(value) {
              let checkedCount = value.length;
              this.checkAll = checkedCount === this.cities.length;
              this.isIndeterminate = checkedCount > 0 && checkedCount < this.cities.length;
              this.query.business_scope=this.checkedCities.toString();
            }
        },

    }
</script>
