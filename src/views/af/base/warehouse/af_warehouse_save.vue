<template>
	<el-dialog title="仓库货站 - 新增" width="1200px" :visible.sync="visible" :close-on-press-escape="false" :close-on-click-modal="false" :before-close="handleClose">
		<el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="90px" class="afWareHouseSave">
			<el-container>
				<el-aside width="550px">
					<el-row>
						<el-col class="elementWidth">
							<el-form-item label-width="10px" prop="businessScope">
								<el-input v-model="ruleForm.businessScope" auto-complete="off" style="width: 200px;" disabled>
									<template slot="prepend">
										<font style="color: red;">*</font>
										<span>业务范畴</span>
									</template>
								</el-input>
							</el-form-item>
						</el-col>
						<el-col class="elementWidth">
							<el-form-item label-width="10px" prop="warehouseCode">
								<el-input class="widthFour" v-model="ruleForm.warehouseCode" auto-complete="off" style="width: 290px;" maxlength="10" @input="ruleForm.warehouseCode=ruleForm.warehouseCode.toUpperCase()">
									<template slot="prepend">
										<font style="color: red;">*</font>
										<span>货站代码</span>
									</template>
								</el-input>
							</el-form-item>
						</el-col>
					</el-row>
					<el-row>
						<el-col class="elementWidth">
							<el-form-item label-width="10px" prop="apCode">
								<el-input v-model="ruleForm.apCode" auto-complete="off" style="width: 200px;" @change="findshipperTemplates" @input="ruleForm.apCode=ruleForm.apCode.toUpperCase()" maxlength="4">
									<template slot="prepend">
										<font style="color: red;">*</font>
										<span>机场代码</span>
									</template>
								</el-input>
							</el-form-item>
						</el-col>
						<el-col class="elementWidth">
							<el-form-item label-width="10px" prop="warehouseNameCn">
								<el-input class="" v-model="ruleForm.warehouseNameCn" auto-complete="off" style="width: 290px;" maxlength="50">
									<template slot="prepend">
										<font style="color: red;">*</font>
										<span>货站中文名称</span>
									</template>
								</el-input>
							</el-form-item>
						</el-col>

					</el-row>
					<el-row>
						<el-col class="elementWidth">
							<el-form-item prop="customsSupervision" label-width="10px">
								<el-input class="" auto-complete="off" style="width:200px;">
									<template slot="prepend">
										<font style="color: red;">*</font>
										<span>监管等级</span>
									</template>
									<el-select slot="suffix" v-model="ruleForm.customsSupervision" filterable placeholder="请选择" style="width:121px;margin-right: -5px;" clearable>
										<el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value">
										</el-option>
									</el-select>
								</el-input>
							</el-form-item>
						</el-col>
						<el-col class="elementWidth">
							<el-form-item label-width="10px" prop="customsCode">
								<el-input class="widthFour1" v-model="ruleForm.customsCode" auto-complete="off" style="width: 290px;" maxlength="30" @input="ruleForm.customsCode=ruleForm.customsCode.toUpperCase()">
									<template slot="prepend">
										<span>海关编码</span>
									</template>
								</el-input>
							</el-form-item>
						</el-col>
					</el-row>
					<el-row>
						<el-col class="elementWidth">
							<el-form-item prop="shipperTemplate" label-width="10px">
								<el-input class="" auto-complete="off" style="width:295px;margin-right: 15px;">
									<template slot="prepend">
										<span>交货托书模板</span>
									</template>
									<el-select slot="suffix" v-model="ruleForm.shipperTemplate" filterable placeholder="请选择" style="width:198px;margin-right: -5px;" clearable>
										<el-option v-for="item in shipperTemplates" :key="item.warehouseLetterId" :label="item.shipperTemplateName" :value="item.warehouseLetterId">
										</el-option>
									</el-select>
								</el-input>
							</el-form-item>
						</el-col>
					</el-row>
					<div style="padding:10px 0px 10px 0px;width: 500px;margin-left: 12px;margin-top: -10px;">
						<HR color="#eee" size="5">
						</HR>
					</div>
					<el-row>
						<el-col class="elementWidth">
							<el-form-item label-width="10px" prop="delivererContactName">
								<el-input class="widthSix1" v-model="ruleForm.delivererContactName" auto-complete="off" placeholder="请录入姓名" style="width: 200px;" maxlength="20">
									<template slot="prepend">
										<span>交货人姓名</span>
									</template>
								</el-input>
							</el-form-item>
						</el-col>
						<el-col class="elementWidth">
							<el-form-item label-width="10px" prop="delivererContactPhoneNumber">
								<el-input class="widthFive1" v-model="ruleForm.delivererContactPhoneNumber" auto-complete="off" placeholder="请录入电话号" style="width: 290px;" maxlength="50">
									<template slot="prepend">
										<span>交货人电话</span>
									</template>
								</el-input>
							</el-form-item>
						</el-col>
						<el-col class="elementWidth">
							<el-form-item label-width="10px" prop="delivererContactRemark">
								<el-input style="width: 500px;">
                  <template slot="prepend">
                    <span>交货人身份证</span>
                  </template>
                  <el-input class="delivererContactRemark" slot="suffix" type="textarea"
                            v-model="ruleForm.delivererContactRemark" auto-complete="off" placeholder="请录入身份证"
                            style="width: 403px;margin-right: -5px;" maxlength="500">
                  </el-input>
                </el-input>
							</el-form-item>
						</el-col>
					</el-row>
					<div style="padding:10px 0px 10px 0px;width: 500px;margin-left: 12px;margin-top: -10px;">
						<HR color="#eee" size="5">
						</HR>
					</div>
					<el-row>
						<el-col class="elementWidth">
							<el-form-item label="接货人信息" prop="warehouseContactRemark" style="margin-left: 5px;" class="warehouseContactRemarkColor">
								<el-input type="textarea" v-model="ruleForm.warehouseContactRemark" style="width: 415px;" auto-complete="off" placeholder="请输入接货人姓名、电话、工作时间等信息，此信息会展示在送货通知上" :rows="4" maxlength="500">
								</el-input>
							</el-form-item>
						</el-col>
					</el-row>
					<el-row>
						<el-form-item label-width="10px">
							<el-button size="small" type="primary" @click="submitForm('ruleForm')">保存</el-button>
							<el-button size="small" @click="resetForm('ruleForm')">重置</el-button>
						</el-form-item>
					</el-row>
				</el-aside>
				<el-main v-loading="loading">
					<baidu-map :center="map.center" :zoom="map.zoom" @ready="handlerBaiduMap" style="width: 100%;height: 333px;margin-top: -20px;" :scroll-wheel-zoom="true" @click="getPoint">
						<bm-marker :position="map.center" :dragging="true" @dragend="dragend">
						</bm-marker>
						<bm-geolocation anchor="BMAP_ANCHOR_BOTTOM_RIGHT" :showAddressBar="true" :autoLocation="true" @locationSuccess="locationSuccess"></bm-geolocation>
						<bm-local-search :keyword="map.keywords" :auto-viewport="true" zoom="12.8" style="display: none"></bm-local-search>
					</baidu-map>
					<el-row>
						<el-col class="elementWidth">
							<el-form-item label-width="10px">
								<el-input v-model="map.keywords" auto-complete="off" style="width: 200px;" placeholder="请输入检索内容">
									<template slot="prepend">
										<span>地图检索</span>
									</template>
								</el-input>
							</el-form-item>
						</el-col>
						<el-col class="elementWidth">
							<el-form-item label-width="10px">
								<el-input v-model="ruleForm.warehouseLongitude" auto-complete="off" style="width: 145px;">
									<template slot="prepend">
										<span>经度</span>
									</template>
								</el-input>
							</el-form-item>
						</el-col>
						<el-col class="elementWidth">
							<el-form-item label-width="10px">
								<el-input v-model="ruleForm.warehouseLatitude" auto-complete="off" style="width: 145px;">
									<template slot="prepend">
										<span>纬度</span>
									</template>
								</el-input>
							</el-form-item>
						</el-col>
						<el-col class="elementWidth">
							<el-form-item label-width="5px">
								<el-button type="primary" size="mini" @click="location">定位</el-button>
							</el-form-item>
						</el-col>
					</el-row>
					<el-row style="margin-top: 0px;float: left;">
						<el-col class="elementWidth">
							<el-form-item label-width="10px">
								<el-input v-model="ruleForm.warehouseAddressGps" auto-complete="off" style="width: 570px;" placeholder="请录入导航地址,此内容会在送货通知上显示" clearable>
									<template slot="prepend">
										<span>导航地址</span>
									</template>
								</el-input>
							</el-form-item>
						</el-col>
					</el-row>
				</el-main>
			</el-container>
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
				options: [],
				shipperTemplates: [],
				ruleForm: {
					businessScope: '',
					warehouseCode: '',
					apCode: '',
					warehouseStatus: 1,
					warehouseNameCn: '',
					customsSupervision: '',
					customsCode: '',
					warehouseContactRemark: '',
					shipperTemplate: '',
					delivererContactRemark: '',
					delivererContactName: '',
					delivererContactPhoneNumber: '',
					warehouseLongitude: '',
					warehouseLatitude: '',
					warehouseAddressGps: ''
				},
				map: {
					center: {
						lng: 0,
						lat: 0
					},
					zoom: 3,
					keywords: '',
					BMap: ''
				},
				loading: false,
				rules: {
					businessScope: [{
						required: true,
						message: '请输入业务范畴',
						trigger: ['blur', 'change']
					}],
					warehouseCode: [{
						required: true,
						message: '请输入货站代码',
						trigger: ['blur', 'change']
					}],
					apCode: [{
						required: true,
						message: '请输入机场代码',
						trigger: ['blur', 'change']
					}],
					warehouseNameCn: [{
						required: true,
						message: '请输入货站中文名称',
						trigger: ['blur', 'change']
					}],
					customsSupervision: [{
						required: true,
						message: '请选择监管等级',
						trigger: ['blur', 'change']
					}],
					warehouseContactRemark: [{
						min: 0,
						max: 500,
						message: '接货人信息长度为 500',
						trigger: ['blur', 'change']
					}],
					delivererContactRemark: [{
						min: 0,
						max: 500,
						message: '交货人信息长度为 500',
						trigger: ['blur', 'change']
					}],
				},
				permissionData: [],
				defaultProps: {
					children: 'children',
					label: 'label'
				}
			};
		},
		inject: ['queryList'],

		created: function() {
			this.ruleForm.businessScope = this.frow.businessScope;
			this.$axios.get('/afbase/awb/selectCategory?category=监管等级').then(function(response) {
				this.options = response.data.data;
			}.bind(this));
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
			submitForm(formName) {
				this.$refs[formName].validate((valid) => {
					if (valid) {
						this.$axios.post2('/afbase/warehouse/doSave', this.ruleForm)
							.then(function(response) {
								if (response.data.code == 0) {
									this.openSuccess();
									this.queryList();
									this.handleClose();
								} else {
									this.openError(response.data.messageInfo);
								}
							}.bind(this)).catch(function(error) {
								let errorinfo = error.response.data.messageInfo;
								//唯一性错误
								if (errorinfo.indexOf('IDU_warehouse_code') > -1) {
									this.openError('货站代码不可重复');
								} else if (errorinfo.indexOf('IDU_warehouse_name_cn') > -1) {
									this.openError('货站中文名称不可重复');
								} else if (errorinfo.indexOf('IDU_customs_code') > -1) {
									this.openError('海关编码不可重复');
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

			findshipperTemplates() {
				this.ruleForm.shipperTemplate = ''
				this.$axios.get('/afbase/warehouse/findshipperTemplates?apCode=' + this.ruleForm.apCode).then((response) => {
					this.shipperTemplates = response.data.data;
				})
			},
			resetForm(formName) {
				this.$refs[formName].resetFields();
			},
			handlerBaiduMap({
				BMap,
				map
			}) {
				this.map.BMap = BMap
				if (BMap) {
					const geolocation = new BMap.Geolocation()
					this.loading = true
					geolocation.getCurrentPosition(res => {
						console.log('返回详细地址和经纬度', res)
						const {
							lng,
							lat
						} = res.point
						const {
							province,
							city,
							district,
							street,
							street_number
						} = res.address
						this.map.center.lng = lng
						this.ruleForm.warehouseLongitude = lng
						this.map.center.lat = lat
						this.ruleForm.warehouseLatitude = lat
						this.map.zoom = 12.8
						this.getPositionByPoint(res.point)
						this.loading = false
					})
				}
			},
			dragend({
				type,
				target,
				pixel,
				point
			}) {
				this.getPositionByPoint(point)
				this.ruleForm.warehouseLongitude = point.lng
				this.ruleForm.warehouseLatitude = point.lat
			},
			location() {
				this.map.center.lng = this.ruleForm.warehouseLongitude
				this.map.center.lat = this.ruleForm.warehouseLatitude
				this.map.zoom = 12.8
			},
			getPoint(e) {
				this.ruleForm.warehouseLongitude = e.point.lng
				this.ruleForm.warehouseLatitude = e.point.lat
				this.map.center.lng = e.point.lng
				this.map.center.lat = e.point.lat
				this.map.zoom = e.target.getZoom()

				this.getPositionByPoint(e.point)
			},
			getPositionByPoint(point) {
				let geocoder = new this.map.BMap.Geocoder()
				geocoder.getLocation(point, res => {
					this.ruleForm.warehouseAddressGps = res.address
				})
			},
			locationSuccess(e) {
				this.ruleForm.warehouseLongitude = e.point.lng
				this.ruleForm.warehouseLatitude = e.point.lat
				this.map.center.lng = e.point.lng
				this.map.center.lat = e.point.lat
				this.map.zoom = 12.8
				this.getPositionByPoint(e.point)
			},
			handleClose() {
				this.$emit('update:visible', false)
			}
		}
	}
</script>
<style type="text/css">
	.afWareHouseSave .el-input__icon {
		line-height: 30px !important;
	}

	.afWareHouseSave .el-form-item__content {
		line-height: 30px !important;
	}

	.afWareHouseSave .el-input-group__prepend {
		padding: 0 6px;
	}

	.afWareHouseSave .widthFour .el-input-group__prepend {
		padding: 0 20px;
	}

	.afWareHouseSave .widthFour1 .el-input-group__prepend {
		padding: 0 25px;
	}

	.afWareHouseSave .widthFive1 .el-input-group__prepend {
		padding: 0 18px;
	}

	.afWareHouseSave .widthSix1 .el-input-group__prepend {
		padding: 0 13px;
	}

	.afWareHouseSave .delivererContactRemarkColor .el-form-item__label {
		color: #909399;
	}

	.afWareHouseSave .delivererContactRemark textarea {
		height: 30px;
		min-height: 30px !important;
	}

	.afWareHouseSave .warehouseContactRemarkColor .el-form-item__label {
		color: #909399;
	}
</style>
