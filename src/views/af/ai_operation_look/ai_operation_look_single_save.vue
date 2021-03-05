<template>
	<el-dialog title="" :fullscreen="ifFullscreen" width="1300px" :visible.sync="visible" :close-on-press-escape="false" :close-on-click-modal="false" :before-close="handleClose" :style="style" :show-close="!ifFullscreen">
        <div class="orderEditPage" style="width: 1280px;">
			
				<div style="margin-top: -15px;margin-bottom: 20px;">
					<span style="font-size: large;margin-bottom: 20px;">空运进口订单 - 新增</span>
				</div>
                <div class="orderEditPage">
                    <el-form :model="ruleForm" :rules="rules" :inline="true" ref="ruleForm" label-width="100px" class="demo-ruleForm" style="margin-left: 10px;">
                        <el-row>
                            <el-col class="elementWidth">
                                <el-form-item prop="awbNumber">
                                    <el-input class="widthWithThree" v-model="ruleForm.awbNumber" style="width:240px;margin-right:15px;margin-top:5px;">
                                        <template slot="prepend">主单号</template>
                                    </el-input>
                                </el-form-item>
                            </el-col>
                            <el-col class="elementWidth">
                                <el-form-item>
                                    <el-button type="primary" size="small" @click="checkQueryList('ruleForm')">查询</el-button>
                                </el-form-item>
                            </el-col>
                        </el-row>
                    </el-form>
                </div>
            <div style="padding:0px 0px 10px 0px">
                <HR color="#eee" size="5"/>
            </div>
            <div class="orderEditPage" style="width: 1280px;">
                <el-form>
                    <el-row>
                        <el-col class="elementWidth" style="width:200px;">
                            <el-form-item label="" prop="mawbCode">
                                <span style="margin-left: 20px;" align="center">主单号:</span>
                                <span style="margin-left: 20px;" align="center">{{ruleData.mawbCode}}</span>
                            </el-form-item>
                        </el-col>
                        <el-col class="elementWidth" style="width:200px;">
                            <el-form-item label="" prop="totalPieces">
                                <span style="margin-left: 20px;" align="center">件数:</span>
                                <span style="margin-left: 20px;" align="center">{{ruleData.totalPieces}}</span>
                            </el-form-item>
                        </el-col>
                        <el-col class="elementWidth" style="width:200px;">
                            <el-form-item label="" prop="totalWeight">
                                <span style="margin-left: 20px;" align="center">重量:</span>
                                <span style="margin-left: 20px;" align="center">{{ruleData.totalWeight}}</span>
                            </el-form-item>
                        </el-col>
                        <el-col class="elementWidth" style="width:200px;">
                            <el-form-item label="" prop="totalVolume">
                                <span style="margin-left: 20px;" align="center">体积:</span>
                                <span style="margin-left: 20px;" align="center">{{ruleData.totalVolume}}</span>
                            </el-form-item>
                        </el-col>
                        <el-col class="elementWidth" style="width:200px;">
                            <el-form-item label="" prop="departure">
                                <span style="margin-left: 20px;" align="center">航班号:</span>
                                <span style="margin-left: 20px;" align="center">{{ruleData.mft1201Flightno}}</span>
                            </el-form-item>
                        </el-col>
                        <el-col class="elementWidth" style="width:200px;">
                            <el-form-item label="" prop="destination">
                                <span style="margin-left: 20px;" align="center">航班日期:</span>
                                <span style="margin-left: 20px;" align="center">{{ruleData.mft1201Flightdate}}</span>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col class="elementWidth" style="width:200px;">
                            <el-form-item label="" prop="departure">
                                <span style="margin-left: 20px;" align="center">始发地:</span>
                                <span style="margin-left: 20px;" align="center">{{ruleData.departure}}</span>
                            </el-form-item>
                        </el-col>
                        <el-col class="elementWidth" style="width:200px;">
                            <el-form-item label="" prop="destination">
                                <span style="margin-left: 20px;" align="center">目的地:</span>
                                <span style="margin-left: 20px;" align="center">{{ruleData.destination}}</span>
                            </el-form-item>
                        </el-col>
                        <el-col class="elementWidth" style="width:700px;">
                            <el-form-item label="" prop="goodEname">
                                <span style="margin-left: 20px;" align="center">英文品名:</span>
                                <span style="margin-left: 20px;" align="center">{{ruleData.goodEname}}</span>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col class="elementWidth" style="width:200px;">
                            <el-form-item label="" prop="mft1201Status">
                                <span style="margin-left: 20px;" align="center">原始状态:</span>
                                <span style="margin-left: 20px;" v-if="(ruleData.mft1201Status)=='SUCC'">成功</span>
                                <span style="margin-left: 20px;" v-else align="center">{{ruleData.mft1201Status}}</span>
                            </el-form-item>
                        </el-col>
                        <el-col class="elementWidth" style="width:200px;">
                            <el-form-item label="" prop="mft5201Status">
                                <span style="margin-left: 20px;" align="center">理货状态:</span>
                                <span style="margin-left: 20px;" v-if="(ruleData.mft5201Status)=='SUCC'">成功</span>
                                <span style="margin-left: 20px;" v-else align="center">{{ruleData.mft5201Status}}</span>
                            </el-form-item>
                        </el-col>
                        <el-col class="elementWidth" style="width:200px;">
                            <el-form-item label="" prop="mft6202Recv">
                                <span style="margin-left: 20px;" align="center">分拨申请:</span>
                                <span style="margin-left: 20px;" v-if="(ruleData.mft6202Recv)=='YES'">成功</span>
                            </el-form-item>
                        </el-col>
                        <el-col class="elementWidth" style="width:200px;">
                            <el-form-item label="" prop="mft3202Status">
                                <span style="margin-left: 20px;" align="center">分拨运抵:</span>
                                
                                <span style="color:red" v-if="(ruleData.mft6202Recv)=='YES'&&(ruleData.existsMft3202)!='Y'&&((!ruleData.mft3202Status)||(ruleData.mft3202Status)=='SAVE'||(ruleData.mft3202Status)=='ERROR'||((ruleData.mft3202Status)=='SUCC'))">
                                    <el-button type="primary" size="small" @click="distributionDeclare">申报</el-button>
                                </span>
                                
                                <span style="color:red" v-else-if="(ruleData.existsMft3202)=='YES'&&(ruleData.mft3202Status)=='SUCC'">
                                    <el-button type="primary" size="small" @click="distributionDeclare">删除申报</el-button>
                                </span>
                                <span style="margin-left: 20px;" v-else-if="ruleData.mft3202Status=='SUCC'" align="center">成功</span>
                            </el-form-item>
                        </el-col>
                    </el-row>
                </el-form>
            </div>
            <div style="padding:0px 0px 10px 0px">
                <HR color="#eee" size="5"/>
            </div>
            <div>
                <el-table v-loading="loading" :data="data" show-summary="true" :summary-method="getSummaries" stripe border>
                    <el-table-column label="操作" align="center" fixed width="100">
                         <template slot="header">
                             <i class="iconfont el-icon-myyuanquanjiahao" @click="addSingle" style="cursor: pointer; size: b5; color: #409eff;margin-right: 5px;"></i>操作
                         </template>
                         <template slot-scope="scopes">
                             <i class="el-icon-edit" v-if="(scopes.row.orderCode)!=null&&(scopes.row.orderCode)!=''" @click="updateSingle(scopes.row.orderId)" style="cursor: pointer; size: b5; color: #409eff;margin-right: 5px;"></i>
                             <i class="iconfont el-icon-myyuanquanjiahao" v-if="(!scopes.row.orderCode)" @click="addSingle" style="cursor: pointer; size: b5; color: #409eff;margin-right: 5px;"></i>
                         </template>
                        <!--<template slot-scope="scope" >
                            <el-dropdown :hide-on-click="false" trigger="click" @command="handleCommand" @visible-change="handleChange(scope.row)">
                                <i class="el-icon-s-operation"></i>
                                <el-dropdown-menu slot="dropdown">
                                    <el-dropdown-item command="add" v-if="scope.row.hwbnumber==''">新增分单</el-dropdown-item>
                                    <el-dropdown-item command="edit" v-if="scope.row.syscode!='' && scope.row.hwbnumber!='' && scope.row.ismftdeclare!='1' && scope.row.istallydeclare!='1'">修改分单</el-dropdown-item>
                                    <el-dropdown-item command="delete" v-if="scope.row.syscode!='' && scope.row.hwbnumber!='' && scope.row.ismftdeclare!='1' && scope.row.istallydeclare!='1'">删除分单</el-dropdown-item>
                                    <el-dropdown-item command="declare1" v-if="scope.row.syscode!='' && scope.row.hwbnumber!='' && scope.row.ismftdeclare!='1'">申报原始</el-dropdown-item>
                                    <el-dropdown-item command="declare2" v-if="scope.row.syscode!='' && scope.row.hwbnumber!='' && scope.row.ismftdeclare=='1' && scope.row.istallydeclare!='1'">申报理货</el-dropdown-item>
                                </el-dropdown-menu>
                            </el-dropdown>
                        </template>-->
                    </el-table-column>
                    <!-- header-align="center" -->
                    <el-table-column prop="orderCode" label="订单号"  width="130" align="center"></el-table-column>
                    <el-table-column prop="hawbCode" label="分单号"  width="130" align="center"></el-table-column>
                    <el-table-column prop="pieces" label="件数"  width="90" align="center"></el-table-column>
                    <el-table-column prop="weight" label="重量" width="90" align="center"></el-table-column>
                    <el-table-column prop="volume" label="体积" width="90" align="center"></el-table-column>
                    <el-table-column prop="departure" label="始发港" width="99" align="center"></el-table-column>
                    <el-table-column prop="destination" label="目的港" width="90" align="center"></el-table-column>
                    <el-table-column prop="goodEname" label="英文品名"  width="260" align="center" ></el-table-column>
                    <el-table-column prop="mft1201Status" label="原始状态" width="90" align="center">
                        <!--<template slot-scope="scopes" v-if="(scopes.row.mft1201Status)=='SUCC'&&scopes.row.existsMft1201=='Y'">
                            <el-button type="primary" size="small" @click="originalStateDeclare(scopes.row)" style="margin-top: 5px;">删除申报</el-button><br/>
                            <el-button type="primary" size="small" @click="originalStateDeclare(scopes.row)" style="margin-top: 5px;">修改申报</el-button>
                        </template>-->
                        <template slot-scope="scopes">
                            <p v-if="scopes.row.mft1201Status=='SUCC'">成功</p>
                            <el-button type="primary" size="small" @click="originalStateDeclare(scopes.row)" v-if="(!scopes.row.mft1201Status)||(scopes.row.existsMft1201=='Y'&&(scopes.row.mft1201Status=='SAVE'||scopes.row.mft1201Status=='ERROR'))">申报</el-button>
                        </template>
                    </el-table-column>
                    <el-table-column prop="mft5201Status" label="理货状态" width="90" align="center">
                         <!--<el-button type="primary" size="small" @click="tallyStateDeclare(scopes.row)">删除申报</el-button>-->
                        <template slot-scope="scopes">
                            <p v-if="scopes.row.existsMft5201=='Y'&&scopes.row.mft5201Status=='SUCC'">成功</p>
                            <el-button type="primary" size="small" @click="tallyStateDeclare(scopes.row)" v-if="scopes.row.existsMft1201=='Y'&&(!scopes.row.existsMft5201)&&((!scopes.row.mft5201Status)||(scopes.row.mft5201Status)=='SAVE'||(scopes.row.mft5201Status)=='SUCC'||(scopes.row.mft5201Status)=='ERROR')">申报</el-button>
                        </template>
                        <!--<template slot-scope="scopes" v-else-if="(scopes.row.mft5201Status)=='SUCC'">成功</template>-->
                    </el-table-column>
                </el-table>
            </div>
            <saveVisibleTag ref="addMission" v-if="saveVisible" :visible.sync="saveVisible" :frow="frow"></saveVisibleTag>
            <editVisibleTag ref="addMission" v-if="editVisible" :visible.sync="editVisible" :frow="frow"></editVisibleTag>
		</div>
	</el-dialog>
