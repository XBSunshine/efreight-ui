<template>
  <el-dialog title="客商资料 - 增加" width="1000px" :visible.sync="visible" :close-on-press-escape="false" :close-on-click-modal="false" :before-close="handleClose" append-to-body>

        <el-row>
          <el-form :model="contacts.params" :rules="contactsrules" ref="contactsform" class="orderListPage">
            <el-row>
              <el-col class="elementWidth">
                <el-form-item label-width="10px" prop="contacts_type">
                  <el-input class="" style="width:180px;margin-right: 15px;">
                    <template slot="prepend">
                      <font style="color: red;">*</font>
                      <span>类型</span>
                    </template>
                    <el-select slot="suffix" v-model="contacts.params.contacts_type" placeholder="请选择" style="width:130px;margin-right: -5px;" clearable>
                      
                      <el-option label="订舱" value="订舱"></el-option>
                      
                    </el-select>
                  </el-input>
                </el-form-item>
              </el-col>
              <el-col class="elementWidth">
                <el-form-item prop="contacts_name" label-width="6px">
                  <el-input v-model="contacts.params.contacts_name" style="width:180px;margin-right: 15px;" auto-complete="off">
                    <template slot="prepend">
                      <font style="color: red;">*</font>
                      <span>姓名</span>
                    </template>
                  </el-input>
                </el-form-item>
              </el-col>
              <el-col class="elementWidth">
                <el-form-item prop="email" label-width="6px">
                  <el-input v-model="contacts.params.email" style="width:410px;margin-right: 15px;" auto-complete="off">
                    <template slot="prepend">
                      <font style="color: red;">*</font>
                      <span>邮箱</span>
                    </template>
                  </el-input>
                </el-form-item>
              </el-col>
              <el-col class="elementWidth">
                <el-form-item style="margin-left: 50px;">
                  <el-button size="small" type="primary" @click="saveContacts()" :disabled="disabledFlag2">提交</el-button>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col class="elementWidth">
                <el-form-item prop="dept_name" label-width="10px">
                  <el-input class="widthThree" v-model="contacts.params.dept_name" style="width:180px;margin-right: 15px;" auto-complete="off">
                    <template slot="prepend">
                      <span>部门</span>
                    </template>
                  </el-input>
                </el-form-item>
              </el-col>
              <el-col class="elementWidth">
                <el-form-item prop="job_position" label-width="6px">
                  <el-input class="widthThree" v-model="contacts.params.job_position" style="width:180px;margin-right: 15px;" auto-complete="off">
                    <template slot="prepend">
                      <span>职务</span>
                    </template>
                  </el-input>
                </el-form-item>
              </el-col>
              <el-col class="elementWidth">
                <el-form-item prop="phone_number" label-width="6px">
                  <el-input class="widthThree" v-model="contacts.params.phone_number" style="width:180px;margin-right: 15px;" auto-complete="off">
                    <template slot="prepend">
                      <span>电话</span>
                    </template>
                  </el-input>
                </el-form-item>
              </el-col>
              <el-col class="elementWidth">
                <el-form-item label-width="10px" prop="contacts_status">
                  <el-input class="" style="width:206px;margin-right: 6px;">
                    <template slot="prepend">
                      <font style="color: red;">*</font>
                      <span>生效状态</span>
                    </template>
                    <el-select slot="suffix" v-model="contacts.params.contacts_status" placeholder="请选择" style="width:128px;margin-right: -5px;" clearable>
                      <el-option label="生效" value="1"></el-option>
                      <el-option label="失效" value="0"></el-option>
                    </el-select>
                  </el-input>
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
        </el-row>
        <el-row>
          <el-table ref="multipleTable" :data="contacts.data" style="width: 100%"  row-key="contacts_id" border max-height="500px">
            <el-table-column align="center" prop="contacts_type" label="类型" width="60"></el-table-column>
            <el-table-column align="center" prop="contacts_name" label="姓名" width="150"></el-table-column>
            <el-table-column align="center" prop="email" label="邮箱" ></el-table-column>
            <el-table-column align="center" prop="dept_name" label="部门" width="150"></el-table-column>
            <el-table-column align="center" prop="job_position" label="职务" width="150"></el-table-column>
            <el-table-column align="center" prop="phone_number" label="电话" width="150"></el-table-column>
            <el-table-column align="center" label="生效状态"  width="80px">
              <template slot-scope="scope">
                <i class="iconfont el-icon-myduihao" style="color: red;" v-show="scope.row.contacts_status"></i>
              </template>
            </el-table-column>
            <!-- <el-table-column fixed="left" label="操作" width="60" align="center">
              <template slot-scope="scope">
                 <el-dropdown trigger="click" @command="handleContactsCommand" @visible-change="handleContactsChange(scope.row)">
                     <i class="el-icon-s-operation"></i>
                     <el-dropdown-menu slot="dropdown">
                      <el-dropdown-item command="selectContacts" >选择</el-dropdown-item>
                   <el-dropdown-item command="editContacts" v-if="editContactsFlag">修改</el-dropdown-item>
                   <el-dropdown-item command="deleteContacts" v-if="deleteContactsFlag">删除</el-dropdown-item>
               </el-dropdown-menu>
                 </el-dropdown>
              </template>
            </el-table-column> -->
          </el-table>

          <div class="pagination">
            <el-pagination background @size-change="contactshandleSizeChange" @current-change="contactshandleCurrentChange" :current-page.sync="contacts.pageConf.pageCode" :page-sizes="contacts.pageConf.pageOption" :page-size.sync="contacts.pageConf.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="contacts.pageConf.totalPage">
            </el-pagination>
          </div>
        </el-row>
      
        <el-row>
        <el-form-item>
          <el-button size="small" type="primary" @click="handleClose" >返回</el-button>
        </el-form-item>
      </el-row>
  </el-dialog>
