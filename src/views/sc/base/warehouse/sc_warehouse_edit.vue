<template>
	<el-dialog title="堆场仓库 - 编辑" width="1200px" :visible.sync="visible" :close-on-press-escape="false" :close-on-click-modal="false" :before-close="handleClose">
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
                <el-input class="widthFour" v-model="ruleForm.warehouseCode" auto-complete="off" style="width: 290px;" maxlength="20" @input="ruleForm.warehouseCode=ruleForm.warehouseCode.toUpperCase()">
                  <template slot="prepend">
                    <font style="color: red;">*</font>
                    <span>堆场/仓库代码</span>
                  </template>
                </el-input>
              </el-form-item>
						</el-col>
					</el-row>
					<el-row>
            <el-col class="elementWidth">
              <el-form-item prop="apCode" label-width="10px">
                <el-input class="" auto-complete="off" style="width:200px;">
                  <template slot="prepend">
                    <font style="color: red;">*</font>
                    <span>港&emsp;&emsp;口</span>
                  </template>
                  <el-select slot="suffix" v-model="ruleForm.apCode" @visible-change="blurPortMaintenance" :filter-method="changePortMaintenance" clearable filterable placeholder="请选择" style="width:121px;margin-right: -5px;">
                  	<el-option v-for="(item,index) in portMaintenanceList" :key="index" :label="item.portNameEn" :value="item.portCode">
                  		<span>{{item.portNameEn}}|{{item.portNameCn}}</span>
                  	</el-option>
                  </el-select>
                </el-input>
              </el-form-item>
            </el-col>

						<el-col class="elementWidth">
              <el-form-item label-width="10px" prop="warehouseNameCn">
                <el-input class="" v-model="ruleForm.warehouseNameCn" @input="ruleForm.warehouseNameCn=ruleForm.warehouseNameCn.toUpperCase()" auto-complete="off" style="width: 290px;" maxlength="50">
                  <template slot="prepend">
                    <font style="color: red;">*</font>
                    <span>堆场中文名称&nbsp;&nbsp;&thinsp;</span>
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
                    <span>堆场类型</span>
                  </template>
                  <el-select slot="suffix" v-model="ruleForm.customsSupervision" filterable placeholder="请选择" style="width:121px;margin-right: -5px;" clearable>
                    <el-option v-for="item in customsSupervisionList" :key="item.paramText" :label="item.paramText" :value="item.paramText">
                    </el-option>
                  </el-select>
                </el-input>
              </el-form-item>
						</el-col>
						<el-col class="elementWidth">
              <el-form-item label-width="10px" prop="customsCode">
                <el-input class="widthFour1" v-model="ruleForm.customsCode" auto-complete="off" style="width: 290px;" maxlength="50" @input="ruleForm.customsCode=ruleForm.customsCode.toUpperCase()">
                  <template slot="prepend">
                    <span>海关编码&nbsp;&nbsp;&thinsp;</span>
                  </template>
                </el-input>
              </el-form-item>
						</el-col>
					</el-row>
					<el-row>
						<el-col class="elementWidth">
							<el-form-item label="接货人信息" prop="warehouseContactRemark" style="margin-left: 5px;" class="warehouseContactRemarkColor">
								<el-input type="textarea" v-model="ruleForm.warehouseContactRemark" style="width: 415px;" auto-complete="off" placeholder="请输入接货人姓名、电话、工作时间等信息，此信息会展示在送货通知上" :rows="10" maxlength="500">
								</el-input>
							</el-form-item>
						</el-col>
					</el-row>
					<el-row>
						<el-form-item label-width="10px">
							<el-button size="small" type="primary" @click="submitForm('ruleForm')">保存</el-button>
							<!-- <el-button size="small" @click="resetForm('ruleForm')">重置</el-button> -->
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
                <el-input v-model="ruleForm.warehouseLongitude" auto-complete="off" style="width: 145px;" >
                  <template slot="prepend">
                    <span>经度</span>
                  </template>
                </el-input>
              </el-form-item>
						</el-col>
						<el-col class="elementWidth">
              <el-form-item label-width="10px">
                <el-input v-model="ruleForm.warehouseLatitude" auto-complete="off" style="width: 145px;" >
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
        seaPorts:[],
				shipperTemplates: [],
        portMaintenanceList:[],
        customsSupervisionList:[],
				ruleForm: {
          warehouseId:1,
					businessScope: '',
					warehouseCode: '',
					apCode: '',
					warehouseStatus: 1,
					warehouseNameCn: '',
					customsSupervision: '堆场',
					customsCode: '',
					warehouseContactRemark: '',
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
						message: '请输入堆场/仓库代码',
						trigger: ['blur', 'change']
					}],
					apCode: [{
						required: true,
						message: '请输入港口',
						trigger: ['blur', 'change']
					}],
					warehouseNameCn: [{
						required: true,
						message: '请输入堆场中文名称',
						trigger: ['blur', 'change']
					}],
					customsSupervision: [{
						required: true,
						message: '请选堆场类型',
						trigger: ['blur', 'change']
					}],
					warehouseContactRemark: [{
						min: 0,
						max: 500,
						message: '接货人信息长度为 500',
						trigger: ['blur', 'change']
					}]

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
      // this.ruleForm.apCode = this.frow.apCode;
      this.ruleForm.warehouseId = this.frow.warehouseId;
      this.ruleForm.businessScope = this.frow.businessScope;
      this.ruleForm.warehouseCode = this.frow.warehouseCode;
      this.ruleForm.warehouseStatus = this.frow.warehouseStatus;
      this.ruleForm.warehouseNameCn = this.frow.warehouseNameCn;
      this.ruleForm.customsSupervision = this.frow.customsSupervision;
      this.ruleForm.customsCode = this.frow.customsCode;
      this.ruleForm.warehouseContactRemark = this.frow.warehouseContactRemark;
      this.ruleForm.warehouseLongitude = this.frow.warehouseLongitude;
      this.ruleForm.warehouseLatitude = this.frow.warehouseLatitude;
      this.ruleForm.warehouseAddressGps = this.frow.warehouseAddressGps;
      this.$axios.get('/sc/vScCategory/堆场类型').then(function(response) {
      	this.customsSupervisionList = response.data.data;
      }.bind(this));
      let paramTwo = {
      };
      this.$axios.get2("/sc/portMaintenance/page?size=10&current=1",paramTwo).then(function(response) {
        this.portMaintenanceList = response.data.data.records;
      }.bind(this));
      let param = {
        "portCode":this.frow.apCode
      };
      this.$axios.get2("/sc/portMaintenance/page?size=9&current=1",param).then(function(response) {
        	this.portMaintenanceList = this.portMaintenanceList.filter(port => port.portCode.indexOf(param.portCode) <0);
          this.portMaintenanceList.push(response.data.data.records[0]);
          this.ruleForm.apCode = this.frow.apCode;
      }.bind(this));
      this.$axios.get('/sc/portMaintenance?').then(function(response) {
      this.seaPorts = response.data.data;
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
     blurPortMaintenance(param) {
     	if (!param) {
     		if (!this.seaPorts.some(port => port.portCode == this.ruleForm.apCode)) {
     			// this.ruleForm.apCode = '';
     			this.portMaintenanceList = this.seaPorts.slice(0, 10);
     		}
     	}
     },
     changePortMaintenance(val) {
     	if (val) {
     		this.portMaintenanceList = this.seaPorts.filter(port => port.portNameEn.indexOf(val.toUpperCase()) > -1 || (port.portNameCn != null && port.portNameCn != '' && port.portNameCn.indexOf(val) > -1)).slice(0, 10);
     		this.ruleForm.apCode = val.toUpperCase();
     	} else {
     		this.ruleForm.apCode = '';
     		this.portMaintenanceList = this.seaPorts.slice(0, 10);
     	}
     },
			submitForm(formName) {
				this.$refs[formName].validate((valid) => {
					if (valid) {
						this.$axios.post2('/sc/scWarehouse/modify', this.ruleForm)
							.then(function(response) {
								if (response.data.code == 0) {
									this.openSuccess();
									this.queryList();
									this.handleClose();
								} else {
									if (response.data.messageInfo.indexOf('IDU_warehouse_code') > -1) {
									  this.openError("堆场/仓库代码 '"+this.ruleForm.warehouseCode+"' 已存在，请使用其他代码");
									} else if(response.data.messageInfo.indexOf('IDU_warehouse_name') > -1) {
									  this.openError("堆场/仓库中文名称 '"+this.ruleForm.warehouseNameCn+"' 已存在，请使用其他名称");
									}else{
									  this.openError(response.data.messageInfo);
									}
								}
							}.bind(this)).catch(function(error) {
								let errorinfo = error.response.data.messageInfo;
								//唯一性错误
								if (response.data.messageInfo.indexOf('IDU_warehouse_code') > -1) {
								  this.openError("堆场/仓库代码 '"+this.ruleForm.warehouseCode+"' 已存在，请使用其他代码");
								} else if(response.data.messageInfo.indexOf('IDU_warehouse_name') > -1) {
								  this.openError("堆场/仓库中文名称 '"+this.ruleForm.warehouseNameCn+"' 已存在，请使用其他名称");
								}else{
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
      handlerBaiduMap({
        BMap,
        map
      }) {
        this.map.BMap = BMap
        this.map.center.lat = this.frow.warehouseLatitude
        this.map.center.lng = this.frow.warehouseLongitude
        this.map.zoom = 12.8
        if(!this.map.center.lat||!this.map.center.lng){
          const geolocation = new BMap.Geolocation()
          this.loading = true
          geolocation.getCurrentPosition(res => {
            console.log('返回详细地址和经纬度', res)
            const {
              lng,
              lat
            } = res.point
            this.map.center.lng = lng
            this.ruleForm.warehouseLongitude = lng
            this.map.center.lat = lat
            this.ruleForm.warehouseLatitude = lat
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
    padding: 0 10px;
  }

  .afWareHouseSave .widthFour1 .el-input-group__prepend {
    padding: 0 25px;
  }

  .afWareHouseSave .delivererContactRemarkColor .el-form-item__label {
    color: #909399;
  }

  .afWareHouseSave .warehouseContactRemarkColor .el-form-item__label {
    color: #909399;
  }

</style>
