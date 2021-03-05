<template>
	<el-dialog title="航司 - 编辑" width="480px" :visible.sync="visible" :close-on-press-escape="false" :close-on-click-modal="false" :before-close="handleClose">
		<el-form :model="ruleForm" :rules="rules" ref="ruleForm" style="margin-left: 10px;" class="afCarrierEdit-ruleForm">
			<el-row>
				<el-col class="elementWidth">
          <el-form-item label-width="10px" prop="carrierCode">
            <el-input class="widthFive" v-model="ruleForm.carrierCode" auto-complete="off" style="width: 198px;" clearable>
              <template slot="prepend">
                <font style="color: red;">*</font>
                <span>航司二字码</span>
              </template>
            </el-input>
          </el-form-item>
				</el-col>
				<el-col class="elementWidth">
          <el-form-item label-width="10px" prop="carrierPrefix">
            <el-input class="widthFive" v-model="ruleForm.carrierPrefix" auto-complete="off" style="width: 209px;" clearable>
              <template slot="prepend">
                <font style="color: red;">*</font>
                <span>航司三字码</span>
              </template>
            </el-input>
          </el-form-item>
				</el-col>
			</el-row>
			<el-row>
				<el-col class="elementWidth">
          <el-form-item label-width="10px" prop="carrierNameCn">
            <el-input v-model="ruleForm.carrierNameCn" auto-complete="off" style="width: 418px;" clearable>
              <template slot="prepend">
                <font style="color: red;">*</font>
                <span>航司中文名称</span>
              </template>
            </el-input>
          </el-form-item>
				</el-col>
			</el-row>
			<el-row>
				<el-col class="elementWidth">
          <el-form-item label-width="10px" prop="carrierNameEn">
            <el-input v-model="ruleForm.carrierNameEn" auto-complete="off" style="width: 418px;" clearable>
              <template slot="prepend">
                <font style="color: red;">*</font>
                <span>航司英文名称</span>
              </template>
            </el-input>
          </el-form-item>
				</el-col>
			</el-row>
			<el-row>
        <el-col style="margin-left: 30px;">
          <el-form-item prop="carrierAwbRequirement">
            <el-row>
              <el-button type="text" style="margin-left: -20px;color: #909399" disabled>制单要求</el-button>
            </el-row>
            <el-input type="textarea" :rows="2" show-word-limit maxlength="500" v-model="ruleForm.carrierAwbRequirement" auto-complete="off" style="width:418px;margin-left: -20px;">
            </el-input>
          </el-form-item>
        </el-col>
			</el-row>
			<el-row>
				<el-col class="elementWidth">
					<el-form-item label="主单模板PDF（格打）" prop="carrierMawbModFormat" label-width="164px" style="margin-left: 4px;"
                        class="modFormatColor">
            <el-upload v-if="ruleForm.carrierMawbModFormat==null" :action="actionPath" :accept="accept" :limit=1
                       :data="{token:token,key:'public/carrier/'+ruleForm.carrierPrefix+'_awbFormat_'+new Date().format('yyMMddhhmmss')+'.pdf'}"
                       :on-success="uploadSuccess" :before-upload="beforeUpload" :show-file-list=false>
              <el-button size="mini" type="primary" @click="clickUploadButton('carrierMawbModFormat')">上传模板</el-button>
            </el-upload>
            <ul class="el-upload-list el-upload-list--text" v-if="ruleForm.carrierMawbModFormat!=null">
              <li class="el-upload-list__item is-success">
                <a class="el-upload-list__item-name" :href="ruleForm.carrierMawbModFormatUrl" target="_Blank">
                  <i class="el-icon-document"></i> {{ ruleForm.carrierMawbModFormatName }}
                </a>
                <label class="el-upload-list__item-status-label">
                  <i class="el-icon-upload-success el-icon-circle-check"></i>
                </label>
								<i class="el-icon-close" @click="handleRemove('carrierMawbModFormat')"></i>
							</li>
						</ul>
					</el-form-item>
				</el-col>
      </el-row>
      <el-row>
        <el-col class="elementWidth">
          <el-form-item label="主单模板PDF（套打）" prop="carrierMawbModOver" label-width="164px" style="margin-left: 4px;"
                        class="modFormatColor">
            <el-upload v-if="ruleForm.carrierMawbModOver==null" :action="actionPath" :accept="accept" :limit=1
                       :data="{token:token,key:'public/carrier/'+ruleForm.carrierPrefix+'_awbOver_'+new Date().format('yyMMddhhmmss')+'.pdf'}"
                       :on-success="uploadSuccess" :before-upload="beforeUpload" :show-file-list=false>
              <el-button size="mini" type="primary" @click="clickUploadButton('carrierMawbModOver')">上传模板</el-button>
            </el-upload>
            <ul class="el-upload-list el-upload-list--text" v-if="ruleForm.carrierMawbModOver!=null">
              <li class="el-upload-list__item is-success">
                <a class="el-upload-list__item-name" :href="ruleForm.carrierMawbModOverUrl" target="_Blank">
                  <i class="el-icon-document"></i> {{ ruleForm.carrierMawbModOverName }}
                </a>
                <label class="el-upload-list__item-status-label">
                  <i class="el-icon-upload-success el-icon-circle-check"></i>
                </label>
								<i class="el-icon-close" @click="handleRemove('carrierMawbModOver')"></i>
							</li>
						</ul>
					</el-form-item>
				</el-col>
			</el-row>
			<el-row>
				<el-col class="elementWidth">
          <el-form-item label="分单模板PDF（格打）" prop="carrierHawbModFormat" label-width="164px" style="margin-left: 4px;"
                        class="modFormatColor">
            <el-upload v-if="ruleForm.carrierHawbModFormat==null" :action="actionPath" :accept="accept" :limit=1
                       :data="{token:token,key:'public/carrier/'+ruleForm.carrierPrefix+'_hawbFormat_'+new Date().format('yyMMddhhmmss')+'.pdf'}"
                       :on-success="uploadSuccess" :before-upload="beforeUpload" :show-file-list=false>
              <el-button size="mini" type="primary" @click="clickUploadButton('carrierHawbModFormat')">上传模板</el-button>
            </el-upload>
            <ul class="el-upload-list el-upload-list--text" v-if="ruleForm.carrierHawbModFormat!=null">
              <li class="el-upload-list__item is-success">
                <a class="el-upload-list__item-name" :href="ruleForm.carrierHawbModFormatUrl" target="_Blank">
                  <i class="el-icon-document"></i> {{ ruleForm.carrierHawbModFormatName }}
                </a>
                <label class="el-upload-list__item-status-label">
                  <i class="el-icon-upload-success el-icon-circle-check"></i>
                </label>
								<i class="el-icon-close" @click="handleRemove('carrierHawbModFormat')"></i>
							</li>
						</ul>
					</el-form-item>
				</el-col>
      </el-row>
      <el-row>
				<el-col class="elementWidth">
          <el-form-item label="分单模板PDF（套打）" prop="carrierHawbModOver" label-width="164px" style="margin-left: 4px;"
                        class="modFormatColor">
            <el-upload v-if="ruleForm.carrierHawbModOver==null" :action="actionPath" :accept="accept" :limit=1
                       :data="{token:token,key:'public/carrier/'+ruleForm.carrierPrefix+'_hawbOver_'+new Date().format('yyMMddhhmmss')+'.pdf'}"
                       :on-success="uploadSuccess" :before-upload="beforeUpload" :show-file-list=false>
              <el-button size="mini" type="primary" @click="clickUploadButton('carrierHawbModOver')">上传模板</el-button>
            </el-upload>
            <ul class="el-upload-list el-upload-list--text" v-if="ruleForm.carrierHawbModOver!=null">
              <li class="el-upload-list__item is-success">
                <a class="el-upload-list__item-name" :href="ruleForm.carrierHawbModOverUrl" target="_Blank">
                  <i class="el-icon-document"></i> {{ ruleForm.carrierHawbModOverName }}
                </a>
                <label class="el-upload-list__item-status-label">
                  <i class="el-icon-upload-success el-icon-circle-check"></i>
                </label>
								<i class="el-icon-close" @click="handleRemove('carrierHawbModOver')"></i>
							</li>
						</ul>
					</el-form-item>
				</el-col>
			</el-row>

      <el-row>
        <el-col class="elementWidth">
          <el-form-item label="主单模板Excel（格打）" prop="carrierMawbModFormatExcel" label-width="164px"  style="margin-left: 4px;" class="modFormatColor">
            <el-upload v-if="ruleForm.carrierMawbModFormatExcel==null" :action="actionPath" :accept="acceptExcel"
                       :limit=1
                       :data="{token:token,key:'public/carrier/'+ruleForm.carrierPrefix+'_awbFormatExcel_'+new Date().format('yyMMddhhmmss')+'.xlsx'}"
                       :on-success="uploadSuccess" :before-upload="beforeUpload" :show-file-list=false>
              <el-button size="mini" type="primary" @click="clickUploadButton('carrierMawbModFormatExcel')">上传模板
              </el-button>
            </el-upload>
            <ul class="el-upload-list el-upload-list--text" v-if="ruleForm.carrierMawbModFormatExcel!=null">
              <li class="el-upload-list__item is-success">
                <a class="el-upload-list__item-name" :href="ruleForm.carrierMawbModFormatUrlExcel" target="_Blank">
                  <i class="el-icon-document"></i> {{ruleForm.carrierMawbModFormatNameExcel}}
                </a>
                <label class="el-upload-list__item-status-label">
                  <i class="el-icon-upload-success el-icon-circle-check"></i>
                </label>
                <i class="el-icon-close" @click="handleRemove('carrierMawbModFormatExcel')"></i>
              </li>
            </ul>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col class="elementWidth">
          <el-form-item label="主单模板Excel（套打）" prop="carrierMawbModOverExcel" label-width="164px" style="margin-left: 4px;" class="modFormatColor">
            <el-upload v-if="ruleForm.carrierMawbModOverExcel==null" :action="actionPath" :accept="acceptExcel" :limit=1
                       :data="{token:token,key:'public/carrier/'+ruleForm.carrierPrefix+'_awbOverExcel_'+new Date().format('yyMMddhhmmss')+'.xlsx'}"
                       :on-success="uploadSuccess" :before-upload="beforeUpload" :show-file-list=false>
              <el-button size="mini" type="primary" @click="clickUploadButton('carrierMawbModOverExcel')">上传模板
              </el-button>
            </el-upload>
            <ul class="el-upload-list el-upload-list--text" v-if="ruleForm.carrierMawbModOverExcel!=null">
              <li class="el-upload-list__item is-success">
                <a class="el-upload-list__item-name" :href="ruleForm.carrierMawbModOverUrlExcel" target="_Blank">
                  <i class="el-icon-document"></i> {{ruleForm.carrierMawbModOverNameExcel}}
                </a>
                <label class="el-upload-list__item-status-label">
                  <i class="el-icon-upload-success el-icon-circle-check"></i>
                </label>
                <i class="el-icon-close" @click="handleRemove('carrierMawbModOverExcel')"></i>
              </li>
            </ul>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col class="elementWidth">
          <el-form-item label="分单模板Excel（格打）" prop="carrierHawbModFormatExcel" label-width="164px" style="margin-left: 4px;" class="modFormatColor">
            <el-upload v-if="ruleForm.carrierHawbModFormatExcel==null" :action="actionPath" :accept="acceptExcel"
                       :limit=1
                       :data="{token:token,key:'public/carrier/' + ruleForm.carrierPrefix+'_hawbFormatExcel_'+new Date().format('yyMMddhhmmss')+'.xlsx'}"
                       :on-success="uploadSuccess" :before-upload="beforeUpload" :show-file-list=false>
              <el-button size="mini" type="primary" @click="clickUploadButton('carrierHawbModFormatExcel')">上传模板
              </el-button>
            </el-upload>
            <ul class="el-upload-list el-upload-list--text" v-if="ruleForm.carrierHawbModFormatExcel!=null">
              <li class="el-upload-list__item is-success">
                <a class="el-upload-list__item-name" :href="ruleForm.carrierHawbModFormatUrlExcel" target="_Blank">
                  <i class="el-icon-document"></i> {{ruleForm.carrierHawbModFormatNameExcel}}
                </a>
                <label class="el-upload-list__item-status-label">
                  <i class="el-icon-upload-success el-icon-circle-check"></i>
                </label>
                <i class="el-icon-close" @click="handleRemove('carrierHawbModFormatExcel')"></i>
              </li>
            </ul>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col class="elementWidth">
          <el-form-item label="分单模板Excel（套打）" prop="carrierHawbModOverExcel" label-width="164px" style="margin-left: 4px;" class="modFormatColor">
            <el-upload v-if="ruleForm.carrierHawbModOverExcel==null" :action="actionPath" :accept="acceptExcel" :limit=1
                       :data="{token:token,key:'public/carrier/' + ruleForm.carrierPrefix+'_hawbOverExcel_'+new Date().format('yyMMddhhmmss')+'.xlsx'}"
                       :on-success="uploadSuccess" :before-upload="beforeUpload" :show-file-list=false>
              <el-button size="mini" type="primary" @click="clickUploadButton('carrierHawbModOverExcel')">上传模板
              </el-button>
            </el-upload>
            <ul class="el-upload-list el-upload-list--text" v-if="ruleForm.carrierHawbModOverExcel!=null">
              <li class="el-upload-list__item is-success">
                <a class="el-upload-list__item-name" :href="ruleForm.carrierHawbModOverUrlExcel" target="_Blank">
                  <i class="el-icon-document"></i> {{ruleForm.carrierHawbModOverNameExcel}}
                </a>
                <label class="el-upload-list__item-status-label">
                  <i class="el-icon-upload-success el-icon-circle-check"></i>
                </label>
                <i class="el-icon-close" @click="handleRemove('carrierHawbModOverExcel')"></i>
              </li>
            </ul>
          </el-form-item>
        </el-col>
      </el-row>

			<el-row style="text-align: left">
        <el-form-item label-width="10px">
					<el-button size="small" :loading="loading" type="primary" @click="submitForm('ruleForm')" style="margin-bottom: 10px;">修改</el-button>
        </el-form-item>
				<!--<el-col :offset="1" :span="2">
          <el-button type="primary" @click="resetForm('ruleForm')" style="margin-right: 20px;">重置</el-button>
        </el-col>-->
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
				token: '',
				currItem: '',
				actionPath: 'http://up-z1.qiniu.com',
				accept: ".pdf",
        acceptExcel: ".xlsx",
				ruleForm: {
					carrierId: '',
					carrierCode: '',
					carrierPrefix: '',
					carrierNameCn: '',
					carrierNameEn: '',
					nationCode: '',
					carrierAwbRequirement: '',
					carrierMawbModFormat: null,
					carrierMawbModFormatUrl: null,
					carrierMawbModFormatName: null,
					carrierMawbModOver: null,
					carrierMawbModOverUrl: null,
					carrierMawbModOverName: null,
					carrierHawbModFormat: null,
					carrierHawbModFormatUrl: null,
					carrierHawbModFormatName: null,
					carrierHawbModOver: null,
					carrierHawbModOverUrl: null,
					carrierHawbModOverName: null,
					carrierCode1: '',
					carrierPrefix1: '',
          //excel
          carrierMawbModFormatExcel: null,
          carrierMawbModFormatUrlExcel: null,
          carrierMawbModFormatNameExcel: null,
          carrierMawbModOverExcel: null,
          carrierMawbModOverUrlExcel: null,
          carrierMawbModOverNameExcel: null,
          carrierHawbModFormatExcel: null,
          carrierHawbModFormatUrlExcel: null,
          carrierHawbModFormatNameExcel: null,
          carrierHawbModOverExcel: null,
          carrierHawbModOverUrlExcel: null,
          carrierHawbModOverNameExcel: null
				},
				loading: false,
				rules: {
					carrierCode: [{
							required: true,
							message: '请输入航司二字码',
							trigger: ['blur', 'change']
						},
						{
							min: 1,
							max: 2,
							message: '航司二字码长度不超过 2',
							trigger: ['blur', 'change']
						}
					],
					carrierPrefix: [{
							required: true,
							message: '请输入航司三字码',
							trigger: ['blur', 'change']
						},
						{
							min: 1,
							max: 3,
							message: '航司三字码长度不超过 3',
							trigger: ['blur', 'change']
						}
					],
					carrierNameCn: [{
							required: true,
							message: '请输入航司中文名称',
							trigger: ['blur', 'change']
						},
						{
							min: 1,
							max: 100,
							message: '航司中文名称长度不超过 100',
							trigger: ['blur', 'change']
						}
					],
					carrierNameEn: [{
							required: true,
							message: '请输入航司英文名称',
							trigger: ['blur', 'change']
						},
						{
							min: 1,
							max: 100,
							message: '航司英文名称长度不超过 100',
							trigger: ['blur', 'change']
						}
					],
					carrierAwbRequirement: [{
						min: 1,
						max: 1000,
						message: '制单要求长度不超过 1000',
						trigger: ['blur', 'change']
					}],
					carrierMawbModFormat: [{
						min: 1,
						max: 100,
						message: '主单模板（格打）长度不超过 100',
						trigger: ['blur', 'change']
					}],
					carrierMawbModOver: [{
						min: 1,
						max: 100,
						message: '主单模板（套打）长度不超过 100',
						trigger: ['blur', 'change']
					}],
					carrierHawbModFormat: [{
						min: 1,
						max: 100,
						message: '分单模板（格打）长度不超过 100',
						trigger: ['blur', 'change']
					}],
					carrierHawbModOver: [{
						min: 1,
						max: 100,
						message: '分单模板（套打）长度不超过 100',
						trigger: ['blur', 'change']
					}],
          carrierMawbModFormatExcel: [{
            min: 1,
            max: 103,
            message: '主单模板Excel（格打）长度不超过 50',
            trigger: 'change'
          }],
          carrierMawbModOverExcel: [{
            min: 1,
            max: 103,
            message: '主单模板Excel（套打）长度不超过 50',
            trigger: 'change'
          }],
          carrierHawbModFormatExcel: [{
            min: 1,
            max: 103,
            message: '分单模板Excel（格打）长度不超过 50',
            trigger: 'change'
          }],
          carrierHawbModOverExcel: [{
            min: 1,
            max: 103,
            message: '分单模板Excel（套打）长度不超过 50',
            trigger: 'change'
          }]
				}
			};
		},
		inject: ['findByPage'],
		methods: {
			resetForm(formName) {
				this.$refs[formName].resetFields();
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
			submitForm(formName) {
				this.$refs[formName].validate((valid) => {
					if(valid) {
						let params = this.ruleForm;
						this.$axios.post2('/afbase/carrier/doUpdate', params)
							.then(function(response) {
								if(response.data.code == 0) {
									this.openSuccess();
									this.findByPage();
									this.handleClose();
								} else {
									this.openError(response.data.messageInfo);
								}
							}.bind(this)).catch(function(error) {
								let errorinfo = error.response.data.messageInfo;
								this.openError(errorinfo);
							}.bind(this));
					} else {
						console.log('error submit!!');
						return false;
					}
				});
			},
			// 关闭
			handleClose() {
				this.$emit('update:visible', false);
			},
			handleRemove(item) {
				if(item == 'carrierMawbModFormat') {
					this.ruleForm.carrierMawbModFormatName = null
					this.ruleForm.carrierMawbModFormatUrl = null
					this.ruleForm.carrierMawbModFormat = null
				} else if(item == 'carrierMawbModOver') {
					this.ruleForm.carrierMawbModOverName = null
					this.ruleForm.carrierMawbModOverUrl = null
					this.ruleForm.carrierMawbModOver = null
				} else if(item == 'carrierHawbModFormat') {
					this.ruleForm.carrierHawbModFormatName = null
					this.ruleForm.carrierHawbModFormatUrl = null
					this.ruleForm.carrierHawbModFormat = null
				} else if(item == 'carrierHawbModOver') {
					this.ruleForm.carrierHawbModOverName = null
					this.ruleForm.carrierHawbModOverUrl = null
					this.ruleForm.carrierHawbModOver = null
				}else if(item == 'carrierMawbModFormatExcel') {
          this.ruleForm.carrierMawbModFormatNameExcel = null
          this.ruleForm.carrierMawbModFormatUrlExcel = null
          this.ruleForm.carrierMawbModFormatExcel = null
        }else if(item == 'carrierMawbModOverExcel') {
          this.ruleForm.carrierMawbModOverNameExcel = null
          this.ruleForm.carrierMawbModOverUrlExcel = null
          this.ruleForm.carrierMawbModOverExcel = null
        }else if(item == 'carrierHawbModFormatExcel') {
          this.ruleForm.carrierHawbModFormatNameExcel = null
          this.ruleForm.carrierHawbModFormatUrlExcel = null
          this.ruleForm.carrierHawbModFormatExcel = null
        }else if(item == 'carrierHawbModOverExcel') {
          this.ruleForm.carrierHawbModOverNameExcel = null
          this.ruleForm.carrierHawbModOverUrlExcel = null
          this.ruleForm.carrierHawbModOverExcel = null
        }
				this.$refs['ruleForm'].validateField(item)
			},
			uploadSuccess(response, file, fileList) { //上传成功后在图片框显示图片
				if(this.currItem == 'carrierMawbModFormat') {
					this.ruleForm.carrierMawbModFormatName = file.name
					this.ruleForm.carrierMawbModFormatUrl = "http://doc.yctop.com/" + response.key;
					this.ruleForm.carrierMawbModFormat = this.ruleForm.carrierMawbModFormatName + ',' + this.ruleForm.carrierMawbModFormatUrl
				} else if(this.currItem == 'carrierMawbModOver') {
					this.ruleForm.carrierMawbModOverName = file.name
					this.ruleForm.carrierMawbModOverUrl = "http://doc.yctop.com/" + response.key;
					this.ruleForm.carrierMawbModOver = this.ruleForm.carrierMawbModOverName + ',' + this.ruleForm.carrierMawbModOverUrl
				} else if(this.currItem == 'carrierHawbModFormat') {
					this.ruleForm.carrierHawbModFormatName = file.name
					this.ruleForm.carrierHawbModFormatUrl = "http://doc.yctop.com/" + response.key;
					this.ruleForm.carrierHawbModFormat = this.ruleForm.carrierHawbModFormatName + ',' + this.ruleForm.carrierHawbModFormatUrl
				} else if(this.currItem == 'carrierHawbModOver') {
					this.ruleForm.carrierHawbModOverName = file.name
					this.ruleForm.carrierHawbModOverUrl = "http://doc.yctop.com/" + response.key;
					this.ruleForm.carrierHawbModOver = this.ruleForm.carrierHawbModOverName + ',' + this.ruleForm.carrierHawbModOverUrl
				}else if(this.currItem == 'carrierMawbModFormatExcel') {
          this.ruleForm.carrierMawbModFormatNameExcel = file.name
          this.ruleForm.carrierMawbModFormatUrlExcel = "http://doc.yctop.com/" + response.key;
          this.ruleForm.carrierMawbModFormatExcel = this.ruleForm.carrierMawbModFormatNameExcel + ',' + this.ruleForm.carrierMawbModFormatUrlExcel
        } else if(this.currItem == 'carrierMawbModOverExcel') {
          this.ruleForm.carrierMawbModOverNameExcel = file.name
          this.ruleForm.carrierMawbModOverUrlExcel = "http://doc.yctop.com/" + response.key;
          this.ruleForm.carrierMawbModOverExcel = this.ruleForm.carrierMawbModOverNameExcel + ',' + this.ruleForm.carrierMawbModOverUrlExcel
        } else if(this.currItem == 'carrierHawbModFormatExcel') {
          this.ruleForm.carrierHawbModFormatNameExcel = file.name
          this.ruleForm.carrierHawbModFormatUrlExcel = "http://doc.yctop.com/" + response.key;
          this.ruleForm.carrierHawbModFormatExcel = this.ruleForm.carrierHawbModFormatNameExcel + ',' + this.ruleForm.carrierHawbModFormatUrlExcel
        } else if(this.currItem == 'carrierHawbModOverExcel') {
          this.ruleForm.carrierHawbModOverNameExcel = file.name
          this.ruleForm.carrierHawbModOverUrlExcel = "http://doc.yctop.com/" + response.key;
          this.ruleForm.carrierHawbModOverExcel = this.ruleForm.carrierHawbModOverNameExcel + ',' + this.ruleForm.carrierHawbModOverUrlExcel
        }
				this.$refs['ruleForm'].validateField(this.currItem)
			},
			clickUploadButton(item) {
				this.currItem = item
			},
			beforeUpload(file) {
				if(this.ruleForm.carrierPrefix == null || this.ruleForm.carrierPrefix == '') {
					this.openError('请先录入航司三字码')
					return false
				}
				if(file.size > 10 * 1024 * 1024){
          this.openError('上传的文件不能超过10M')
          return false
        }
        if(file.name.indexOf(".pdf") < 0 && file.name.indexOf(".xlsx") < 0) {
          this.openError('只能上传PDF文件或Excel文件')
          return false
        }
			}
		},
		created() {
			this.ruleForm.carrierId = this.frow.carrierId;
			this.ruleForm.carrierCode = this.frow.carrierCode;
			this.ruleForm.carrierPrefix = this.frow.carrierPrefix;
			this.ruleForm.carrierNameCn = this.frow.carrierNameCn;
			this.ruleForm.carrierNameEn = this.frow.carrierNameEn;
			this.ruleForm.carrierAwbRequirement = this.frow.carrierAwbRequirement;
			this.ruleForm.carrierMawbModFormat = this.frow.carrierMawbModFormat;
			this.ruleForm.carrierMawbModOver = this.frow.carrierMawbModOver;
			this.ruleForm.carrierHawbModFormat = this.frow.carrierHawbModFormat;
			this.ruleForm.carrierHawbModOver = this.frow.carrierHawbModOver;

			this.ruleForm.carrierCode1 = this.frow.carrierCode; //用于后台判断是否更改过此值
			this.ruleForm.carrierPrefix1 = this.frow.carrierPrefix; //用于后台判断是否更改过此值

      this.ruleForm.carrierMawbModFormatExcel = this.frow.carrierMawbModFormatExcel ;
      this.ruleForm.carrierMawbModOverExcel  = this.frow.carrierMawbModOverExcel ;
      this.ruleForm.carrierHawbModFormatExcel  = this.frow.carrierHawbModFormatExcel ;
      this.ruleForm.carrierHawbModOverExcel  = this.frow.carrierHawbModOverExcel ;
		},
		mounted: function() {
			this.$axios.get('/hrs/org/getUpToken')
				.then(function(response) {
					this.token = response.data.data;
				}.bind(this));

			if(this.ruleForm.carrierMawbModFormat != null) {
				this.ruleForm.carrierMawbModFormatName = this.ruleForm.carrierMawbModFormat.split(',')[0]
				this.ruleForm.carrierMawbModFormatUrl = this.ruleForm.carrierMawbModFormat.split(',')[1]
			}
			if(this.ruleForm.carrierMawbModOver != null) {
				this.ruleForm.carrierMawbModOverName = this.ruleForm.carrierMawbModOver.split(',')[0]
				this.ruleForm.carrierMawbModOverUrl = this.ruleForm.carrierMawbModOver.split(',')[1]
			}
			if(this.ruleForm.carrierHawbModOver != null) {
				this.ruleForm.carrierHawbModOverName = this.ruleForm.carrierHawbModOver.split(',')[0]
				this.ruleForm.carrierHawbModOverUrl = this.ruleForm.carrierHawbModOver.split(',')[1]
			}
			if(this.ruleForm.carrierHawbModFormat != null) {
				this.ruleForm.carrierHawbModFormatName = this.ruleForm.carrierHawbModFormat.split(',')[0]
				this.ruleForm.carrierHawbModFormatUrl = this.ruleForm.carrierHawbModFormat.split(',')[1]
			}

      if(this.ruleForm.carrierMawbModFormatExcel != null) {
        this.ruleForm.carrierMawbModFormatNameExcel = this.ruleForm.carrierMawbModFormatExcel.split(',')[0]
        this.ruleForm.carrierMawbModFormatUrlExcel = this.ruleForm.carrierMawbModFormatExcel.split(',')[1]
      }
      if(this.ruleForm.carrierMawbModOverExcel != null) {
        this.ruleForm.carrierMawbModOverNameExcel = this.ruleForm.carrierMawbModOverExcel.split(',')[0]
        this.ruleForm.carrierMawbModOverUrlExcel = this.ruleForm.carrierMawbModOverExcel.split(',')[1]
      }
      if(this.ruleForm.carrierHawbModOverExcel != null) {
        this.ruleForm.carrierHawbModOverNameExcel = this.ruleForm.carrierHawbModOverExcel.split(',')[0]
        this.ruleForm.carrierHawbModOverUrlExcel = this.ruleForm.carrierHawbModOverExcel.split(',')[1]
      }
      if(this.ruleForm.carrierHawbModFormatExcel != null) {
        this.ruleForm.carrierHawbModFormatNameExcel = this.ruleForm.carrierHawbModFormatExcel.split(',')[0]
        this.ruleForm.carrierHawbModFormatUrlExcel = this.ruleForm.carrierHawbModFormatExcel.split(',')[1]
      }

		}
	}
</script>
<style type="text/css">

  .afCarrierEdit-ruleForm .el-input__icon {
    line-height: 30px !important;
  }

  .afCarrierEdit-ruleForm .el-form-item__content {
    line-height: 30px !important;
  }

  .afCarrierEdit-ruleForm .el-input-group__prepend {
    padding: 0 6px;
  }

  .afCarrierEdit-ruleForm .widthFive .el-input-group__prepend {
    padding: 0 13px;
  }

  .afCarrierEdit-ruleForm .modFormatColor .el-form-item__label {
    color: #909399;
  }

</style>