</template>
<script>
  export default {
    props: {
      visible: {
        type: Boolean,
        default: false
      },
      frow: Object
    },
    data() {
      return {
          useroptions: [],
          coopTypeOptions:[],
        coop_id: '',
        //contacts--------
        contacts: {
          data: [],
          params: {
            contacts_id: '',
            coop_id: '',
            contacts_type: '订舱',
            contacts_name: '',
            phone_number: '',
            email: '',
            dept_name: '',
            job_position: '',
            tel_number: '',
            contacts_status: '1'
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
        disabledFlag2: false,
        contactsrules: {
          contacts_type: [{
            required: true,
            message: '请选择职责类型',
            trigger: ['blur', 'change']
          }],
          contacts_name: [{
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
              max: 100,
              message: '长度不超过 100',
              trigger: ['blur', 'change']
            }
            /*{
              type: 'email',
              message: '请输入正确的邮箱地址',
              trigger: ['blur', 'change']
            },
            {
              min: 1,
              max: 80,
              message: '长度不超过 80',
              trigger: ['blur', 'change']
            }*/
          ],
          phone_number: [/*{
              required: true,
              message: '请输入联系人电话',
              trigger: ['blur', 'change']
            },*/
            {
              min: 1,
              max: 20,
              message: '长度不超过 20',
              trigger: ['blur', 'change']
            }
          ],
          contacts_status: [{
            required: true,
            message: '请选择生效状态',
            trigger: ['blur', 'change']
          }],
          dept_name: [{
            min: 0,
            max: 40,
            message: '长度不超过 40',
            trigger: ['blur', 'change']
          }],
          job_position: [{
            min: 0,
            max: 40,
            message: '长度不超过 40',
            trigger: ['blur', 'change']
          }],
          tel_number: [{
            min: 0,
            max: 40,
            message: '长度不超过 40',
            trigger: ['blur', 'change']
          }]
        },
        
        useroptions: [],
        deptoptions: [],
        activeName: 'third'
      };
    },
    inject: ['setValue2','queryContactsList2'],
    created: function() {
      this.coop_id = this.frow.coop_id;
    let buttonInfo = window.localStorage.getItem('buttonInfo');
     
      if (buttonInfo.indexOf('sys_coop_contact_edit')>-1) {
            this.editContactsFlag=true;
          }
          if (buttonInfo.indexOf('sys_coop_contact_delete')>-1) {
            this.deleteContactsFlag=true;
          }
      
      //contacts
      this.queryContactsList();
      
     
    },
    methods: {

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
     
      // 关闭
      handleClose() {
        this.queryContactsList2(this.coop_id);
        this.$emit('update:visible', false);
      },

      

      //联系人相关
      queryContactsList() {
        let params = {
          currentPage: this.contacts.pageConf.pageCode,
          pageSize: this.contacts.pageConf.pageSize,
          coop_id: this.coop_id,
          contacts_type:'订舱'
        }
        this.$axios.post('/prm/coop/queryCoopContactsList',
            params)
          .then(function(response) {
            let code = response.data.code;
            this.contacts.data = response.data.data.dataList;
            this.contacts.pageConf.totalPage = response.data.data.totalNum;

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
        this.$refs['contactsform'].validate((valid) => {
          if(valid) {
            let params = this.contacts.params;
            let contacts_id = params.contacts_id;
            let url = '';
            let matchEmail = /^[a-zA-Z#0-9_.-]+@[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)*\.[a-zA-Z0-9]{2,6}$/;
            if(contacts_id == ''){
                let email = params.email.replace(/\s*/g,"").replace(/,/g,';');//去掉空格，把逗号换为分号
                let emails = email.split(";");
                for(let i=0;i<emails.length;i++){
                    if(emails[i]){
                        if(!matchEmail.test(emails[i])) {
                            this.openError("请输入正确的邮箱地址");
                            return;
                        }
                    }
                }
                url = '/prm/coop/saveCoopContacts';
             }else{
                if(!matchEmail.test(params.email)) {
                    this.openError("请输入正确的邮箱地址");
                    return;
                }
                url = '/prm/coop/modifyCoopContacts'
             };
            this.disabledFlag2 = true;
            params.coop_id = this.coop_id;
            this.$axios.post(url,
                params)
              .then(function(response) {
                if(response.data.code == 200) {
                  this.openSuccess();
                  this.resetFormContacts();
                  this.queryContactsList();
                  this.disabledFlag2 = false;
                } else {
                  this.openError(response.data.messageInfo);
                    this.disabledFlag2 = false;
                }

              }.bind(this));
          } else {
            console.log('error submit!!');
            return false;
          }
        });
      },
      deleteContacts(row){
            this.$confirm('是否 确认 删除？', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
          center: true
        }).then(() => {
          this.$axios.put('/prm/coop/deleteContacts/' + row.contacts_id)
            .then(function(response) {
               if(response.data.code == 200) {
                this.openSuccess();
                this.queryContactsList();
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
      showeditContacts(row) {
        // let coop_code = row.coop_code;
        this.contacts.params.contacts_id = row.contacts_id;
        this.contacts.params.coop_id = row.coop_id;
        this.contacts.params.contacts_type = row.contacts_type;
        this.contacts.params.contacts_name = row.contacts_name;
        this.contacts.params.phone_number = row.phone_number;
        this.contacts.params.email = row.email;
        this.contacts.params.dept_name = row.dept_name;
        this.contacts.params.job_position = row.job_position;
        this.contacts.params.tel_number = row.tel_number;
        this.contacts.params.contacts_status = row.contacts_status + '';
      },
      resetFormContacts() {
          let temp = this.contacts.params.contacts_status;
        this.$refs['contactsform'].resetFields();
        if(this.contacts.params.contacts_id == ''){
            this.contacts.params.contacts_status = temp;
        }
        this.contacts.params.contacts_id = '';
        this.contacts.params.coop_id = '';
      },
      format_contacts_status(row, column) {
        return row.contacts_status == '1' ? "生效" : row.contacts_status == '0' ? "失效" : "";
      },
      handleClick(tab, event) {
        console.log(tab, event);
      },
      handleContactsCommand(command) {
                 if(command == 'editContacts') {
          this.showeditContacts(this.currRow)
        } else if(command == 'deleteContacts') {
          this.deleteContacts(this.currRow)
        } else if(command == 'selectContacts') {
          this.doSelect(this.currRow)
        }
    },
    doSelect(rrow) {
        this.setValue2(rrow.contacts_id);
        this.handleClose();
      },
    handleContactsChange(command) {
        this.currRow = command
      }
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

  .orderListPage .widthWithThree .el-input-group__prepend {
    padding: 0 13px !important;
  }

  .orderListPage .widthThree .el-input-group__prepend {
    padding: 0 11px;
  }

  .orderListPage .widthThree2 .el-input-group__prepend {
    padding: 0 38px;
  }

  .orderListPage .widthThree1 .el-input-group__prepend {
    padding: 0 18px;
  }

  .orderListPage .widthTwo .el-input-group__prepend {
    padding: 0 25px;
  }

  .orderListPage .widthFour .el-input-group__prepend {
    padding: 0 11px;
  }

  .orderListPage .widthSix .el-input-group__prepend {
    padding: 0 11px !important;
  }
</style>
