<template>
	<el-dialog title="出重编辑" width="670px" :visible.sync="visible" :close-on-press-escape="false" :close-on-click-modal="false" :before-close="handleClose" append-to-body>
	  <el-form :model="ruleForm" :rules="rules" :inline="true" ref="ruleForm" label-width="100px" class="demo-ruleForm" style="margin-left: 10px;">
		<el-row>
				<el-col class="elementWidth">
					<el-form-item prop="awbNumber">
						<el-input v-model="ruleForm.awbNumber" auto-complete="off" disabled style="width:295px;margin-right: 15px;">
							<template slot="prepend">主单号/订单号</template>
						</el-input>
					</el-form-item>
				</el-col>
               <el-col class="elementWidth">
					<el-form-item prop="customerNumber">
						<el-input class="widthWithFourWithXing" v-model="ruleForm.customerNumber" auto-complete="off" disabled style="width:295px;margin-right: 15px;">
							<template slot="prepend">客户单号</template>
						</el-input>
					</el-form-item>
				</el-col>
         </el-row>
         <el-row>
               <el-col class="elementWidth">
					<el-form-item prop="inboundPieces">
					   <el-input class="widthWithFourWithXing" @change="ruleForm.inboundPieces=strTrim(ruleForm.inboundPieces)" @input="formatToFloat('inboundPieces')" maxlength="8" v-model="ruleForm.inboundPieces" auto-complete="off" style="width:295px;margin-right: 15px;" clearable>
							<template slot="prepend">
							    <font style="color: red;">*</font>
								<span>入库件数</span>
							</template>
						</el-input>
					</el-form-item>
				</el-col>
                <el-col class="elementWidth">
					<el-form-item prop="inboundGrossWeight">
						<el-input class="widthWithFourWithXing" @change="ruleForm.inboundGrossWeight=strTrim(ruleForm.inboundGrossWeight)" @input="formatToFloat('inboundGrossWeight')" maxlength="9" v-model="ruleForm.inboundGrossWeight" auto-complete="off" style="width:295px;margin-right: 15px;" clearable>
							<template slot="prepend">
							    <font style="color: red;">*</font>
								<span>入库毛重</span>
							</template>
						</el-input>
					</el-form-item>
				</el-col>
                <el-col class="elementWidth">
					<el-form-item prop="inboundVolume">
						<el-input class="widthWithFourWithXing" @change="ruleForm.inboundVolume=strTrim(ruleForm.inboundVolume)" @input="formatToFloat('inboundVolume')" maxlength="11" v-model="ruleForm.inboundVolume" auto-complete="off" style="width:295px;margin-right: 15px;" clearable>
							<template slot="prepend">
						     	<font style="color: red;">*</font>
								<span>入库体积</span>
							</template>
						</el-input>
					</el-form-item>
				</el-col>
				<!--<el-col class="elementWidth">
					<el-form-item prop="inboundVolumeWeight">
						<el-input class="widthWithFourWithXing" @change="ruleForm.inboundVolumeWeight=strTrim(ruleForm.inboundVolumeWeight)" @input="formatToFloat('inboundVolumeWeight')" maxlength="9" v-model="ruleForm.inboundVolumeWeight" auto-complete="off" style="width:295px;margin-right: 15px;" clearable>
							<template slot="prepend">
							    <font style="color: red;">*</font>
								<span>体积重量</span>
							</template>
						</el-input>
					</el-form-item>
				</el-col>-->
				<el-col class="elementWidth">
					<el-form-item prop="inboundChargeWeight">
					    <el-input class="widthWithFourWithXing" @change="ruleForm.inboundChargeWeight=strTrim(ruleForm.inboundChargeWeight)" @input="formatToFloat('inboundChargeWeight')" maxlength="9" v-model="ruleForm.inboundChargeWeight" auto-complete="off" style="width:295px;margin-right: 15px;" clearable>
							<template slot="prepend">
							    <font style="color: red;">*</font>
								<span>计费重量</span>
							</template>
						</el-input>
					</el-form-item>
				</el-col>			
				<el-col class="elementWidth">
					<el-form-item prop="orderSize">
						<el-input class="widthWithFourWithXing" v-model="ruleForm.orderSize" auto-complete="off" style="width:615px;" readOnly>
							<template slot="prepend">
							   <font style="color: red;">*</font>
								<span>货物尺寸</span>
							</template>
							<el-button slot="append" @click="gotoSizePage" icon="el-icon-edit"></el-button>
						</el-input>
					</el-form-item>
				</el-col>
			</el-row>
			<el-row>
				<el-form-item>
					<el-button  size="small" type="primary" @click="submitForm('ruleForm')">修改</el-button>
				</el-form-item>
			</el-row>
	 </el-form>
	 <orderSize ref="addMission" v-if="orderSize" :visible.sync="orderSize" :frow="ffrow"></orderSize>
	</el-dialog>
