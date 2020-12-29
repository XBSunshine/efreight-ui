<template>
  <el-dialog title="客户项目——修改" width="75%" :visible.sync="visible" :close-on-press-escape="false" :close-on-click-modal="false" :before-close="handleClose">
    <el-tabs v-model="activeName" @tab-click="handleClick">
      <el-tab-pane label="客户项目修改" name="first">
        <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="120px" class="demo-ruleForm">
      <el-row>
        <el-col :span="8">
          <el-form-item label="业务范畴" prop="businessScope" required>
            <el-select v-model="ruleForm.businessScope" filterable placeholder="请选择" disabled>
              <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="11">
          <el-form-item label="公司" prop="coopName" required>
              <el-input v-model="ruleForm.coopName" auto-complete="off"  disabled>
              </el-input>
              <!-- <el-button type="primary" @click="gotoSelectPage('ruleForm')" >查询</el-button> -->
          </el-form-item>

        </el-col>
      </el-row>
      <el-row>
        <el-col :span="8">
          <el-form-item label="助记码" prop="projectCode" required>
              <el-input v-model="ruleForm.projectCode" auto-complete="off" maxlength="30" style="width:217px">
              </el-input>
          </el-form-item>
        </el-col>
        <el-col :span="11">
          <el-form-item label="项目名称" prop="projectName" required>
              <el-input v-model="ruleForm.projectName" auto-complete="off" maxlength="100" disabled>
              </el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="8">
          <el-form-item label="海外项目" prop="isOverseas" required>
              <el-select v-model="ruleForm.isOverseas"  placeholder="请选择" disabled>
                <el-option label="是" :value="1"></el-option>
                <el-option label="否" :value="0"></el-option>               
              </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="公司项目" prop="isHeadquarters" required>
              <el-select v-model="ruleForm.isHeadquarters"  placeholder="请选择" disabled>
                <el-option label="是" :value="1"></el-option>
                <el-option label="否" :value="0"></el-option>               
              </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="服务产品" prop="businessProduct" required>
            <el-select v-model="ruleForm.businessProduct" filterable placeholder="请选择" disabled>
              <el-option
                v-for="item in productOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row>
        <el-col :span="8">
          <el-form-item label="运输条款" prop="transitClause" required>
            <el-select v-model="ruleForm.transitClause" filterable placeholder="请选择" disabled>
              <el-option
                v-for="item in transitClauseOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="付款方式" prop="paymentMethod" required>
            <el-select v-model="ruleForm.paymentMethod" filterable placeholder="请选择" disabled>
              <el-option
                v-for="item in paymentMethodOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="业务性质" prop="businessType" required>
            <el-select v-model="ruleForm.businessType" filterable placeholder="请选择" disabled>
              <el-option
                v-for="item in businessTypeOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="8">
          <el-form-item label="销项税率" prop="vatOutput">
              <el-input v-model="ruleForm.vatOutput" auto-complete="off" @input="formatToFloat('vatOutput')" style="width:217px">
              </el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="开票类型" prop="invoiceType" required>
            <el-select v-model="ruleForm.invoiceType" filterable placeholder="请选择">
              <el-option
                v-for="item in invoiceTypeOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="结算币种" prop="currencyCode" required>
            <el-select v-model="ruleForm.currencyCode" filterable placeholder="请选择">
              <el-option
                v-for="item in currencyCodeOptions"
                :key="item.currency_code"
                :label="item.currency_code"
                :value="item.currency_code">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="8">
          <el-form-item label="责任销售" prop="salesId" required>
            <el-select v-model="ruleForm.salesId" filterable placeholder="请选择" @change="setSalesName">
              <el-option
                v-for="item in useroptions"
                :key="item.value"
                :label="item.label"
                :value="item.value">
                <span style="float: left">{{ item.label }}</span>
                <span style="float: right; color: #8492a6; font-size: 13px">{{ item.label2 }}</span>
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="责任客服" prop="servicerId" required>
            <el-select v-model="ruleForm.servicerId" filterable placeholder="请选择" @change="setServicerName">
              <el-option
                v-for="item in useroptions"
                :key="item.value"
                :label="item.label"
                :value="item.value">
                <span style="float: left">{{ item.label }}</span>
                <span style="float: right; color: #8492a6; font-size: 13px">{{ item.label2 }}</span>
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="销售经理" prop="salesManagerId" required >
              <el-select v-model="ruleForm.salesManagerId" filterable placeholder="请选择" @change="setManagerName">
              <el-option
                v-for="item in useroptions"
                :key="item.value"
                :label="item.label"
                :value="item.value">
                <span style="float: left">{{ item.label }}</span>
                <span style="float: right; color: #8492a6; font-size: 13px">{{ item.label2 }}</span>
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="22">
          <el-form-item label="提供货要求" prop="warehouseNote" >
              <el-input v-model="ruleForm.warehouseNote" auto-complete="off" maxlength="200" show-word-limit>
              </el-input>
          </el-form-item>
        </el-col>   
      </el-row>
      <el-row>
        <el-col :span="22">
          <el-form-item label="制单要求" prop="awbNote" >
              <el-input type="textarea" v-model="ruleForm.awbNote" auto-complete="off" maxlength="500" show-word-limit>
              </el-input>
          </el-form-item>
        </el-col>   
      </el-row>
      <el-row>
        <el-form-item>
          <el-button type="primary" @click="submitForm('ruleForm')">修改</el-button>
        </el-form-item>
      </el-row>
        </el-form>
      </el-tab-pane>
      
      <el-tab-pane label="联系人" name="third">
        <el-row>
          <el-form :model="contacts.params" :rules="contactsrules" ref="contactsform" label-width="80px" class="demo-ruleForm">
            <el-row>
              <el-col :span="5">
                <el-form-item label="类型" prop="contactsType" required>
                  <el-select v-model="contacts.params.contactsType">
                    <el-option label="老板" value="老板"></el-option>
                    <el-option label="订舱" value="订舱"></el-option>
                    <el-option label="操作" value="操作"></el-option>
                    <el-option label="对账" value="对账"></el-option>
                    <el-option label="财务" value="财务"></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="5">
                <el-form-item label="姓名" prop="contactsName" required>
                  <el-input v-model="contacts.params.contactsName" auto-complete="off">
                  </el-input>
                </el-form-item>
              </el-col>
              <el-col :span="5">
                <el-form-item label="电话" prop="phoneNumber" required>
                  <el-input v-model="contacts.params.phoneNumber" auto-complete="off">
                  </el-input>
                </el-form-item>
              </el-col>
              <el-col :span="5">
                <el-form-item label="邮件" prop="email" required>
                  <el-input v-model="contacts.params.email" auto-complete="off">
                  </el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="5">
                <el-form-item label="部门" prop="deptName">
                  <el-input v-model="contacts.params.deptName" auto-complete="off">
                  </el-input>
                </el-form-item>
              </el-col>
              <el-col :span="5">
                <el-form-item label="职务" prop="jobPosition">
                  <el-input v-model="contacts.params.jobPosition" auto-complete="off">
                  </el-input>
                </el-form-item>
              </el-col>
              <el-col :span="5">
                <el-form-item label="固话" prop="telNumber">
                  <el-input v-model="contacts.params.telNumber" auto-complete="off">
                  </el-input>
                </el-form-item>
              </el-col>

              <el-col :span="5">
                <el-form-item>
                  <el-button type="primary" @click="saveContacts()">提交</el-button>
                  <el-button type="primary" @click="selectContacts()">选择联系人</el-button>
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
        </el-row>
        <el-row>
          <el-table ref="multipleTable" :data="contacts.data" height="400" style="width: 100%" >
            <el-table-column prop="contactsName" label="姓名" width="120"></el-table-column>
            <el-table-column prop="phoneNumber" label="电话" width="120"></el-table-column>
            <el-table-column prop="email" label="邮件" width="120"></el-table-column>
            <el-table-column prop="deptName" label="部门" ></el-table-column>
            <el-table-column prop="jobPosition" label="职务" width="120"></el-table-column>
            <el-table-column prop="telNumber" label="固话" width="120"></el-table-column>
            <el-table-column prop="contactsType" label="类型" ></el-table-column>
  
            <el-table-column fixed="right" label="操作" width="100">
              <template slot-scope="scope">
                <el-button @click="showeditContacts(scope.row)" type="text" size="small">修改</el-button>
              </template>
            </el-table-column>

          </el-table>

          <el-col :span="24" class="pagination">
            <el-pagination background @size-change="contactshandleSizeChange" @current-change="contactshandleCurrentChange" :current-page.sync="contacts.pageConf.pageCode" :page-sizes="contacts.pageConf.pageOption" :page-size.sync="contacts.pageConf.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="contacts.pageConf.totalPage">
            </el-pagination>
          </el-col>
        </el-row>
      </el-tab-pane>

    </el-tabs>
    <save ref="addMission" v-if="save" :visible.sync="save" ></save>
    <save2 ref="addMission" v-if="save2" :visible.sync="save2" :frow="ffrow"></save2>
  </el-dialog>
