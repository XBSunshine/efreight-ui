<template>
	<el-dialog title="系统权限管理 - 新增" width="630px" :visible.sync="visible" :close-on-press-escape="false" :close-on-click-modal="false" :before-close="handleClose">
		<el-form :model="ruleForm" :rules="rules" ref="ruleForm" class="demo-ruleForm">

			<el-row>
				<el-col class="elementWidth">
					<el-form-item label="权限名称" prop="permissionName" required label-width="85px">
						<el-input v-model="ruleForm.permissionName" auto-complete="off">
						</el-input>
					</el-form-item>
				</el-col>
				<el-col class="elementWidth">
					<el-form-item label="权限编码" prop="permissionCode" required label-width="85px">
						<el-input v-model="ruleForm.permissionCode" auto-complete="off">
						</el-input>
					</el-form-item>
				</el-col>
			</el-row>
			<el-row>
				<el-col class="elementWidth">
					<el-form-item label="Path" prop="path" label-width="85px">
						<el-input v-model="ruleForm.path" auto-complete="off">
						</el-input>
					</el-form-item>
				</el-col>
				<el-col class="elementWidth">
					<el-form-item label="URL" prop="url" label-width="85px">
						<el-input v-model="ruleForm.url" auto-complete="off">
						</el-input>
					</el-form-item>
				</el-col>
			</el-row>
			<el-row>
				<el-col class="elementWidth">
					<el-form-item label="permission" prop="permission" label-width="85px">
						<el-input v-model="ruleForm.permission" auto-complete="off">
						</el-input>
					</el-form-item>
				</el-col>
				<el-col class="elementWidth">
					<el-form-item label="图标" prop="icon" label-width="85px">
						<el-input v-model="ruleForm.icon" auto-complete="off">
						</el-input>
					</el-form-item>
				</el-col>
			</el-row>
			<el-row>
				<el-col class="elementWidth">
					<el-form-item label="排序号" prop="sort" label-width="85px">
						<el-input v-model.number="ruleForm.sort" auto-complete="off" style="width:130px">
						</el-input>
					</el-form-item>
				</el-col>
				<el-col class="elementWidth">
					<el-form-item label="状态" prop="status" required label-width="65px">
						<el-select v-model="ruleForm.status" placeholder="请选择" style="width:100px">
							<el-option label="启用" value="1"></el-option>
							<el-option label="禁用" value="0"></el-option>
						</el-select>
					</el-form-item>
				</el-col>
				<el-col class="elementWidth">
					<el-form-item label="权限类型" prop="permissionType" required label-width="95px">
						<el-select v-model="ruleForm.permissionType" placeholder="请选择" style="width:100px">
							<el-option label="模块" value="0"></el-option>
							<el-option label="菜单" value="1"></el-option>
							<el-option label="按钮" value="2"></el-option>
						</el-select>
					</el-form-item>
				</el-col>
			</el-row>
			<el-row>
				<el-col class="elementWidth">
					<el-form-item label="不可分配" prop="disabled" required label-width="85px">
						<el-select v-model="ruleForm.disabled" placeholder="请选择" style="width:70px">
							<el-option label="否" value="false"></el-option>
							<el-option label="是" value="true"></el-option>
						</el-select>
					</el-form-item>
				</el-col>
				<el-col class="elementWidth">
					<el-form-item label="子系统简称" prop="appCode" required label-width="115px">
						<el-select v-model="ruleForm.appCode" placeholder="请选择" style="width:110px">
							<el-option label="HRS" value="HRS"></el-option>
							<el-option label="PRM" value="PRM"></el-option>
							<el-option label="TMS-AF" value="TMS-AF"></el-option>
							<el-option label="TMS-CF" value="TMS-CF"></el-option>
							<el-option label="CSS" value="CSS"></el-option>
							<el-option label="AWRS" value="AWRS"></el-option>
							<el-option label="REPORT" value="REPORT"></el-option>
							<el-option label="SC" value="SC"></el-option>
							<el-option label="TC" value="TC"></el-option>
							<el-option label="LC" value="LC"></el-option>
							<el-option label="VL" value="VL"></el-option>
							<el-option label="IO" value="IO"></el-option>
						</el-select>
					</el-form-item>
				</el-col>
				<el-col class="elementWidth">
					<el-form-item label="默认给管理员" prop="adminDefault" required label-width="125px">
						<el-select v-model="ruleForm.adminDefault" placeholder="请选择" style="width:70px">
							<el-option label="否" value="false"></el-option>
							<el-option label="是" value="true"></el-option>
						</el-select>
					</el-form-item>
				</el-col>
			</el-row>
			<el-row>
				<el-col class="elementWidth">
					<el-form-item label="" label-width="85px">
						<el-upload v-if="ruleForm.helpDocumentUrl==null||ruleForm.helpDocumentUrl==''" :action="actionPath" :accept="accept3" :limit=1 :data="uptoken" :before-upload="beforeAvatarUpload3" :on-remove="handleRemoveChange3" :on-success="handleSuccessChange3" ref="upload3" :auto-upload="true" :show-file-list="true">
							<el-button size="mini" type="primary">上传帮助文档</el-button>
						</el-upload>
						<ul class="el-upload-list el-upload-list&#45;&#45;text" v-if="ruleForm.helpDocumentUrl!=null &&ruleForm.helpDocumentUrl!=''">
							<li class="el-upload-list__item is-success">
								<a class="el-upload-list__item-name">
									<i class="el-icon-document"></i> {{ruleForm.helpDocumentName}}
								</a>
								<label class="el-upload-list__item-status-label">
									<i class="el-icon-upload-success el-icon-circle-check"></i>
								</label>
								<i class="el-icon-close" @click="handleRemoveChange3"></i>
							</li>
						</ul>
					</el-form-item>
				</el-col>
			</el-row>
			<el-row>
				<el-form-item style="margin-left: 15px;">
					<el-button size="small" type="primary" @click="submitForm('ruleForm')">立即创建</el-button>
					<el-button size="small" type="primary" @click="resetForm('ruleForm')">重置</el-button>
				</el-form-item>
			</el-row>
		</el-form>
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
        actionPath:'http://up-z1.qiniu.com',
        accept3: ".doc,.docx,.pdf",
        uptoken: {
          token: '',
          key: ""
        },
        ruleForm: {
          permissionCode: '',
          permissionName: '',
          path: '',
          url: '',
          permission: '',
          icon: '',
          parentId: '',
          parentIds: '',
          sort: '',
          status: '',
          permissionType: '',
          appCode: '',
          disabled:'false',
          adminDefault: 'false',
          helpDocumentName:'',
          helpDocumentUrl:''
        },
        rules: {
          permissionCode: [
            { required: true, message: '请输入权限编码', trigger: ['blur', 'change'] },
            { min: 1, max: 20, message: '长度不超过 20', trigger: ['blur', 'change'] }
          ],
          permissionName: [
            { required: true, message: '请输入权限名称', trigger: ['blur', 'change'] },
            { min: 1, max: 40, message: '长度不超过 40', trigger: ['blur', 'change'] }
          ],
          path: [
            { min: 1, max: 255, message: '长度不超过 255', trigger: ['blur', 'change'] }
          ],
          url: [
            { min: 1, max: 255, message: '长度不超过 255', trigger: ['blur', 'change'] }
          ],
          permission: [
           { min: 1, max: 255, message: '长度不超过 255', trigger: ['blur', 'change'] }
          ],
          sort: [
            { type: 'number', message: '必须为数字值', trigger: ['blur', 'change']}
          ],
          status: [
            { required: true, message: '请选择权限状态', trigger: ['blur', 'change'] }
          ],
          permissionType: [
            { required: true, message: '请选择权限类型', trigger: ['blur', 'change'] }
          ],
          appCode: [
            { required: true, message: '请选择子系统简称', trigger: ['blur', 'change'] }
          ]
        },
        options:[]
      };
    },
    inject:['findByPage'],
    mounted: function () {
      this.$axios.get('/hrs/org/getUpToken')
      .then(function(response) {
          this.uptoken.token=response.data.data;
       }.bind(this)
      );
    },
    methods: {
      beforeAvatarUpload3(file) {
        this.uptoken.key = this.buildUploadFileKey(file);
        const isLt10M = file.size < 10 * 1024 * 1024;
        if (!isLt10M) {
          this.$message.error('上传模板大小不能超过 10MB!');
        }
        if (isLt10M) {
          this.ruleForm.helpDocumentUrl="http://doc.yctop.com/"+this.uptoken.key
        }
        return isLt10M;
      },
      handleRemoveChange3(file, fileList){
        var filelists = [];
        this.ruleForm.helpDocumentName='';
        this.ruleForm.helpDocumentUrl='';
        // this.formData3.smallModelPhoto = filelists;
      },
      handleSuccessChange3(response, file, fileList) { //上传成功后在图片框显示图片
        this.ruleForm.helpDocumentUrl="http://doc.yctop.com/"+response.key;
        this.ruleForm.helpDocumentName=file.name;
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
        this.ruleForm.parentId=this.frow.id;
        if (this.frow.parentId==-1) {
          this.ruleForm.parentIds=this.frow.id;
        }else{
          this.ruleForm.parentIds=this.frow.id+","+this.frow.parentId;
        }
        this.$refs[formName].validate((valid) => {
          if (valid) {
            let params=this.ruleForm;
            this.$axios.post2('/hrs/permission/save', params)
              .then(function(response) {
                if(response.data.code==0){
                  this.openSuccess();
                  this.findByPage();
                  this.handleClose();
                }else{
                  this.openError(response.data.messageInfo);
                }

             }.bind(this)
            );
          } else {
            console.log('error submit!!');
            return false;
          }
        });
      },
      resetForm(formName) {
        this.checkedCities = [];
        this.$refs[formName].resetFields();
      },
      // 关闭
      handleClose() {
        //this.frow=null;
        this.$emit('update:visible', false);
      },
      buildUploadFileKey(file) {
        return 'public/help/help_document_' + new Date().format("yyMMddhhmmss") + "_" + file.name;
      }
    },
    created(){

    }
  }
</script>
<style type="text/css">
</style>
