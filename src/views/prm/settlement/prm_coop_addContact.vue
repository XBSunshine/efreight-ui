<template>
  <el-dialog title="客户联系人 - 新增" width="650px" :visible.sync="visible" :close-on-press-escape="false" :close-on-click-modal="false" :before-close="handleClose" append-to-body>
    <div>
      <el-form :model="contacts.params" :rules="contactsrules" ref="contactsform" :inline='true'>
        <el-row>
            <el-col class="elementWidth">
                <el-form-item prop="coopId">
                  <span id="inputName" v-show="false">{{inputName}}</span>
                </el-form-item>
            </el-col>
            <el-col class="elementWidth">
                <el-form-item label="姓名" prop="contacts_name" required label-width="95px">
                  <el-input v-model="contacts.params.contacts_name" auto-complete="off" style="width: 190px;">
                  </el-input>
                </el-form-item>
            </el-col>
            <el-col class="elementWidth">
                <el-form-item label="电话" prop="phone_number" required label-width="95px">
                  <el-input v-model="contacts.params.phone_number" auto-complete="off" style="width: 190px;">
                  </el-input>
                </el-form-item>&nbsp;&nbsp;
            </el-col>
        </el-row>
        <el-row>
            <el-col class="elementWidth">
            &nbsp;&nbsp;&nbsp; <el-form-item label="邮件" prop="email" required label-width="88px">
                   <el-input v-model="contacts.params.email" auto-complete="off" style="width: 190px;">
                   </el-input>
                </el-form-item>&nbsp;&nbsp;
            </el-col>
            <el-col class="elementWidth">
                <el-form-item label="部门" prop="dept_name" label-width="88px">
                    <el-input v-model="contacts.params.dept_name" auto-complete="off" style="width: 190px;">
                    </el-input>
                </el-form-item>
            </el-col>
        </el-row>
        <el-row>
            <el-col class="elementWidth">
        &nbsp;&nbsp;&nbsp;&nbsp;    <el-form-item label="职务" prop="job_position" label-width="85px">
                    <el-input v-model="contacts.params.job_position" auto-complete="off" style="width: 190px;">
                    </el-input>
                </el-form-item>&nbsp;&nbsp;
            </el-col>
            <el-col class="elementWidth">
                &nbsp;<el-form-item label="固话" prop="tel_number" label-width="85px">
                    <el-input v-model="contacts.params.tel_number" auto-complete="off" style="width: 190px;">
                    </el-input>
                </el-form-item>
            </el-col>
        </el-row>
        <el-row>
          <el-col class="elementWidth">
            <el-form-item style="margin-left: 15px;">
              <el-button size="small" type="primary" @click="saveContacts()">提交</el-button>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </div>
  </el-dialog>
</template>
<script>
    export default {
        props: {
            visible: {
                type: Boolean,
                default: false
            },
            inputName: String
        },
        data() {
            return {
                contacts: {
                    data: [],
                    params: {
                        contacts_name: '',
                        phone_number: '',
                        email: '',
                        dept_name: '',
                        job_position: '',
                        tel_number: '',
                    },
                },
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
                        type: 'email',
                        message: '请输入正确的邮箱地址',
                        trigger: ['blur', 'change']
                    },
                    {
                        min: 1,
                        max: 80,
                        message: '长度不超过 80',
                        trigger: ['blur', 'change']
                    }
                    ],
                    phone_number: [{
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
            };
        },
        inject: ['callback1'],
        methods: {
            saveContacts() {
                this.$refs['contactsform'].validate((valid) => {
                    if(valid) {
                        let params = this.contacts.params;
                        let coopId = document.getElementById("inputName").innerText;
                        params.coop_id=coopId;
                        let url = '/prm/coop/saveCoopContacts1';
                        this.$axios.post(url,
                            params)
                            .then(function(response) {
                                if(response.data.code == 200) {
                                  //  this.openSuccess();
                                    //this.resetFormContacts();
                                    //this.queryContactsList();
                                    let contacts_id = response.data.data;
                                    this.callback1(coopId,contacts_id);
                                    this.handleClose();
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
            handleClose() {
                this.$emit('update:visible', false);
            }
        }
    }
</script>
