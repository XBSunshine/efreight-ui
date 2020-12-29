<template>
	<el-dialog title="分单操作 - 新增" width="845px" :visible.sync="visible" :close-on-press-escape="false" :close-on-click-modal="false" :before-close="handleClose">
		<el-form :disabled="loading" :model="ruleForm" :rules="rules" label-width="10px" ref="ruleForm" style="margin-left: 3px;" class="fhlEditPage demo-ruleForm">
			<el-row>
				<el-col class="elementWidth">
			        <el-form-item  prop="awbnumber">
			            <el-input class="widthWithThree" v-model="ruleForm.awbnumber" auto-complete="off" style="width: 260px;" disabled>
			              <template slot="prepend">
			                <span>主单号</span>
			              </template>
			            </el-input>
			        </el-form-item>
				</el-col>
				<el-col class="elementWidth">
		          <el-form-item  prop="hwbnumber">
		            <el-input class="widthWithThreeWithXing" v-model="ruleForm.hwbnumber" auto-complete="off" clearable style="width: 260px;"  @input="formatToFloat('hwbnumber')">
		              <template slot="prepend">
		               	<font style="color: red;">*</font> 
		                <span>分单号</span>
		              </template>
		            </el-input>
		          </el-form-item>
				</el-col>
				<el-col class="elementWidth">
					<el-form-item >
						<el-input auto-complete="off" style="width:260px;">
							<template slot="prepend">
								<span>业务类型</span>
							</template>
							<el-select slot="suffix" v-model="ruleForm.businesstype" placeholder="请选择" style="width:163px;margin-right: -5px;">
								<el-option label="普通运输" value="ANR"></el-option>
								<el-option label="国际快件" value="EMS"></el-option>
								<el-option label="D类快件" value="KJD"></el-option>
							</el-select>
						</el-input>
					</el-form-item>
				</el-col>
			</el-row>
			<el-row>
				<el-col class="elementWidth">
          <el-form-item  prop="totalpiecequantity">
            <el-input class="widthWithTwoWithXing" v-model="ruleForm.totalpiecequantity" auto-complete="off" clearable style="width: 260px;"  @input="formatToFloat('totalpiecequantity')">
              <template slot="prepend">
                <font style="color: red;">*</font> 
                <span>件数</span>
              </template>
            </el-input>
          </el-form-item>
				</el-col>
				<el-col class="elementWidth">
          <el-form-item  prop="totalgrossweight">
            <el-input class="widthWithTwoWithXing" v-model="ruleForm.totalgrossweight" auto-complete="off" clearable style="width: 260px;" @input="formatToFloat('totalgrossweight')">
              <template slot="prepend">
                <font style="color: red;">*</font> 
                <span>重量</span>
              </template>
            </el-input>
          </el-form-item>
				</el-col>
				<el-col class="elementWidth">
          <el-form-item  prop="totalvolumnamount">
            <el-input class="widthWithTwoWithXing" v-model="ruleForm.totalvolumnamount" auto-complete="off" clearable style="width: 260px;" @input="formatToFloat('totalvolumnamount')">
              <template slot="prepend">
                <font style="color: red;">*</font> 
                <span>体积</span>
              </template>
            </el-input>
          </el-form-item>
				</el-col>
			</el-row>
			<el-row>
				<el-col class="elementWidth">
			        <el-form-item  prop="goodsname">
			            <el-input class="widthWithTwoWithXing" v-model="ruleForm.goodsname" auto-complete="off" style="width: 800px;" @input="ruleForm.goodsname = ruleForm.goodsname.toUpperCase()" clearable>
			              <template slot="prepend">
			              	<font style="color: red;">*</font> 
			                <span>品名</span>
			              </template>
			            </el-input>
			        </el-form-item>
				</el-col>
				
				
			</el-row>
			<div style="padding:0px 0px 20px 0px;">
					<HR color="#eee" size="5">
					</HR>
				</div>
			<el-row >
				<!-- <el-col class="elementWidth">
		          <el-form-item  prop="shpcode">
		            <el-input v-model="ruleForm.shpcode" auto-complete="off" clearable style="width: 260px;" @input="ruleForm.shpcode = ruleForm.shpcode.toUpperCase()">
		              <template slot="prepend">
		                
		                <span>发货人代码</span>
		              </template>
		            </el-input>
		          </el-form-item>
				</el-col> -->
				<el-col class="elementWidth">
		          <el-form-item  prop="shipper">
		            <el-input class="widthWithThreeWithXing" v-model="ruleForm.shipper" auto-complete="off" clearable style="width: 530px;" @input="ruleForm.shipper = ruleForm.shipper.toUpperCase()" maxlength="70">
		              <template slot="prepend">
		                <font style="color: red;">*</font> 
		                <span>发货人</span>
		              </template>
		            </el-input>
		          </el-form-item>
				</el-col>
				<el-col class="elementWidth">
		          <el-form-item  prop="shpcountrycode">
		            <el-input class="widthWithFourWithXing" v-model="ruleForm.shpcountrycode" auto-complete="off" clearable style="width: 260px;" @input="ruleForm.shpcountrycode = ruleForm.shpcountrycode.toUpperCase().replace(/[^\w\.\/]/ig,'')" maxlength="2">
		              <template slot="prepend">
		                <font style="color: red;">*</font> 
		                <span>国家代码</span>
		              </template>
		            </el-input>
		          </el-form-item>
				</el-col>
			</el-row>
			<el-row>
				<el-col class="elementWidth">
		          <el-form-item  prop="shpaddress">
		            <el-input  class="widthWithFiveWithXing" v-model="ruleForm.shpaddress" auto-complete="off" clearable style="width: 530px;" @input="ruleForm.shpaddress = ruleForm.shpaddress.toUpperCase()" maxlength="256">
		              <template slot="prepend">
		              	<font style="color: red;">*</font> 
		                <span>发货人地址</span>
		              </template>
		            </el-input>
		          </el-form-item>
				</el-col>
				<el-col class="elementWidth">
		          <el-form-item  prop="shptelephone">
		            <el-input class="widthWithFiveWithXing" v-model="ruleForm.shptelephone" auto-complete="off" clearable style="width: 260px;">
		              <template slot="prepend">
		              	<font style="color: red;">*</font> 
		                <span>发货人电话</span>
		              </template>
		            </el-input>
		          </el-form-item>
				</el-col>
				
			</el-row>
			<div style="padding:0px 0px 20px 0px;">
					<HR color="#eee" size="5">
					</HR>
				</div>
			<el-row >
				<!-- <el-col class="elementWidth">
		          <el-form-item  prop="cnecode">
		            <el-input v-model="ruleForm.cnecode" auto-complete="off" clearable style="width: 260px;" @input="ruleForm.cnecode = ruleForm.cnecode.toUpperCase()">
		              <template slot="prepend">
		                
		                <span>收货人代码</span>
		              </template>
		            </el-input>
		          </el-form-item>
				</el-col> -->
				<el-col class="elementWidth">
		          <el-form-item  prop="consignee">
		            <el-input class="widthWithThreeWithXing" v-model="ruleForm.consignee" auto-complete="off" clearable style="width: 530px;" @input="ruleForm.consignee = ruleForm.consignee.toUpperCase()" maxlength="70">
		              <template slot="prepend">
		                <font style="color: red;">*</font> 
		                <span>收货人</span>
		              </template>
		            </el-input>
		          </el-form-item>
				</el-col>
				<el-col class="elementWidth">
		          <el-form-item  prop="cnecountrycode">
		            <el-input class="widthWithFourWithXing" v-model="ruleForm.cnecountrycode" auto-complete="off" clearable style="width: 260px;" @input="ruleForm.cnecountrycode = ruleForm.cnecountrycode.toUpperCase().replace(/[^\w\.\/]/ig,'')" maxlength="2">
		              <template slot="prepend">
		                <font style="color: red;">*</font> 
		                <span>国家代码</span>
		              </template>
		            </el-input>
		          </el-form-item>
				</el-col>
			</el-row>
			<el-row>
				
				<el-col class="elementWidth">
		          <el-form-item  prop="cneaddress">
		            <el-input  class="widthWithFiveWithXing" v-model="ruleForm.cneaddress" auto-complete="off" clearable style="width: 530px;" @input="ruleForm.cneaddress = ruleForm.cneaddress.toUpperCase()" maxlength="256">
		              <template slot="prepend">
		              	<font style="color: red;">*</font> 
		                <span>收货人地址</span>
		              </template>
		            </el-input>
		          </el-form-item>
				</el-col>
				<el-col class="elementWidth">
		          <el-form-item  prop="cnetelephone">
		            <el-input  class="widthWithFiveWithXing" v-model="ruleForm.cnetelephone" auto-complete="off" clearable style="width: 260px;">
		              <template slot="prepend">
		              	<font style="color: red;">*</font> 
		                <span>收货人电话</span>
		              </template>
		            </el-input>
		          </el-form-item>
				</el-col>
			</el-row>
			<el-row>
				<el-col class="elementWidth">
		          <el-form-item  prop="cnecontactname">
		            <el-input  class="widthWithFiveWithXing" v-model="ruleForm.cnecontactname" auto-complete="off" clearable style="width: 502px;" @input="ruleForm.cnecontactname = ruleForm.cnecontactname.toUpperCase()">
		              <template slot="prepend">
		              	<font style="color: red;">*</font> 
		                <span>收货联系人姓名</span>
		              </template>
		            </el-input>
		          </el-form-item>
				</el-col>
				<el-col class="elementWidth">
		          <el-form-item  prop="cnecontacttelephone">
		            <el-input  class="widthWithFiveWithXing" v-model="ruleForm.cnecontacttelephone" auto-complete="off" clearable style="width: 288px;">
		              <template slot="prepend">
		              	<font style="color: red;">*</font> 
		                <span>收货联系人电话</span>
		              </template>
		            </el-input>
		          </el-form-item>
				</el-col>
				
			</el-row>
			<div style="padding:0px 0px 20px 0px;">
					<HR color="#eee" size="5">
					</HR>
			</div>
			<el-row>
				
				<el-col class="elementWidth">
		          <el-form-item  prop="nfyname">
		            <el-input  class="widthWithFive" v-model="ruleForm.nfyname" auto-complete="off" clearable style="width: 530px;" @input="ruleForm.nfyname = ruleForm.nfyname.toUpperCase()">
		              <template slot="prepend">
		                <span>通知人姓名</span>
		              </template>
		            </el-input>
		          </el-form-item>
				</el-col>
				<el-col class="elementWidth">
		          <el-form-item  prop="nfycode">
		            <el-input  class="widthWithFive" v-model="ruleForm.nfycode" auto-complete="off" clearable style="width: 260px;" @input="ruleForm.nfycode = ruleForm.nfycode.toUpperCase()">
		              <template slot="prepend">
		                <span>通知人代码</span>
		              </template>
		            </el-input>
		          </el-form-item>
				</el-col>
			</el-row>
			<el-row>
				
				<el-col class="elementWidth">
		          <el-form-item  prop="nfyaddress">
		            <el-input  class="widthWithFive" v-model="ruleForm.nfyaddress" auto-complete="off" clearable style="width: 530px;" @input="ruleForm.nfyaddress = ruleForm.nfyaddress.toUpperCase()">
		              <template slot="prepend">
		                <span>通知人地址</span>
		              </template>
		            </el-input>
		          </el-form-item>
				</el-col>
				<el-col class="elementWidth">
		          <el-form-item  prop="nfytelephone">
		            <el-input  class="widthWithFive" v-model="ruleForm.nfytelephone" auto-complete="off" clearable style="width: 260px;">
		              <template slot="prepend">
		                <span>通知人电话</span>
		              </template>
		            </el-input>
		          </el-form-item>
				</el-col>
			</el-row>
			<el-row>
				<el-form-item >
					<el-button type="primary" @click="submitForm('ruleForm')" :loading="loading" size="small">保存</el-button>
					<el-button @click="resetForm('ruleForm')" size="small">重置</el-button>
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
				loading: false,

				ruleForm: {
					awbnumber: '',
					hwbnumber: '',
					totalpiecequantity: '',
					totalgrossweight: '',
					totalvolumnamount: '',
					goodsname: '',

					shpcode: '',
					shipper: '',
					shptelephone: '',
					shpaddress: '',
					shpcountrycode: '',

					cnecode: '',
					consignee: '',
					cnetelephone: '',
					cneaddress: '',
					cnecountrycode: '',
					cnecontacttelephone:'',
					cnecontactname:'',

					nfycode: '',
					nfyname: '',
					nfytelephone: '',
					nfyaddress: '',
					businesstype:'ANR'
				},
				rules: {
					hwbnumber: [{
						required: true,
						message: '请输入分单号',
						trigger: ['blur', 'change']
					}],
					totalpiecequantity: [{
						required: true,
						message: '请输入件数',
						trigger: ['blur', 'change']
					}],
					totalgrossweight: [{
						required: true,
						message: '请输入重量',
						trigger: ['blur', 'change']
					}],
					totalvolumnamount: [{
						required: true,
						message: '请输入体积',
						trigger: ['blur', 'change']
					}],
					goodsname: [{
						required: true,
						message: '请输入品名',
						trigger: ['blur', 'change']
					}],
					shipper: [{
						required: true,
						message: '请输入收货人',
						trigger: ['blur', 'change']
					}],
					shptelephone: [{
						required: true,
						message: '请输入收货人电话',
						trigger: ['blur', 'change']
					}],
					shpaddress: [{
						required: true,
						message: '请输入收货人地址',
						trigger: ['blur', 'change']
					}],
					shpcountrycode: [{
						required: true,
						message: '请输入收货人国家代码',
						trigger: ['blur', 'change']
					}],
					consignee: [{
						required: true,
						message: '请输入发货人',
						trigger: ['blur', 'change']
					}],
					cnetelephone: [{
						required: true,
						message: '请输入发货人电话',
						trigger: ['blur', 'change']
					}],
					cneaddress: [{
						required: true,
						message: '请输入发货人地址',
						trigger: ['blur', 'change']
					}],
					cnecountrycode: [{
						required: true,
						message: '请输入发货人国家代码',
						trigger: ['blur', 'change']
					}],
					cnecontacttelephone: [{
						required: true,
						message: '请输入发货联系人电话',
						trigger: ['blur', 'change']
					}],
					cnecontactname: [{
						required: true,
						message: '请输入发货联系人姓名',
						trigger: ['blur', 'change']
					}],
				}
			}
		},
		inject: ['queryList'],
		methods: {
			
			handleClose() {
				this.$emit("update:visible", false);
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
			resetForm(formName) {
				this.$refs[formName].resetFields();
			},
			formatToFloat(item) {
				if (item == 'totalgrossweight') {
					this.ruleForm.totalgrossweight = this.ruleForm.totalgrossweight.replace(/[^0123456789.]/g, "");

					let t = this.ruleForm.totalgrossweight.split('.');
					if (t.length > 1) {
						this.ruleForm.totalgrossweight = t[0] + "." + t[1].substr(0, 2);
					}
				} else if (item == 'totalvolumnamount') {					
					this.ruleForm.totalvolumnamount = this.ruleForm.totalvolumnamount.replace(/[^0123456789.]/g, "");

					let t = this.ruleForm.totalvolumnamount.split('.');
					if (t.length > 1) {
						this.ruleForm.totalvolumnamount = t[0] + "." + t[1].substr(0, 3);
					}
				} else if (item == 'totalpiecequantity') {
					this.ruleForm.totalpiecequantity = this.ruleForm.totalpiecequantity.replace(/[^0123456789]/g, "");
				} else if (item == 'hwbnumber'){
					this.ruleForm.hwbnumber = this.ruleForm.hwbnumber.replace("_", "").toUpperCase();
				}
			},
			submitForm(formName) {
				this.$refs[formName].validate((valid) => {
					if(valid) {
						this.loading = true;
						let params = this.ruleForm;
						this.$axios.post2("/afbase/fhl/doSave", params)
							.then(function(response) {
								if(response.data.code == 0) {
									this.loading = false;
									this.openSuccess();
									this.queryList();
									this.handleClose();
								} else {
									this.loading = false;
									this.openError(response.data.messageInfo || "");
								}
							}.bind(this))
							.catch(function(error) {
								this.loading = false;
								this.openError(response.data.messageInfo || "");
							}.bind(this))
					} else {
						return false;
					}
				});
			}
		},
		created() {
			// this.ruleForm.awbnumber=this.frow.awbnumber
			// this.ruleForm=this.frow
			this.ruleForm=JSON.parse(JSON.stringify(this.frow));
		}
	}
</script>
<style type="text/css">

  .fhlEditPage .el-input__icon {
		line-height: 30px !important;
	}

	.fhlEditPage .el-form-item__error {
		margin-top: -5px;
		margin-left: 130px;
	}

</style>
