<template>
	<el-dialog title="" width="695px" :visible.sync="visible" :close-on-press-escape="false" :close-on-click-modal="false" :before-close="handleClose" append-to-body>
		<el-form :disabled="loading" :model="ruleForm" :rules="rules" ref="ruleForm" class="hrsPersonalEdit-ruleForm">
      <div style="margin-top: -15px;margin-bottom: 20px;">
        <span style="font-size: large;margin-bottom: 20px; margin-left: 15px;">个人信息</span>
        <el-link :href="helpDocumentUrl" target="_blank" :underline="false" type="primary" icon="el-icon-question" style="top:-3px" v-if="helpDocumentUrl">
        </el-link>
      </div>
			<el-row>
				<el-col class="elementWidth">
					<el-form-item prop="deptId" label-width="15px">
						<el-input v-model="ruleForm.orgName" auto-complete="off" style="width: 643px;" disabled>
							<template slot="prepend">注册公司</template>
						</el-input>
					</el-form-item>
				</el-col>
			</el-row>
			<el-row>
				<el-col class="elementWidth">
					<el-form-item prop="userName" label-width="15px">
						<el-input v-model="ruleForm.userName" auto-complete="off" style="width: 252px;" disabled>
							<template slot="prepend">中文姓名</template>
						</el-input>
					</el-form-item>
				</el-col>
				<el-col class="elementWidth">
					<el-form-item prop="userEname" required label-width="15px">
						<el-input class="widthWithThreeWithXing" v-model="ruleForm.userEname" auto-complete="off" style="width: 377px;" clearable>
							<template slot="prepend">
								<font style="color: red;">*</font>
								<span>英文名</span>
							</template>
						</el-input>
					</el-form-item>
				</el-col>
			</el-row>
			<el-row>
				<el-col class="elementWidth afOrderLinkTwoInput">
					<el-form-item prop="phoneNumber" required label-width="15px">
						<el-input class="widthWithThreeWithXing" auto-complete="off" style="width:178px;">
							<template slot="prepend">
								<font style="color: red;">*</font>
								<span>手机号</span>
							</template>
							<el-select class="phoneSelect" slot="suffix" v-model="ruleForm.internationalCountryCode" placeholder="" style="width: 108px;margin-right: -5px;" disabled>
								<el-option v-for="item in internationalCountryCodes" :key="item.edicode1" :label="item.paramText" :value="item.edicode1">
								</el-option>
							</el-select>
						</el-input>
						<el-input class="phoneNumberStyle" v-model="ruleForm.phoneNumber" auto-complete="off" style="width: 462px;" clearable disabled>
						</el-input>
					</el-form-item>
				</el-col>
			</el-row>
			<el-row>
				<el-col class="elementWidth">
					<el-form-item prop="userEmail" required label-width="15px">
						<el-input class="widthWithTwoWithXing" v-model="ruleForm.userEmail" auto-complete="off" style="width: 645px;" clearable :disabled="userEmailFlag">
							<template slot="prepend">
								<font style="color: red;">*</font>
								<span>邮箱</span>
							</template>
						</el-input>
					</el-form-item>
				</el-col>
			</el-row>
      <div style="padding:15px 0px 10px 15px;width: 660px">
        <HR color="#eee" size="5">
        </HR>
      </div>
      <div style="padding:0px 0px 0px 30px">
        <span>订单配置</span>
        <el-button type="text" size="small" v-if=showOrderFlag v-on:click="showOrderFlag=false">收起<i class="el-icon-arrow-down"></i></el-button>
        <el-button type="text" size="small" v-if=!showOrderFlag v-on:click="showOrderFlag=true">展开<i class="el-icon-arrow-up"></i></el-button>
        <el-row v-show="showOrderFlag">
          <el-col class="elementWidth" style="margin-left: 15px;">
            <el-form-item prop="orderEditNewPage">
              <el-input auto-complete="off" style="width:254px;">
                <template slot="prepend">
                  <font style="color: red;">*</font>
                  <span>订单编辑时开启新窗口</span>
                </template>
                <el-select class="phoneSelect" slot="suffix" v-model="ruleForm.orderEditNewPage" filterable style="width:90px;margin-right: -5px;">
                  <el-option label="是" value="1"></el-option>
                  <el-option label="否" value="0"></el-option>
                </el-select>
              </el-input>
            </el-form-item>
          </el-col>
          <el-col class="elementWidth" style="margin-left: 25px;">
            <el-form-item prop="orderSaveClosePage">
              <el-input auto-complete="off" style="width:250px;">
                <template slot="prepend">
                  <font style="color: red;">*</font>
                  <span>订单保存后关闭编辑窗</span>
                </template>
                <el-select class="phoneSelect" slot="suffix" v-model="ruleForm.orderSaveClosePage" filterable style="width:88px;margin-right: -5px;">
                  <el-option label="是" value="1"></el-option>
                  <el-option label="否" value="0"></el-option>
                </el-select>
              </el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row v-show="showOrderFlag">
          <el-col class="elementWidth" style="margin-left: 0px;">
            <el-form-item prop="orderAeDigitsWeight" label-width="15px">
              <font class="phoneNumberStyle">AE订单小数位</font>
              <el-input v-model="ruleForm.orderAeDigitsWeight" auto-complete="off" style="width: 150px;" @input="formatToNumber('orderAeDigitsWeight')">
                <template slot="prepend">
                  <font style="color: red;">*</font>
                  <span>毛重</span>
                </template>
              </el-input>
            </el-form-item>
          </el-col>
          <el-col class="elementWidth" style="margin-left: 10px;">
            <el-form-item prop="orderAeDigitsVolume" label-width="15px">
              <el-input v-model="ruleForm.orderAeDigitsVolume" auto-complete="off" style="width: 150px;" @input="formatToNumber('orderAeDigitsVolume')">
                <template slot="prepend">
                  <font style="color: red;">*</font>
                  <span>体积</span>
                </template>
              </el-input>
            </el-form-item>
          </el-col>
          <el-col class="elementWidth" style="margin-left: 10px;">
            <el-form-item prop="orderAeDigitsChargeWeight" label-width="15px">
              <el-input class="widthWithTwo" v-model="ruleForm.orderAeDigitsChargeWeight" auto-complete="off" style="width: 160px;" @input="formatToNumber('orderAeDigitsChargeWeight')">
                <template slot="prepend">
                  <font style="color: red;">*</font>
                  <span>计重</span>
                </template>
              </el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row v-show="showOrderFlag">
          <el-col class="elementWidth" style="margin-left: 3px;">
            <el-form-item prop="orderAiDigitsWeight" label-width="15px">
              <font class="phoneNumberStyle">AI订单小数位</font>
              <el-input v-model="ruleForm.orderAiDigitsWeight" auto-complete="off" style="width: 150px;" @input="formatToNumber('orderAiDigitsWeight')">
                <template slot="prepend">
                  <font style="color: red;">*</font>
                  <span>毛重</span>
                </template>
              </el-input>
            </el-form-item>
          </el-col>
          <el-col class="elementWidth" style="margin-left: 10px;">
            <el-form-item prop="orderAiDigitsVolume" label-width="15px">
              <el-input v-model="ruleForm.orderAiDigitsVolume" auto-complete="off" style="width: 150px;" @input="formatToNumber('orderAiDigitsVolume')">
                <template slot="prepend">
                  <font style="color: red;">*</font>
                  <span>体积</span>
                </template>
              </el-input>
            </el-form-item>
          </el-col>
          <el-col class="elementWidth" style="margin-left: 10px;">
            <el-form-item prop="orderAiDigitsChargeWeight" label-width="15px">
              <el-input class="widthWithTwo" v-model="ruleForm.orderAiDigitsChargeWeight" auto-complete="off" style="width: 160px;" @input="formatToNumber('orderAiDigitsChargeWeight')">
                <template slot="prepend">
                  <font style="color: red;">*</font>
                  <span>计重</span>
                </template>
              </el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row v-show="showOrderFlag">
          <el-col class="elementWidth" >
            <el-form-item prop="orderSeDigitsWeight" label-width="15px">
              <font class="phoneNumberStyle">SE订单小数位</font>
              <el-input v-model="ruleForm.orderSeDigitsWeight" auto-complete="off" style="width: 150px;" @input="formatToNumber('orderSeDigitsWeight')">
                <template slot="prepend">
                  <font style="color: red;">*</font>
                  <span>毛重</span>
                </template>
              </el-input>
            </el-form-item>
          </el-col>
          <el-col class="elementWidth" style="margin-left: 10px;">
            <el-form-item prop="orderSeDigitsVolume" label-width="15px">
              <el-input v-model="ruleForm.orderSeDigitsVolume" auto-complete="off" style="width: 150px;" @input="formatToNumber('orderSeDigitsVolume')">
                <template slot="prepend">
                  <font style="color: red;">*</font>
                  <span>体积</span>
                </template>
              </el-input>
            </el-form-item>
          </el-col>
          <el-col class="elementWidth" style="margin-left: 10px;">
            <el-form-item prop="orderSeDigitsChargeWeight" label-width="15px">
              <el-input v-model="ruleForm.orderSeDigitsChargeWeight" auto-complete="off" style="width: 160px;" @input="formatToNumber('orderSeDigitsChargeWeight')">
                <template slot="prepend">
                  <font style="color: red;">*</font>
                  <span>计费吨</span>
                </template>
              </el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row v-show="showOrderFlag">
          <el-col class="elementWidth" style="margin-left: 3px;">
            <el-form-item prop="orderSiDigitsWeight" label-width="15px">
              <font class="phoneNumberStyle">SI订单小数位</font>
              <el-input v-model="ruleForm.orderSiDigitsWeight" auto-complete="off" style="width: 150px;" @input="formatToNumber('orderSiDigitsWeight')">
                <template slot="prepend">
                  <font style="color: red;">*</font>
                  <span>毛重</span>
                </template>
              </el-input>
            </el-form-item>
          </el-col>
          <el-col class="elementWidth" style="margin-left: 10px;">
            <el-form-item prop="orderSiDigitsVolume" label-width="15px">
              <el-input v-model="ruleForm.orderSiDigitsVolume" auto-complete="off" style="width: 150px;" @input="formatToNumber('orderSiDigitsVolume')">
                <template slot="prepend">
                  <font style="color: red;">*</font>
                  <span>体积</span>
                </template>
              </el-input>
            </el-form-item>
          </el-col>
          <el-col class="elementWidth" style="margin-left: 10px;">
            <el-form-item prop="orderSiDigitsChargeWeight" label-width="15px">
              <el-input v-model="ruleForm.orderSiDigitsChargeWeight" auto-complete="off" style="width: 160px;" @input="formatToNumber('orderSiDigitsChargeWeight')">
                <template slot="prepend">
                  <font style="color: red;">*</font>
                  <span>计费吨</span>
                </template>
              </el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row v-show="showOrderFlag">
          <el-col class="elementWidth" >
            <el-form-item prop="orderTeDigitsWeight" label-width="15px">
              <font class="phoneNumberStyle">TE订单小数位</font>
              <el-input v-model="ruleForm.orderTeDigitsWeight" auto-complete="off" style="width: 150px;" @input="formatToNumber('orderTeDigitsWeight')">
                <template slot="prepend">
                  <font style="color: red;">*</font>
                  <span>毛重</span>
                </template>
              </el-input>
            </el-form-item>
          </el-col>
          <el-col class="elementWidth" style="margin-left: 10px;">
            <el-form-item prop="orderTeDigitsVolume" label-width="15px">
              <el-input v-model="ruleForm.orderTeDigitsVolume" auto-complete="off" style="width: 150px;" @input="formatToNumber('orderTeDigitsVolume')">
                <template slot="prepend">
                  <font style="color: red;">*</font>
                  <span>体积</span>
                </template>
              </el-input>
            </el-form-item>
          </el-col>
          <el-col class="elementWidth" style="margin-left: 10px;">
            <el-form-item prop="orderTeDigitsChargeWeight" label-width="15px">
              <el-input v-model="ruleForm.orderTeDigitsChargeWeight" auto-complete="off" style="width: 160px;" @input="formatToNumber('orderTeDigitsChargeWeight')">
                <template slot="prepend">
                  <font style="color: red;">*</font>
                  <span>计费吨</span>
                </template>
              </el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row v-show="showOrderFlag">
          <el-col class="elementWidth" >
            <el-form-item prop="orderTiDigitsWeight" label-width="15px">
              <font class="phoneNumberStyle" style="margin-right: 15px !important;">TI订单小数位</font>
              <el-input v-model="ruleForm.orderTiDigitsWeight" auto-complete="off" style="width: 150px;" @input="formatToNumber('orderTiDigitsWeight')">
                <template slot="prepend">
                  <font style="color: red;">*</font>
                  <span>毛重</span>
                </template>
              </el-input>
            </el-form-item>
          </el-col>
          <el-col class="elementWidth" style="margin-left: 10px;">
            <el-form-item prop="orderTiDigitsVolume" label-width="15px">
              <el-input v-model="ruleForm.orderTiDigitsVolume" auto-complete="off" style="width: 150px;" @input="formatToNumber('orderTiDigitsVolume')">
                <template slot="prepend">
                  <font style="color: red;">*</font>
                  <span>体积</span>
                </template>
              </el-input>
            </el-form-item>
          </el-col>
          <el-col class="elementWidth" style="margin-left: 10px;">
            <el-form-item prop="orderTiDigitsChargeWeight" label-width="15px">
              <el-input v-model="ruleForm.orderTiDigitsChargeWeight" auto-complete="off" style="width: 160px;" @input="formatToNumber('orderTiDigitsChargeWeight')">
                <template slot="prepend">
                  <font style="color: red;">*</font>
                  <span>计费吨</span>
                </template>
              </el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row v-show="showOrderFlag">
          <el-col class="elementWidth" >
            <el-form-item prop="orderLcDigitsWeight" label-width="15px">
              <font class="phoneNumberStyle">LC订单小数位</font>
              <el-input v-model="ruleForm.orderLcDigitsWeight" auto-complete="off" style="width: 150px;" @input="formatToNumber('orderLcDigitsWeight')">
                <template slot="prepend">
                  <font style="color: red;">*</font>
                  <span>毛重</span>
                </template>
              </el-input>
            </el-form-item>
          </el-col>
          <el-col class="elementWidth" style="margin-left: 10px;">
            <el-form-item prop="orderLcDigitsVolume" label-width="15px">
              <el-input v-model="ruleForm.orderLcDigitsVolume" auto-complete="off" style="width: 150px;" @input="formatToNumber('orderLcDigitsVolume')">
                <template slot="prepend">
                  <font style="color: red;">*</font>
                  <span>体积</span>
                </template>
              </el-input>
            </el-form-item>
          </el-col>
          <el-col class="elementWidth" style="margin-left: 10px;">
            <el-form-item prop="orderLcDigitsChargeWeight" label-width="15px">
              <el-input v-model="ruleForm.orderLcDigitsChargeWeight" auto-complete="off" style="width: 160px;" @input="formatToNumber('orderLcDigitsChargeWeight')">
                <template slot="prepend">
                  <font style="color: red;">*</font>
                  <span>计费吨</span>
                </template>
              </el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row v-show="showOrderFlag">
          <el-col class="elementWidth" >
            <el-form-item prop="orderIoDigitsWeight" label-width="15px">
              <font class="phoneNumberStyle">IO订单小数位</font>
              <el-input v-model="ruleForm.orderIoDigitsWeight" auto-complete="off" style="width: 150px;" @input="formatToNumber('orderIoDigitsWeight')">
                <template slot="prepend">
                  <font style="color: red;">*</font>
                  <span>毛重</span>
                </template>
              </el-input>
            </el-form-item>
          </el-col>
          <el-col class="elementWidth" style="margin-left: 10px;">
            <el-form-item prop="orderIoDigitsVolume" label-width="15px">
              <el-input v-model="ruleForm.orderIoDigitsVolume" auto-complete="off" style="width: 150px;" @input="formatToNumber('orderIoDigitsVolume')">
                <template slot="prepend">
                  <font style="color: red;">*</font>
                  <span>体积</span>
                </template>
              </el-input>
            </el-form-item>
          </el-col>
          <el-col class="elementWidth" style="margin-left: 10px;">
            <el-form-item prop="orderIoDigitsChargeWeight" label-width="15px">
              <el-input v-model="ruleForm.orderIoDigitsChargeWeight" auto-complete="off" style="width: 160px;" @input="formatToNumber('orderIoDigitsChargeWeight')">
                <template slot="prepend">
                  <font style="color: red;">*</font>
                  <span>计费吨</span>
                </template>
              </el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </div>
			<div style="padding:15px 0px 10px 15px;width: 660px">
				<HR color="#eee" size="5">
				</HR>
			</div>
			<div style="padding:0px 0px 0px 30px">
				<span>邮箱配置</span>
				<el-button type="text" size="small" v-if=showFlag1 v-on:click="showFlag1=false">收起<i class="el-icon-arrow-down"></i></el-button>
				<el-button type="text" size="small" v-if=!showFlag1 v-on:click="showFlag1=true">展开<i class="el-icon-arrow-up"></i></el-button>
				<el-row v-show="showFlag1">
					<el-col class="elementWidth" style="margin-left: 50px;">
						<el-form-item>
							<span>提示：建议使用163邮箱 或 邮件服务(SMTP)支持25端口的邮箱发送。</span>
						</el-form-item>
					</el-col>
				</el-row>
				<el-row v-show="showFlag1">
					<el-col class="elementWidth" style="margin-left: 50px;">
						<el-form-item prop="mailValid1">
							<el-input class="widthWithFour" auto-complete="off" style="width:167px;">
								<template slot="prepend">
									<span>是否启用</span>
								</template>
								<el-select class="phoneSelect" slot="suffix" v-model="ruleForm.mailValid1" filterable style="width:96px;margin-right: -5px;">
									<el-option label="是" value="1"></el-option>
									<el-option label="否" value="0"></el-option>
								</el-select>
							</el-input>
						</el-form-item>
					</el-col>
					<el-col class="elementWidth">
						<el-form-item prop="mailName" label-width="15px">
							<el-input class="widthWithThreeWithXing" v-model="ruleForm.mailName" auto-complete="off" style="width: 397px;" clearable maxlength="20">
								<template slot="prepend">
									<font style="color: red;">*</font>
									<span>发件人</span>
								</template>
							</el-input>
						</el-form-item>
					</el-col>
				</el-row>
				<el-row v-show="showFlag1" v-if="loginTypeFlag">
					<el-col class="elementWidth" style="margin-left: 36px;">
						<el-form-item prop="mailAddress" label-width="15px">
							<el-input class="widthWithFourWithXing" v-model="ruleForm.mailAddress" auto-complete="off" style="width: 453px;" clearable>
								<template slot="prepend">
									<font style="color: red;">*</font>
									<span>邮箱地址</span>
								</template>
							</el-input>
						</el-form-item>
					</el-col>
				</el-row>
				<el-row v-show="showFlag1">
					<el-col class="elementWidth" style="margin-left: 36px;">
						<el-form-item prop="mailSmtp" label-width="15px">
							<el-input class="widthWithFourEWithXing" v-model="ruleForm.mailSmtp" auto-complete="off" style="width: 578px;" clearable maxlength="100">
								<template slot="prepend">
									<font style="color: red;">*</font>
									<span>SMTP</span>
								</template>
							</el-input>
						</el-form-item>
					</el-col>
				</el-row>
				<el-row v-show="showFlag1">
					<el-col class="elementWidth" style="margin-left: 50px;">
						<el-form-item prop="mailSsl">
							<el-input class="widthWithThreeE" auto-complete="off" style="width:167px;">
								<template slot="prepend">
									<span>SSL</span>
								</template>
								<el-select class="phoneSelect" slot="suffix" v-model="ruleForm.mailSsl" @change="changeMailSsl" style="width:96px;margin-right: -5px;">
									<el-option label="是" :value="true"></el-option>
									<el-option label="否" :value="false"></el-option>
								</el-select>
							</el-input>
						</el-form-item>
					</el-col>
					<el-col class="elementWidth">
						<el-form-item prop="mailPort" label-width="15px">
							<el-input class="widthWithTwoWithXing" auto-complete="off" style="width: 397px;">
								<template slot="prepend">
									<font style="color: red;">*</font>
									<span>端口</span>
								</template>
								<el-select class="phoneSelect" slot="suffix" v-model="ruleForm.mailPort" style="width:327px;margin-right: -5px;" clearable>
									<el-option label="25" :value="25"></el-option>
									<el-option label="454" :value="454"></el-option>
									<el-option label="465" :value="465"></el-option>
									<el-option label="587" :value="587"></el-option>
									<el-option label="994" :value="994"></el-option>
								</el-select>
							</el-input>
						</el-form-item>
					</el-col>
				</el-row>
				<el-row v-show="showFlag1">
					<el-col class="elementWidth" style="margin-left: 36px;">
						<el-form-item prop="mailUser" label-width="15px">
							<el-input class="widthWithThreeWithXing" v-model="ruleForm.mailUser" auto-complete="off" style="width: 578px;" clearable maxlength="100">
								<template slot="prepend">
									<font style="color: red;">*</font>
									<span>用户名</span>
								</template>
							</el-input>
						</el-form-item>
					</el-col>
				</el-row>
				<el-row v-show="showFlag1">
					<el-col class="elementWidth" style="margin-left: 36px;">
						<el-form-item prop="mailVerifyCode1" label-width="15px">
							<el-input class="widthWithTwoWithXing" v-model="ruleForm.mailVerifyCode" style="width: 578px;" clearable maxlength="100" type="password" autocomplete="new-password">
								<template slot="prepend">
									<font style="color: red;">*</font>
									<span>密码</span>
								</template>
								<el-button :loading="testButtonLoading" slot="append" @click="testEmail">验证邮箱</el-button>
							</el-input>
						</el-form-item>
					</el-col>
				</el-row>
        <el-row v-show="showFlag1">
          <el-col class="" style="margin-left: 50px; width: 578px">
            <el-form-item prop="" label="邮件签名">
              <el-input type="textarea" rows="5" v-model="ruleForm.mailSignature" show-word-limit maxlength="200"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
			</div>
      <div style="padding:15px 0px 10px 15px;width: 660px">
        <HR color="#eee" size="5">
        </HR>
      </div>
      <div style="padding:0px 0px 0px 30px">
        <span>默认抄送人</span>
        <el-button type="text" size="small" v-if=showCcUserFlag v-on:click="showCcUserFlag=false">收起<i class="el-icon-arrow-down"></i></el-button>
        <el-button type="text" size="small" v-if=!showCcUserFlag v-on:click="showCcUserFlag=true">展开<i class="el-icon-arrow-up"></i></el-button>
        <el-row v-show="showCcUserFlag">
          <el-col class="elementWidth" style="margin-left: 15px;">
            <el-form-item label="" label-width="10px">
              <el-input style="width:610px;">
                <template slot="prepend">订单跟踪码</template>
                <el-select slot="suffix" v-model="ruleForm.orderTrackCcUser" filterable multiple clearable placeholder="请选择抄送人" style="width: 530px;margin-right: -5px;">
                  <el-option v-for="(ccUser,index) in ccUsers" :key="index" :label="`${ccUser.label}<${ccUser.label4}>`" :value="ccUser.value">
                  </el-option>
                </el-select>
              </el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row v-show="showCcUserFlag">
          <el-col class="elementWidth" style="margin-left: 15px;">
            <el-form-item label="" label-width="10px">
              <el-input style="width:610px;">
                <template slot="prepend">送货通知码</template>
                <el-select slot="suffix" v-model="ruleForm.sendGoodsNotifyCcUser" filterable multiple clearable placeholder="请选择抄送人" style="width: 530px;margin-right: -5px;">
                  <el-option v-for="(ccUser,index) in ccUsers" :key="index" :label="`${ccUser.label}<${ccUser.label4}>`" :value="ccUser.value">
                  </el-option>
                </el-select>
              </el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row v-show="showCcUserFlag">
          <el-col class="elementWidth" style="margin-left: 15px;">
            <el-form-item label="" label-width="10px">
              <el-input style="width:610px;" class="widthWithSendBillCcUser">
                <template slot="prepend">发送账单</template>
                <el-select slot="suffix" v-model="ruleForm.sendBillCcUser" filterable multiple clearable placeholder="请选择抄送人" style="width: 530px;margin-right: -5px;">
                  <el-option v-for="(ccUser,index) in ccUsers" :key="index" :label="`${ccUser.label}<${ccUser.label4}>`" :value="ccUser.value">
                  </el-option>
                </el-select>
              </el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row v-show="showCcUserFlag">
          <el-col class="elementWidth" style="margin-left: 15px;">
            <el-form-item label="" label-width="10px">
              <el-input style="width:610px;" class="widthWithSendBillCcUser">
                <template slot="prepend">发送清单</template>
                <el-select slot="suffix" v-model="ruleForm.sendInventoryCcUser" filterable multiple clearable placeholder="请选择抄送人" style="width: 530px;margin-right: -5px;">
                  <el-option v-for="(ccUser,index) in ccUsers" :key="index" :label="`${ccUser.label}<${ccUser.label4}>`" :value="ccUser.value">
                  </el-option>
                </el-select>
              </el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </div>

			<el-row>
				<el-form-item style="margin-left: 15px;">
					<el-button size="small" type="primary" @click="resetForm('ruleForm')" :loading="loading" plain>清空</el-button>
					<el-button size="small" type="primary" @click="submitForm('ruleForm')" :loading="loading">确定</el-button>
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
			//frow: Object
		},
		data() {
			return {
				ruleForm: {
					userId: '',
					orgName: '',
					userEmail: '',
					phoneNumber: '',
					userName: '',
					userEname: '',
					internationalCountryCode: '',
					loginRole: '',
					mailValid1: '0',
					mailValid: false,
					mailName: '',
					mailAddress: '',
					mailSmtp: '',
					mailUser: '',
					mailVerifyCode: '',
					mailVerifyCode1: '',
					mailSsl: false,
					mailPort: 25,
          mailSignature: '',
          orderEditNewPage: '0',
          orderSaveClosePage: '0',
          orderAeDigitsWeight: 1,
          orderAeDigitsVolume: 3,
          orderAeDigitsChargeWeight: 2,
          orderAiDigitsWeight: 1,
          orderAiDigitsVolume: 3,
          orderAiDigitsChargeWeight: 2,
          orderSeDigitsWeight:3,
          orderSeDigitsVolume:3,
          orderSeDigitsChargeWeight:3,
          orderSiDigitsWeight:3,
          orderSiDigitsVolume:3,
          orderSiDigitsChargeWeight:3,
          orderTeDigitsWeight:3,
          orderTeDigitsVolume:3,
          orderTeDigitsChargeWeight:3,
          orderTiDigitsWeight:3,
          orderTiDigitsVolume:3,
          orderTiDigitsChargeWeight:3,
          orderLcDigitsWeight:1,
          orderLcDigitsVolume:3,
          orderLcDigitsChargeWeight:2,
          orderIoDigitsWeight:1,
          orderIoDigitsVolume:3,
          orderIoDigitsChargeWeight:2,
          orderTrackCcUser: [],
          sendGoodsNotifyCcUser: [],
          sendBillCcUser: [],
          sendInventoryCcUser: [],
				},
				userEmailFlag: false,
				internationalCountryCodes: [],
				showFlag1: false,
        showOrderFlag: false,
				loginTypeFlag: false,
        showCcUserFlag: false,
				testButtonLoading: false,
				userEmailOld: '',
				mailNameOld: '',
				mailAddressOld: '',
				mailSmtpOld: '',
				mailUserOld: '',
				mailVerifyCodeOld: '',
        helpDocumentUrl: '',
        ccUsers: [],
				rules: {
					userEmail: [{
							required: true,
							message: '请输入邮箱',
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
					userEname: [{
							required: true,
							message: '请输入英文名',
							trigger: ['blur', 'change']
						},
						{
							min: 1,
							max: 40,
							message: '长度不超过 40',
							trigger: ['blur', 'change']
						}
					],
					phoneNumber: [{
							required: true,
							message: '请输入手机号',
							trigger: ['blur', 'change']
						},
						{
							min: 0,
							max: 30,
							message: '手机号长度不超过 30',
							trigger: ['blur', 'change']
						}
					],
					mailAddress: [{
							type: 'email',
							message: '请输入正确的邮箱地址',
							trigger: ['blur', 'change']
						},
						{
							min: 0,
							max: 100,
							message: '邮箱地址长度不超过 100',
							trigger: ['blur', 'change']
						}
					],
          orderEditNewPage: [{
              required: true,
              message: '请选择订单编辑时开启新窗口',
              trigger: ['blur', 'change']
          }
          ],
          orderSaveClosePage: [{
              required: true,
              message: '请选择订单保存后关闭编辑窗',
              trigger: ['blur', 'change']
          }
          ],
          orderAeDigitsWeight: [{
              required: true,
              message: '请输入AE毛重小数位数 0-2',
              trigger: ['blur', 'change']
          }
          ],
          orderAeDigitsVolume: [{
              required: true,
              message: '请输入AE体积小数位数 0-3',
              trigger: ['blur', 'change']
          }
          ],
          orderAeDigitsChargeWeight: [{
              required: true,
              message: '请输入AE计重小数位数 0-2',
              trigger: ['blur', 'change']
          }
          ],
          orderAiDigitsWeight: [{
              required: true,
              message: '请输入AI毛重小数位数 0-2',
              trigger: ['blur', 'change']
          }
          ],
          orderAiDigitsVolume: [{
              required: true,
              message: '请输入AI体积小数位数 0-3',
              trigger: ['blur', 'change']
          }
          ],
          orderAiDigitsChargeWeight: [{
              required: true,
              message: '请输入AI计重小数位数 0-2',
              trigger: ['blur', 'change']
          }
          ],
          orderSeDigitsWeight: [{
              required: true,
              message: '请输入SE毛重小数位数 0-3',
              trigger: ['blur', 'change']
          }
          ],
          orderSeDigitsVolume: [{
              required: true,
              message: '请输入SE体积小数位数 0-3',
              trigger: ['blur', 'change']
          }
          ],
          orderSeDigitsChargeWeight: [{
              required: true,
              message: '请输入SE计费吨小数位数 0-3',
              trigger: ['blur', 'change']
          }
          ],
          orderSiDigitsWeight: [{
              required: true,
              message: '请输入SI毛重小数位数 0-3',
              trigger: ['blur', 'change']
          }
          ],
          orderSiDigitsVolume: [{
              required: true,
              message: '请输入SI体积小数位数 0-3',
              trigger: ['blur', 'change']
          },
          ],
          orderSiDigitsChargeWeight: [{
              required: true,
              message: '请输入SI计费吨小数位数 0-3',
              trigger: ['blur', 'change']
          },
          ],
          orderTeDigitsWeight: [{
              required: true,
              message: '请输入TE毛重小数位数 0-3',
              trigger: ['blur', 'change']
          }
          ],
          orderTeDigitsVolume: [{
              required: true,
              message: '请输入TE体积小数位数 0-3',
              trigger: ['blur', 'change']
          },
          ],
          orderTeDigitsChargeWeight: [{
              required: true,
              message: '请输入TE计费吨小数位数 0-3',
              trigger: ['blur', 'change']
          },
          ],
          orderTiDigitsWeight: [{
              required: true,
              message: '请输入TI毛重小数位数 0-3',
              trigger: ['blur', 'change']
          }
          ],
          orderTiDigitsVolume: [{
              required: true,
              message: '请输入TI体积小数位数 0-3',
              trigger: ['blur', 'change']
          },
          ],
          orderTiDigitsChargeWeight: [{
              required: true,
              message: '请输入TI计费吨小数位数 0-3',
              trigger: ['blur', 'change']
          },
          ],
          orderLcDigitsWeight: [{
              required: true,
              message: '请输入LC毛重小数位数 0-2',
              trigger: ['blur', 'change']
          }
          ],
          orderLcDigitsVolume: [{
              required: true,
              message: '请输入LC体积小数位数 0-3',
              trigger: ['blur', 'change']
          },
          ],
          orderLcDigitsChargeWeight: [{
              required: true,
              message: '请输入LC计费吨小数位数 0-2',
              trigger: ['blur', 'change']
          },
          ],
          orderIoDigitsWeight: [{
              required: true,
              message: '请输入IO毛重小数位数 0-2',
              trigger: ['blur', 'change']
          }
          ],
          orderIoDigitsVolume: [{
              required: true,
              message: '请输入IO体积小数位数 0-3',
              trigger: ['blur', 'change']
          },
          ],
          orderIoDigitsChargeWeight: [{
              required: true,
              message: '请输入IO计费吨小数位数 0-2',
              trigger: ['blur', 'change']
          },
          ],
				},
				loading: false
			};
		},
		methods: {
      formatToNumber(item) {
          if(item == 'orderAeDigitsWeight') {
              this.ruleForm.orderAeDigitsWeight = this.ruleForm.orderAeDigitsWeight.replace(/[^012]/g, "");
              if(this.ruleForm.orderAeDigitsWeight.length > 1){
                  this.ruleForm.orderAeDigitsWeight = this.ruleForm.orderAeDigitsWeight.substring(0,1);
              }
          }
          if(item == 'orderAeDigitsVolume') {
              this.ruleForm.orderAeDigitsVolume = this.ruleForm.orderAeDigitsVolume.replace(/[^0123]/g, "");
              if(this.ruleForm.orderAeDigitsVolume.length > 1){
                  this.ruleForm.orderAeDigitsVolume = this.ruleForm.orderAeDigitsVolume.substring(0,1);
              }
          }
          if(item == 'orderAeDigitsChargeWeight') {
              this.ruleForm.orderAeDigitsChargeWeight = this.ruleForm.orderAeDigitsChargeWeight.replace(/[^012]/g, "");
              if(this.ruleForm.orderAeDigitsChargeWeight.length > 1){
                  this.ruleForm.orderAeDigitsChargeWeight = this.ruleForm.orderAeDigitsChargeWeight.substring(0,1);
              }
          }

          if(item == 'orderAiDigitsWeight') {
              this.ruleForm.orderAiDigitsWeight = this.ruleForm.orderAiDigitsWeight.replace(/[^012]/g, "");
              if(this.ruleForm.orderAiDigitsWeight.length > 1){
                  this.ruleForm.orderAiDigitsWeight = this.ruleForm.orderAiDigitsWeight.substring(0,1);
              }
          }
          if(item == 'orderAiDigitsVolume') {
              this.ruleForm.orderAiDigitsVolume = this.ruleForm.orderAiDigitsVolume.replace(/[^0123]/g, "");
              if(this.ruleForm.orderAiDigitsVolume.length > 1){
                  this.ruleForm.orderAiDigitsVolume = this.ruleForm.orderAiDigitsVolume.substring(0,1);
              }
          }
          if(item == 'orderAiDigitsChargeWeight') {
              this.ruleForm.orderAiDigitsChargeWeight = this.ruleForm.orderAiDigitsChargeWeight.replace(/[^012]/g, "");
              if(this.ruleForm.orderAiDigitsChargeWeight.length > 1){
                  this.ruleForm.orderAiDigitsChargeWeight = this.ruleForm.orderAiDigitsChargeWeight.substring(0,1);
              }
          }

          if(item == 'orderSeDigitsWeight') {
              this.ruleForm.orderSeDigitsWeight = this.ruleForm.orderSeDigitsWeight.replace(/[^0123]/g, "");
              if(this.ruleForm.orderSeDigitsWeight.length > 1){
                  this.ruleForm.orderSeDigitsWeight = this.ruleForm.orderSeDigitsWeight.substring(0,1);
              }
          }
          if(item == 'orderSeDigitsVolume') {
              this.ruleForm.orderSeDigitsVolume = this.ruleForm.orderSeDigitsVolume.replace(/[^0123]/g, "");
              if(this.ruleForm.orderSeDigitsVolume.length > 1){
                  this.ruleForm.orderSeDigitsVolume = this.ruleForm.orderSeDigitsVolume.substring(0,1);
              }
          }
          if(item == 'orderSeDigitsChargeWeight') {
              this.ruleForm.orderSeDigitsChargeWeight = this.ruleForm.orderSeDigitsChargeWeight.replace(/[^0123]/g, "");
              if(this.ruleForm.orderSeDigitsChargeWeight.length > 1){
                  this.ruleForm.orderSeDigitsChargeWeight = this.ruleForm.orderSeDigitsChargeWeight.substring(0,1);
              }
          }

          if(item == 'orderSiDigitsWeight') {
              this.ruleForm.orderSiDigitsWeight = this.ruleForm.orderSiDigitsWeight.replace(/[^0123]/g, "");
              if(this.ruleForm.orderSiDigitsWeight.length > 1){
                  this.ruleForm.orderSiDigitsWeight = this.ruleForm.orderSiDigitsWeight.substring(0,1);
              }
          }
          if(item == 'orderSiDigitsVolume') {
              this.ruleForm.orderSiDigitsVolume = this.ruleForm.orderSiDigitsVolume.replace(/[^0123]/g, "");
              if(this.ruleForm.orderSiDigitsVolume.length > 1){
                  this.ruleForm.orderSiDigitsVolume = this.ruleForm.orderSiDigitsVolume.substring(0,1);
              }
          }
          if(item == 'orderSiDigitsChargeWeight') {
              this.ruleForm.orderSiDigitsChargeWeight = this.ruleForm.orderSiDigitsChargeWeight.replace(/[^0123]/g, "");
              if(this.ruleForm.orderSiDigitsChargeWeight.length > 1){
                  this.ruleForm.orderSiDigitsChargeWeight = this.ruleForm.orderSiDigitsChargeWeight.substring(0,1);
              }
          }

          //TE
          if(item == 'orderTeDigitsWeight') {
              this.ruleForm.orderTeDigitsWeight = this.ruleForm.orderTeDigitsWeight.replace(/[^0123]/g, "");
              if(this.ruleForm.orderTeDigitsWeight.length > 1){
                  this.ruleForm.orderTeDigitsWeight = this.ruleForm.orderTeDigitsWeight.substring(0,1);
              }
          }
          if(item == 'orderTeDigitsVolume') {
              this.ruleForm.orderTeDigitsVolume = this.ruleForm.orderTeDigitsVolume.replace(/[^0123]/g, "");
              if(this.ruleForm.orderTeDigitsVolume.length > 1){
                  this.ruleForm.orderTeDigitsVolume = this.ruleForm.orderTeDigitsVolume.substring(0,1);
              }
          }
          if(item == 'orderTeDigitsChargeWeight') {
              this.ruleForm.orderTeDigitsChargeWeight = this.ruleForm.orderTeDigitsChargeWeight.replace(/[^0123]/g, "");
              if(this.ruleForm.orderTeDigitsChargeWeight.length > 1){
                  this.ruleForm.orderTeDigitsChargeWeight = this.ruleForm.orderTeDigitsChargeWeight.substring(0,1);
              }
          }
          //TI
          if(item == 'orderTiDigitsWeight') {
              this.ruleForm.orderTiDigitsWeight = this.ruleForm.orderTiDigitsWeight.replace(/[^0123]/g, "");
              if(this.ruleForm.orderTiDigitsWeight.length > 1){
                  this.ruleForm.orderTiDigitsWeight = this.ruleForm.orderTiDigitsWeight.substring(0,1);
              }
          }
          if(item == 'orderTiDigitsVolume') {
              this.ruleForm.orderTiDigitsVolume = this.ruleForm.orderTiDigitsVolume.replace(/[^0123]/g, "");
              if(this.ruleForm.orderTiDigitsVolume.length > 1){
                  this.ruleForm.orderTiDigitsVolume = this.ruleForm.orderTiDigitsVolume.substring(0,1);
              }
          }
          if(item == 'orderTiDigitsChargeWeight') {
              this.ruleForm.orderTiDigitsChargeWeight = this.ruleForm.orderTiDigitsChargeWeight.replace(/[^0123]/g, "");
              if(this.ruleForm.orderTiDigitsChargeWeight.length > 1){
                  this.ruleForm.orderTiDigitsChargeWeight = this.ruleForm.orderTiDigitsChargeWeight.substring(0,1);
              }
          }

          //LC
          if(item == 'orderLcDigitsWeight') {
              this.ruleForm.orderLcDigitsWeight = this.ruleForm.orderLcDigitsWeight.replace(/[^012]/g, "");
              if(this.ruleForm.orderLcDigitsWeight.length > 1){
                  this.ruleForm.orderLcDigitsWeight = this.ruleForm.orderLcDigitsWeight.substring(0,1);
              }
          }
          if(item == 'orderLcDigitsVolume') {
              this.ruleForm.orderLcDigitsVolume = this.ruleForm.orderLcDigitsVolume.replace(/[^0123]/g, "");
              if(this.ruleForm.orderLcDigitsVolume.length > 1){
                  this.ruleForm.orderLcDigitsVolume = this.ruleForm.orderLcDigitsVolume.substring(0,1);
              }
          }
          if(item == 'orderLcDigitsChargeWeight') {
              this.ruleForm.orderLcDigitsChargeWeight = this.ruleForm.orderLcDigitsChargeWeight.replace(/[^012]/g, "");
              if(this.ruleForm.orderLcDigitsChargeWeight.length > 1){
                  this.ruleForm.orderLcDigitsChargeWeight = this.ruleForm.orderLcDigitsChargeWeight.substring(0,1);
              }
          }
          //IO
          if(item == 'orderIoDigitsWeight') {
              this.ruleForm.orderIoDigitsWeight = this.ruleForm.orderIoDigitsWeight.replace(/[^012]/g, "");
              if(this.ruleForm.orderIoDigitsWeight.length > 1){
                  this.ruleForm.orderIoDigitsWeight = this.ruleForm.orderIoDigitsWeight.substring(0,1);
              }
          }
          if(item == 'orderIoDigitsVolume') {
              this.ruleForm.orderIoDigitsVolume = this.ruleForm.orderIoDigitsVolume.replace(/[^0123]/g, "");
              if(this.ruleForm.orderIoDigitsVolume.length > 1){
                  this.ruleForm.orderIoDigitsVolume = this.ruleForm.orderIoDigitsVolume.substring(0,1);
              }
          }
          if(item == 'orderIoDigitsChargeWeight') {
              this.ruleForm.orderIoDigitsChargeWeight = this.ruleForm.orderIoDigitsChargeWeight.replace(/[^012]/g, "");
              if(this.ruleForm.orderIoDigitsChargeWeight.length > 1){
                  this.ruleForm.orderIoDigitsChargeWeight = this.ruleForm.orderIoDigitsChargeWeight.substring(0,1);
              }
          }
      },
			testEmail() {
				let loginRole = window.localStorage.getItem('loginRole');
				if (loginRole == 'admin') {
					if (this.ruleForm.mailAddress == '' || this.ruleForm.mailAddress == null) {
						this.openError('邮箱不能为空');
						return;
					}
				} else {
					if (this.ruleForm.userEmail == '' || this.ruleForm.userEmail == null) {
						this.openError('邮箱地址不能为空');
						return;
					}
				}
				if (this.ruleForm.mailSmtp == '' || this.ruleForm.mailSmtp == null) {
					this.openError('SMTP不能为空');
					return;
				}
				if (this.ruleForm.mailPort == '' || this.ruleForm.mailPort == null) {
					this.openError('端口不能为空');
					return;
				}
				if (this.ruleForm.mailVerifyCode == '' || this.ruleForm.mailVerifyCode == null) {
					this.openError('密码不能为空');
					return;
				}
				this.testButtonLoading = true
				this.$axios.post2('/hrs/user/checkEmail', this.ruleForm)
					.then(function(response) {
						if (response.data.code == 0) {
							if (response.data.data) {
								this.openSuccessInfo("验证成功");
							} else {
								this.openErrorInfo("验证失败");
							}
							this.testButtonLoading = false
						} else {
							this.testButtonLoading = false
							this.openError(response.data.messageInfo);
						}
					}.bind(this)).catch(function(error) {
						this.testButtonLoading = false
						this.openError(error.response.data.messageInfo);
					}.bind(this));
			},
			handInputPassword(value) {
				if (value.length > this.ruleForm.mailVerifyCode.length) {
					//输入值
					this.ruleForm.mailVerifyCode += value.charAt(value.length - 1);
				} else {
					//回删值
					this.ruleForm.mailVerifyCode = this.ruleForm.mailVerifyCode.substr(0, value.length);
				}
				this.ruleForm.mailVerifyCode1 = value.replace(/./g, "*");
			},
			openSuccess() {
				this.$notify({
					title: '',
					message: '操作成功',
					type: 'success',
					position: 'bottom-right'
				});
			},
			openSuccessInfo(info) {
				this.$notify({
					title: '',
					message: info,
					type: 'success',
					position: 'bottom-right'
				});
			},
			openSuccess1() {
				this.$notify({
					title: '',
					message: '提示：邮箱信息修改后 需要重新登录系统才会生效',
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
			},openErrorInfo(info) {
				this.$notify({
					title: '',
					message:  info,
					type: 'error',
					position: 'bottom-right'
				});
			},
			submitForm(formName) {
				//判断配置邮箱信息和邮箱是否有变化
				let isNeedVerify = 'unNeed';
				if ((this.userEmailOld != null && this.userEmailOld != '') && (this.ruleForm.userEmail != null && this.ruleForm.userEmail != '') && (this.userEmailOld != this.ruleForm.userEmail)) {
					isNeedVerify = 'need';
				} else if ((this.userEmailOld != null && this.userEmailOld != '') && (this.ruleForm.userEmail == null || this.ruleForm.userEmail == '')) {
					isNeedVerify = 'need';
				} else if ((this.userEmailOld == null || this.userEmailOld == '') && (this.ruleForm.userEmail != null && this.ruleForm.userEmail != '')) {
					isNeedVerify = 'need';
				}
				if ((this.mailNameOld != null && this.mailNameOld != '') && (this.ruleForm.mailName != null && this.ruleForm.mailName != '') && (this.mailNameOld != this.ruleForm.mailName)) {
					isNeedVerify = 'need';
				} else if ((this.mailNameOld != null && this.mailNameOld != '') && (this.ruleForm.mailName == null || this.ruleForm.mailName == '')) {
					isNeedVerify = 'need';
				} else if ((this.mailNameOld == null || this.mailNameOld == '') && (this.ruleForm.mailName != null && this.ruleForm.mailName != '')) {
					isNeedVerify = 'need';
				}
				if ((this.mailAddressOld != null && this.mailAddressOld != '') && (this.ruleForm.mailAddress != null && this.ruleForm.mailAddress != '') && (this.mailAddressOld != this.ruleForm.mailAddress)) {
					isNeedVerify = 'need';
				} else if ((this.mailAddressOld != null && this.mailAddressOld != '') && (this.ruleForm.mailAddress == null || this.ruleForm.mailAddress == '')) {
					isNeedVerify = 'need';
				} else if ((this.mailAddressOld == null || this.mailAddressOld == '') && (this.ruleForm.mailAddress != null && this.ruleForm.mailAddress != '')) {
					isNeedVerify = 'need';
				}
				if ((this.mailSmtpOld != null && this.mailSmtpOld != '') && (this.ruleForm.mailSmtp != null && this.ruleForm.mailSmtp != '') && (this.mailSmtpOld != this.ruleForm.mailSmtp)) {
					isNeedVerify = 'need';
				} else if ((this.mailSmtpOld != null && this.mailSmtpOld != '') && (this.ruleForm.mailSmtp == null || this.ruleForm.mailSmtp == '')) {
					isNeedVerify = 'need';
				} else if ((this.mailSmtpOld == null || this.mailSmtpOld == '') && (this.ruleForm.mailSmtp != null && this.ruleForm.mailSmtp != '')) {
					isNeedVerify = 'need';
				}
				if ((this.mailUserOld != null && this.mailUserOld != '') && (this.ruleForm.mailUser != null && this.ruleForm.mailUser != '') && (this.mailUserOld != this.ruleForm.mailUser)) {
					isNeedVerify = 'need';
				} else if ((this.mailUserOld != null && this.mailUserOld != '') && (this.ruleForm.mailUser == null || this.ruleForm.mailUser == '')) {
					isNeedVerify = 'need';
				} else if ((this.mailUserOld == null || this.mailUserOld == '') && (this.ruleForm.mailUser != null && this.ruleForm.mailUser != '')) {
					isNeedVerify = 'need';
				}
				if ((this.mailVerifyCodeOld != null && this.mailVerifyCodeOld != '') && (this.ruleForm.mailVerifyCode != null && this.ruleForm.mailVerifyCode != '') && (this.mailVerifyCodeOld != this.ruleForm.mailVerifyCode)) {
					isNeedVerify = 'need';
				} else if ((this.mailVerifyCodeOld != null && this.mailVerifyCodeOld != '') && (this.ruleForm.mailVerifyCode == null || this.ruleForm.mailVerifyCode == '')) {
					isNeedVerify = 'need';
				} else if ((this.mailVerifyCodeOld == null || this.mailVerifyCodeOld == '') && (this.ruleForm.mailVerifyCode != null && this.ruleForm.mailVerifyCode != '')) {
					isNeedVerify = 'need';
				}

				if (this.ruleForm.internationalCountryCode == '') {
					this.openError('区号不能为空');
					return;
				}
				//如果启用：则邮箱信息 都必填
				if (this.ruleForm.mailValid1 == '1') {
					if (this.ruleForm.mailName == '' || this.ruleForm.mailName == null) {
						this.openError('发件人不能为空');
						return;
					}
					let loginRole = window.localStorage.getItem('loginRole');
					if (loginRole == 'admin') {
						if (this.ruleForm.mailAddress == '' || this.ruleForm.mailAddress == null) {
							this.openError('邮箱地址不能为空');
							return;
						}
					}
					if (this.ruleForm.mailSmtp == '' || this.ruleForm.mailSmtp == null) {
						this.openError('SMTP不能为空');
						return;
					}
					if (this.ruleForm.mailPort == '' || this.ruleForm.mailPort == null) {
						this.openError('端口不能为空');
						return;
					}
					if (this.ruleForm.mailUser == '' || this.ruleForm.mailUser == null) {
						this.openError('用户名不能为空');
						return;
					}
					if (this.ruleForm.mailVerifyCode == '' || this.ruleForm.mailVerifyCode == null) {
						this.openError('密码不能为空');
						return;
					}
				}
				if (this.ruleForm.mailValid1 == '1') {
					this.ruleForm.mailValid = true;
				} else {
					this.ruleForm.mailValid = false;
				}
				let orderEditNewPage = ''
        if (this.ruleForm.orderEditNewPage == '1') {
            orderEditNewPage = true;
        } else {
            orderEditNewPage = false;
        }
        let orderSaveClosePage = ''
        if (this.ruleForm.orderSaveClosePage == '1') {
            orderSaveClosePage = true;
        } else {
            orderSaveClosePage = false;
        }
				this.$refs[formName].validate((valid) => {
					if (valid) {
						this.loading = true
						this.ruleForm.userEmail = this.ruleForm.userEmail.toLowerCase();
						let params;
						if (this.userEmailFlag == true) {
							params = {
								userId: this.ruleForm.userId,
								loginRole: this.ruleForm.loginRole,
								userEname: this.ruleForm.userEname,
								mailValid: this.ruleForm.mailValid,
								mailName: this.ruleForm.mailName,
								mailAddress: this.ruleForm.mailAddress,
								mailSmtp: this.ruleForm.mailSmtp,
								mailUser: this.ruleForm.mailUser,
								mailVerifyCode: this.ruleForm.mailVerifyCode,
								mailSsl: this.ruleForm.mailSsl,
								mailPort: this.ruleForm.mailPort,
                mailSignature: this.ruleForm.mailSignature,
                orderEditNewPage: orderEditNewPage,
                orderSaveClosePage: orderSaveClosePage,
                orderAeDigitsWeight: this.ruleForm.orderAeDigitsWeight,
                orderAeDigitsVolume:this.ruleForm.orderAeDigitsVolume,
                orderAeDigitsChargeWeight:this.ruleForm.orderAeDigitsChargeWeight,
                orderAiDigitsWeight:this.ruleForm.orderAiDigitsWeight,
                orderAiDigitsVolume:this.ruleForm.orderAiDigitsVolume,
                orderAiDigitsChargeWeight:this.ruleForm.orderAiDigitsChargeWeight,
                orderSeDigitsWeight:this.ruleForm.orderSeDigitsWeight,
                orderSeDigitsVolume:this.ruleForm.orderSeDigitsVolume,
                orderSeDigitsChargeWeight:this.ruleForm.orderSeDigitsChargeWeight,
                orderSiDigitsWeight:this.ruleForm.orderSiDigitsWeight,
                orderSiDigitsVolume:this.ruleForm.orderSiDigitsVolume,
                orderSiDigitsChargeWeight:this.ruleForm.orderSiDigitsChargeWeight,
                orderTeDigitsWeight:this.ruleForm.orderTeDigitsWeight,
                orderTeDigitsVolume:this.ruleForm.orderTeDigitsVolume,
                orderTeDigitsChargeWeight:this.ruleForm.orderTeDigitsChargeWeight,
                orderTiDigitsWeight:this.ruleForm.orderTiDigitsWeight,
                orderTiDigitsVolume:this.ruleForm.orderTiDigitsVolume,
                orderTiDigitsChargeWeight:this.ruleForm.orderTiDigitsChargeWeight,
                orderLcDigitsWeight:this.ruleForm.orderLcDigitsWeight,
                orderLcDigitsVolume:this.ruleForm.orderLcDigitsVolume,
                orderLcDigitsChargeWeight:this.ruleForm.orderLcDigitsChargeWeight,
                orderIoDigitsWeight:this.ruleForm.orderIoDigitsWeight,
                orderIoDigitsVolume:this.ruleForm.orderIoDigitsVolume,
                orderIoDigitsChargeWeight:this.ruleForm.orderIoDigitsChargeWeight,
                orderTrackCcUser:this.ruleForm.orderTrackCcUser,
                sendGoodsNotifyCcUser:this.ruleForm.sendGoodsNotifyCcUser,
                sendBillCcUser:this.ruleForm.sendBillCcUser,
                sendInventoryCcUser:this.ruleForm.sendInventoryCcUser,
							}
						} else {
							params = {
								userId: this.ruleForm.userId,
								loginRole: this.ruleForm.loginRole,
								userEname: this.ruleForm.userEname,
								userEmail: this.ruleForm.userEmail,
								mailValid: this.ruleForm.mailValid,
								mailName: this.ruleForm.mailName,
								mailAddress: this.ruleForm.mailAddress,
								mailSmtp: this.ruleForm.mailSmtp,
								mailUser: this.ruleForm.mailUser,
								mailVerifyCode: this.ruleForm.mailVerifyCode,
								mailSsl: this.ruleForm.mailSsl,
								mailPort: this.ruleForm.mailPort,
                mailSignature: this.ruleForm.mailSignature,
                orderEditNewPage: orderEditNewPage,
                orderSaveClosePage: orderSaveClosePage,
                orderAeDigitsWeight: this.ruleForm.orderAeDigitsWeight,
                orderAeDigitsVolume:this.ruleForm.orderAeDigitsVolume,
                orderAeDigitsChargeWeight:this.ruleForm.orderAeDigitsChargeWeight,
                orderAiDigitsWeight:this.ruleForm.orderAiDigitsWeight,
                orderAiDigitsVolume:this.ruleForm.orderAiDigitsVolume,
                orderAiDigitsChargeWeight:this.ruleForm.orderAiDigitsChargeWeight,
                orderSeDigitsWeight:this.ruleForm.orderSeDigitsWeight,
                orderSeDigitsVolume:this.ruleForm.orderSeDigitsVolume,
                orderSeDigitsChargeWeight:this.ruleForm.orderSeDigitsChargeWeight,
                orderSiDigitsWeight:this.ruleForm.orderSiDigitsWeight,
                orderSiDigitsVolume:this.ruleForm.orderSiDigitsVolume,
                orderSiDigitsChargeWeight:this.ruleForm.orderSiDigitsChargeWeight,
                orderTeDigitsWeight:this.ruleForm.orderTeDigitsWeight,
                orderTeDigitsVolume:this.ruleForm.orderTeDigitsVolume,
                orderTeDigitsChargeWeight:this.ruleForm.orderTeDigitsChargeWeight,
                orderTiDigitsWeight:this.ruleForm.orderTiDigitsWeight,
                orderTiDigitsVolume:this.ruleForm.orderTiDigitsVolume,
                orderTiDigitsChargeWeight:this.ruleForm.orderTiDigitsChargeWeight,
                orderLcDigitsWeight:this.ruleForm.orderLcDigitsWeight,
                orderLcDigitsVolume:this.ruleForm.orderLcDigitsVolume,
                orderLcDigitsChargeWeight:this.ruleForm.orderLcDigitsChargeWeight,
                orderIoDigitsWeight:this.ruleForm.orderIoDigitsWeight,
                orderIoDigitsVolume:this.ruleForm.orderIoDigitsVolume,
                orderIoDigitsChargeWeight:this.ruleForm.orderIoDigitsChargeWeight,
                orderTrackCcUser:this.ruleForm.orderTrackCcUser,
                sendGoodsNotifyCcUser:this.ruleForm.sendGoodsNotifyCcUser,
                sendBillCcUser:this.ruleForm.sendBillCcUser,
                sendInventoryCcUser:this.ruleForm.sendInventoryCcUser,
							}
						}
						this.$axios.put('/hrs/user/editPersonal', params)
							.then(function(response) {
								if (response.data.code == 0) {
                  if (this.ruleForm.orderEditNewPage == '1') {
                      localStorage.setItem('orderEditNewPage', true);
                  } else {
                      localStorage.setItem('orderEditNewPage', false);
                  }
                  if (this.ruleForm.orderSaveClosePage == '1') {
                      localStorage.setItem('orderSaveClosePage', true);
                  } else {
                      localStorage.setItem('orderSaveClosePage', false);
                  }
									this.loading = false
									if (isNeedVerify == 'need') {
										this.openSuccess1();
									} else {
										this.openSuccess();
									}
									this.handleClose();
								} else {
									this.loading = false
									//唯一性错误
									let errorinfo = response.data.messageInfo;
									this.openError(errorinfo);
								}
							}.bind(this)).catch(function(error) {
								this.loading = false
                this.openError(error.response.data.messageInfo);
							}.bind(this));
					} else {
						console.log('error submit!!');
						return false;
					}
				});
			},
			resetForm(formName) {
				this.ruleForm.userEname = ''
				if (this.userEmailFlag == false) {
					this.ruleForm.userEmail = ''
				}
				this.ruleForm.mailValid1 = '0';
				this.ruleForm.mailValid = false;
				this.ruleForm.mailName = '';
				this.ruleForm.mailAddress = '';
				this.ruleForm.mailSmtp = '';
				this.ruleForm.mailUser = '';
				this.ruleForm.mailVerifyCode = '';
				this.ruleForm.mailVerifyCode1 = '';
				this.ruleForm.mailSsl = false;
				this.ruleForm.mailPort = 25;
        this.ruleForm.orderEditNewPage = '0';
        this.ruleForm.orderSaveClosePage = '0';
        this.ruleForm.orderAeDigitsWeight = 1;
        this.ruleForm.orderAeDigitsVolume = 3;
        this.ruleForm.orderAeDigitsChargeWeight = 2;
        this.ruleForm.orderAiDigitsWeight = 1;
        this.ruleForm.orderAiDigitsVolume = 3;
        this.ruleForm.orderAiDigitsChargeWeight = 2;
        this.ruleForm.orderSeDigitsWeight = 3;
        this.ruleForm.orderSeDigitsVolume = 3;
        this.ruleForm.orderSeDigitsChargeWeight = 3;
        this.ruleForm.orderSiDigitsWeight = 3;
        this.ruleForm.orderSiDigitsVolume = 3;
        this.ruleForm.orderSiDigitsChargeWeight = 3;
        this.ruleForm.orderTeDigitsWeight = 3;
        this.ruleForm.orderTeDigitsVolume = 3;
        this.ruleForm.orderTeDigitsChargeWeight = 3;
        this.ruleForm.orderTiDigitsWeight = 3;
        this.ruleForm.orderTiDigitsVolume = 3;
        this.ruleForm.orderTiDigitsChargeWeight = 3;
        this.ruleForm.orderIoDigitsWeight = 1;
        this.ruleForm.orderIoDigitsVolume = 3;
        this.ruleForm.orderIoDigitsChargeWeight = 2;
        this.ruleForm.orderTrackCcUser = [];
        this.ruleForm.sendGoodsNotifyCcUser = [];
        this.ruleForm.sendBillCcUser = [];
        this.ruleForm.sendInventoryCcUser = [];
			},
			// 关闭
			handleClose() {
				this.$emit('update:visible', false);
			},
			changeMailSsl(){
				if(this.ruleForm.mailSsl){
					this.ruleForm.mailPort = 465
				}else{
					this.ruleForm.mailPort = 25
				}
			},
			init() {
				let loginRole = window.localStorage.getItem('loginRole');
				if (loginRole == 'admin') {
					this.loginTypeFlag = true;
				}
				let orgName = window.localStorage.getItem('orgName');
				let userId = window.localStorage.getItem('userId');
				this.ruleForm.orgName = orgName;
				this.ruleForm.userId = userId;
				this.ruleForm.loginRole = loginRole;
				this.$axios.get('/hrs/user/' + userId)
					.then(function(response) {
						if (response.data.code == 0) {
							this.ruleForm.userEmail = response.data.data.userEmail;
							this.userEmailOld = response.data.data.userEmail;
							this.ruleForm.phoneNumber = response.data.data.phoneNumber;
							this.ruleForm.userName = response.data.data.userName;
							this.ruleForm.userEname = response.data.data.userEname;
							this.ruleForm.internationalCountryCode = response.data.data.internationalCountryCode;
              this.ruleForm.orderTrackCcUser = response.data.data.orderTrackCcUser;
              this.ruleForm.sendGoodsNotifyCcUser = response.data.data.sendGoodsNotifyCcUser;
              this.ruleForm.sendBillCcUser = response.data.data.sendBillCcUser;
              this.ruleForm.sendInventoryCcUser = response.data.data.sendInventoryCcUser;

							if (response.data.data.mailValid == '' || response.data.data.mailValid == null) {
								this.ruleForm.mailValid1 = '0';
								this.ruleForm.mailValid = false;
							} else {
								if (response.data.data.mailValid == true) {
									this.ruleForm.mailValid1 = '1';
									this.ruleForm.mailValid = true;
								} else {
									this.ruleForm.mailValid1 = '0';
									this.ruleForm.mailValid = false;
								}
							}
							if (response.data.data.mailName == '' || response.data.data.mailName == null) {
								this.ruleForm.mailName = response.data.data.userName;
								this.mailNameOld = response.data.data.userName;
							} else {
								this.ruleForm.mailName = response.data.data.mailName;
								this.mailNameOld = response.data.data.mailName;
							}
							this.ruleForm.mailAddress = response.data.data.mailAddress;
							this.mailAddressOld = response.data.data.mailAddress;
							this.ruleForm.mailSmtp = response.data.data.mailSmtp;
							this.mailSmtpOld = response.data.data.mailSmtp;
							if (response.data.data.mailSsl == '' || response.data.data.mailSsl == null) {
								this.ruleForm.mailSsl = false;
							} else {
								this.ruleForm.mailSsl = response.data.data.mailSsl;
							}
							if (response.data.data.mailPort == '' || response.data.data.mailPort == null) {
								this.ruleForm.mailPort = 25;
							} else {
								this.ruleForm.mailPort = response.data.data.mailPort;
							}
							if (response.data.data.mailUser == '' || response.data.data.mailUser == null) {
								this.ruleForm.mailUser = response.data.data.userEmail;
								this.mailUserOld = response.data.data.userEmail;
							} else {
								this.ruleForm.mailUser = response.data.data.mailUser;
								this.mailUserOld = response.data.data.mailUser;
							}
							if (response.data.data.mailVerifyCode == '' || response.data.data.mailVerifyCode == null) {
								this.ruleForm.mailVerifyCode = '';
								this.ruleForm.mailVerifyCode1 = '';
								this.mailVerifyCodeOld = response.data.data.mailVerifyCode;
							} else {
								this.ruleForm.mailVerifyCode = response.data.data.mailVerifyCode;
								this.ruleForm.mailVerifyCode1 = response.data.data.mailVerifyCode.replace(/./g, "*");
								this.mailVerifyCodeOld = response.data.data.mailVerifyCode;
							}
							this.ruleForm.mailSignature = response.data.data.mailSignature;
              if (this.ruleForm.userEmail == '' || this.ruleForm.userEmail == null) {
								this.userEmailFlag = false;
							} else {
								this.userEmailFlag = true;
							}
              if (response.data.data.orderEditNewPage == '' || response.data.data.orderEditNewPage == null) {
                  this.ruleForm.orderEditNewPage = '0';
              } else {
                  if (response.data.data.orderEditNewPage == true) {
                      this.ruleForm.orderEditNewPage = '1';
                  } else {
                      this.ruleForm.orderEditNewPage = '0';
                  }
              }
              if (response.data.data.orderSaveClosePage == '' || response.data.data.orderSaveClosePage == null) {
                  this.ruleForm.orderSaveClosePage = '0';
              } else {
                  if (response.data.data.orderSaveClosePage == true) {
                      this.ruleForm.orderSaveClosePage = '1';
                  } else {
                      this.ruleForm.orderSaveClosePage = '0';
                  }
              }
              //订单小数位数赋值
              if (response.data.data.orderAeDigitsWeight != '' && response.data.data.orderAeDigitsWeight != null || response.data.data.orderAeDigitsWeight == 0) {
                  this.ruleForm.orderAeDigitsWeight = response.data.data.orderAeDigitsWeight;
              }
              if (response.data.data.orderAeDigitsVolume != '' && response.data.data.orderAeDigitsVolume != null || response.data.data.orderAeDigitsVolume == 0) {
                  this.ruleForm.orderAeDigitsVolume = response.data.data.orderAeDigitsVolume;
              }
              if (response.data.data.orderAeDigitsChargeWeight != '' && response.data.data.orderAeDigitsChargeWeight != null || response.data.data.orderAeDigitsChargeWeight == 0) {
                  this.ruleForm.orderAeDigitsChargeWeight = response.data.data.orderAeDigitsChargeWeight;
              }
              if (response.data.data.orderAiDigitsWeight != '' && response.data.data.orderAiDigitsWeight != null || response.data.data.orderAiDigitsWeight == 0) {
                  this.ruleForm.orderAiDigitsWeight = response.data.data.orderAiDigitsWeight;
              }
              if (response.data.data.orderAiDigitsVolume != '' && response.data.data.orderAiDigitsVolume != null || response.data.data.orderAiDigitsVolume == 0) {
                  this.ruleForm.orderAiDigitsVolume = response.data.data.orderAiDigitsVolume;
              }
              if (response.data.data.orderAiDigitsChargeWeight != '' && response.data.data.orderAiDigitsChargeWeight != null || response.data.data.orderAiDigitsChargeWeight == 0) {
                  this.ruleForm.orderAiDigitsChargeWeight = response.data.data.orderAiDigitsChargeWeight;
              }
              if (response.data.data.orderSeDigitsWeight != '' && response.data.data.orderSeDigitsWeight != null || response.data.data.orderSeDigitsWeight == 0) {
                  this.ruleForm.orderSeDigitsWeight = response.data.data.orderSeDigitsWeight;
              }
              if (response.data.data.orderSeDigitsVolume != '' && response.data.data.orderSeDigitsVolume != null || response.data.data.orderSeDigitsVolume == 0) {
                  this.ruleForm.orderSeDigitsVolume = response.data.data.orderSeDigitsVolume;
              }
              if (response.data.data.orderSeDigitsChargeWeight != '' && response.data.data.orderSeDigitsChargeWeight != null || response.data.data.orderSeDigitsChargeWeight == 0) {
                  this.ruleForm.orderSeDigitsChargeWeight = response.data.data.orderSeDigitsChargeWeight;
              }
              if (response.data.data.orderSiDigitsWeight != '' && response.data.data.orderSiDigitsWeight != null || response.data.data.orderSiDigitsWeight == 0) {
                  this.ruleForm.orderSiDigitsWeight = response.data.data.orderSiDigitsWeight;
              }
              if (response.data.data.orderSiDigitsVolume != '' && response.data.data.orderSiDigitsVolume != null || response.data.data.orderSiDigitsVolume == 0) {
                  this.ruleForm.orderSiDigitsVolume = response.data.data.orderSiDigitsVolume;
              }
              if (response.data.data.orderSiDigitsChargeWeight != '' && response.data.data.orderSiDigitsChargeWeight != null || response.data.data.orderSiDigitsChargeWeight == 0) {
                  this.ruleForm.orderSiDigitsChargeWeight = response.data.data.orderSiDigitsChargeWeight;
              }

              //TE
              if (response.data.data.orderTeDigitsWeight != '' && response.data.data.orderTeDigitsWeight != null || response.data.data.orderTeDigitsWeight == 0) {
                  this.ruleForm.orderTeDigitsWeight = response.data.data.orderTeDigitsWeight;
              }
              if (response.data.data.orderTeDigitsVolume != '' && response.data.data.orderTeDigitsVolume != null || response.data.data.orderTeDigitsVolume == 0) {
                  this.ruleForm.orderTeDigitsVolume = response.data.data.orderTeDigitsVolume;
              }
              if (response.data.data.orderTeDigitsChargeWeight != '' && response.data.data.orderTeDigitsChargeWeight != null || response.data.data.orderTeDigitsChargeWeight == 0) {
                  this.ruleForm.orderTeDigitsChargeWeight = response.data.data.orderTeDigitsChargeWeight;
              }

              //TI
              if (response.data.data.orderTiDigitsWeight != '' && response.data.data.orderTiDigitsWeight != null || response.data.data.orderTiDigitsWeight == 0) {
                this.ruleForm.orderTiDigitsWeight = response.data.data.orderTiDigitsWeight;
              }
              if (response.data.data.orderTiDigitsVolume != '' && response.data.data.orderTiDigitsVolume != null || response.data.data.orderTiDigitsVolume == 0) {
                this.ruleForm.orderTiDigitsVolume = response.data.data.orderTiDigitsVolume;
              }
              if (response.data.data.orderTiDigitsChargeWeight != '' && response.data.data.orderTiDigitsChargeWeight != null || response.data.data.orderTiDigitsChargeWeight == 0) {
                this.ruleForm.orderTiDigitsChargeWeight = response.data.data.orderTiDigitsChargeWeight;
              }
              //LC
              if (response.data.data.orderLcDigitsWeight != '' && response.data.data.orderLcDigitsWeight != null || response.data.data.orderLcDigitsWeight == 0) {
                  this.ruleForm.orderLcDigitsWeight = response.data.data.orderLcDigitsWeight;
              }
              if (response.data.data.orderLcDigitsVolume != '' && response.data.data.orderLcDigitsVolume != null || response.data.data.orderLcDigitsVolume == 0) {
                  this.ruleForm.orderLcDigitsVolume = response.data.data.orderLcDigitsVolume;
              }
              if (response.data.data.orderLcDigitsChargeWeight != '' && response.data.data.orderLcDigitsChargeWeight != null || response.data.data.orderLcDigitsChargeWeight == 0) {
                  this.ruleForm.orderLcDigitsChargeWeight = response.data.data.orderLcDigitsChargeWeight;
              }

              //IO
              if (response.data.data.orderIoDigitsWeight != '' && response.data.data.orderIoDigitsWeight != null || response.data.data.orderIoDigitsWeight == 0) {
                  this.ruleForm.orderIoDigitsWeight = response.data.data.orderIoDigitsWeight;
              }
              if (response.data.data.orderIoDigitsVolume != '' && response.data.data.orderIoDigitsVolume != null || response.data.data.orderIoDigitsVolume == 0) {
                  this.ruleForm.orderIoDigitsVolume = response.data.data.orderIoDigitsVolume;
              }
              if (response.data.data.orderIoDigitsChargeWeight != '' && response.data.data.orderIoDigitsChargeWeight != null || response.data.data.orderIoDigitsChargeWeight == 0) {
                  this.ruleForm.orderIoDigitsChargeWeight = response.data.data.orderIoDigitsChargeWeight;
              }
						}
					}.bind(this));

				//国际电话区域
				this.$axios.get('/hrs/org/listCategory/国际电话区号')
					.then(function(response) {
						this.internationalCountryCodes = response.data.data;
					}.bind(this));

				//个人信息帮助文档
        this.$axios.get('/hrs/permission/' + 374).then(function(response) {
            if (response.data.code == 0) {
                this.helpDocumentUrl = response.data.data.helpDocumentUrl;
            }
        }.bind(this));

        this.$axios.get('/hrs/dept/selectUser').then(function(response) {
            this.ccUsers = response.data.data;
        }.bind(this));
			},
		},
		created() {
			this.init();
		}
	}
</script>
<style type="text/css">
  font.phoneNumberStyle {margin-right: 12px !important;}
  .hrsPersonalEdit-ruleForm .el-input__icon {
    line-height: 30px !important;
  }

  .hrsPersonalEdit-ruleForm .el-form-item__content {
    line-height: 30px !important;
  }

  .hrsPersonalEdit-ruleForm .el-input-group__prepend {
    padding: 0 6px;
  }

  .afOrderLinkTwoInput .el-form-item__content {
		line-height: 30px !important;
	}

  /*.widthWithThreeWithXing .el-input__icon {
		line-height: 30px !important;
	}

  .widthWithTwoWithXing .el-input__icon {
		line-height: 30px !important;
	}

  .widthWithFourWithXing .el-input__icon {
		line-height: 30px !important;
	}

  .widthWithFourEWithXing .el-input__icon {
		line-height: 30px !important;
	}

  .phoneNumberStyle .el-input__icon {
		line-height: 30px !important;
	}*/
  .hrsPersonalEdit-ruleForm .widthWithThreeWithXing .el-input-group__prepend {
    padding: 0 8px;
  }

  .hrsPersonalEdit-ruleForm .widthWithTwoWithXing .el-input-group__prepend {
    padding: 0 15px;
  }

  .hrsPersonalEdit-ruleForm .widthWithTwo .el-input-group__prepend {
    padding: 0 13px;
  }

  .hrsPersonalEdit-ruleForm .widthWithThreeE .el-input-group__prepend {
    padding: 0 23px;
  }

  .hrsPersonalEdit-ruleForm .widthWithFourEWithXing .el-input-group__prepend {
    padding: 0 10px;
  }

  .hrsPersonalEdit-ruleForm .widthWithFour .el-input-group__prepend {
    padding: 0 10px;
  }

  .hrsPersonalEdit-ruleForm .widthWithSendBillCcUser .el-input-group__prepend {
    padding: 0 12px;
  }
</style>
