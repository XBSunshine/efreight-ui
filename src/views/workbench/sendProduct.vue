<template>
	<div class="send_product" >
		<el-row v-loading="loading" element-loading-text="拼命加载中"  :visible.sync="visible">
			<el-col class="toolbar" style="padding-bottom: 0;">
				<el-form :inline="false" :model="query" :rules="rules" ref="query" class="demo-ruleForm">
					<!-- <div> -->
						<el-row>
							<el-col class="elementWidth">
								<el-form-item  prop="companyName" label-width="40px">
									<el-input v-model="query.companyName" auto-complete="off" disabled style="width:600px;" >
                    <template slot="prepend">发布公司</template>
									</el-input>
								</el-form-item>
							</el-col>
							<el-col class="elementWidth">
                <el-form-item  prop="userName" label-width="40px">
                	<el-input v-model="query.userName" auto-complete="off" disabled style="width:300px;" >
                    <template slot="prepend">发布人员</template>
                	</el-input>
                </el-form-item>
							</el-col>
						</el-row>
            <el-row>
            	<el-col class="elementWidth">
                <el-form-item  prop="productName"  label-width="40px">
                	<el-input v-model="query.productName" clearable style="width:940px;" maxlength="200" show-word-limit>
                    <template slot="prepend"  >产品名称</template>
                	</el-input>
                </el-form-item>
            	</el-col>
            </el-row>

            <el-row>
              <el-col class="elementWidth">
                <el-form-item label="" label-width="40px">
                  <el-upload class="el-form-item__content_send_product" :action="actionPath" :accept="accept"
                             :headers="headers" :data="upData" :before-upload="beforeAvatarUpload"
                             :on-remove="handleRemoveChange" :on-success="handleSuccessChange" :auto-upload="true"
                             :show-file-list="false">
                    <!-- <span></span> -->
                    <el-input v-model="query.fileName"
                              placeholder="支持格式 PDF/DOC/DOCX/XLS/XLSX/RAR/ZIP/JPG/JPEG/BMP/PNG  最大 10M"
                              auto-complete="off" disabled style="width: 880px;">
                      <template slot="prepend">上传附件</template>
                    </el-input>
                    <el-button size="mini" type="primary">选择</el-button>
                  </el-upload>
                </el-form-item>
              </el-col>
            </el-row>
           <el-row>
             <el-col class="elementWidth">
               <el-form-item label="" label-width="40px">
               	<el-row>
               		<el-button type="text" style="margin-left: 20px;" disabled>产品说明</el-button>
               	</el-row>
               	<el-row>
               		<el-form-item>
               			<el-input class="showWordLimit" type="textarea" show-word-limit maxlength="500" v-model="query.productDescribe" auto-complete="off" :rows="5" style="width:940px">
               			</el-input>
               		</el-form-item>
               	</el-row>
                 </el-form-item>
             </el-col>
           </el-row>

           <el-row>
             <el-col class="elementWidth">
               <el-form-item label="" label-width="40px">
                  <el-button type="primary" size="small" v-if="subFlag" v-on:click="submitQuery('query')">提交</el-button>
               </el-form-item>
             </el-col>
           </el-row>



				</el-form>
			</el-col>
		</el-row>
	</div>
</template>
<script>
	export default {
    props: {
    	visible: {
    		type: Boolean,
    		default: false
    	}
    },
		data() {
			return {
        headers: {
          Authorization: 'Bearer ' + window.localStorage.getItem("access_token")
        },
        loading: false,
        subFlag: true,
        actionPath: 'afbase/afProduct/uploadFile',
        accept: ".jpeg,.gif,.png,.bmp,.XLS,.XLSX,.PDF,.DOC,.DOCX,.RAR,.ZIP",
        upData: {
          fileName: ""
        },
        formData: {
          smallModel: [],
        },
        query: {
          productName: "",
          productDescribe: "",
          companyName: "",
          fileName: "",
          userName: "",
          filePath: '',
        },
        rules: {
           productName: [{
           		required: true,
           		message: '请输入产品名称',
           		trigger: ['blur']
           	},
           	{
           		min: 1,
           		max: 200,
           		message: '长度不超过 200',
           		trigger: ['blur']
           	}
           ]
        }
			}
		},
		created: function() {
      let orgName = window.localStorage.getItem('orgName');
       this.query.companyName = orgName;
      let nickname = window.localStorage.getItem('nickname');
      this.query.userName = nickname;
      if(!nickname){
          let username = window.localStorage.getItem('username');
          this.query.userName = username;
       }
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
      submitQuery(formName){
        	this.$refs[formName].validate((valid) => {
        		if(valid) {
                     this.subFlag = false;
                     let params = this.query;
                     this.$axios.post2('/afbase/afProduct/sendProductEmail', params)
                     	.then(function(response) {
                     		if(response.data.code == 0) {
                          this.loading = false
                          this.openSuccess();
                          this.query.productName = "";
                          this.query.productDescribe = "";
                          this.query.fileName = "";
                          this.query.filePath = "";
                          this.subFlag = true;
                        } else {
                     			this.loading = false
                          this.subFlag = true;
                     			let errorinfo = response.data.messageInfo;
                     				this.openError(errorinfo);
                     		}

                     	}.bind(this)).catch(function(error) {
                     		this.loading = false
                        this.subFlag = true;
                     		this.openError(error.response.data.messageInfo);
                     	}.bind(this));

              } else {
              		console.log('error submit!!');
              		return false;
              	}
              });

      },
      trim_str(str){
        return str.replace(/(^\s*)|(\s*$)/g, "");
      },
      beforeAvatarUpload(file) {
        this.upData.fileName = "send_product_" + new Date().format("yyMMddhhmmss") + file.name.substring(file.name.lastIndexOf('.'));
        ;
        this.query.fileName = this.upData.fileName;

        const isLt10M = file.size < 10 * 1024 * 1024;
        if (!isLt10M) {
          this.$message.error('上传模板大小不能超过 10MB!');
        }
        return isLt10M;
      },
      handleRemoveChange(file, fileList) {
      	var filelists = [];
        this.query.fileName = '';
        this.query.filePath = '';
        this.formData.smallModel = filelists;
      },
      handleSuccessChange(response, file, fileList) { //上传成功后在图片框显示图片
        if (response.code == 0) {
          this.$message.success('上传成功')
          this.query.filePath = response.data;
        } else {
          this.$message.error(response.message || '上传失败');
        }
      },
		}
	}
</script>
<style>

  .send_product{
    padding-top: 10px;
    padding-bottom: 10px;
    height: 650px;

  }
	.el-form-item__content_send_product {
		line-height: 8px !important;
		position: relative;
		font-size: 14px;
	}

</style>