</template>
<script>
import OrderSize from '@/views/public/size_edit'
export default {
		props: {
			visible: {
				type: Boolean,
				default: false
			},
			frow: Object
		},
		data() {
		    //loading: false,
			return {
				ffrow: {
					data: []
				},
				ruleForm:{
				 awbNumber:"",
				 customerNumber:"",
				 orderSize:"",
				 inboundPieces:"",
				 inboundGrossWeight:"",
				 inboundVolume:"",
				// inboundVolumeWeight:"",
				 inboundChargeWeight:"",
				 inboundId:""
				},
				rules: {
					inboundPieces: [{
							required: true,
							message: '请输入入库件数',
							trigger: ['blur', 'change']
						},
						{
							min:1,
							max:8,
							message: '长度不超过 8',
							trigger: ['blur', 'change']
						}
					],
					inboundGrossWeight: [{
							required: true,
							message: '请输入入库毛重',
							trigger: ['blur', 'change']
						},
						{
							min:1,
							max:9,
							message: '长度不超过 9',
							trigger: ['blur', 'change']
						}
					],
					inboundVolume: [{
							required: true,
							message: '请输入入库体积',
							trigger: ['blur', 'change']
						},
						{
							min:1,
							max:11,
							message: '长度不超过 11',
							trigger: ['blur', 'change']
						}
					],
					inboundChargeWeight: [{
							required: true,
							message: '请输入计费重量',
							trigger: ['blur', 'change']
						},
						{
							min:1,
							max:9,
							message: '长度不超过 9',
							trigger: ['blur', 'change']
						}
					],
					orderSize: [{
							required: true,
							message: '请输入货物尺寸',
							trigger: ['blur', 'change']
						}
						
					]
				},
				orderSize:false
			}
			
		},
		created: function() {
			this.ruleForm.awbNumber = this.frow.awbNumber;
			this.ruleForm.customerNumber = this.frow.customerNumber;
			this.ruleForm.orderSize = this.frow.orderSize;
			//this.ruleForm.inboundPieces = this.frow.inboundPieces+"";
			//this.ruleForm.inboundGrossWeight = this.frow.inboundGrossWeight+"";
			//this.ruleForm.inboundVolume = this.frow.inboundVolume+"";
			//this.ruleForm.inboundVolumeWeight = this.frow.inboundVolumeWeight+"";
			//this.ruleForm.inboundChargeWeight = this.frow.inboundChargeWeight+"";
			this.ruleForm.inboundId = this.frow.inboundId;
			this.$axios.get2('/afbase/inbound/detailInbound/'+this.frow.inboundId).then(function(response) {
			         if(response.data.code == 0) {
						     //console.log(response.data);
						    this.ruleForm.orderSize = response.data.data.orderSize;
				            this.ruleForm.inboundPieces = response.data.data.orderPieces+"";
				            this.ruleForm.inboundGrossWeight = response.data.data.orderGrossWeight+"";
				            this.ruleForm.inboundVolume = response.data.data.orderVolume+"";
				            this.ruleForm.inboundChargeWeight = response.data.data.orderChargeWeight+"";
				      } else {
						 this.openError(response.data.messageInfo);
					  }
			}.bind(this)).catch((error) => {
					        this.openError(error.response.data.messageInfo);
					      });
			
		},
		components: {
			'orderSize': OrderSize
		},
		provide() {
			return {
				sizeEditCallBack: this.sizeEditCallBack
			}
		},
		inject: ['queryInboundList'],
		methods: {
		   formatToFloat(item) {
		   
		      if(item == 'inboundChargeWeight' || item == 'inboundGrossWeight') {
					this.ruleForm[item] = this.ruleForm[item].replace(/[^0123456789.]/g, "");
					let t = this.ruleForm[item].split('.');
					if(t.length > 1) {
						if(t[0] == '') {
							this.ruleForm[item] = "0." + t[1].substr(0, 1);
						} else {
							this.ruleForm[item] = t[0] + "." + t[1].substr(0, 1);
						}
					}
				} else if(item == 'inboundVolume') {
					this.ruleForm[item] = this.ruleForm[item].replace(/[^0123456789.]/g, "");
					let t = this.ruleForm[item].split('.');
					if(t.length > 1) {
						if(t[0] == '') {
							this.ruleForm[item] = "0." + t[1].substr(0, 3);
						} else {
							this.ruleForm[item] = t[0] + "." + t[1].substr(0, 3);
						}
					}
				} else if(item == 'inboundPieces') {
					this.ruleForm[item] = this.ruleForm[item].replace(/[^0123456789]/g, "");
					while(this.ruleForm[item].indexOf('0') == 0) {
						this.ruleForm[item] = this.ruleForm[item].substr(1, this.ruleForm[item].length - 1)
					}
				}
				
			},
			// 关闭
			handleClose() {
				this.$emit('update:visible', false);
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
			             this.$axios.post2('/afbase/inbound/modifyInbound', this.ruleForm).then(function(response) {
					         if(response.data.code == 0) {
									this.openSuccess();
									this.queryInboundList();
									this.handleClose();
							  } else {
								this.openError(response.data.messageInfo);
							  }
						
					      }.bind(this)).catch((error) => {
					        this.openError(error.response.data.messageInfo);
					      });
				} else {
				       console.log('error submit!!');
					   return false;
					}
			  });
			},
			sizeEditCallBack(row) {
				this.ruleForm.orderSize = row.value
			
			},
			gotoSizePage() {
				this.ffrow.orderSize = this.ruleForm.orderSize;
				this.ffrow.position = '空运出口订单';
				this.orderSize = true;
			}
	   }
}
</script>