<template>
	<el-dialog :title="scTypeName+' 详情'" width="600px" :visible.sync="visible" :close-on-press-escape="false" :close-on-click-modal="false" :before-close="handleClose">
		<el-form disabled :model="ruleForm" :rules="rules" ref="ruleForm" class="demo-ruleForm">
			<el-row>
				<el-col class="elementWidth">
					<el-form-item label="类型" prop="scType" label-width="100px">
						<el-select v-model="ruleForm.scType" placeholder="" style="width: 90px;">
							<el-option label="发货人" :value="0"></el-option>
							<el-option label="收货人" :value="1"></el-option>
						</el-select>
					</el-form-item>
				</el-col>
				<!--<el-col class="elementWidth">
					<el-form-item label="助记码" prop="scMnemonic" label-width="80px">
						<el-input v-model="ruleForm.scMnemonic" auto-complete="off" maxlength="10" style="width: 100px;">
						</el-input>
					</el-form-item>
				</el-col>-->
				<el-col class="elementWidth">
					<el-form-item label="是否生效" prop="isValid" label-width="90px">
						<el-select v-model="ruleForm.isValid" placeholder="" style="width: 80px;">
							<el-option label="是" :value=true></el-option>
							<el-option label="否" :value=false></el-option>
						</el-select>
					</el-form-item>
				</el-col>
			</el-row>
			<el-row>
				<el-col class="elementWidth">
					<el-form-item label="名称" prop="scName" label-width="100px">
						<el-input v-model="ruleForm.scName" auto-complete="off" maxlength="100" style="width: 440px;">
						</el-input>
					</el-form-item>
				</el-col>
			</el-row>
			<el-row>
				<el-col class="elementWidth">
					<el-form-item label="地址" prop="scAddress" label-width="100px">
						<el-input v-model="ruleForm.scAddress" auto-complete="off" maxlength="150" style="width: 440px;">
						</el-input>
					</el-form-item>
				</el-col>
			</el-row>
			<el-row>
				<el-form-item label="代码" label-width="100px">
					<el-col class="elementWidth">
						<el-form-item prop="scCodeType">
							<el-select v-model="ruleForm.scCodeType" filterable placeholder="" style="width: 200px;">
								<el-option v-for="(scCodeType,index) in scCodeTypes" :key="index" :label="scCodeType.paramText" :value="scCodeType.edicode1"></el-option>
							</el-select>
						</el-form-item>
					</el-col>
					<el-col class="elementWidth">
						<el-form-item prop="scCode" label-width="30px">
							<el-input v-model="ruleForm.scCode" auto-complete="off" placeholder="" maxlength="50" style="width: 210px;">
							</el-input>
						</el-form-item>
					</el-col>
				</el-form-item>
			</el-row>
			<el-row>
				<el-col class="elementWidth">
					<el-form-item label="AEO编码" prop="aeoCode" label-width="100px">
						<el-input v-model="ruleForm.aeoCode" auto-complete="off" style="width: 440px;">
						</el-input>
					</el-form-item>
				</el-col>
			</el-row>
			<el-row>
				<el-col class="elementWidth">
					<el-form-item label="国家代码" prop="nationCode" label-width="100px" >
						<el-input v-model="ruleForm.nationCode" auto-complete="off" style="width: 170px;">
						</el-input>
					</el-form-item>
				</el-col>
				<el-col class="elementWidth">
					<el-form-item label="省份" prop="stateCode" label-width="60px">
						<el-input v-model="ruleForm.stateCode" auto-complete="off" maxlength="10" style="width: 210px;">
						</el-input>
					</el-form-item>
				</el-col>
			</el-row>
			<el-row>
				<el-col class="elementWidth">
					<el-form-item label="城市代码" prop="cityName" label-width="100px">
						<el-input v-model="ruleForm.cityCode" @input="ruleForm.cityCode = ruleForm.cityCode.toUpperCase()" auto-complete="off" maxlength="30" style="width: 170px;">
						</el-input>
					</el-form-item>
				</el-col>
				<el-col class="elementWidth">
					<el-form-item label="邮编" prop="postCode" label-width="60px">
						<el-input v-model="ruleForm.postCode" auto-complete="off" maxlength="20" style="width: 210px;">
						</el-input>
					</el-form-item>
				</el-col>
			</el-row>
			<el-row>
				<el-col class="elementWidth">
					<el-form-item label="电话" prop="telNumber" label-width="100px">
						<el-input v-model="ruleForm.telNumber" auto-complete="off" maxlength="30" style="width: 170px;">
						</el-input>
					</el-form-item>
				</el-col>
				<el-col class="elementWidth">
					<el-form-item label="传真" prop="faxNumber" label-width="60px">
						<el-input v-model="ruleForm.faxNumber" auto-complete="off" maxlength="30" style="width: 210px;">
						</el-input>
					</el-form-item>
				</el-col>
			</el-row>
      <el-row>
        <el-col class="elementWidth">
          <el-form-item prop="scPrintRemark" label="Print" label-width="100px">
            <el-input :rows="5" type="textarea" v-model="ruleForm.scPrintRemark" style="width: 440px;">
            </el-input>
          </el-form-item>
        </el-col>
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
				scTypeName: '',
				scCodeTypes: [],
				loading: false,
				ruleForm: {
					isValid: '',
					//scMnemonic: '',
					scType: '',
					scName: '',
					scAddress: '',
					scCodeType: '',
					scCode: '',
					aeoCode: '',
					nationCode: '',
					stateCode: '',
					cityName: '',
          cityCode: '',
					postCode: '',
					telNumber: '',
					faxNumber: '',
					scPrintRemark: ''
				},
				rules: {
					scType: [{
						required: true,
						message: '请输选择类型',
						trigger: ['blur', 'change']
					}],
					isValid: [{
						required: true,
						message: '请输选择是否有效',
						trigger: ['blur', 'change']
					}],
					/*scCodeType: [{
						required: true,
						message: '请输选择代码类型',
						trigger: ['blur', 'change']
					}],
					scCode: [{
						required: true,
						message: '请输入代码',
						trigger: ['blur', 'change']
					}],*/
					scName: [{
						required: true,
						message: '请输入名称',
						trigger: ['blur', 'change']
					}],
          scPrintRemark: [{
              required: true,
              message: '请输入Print',
              trigger: ['blur', 'change']
          },{
              min: 1,
              max: 2000,
              message: 'Print长度不超过 2000',
              trigger: ['blur', 'change']
          }
          ],
					/*scAddress: [{
						required: true,
						message: '请输入地址',
						trigger: ['blur', 'change']
					}],*/
					nationCode: [/*{
						required: true,
						message: '请输入国家代码',
						trigger: ['blur', 'change']
					}, */{
						min: 2,
						message: '请输入两位字符',
						trigger: ['blur', 'change']
					}, {
						max: 2,
						message: '请输入两位字符',
						trigger: ['blur', 'change']
					}],
					/*telNumber: [{
						required: true,
						message: '请输入电话',
						trigger: ['blur', 'change']
					}]*/
				}
			};
		},
		inject: ['queryList'],
		created: function() {
			this.$axios.get2('/afbase/category/params', {
				categoryName: "收发货人代码"
			}).then(function(response) {
				this.scCodeTypes = response.data.data;
			}.bind(this)).catch(function(error) {
				console.log(error);
			})
			this.$axios.get2('/afbase/shipperConsignee/view', {
				scId: this.frow.scId
			}).then(function(response) {
				this.ruleForm = response.data.data;
				this.changescType()
			}.bind(this)).catch(function(error) {
				console.log(error);
			})

		},
		methods: {
			// 关闭
			handleClose() {
				this.$emit('update:visible', false);
			},
			changescType() {
				if(this.ruleForm.scType == '0') {
					this.scTypeName = '发货人 -'
				} else if(this.ruleForm.scType == '1') {
					this.scTypeName = '收货人 -'
				}
			}
		}
	}
</script>
<style type="text/css" scoped="scoped">

</style>
