<template>
	<el-dialog title="签约公司 - 新增" width="850px" :visible.sync="visible" :close-on-press-escape="false" :close-on-click-modal="false" :before-close="handleClose">
		<el-form :model="ruleForm" :rules="rules" ref="ruleForm" class="demo-ruleForm">
			<el-row>
				<el-col class="elementWidth">
					<el-form-item label="选择客商资料" prop="coopId" required label-width="150px">
						<el-select v-model="ruleForm.coopId" filterable placeholder="请选择" @change="selectGet" style="width: 340px;">
							<el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value">
							</el-option>
						</el-select>
					</el-form-item>
				</el-col>
				<el-col class="elementWidth">
					<el-form-item label="一站式平台代码" prop="oneStopCode" label-width="130px">
						<el-input v-model="ruleForm.oneStopCode" auto-complete="off" style="width: 150px;">
						</el-input>
					</el-form-item>
				</el-col>
			</el-row>
			<el-row>
				<el-col class="elementWidth">
					<el-form-item label="版本类型" prop="orgEditionId" required label-width="150px">
						<el-select v-model="ruleForm.orgEditionId" filterable placeholder="请选择" style="width: 150px;" @change="changeOrgEditionId">
							<el-option v-for="item in orgEditions" :key="item.orgId" :label="item.orgName" :value="item.orgId">
							</el-option>
						</el-select>
					</el-form-item>
				</el-col>
				<el-col class="elementWidth">
					<el-form-item label="用户数量" prop="orgUserCount" required label-width="100px">
						<el-input v-model="ruleForm.orgUserCount" auto-complete="off" style="width: 90px;">
						</el-input>
					</el-form-item>
				</el-col>
				<el-col class="elementWidth">
					<el-form-item label="失效时间" prop="stopDate" required label-width="130px">
						<el-date-picker v-model="ruleForm.stopDate" type="date" value-format="yyyy-MM-dd 23:59:59" :picker-options="pickerOptions0" style="width: 150px;">
						</el-date-picker>
					</el-form-item>
				</el-col>
			</el-row>
			<el-row>
				<el-col class="elementWidth">
					<el-form-item label="管理员账户" prop="adminName" required label-width="150px">
						<el-input v-model="ruleForm.adminName" auto-complete="off" style="width: 150px;">
						</el-input>
					</el-form-item>
				</el-col>
				<el-col class="elementWidth">
					<el-form-item label="管理邮箱" prop="adminEmail" required label-width="100px">
						<el-input v-model="ruleForm.adminEmail" auto-complete="off" style="width: 371px;">
						</el-input>
					</el-form-item>
				</el-col>
			</el-row>
			<el-row>
				<el-col class="elementWidth">
					<el-form-item label="管理员电话" prop="adminTel" label-width="150px">
						<el-select v-model="ruleForm.adminInternationalCountryCode" placeholder="" style="width: 80px;">
							<el-option v-for="item in internationalCountryCodes" :key="item.edicode1" :label="item.paramText" :value="item.edicode1">
							</el-option>
						</el-select>

						<el-input v-model="ruleForm.adminTel" auto-complete="off" style="width: 170px;">
						</el-input>
					</el-form-item>
				</el-col>
				<el-col class="elementWidth">
					<el-form-item label="风控邮箱" prop="rcEmail" required label-width="100px">
						<el-input v-model="ruleForm.rcEmail" auto-complete="off" style="width: 271px;">
						</el-input>
					</el-form-item>
				</el-col>
			</el-row>
			<el-row>
				<el-col class="elementWidth">
					<el-form-item label="需求人" prop="demandPersonId" required label-width="150px">
						<el-select v-model="ruleForm.demandPersonId" filterable placeholder="" style="width: 340px;" @change="setdemandersonName">
							<el-option v-for="item in useroptions" :key="item.id" :label="item.name" :value="item.id">
							</el-option>
						</el-select>
					</el-form-item>
				</el-col>
			</el-row>
			<el-row>
				<el-col class="elementWidth">
					<el-form-item label="签约公司备注" prop="orgRemark" label-width="150px">
						<el-input class="showWordLimit" type="textarea" show-word-limit maxlength="500" v-model="ruleForm.orgRemark" auto-complete="off" :rows="3" style="width:625px">
						</el-input>
					</el-form-item>
				</el-col>
			</el-row>

			<HR color="#eee" size="5" style="margin-top: 10px;">
			</HR>
			<span>附件</span>
			<el-button type="text" size="small" v-if="attachment" v-on:click="attachment=false">收起</el-button>
			<el-button type="text" size="small" v-if="!attachment" v-on:click="attachment=true">展开</el-button>
			<el-row v-show="attachment">
				<el-col class="elementWidth">
					<el-form-item label="" prop="orgLogo" label-width="50px">
						<el-input v-model="ruleForm.orgLogo" auto-complete="off" v-if="false">
						</el-input>
						<el-upload style="width: 210px;" class="el-form-item__content3" :action="actionPath" :accept="accept" list-type="picture" :limit=1 :data="uptoken" :before-upload="beforeAvatarUpload" :on-remove="handleRemoveChange" :on-success="handleSuccessChange" ref="upload" :auto-upload="true" :file-list="formData.smallModelPhoto">
							<span style="margin-left: 5px;">Logo(大)</span>
							<el-button style="margin-left: 80px;" size="mini" type="primary" @click="clickorgLogo">上传</el-button>
							<div slot="tip" class="el-upload__tip"><span style="margin-left: 5px;">尺寸：400x100</span><span style="margin-left: 25px;">格式：jpg/png/gif</span></div>
							<div slot="tip" class="el-upload__tip"><span style="margin-left: 5px;">大小：MAX(10M)</span><span style="margin-left: 14px;">数量：1</span></div>
						</el-upload>
					</el-form-item>
				</el-col>
				<el-col class="elementWidth">
					<el-form-item label="" prop="shortLogo" label-width="50px">
						<el-input v-model="ruleForm.shortLogo" auto-complete="off" v-if="false">
						</el-input>
						<el-upload style="width: 210px;" class="el-form-item__content3" :action="actionPath" :accept="accept" list-type="picture" :limit=1 :data="uptoken" :before-upload="beforeAvatarUpload2" :on-remove="handleRemoveChange2" :on-success="handleSuccessChange2" ref="upload2" :auto-upload="true" :file-list="formData2.smallModelPhoto">
							<span style="margin-left: 5px;">Logo(小)</span>
							<el-button style="margin-left: 80px;" size="mini" type="primary" @click="clickshortLogo">上传</el-button>
							<div slot="tip" class="el-upload__tip"><span style="margin-left: 5px;">尺寸：100x100</span><span style="margin-left: 25px;">格式：jpg/png/gif</span></div>
							<div slot="tip" class="el-upload__tip"><span style="margin-left: 5px;">大小：MAX(10M)</span><span style="margin-left: 14px;">数量：1</span></div>
						</el-upload>
					</el-form-item>
				</el-col>
				<el-col class="elementWidth">
					<el-form-item label="" prop="orgSeal" label-width="50px">
						<el-upload style="width: 210px;" class="el-form-item__content3" :action="actionPath" :limit=1 :data="uptoken" :before-upload="handleOrgSealUploadBefore" :on-remove="handleRemoveOrgSeal" :on-success="handleSuccessOrgSeal" :file-list="orgSealUploadFileList" list-type="picture">
							<span style="margin-left: 5px;">印章</span>
							<el-button style="margin-left: 106px;" size="mini" type="primary" @click="clickorgSeal">上传</el-button>
							<div slot="tip" class="el-upload__tip"><span style="margin-left: 5px;">尺寸：300x300</span><span style="margin-left: 25px;">格式：jpg/png/gif</span></div>
							<div slot="tip" class="el-upload__tip"><span style="margin-left: 5px;">大小：MAX(10M)</span><span style="margin-left: 14px;">数量：1</span></div>
						</el-upload>
					</el-form-item>
				</el-col>
			</el-row>
			<!--<el-divider v-if="attachment"></el-divider>-->

      <HR color="#eee" size="5" style="margin-top: 10px;">
      </HR>
      <span>账单模板</span>
      <el-button type="text" size="small" v-if="billTemplate" v-on:click="billTemplate=false">收起</el-button>
      <el-button type="text" size="small" v-if="!billTemplate" v-on:click="billTemplate=true">展开</el-button>
      <el-row v-show="billTemplate">
        <!--<el-col class="elementWidth">
          <el-form-item label="中文账单" prop="chBillTemplate" label-width="100px">
            <el-input v-model="ruleForm.chBillTemplate" auto-complete="off" disabled style="width: 185px;">
            </el-input>
          </el-form-item>
        </el-col>-->
        <el-col class="elementWidth">
          <el-form-item label="" label-width="55px">
            <el-upload class="el-form-item__content3" :action="actionPath" :accept="accept3" :data="uptoken" :before-upload="beforeAvatarUpload3" :on-remove="handleRemoveChange3" :on-success="handleSuccessChange3" ref="upload3" :auto-upload="true" :show-file-list="false">
              <span>AE账单模板(中文)</span>
              <el-input v-model="ruleForm.chBillTemplate" auto-complete="off" disabled style="width: 185px;">
              </el-input>
              <el-button size="mini" type="primary">上传</el-button>
              <div slot="tip" class="el-upload__tip">格式：<span style="color:#409EFF">PDF</span>&nbsp;&nbsp;&nbsp;&nbsp;&emsp;&nbsp;大小：3MB</div>
            </el-upload>
          </el-form-item>
        </el-col>
        <!--<el-col class="elementWidth">
          <el-form-item label="英文账单" prop="enBillTemplate" label-width="100px">
            <el-input v-model="ruleForm.enBillTemplate" auto-complete="off" disabled style="width: 185px;">
            </el-input>
          </el-form-item>
        </el-col>-->
        <el-col class="elementWidth">
          <el-form-item label="" label-width="32px">
            <el-upload class="el-form-item__content3" :action="actionPath" :accept="accept3" :data="uptoken" :before-upload="beforeAvatarUpload4" :on-remove="handleRemoveChange4" :on-success="handleSuccessChange4" ref="upload4" :auto-upload="true" :show-file-list="false">
              <span>AE账单模板(英文)</span>
              <el-input v-model="ruleForm.enBillTemplate" auto-complete="off" disabled style="width: 185px;">
              </el-input>
              <el-button size="mini" type="primary">上传</el-button>
              <div slot="tip" class="el-upload__tip">格式：<span style="color:#409EFF">PDF</span>&nbsp;&nbsp;&nbsp;&nbsp;&emsp;&nbsp;大小：3MB</div>
            </el-upload>
          </el-form-item>
        </el-col>
        <!--<el-col class="elementWidth">
          <el-form-item label="中文清单模板" prop="chListTemplate" label-width="150px">
            <el-input v-model="ruleForm.chListTemplate" auto-complete="off" disabled style="width: 277px;">
            </el-input>
          </el-form-item>
        </el-col>
        <el-col class="elementWidth">
          <el-form-item label="" label-width="20px">
            <el-upload class="el-form-item__content3" :action="actionPath" :accept="accept3" :data="uptoken" :before-upload="beforeAvatarUpload5" :on-remove="handleRemoveChange5" :on-success="handleSuccessChange5" ref="upload5" :auto-upload="true" :show-file-list="false">
              <el-button size="mini" type="primary">上传中文清单模板</el-button>
              <div slot="tip" class="el-upload__tip">只能上传.xls,.xlsx,.pdf文件，</div>
              <div slot="tip" class="el-upload__tip">且不超过10M</div>
            </el-upload>
          </el-form-item>
        </el-col>-->
      </el-row>

      <!--AE excel-->
      <el-row v-show="billTemplate">
        <el-col class="elementWidth">
          <el-form-item label="" label-width="55px">
            <el-upload class="el-form-item__content3" :action="actionPath" :accept="acceptExcel" :data="uptoken" :before-upload="beforeAvatarUploadExcelChAE" :on-remove="handleRemoveChangeExcelChAE" :on-success="handleSuccessChangeExcelChAE"  :auto-upload="true" :show-file-list="false">
              <span>AE账单模板(中文)</span>
              <el-input v-model="ruleForm.chBillTemplateExcel" auto-complete="off" disabled style="width: 185px;">
              </el-input>
              <el-button size="mini" type="primary">上传</el-button>
              <div slot="tip" class="el-upload__tip">格式：<span style="color:#F56C6C">EXCEL</span>&nbsp;&nbsp;&nbsp;&nbsp;大小：3MB</div>
            </el-upload>
          </el-form-item>
        </el-col>

        <el-col class="elementWidth">
          <el-form-item label="" label-width="32px">
            <el-upload class="el-form-item__content3" :action="actionPath" :accept="acceptExcel" :data="uptoken" :before-upload="beforeAvatarUploadExcelEnAE" :on-remove="handleRemoveChangeExcelEnAE" :on-success="handleSuccessChangeExcelEnAE" :auto-upload="true" :show-file-list="false">
              <span>AE账单模板(英文)</span>
              <el-input v-model="ruleForm.enBillTemplateExcel" auto-complete="off" disabled style="width: 185px;">
              </el-input>
              <el-button size="mini" type="primary">上传</el-button>
              <div slot="tip" class="el-upload__tip">格式：<span style="color:#F56C6C">EXCEL</span>&nbsp;&nbsp;&nbsp;&nbsp;大小：3MB</div>
            </el-upload>
          </el-form-item>
        </el-col>

      </el-row>
      <!--<el-row v-if="attachment">

        <el-col class="elementWidth">
          <el-form-item label="英文清单模板" prop="enListTemplate" label-width="150px">
            <el-input v-model="ruleForm.enListTemplate" auto-complete="off" disabled style="width: 277px;">
            </el-input>
          </el-form-item>
        </el-col>
        <el-col class="elementWidth">
          <el-form-item label="" label-width="20px">
            <el-row>
              <el-upload class="el-form-item__content3" :action="actionPath" :accept="accept3" :data="uptoken" :before-upload="beforeAvatarUpload6" :on-remove="handleRemoveChange6" :on-success="handleSuccessChange6" ref="upload6" :auto-upload="true" :show-file-list="false">
                <el-button size="mini" type="primary">上传英文清单模板</el-button>
                <div slot="tip" class="el-upload__tip">只能上传.xls,.xlsx,.pdf文件，</div>
                <div slot="tip" class="el-upload__tip">且不超过10M</div>
              </el-upload>
            </el-row>
          </el-form-item>
        </el-col>
      </el-row>-->

      <!--Ai 模板 PDF-->
      <el-row v-show="billTemplate">
        <el-col class="elementWidth">
          <el-form-item label="" label-width="55px">
            <el-upload class="el-form-item__content3" :action="actionPath" :accept="accept3" :data="uptoken" :before-upload="beforeAvatarUploadChAi" :on-remove="handleRemoveChangeChAi" :on-success="handleSuccessChangeChAi" :auto-upload="true" :show-file-list="false">
              <span>AI账单模板(中文)</span>
              <el-input v-model="ruleForm.chBillTemplateAi" auto-complete="off" disabled style="width: 190px;">
              </el-input>
              <el-button size="mini" type="primary">上传</el-button>
              <div slot="tip" class="el-upload__tip">格式：<span style="color:#409EFF">PDF</span>&nbsp;&nbsp;&nbsp;&nbsp;&emsp;&nbsp;大小：3MB</div>
            </el-upload>
          </el-form-item>
        </el-col>
        <el-col class="elementWidth">
          <el-form-item label="" label-width="32px">
            <el-upload class="el-form-item__content3" :action="actionPath" :accept="accept3" :data="uptoken" :before-upload="beforeAvatarUploadEnAi" :on-remove="handleRemoveChangeEnAi" :on-success="handleSuccessChangeEnAi" :auto-upload="true" :show-file-list="false">
              <span>AI账单模板(英文)</span>
              <el-input v-model="ruleForm.enBillTemplateAi" auto-complete="off" disabled style="width: 190px;">
              </el-input>
              <el-button size="mini" type="primary">上传</el-button>
              <div slot="tip" class="el-upload__tip">格式：<span style="color:#409EFF">PDF</span>&nbsp;&nbsp;&nbsp;&nbsp;&emsp;&nbsp;大小：3MB</div>
            </el-upload>
          </el-form-item>
        </el-col>
      </el-row>

      <!--Ai 模板 EXCEL-->
      <el-row v-show="billTemplate">
        <el-col class="elementWidth">
          <el-form-item label="" label-width="55px">
            <el-upload class="el-form-item__content3" :action="actionPath" :accept="acceptExcel" :data="uptoken" :before-upload="beforeAvatarUploadExcelChAi" :on-remove="handleRemoveChangeExcelChAi" :on-success="handleSuccessChangeExcelChAi" :auto-upload="true" :show-file-list="false">
              <span>AI账单模板(中文)</span>
              <el-input v-model="ruleForm.chBillTemplateAiExcel" auto-complete="off" disabled style="width: 190px;">
              </el-input>
              <el-button size="mini" type="primary">上传</el-button>
              <div slot="tip" class="el-upload__tip">格式：<span style="color:#F56C6C">EXCEL</span>&nbsp;&nbsp;&nbsp;&nbsp;大小：3MB</div>
            </el-upload>
          </el-form-item>
        </el-col>
        <el-col class="elementWidth">
          <el-form-item label="" label-width="32px">
            <el-upload class="el-form-item__content3" :action="actionPath" :accept="acceptExcel" :data="uptoken" :before-upload="beforeAvatarUploadExcelEnAi" :on-remove="handleRemoveChangeExcelEnAi" :on-success="handleSuccessChangeExcelEnAi" :auto-upload="true" :show-file-list="false">
              <span>AI账单模板(英文)</span>
              <el-input v-model="ruleForm.enBillTemplateAiExcel" auto-complete="off" disabled style="width: 190px;">
              </el-input>
              <el-button size="mini" type="primary">上传</el-button>
              <div slot="tip" class="el-upload__tip">格式：<span style="color:#F56C6C">EXCEL</span>&nbsp;&nbsp;&nbsp;&nbsp;大小：3MB</div>
            </el-upload>
          </el-form-item>
        </el-col>
      </el-row>



      <!--SE 模板 PDF-->
      <el-row v-show="billTemplate">
        <el-col class="elementWidth">
          <el-form-item label="" label-width="55px">
            <el-upload class="el-form-item__content3" :action="actionPath" :accept="accept3" :data="uptoken" :before-upload="beforeAvatarUploadChSe" :on-remove="handleRemoveChangeChSe" :on-success="handleSuccessChangeChSe" :auto-upload="true" :show-file-list="false">
              <span>SE账单模板(中文)</span>
              <el-input v-model="ruleForm.chBillTemplateSe" auto-complete="off" disabled style="width: 185px;">
              </el-input>
              <el-button size="mini" type="primary">上传</el-button>
              <div slot="tip" class="el-upload__tip">格式：<span style="color:#409EFF">PDF</span>&nbsp;&nbsp;&nbsp;&nbsp;&emsp;&nbsp;大小：3MB</div>
            </el-upload>
          </el-form-item>
        </el-col>
        <el-col class="elementWidth">
          <el-form-item label="" label-width="32px">
            <el-upload class="el-form-item__content3" :action="actionPath" :accept="accept3" :data="uptoken" :before-upload="beforeAvatarUploadEnSe" :on-remove="handleRemoveChangeEnSe" :on-success="handleSuccessChangeEnSe" :auto-upload="true" :show-file-list="false">
              <span>SE账单模板(英文)</span>
              <el-input v-model="ruleForm.enBillTemplateSe" auto-complete="off" disabled style="width: 185px;">
              </el-input>
              <el-button size="mini" type="primary">上传</el-button>
              <div slot="tip" class="el-upload__tip">格式：<span style="color:#409EFF">PDF</span>&nbsp;&nbsp;&nbsp;&nbsp;&emsp;&nbsp;大小：3MB</div>
            </el-upload>
          </el-form-item>
        </el-col>
      </el-row>

      <!--SE 模板 Excel-->
      <el-row v-show="billTemplate">
        <el-col class="elementWidth">
          <el-form-item label="" label-width="55px">
            <el-upload class="el-form-item__content3" :action="actionPath" :accept="acceptExcel" :data="uptoken" :before-upload="beforeAvatarUploadExcelChSe" :on-remove="handleRemoveChangeExcelChSe" :on-success="handleSuccessChangeExcelChSe" :auto-upload="true" :show-file-list="false">
              <span>SE账单模板(中文)</span>
              <el-input v-model="ruleForm.chBillTemplateSeExcel" auto-complete="off" disabled style="width: 185px;">
              </el-input>
              <el-button size="mini" type="primary">上传</el-button>
              <div slot="tip" class="el-upload__tip">格式：<span style="color:#F56C6C">EXCEL</span>&nbsp;&nbsp;&nbsp;&nbsp;大小：3MB</div>
            </el-upload>
          </el-form-item>
        </el-col>
        <el-col class="elementWidth">
          <el-form-item label="" label-width="32px">
            <el-upload class="el-form-item__content3" :action="actionPath" :accept="acceptExcel" :data="uptoken" :before-upload="beforeAvatarUploadExcelEnSe" :on-remove="handleRemoveChangeExcelEnSe" :on-success="handleSuccessChangeExcelEnSe" :auto-upload="true" :show-file-list="false">
              <span>SE账单模板(英文)</span>
              <el-input v-model="ruleForm.enBillTemplateSeExcel" auto-complete="off" disabled style="width: 185px;">
              </el-input>
              <el-button size="mini" type="primary">上传</el-button>
              <div slot="tip" class="el-upload__tip">格式：<span style="color:#F56C6C">EXCEL</span>&nbsp;&nbsp;&nbsp;&nbsp;大小：3MB</div>
            </el-upload>
          </el-form-item>
        </el-col>
      </el-row>
      <!--SI 模板 PDF-->
      <el-row v-show="billTemplate">
        <el-col class="elementWidth">
          <el-form-item label="" label-width="55px">
            <el-upload class="el-form-item__content3" :action="actionPath" :accept="accept3" :data="uptoken" :before-upload="beforeAvatarUploadChSi" :on-remove="handleRemoveChangeChSi" :on-success="handleSuccessChangeChSi" :auto-upload="true" :show-file-list="false">
              <span>SI账单模板(中文)</span>
              <el-input v-model="ruleForm.chBillTemplateSi" auto-complete="off" disabled style="width: 190px;">
              </el-input>
              <el-button size="mini" type="primary">上传</el-button>
              <div slot="tip" class="el-upload__tip">格式：<span style="color:#409EFF">PDF</span>&nbsp;&nbsp;&nbsp;&nbsp;&emsp;&nbsp;大小：3MB</div>
            </el-upload>
          </el-form-item>
        </el-col>
        <el-col class="elementWidth">
          <el-form-item label="" label-width="32px">
            <el-upload class="el-form-item__content3" :action="actionPath" :accept="accept3" :data="uptoken" :before-upload="beforeAvatarUploadEnSi" :on-remove="handleRemoveChangeEnSi" :on-success="handleSuccessChangeEnSi" :auto-upload="true" :show-file-list="false">
              <span>SI账单模板(英文)</span>
              <el-input v-model="ruleForm.enBillTemplateSi" auto-complete="off" disabled style="width: 190px;">
              </el-input>
              <el-button size="mini" type="primary">上传</el-button>
              <div slot="tip" class="el-upload__tip">格式：<span style="color:#409EFF">PDF</span>&nbsp;&nbsp;&nbsp;&nbsp;&emsp;&nbsp;大小：3MB</div>
            </el-upload>
          </el-form-item>
        </el-col>
      </el-row>

      <!--SI 模板 Excel-->
      <el-row v-show="billTemplate">
        <el-col class="elementWidth">
          <el-form-item label="" label-width="55px">
            <el-upload class="el-form-item__content3" :action="actionPath" :accept="acceptExcel" :data="uptoken" :before-upload="beforeAvatarUploadExcelChSi" :on-remove="handleRemoveChangeExcelChSi" :on-success="handleSuccessChangeExcelChSi" :auto-upload="true" :show-file-list="false">
              <span>SI账单模板(中文)</span>
              <el-input v-model="ruleForm.chBillTemplateSiExcel" auto-complete="off" disabled style="width: 190px;">
              </el-input>
              <el-button size="mini" type="primary">上传</el-button>
              <div slot="tip" class="el-upload__tip">格式：<span style="color:#F56C6C">EXCEL</span>&nbsp;&nbsp;&nbsp;&nbsp;大小：3MB</div>
            </el-upload>
          </el-form-item>
        </el-col>
        <el-col class="elementWidth">
          <el-form-item label="" label-width="32px">
            <el-upload class="el-form-item__content3" :action="actionPath" :accept="acceptExcel" :data="uptoken" :before-upload="beforeAvatarUploadExcelEnSi" :on-remove="handleRemoveChangeExcelEnSi" :on-success="handleSuccessChangeExcelEnSi" :auto-upload="true" :show-file-list="false">
              <span>SI账单模板(英文)</span>
              <el-input v-model="ruleForm.enBillTemplateSiExcel" auto-complete="off" disabled style="width: 190px;">
              </el-input>
              <el-button size="mini" type="primary">上传</el-button>
              <div slot="tip" class="el-upload__tip">格式：<span style="color:#F56C6C">EXCEL</span>&nbsp;&nbsp;&nbsp;&nbsp;大小：3MB</div>
            </el-upload>
          </el-form-item>
        </el-col>
      </el-row>

      <!--TE 模板 PDF-->
      <el-row v-show="billTemplate">
        <el-col class="elementWidth">
          <el-form-item label="" label-width="55px">
            <el-upload class="el-form-item__content3" :action="actionPath" :accept="accept3" :data="uptoken" :before-upload="beforeAvatarUploadChTe" :on-remove="handleRemoveChangeChTe" :on-success="handleSuccessChangeChTe" :auto-upload="true" :show-file-list="false">
              <span>TE账单模板(中文)</span>
              <el-input v-model="ruleForm.chBillTemplateTe" auto-complete="off" disabled style="width: 185px;">
              </el-input>
              <el-button size="mini" type="primary">上传</el-button>
              <div slot="tip" class="el-upload__tip">格式：<span style="color:#409EFF">PDF</span>&nbsp;&nbsp;&nbsp;&nbsp;&emsp;&nbsp;大小：3MB</div>
            </el-upload>
          </el-form-item>
        </el-col>
        <el-col class="elementWidth">
          <el-form-item label="" label-width="32px">
            <el-upload class="el-form-item__content3" :action="actionPath" :accept="accept3" :data="uptoken" :before-upload="beforeAvatarUploadEnTe" :on-remove="handleRemoveChangeEnTe" :on-success="handleSuccessChangeEnTe" :auto-upload="true" :show-file-list="false">
              <span>TE账单模板(英文)</span>
              <el-input v-model="ruleForm.enBillTemplateTe" auto-complete="off" disabled style="width: 185px;">
              </el-input>
              <el-button size="mini" type="primary">上传</el-button>
              <div slot="tip" class="el-upload__tip">格式：<span style="color:#409EFF">PDF</span>&nbsp;&nbsp;&nbsp;&nbsp;&emsp;&nbsp;大小：3MB</div>
            </el-upload>
          </el-form-item>
        </el-col>
      </el-row>

      <!--TE 模板 EXCEL-->
      <el-row v-show="billTemplate">
        <el-col class="elementWidth">
          <el-form-item label="" label-width="55px">
            <el-upload class="el-form-item__content3" :action="actionPath" :accept="acceptExcel" :data="uptoken" :before-upload="beforeAvatarUploadExcelChTe" :on-remove="handleRemoveChangeExcelChTe" :on-success="handleSuccessChangeExcelChTe" :auto-upload="true" :show-file-list="false">
              <span>TE账单模板(中文)</span>
              <el-input v-model="ruleForm.chBillTemplateTeExcel" auto-complete="off" disabled style="width: 185px;">
              </el-input>
              <el-button size="mini" type="primary">上传</el-button>
              <div slot="tip" class="el-upload__tip">格式：<span style="color:#F56C6C">EXCEL</span>&nbsp;&nbsp;&nbsp;&nbsp;大小：3MB</div>
            </el-upload>
          </el-form-item>
        </el-col>
        <el-col class="elementWidth">
          <el-form-item label="" label-width="32px">
            <el-upload class="el-form-item__content3" :action="actionPath" :accept="acceptExcel" :data="uptoken" :before-upload="beforeAvatarUploadExcelEnTe" :on-remove="handleRemoveChangeExcelEnTe" :on-success="handleSuccessChangeExcelEnTe" :auto-upload="true" :show-file-list="false">
              <span>TE账单模板(英文)</span>
              <el-input v-model="ruleForm.enBillTemplateTeExcel" auto-complete="off" disabled style="width: 185px;">
              </el-input>
              <el-button size="mini" type="primary">上传</el-button>
              <div slot="tip" class="el-upload__tip">格式：<span style="color:#F56C6C">EXCEL</span>&nbsp;&nbsp;&nbsp;&nbsp;大小：3MB</div>
            </el-upload>
          </el-form-item>
        </el-col>
      </el-row>
      <!--TI 模板 PDF-->
      <el-row v-show="billTemplate">
        <el-col class="elementWidth">
          <el-form-item label="" label-width="55px">
            <el-upload class="el-form-item__content3" :action="actionPath" :accept="accept3" :data="uptoken" :before-upload="beforeAvatarUploadChTi" :on-remove="handleRemoveChangeChTi" :on-success="handleSuccessChangeChTi" :auto-upload="true" :show-file-list="false">
              <span>TI账单模板(中文)</span>
              <el-input v-model="ruleForm.chBillTemplateTi" auto-complete="off" disabled style="width: 190px;">
              </el-input>
              <el-button size="mini" type="primary">上传</el-button>
              <div slot="tip" class="el-upload__tip">格式：<span style="color:#409EFF">PDF</span>&nbsp;&nbsp;&nbsp;&nbsp;&emsp;&nbsp;大小：3MB</div>
            </el-upload>
          </el-form-item>
        </el-col>
        <el-col class="elementWidth">
          <el-form-item label="" label-width="32px">
            <el-upload class="el-form-item__content3" :action="actionPath" :accept="accept3" :data="uptoken" :before-upload="beforeAvatarUploadEnTi" :on-remove="handleRemoveChangeEnTi" :on-success="handleSuccessChangeEnTi" :auto-upload="true" :show-file-list="false">
              <span>TI账单模板(英文)</span>
              <el-input v-model="ruleForm.enBillTemplateTi" auto-complete="off" disabled style="width: 190px;">
              </el-input>
              <el-button size="mini" type="primary">上传</el-button>
              <div slot="tip" class="el-upload__tip">格式：<span style="color:#409EFF">PDF</span>&nbsp;&nbsp;&nbsp;&nbsp;&emsp;&nbsp;大小：3MB</div>
            </el-upload>
          </el-form-item>
        </el-col>
      </el-row>

      <!--TI 模板 EXCEL-->
      <el-row v-show="billTemplate">
        <el-col class="elementWidth">
          <el-form-item label="" label-width="55px">
            <el-upload class="el-form-item__content3" :action="actionPath" :accept="acceptExcel" :data="uptoken" :before-upload="beforeAvatarUploadExcelChTi" :on-remove="handleRemoveChangeExcelChTi" :on-success="handleSuccessChangeExcelChTi" :auto-upload="true" :show-file-list="false">
              <span>TI账单模板(中文)</span>
              <el-input v-model="ruleForm.chBillTemplateTiExcel" auto-complete="off" disabled style="width: 190px;">
              </el-input>
              <el-button size="mini" type="primary">上传</el-button>
              <div slot="tip" class="el-upload__tip">格式：<span style="color:#F56C6C">EXCEL</span>&nbsp;&nbsp;&nbsp;&nbsp;大小：3MB</div>
            </el-upload>
          </el-form-item>
        </el-col>
        <el-col class="elementWidth">
          <el-form-item label="" label-width="32px">
            <el-upload class="el-form-item__content3" :action="actionPath" :accept="acceptExcel" :data="uptoken" :before-upload="beforeAvatarUploadExcelEnTi" :on-remove="handleRemoveChangeExcelEnTi" :on-success="handleSuccessChangeExcelEnTi" :auto-upload="true" :show-file-list="false">
              <span>TI账单模板(英文)</span>
              <el-input v-model="ruleForm.enBillTemplateTiExcel" auto-complete="off" disabled style="width: 190px;">
              </el-input>
              <el-button size="mini" type="primary">上传</el-button>
              <div slot="tip" class="el-upload__tip">格式：<span style="color:#F56C6C">EXCEL</span>&nbsp;&nbsp;&nbsp;&nbsp;大小：3MB</div>
            </el-upload>
          </el-form-item>
        </el-col>
      </el-row>

      <!--LC 模板 PDF-->
      <el-row v-show="billTemplate">
        <el-col class="elementWidth">
          <el-form-item label="" label-width="55px">
            <el-upload class="el-form-item__content3" :action="actionPath" :accept="accept3" :data="uptoken" :before-upload="beforeAvatarUploadChLc" :on-remove="handleRemoveChangeChLc" :on-success="handleSuccessChangeChLc" :auto-upload="true" :show-file-list="false">
              <span>LC账单模板(中文)</span>
              <el-input v-model="ruleForm.chBillTemplateLc" auto-complete="off" disabled style="width: 185px;">
              </el-input>
              <el-button size="mini" type="primary">上传</el-button>
              <div slot="tip" class="el-upload__tip">格式：<span style="color:#409EFF">PDF</span>&nbsp;&nbsp;&nbsp;&nbsp;&emsp;&nbsp;大小：3MB</div>
            </el-upload>
          </el-form-item>
        </el-col>
        <el-col class="elementWidth">
          <el-form-item label="" label-width="32px">
            <el-upload class="el-form-item__content3" :action="actionPath" :accept="accept3" :data="uptoken" :before-upload="beforeAvatarUploadEnLc" :on-remove="handleRemoveChangeEnLc" :on-success="handleSuccessChangeEnLc" :auto-upload="true" :show-file-list="false">
              <span>LC账单模板(英文)</span>
              <el-input v-model="ruleForm.enBillTemplateLc" auto-complete="off" disabled style="width: 185px;">
              </el-input>
              <el-button size="mini" type="primary">上传</el-button>
              <div slot="tip" class="el-upload__tip">格式：<span style="color:#409EFF">PDF</span>&nbsp;&nbsp;&nbsp;&nbsp;&emsp;&nbsp;大小：3MB</div>
            </el-upload>
          </el-form-item>
        </el-col>
      </el-row>

      <!--LC 模板 EXCEL-->
      <el-row v-show="billTemplate">
        <el-col class="elementWidth">
          <el-form-item label="" label-width="55px">
            <el-upload class="el-form-item__content3" :action="actionPath" :accept="acceptExcel" :data="uptoken" :before-upload="beforeAvatarUploadExcelChLc" :on-remove="handleRemoveChangeExcelChLc" :on-success="handleSuccessChangeExcelChLc" :auto-upload="true" :show-file-list="false">
              <span>LC账单模板(中文)</span>
              <el-input v-model="ruleForm.chBillTemplateLcExcel" auto-complete="off" disabled style="width: 185px;">
              </el-input>
              <el-button size="mini" type="primary">上传</el-button>
              <div slot="tip" class="el-upload__tip">格式：<span style="color:#F56C6C">EXCEL</span>&nbsp;&nbsp;&nbsp;&nbsp;大小：3MB</div>
            </el-upload>
          </el-form-item>
        </el-col>
        <el-col class="elementWidth">
          <el-form-item label="" label-width="32px">
            <el-upload class="el-form-item__content3" :action="actionPath" :accept="acceptExcel" :data="uptoken" :before-upload="beforeAvatarUploadExcelEnLc" :on-remove="handleRemoveChangeExcelEnLc" :on-success="handleSuccessChangeExcelEnLc" :auto-upload="true" :show-file-list="false">
              <span>LC账单模板(英文)</span>
              <el-input v-model="ruleForm.enBillTemplateLcExcel" auto-complete="off" disabled style="width: 185px;">
              </el-input>
              <el-button size="mini" type="primary">上传</el-button>
              <div slot="tip" class="el-upload__tip">格式：<span style="color:#F56C6C">EXCEL</span>&nbsp;&nbsp;&nbsp;&nbsp;大小：3MB</div>
            </el-upload>
          </el-form-item>
        </el-col>
      </el-row>

      <!--IO 模板 PDF-->
      <el-row v-show="billTemplate">
        <el-col class="elementWidth">
          <el-form-item label="" label-width="55px">
            <el-upload class="el-form-item__content3" :action="actionPath" :accept="accept3" :data="uptoken" :before-upload="beforeAvatarUploadChIo" :on-remove="handleRemoveChangeChIo" :on-success="handleSuccessChangeChIo" :auto-upload="true" :show-file-list="false">
              <span>IO账单模板(中文)</span>
              <el-input v-model="ruleForm.chBillTemplateIo" auto-complete="off" disabled style="width: 190px;">
              </el-input>
              <el-button size="mini" type="primary">上传</el-button>
              <div slot="tip" class="el-upload__tip">格式：<span style="color:#409EFF">PDF</span>&nbsp;&nbsp;&nbsp;&nbsp;&emsp;&nbsp;大小：3MB</div>
            </el-upload>
          </el-form-item>
        </el-col>
        <el-col class="elementWidth">
          <el-form-item label="" label-width="32px">
            <el-upload class="el-form-item__content3" :action="actionPath" :accept="accept3" :data="uptoken" :before-upload="beforeAvatarUploadEnIo" :on-remove="handleRemoveChangeEnIo" :on-success="handleSuccessChangeEnIo" :auto-upload="true" :show-file-list="false">
              <span>IO账单模板(英文)</span>
              <el-input v-model="ruleForm.enBillTemplateIo" auto-complete="off" disabled style="width: 190px;">
              </el-input>
              <el-button size="mini" type="primary">上传</el-button>
              <div slot="tip" class="el-upload__tip">格式：<span style="color:#409EFF">PDF</span>&nbsp;&nbsp;&nbsp;&nbsp;&emsp;&nbsp;大小：3MB</div>
            </el-upload>
          </el-form-item>
        </el-col>
      </el-row>

      <!--IO 模板 EXCEL-->
      <el-row v-show="billTemplate">
        <el-col class="elementWidth">
          <el-form-item label="" label-width="55px">
            <el-upload class="el-form-item__content3" :action="actionPath" :accept="acceptExcel" :data="uptoken" :before-upload="beforeAvatarUploadExcelChIo" :on-remove="handleRemoveChangeExcelChIo" :on-success="handleSuccessChangeExcelChIo" :auto-upload="true" :show-file-list="false">
              <span>IO账单模板(中文)</span>
              <el-input v-model="ruleForm.chBillTemplateIoExcel" auto-complete="off" disabled style="width: 190px;">
              </el-input>
              <el-button size="mini" type="primary">上传</el-button>
              <div slot="tip" class="el-upload__tip">格式：<span style="color:#F56C6C">EXCEL</span>&nbsp;&nbsp;&nbsp;&nbsp;大小：3MB</div>
            </el-upload>
          </el-form-item>
        </el-col>
        <el-col class="elementWidth">
          <el-form-item label="" label-width="32px">
            <el-upload class="el-form-item__content3" :action="actionPath" :accept="acceptExcel" :data="uptoken" :before-upload="beforeAvatarUploadExcelEnIo" :on-remove="handleRemoveChangeExcelEnIo" :on-success="handleSuccessChangeExcelEnIo" :auto-upload="true" :show-file-list="false">
              <span>IO账单模板(英文)</span>
              <el-input v-model="ruleForm.enBillTemplateIoExcel" auto-complete="off" disabled style="width: 190px;">
              </el-input>
              <el-button size="mini" type="primary">上传</el-button>
              <div slot="tip" class="el-upload__tip">格式：<span style="color:#F56C6C">EXCEL</span>&nbsp;&nbsp;&nbsp;&nbsp;大小：3MB</div>
            </el-upload>
          </el-form-item>
        </el-col>
      </el-row>

      <HR color="#eee" size="5" style="margin-top: 10px;">
      </HR>
      <span>清单模板</span>
      <el-button type="text" size="small" v-if="inventoryTemplate" v-on:click="inventoryTemplate=false">收起</el-button>
      <el-button type="text" size="small" v-if="!inventoryTemplate" v-on:click="inventoryTemplate=true">展开</el-button>
      <el-row v-show="inventoryTemplate">
        <el-col class="elementWidth">
          <el-form-item label="" label-width="55px">
            <el-upload class="el-form-item__content3" :action="actionPath" :accept="acceptExcel" :data="uptoken" :before-upload="beforeAvatarUploadExcelChAeSt" :on-remove="handleRemoveChangeExcelChAeSt" :on-success="handleSuccessChangeExcelChAeSt" :auto-upload="true" :show-file-list="false">
              <span>AE清单模板(中文)</span>
              <el-input v-model="ruleForm.statementTemplateAeExcelCn" auto-complete="off" disabled style="width: 185px;">
              </el-input>
              <el-button size="mini" type="primary">上传</el-button>
              <div slot="tip" class="el-upload__tip">格式：<span style="color:#F56C6C">EXCEL</span>&nbsp;&nbsp;&nbsp;&nbsp;大小：3MB</div>
            </el-upload>
          </el-form-item>
        </el-col>
        <el-col class="elementWidth">
          <el-form-item label="" label-width="32px">
            <el-upload class="el-form-item__content3" :action="actionPath" :accept="acceptExcel" :data="uptoken" :before-upload="beforeAvatarUploadExcelEnAeSt" :on-remove="handleRemoveChangeExcelEnAeSt" :on-success="handleSuccessChangeExcelEnAeSt" :auto-upload="true" :show-file-list="false">
              <span>AE清单模板(英文)</span>
              <el-input v-model="ruleForm.statementTemplateAeExcelEn" auto-complete="off" disabled style="width: 185px;">
              </el-input>
              <el-button size="mini" type="primary">上传</el-button>
              <div slot="tip" class="el-upload__tip">格式：<span style="color:#F56C6C">EXCEL</span>&nbsp;&nbsp;&nbsp;&nbsp;大小：3MB</div>
            </el-upload>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row v-show="inventoryTemplate">
        <el-col class="elementWidth">
          <el-form-item label="" label-width="55px">
            <el-upload class="el-form-item__content3" :action="actionPath" :accept="acceptExcel" :data="uptoken" :before-upload="beforeAvatarUploadExcelChAiSt" :on-remove="handleRemoveChangeExcelChAiSt" :on-success="handleSuccessChangeExcelChAiSt" :auto-upload="true" :show-file-list="false">
              <span>AI清单模板(中文)</span>
              <el-input v-model="ruleForm.statementTemplateAiExcelCn" auto-complete="off" disabled style="width: 190px;">
              </el-input>
              <el-button size="mini" type="primary">上传</el-button>
              <div slot="tip" class="el-upload__tip">格式：<span style="color:#F56C6C">EXCEL</span>&nbsp;&nbsp;&nbsp;&nbsp;大小：3MB</div>
            </el-upload>
          </el-form-item>
        </el-col>
        <el-col class="elementWidth">
          <el-form-item label="" label-width="32px">
            <el-upload class="el-form-item__content3" :action="actionPath" :accept="acceptExcel" :data="uptoken" :before-upload="beforeAvatarUploadExcelEnAiSt" :on-remove="handleRemoveChangeExcelEnAiSt" :on-success="handleSuccessChangeExcelEnAiSt" :auto-upload="true" :show-file-list="false">
              <span>AI清单模板(英文)</span>
              <el-input v-model="ruleForm.statementTemplateAiExcelEn" auto-complete="off" disabled style="width: 190px;">
              </el-input>
              <el-button size="mini" type="primary">上传</el-button>
              <div slot="tip" class="el-upload__tip">格式：<span style="color:#F56C6C">EXCEL</span>&nbsp;&nbsp;&nbsp;&nbsp;大小：3MB</div>
            </el-upload>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row v-show="inventoryTemplate">
        <el-col class="elementWidth">
          <el-form-item label="" label-width="55px">
            <el-upload class="el-form-item__content3" :action="actionPath" :accept="acceptExcel" :data="uptoken" :before-upload="beforeAvatarUploadExcelChSeSt" :on-remove="handleRemoveChangeExcelChSeSt" :on-success="handleSuccessChangeExcelChSeSt" :auto-upload="true" :show-file-list="false">
              <span>SE清单模板(中文)</span>
              <el-input v-model="ruleForm.statementTemplateSeExcelCn" auto-complete="off" disabled style="width: 185px;">
              </el-input>
              <el-button size="mini" type="primary">上传</el-button>
              <div slot="tip" class="el-upload__tip">格式：<span style="color:#F56C6C">EXCEL</span>&nbsp;&nbsp;&nbsp;&nbsp;大小：3MB</div>
            </el-upload>
          </el-form-item>
        </el-col>
        <el-col class="elementWidth">
          <el-form-item label="" label-width="32px">
            <el-upload class="el-form-item__content3" :action="actionPath" :accept="acceptExcel" :data="uptoken" :before-upload="beforeAvatarUploadExcelEnSeSt" :on-remove="handleRemoveChangeExcelEnSeSt" :on-success="handleSuccessChangeExcelEnSeSt" :auto-upload="true" :show-file-list="false">
              <span>SE清单模板(英文)</span>
              <el-input v-model="ruleForm.statementTemplateSeExcelEn" auto-complete="off" disabled style="width: 185px;">
              </el-input>
              <el-button size="mini" type="primary">上传</el-button>
              <div slot="tip" class="el-upload__tip">格式：<span style="color:#F56C6C">EXCEL</span>&nbsp;&nbsp;&nbsp;&nbsp;大小：3MB</div>
            </el-upload>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row v-show="inventoryTemplate">
        <el-col class="elementWidth">
          <el-form-item label="" label-width="55px">
            <el-upload class="el-form-item__content3" :action="actionPath" :accept="acceptExcel" :data="uptoken" :before-upload="beforeAvatarUploadExcelChSiSt" :on-remove="handleRemoveChangeExcelChSiSt" :on-success="handleSuccessChangeExcelChSiSt" :auto-upload="true" :show-file-list="false">
              <span>SI清单模板(中文)</span>
              <el-input v-model="ruleForm.statementTemplateSiExcelCn" auto-complete="off" disabled style="width: 190px;">
              </el-input>
              <el-button size="mini" type="primary">上传</el-button>
              <div slot="tip" class="el-upload__tip">格式：<span style="color:#F56C6C">EXCEL</span>&nbsp;&nbsp;&nbsp;&nbsp;大小：3MB</div>
            </el-upload>
          </el-form-item>
        </el-col>
        <el-col class="elementWidth">
          <el-form-item label="" label-width="32px">
            <el-upload class="el-form-item__content3" :action="actionPath" :accept="acceptExcel" :data="uptoken" :before-upload="beforeAvatarUploadExcelEnSiSt" :on-remove="handleRemoveChangeExcelEnSiSt" :on-success="handleSuccessChangeExcelEnSiSt" :auto-upload="true" :show-file-list="false">
              <span>SI清单模板(英文)</span>
              <el-input v-model="ruleForm.statementTemplateSiExcelEn" auto-complete="off" disabled style="width: 190px;">
              </el-input>
              <el-button size="mini" type="primary">上传</el-button>
              <div slot="tip" class="el-upload__tip">格式：<span style="color:#F56C6C">EXCEL</span>&nbsp;&nbsp;&nbsp;&nbsp;大小：3MB</div>
            </el-upload>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row v-show="inventoryTemplate">
        <el-col class="elementWidth">
          <el-form-item label="" label-width="55px">
            <el-upload class="el-form-item__content3" :action="actionPath" :accept="acceptExcel" :data="uptoken" :before-upload="beforeAvatarUploadExcelChTeSt" :on-remove="handleRemoveChangeExcelChTeSt" :on-success="handleSuccessChangeExcelChTeSt" :auto-upload="true" :show-file-list="false">
              <span>TE清单模板(中文)</span>
              <el-input v-model="ruleForm.statementTemplateTeExcelCn" auto-complete="off" disabled style="width: 185px;">
              </el-input>
              <el-button size="mini" type="primary">上传</el-button>
              <div slot="tip" class="el-upload__tip">格式：<span style="color:#F56C6C">EXCEL</span>&nbsp;&nbsp;&nbsp;&nbsp;大小：3MB</div>
            </el-upload>
          </el-form-item>
        </el-col>
        <el-col class="elementWidth">
          <el-form-item label="" label-width="32px">
            <el-upload class="el-form-item__content3" :action="actionPath" :accept="acceptExcel" :data="uptoken" :before-upload="beforeAvatarUploadExcelEnTeSt" :on-remove="handleRemoveChangeExcelEnTeSt" :on-success="handleSuccessChangeExcelEnTeSt" :auto-upload="true" :show-file-list="false">
              <span>TE清单模板(英文)</span>
              <el-input v-model="ruleForm.statementTemplateTeExcelEn" auto-complete="off" disabled style="width: 185px;">
              </el-input>
              <el-button size="mini" type="primary">上传</el-button>
              <div slot="tip" class="el-upload__tip">格式：<span style="color:#F56C6C">EXCEL</span>&nbsp;&nbsp;&nbsp;&nbsp;大小：3MB</div>
            </el-upload>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row v-show="inventoryTemplate">
        <el-col class="elementWidth">
          <el-form-item label="" label-width="55px">
            <el-upload class="el-form-item__content3" :action="actionPath" :accept="acceptExcel" :data="uptoken" :before-upload="beforeAvatarUploadExcelChTiSt" :on-remove="handleRemoveChangeExcelChTiSt" :on-success="handleSuccessChangeExcelChTiSt" :auto-upload="true" :show-file-list="false">
              <span>TI清单模板(中文)</span>
              <el-input v-model="ruleForm.statementTemplateTiExcelCn" auto-complete="off" disabled style="width: 190px;">
              </el-input>
              <el-button size="mini" type="primary">上传</el-button>
              <div slot="tip" class="el-upload__tip">格式：<span style="color:#F56C6C">EXCEL</span>&nbsp;&nbsp;&nbsp;&nbsp;大小：3MB</div>
            </el-upload>
          </el-form-item>
        </el-col>
        <el-col class="elementWidth">
          <el-form-item label="" label-width="32px">
            <el-upload class="el-form-item__content3" :action="actionPath" :accept="acceptExcel" :data="uptoken" :before-upload="beforeAvatarUploadExcelEnTiSt" :on-remove="handleRemoveChangeExcelEnTiSt" :on-success="handleSuccessChangeExcelEnTiSt" :auto-upload="true" :show-file-list="false">
              <span>TI清单模板(英文)</span>
              <el-input v-model="ruleForm.statementTemplateTiExcelEn" auto-complete="off" disabled style="width: 190px;">
              </el-input>
              <el-button size="mini" type="primary">上传</el-button>
              <div slot="tip" class="el-upload__tip">格式：<span style="color:#F56C6C">EXCEL</span>&nbsp;&nbsp;&nbsp;&nbsp;大小：3MB</div>
            </el-upload>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row v-show="inventoryTemplate">
        <el-col class="elementWidth">
          <el-form-item label="" label-width="55px">
            <el-upload class="el-form-item__content3" :action="actionPath" :accept="acceptExcel" :data="uptoken" :before-upload="beforeAvatarUploadExcelChLcSt" :on-remove="handleRemoveChangeExcelChLcSt" :on-success="handleSuccessChangeExcelChLcSt" :auto-upload="true" :show-file-list="false">
              <span>LC清单模板(中文)</span>
              <el-input v-model="ruleForm.statementTemplateLcExcelCn" auto-complete="off" disabled style="width: 185px;">
              </el-input>
              <el-button size="mini" type="primary">上传</el-button>
              <div slot="tip" class="el-upload__tip">格式：<span style="color:#F56C6C">EXCEL</span>&nbsp;&nbsp;&nbsp;&nbsp;大小：3MB</div>
            </el-upload>
          </el-form-item>
        </el-col>
        <el-col class="elementWidth">
          <el-form-item label="" label-width="32px">
            <el-upload class="el-form-item__content3" :action="actionPath" :accept="acceptExcel" :data="uptoken" :before-upload="beforeAvatarUploadExcelEnLcSt" :on-remove="handleRemoveChangeExcelEnLcSt" :on-success="handleSuccessChangeExcelEnLcSt" :auto-upload="true" :show-file-list="false">
              <span>LC清单模板(英文)</span>
              <el-input v-model="ruleForm.statementTemplateLcExcelEn" auto-complete="off" disabled style="width: 185px;">
              </el-input>
              <el-button size="mini" type="primary">上传</el-button>
              <div slot="tip" class="el-upload__tip">格式：<span style="color:#F56C6C">EXCEL</span>&nbsp;&nbsp;&nbsp;&nbsp;大小：3MB</div>
            </el-upload>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row v-show="inventoryTemplate">
        <el-col class="elementWidth">
          <el-form-item label="" label-width="55px">
            <el-upload class="el-form-item__content3" :action="actionPath" :accept="acceptExcel" :data="uptoken" :before-upload="beforeAvatarUploadExcelChIoSt" :on-remove="handleRemoveChangeExcelChIoSt" :on-success="handleSuccessChangeExcelChIoSt" :auto-upload="true" :show-file-list="false">
              <span>IO清单模板(中文)</span>
              <el-input v-model="ruleForm.statementTemplateIoExcelCn" auto-complete="off" disabled style="width: 190px;">
              </el-input>
              <el-button size="mini" type="primary">上传</el-button>
              <div slot="tip" class="el-upload__tip">格式：<span style="color:#F56C6C">EXCEL</span>&nbsp;&nbsp;&nbsp;&nbsp;大小：3MB</div>
            </el-upload>
          </el-form-item>
        </el-col>
        <el-col class="elementWidth">
          <el-form-item label="" label-width="32px">
            <el-upload class="el-form-item__content3" :action="actionPath" :accept="acceptExcel" :data="uptoken" :before-upload="beforeAvatarUploadExcelEnIoSt" :on-remove="handleRemoveChangeExcelEnIoSt" :on-success="handleSuccessChangeExcelEnIoSt" :auto-upload="true" :show-file-list="false">
              <span>IO清单模板(英文)</span>
              <el-input v-model="ruleForm.statementTemplateIoExcelEn" auto-complete="off" disabled style="width: 187px;">
              </el-input>
              <el-button size="mini" type="primary">上传</el-button>
              <div slot="tip" class="el-upload__tip">格式：<span style="color:#F56C6C">EXCEL</span>&nbsp;&nbsp;&nbsp;&nbsp;大小：3MB</div>
            </el-upload>
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
			}
		},
		data() {
			return {
				ruleForm: {
					orgCode: '',
					orgName: '',
					shortName: '',
					orgEname: '',
					shortEname: '',
					socialCreditCode: '',
					orgLogo: '',
					shortLogo: '',
					chBillTemplate: '',
					enBillTemplate: '',
					chListTemplate: '',
					enListTemplate: '',
          chBillTemplateExcel: '',
          enBillTemplateExcel: '',
					chBillTemplateAiExcel: '',
					enBillTemplateAiExcel: '',
					chBillTemplateSeExcel: '',
					enBillTemplateSeExcel: '',
					chBillTemplateSiExcel: '',
					enBillTemplateSiExcel: '',
					chBillTemplateTeExcel: '',
					enBillTemplateTeExcel: '',
					chBillTemplateTiExcel: '',
					enBillTemplateTiExcel: '',
          chBillTemplateLcExcel: '',
          enBillTemplateLcExcel: '',
          chBillTemplateIoExcel: '',
          enBillTemplateIoExcel: '',
          statementTemplateAeExcelCn: '',
          statementTemplateAeExcelEn: '',
            statementTemplateAiExcelCn: '',
            statementTemplateAiExcelEn: '',
            statementTemplateSeExcelCn: '',
            statementTemplateSeExcelEn: '',
            statementTemplateSiExcelCn: '',
            statementTemplateSiExcelEn: '',
            statementTemplateTeExcelCn: '',
            statementTemplateTeExcelEn: '',
            statementTemplateTiExcelCn: '',
            statementTemplateTiExcelEn: '',
            statementTemplateLcExcelCn: '',
            statementTemplateLcExcelEn: '',
            statementTemplateIoExcelCn: '',
            statementTemplateIoExcelEn: '',
          chBillTemplateAi: '',
          enBillTemplateAi: '',
          chBillTemplateSe: '',
          enBillTemplateSe: '',
          chBillTemplateSi: '',
          enBillTemplateSi: '',
          chBillTemplateTe: '',
          enBillTemplateTe: '',
          chBillTemplateTi: '',
          enBillTemplateTi: '',
          chBillTemplateLc: '',
          enBillTemplateLc: '',
          chBillTemplateIo: '',
          enBillTemplateIo: '',
					adminInternationalCountryCode: '',
					adminId: '',
					adminName: '',
					adminEmail: '',
					adminTel: '',
					rcEmail: '',
					orgStatus: true,
					stopDate: '',
					orgSeal: '',
					oneStopCode: '',
					orgType: '1',
					orgEditionId: '',
					orgUserCount: '',
					coopId: '',
					demandPersonId: '',
					orgRemark: ''

				},
				pickerOptions0: {
					disabledDate(time) {
						return time.getTime() < Date.now() - 8.64e7; //如果没有后面的-8.64e7就是不可以选择今天的
					}
				},
				actionPath: 'http://up-z1.qiniu.com',
				accept: "image/jpeg,image/gif,image/png,image/bmp",
				formData: {
					smallModelPhoto: [],
				},
				uptoken: {
					token: '',
					key: ""
				},
				formData2: {
					smallModelPhoto: [],
				},
				accept3: ".pdf",
        acceptExcel:".xls,.xlsx",
				formData3: {
					smallModelPhoto: [],
				},
				formData4: {
					smallModelPhoto: [],
				},
				formData5: {
					smallModelPhoto: [],
				},
				formData6: {
					smallModelPhoto: [],
				},
				formDataChAi: {
					smallModelPhoto: [],
				},
				formDataEnAi: {
					smallModelPhoto: [],
				},
				formDataChSe: {
					smallModelPhoto: [],
				},
				formDataEnSe: {
					smallModelPhoto: [],
				},
				formDataChSi: {
					smallModelPhoto: [],
				},
				formDataEnSi: {
					smallModelPhoto: [],
				},
				formDataChTe: {
					smallModelPhoto: [],
				},
				formDataEnTe: {
					smallModelPhoto: [],
				},
				formDataChTi: {
					smallModelPhoto: [],
				},
				formDataEnTi: {
					smallModelPhoto: [],
				},
        formDataChLc: {
            smallModelPhoto: [],
        },
        formDataEnLc: {
            smallModelPhoto: [],
        },
        formDataChIo: {
            smallModelPhoto: [],
        },
        formDataEnIo: {
            smallModelPhoto: [],
        },
        formDataExcelChAE: {
        	smallModelPhoto: [],
        },
        formDataExcelEnAE: {
        	smallModelPhoto: [],
        },
        formDataChAiExcel: {
        	smallModelPhoto: [],
        },
        formDataEnAiExcel: {
        	smallModelPhoto: [],
        },
        formDataChSeExcel: {
        	smallModelPhoto: [],
        },
        formDataEnSeExcel: {
        	smallModelPhoto: [],
        },
        formDataChSiExcel: {
        	smallModelPhoto: [],
        },
        formDataEnSiExcel: {
        	smallModelPhoto: [],
        },
        formDataChTeExcel: {
        	smallModelPhoto: [],
        },
        formDataEnTeExcel: {
        	smallModelPhoto: [],
        },
        formDataChTiExcel: {
        	smallModelPhoto: [],
        },
        formDataEnTiExcel: {
        	smallModelPhoto: [],
        },
        formDataChLcExcel: {
            smallModelPhoto: [],
        },
        formDataEnLcExcel: {
            smallModelPhoto: [],
        },
        formDataChIoExcel: {
            smallModelPhoto: [],
        },
        formDataEnIoExcel: {
            smallModelPhoto: [],
        },
          formDataChAeExcelSt: {
              smallModelPhoto: [],
          },
          formDataEnAeExcelSt: {
              smallModelPhoto: [],
          },
          formDataChAiExcelSt: {
              smallModelPhoto: [],
          },
          formDataEnAiExcelSt: {
              smallModelPhoto: [],
          },
          formDataChSeExcelSt: {
              smallModelPhoto: [],
          },
          formDataEnSeExcelSt: {
              smallModelPhoto: [],
          },
          formDataChSiExcelSt: {
              smallModelPhoto: [],
          },
          formDataEnSiExcelSt: {
              smallModelPhoto: [],
          },
          formDataChTeExcelSt: {
              smallModelPhoto: [],
          },
          formDataEnTeExcelSt: {
              smallModelPhoto: [],
          },
          formDataChTiExcelSt: {
              smallModelPhoto: [],
          },
          formDataEnTiExcelSt: {
              smallModelPhoto: [],
          },
          formDataChLcExcelSt: {
              smallModelPhoto: [],
          },
          formDataEnLcExcelSt: {
              smallModelPhoto: [],
          },
          formDataChIoExcelSt: {
              smallModelPhoto: [],
          },
          formDataEnIoExcelSt: {
              smallModelPhoto: [],
          },
				options: [],
				orgEditions: [],
				internationalCountryCodes: [],
				orgSealUploadFileList: [],
				useroptions: [],
				attachment: false,
        billTemplate: false,
        inventoryTemplate: false,
				rules: {
					stopDate: [{
						required: true,
						message: '请选择失效时间',
						trigger: ['blur', 'change']
					}],
					//					orgCode: [{
					//							required: true,
					//							message: '请输入签约客户代码',
					//							trigger: ['blur', 'change']
					//						},
					//						{
					//							min: 6,
					//							max: 6,
					//							message: '长度为 6',
					//							trigger: ['blur', 'change']
					//						}
					//					],
					orgName: [{
							required: true,
							message: '请选择客商资料',
							trigger: ['blur', 'change']
						}
						// { min: 1, max: 80, message: '长度不超过 80', trigger: ['blur', 'change']  }
					],
					orgType: [{
							required: true,
							message: '请选择版本类型',
							trigger: ['blur', 'change']
						}
						// { min: 1, max: 80, message: '长度不超过 80', trigger: ['blur', 'change']  }
					],
					orgUserCount: [{
							required: true,
							message: '请输入用户数量',
							trigger: ['blur', 'change']
						}
						// { min: 1, max: 80, message: '长度不超过 80', trigger: ['blur', 'change']  }
					],
					coopId: [{
							required: true,
							message: '请选择客商资料',
							trigger: ['blur', 'change']
						}
						// { min: 1, max: 80, message: '长度不超过 80', trigger: ['blur', 'change']  }
					],
					shortName: [{
							required: true,
							message: '请输入中文简称',
							trigger: ['blur', 'change']
						},
						{
							min: 1,
							max: 40,
							message: '长度不超过 40',
							trigger: ['blur', 'change']
						}
					],
					orgEname: [{
							required: true,
							message: '请输入英文全称',
							trigger: ['blur', 'change']
						},
						{
							min: 1,
							max: 80,
							message: '长度不超过 80',
							trigger: ['blur', 'change']
						}
					],
					shortEname: [{
							required: true,
							message: '请输入英文简称',
							trigger: ['blur', 'change']
						},
						{
							min: 1,
							max: 40,
							message: '长度不超过 40',
							trigger: ['blur', 'change']
						}
					],
					socialCreditCode: [{
							required: true,
							message: '请输入社会信用代码',
							trigger: ['blur', 'change']
						},
						{
							min: 0,
							max: 20,
							message: '长度不超过 20',
							trigger: ['blur', 'change']
						}
					],
					//					orgLogo: [{
					//							required: true,
					//							message: '请上传签约客户大logo',
					//							trigger: ['blur', 'change']
					//						},
					//						{
					//							min: 0,
					//							max: 100,
					//							message: '长度不超过 100',
					//							trigger: ['blur', 'change']
					//						}
					//					],
					//					orgSeal: [{
					//							required: true,
					//							message: '请上传签约客户印章',
					//							trigger: ['blur', 'change']
					//						},
					//						{
					//							min: 0,
					//							max: 100,
					//							message: '长度不超过 100',
					//							trigger: ['blur', 'change']
					//						}
					//					],
					//					shortLogo: [{
					//							required: true,
					//							message: '请上传签约客户小logo',
					//							trigger: ['blur', 'change']
					//						},
					//						{
					//							min: 0,
					//							max: 100,
					//							message: '长度不超过 100',
					//							trigger: ['blur', 'change']
					//						}
					//					],
					adminName: [{
							required: true,
							message: '请输入签约客户管理员账户',
							trigger: ['blur', 'change']
						},
						{
							min: 1,
							max: 20,
							message: '不可超过 20',
							trigger: ['blur', 'change']
						}
					],
					demandPersonId: [{
						required: true,
						message: '请选择需求人',
						trigger: ['blur', 'change']
					}],
					adminEmail: [{
							required: true,
							message: '请输入签约公司管理邮箱',
							trigger: ['blur', 'change']
						},
						{
							type: 'email',
							message: '请输入正确的邮箱地址',
							trigger: ['blur', 'change']
						},
						{
							min: 0,
							max: 80,
							message: '长度不超过 80',
							trigger: ['blur', 'change']
						}
					],
					orgRemark: [{
						min: 0,
						max: 500,
						message: '长度不超过 500',
						trigger: ['blur', 'change']
					}],
					adminTel: [{
							required: true,
							message: '请输入签约公司管理员电话',
							trigger: ['blur']
						},
						{
							min: 0,
							max: 40,
							message: '长度不超过 40',
							trigger: ['blur', 'change']
						}
					],
					rcEmail: [{
							required: true,
							message: '请输入签约公司风控邮箱',
							trigger: ['blur', 'change']
						},
						{
							type: 'email',
							message: '请输入正确的邮箱地址',
							trigger: ['blur', 'change']
						},
						{
							min: 0,
							max: 80,
							message: '长度不超过 80',
							trigger: ['blur', 'change']
						}
					]
				}
			};
		},
		inject: ['queryList'],
		created() {
			this.$axios.post('/prm/coop/queryListForChoose')
				.then(function(response) {
					this.options = response.data.data.dataList;
				}.bind(this));
			this.$axios.get('/hrs/org/queryModelOrg')
				.then(function(response) {
					this.orgEditions = response.data.data;
					if (this.orgEditions != null && this.orgEditions.length > 0) {
						this.ruleForm.orgEditionId = this.orgEditions[0].orgId
						this.ruleForm.orgUserCount = this.orgEditions[0].orgUserCount
					}
				}.bind(this));

			//国际电话区域
			this.$axios.get('/hrs/org/listCategory/国际电话区号')
				.then(function(response) {
					this.internationalCountryCodes = response.data.data;
					if (this.internationalCountryCodes != null && this.internationalCountryCodes.length > 0) {
						this.ruleForm.adminInternationalCountryCode = this.internationalCountryCodes[0].edicode1;
					}
				}.bind(this));
			//ef 公司 有效员工
			this.$axios.get('/hrs/user/searchUserByOrg')
				.then(function(response) {
					this.useroptions = response.data.data;
				}.bind(this));
		},
		mounted: function() {
			this.$axios.get('/hrs/org/getUpToken')
				.then(function(response) {
					this.uptoken.token = response.data.data;
				}.bind(this));
		},
		methods: {
			setdemandersonName(vId) {
				let obj = {};
				obj = this.useroptions.find((item) => {
					return item.value === vId;
				});
				//this.ruleForm.salesName = obj.name;
			},
			changeOrgEditionId(val) {
				if (this.orgEditions != null && this.orgEditions.length > 0) {
					this.ruleForm.orgUserCount = this.orgEditions.find(org => org.orgId == val).orgUserCount
				}
			},
			//大logo
			beforeAvatarUpload(file) {
        let fileSealCheck = /[\u4e00-\u9fa5\s+]+/g;
        if(fileSealCheck.test(file.name)){
          this.openError("上传logo(大)名称不能带有中文及空格");
          return false
        }
				this.uptoken.key = "OrgLogo_" + new Date().getTime() + "_" + file.name;
				let _this = this
				const isSize = new Promise(function(resolve, reject) {
					let width = 400;
					let height = 100;
					let _URL = window.URL || window.webkitURL;
					let img = new Image();
					img.onload = function() {
						let valid = img.width === width && img.height === height;
						valid ? resolve() : reject();
					}
					img.src = _URL.createObjectURL(file);
				}).then(() => {
					return file;
				}, () => {
					_this.$message.error('大Logo尺寸限制为400 x 100')
					return Promise.reject();
				});
				return isSize;
			},
			handleRemoveChange(file, fileList) {
				var filelists = [];
				this.ruleForm.orgLogo = '';
				this.formData.smallModelPhoto = filelists;
			},
			handleSuccessChange(response, file, fileList) { //上传成功后在图片框显示图片
				this.$message.success('上传成功')
				this.ruleForm.orgLogo = "http://doc.yctop.com/" + response.key;
			},
			//小logo
			beforeAvatarUpload2(file) {

        let fileSealCheck = /[\u4e00-\u9fa5\s+]+/g;
        if(fileSealCheck.test(file.name)){
          this.openError("上传logo(小)名称不能带有中文及空格");
          return false
        }

				this.uptoken.key = "OrgShortLogo_" + new Date().getTime() + "_" + file.name;
				let _this = this
				const isSize = new Promise(function(resolve, reject) {
					let width = 100;
					let height = 100;
					let _URL = window.URL || window.webkitURL;
					let img = new Image();
					img.onload = function() {
						let valid = img.width === width && img.height === height;
						valid ? resolve() : reject();
					}
					img.src = _URL.createObjectURL(file);
				}).then(() => {
					return file;
				}, () => {
					_this.$message.error('小Logo尺寸限制为100 x 100')
					return Promise.reject();
				});
				return isSize;
			},
			handleRemoveChange2(file, fileList) {
				var filelists = [];
				this.ruleForm.shortLogo = '';
				this.formData2.smallModelPhoto = filelists;
			},
			handleSuccessChange2(response, file, fileList) { //上传成功后在图片框显示图片
				this.$message.success('上传成功')
				this.ruleForm.shortLogo = "http://doc.yctop.com/" + response.key;
			},
			//
			//chBillTemplate
			beforeAvatarUpload3(file) {
        this.uptoken.key = this.buildUploadFileKey(file, "debit_note", 'pdf', 'ch');
				const isLt10M = file.size < 3 * 1024 * 1024;
				if (!isLt10M) {
					this.$message.error('上传模板大小不能超过 3MB!');
				}
				if (isLt10M) {
					this.ruleForm.chBillTemplate = "http://doc.yctop.com/" + this.uptoken.key
				}
				return isLt10M;
			},
			handleRemoveChange3(file, fileList) {
				var filelists = [];
				this.ruleForm.chBillTemplate = '';
				this.formData3.smallModelPhoto = filelists;
			},
			handleSuccessChange3(response, file, fileList) { //上传成功后在图片框显示图片
				this.$message.success('上传成功')
				this.ruleForm.chBillTemplate = "http://doc.yctop.com/" + response.key;
			},
      beforeAvatarUploadExcelChAE(file) {
        this.uptoken.key = this.buildUploadFileKey(file, "debit_note", 'excel', 'ch');
      	const isLt3M = file.size < 3 * 1024 * 1024;
      	if (!isLt3M) {
      		this.$message.error('上传模板大小不能超过 3MB!');
      	}
      	if (isLt3M) {
      		this.ruleForm.chBillTemplateExcel = "http://doc.yctop.com/" + this.uptoken.key
      	}
      	return isLt3M;
      },
      handleRemoveChangeExcelChAE(file, fileList) {
      	var filelists = [];
      	this.ruleForm.chBillTemplateExcel = '';
      	this.formDataExcelChAE.smallModelPhoto = filelists;
      },
      handleSuccessChangeExcelChAE(response, file, fileList) { //上传成功后在图片框显示图片
      	this.$message.success('上传成功')
      	this.ruleForm.chBillTemplateExcel = "http://doc.yctop.com/" + response.key;
      },
			//
			//enBillTemplate
			beforeAvatarUpload4(file) {
        this.uptoken.key = this.buildUploadFileKey(file, "debit_note", 'pdf', 'en');
				const isLt10M = file.size < 3 * 1024 * 1024;
				if (!isLt10M) {
					this.$message.error('上传模板大小不能超过 3MB!');
				}
				if (isLt10M) {
					this.ruleForm.enBillTemplate = "http://doc.yctop.com/" + this.uptoken.key
				}
				return isLt10M;
			},
			handleRemoveChange4(file, fileList) {
				var filelists = [];
				this.ruleForm.enBillTemplate = '';
				this.formData4.smallModelPhoto = filelists;
			},
			handleSuccessChange4(response, file, fileList) { //上传成功后在图片框显示图片
				this.$message.success('上传成功')
				this.ruleForm.enBillTemplate = "http://doc.yctop.com/" + response.key;
			},
      //AE EN EXCEL
      beforeAvatarUploadExcelEnAE(file) {
        this.uptoken.key = this.buildUploadFileKey(file, "debit_note", 'excel', 'en');
      	const isLt3M = file.size < 3 * 1024 * 1024;
      	if (!isLt3M) {
      		this.$message.error('上传模板大小不能超过 3MB!');
      	}
      	if (isLt3M) {
      		this.ruleForm.enBillTemplateExcel = "http://doc.yctop.com/" + this.uptoken.key
      	}
      	return isLt3M;
      },
      handleRemoveChangeExcelEnAE(file, fileList) {
      	var filelists = [];
      	this.ruleForm.enBillTemplateExcel = '';
      	this.formDataExcelEnAE.smallModelPhoto = filelists;
      },
      handleSuccessChangeExcelEnAE(response, file, fileList) { //上传成功后在图片框显示图片
      	this.$message.success('上传成功')
      	this.ruleForm.enBillTemplateExcel = "http://doc.yctop.com/" + response.key;
      },
			//
			//chListTemplate
			beforeAvatarUpload5(file) {
				this.uptoken.key = "ListTemplate_ch_" + new Date().getTime() + "_" + file.name;
				const isLt10M = file.size < 10 * 1024 * 1024;
				if (!isLt10M) {
					this.$message.error('上传模板大小不能超过 10MB!');
				}
				if (isLt10M) {
					this.ruleForm.chListTemplate = "http://doc.yctop.com/" + this.uptoken.key
				}
				return isLt10M;
			},
			handleRemoveChange5(file, fileList) {
				var filelists = [];
				this.ruleForm.chListTemplate = '';
				this.formData4.smallModelPhoto = filelists;
			},
			handleSuccessChange5(response, file, fileList) { //上传成功后在图片框显示图片
				this.$message.success('上传成功')
				this.ruleForm.chListTemplate = "http://doc.yctop.com/" + response.key;
			},
			//
			//enListTemplate
			beforeAvatarUpload6(file) {
				this.uptoken.key = "ListTemplate_en_" + new Date().getTime() + "_" + file.name;
				const isLt10M = file.size < 10 * 1024 * 1024;
				if (!isLt10M) {
					this.$message.error('上传模板大小不能超过 10MB!');
				}
				if (isLt10M) {
					this.ruleForm.enListTemplate = "http://doc.yctop.com/" + this.uptoken.key
				}
				return isLt10M;
			},
			handleRemoveChange6(file, fileList) {
				var filelists = [];
				this.ruleForm.enListTemplate = '';

				this.formData4.smallModelPhoto = filelists;
			},
			handleSuccessChange6(response, file, fileList) { //上传成功后在图片框显示图片
				this.$message.success('上传成功')
				this.ruleForm.enListTemplate = "http://doc.yctop.com/" + response.key;
			},


			beforeAvatarUploadChAi(file) {
        this.uptoken.key = this.buildUploadFileKey(file, "debit_note", 'pdf', 'ch');
				const isLt10M = file.size < 3 * 1024 * 1024;
				if (!isLt10M) {
					this.$message.error('上传模板大小不能超过 3MB!');
				}
				if (isLt10M) {
					this.ruleForm.chBillTemplateAi = "http://doc.yctop.com/" + this.uptoken.key
				}
				return isLt10M;
			},
			handleRemoveChangeChAi(file, fileList) {
				var filelists = [];
				this.ruleForm.chBillTemplateAi = '';
				this.formDataChAi.smallModelPhoto = filelists;
			},
			handleSuccessChangeChAi(response, file, fileList) { //上传成功后在图片框显示图片
				this.$message.success('上传成功')
				this.ruleForm.chBillTemplateAi = "http://doc.yctop.com/" + response.key;
			},
      //AI CH EXCEL
      beforeAvatarUploadExcelChAi(file) {
        this.uptoken.key = this.buildUploadFileKey(file, "debit_note", 'excel', 'ch');
      	const isLt10M = file.size < 3 * 1024 * 1024;
      	if (!isLt10M) {
      		this.$message.error('上传模板大小不能超过 3MB!');
      	}
      	if (isLt10M) {
      		this.ruleForm.chBillTemplateAiExcel = "http://doc.yctop.com/" + this.uptoken.key
      	}
      	return isLt10M;
      },
      handleRemoveChangeExcelChAi(file, fileList) {
      	var filelists = [];
      	this.ruleForm.chBillTemplateAiExcel = '';
      	this.formDataChAiExcel.smallModelPhoto = filelists;
      },
      handleSuccessChangeExcelChAi(response, file, fileList) { //上传成功后在图片框显示图片
      	this.$message.success('上传成功')
      	this.ruleForm.chBillTemplateAiExcel = "http://doc.yctop.com/" + response.key;
      },

			beforeAvatarUploadEnAi(file) {
        this.uptoken.key = this.buildUploadFileKey(file, "debit_note", 'pdf', 'en');
				const isLt10M = file.size < 3 * 1024 * 1024;
				if (!isLt10M) {
					this.$message.error('上传模板大小不能超过 3MB!');
				}
				if (isLt10M) {
					this.ruleForm.enBillTemplateAi = "http://doc.yctop.com/" + this.uptoken.key
				}
				return isLt10M;
			},
			handleRemoveChangeEnAi(file, fileList) {
				var filelists = [];
				this.ruleForm.enBillTemplateAi = '';
				this.formDataEnAi.smallModelPhoto = filelists;
			},
			handleSuccessChangeEnAi(response, file, fileList) { //上传成功后在图片框显示图片
				this.$message.success('上传成功')
				this.ruleForm.enBillTemplateAi = "http://doc.yctop.com/" + response.key;
			},
      //AI EN EXCEL
      beforeAvatarUploadExcelEnAi(file) {
        this.uptoken.key = this.buildUploadFileKey(file, "debit_note", 'excel', 'en');
      	const isLt10M = file.size < 3 * 1024 * 1024;
      	if (!isLt10M) {
      		this.$message.error('上传模板大小不能超过 3MB!');
      	}
      	if (isLt10M) {
      		this.ruleForm.enBillTemplateAiExcel = "http://doc.yctop.com/" + this.uptoken.key
      	}
      	return isLt10M;
      },
      handleRemoveChangeExcelEnAi(file, fileList) {
      	var filelists = [];
      	this.ruleForm.enBillTemplateAiExcel = '';
      	this.formDataEnAiExcel.smallModelPhoto = filelists;
      },
      handleSuccessChangeExcelEnAi(response, file, fileList) { //上传成功后在图片框显示图片
      	this.$message.success('上传成功')
      	this.ruleForm.enBillTemplateAiExcel = "http://doc.yctop.com/" + response.key;
      },


			beforeAvatarUploadChSe(file) {
        this.uptoken.key = this.buildUploadFileKey(file, "debit_note", 'pdf', 'ch');
				const isLt10M = file.size < 3 * 1024 * 1024;
				if (!isLt10M) {
					this.$message.error('上传模板大小不能超过 3MB!');
				}
				if (isLt10M) {
					this.ruleForm.chBillTemplateSe = "http://doc.yctop.com/" + this.uptoken.key
				}
				return isLt10M;
			},
			handleRemoveChangeChSe(file, fileList) {
				var filelists = [];
				this.ruleForm.chBillTemplateSe = '';
				this.formDataChSe.smallModelPhoto = filelists;
			},
			handleSuccessChangeChSe(response, file, fileList) { //上传成功后在图片框显示图片
				this.$message.success('上传成功')
				this.ruleForm.chBillTemplateSe = "http://doc.yctop.com/" + response.key;
			},
      //SE CH EXCEL
      beforeAvatarUploadExcelChSe(file) {
        this.uptoken.key = this.buildUploadFileKey(file, "debit_note", 'excel', 'ch');
      	const isLt10M = file.size < 3 * 1024 * 1024;
      	if (!isLt10M) {
      		this.$message.error('上传模板大小不能超过 3MB!');
      	}
      	if (isLt10M) {
      		this.ruleForm.chBillTemplateSeExcel = "http://doc.yctop.com/" + this.uptoken.key
      	}
      	return isLt10M;
      },
      handleRemoveChangeExcelChSe(file, fileList) {
      	var filelists = [];
      	this.ruleForm.chBillTemplateSeExcel = '';
      	this.formDataChSeExcel.smallModelPhoto = filelists;
      },
      handleSuccessChangeExcelChSe(response, file, fileList) { //上传成功后在图片框显示图片
      	this.$message.success('上传成功')
      	this.ruleForm.chBillTemplateSeExcel = "http://doc.yctop.com/" + response.key;
      },

			beforeAvatarUploadEnSe(file) {
        this.uptoken.key = this.buildUploadFileKey(file, "debit_note", 'pdf', 'en');
				const isLt10M = file.size < 3 * 1024 * 1024;
				if (!isLt10M) {
					this.$message.error('上传模板大小不能超过 3MB!');
				}
				if (isLt10M) {
					this.ruleForm.enBillTemplateSe = "http://doc.yctop.com/" + this.uptoken.key
				}
				return isLt10M;
			},
			handleRemoveChangeEnSe(file, fileList) {
				var filelists = [];
				this.ruleForm.enBillTemplateSe = '';
				this.formDataEnSe.smallModelPhoto = filelists;
			},
			handleSuccessChangeEnSe(response, file, fileList) { //上传成功后在图片框显示图片
				this.$message.success('上传成功')
				this.ruleForm.enBillTemplateSe = "http://doc.yctop.com/" + response.key;
			},

      //SE EN EXCEL
      beforeAvatarUploadExcelEnSe(file) {
        this.uptoken.key = this.buildUploadFileKey(file, "debit_note", 'excel', 'en');
      	const isLt10M = file.size < 3 * 1024 * 1024;
      	if (!isLt10M) {
      		this.$message.error('上传模板大小不能超过 3MB!');
      	}
      	if (isLt10M) {
      		this.ruleForm.enBillTemplateSeExcel = "http://doc.yctop.com/" + this.uptoken.key
      	}
      	return isLt10M;
      },
      handleRemoveChangeExcelEnSe(file, fileList) {
      	var filelists = [];
      	this.ruleForm.enBillTemplateSeExcel = '';
      	this.formDataEnSeExcel.smallModelPhoto = filelists;
      },
      handleSuccessChangeExcelEnSe(response, file, fileList) { //上传成功后在图片框显示图片
      	this.$message.success('上传成功')
      	this.ruleForm.enBillTemplateSeExcel = "http://doc.yctop.com/" + response.key;
      },


			beforeAvatarUploadChSi(file) {
        this.uptoken.key = this.buildUploadFileKey(file, "debit_note", 'pdf', 'ch');
				const isLt10M = file.size < 3 * 1024 * 1024;
				if (!isLt10M) {
					this.$message.error('上传模板大小不能超过 3MB!');
				}
				if (isLt10M) {
					this.ruleForm.chBillTemplateSi = "http://doc.yctop.com/" + this.uptoken.key
				}
				return isLt10M;
			},
			handleRemoveChangeChSi(file, fileList) {
				var filelists = [];
				this.ruleForm.chBillTemplateSi = '';
				this.formDataChSi.smallModelPhoto = filelists;
			},
			handleSuccessChangeChSi(response, file, fileList) { //上传成功后在图片框显示图片
				this.$message.success('上传成功')
				this.ruleForm.chBillTemplateSi = "http://doc.yctop.com/" + response.key;
			},
      //SI CH EXCEL
      beforeAvatarUploadExcelChSi(file) {
        this.uptoken.key = this.buildUploadFileKey(file, "debit_note", 'excel', 'ch');
      	const isLt10M = file.size < 3 * 1024 * 1024;
      	if (!isLt10M) {
      		this.$message.error('上传模板大小不能超过 3MB!');
      	}
      	if (isLt10M) {
      		this.ruleForm.chBillTemplateSiExcel = "http://doc.yctop.com/" + this.uptoken.key
      	}
      	return isLt10M;
      },
      handleRemoveChangeExcelChSi(file, fileList) {
      	var filelists = [];
      	this.ruleForm.chBillTemplateSiExcel = '';
      	this.formDataChSiExcel.smallModelPhoto = filelists;
      },
      handleSuccessChangeExcelChSi(response, file, fileList) { //上传成功后在图片框显示图片
      	this.$message.success('上传成功')
      	this.ruleForm.chBillTemplateSiExcel = "http://doc.yctop.com/" + response.key;
      },

			beforeAvatarUploadEnSi(file) {
        this.uptoken.key = this.buildUploadFileKey(file, "debit_note", 'pdf', 'en');
				const isLt10M = file.size < 3 * 1024 * 1024;
				if (!isLt10M) {
					this.$message.error('上传模板大小不能超过 3MB!');
				}
				if (isLt10M) {
					this.ruleForm.enBillTemplateSi = "http://doc.yctop.com/" + this.uptoken.key
				}
				return isLt10M;
			},
			handleRemoveChangeEnSi(file, fileList) {
				var filelists = [];
				this.ruleForm.enBillTemplateSi = '';
				this.formDataEnSi.smallModelPhoto = filelists;
			},
			handleSuccessChangeEnSi(response, file, fileList) { //上传成功后在图片框显示图片
				this.$message.success('上传成功')
				this.ruleForm.enBillTemplateSi = "http://doc.yctop.com/" + response.key;
			},
      //SI EN EXCEL
      beforeAvatarUploadExcelEnSi(file) {
        this.uptoken.key = this.buildUploadFileKey(file, "debit_note", 'excel', 'en');
      	const isLt10M = file.size < 3 * 1024 * 1024;
      	if (!isLt10M) {
      		this.$message.error('上传模板大小不能超过 3MB!');
      	}
      	if (isLt10M) {
      		this.ruleForm.enBillTemplateSiExcel = "http://doc.yctop.com/" + this.uptoken.key
      	}
      	return isLt10M;
      },
      handleRemoveChangeExcelEnSi(file, fileList) {
      	var filelists = [];
      	this.ruleForm.enBillTemplateSiExcel = '';
      	this.formDataEnSiExcel.smallModelPhoto = filelists;
      },
      handleSuccessChangeExcelEnSi(response, file, fileList) { //上传成功后在图片框显示图片
      	this.$message.success('上传成功')
      	this.ruleForm.enBillTemplateSiExcel = "http://doc.yctop.com/" + response.key;
      },

			beforeAvatarUploadChTe(file) {
        this.uptoken.key = this.buildUploadFileKey(file, "debit_note", 'pdf', 'ch');
				const isLt10M = file.size < 3 * 1024 * 1024;
				if (!isLt10M) {
					this.$message.error('上传模板大小不能超过 3MB!');
				}
				if (isLt10M) {
					this.ruleForm.chBillTemplateTe = "http://doc.yctop.com/" + this.uptoken.key
				}
				return isLt10M;
			},
			handleRemoveChangeChTe(file, fileList) {
				var filelists = [];
				this.ruleForm.chBillTemplateTe = '';
				this.formDataChTe.smallModelPhoto = filelists;
			},
			handleSuccessChangeChTe(response, file, fileList) { //上传成功后在图片框显示图片
				this.$message.success('上传成功')
				this.ruleForm.chBillTemplateTe = "http://doc.yctop.com/" + response.key;
			},
      //TE CH EXCEL
      beforeAvatarUploadExcelChTe(file) {
        this.uptoken.key = this.buildUploadFileKey(file, "debit_note", 'excel', 'ch');
      	const isLt10M = file.size < 3 * 1024 * 1024;
      	if (!isLt10M) {
      		this.$message.error('上传模板大小不能超过 3MB!');
      	}
      	if (isLt10M) {
      		this.ruleForm.chBillTemplateTeExcel = "http://doc.yctop.com/" + this.uptoken.key
      	}
      	return isLt10M;
      },
      handleRemoveChangeExcelChTe(file, fileList) {
      	var filelists = [];
      	this.ruleForm.chBillTemplateTeExcel = '';
      	this.formDataChTeExcel.smallModelPhoto = filelists;
      },
      handleSuccessChangeExcelChTe(response, file, fileList) { //上传成功后在图片框显示图片
      	this.$message.success('上传成功')
      	this.ruleForm.chBillTemplateTeExcel = "http://doc.yctop.com/" + response.key;
      },

			beforeAvatarUploadEnTe(file) {
        this.uptoken.key = this.buildUploadFileKey(file, "debit_note", 'pdf', 'en');
				const isLt10M = file.size < 3 * 1024 * 1024;
				if (!isLt10M) {
					this.$message.error('上传模板大小不能超过 3MB!');
				}
				if (isLt10M) {
					this.ruleForm.enBillTemplateTe = "http://doc.yctop.com/" + this.uptoken.key
				}
				return isLt10M;
			},
			handleRemoveChangeEnTe(file, fileList) {
				var filelists = [];
				this.ruleForm.enBillTemplateTe = '';
				this.formDataEnTe.smallModelPhoto = filelists;
			},
			handleSuccessChangeEnTe(response, file, fileList) { //上传成功后在图片框显示图片
				this.$message.success('上传成功')
				this.ruleForm.enBillTemplateTe = "http://doc.yctop.com/" + response.key;
			},
      //TE EN EXCEL
      beforeAvatarUploadExcelEnTe(file) {
        this.uptoken.key = this.buildUploadFileKey(file, "debit_note", 'excel', 'en');
      	const isLt10M = file.size < 3 * 1024 * 1024;
      	if (!isLt10M) {
      		this.$message.error('上传模板大小不能超过 3MB!');
      	}
      	if (isLt10M) {
      		this.ruleForm.enBillTemplateTeExcel = "http://doc.yctop.com/" + this.uptoken.key
      	}
      	return isLt10M;
      },
      handleRemoveChangeExcelEnTe(file, fileList) {
      	var filelists = [];
      	this.ruleForm.enBillTemplateTeExcel = '';
      	this.formDataEnTeExcel.smallModelPhoto = filelists;
      },
      handleSuccessChangeExcelEnTe(response, file, fileList) { //上传成功后在图片框显示图片
      	this.$message.success('上传成功')
      	this.ruleForm.enBillTemplateTeExcel = "http://doc.yctop.com/" + response.key;
      },


			beforeAvatarUploadChTi(file) {
        this.uptoken.key = this.buildUploadFileKey(file, "debit_note", 'pdf', 'ch');
				const isLt10M = file.size < 3 * 1024 * 1024;
				if (!isLt10M) {
					this.$message.error('上传模板大小不能超过 3MB!');
				}
				if (isLt10M) {
					this.ruleForm.chBillTemplateTi = "http://doc.yctop.com/" + this.uptoken.key
				}
				return isLt10M;
			},
			handleRemoveChangeChTi(file, fileList) {
				var filelists = [];
				this.ruleForm.chBillTemplateTi = '';
				this.formDataChTi.smallModelPhoto = filelists;
			},
			handleSuccessChangeChTi(response, file, fileList) { //上传成功后在图片框显示图片
				this.$message.success('上传成功')
				this.ruleForm.chBillTemplateTi = "http://doc.yctop.com/" + response.key;
			},
      //TI CH EXCEL
      beforeAvatarUploadExcelChTi(file) {
        this.uptoken.key = this.buildUploadFileKey(file, "debit_note", 'excel', 'ch');
      	const isLt10M = file.size < 3 * 1024 * 1024;
      	if (!isLt10M) {
      		this.$message.error('上传模板大小不能超过 3MB!');
      	}
      	if (isLt10M) {
      		this.ruleForm.chBillTemplateTiExcel = "http://doc.yctop.com/" + this.uptoken.key
      	}
      	return isLt10M;
      },
      handleRemoveChangeExcelChTi(file, fileList) {
      	var filelists = [];
      	this.ruleForm.chBillTemplateTiExcel = '';
      	this.formDataChTiExcel.smallModelPhoto = filelists;
      },
      handleSuccessChangeExcelChTi(response, file, fileList) { //上传成功后在图片框显示图片
      	this.$message.success('上传成功')
      	this.ruleForm.chBillTemplateTiExcel = "http://doc.yctop.com/" + response.key;
      },

			beforeAvatarUploadEnTi(file) {
        this.uptoken.key = this.buildUploadFileKey(file, "debit_note", 'pdf', 'en');
				const isLt10M = file.size < 3 * 1024 * 1024;
				if (!isLt10M) {
					this.$message.error('上传模板大小不能超过 3MB!');
				}
				if (isLt10M) {
					this.ruleForm.enBillTemplateTi = "http://doc.yctop.com/" + this.uptoken.key
				}
				return isLt10M;
			},
			handleRemoveChangeEnTi(file, fileList) {
				var filelists = [];
				this.ruleForm.enBillTemplateTi = '';
				this.formDataEnTi.smallModelPhoto = filelists;
			},
			handleSuccessChangeEnTi(response, file, fileList) { //上传成功后在图片框显示图片
				this.$message.success('上传成功')
				this.ruleForm.enBillTemplateTi = "http://doc.yctop.com/" + response.key;
			},
      //TI EN EXCEL
      beforeAvatarUploadExcelEnTi(file) {
        this.uptoken.key = this.buildUploadFileKey(file, "debit_note", 'excel', 'en');
      	const isLt10M = file.size < 3 * 1024 * 1024;
      	if (!isLt10M) {
      		this.$message.error('上传模板大小不能超过 3MB!');
      	}
      	if (isLt10M) {
      		this.ruleForm.enBillTemplateTiExcel = "http://doc.yctop.com/" + this.uptoken.key
      	}
      	return isLt10M;
      },
      handleRemoveChangeExcelEnTi(file, fileList) {
      	var filelists = [];
      	this.ruleForm.enBillTemplateTiExcel = '';
      	this.formDataEnTiExcel.smallModelPhoto = filelists;
      },
      handleSuccessChangeExcelEnTi(response, file, fileList) { //上传成功后在图片框显示图片
      	this.$message.success('上传成功')
      	this.ruleForm.enBillTemplateTiExcel = "http://doc.yctop.com/" + response.key;
      },

      //LC Ch PDF
      beforeAvatarUploadChLc(file) {
        this.uptoken.key = this.buildUploadFileKey(file, "debit_note", 'pdf', 'ch');
          const isLt10M = file.size < 3 * 1024 * 1024;
          if (!isLt10M) {
              this.$message.error('上传模板大小不能超过 3MB!');
          }
          if (isLt10M) {
              this.ruleForm.chBillTemplateLc = "http://doc.yctop.com/" + this.uptoken.key
          }
          return isLt10M;
      },
      handleRemoveChangeChLc(file, fileList) {
          var filelists = [];
          this.ruleForm.chBillTemplateLc = '';
          this.formDataChLc.smallModelPhoto = filelists;
      },
      handleSuccessChangeChLc(response, file, fileList) { //上传成功后在图片框显示图片
          this.$message.success('上传成功')
          this.ruleForm.chBillTemplateLc = "http://doc.yctop.com/" + response.key;
      },
      //LC EN PDF
      beforeAvatarUploadEnLc(file) {
        this.uptoken.key = this.buildUploadFileKey(file, "debit_note", 'pdf', 'en');
        const isLt10M = file.size < 3 * 1024 * 1024;
        if (!isLt10M) {
          this.$message.error('上传模板大小不能超过 3MB!');
        }
        if (isLt10M) {
          this.ruleForm.enBillTemplateLc = "http://doc.yctop.com/" + this.uptoken.key
        }
        return isLt10M;
      },
      handleRemoveChangeEnLc(file, fileList) {
          var filelists = [];
          this.ruleForm.enBillTemplateLc = '';
          this.formDataEnLc.smallModelPhoto = filelists;
      },
      handleSuccessChangeEnLc(response, file, fileList) { //上传成功后在图片框显示图片
          this.$message.success('上传成功')
          this.ruleForm.enBillTemplateLc = "http://doc.yctop.com/" + response.key;
      },
      //LC CH EXCEL
      beforeAvatarUploadExcelChLc(file) {
        this.uptoken.key = this.buildUploadFileKey(file, "debit_note", 'excel', 'ch');
          const isLt10M = file.size < 3 * 1024 * 1024;
          if (!isLt10M) {
              this.$message.error('上传模板大小不能超过 3MB!');
          }
          if (isLt10M) {
              this.ruleForm.chBillTemplateLcExcel = "http://doc.yctop.com/" + this.uptoken.key
          }
          return isLt10M;
      },
      handleRemoveChangeExcelChLc(file, fileList) {
          var filelists = [];
          this.ruleForm.chBillTemplateLcExcel = '';
          this.formDataChLcExcel.smallModelPhoto = filelists;
      },
      handleSuccessChangeExcelChLc(response, file, fileList) { //上传成功后在图片框显示图片
          this.$message.success('上传成功')
          this.ruleForm.chBillTemplateLcExcel = "http://doc.yctop.com/" + response.key;
      },
      //LC EN EXCEL
      beforeAvatarUploadExcelEnLc(file) {
        this.uptoken.key = this.buildUploadFileKey(file, "debit_note", 'excel', 'en');
          const isLt10M = file.size < 3 * 1024 * 1024;
          if (!isLt10M) {
              this.$message.error('上传模板大小不能超过 3MB!');
          }
          if (isLt10M) {
              this.ruleForm.enBillTemplateLcExcel = "http://doc.yctop.com/" + this.uptoken.key
          }
          return isLt10M;
      },
      handleRemoveChangeExcelEnLc(file, fileList) {
          var filelists = [];
          this.ruleForm.enBillTemplateLcExcel = '';
          this.formDataEnLcExcel.smallModelPhoto = filelists;
      },
      handleSuccessChangeExcelEnLc(response, file, fileList) { //上传成功后在图片框显示图片
          this.$message.success('上传成功')
          this.ruleForm.enBillTemplateLcExcel = "http://doc.yctop.com/" + response.key;
      },
      //AE CH St Excel
      beforeAvatarUploadExcelChAeSt(file) {
        this.uptoken.key = this.buildUploadFileKey(file, "statement", 'excel', 'ch');
        const isLt3M = file.size < 3 * 1024 * 1024;
        if (!isLt3M) {
          this.$message.error('上传模板大小不能超过 3MB!');
        }
        if (isLt3M) {
          this.ruleForm.statementTemplateAeExcelCn = "http://doc.yctop.com/" + this.uptoken.key
        }
        return isLt3M;
      },
      handleRemoveChangeExcelChAeSt(file, fileList) {
          var filelists = [];
          this.ruleForm.statementTemplateAeExcelCn = '';
          this.formDataChAeExcelSt.smallModelPhoto = filelists;
      },
      handleSuccessChangeExcelChAeSt(response, file, fileList) { //上传成功后在图片框显示图片
          this.$message.success('上传成功')
          this.ruleForm.statementTemplateAeExcelCn = "http://doc.yctop.com/" + response.key;
      },
      //AE EN St Excel
      beforeAvatarUploadExcelEnAeSt(file) {
        this.uptoken.key = this.buildUploadFileKey(file, "statement", 'excel', 'en');
        const isLt3M = file.size < 3 * 1024 * 1024;
        if (!isLt3M) {
          this.$message.error('上传模板大小不能超过 3MB!');
        }
        if (isLt3M) {
          this.ruleForm.statementTemplateAeExcelEn = "http://doc.yctop.com/" + this.uptoken.key
        }
        return isLt3M;
      },
      handleRemoveChangeExcelEnAeSt(file, fileList) {
          var filelists = [];
          this.ruleForm.statementTemplateAeExcelEn = '';
          this.formDataEnAeExcelSt.smallModelPhoto = filelists;
      },
      handleSuccessChangeExcelEnAeSt(response, file, fileList) { //上传成功后在图片框显示图片
          this.$message.success('上传成功')
          this.ruleForm.statementTemplateAeExcelEn = "http://doc.yctop.com/" + response.key;
      },
      //AI CH St Excel
      beforeAvatarUploadExcelChAiSt(file) {
        this.uptoken.key = this.buildUploadFileKey(file, "statement", 'excel', 'ch');
        const isLt3M = file.size < 3 * 1024 * 1024;
        if (!isLt3M) {
          this.$message.error('上传模板大小不能超过 3MB!');
        }
        if (isLt3M) {
          this.ruleForm.statementTemplateAiExcelCn = "http://doc.yctop.com/" + this.uptoken.key
        }
        return isLt3M;
      },
      handleRemoveChangeExcelChAiSt(file, fileList) {
          var filelists = [];
          this.ruleForm.statementTemplateAiExcelCn = '';
          this.formDataChAiExcelSt.smallModelPhoto = filelists;
      },
      handleSuccessChangeExcelChAiSt(response, file, fileList) { //上传成功后在图片框显示图片
          this.$message.success('上传成功')
          this.ruleForm.statementTemplateAiExcelCn = "http://doc.yctop.com/" + response.key;
      },
      //Ai EN St Excel
      beforeAvatarUploadExcelEnAiSt(file) {
        this.uptoken.key = this.buildUploadFileKey(file, "statement", 'excel', 'en');
          const isLt3M = file.size < 3 * 1024 * 1024;
          if (!isLt3M) {
              this.$message.error('上传模板大小不能超过 3MB!');
          }
          if (isLt3M) {
              this.ruleForm.statementTemplateAiExcelEn = "http://doc.yctop.com/" + this.uptoken.key
          }
          return isLt3M;
      },
      handleRemoveChangeExcelEnAiSt(file, fileList) {
          var filelists = [];
          this.ruleForm.statementTemplateAiExcelEn = '';
          this.formDataEnAiExcelSt.smallModelPhoto = filelists;
      },
      handleSuccessChangeExcelEnAiSt(response, file, fileList) { //上传成功后在图片框显示图片
          this.$message.success('上传成功')
          this.ruleForm.statementTemplateAiExcelEn = "http://doc.yctop.com/" + response.key;
      },
        //SE CH St Excel
        beforeAvatarUploadExcelChSeSt(file) {
          this.uptoken.key = this.buildUploadFileKey(file, "statement", 'excel', 'ch');
            const isLt3M = file.size < 3 * 1024 * 1024;
            if (!isLt3M) {
                this.$message.error('上传模板大小不能超过 3MB!');
            }
            if (isLt3M) {
                this.ruleForm.statementTemplateSeExcelCn = "http://doc.yctop.com/" + this.uptoken.key
            }
            return isLt3M;
        },
        handleRemoveChangeExcelChSeSt(file, fileList) {
            var filelists = [];
            this.ruleForm.statementTemplateSeExcelCn = '';
            this.formDataChSeExcelSt.smallModelPhoto = filelists;
        },
        handleSuccessChangeExcelChSeSt(response, file, fileList) { //上传成功后在图片框显示图片
            this.$message.success('上传成功')
            this.ruleForm.statementTemplateSeExcelCn = "http://doc.yctop.com/" + response.key;
        },
        //SE EN St Excel
        beforeAvatarUploadExcelEnSeSt(file) {
          this.uptoken.key = this.buildUploadFileKey(file, "statement", 'excel', 'en');
            const isLt3M = file.size < 3 * 1024 * 1024;
            if (!isLt3M) {
                this.$message.error('上传模板大小不能超过 3MB!');
            }
            if (isLt3M) {
                this.ruleForm.statementTemplateSeExcelEn = "http://doc.yctop.com/" + this.uptoken.key
            }
            return isLt3M;
        },
        handleRemoveChangeExcelEnSeSt(file, fileList) {
            var filelists = [];
            this.ruleForm.statementTemplateSeExcelEn = '';
            this.formDataEnSeExcelSt.smallModelPhoto = filelists;
        },
        handleSuccessChangeExcelEnSeSt(response, file, fileList) { //上传成功后在图片框显示图片
            this.$message.success('上传成功')
            this.ruleForm.statementTemplateSeExcelEn = "http://doc.yctop.com/" + response.key;
        },
        //SI CH St Excel
        beforeAvatarUploadExcelChSiSt(file) {
          this.uptoken.key = this.buildUploadFileKey(file, "statement", 'excel', 'ch');
            const isLt3M = file.size < 3 * 1024 * 1024;
            if (!isLt3M) {
                this.$message.error('上传模板大小不能超过 3MB!');
            }
            if (isLt3M) {
                this.ruleForm.statementTemplateSiExcelCn = "http://doc.yctop.com/" + this.uptoken.key
            }
            return isLt3M;
        },
        handleRemoveChangeExcelChSiSt(file, fileList) {
            var filelists = [];
            this.ruleForm.statementTemplateSiExcelCn = '';
            this.formDataChSiExcelSt.smallModelPhoto = filelists;
        },
        handleSuccessChangeExcelChSiSt(response, file, fileList) { //上传成功后在图片框显示图片
            this.$message.success('上传成功')
            this.ruleForm.statementTemplateSiExcelCn = "http://doc.yctop.com/" + response.key;
        },
        //SI EN St Excel
        beforeAvatarUploadExcelEnSiSt(file) {
          this.uptoken.key = this.buildUploadFileKey(file, "statement", 'excel', 'en');
            const isLt3M = file.size < 3 * 1024 * 1024;
            if (!isLt3M) {
                this.$message.error('上传模板大小不能超过 3MB!');
            }
            if (isLt3M) {
                this.ruleForm.statementTemplateSiExcelEn = "http://doc.yctop.com/" + this.uptoken.key
            }
            return isLt3M;
        },
        handleRemoveChangeExcelEnSiSt(file, fileList) {
            var filelists = [];
            this.ruleForm.statementTemplateSiExcelEn = '';
            this.formDataEnSiExcelSt.smallModelPhoto = filelists;
        },
        handleSuccessChangeExcelEnSiSt(response, file, fileList) { //上传成功后在图片框显示图片
            this.$message.success('上传成功')
            this.ruleForm.statementTemplateSiExcelEn = "http://doc.yctop.com/" + response.key;
        },
        //TE CH St Excel
        beforeAvatarUploadExcelChTeSt(file) {
          this.uptoken.key = this.buildUploadFileKey(file, "statement", 'excel', 'ch');
            const isLt3M = file.size < 3 * 1024 * 1024;
            if (!isLt3M) {
                this.$message.error('上传模板大小不能超过 3MB!');
            }
            if (isLt3M) {
                this.ruleForm.statementTemplateTeExcelCn = "http://doc.yctop.com/" + this.uptoken.key
            }
            return isLt3M;
        },
        handleRemoveChangeExcelChTeSt(file, fileList) {
            var filelists = [];
            this.ruleForm.statementTemplateTeExcelCn = '';
            this.formDataChTeExcelSt.smallModelPhoto = filelists;
        },
        handleSuccessChangeExcelChTeSt(response, file, fileList) { //上传成功后在图片框显示图片
            this.$message.success('上传成功')
            this.ruleForm.statementTemplateTeExcelCn = "http://doc.yctop.com/" + response.key;
        },
        //TE EN St Excel
        beforeAvatarUploadExcelEnTeSt(file) {
          this.uptoken.key = this.buildUploadFileKey(file, "statement", 'excel', 'en');
            const isLt3M = file.size < 3 * 1024 * 1024;
            if (!isLt3M) {
                this.$message.error('上传模板大小不能超过 3MB!');
            }
            if (isLt3M) {
                this.ruleForm.statementTemplateTeExcelEn = "http://doc.yctop.com/" + this.uptoken.key
            }
            return isLt3M;
        },
        handleRemoveChangeExcelEnTeSt(file, fileList) {
            var filelists = [];
            this.ruleForm.statementTemplateTeExcelEn = '';
            this.formDataEnTeExcelSt.smallModelPhoto = filelists;
        },
        handleSuccessChangeExcelEnTeSt(response, file, fileList) { //上传成功后在图片框显示图片
            this.$message.success('上传成功')
            this.ruleForm.statementTemplateTeExcelEn = "http://doc.yctop.com/" + response.key;
        },
        //TI CH St Excel
        beforeAvatarUploadExcelChTiSt(file) {
          this.uptoken.key = this.buildUploadFileKey(file, "statement", 'excel', 'ch');
            const isLt3M = file.size < 3 * 1024 * 1024;
            if (!isLt3M) {
                this.$message.error('上传模板大小不能超过 3MB!');
            }
            if (isLt3M) {
                this.ruleForm.statementTemplateTiExcelCn = "http://doc.yctop.com/" + this.uptoken.key
            }
            return isLt3M;
        },
        handleRemoveChangeExcelChTiSt(file, fileList) {
            var filelists = [];
            this.ruleForm.statementTemplateTiExcelCn = '';
            this.formDataChTiExcelSt.smallModelPhoto = filelists;
        },
        handleSuccessChangeExcelChTiSt(response, file, fileList) { //上传成功后在图片框显示图片
            this.$message.success('上传成功')
            this.ruleForm.statementTemplateTiExcelCn = "http://doc.yctop.com/" + response.key;
        },
        //TI EN St Excel
        beforeAvatarUploadExcelEnTiSt(file) {
          this.uptoken.key = this.buildUploadFileKey(file, "statement", 'excel', 'en');
            const isLt3M = file.size < 3 * 1024 * 1024;
            if (!isLt3M) {
                this.$message.error('上传模板大小不能超过 3MB!');
            }
            if (isLt3M) {
                this.ruleForm.statementTemplateTiExcelEn = "http://doc.yctop.com/" + this.uptoken.key
            }
            return isLt3M;
        },
        handleRemoveChangeExcelEnTiSt(file, fileList) {
            var filelists = [];
            this.ruleForm.statementTemplateTiExcelEn = '';
            this.formDataEnTiExcelSt.smallModelPhoto = filelists;
        },
        handleSuccessChangeExcelEnTiSt(response, file, fileList) { //上传成功后在图片框显示图片
            this.$message.success('上传成功')
            this.ruleForm.statementTemplateTiExcelEn = "http://doc.yctop.com/" + response.key;
        },
        //LC CH St Excel
        beforeAvatarUploadExcelChLcSt(file) {
          this.uptoken.key = this.buildUploadFileKey(file, "statement", 'excel', 'ch');
            const isLt3M = file.size < 3 * 1024 * 1024;
            if (!isLt3M) {
                this.$message.error('上传模板大小不能超过 3MB!');
            }
            if (isLt3M) {
                this.ruleForm.statementTemplateLcExcelCn = "http://doc.yctop.com/" + this.uptoken.key
            }
            return isLt3M;
        },
        handleRemoveChangeExcelChLcSt(file, fileList) {
            var filelists = [];
            this.ruleForm.statementTemplateLcExcelCn = '';
            this.formDataChLcExcelSt.smallModelPhoto = filelists;
        },
        handleSuccessChangeExcelChLcSt(response, file, fileList) { //上传成功后在图片框显示图片
            this.$message.success('上传成功')
            this.ruleForm.statementTemplateLcExcelCn = "http://doc.yctop.com/" + response.key;
        },
        //LC EN St Excel
        beforeAvatarUploadExcelEnLcSt(file) {
          this.uptoken.key = this.buildUploadFileKey(file, "statement", 'excel', 'en');
            const isLt3M = file.size < 3 * 1024 * 1024;
            if (!isLt3M) {
                this.$message.error('上传模板大小不能超过 3MB!');
            }
            if (isLt3M) {
                this.ruleForm.statementTemplateLcExcelEn = "http://doc.yctop.com/" + this.uptoken.key
            }
            return isLt3M;
        },
        handleRemoveChangeExcelEnLcSt(file, fileList) {
            var filelists = [];
            this.ruleForm.statementTemplateLcExcelEn = '';
            this.formDataEnLcExcelSt.smallModelPhoto = filelists;
        },
        handleSuccessChangeExcelEnLcSt(response, file, fileList) { //上传成功后在图片框显示图片
            this.$message.success('上传成功')
            this.ruleForm.statementTemplateLcExcelEn = "http://doc.yctop.com/" + response.key;
        },

        //IO Ch PDF
        beforeAvatarUploadChIo(file) {
          this.uptoken.key = this.buildUploadFileKey(file, "debit_note", 'pdf', 'ch');
            const isLt10M = file.size < 3 * 1024 * 1024;
            if (!isLt10M) {
                this.$message.error('上传模板大小不能超过 3MB!');
            }
            if (isLt10M) {
                this.ruleForm.chBillTemplateIo = "http://doc.yctop.com/" + this.uptoken.key
            }
            return isLt10M;
        },
        handleRemoveChangeChIo(file, fileList) {
            var filelists = [];
            this.ruleForm.chBillTemplateIo = '';
            this.formDataChIo.smallModelPhoto = filelists;
        },
        handleSuccessChangeChIo(response, file, fileList) { //上传成功后在图片框显示图片
            this.$message.success('上传成功')
            this.ruleForm.chBillTemplateIo = "http://doc.yctop.com/" + response.key;
        },
        //IO EN PDF
        beforeAvatarUploadEnIo(file) {
          this.uptoken.key = this.buildUploadFileKey(file, "debit_note", 'pdf', 'en');
            const isLt10M = file.size < 3 * 1024 * 1024;
            if (!isLt10M) {
                this.$message.error('上传模板大小不能超过 3MB!');
            }
            if (isLt10M) {
                this.ruleForm.enBillTemplateIo = "http://doc.yctop.com/" + this.uptoken.key
            }
            return isLt10M;
        },
        handleRemoveChangeEnIo(file, fileList) {
            var filelists = [];
            this.ruleForm.enBillTemplateIo = '';
            this.formDataEnIo.smallModelPhoto = filelists;
        },
        handleSuccessChangeEnIo(response, file, fileList) { //上传成功后在图片框显示图片
            this.$message.success('上传成功')
            this.ruleForm.enBillTemplateIo = "http://doc.yctop.com/" + response.key;
        },
        //IO CH EXCEL
        beforeAvatarUploadExcelChIo(file) {
          this.uptoken.key = this.buildUploadFileKey(file, "debit_note", 'excel', 'ch');
            const isLt10M = file.size < 3 * 1024 * 1024;
            if (!isLt10M) {
                this.$message.error('上传模板大小不能超过 3MB!');
            }
            if (isLt10M) {
                this.ruleForm.chBillTemplateIoExcel = "http://doc.yctop.com/" + this.uptoken.key
            }
            return isLt10M;
        },
        handleRemoveChangeExcelChIo(file, fileList) {
            var filelists = [];
            this.ruleForm.chBillTemplateIoExcel = '';
            this.formDataChIoExcel.smallModelPhoto = filelists;
        },
        handleSuccessChangeExcelChIo(response, file, fileList) { //上传成功后在图片框显示图片
            this.$message.success('上传成功')
            this.ruleForm.chBillTemplateIoExcel = "http://doc.yctop.com/" + response.key;
        },
        //IO EN EXCEL
        beforeAvatarUploadExcelEnIo(file) {
          this.uptoken.key = this.buildUploadFileKey(file, "debit_note", 'excel', 'en');
            const isLt10M = file.size < 3 * 1024 * 1024;
            if (!isLt10M) {
                this.$message.error('上传模板大小不能超过 3MB!');
            }
            if (isLt10M) {
                this.ruleForm.enBillTemplateIoExcel = "http://doc.yctop.com/" + this.uptoken.key
            }
            return isLt10M;
        },
        handleRemoveChangeExcelEnIo(file, fileList) {
            var filelists = [];
            this.ruleForm.enBillTemplateIoExcel = '';
            this.formDataEnIoExcel.smallModelPhoto = filelists;
        },
        handleSuccessChangeExcelEnIo(response, file, fileList) { //上传成功后在图片框显示图片
            this.$message.success('上传成功')
            this.ruleForm.enBillTemplateIoExcel = "http://doc.yctop.com/" + response.key;
        },
        //IO CH St Excel
        beforeAvatarUploadExcelChIoSt(file) {
          this.uptoken.key = this.buildUploadFileKey(file, "statement", 'excel', 'ch');
            const isLt3M = file.size < 3 * 1024 * 1024;
            if (!isLt3M) {
                this.$message.error('上传模板大小不能超过 3MB!');
            }
            if (isLt3M) {
                this.ruleForm.statementTemplateIoExcelCn = "http://doc.yctop.com/" + this.uptoken.key
            }
            return isLt3M;
        },
        handleRemoveChangeExcelChIoSt(file, fileList) {
            var filelists = [];
            this.ruleForm.statementTemplateIoExcelCn = '';
            this.formDataChIoExcelSt.smallModelPhoto = filelists;
        },
        handleSuccessChangeExcelChIoSt(response, file, fileList) { //上传成功后在图片框显示图片
            this.$message.success('上传成功')
            this.ruleForm.statementTemplateIoExcelCn = "http://doc.yctop.com/" + response.key;
        },
        //IO EN St Excel
        beforeAvatarUploadExcelEnIoSt(file) {
          this.uptoken.key = this.buildUploadFileKey(file, "statement", 'excel', 'en');
            const isLt3M = file.size < 3 * 1024 * 1024;
            if (!isLt3M) {
                this.$message.error('上传模板大小不能超过 3MB!');
            }
            if (isLt3M) {
                this.ruleForm.statementTemplateIoExcelEn = "http://doc.yctop.com/" + this.uptoken.key
            }
            return isLt3M;
        },
        handleRemoveChangeExcelEnIoSt(file, fileList) {
            var filelists = [];
            this.ruleForm.statementTemplateIoExcelEn = '';
            this.formDataEnIoExcelSt.smallModelPhoto = filelists;
        },
        handleSuccessChangeExcelEnIoSt(response, file, fileList) { //上传成功后在图片框显示图片
            this.$message.success('上传成功')
            this.ruleForm.statementTemplateIoExcelEn = "http://doc.yctop.com/" + response.key;
        },
			//
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
				//管理员账户不允许存在@和.
				if (this.ruleForm.adminName.indexOf("@") !== -1 || this.ruleForm.adminName.indexOf(".") !== -1) {
					this.openError('管理员账户不允许录入@和.');
					return;
				}
				this.$refs[formName].validate((valid) => {
					if (valid) {
						this.ruleForm.adminEmail = this.ruleForm.adminEmail.toLowerCase();
						this.ruleForm.rcEmail = this.ruleForm.rcEmail.toLowerCase();
						let params = JSON.stringify(this.ruleForm);
						this.$axios.post2('/hrs/org',
								params)
							.then(function(response) {
								if (response.data.code == 0) {
									this.openSuccess();
									this.queryList();
									this.handleClose();
								} else {
									this.openError(response.data.data.messageInfo);
								}
							}.bind(this)).catch(function(error) {
								let errorinfo = error.response.data.messageInfo;
								//唯一性错误
								if (errorinfo.indexOf('Duplicate entry') > -1) {
									if (errorinfo.indexOf('IDU_hrs_org_org_code') > -1)
										this.openError('企业编码不可重复');
									else if (errorinfo.indexOf('IDU_hrs_org_org_name') > -1)
										this.openError('签约客户名称不可重复');
									else if (errorinfo.indexOf('IDU_hrs_org_short_name') > -1)
										this.openError('签约客户简称不可重复');
									else if (errorinfo.indexOf('IDU_hrs_org_org_ename') > -1)
										this.openError('签约客户英文名称不可重复');
									else if (errorinfo.indexOf('IDU_hrs_org_short_ename') > -1)
										this.openError('签约客户英文简称不可重复');
									else if (errorinfo.indexOf('IDU_hrs_org_social_creodeE6D8') > -1)
										this.openError('统一社会信用代码不可重复');
								} else {
									this.openError(errorinfo);
								}
							}.bind(this));

					} else {
						console.log('error submit!!');
						return false;
					}
				});

			},
			resetForm(formName) {
				this.$refs[formName].resetFields();
			},
			selectGet(val) {
				let obj = {};
				obj = this.options.find((item) => {
					return item.value === val;
				});
				console.log(obj);
				this.ruleForm.socialCreditCode = obj.social_credit_code;
				this.ruleForm.orgName = obj.label;
				this.ruleForm.orgEname = obj.coop_ename;
				this.ruleForm.shortName = obj.short_name;
				this.ruleForm.shortEname = obj.short_ename;
				this.ruleForm.adminTel = obj.phone_number;
				this.ruleForm.coopId = obj.value;
				this.ruleForm.orgCode = obj.coop_code;
			},
			handleOrgSealUploadBefore(file) {
				//				if(this.ruleForm.orgCode == '' || this.ruleForm.orgCode == null) {
				//					this.openError("请填写企业编码后再上传印章")
				//					return false
				//				} else if(this.ruleForm.orgCode.length != 6) {
				//					this.openError("请正确填写企业编码后再上传印章")
				//					return false
				//				}

				if (file.type != 'image/png') {
					this.openError("上传印章格式为PNG")
					return false
				}
        let fileSealCheck = /[\u4e00-\u9fa5\s+]+/g;
        if(fileSealCheck.test(file.name)){
          this.openError("上传印章名称不能带有中文及空格");
          return false
        }
				this.uptoken.key = "OrgSeal_" + new Date().getTime() + "_" + file.name;
				let _this = this
				const isSize = new Promise(function(resolve, reject) {
					let width = 300;
					let height = 300;
					let _URL = window.URL || window.webkitURL;
					let img = new Image();
					img.onload = function() {
						let valid = img.width === width && img.height === height;
						valid ? resolve() : reject();
					}
					img.src = _URL.createObjectURL(file);
				}).then(() => {
					return file;
				}, () => {
					this.openError('印章尺寸限制为300 x 300')
					return Promise.reject();
				});
				return isSize;
			},
			handleRemoveOrgSeal(file, fileList) {
				this.ruleForm.orgSeal = '';
				this.orgSealUploadFileList = [];
			},
			handleSuccessOrgSeal(response, file, fileList) {
				this.$message.success('上传成功')
				this.ruleForm.orgSeal = "http://doc.yctop.com/" + response.key;
			},
			clickorgLogo() {
				if (this.ruleForm.orgLogo != null && this.ruleForm.orgLogo !== '') {
					this.$message.error('只能上传一个文件')
				}
			},
			clickshortLogo() {
				if (this.ruleForm.shortLogo != null && this.ruleForm.shortLogo !== '') {
					this.$message.error('只能上传一个文件')
        }
      },
      clickorgSeal() {
        if (this.ruleForm.orgSeal != null && this.ruleForm.orgSeal !== '') {
          this.$message.error('只能上传一个文件')
        }
      },
      // 关闭
      handleClose() {
        this.$emit('update:visible', false);
      },
      buildUploadFileKey(file, business, fileType, lang) {
        let orgUuid = localStorage.getItem("orgUuid");
        return 'org/config/' + orgUuid + "/template_" + business + "_" + fileType + "_" + lang + "_" + new Date().format("yyMMddhhmmss") + file.name.substring(file.name.lastIndexOf('.'));
      }
    }
	}
</script>
<style scoped>
	.el-form-item__content3 {
		line-height: 8px !important;
		position: relative;
		font-size: 14px;
	}
</style>