</template>
<script>
    import editVisibleVue from '@/views/af/ai_order/edit_tabs'
    import saveVisibleVue from '@/views/af/ai_order/ai_order_base_save'
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
                ifFullscreen: false,
                loading: false,
				ruleForm: {
                    awbNumber: ''
                },
                ruleData: {},
				rules: {
					awbNumber: [{
                        required: true,
						message: '请选择主单号',
						trigger: ['blur']
					}],
				},
                data:[],
                style:{},
                saveVisible:false,
                editVisible:false,
			};
        },
        components: {
			'saveVisibleTag': saveVisibleVue,
			'editVisibleTag': editVisibleVue,
        },
        provide() {
			return {
				findByPage: this.findByPage,
			}
		},
		methods: {
			// 关闭
			handleClose() {
				if (this.ifFullscreen) {
					setTimeout(() => {
						let userAgent = navigator.userAgent;
						if (userAgent.indexOf("Firefox") != -1 || userAgent.indexOf("Chrome") != -1) {
							window.open('', '_self').close()
						} else {
							window.opener = null;
							window.open("about:blank", "_self");
							window.close();
						}
					}, 2000)
				} else {
					this.$emit('update:visible', false);
				}
            },
            checkQueryList(formName){
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        this.findByPage();
                    } else {
                        console.log('error submit!!');
                        return false;
                    }
                });
            },
            findByPage(){
                let params={
                'awbNumber':this.ruleForm.awbNumber
                }
                this.$axios.post('/afbase/aiOperationLook/queryHAWBList',params)
                .then(function(response) {
                    if (response.data.code == 1) {
                    this.openError(response.data.messageInfo)
                    return
                    }
                    this.ruleForm.awbNumber = response.data.data.awb.mawbCode
                    this.ruleData=response.data.data.awb;
                    this.data = response.data.data.hawb;
                }.bind(this)
                );
            },
            distributionDeclare(){
                this.$axios.post('/afbase/aiOperationLook/distributionDeclare',this.ruleForm)
                .then(function(response) {
                	if (response.data.code == 1) {
                      this.openError(response.data.messageInfo)
                      this.checkQueryList();
                        return
                    }else{
                       this.openSuccess
                       this.checkQueryList();
                    }
                 }.bind(this)
                );
            },
            originalStateDeclare(row){
                let params={
                  'orderCode':row.orderCode,
                  'hawbCode':row.hawbCode
                }
                this.$axios.post('/afbase/aiOperationLook/originalStateDeclare',params)
                .then(function(response) {
                	if (response.data.code == 1) {
                      this.openError(response.data.messageInfo)
                      this.checkQueryList();
                      return
                    }else{
                      this.openSuccess
                      this.checkQueryList();
                    }
                    
                 }.bind(this)
                );
            },
            tallyStateDeclare(row){
                let params={
                  'orderCode':row.orderCode,
                  'hawbCode':row.hawbCode
                }
                this.$axios.post('/afbase/aiOperationLook/tallyStateDeclare',params)
                .then(function(response) {
                	if (response.data.code == 1) {
                        this.openError(response.data.messageInfo)
                        this.checkQueryList();
                        return
                    }else{
                        this.openSuccess;
                        this.checkQueryList();
                    }
                    
                 }.bind(this)
                );
            },
            addSingle(){
                this.frow.orderId="";
                this.saveVisible=true;
            },
            updateSingle(orderId){
                this.frow.orderId=orderId;
                this.frow.activeName = "editTab";
                this.editVisible=true;
                this.frow.viewFlag = true;
                this.frow.businessScope="AI";
            },
            getSummaries(param) {
                const { columns, data } = param;
                const sums = [];
                columns.forEach((column, index) => {
                if (index === 0) {
                    sums[index] = '合计';
                    return;
                }else if(index === 1||index === 2||index === 6||index === 7||index === 8||index === 9||index === 10){
                    return;
                }
                const values = data.map(item => Number(item[column.property]));
                if (!values.every(value => isNaN(value))) {
                    sums[index] = values.reduce((prev, curr) => {
                    const value = Number(curr);
                    if (!isNaN(value)) {
                        return prev + curr;
                    } else {
                        return prev;
                    }
                    }, 0);
                }
                });

                return sums;
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
		},
		created(){
			
		}
	}
</script>
<style>
	.widthWithThree .el-input-group__prepend {
		padding: 0 27px;
	}

	.orderEditPage .el-input__icon {
		line-height: 30px !important;
	}

	.orderEditPage .el-form-item__error {
		margin-top: -5px;
		margin-left: 150px;
	}
</style>