</template>
<script>
import save from './af_coopProject_select'
import save2 from './af_coopProject_selectUser'
  export default {
    props: {
      visible: {
        type: Boolean,
        default: false
      },
      frow: Object
    },
    data() {
      var checkNumber2 = (rule, value, callback) => { 
        let regE =/^[1-9]\d{0,7}$/;
        if (!value) {
          callback();
        }
        if (regE.test(value) ) {
          callback();
        }else {
          callback(new Error('整数最大8位'));
        }
      };
      return {
        save: false,
        save2: false,
        ffrow:{
          coopId:''
        },
        options:[],
        useroptions:[],
        productOptions:[],
        transitClauseOptions:[],
        paymentMethodOptions:[],
        businessTypeOptions:[],
        invoiceTypeOptions:[],
        currencyCodeOptions:[],
        ruleForm: {
          isStop:'',
          isLock:'',
          projectId:'',
          businessScope: '',
          coopId:'',
          coopName:'',
          isOverseas:0,
          isHeadquarters:0,
          projectCode:'',
          projectName:'',
          businessProduct:'',
          transitClause:'',
          paymentMethod:'',
          businessType:'',
          vatOutput:'',
          invoiceType:'',
          currencyCode:'',
          salesName:'',
          salesId:'',
          servicerName:'',
          servicerId:'',
          salesManagerName:'',
          salesManagerId:'',
          warehouseNote:'',
          awbNote:''
        },
        rules: {
          businessScope: [
            { required: true, message: '请选择业务范畴', trigger: ['blur', 'change']  }
          ],
          isOverseas: [
            { required: true, message: '请选择海外项目', trigger: ['blur', 'change']  }
          ],
          isHeadquarters: [
            { required: true, message: '请选择公司项目', trigger: ['blur', 'change']  }
          ],
          projectCode: [
            { required: true, message: '请输入助记码', trigger: ['blur', 'change']  }
          ],
          projectName: [
            { required: true, message: '请输入项目名称', trigger: ['blur', 'change']  }
          ],
          businessProduct: [
            { required: true, message: '请选择服务产品', trigger: ['blur', 'change']  }
          ],
          transitClause: [
            { required: true, message: '请选择运输条款', trigger: ['blur', 'change']  }
          ],
          paymentMethod: [
            { required: true, message: '请选择付款方式', trigger: ['blur', 'change']  }
          ],
          businessType: [
            { required: true, message: '请选择业务性质', trigger: ['blur', 'change']  }
          ],
          invoiceType: [
            { required: true, message: '请选择开票类型', trigger: ['blur', 'change']  }
          ],
          currencyCode: [
            { required: true, message: '请选择结算币种', trigger: ['blur', 'change']  }
          ],
          vatOutput:[
            { validator: checkNumber2, trigger: ['blur', 'change'] }
          ],
          salesId: [
            { required: true, message: '请选择责任销售', trigger: ['blur', 'change']  }
          ],
          servicerId: [
            { required: true, message: '请选择责任客服', trigger: ['blur', 'change']  }
          ],
          salesManagerId: [
            { required: true, message: '请选择销售经理', trigger: ['blur', 'change']  }
          ]
        },

        projectId: '',

        //contacts---开始-----
        contacts: {
          data: [],
          params: {
            contactsId: '',
            orgId:'',
            projectId: '',
            contactsType: '',
            contactsName: '',
            phoneNumber: '',
            email: '',
            deptName: '',
            jobPosition: '',
            telNumber: ''
          },

          pageConf: {
            //设置一些初始值(会被覆盖)
            pageCode: 1, //当前页
            pageSize: 6, //每页显示的记录数
            totalPage: 12, //总记录数
            pageOption: [4, 6, 10], //分页选项
            handleCurrentChange: function() {
              console.log("页码改变了");
            }
          }
        },
        contactsrules: {
          contactsType: [{
            required: true,
            message: '请选择职责类型',
            trigger: ['blur', 'change']
          }],
          contactsName: [{
              required: true,
              message: '请输入联系人名称',
              trigger: ['blur', 'change']
            },
            {
              min: 1,
              max: 40,
              message: '长度不超过 40',
              trigger: ['blur', 'change']
            }
          ],
          email: [{
              required: true,
              message: '请输入联系人邮箱',
              trigger: ['blur', 'change']
            },
            {
              min: 1,
              max: 80,
              message: '长度不超过 80',
              trigger: ['blur', 'change']
            }
          ],
          phoneNumber: [{
              required: true,
              message: '请输入联系人电话',
              trigger: ['blur', 'change']
            },
            {
              min: 1,
              max: 20,
              message: '长度不超过 20',
              trigger: ['blur', 'change']
            }
          ],
          deptName: [{
            min: 0,
            max: 40,
            message: '长度不超过 40',
            trigger: ['blur', 'change']
          }],
          jobPosition: [{
            min: 0,
            max: 40,
            message: '长度不超过 40',
            trigger: ['blur', 'change']
          }],
          telNumber: [{
            min: 0,
            max: 40,
            message: '长度不超过 40',
            trigger: ['blur', 'change']
          }]
        },
        //contacts---结束-----

        activeName: 'first'
      };
    },
    components: {
      'save': save,
      'save2':save2
    },
    inject:['queryList'],
    provide() {
      return {
        setValue: this.setValue,
        setUserValue:this.setUserValue
      }
    },
    created: function() {
      this.$axios.get('/hrs/dept/selectUser').then(function(response) {
          this.useroptions=response.data.data;
       }.bind(this)
      );
      this.$axios.get('/afbase/awb/selectCategory?category=业务范畴').then(function(response) {
          this.options=response.data.data;
       }.bind(this)
      );
      this.$axios.get('/afbase/awb/selectCategory?category=出口产品').then(function(response) {
          this.productOptions=response.data.data;
       }.bind(this)
      );
      this.$axios.get('/afbase/awb/selectCategory?category=运输条款').then(function(response) {
          this.transitClauseOptions=response.data.data;
       }.bind(this)
      );
      this.$axios.get('/afbase/awb/selectCategory?category=付款方式').then(function(response) {
          this.paymentMethodOptions=response.data.data;
       }.bind(this)
      );
      this.$axios.get('/afbase/awb/selectCategory?category=业务性质').then(function(response) {
          this.businessTypeOptions=response.data.data;
       }.bind(this)
      );
      this.$axios.get('/afbase/awb/selectCategory?category=发票类型').then(function(response) {
          this.invoiceTypeOptions=response.data.data;
       }.bind(this)
      );
      this.$axios.get('/afbase/coopProject/selectCurrency').then(function(response) {
          this.currencyCodeOptions=response.data.data;
       }.bind(this)
      );
      //
      this.projectId=this.frow.projectId;
      this.ruleForm.projectId = this.frow.projectId;
        this.$axios.get('/afbase/coopProject/view/' + this.ruleForm.projectId)
          .then(function(response) {
            this.ruleForm = response.data.data;
          }.bind(this));
      //contacts
      this.queryContactsList();
     
    },
    methods: {
      setManagerName(vId){
        let obj = {};
        obj = this.useroptions.find((item)=>{
            return item.value === vId;
        });
        this.ruleForm.salesManagerName=obj.label;
      },
      setServicerName(vId){
        let obj = {};
        obj = this.useroptions.find((item)=>{
            return item.value === vId;
        });
        this.ruleForm.servicerName=obj.label;
      },
      setSalesName(vId){
        let obj = {};
        obj = this.useroptions.find((item)=>{
            return item.value === vId;
        });
        this.ruleForm.salesName=obj.label;
      },
      gotoSelectPage() {
        this.save = true;
      },
      selectContacts() {
        this.ffrow.coopId = this.ruleForm.coopId;
        this.save2 = true;
      },
      setValue(rrow) {
        this.ruleForm.coopId=rrow.coopIdV;
        this.ruleForm.coopName=rrow.coopNameV;
        if(rrow.coopTypeV=='海外代理'){
          this.ruleForm.isOverseas=1;
        }else{
          this.ruleForm.isOverseas=0;
        }
      },
      setUserValue(rrow) {
        this.contacts.params.contactsType = rrow.contacts_type;
        this.contacts.params.contactsName = rrow.contacts_name;
        this.contacts.params.phoneNumber = rrow.phone_number;
        this.contacts.params.email = rrow.email;
        this.contacts.params.deptName = rrow.dept_name;
        this.contacts.params.jobPosition = rrow.job_position;
        this.contacts.params.telNumber = rrow.tel_number;
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
          message: '操作失败，'+info,
          type: 'error',
          position: 'bottom-right'
        });
      },
      submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) { 
            this.$axios.post2('/afbase/coopProject/doUpdate', this.ruleForm)
              .then(function(response) {
                
                if(response.data.code==0){
                  
                  this.openSuccess();
                  this.queryList();
                  this.handleClose();                 
                }else{
                  this.openError(response.data.messageInfo);
                }
                
             }.bind(this)
            ).catch(function (error) {
              let errorinfo = error.response.data.messageInfo;
                  //唯一性错误
                  if(errorinfo.indexOf('IDU_coop_project_name')>-1){
                    this.openError('项目名称不可重复');
                  }else{
                    this.openError(errorinfo);
                  }
            }.bind(this));
          } else {
            console.log('error submit!!');
            return false;
          }
        });
      },
      formatToFloat(item) {
        if(item == 'vatOutput') {
          this.ruleForm.vatOutput = this.ruleForm.vatOutput.replace(/[^123456789.]/g, "");
          var t = this.ruleForm.vatOutput.split('.');
          if(t.length > 1) {
            this.ruleForm.vatOutput = t[0];
          }
        } 
      },
      // 关闭
      handleClose() {
        this.$emit('update:visible', false);
      },
      handleClick(tab, event) {
        console.log(tab, event);
      },
      //联系人相关开始
      queryContactsList() {
       
         let param = "size="+this.contacts.pageConf.pageSize+"&current="+this.contacts.pageConf.pageCode+"&projectId="+this.projectId
        this.$axios.get('/afbase/coopProjectContacts/page?'+param).then(function(response) {
            let code = response.data.code;
            this.contacts.data = response.data.data.records;
            this.contacts.pageConf.totalPage = response.data.data.total;

          }.bind(this));
      },
      //pageSize改变时触发的函数
      contactshandleSizeChange() {
        this.queryContactsList();
      },
      //当前页改变时触发的函数
      contactshandleCurrentChange() {
        this.queryContactsList();
      },
      saveContacts() {
        // formName = this.contactsform;
        this.$refs['contactsform'].validate((valid) => {
          if(valid) {
            let params = this.contacts.params;
            let contactsId = params.contactsId;
            let url = '';
            if(contactsId == '')
              url = '/afbase/coopProjectContacts/doSave';
            else
              url = '/afbase/coopProjectContacts/doUpdate'
            params.projectId = this.projectId;
            this.$axios.post2(url,
                params)
              .then(function(response) {
                if(response.data.code == 0) {
                  this.openSuccess();
                  this.resetFormContacts();
                  this.queryContactsList();
                } else {
                  this.openError(response.data.messageInfo);
                }

              }.bind(this));
          } else {
            console.log('error submit!!');
            return false;
          }
        });
      },
      showeditContacts(row) {
        // let coop_code = row.coop_code;
        this.contacts.params.contactsId = row.contactsId;
        this.contacts.params.orgId = row.orgId;
        this.contacts.params.projectId = row.projectId;
        this.contacts.params.contactsType = row.contactsType;
        this.contacts.params.contactsName = row.contactsName;
        this.contacts.params.phoneNumber = row.phoneNumber;
        this.contacts.params.email = row.email;
        this.contacts.params.deptName = row.deptName;
        this.contacts.params.jobPosition = row.jobPosition;
        this.contacts.params.telNumber = row.telNumber;

      },
      resetFormContacts() {
        this.$refs['contactsform'].resetFields();
        this.contacts.params.contactsId = '';
        this.contacts.params.projectId = '';
      },
      format_contacts_status(row, column) {
        return row.contacts_status == '1' ? "生效" : row.contacts_status == '0' ? "失效" : "";
      },
      //联系人相关结束
    }
  }
</script>
<style type="text/css">

</style>