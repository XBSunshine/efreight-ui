<template>
	<el-dialog title="客商资料分组修改" width="85%" :visible.sync="visible" :close-on-press-escape="false" :close-on-click-modal="false" :before-close="handleClose">
		<el-tabs v-model="activeName" @tab-click="handleClick">
			<el-tab-pane label="客商资料修改" name="first">
				<el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="120px" class="demo-ruleForm">

					<el-row>
						<el-col :span="11">
							<el-form-item label="客商资料代码">
								<el-input v-model="ruleForm.coop_code" auto-complete="off" :disabled="true">
								</el-input>
							</el-form-item>
						</el-col>
					</el-row>
					<el-row>
						<el-col :span="11">
							<el-form-item label="中文全称" prop="coop_name" required>
								<el-input v-model="ruleForm.coop_name" @change="ruleForm.coop_name=strTrim(ruleForm.coop_name)" auto-complete="off" :disabled="true">
								</el-input>
							</el-form-item>
						</el-col>
						<el-col :span="11">
							<el-form-item label="中文简称" prop="short_name" required>
								<el-input v-model="ruleForm.short_name" @change="ruleForm.short_name=strTrim(ruleForm.short_name)" auto-complete="off" :disabled="true">
								</el-input>
							</el-form-item>
						</el-col>
					</el-row>
					<el-row>
						<el-col :span="11">
							<el-form-item label="英文全称" prop="coop_ename" required>
								<el-input v-model="ruleForm.coop_ename" @change="ruleForm.coop_ename=strTrim(ruleForm.coop_ename)" auto-complete="off" :disabled="true">
								</el-input>
							</el-form-item>
						</el-col>
						<el-col :span="11">
							<el-form-item label="英文简称" prop="short_ename" required>
								<el-input v-model="ruleForm.short_ename" @change="ruleForm.short_ename=strTrim(ruleForm.short_ename)" auto-complete="off" :disabled="true">
								</el-input>
							</el-form-item>
						</el-col>
					</el-row>
					<!--<el-row>
						<el-form-item style="text-align: left;">
							<el-button type="primary" @click="submitForm('ruleForm')">修改</el-button>
						</el-form-item>
					</el-row>-->
				</el-form>
			</el-tab-pane>
			<el-tab-pane v-if=false label="业务范畴" name="second">
				<el-row>
					<el-form :model="scope.params" :rules="scoperules" ref="scopeform" label-width="110px" class="demo-ruleForm">
						<el-row>
							<el-col :span="4">
								<el-form-item label="是否关键客户" prop="is_key_client" required>
									<el-select v-model="scope.params.is_key_client">
										<el-option label="是" value="1"></el-option>
										<el-option label="否" value="0"></el-option>
									</el-select>
								</el-form-item>
							</el-col>
							<el-col :span="4">
								<el-form-item label="关系维护人" prop="incharge_id">
									<!-- <el-input v-model.number="scope.params.incharge_id" auto-complete="off" type="number">
									</el-input> -->
									<el-select v-model="scope.params.incharge_id" filterable placeholder="请选择">
										<el-option v-for="item in useroptions" :key="item.value" :label="item.label" :value="item.value">
											<span style="float: left">{{ item.label }}</span>
											<span style="float: right; color: #8492a6; font-size: 13px">{{ item.label2 }}</span>
										</el-option>
									</el-select>
								</el-form-item>
							</el-col>
							<el-col :span="4">
								<el-form-item label="业务范畴" prop="business_scope" required>
									<el-select v-model="scope.params.business_scope">
										<el-option label="AE" value="AE"></el-option>
										<el-option label="AI" value="AI"></el-option>
										<el-option label="SE" value="SE"></el-option>
										<el-option label="SI" value="SI"></el-option>
										<el-option label="TE" value="TE"></el-option>
										<el-option label="TI" value="TI"></el-option>
									</el-select>
								</el-form-item>
							</el-col>
							<el-col :span="4">
								<el-form-item label="信用等级" prop="credit_level" required>
									<el-select v-model="scope.params.credit_level">
										<el-option label="A级" value="A级"></el-option>
										<el-option label="B级" value="B级"></el-option>
										<el-option label="C级" value="C级"></el-option>
										<el-option label="D级" value="D级"></el-option>
										<el-option label="E级" value="E级"></el-option>
									</el-select>
								</el-form-item>
							</el-col>
							<el-col :span="4">
								<el-form-item label="授信额度" prop="credit_limit" required>
									<el-input suffix-icon="iconfont el-icon-myzonghenengyuan_wanyuan" maxlength="9" v-model="scope.params.credit_limit" auto-complete="off" @input="formatToFloat('credit_limit')">
									</el-input>
								</el-form-item>
							</el-col>
							<el-col :span="4">
								<el-form-item label="授信期限" prop="credit_duration">
									<el-input suffix-icon="iconfont el-icon-mytian" maxlength="9" v-model="scope.params.credit_duration" auto-complete="off" @input="formatToFloat('credit_duration')">
									</el-input>
								</el-form-item>
							</el-col>
							<el-col :span="4">
								<el-form-item label="进项税票" prop="invoice_type">
									<!-- <el-input v-model="scope.params.invoice_type" auto-complete="off">
									</el-input> -->
									<el-select v-model="scope.params.invoice_type">
										<el-option label="增值税普票" value="增值税普票"></el-option>
										<el-option label="增值税专票" value="增值税专票"></el-option>
										<el-option label="Debitnote" value="Debitnote"></el-option>
										<el-option label="其他" value="其他"></el-option>
									</el-select>
								</el-form-item>
							</el-col>
							<el-col :span="4">
								<el-form-item label="进项税率" prop="income_tax_rate">
									<el-input maxlength="9" v-model="scope.params.income_tax_rate" auto-complete="off" @input="formatToFloat('income_tax_rate')">
									</el-input>
								</el-form-item>
							</el-col>

							<el-col :span="4">
								<el-form-item label="生效状态" prop="scope_status" required>
									<el-select v-model="scope.params.scope_status">
										<el-option label="生效" value="1"></el-option>
										<el-option label="失效" value="0"></el-option>
									</el-select>
								</el-form-item>
							</el-col>
							<el-col :span="4">
								<el-form-item>
									<el-button type="primary" @click="saveScope()">提交</el-button>
								</el-form-item>
							</el-col>
						</el-row>
					</el-form>
				</el-row>
				<el-row>
					<el-table ref="multipleTable" :data="scope.data" height="400" style="width: 100%" row-key="scope_id" border>
						<el-table-column prop="business_scope" label="业务范畴" width="120"></el-table-column>
						<el-table-column prop="credit_level" label="信用等级" width="120"></el-table-column>
						<el-table-column prop="credit_limit" label="授信额度" width="120"></el-table-column>
						<el-table-column prop="invoice_type" label="进项税票" width="120"></el-table-column>
						<el-table-column prop="income_tax_rate" label="进项税率" width="120"></el-table-column>
						<el-table-column prop="credit_duration" label="授信期限" width="120"></el-table-column>
						<el-table-column prop="is_key_client" label="是否关键客户" :formatter="format_is_key_client" width="120"></el-table-column>
						<el-table-column prop="create_time" label="新建日期" width="120"></el-table-column>
						<el-table-column prop="edit_time" label="更新日期" width="120"></el-table-column>
						<el-table-column prop="scope_status" label="生效状态" :formatter="format_scope_status" width="120"></el-table-column>
						<el-table-column fixed="right" label="操作" width="150">
							<template slot-scope="scope">
								<el-button @click="showeditScope(scope.row)" size="mini">修改</el-button>
							</template>
						</el-table-column>

					</el-table>

					<el-col :span="24" class="pagination">
						<el-pagination background @size-change="scopehandleSizeChange" @current-change="scopehandleCurrentChange" :current-page.sync="scope.pageConf.pageCode" :page-sizes="scope.pageConf.pageOption" :page-size.sync="scope.pageConf.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="scope.pageConf.totalPage">
						</el-pagination>
					</el-col>
				</el-row>
			</el-tab-pane>
			<el-tab-pane label="异常记录" name="third">
				<el-row>
					<el-form :model="lock.params" ref="lock" label-width="80px" class="demo-ruleForm">
						<el-row>
							<el-col :span="4">
								<el-form-item label="锁定类型" prop="lock_type">
									<el-select v-model="lock.params.lock_type" auto-complete="off">
										<el-option label="全部" value=""></el-option>
										<el-option label="解锁" value="解锁"></el-option>
										<el-option label="锁定" value="锁定"></el-option>
										<el-option label="加入黑名单" value="加入黑名单"></el-option>
										<el-option label="加入白名单" value="加入白名单"></el-option>
									</el-select>
								</el-form-item>
							</el-col>
							<el-col :span="4">
								<el-form-item label="锁定原因" prop="lock_reason">
									<el-input v-model="lock.params.lock_reason" auto-complete="off">
									</el-input>
								</el-form-item>
							</el-col>
							<el-col :span="4">
								<el-form-item>
									<el-button @click="queryLockList()">查询</el-button>
								</el-form-item>
							</el-col>
						</el-row>
					</el-form>
				</el-row>
				<el-row>
					<el-table ref="multipleTable" :data="lock.data" height="400" style="width: 100%" row-key="lock_id" border>
						<el-table-column prop="lock_type" label="锁定类型" width="120"></el-table-column>
						<el-table-column prop="lock_reason" label="锁定原因"></el-table-column>
						<el-table-column prop="create_time" label="新建日期"></el-table-column>
						<!-- <el-table-column
              fixed="right"
              label="操作"
              width="150">
              <template slot-lock="lock">
                <el-button @click="showeditlock(lock.row)" size="mini">修改</el-button>
              </template>
            </el-table-column> -->

					</el-table>

					<el-col :span="24" class="pagination">
						<el-pagination background @size-change="lockhandleSizeChange" @current-change="lockhandleCurrentChange" :current-page.sync="lock.pageConf.pageCode" :page-sizes="lock.pageConf.pageOption" :page-size.sync="lock.pageConf.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="lock.pageConf.totalPage">
						</el-pagination>
					</el-col>
				</el-row>
			</el-tab-pane>
		</el-tabs>

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
				ruleForm: {
					coop_id: '',
					coop_code: '',
					coop_mnemonic: '',
					coop_name: '',
					short_name: '',
					coop_ename: '',
					short_ename: '',
					coop_status: '',
					blackwhite_valid: ''
				},
				rules: {
					coop_code: [{
							required: true,
							message: '请输入客商资料代码',
							trigger: ['blur', 'change']
						},
						{
							min: 3,
							max: 3,
							message: '长度为 3',
							trigger: ['blur', 'change']
						}
					],
					coop_name: [{
							required: true,
							message: '请输入中文全称',
							trigger: ['blur', 'change']
						},
						{
							min: 1,
							max: 80,
							message: '长度不超过 80',
							trigger: ['blur', 'change']
						}
					],
					short_name: [{
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
					coop_ename: [{
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
					short_ename: [{
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
					lock_reason: [{
						min: 0,
						max: 200,
						message: '长度不超过 200',
						trigger: ['blur', 'change']
					}],
					blacklist_reason: [{
						min: 0,
						max: 4000,
						message: '长度不超过 4000',
						trigger: ['blur', 'change']
					}],
					whitelist_reason: [{
						min: 0,
						max: 200,
						message: '长度不超过 200',
						trigger: ['blur', 'change']
					}]
				},
				coop_id: '',

				//address--------
				address: {
					data: [],
					params: {
						addr_id: '',
						coop_id: '',
						addr_type: '',
						short_name: '',
						full_address: '',
						addr_status: '1'
					},

					pageConf: {
						//设置一些初始值(会被覆盖)
						pageCode: 1, //当前页
						pageSize: 6, //每页显示的记录数
						totalPage: 12, //总记录数
						pageOption: [4, 6, 10], //分页选项
						handleCurrentChange: function() {
							console.log("页码改变了");
						}
					}
				},
				addressrules: {
					addr_type: [{
						required: true,
						message: '请选择地址类型',
						trigger: ['blur', 'change']
					}],
					short_name: [{
							required: true,
							message: '请输入地址简称',
							trigger: ['blur', 'change']
						},
						{
							min: 0,
							max: 40,
							message: '长度不超过 40',
							trigger: ['blur', 'change']
						}
					],
					full_address: [{
							required: true,
							message: '请输入地址全称',
							trigger: ['blur', 'change']
						},
						{
							min: 0,
							max: 80,
							message: '长度不超过 80',
							trigger: ['blur', 'change']
						}
					],
					addr_status: [{
						required: true,
						message: '请选择生效状态',
						trigger: ['blur', 'change']
					}]
				},
				//contacts--------
				contacts: {
					data: [],
					params: {
						contacts_id: '',
						coop_id: '',
						contacts_type: '',
						contacts_name: '',
						phone_number: '',
						email: '',
						dept_name: '',
						job_position: '',
						tel_number: '',
						contacts_status: '1'
					},

					pageConf: {
						//设置一些初始值(会被覆盖)
						pageCode: 1, //当前页
						pageSize: 6, //每页显示的记录数
						totalPage: 12, //总记录数
						pageOption: [4, 6, 10], //分页选项
						handleCurrentChange: function() {
							console.log("页码改变了");
						}
					}
				},
				contactsrules: {
					contacts_type: [{
						required: true,
						message: '请选择职责类型',
						trigger: ['blur', 'change']
					}],
					contacts_name: [{
							required: true,
							message: '请输入联系人名称',
							trigger: ['blur', 'change']
						},
						{
							min: 1,
							max: 40,
							message: '长度不超过 40',
							trigger: ['blur', 'change']
						}
					],
					email: [{
							required: true,
							message: '请输入联系人邮箱',
							trigger: ['blur', 'change']
						},
						{
							min: 1,
							max: 80,
							message: '长度不超过 80',
							trigger: ['blur', 'change']
						}
					],
					phone_number: [{
							required: true,
							message: '请输入联系人电话',
							trigger: ['blur', 'change']
						},
						{
							min: 1,
							max: 20,
							message: '长度不超过 20',
							trigger: ['blur', 'change']
						}
					],
					contacts_status: [{
						required: true,
						message: '请选择生效状态',
						trigger: ['blur', 'change']
					}],
					dept_name: [{
						min: 0,
						max: 40,
						message: '长度不超过 40',
						trigger: ['blur', 'change']
					}],
					job_position: [{
						min: 0,
						max: 40,
						message: '长度不超过 40',
						trigger: ['blur', 'change']
					}],
					tel_number: [{
						min: 0,
						max: 40,
						message: '长度不超过 40',
						trigger: ['blur', 'change']
					}]
				},
				//scope-------------------------
				scope: {
					data: [],
					params: {
						scope_id: '',
						coop_id: '',
						is_key_client: '',
						incharge_id: '',
						business_scope: '',
						credit_level: '',
						credit_limit: '',
						invoice_type: '',
						payment_dept_id: '',
						income_tax_rate: '0',
						credit_duration: '',
						scope_status: '1'
					},

					pageConf: {
						//设置一些初始值(会被覆盖)
						pageCode: 1, //当前页
						pageSize: 6, //每页显示的记录数
						totalPage: 12, //总记录数
						pageOption: [4, 6, 10], //分页选项
						handleCurrentChange: function() {
							console.log("页码改变了");
						}
					}
				},
				scoperules: {
					is_key_client: [{
						required: true,
						message: '请选择是否关键客户',
						trigger: ['blur', 'change']
					}],
					business_scope: [{
							required: true,
							message: '请输入业务范畴',
							trigger: ['blur', 'change']
						},
						{
							min: 0,
							max: 20,
							message: '长度不超过 20',
							trigger: ['blur', 'change']
						}
					],
					scope_status: [{
						required: true,
						message: '请选择生效状态',
						trigger: ['blur', 'change']
					}],
					credit_level: [{
						required: true,
						message: '请选择信用等级',
						trigger: ['blur', 'change']
					}],
					credit_limit: [{
						required: true,
						message: '请录入授信额度',
						trigger: ['blur', 'change']
					}],
					// credit_limit: [
					//   { min: 0, max: 12, message: '长度不超过 12', trigger: ['blur', 'change']  }
					// ],
					// payment_dept_id: [
					//   { min: 0, max: 12, message: '长度不超过 11', trigger: ['blur', 'change']  }
					// ],
					// income_tax_rate: [
					//   { min: 0, max: 12, message: '长度不超过 12', trigger: ['blur', 'change']  }
					// ],
					invoice_type: [{
						min: 0,
						max: 20,
						message: '长度不超过 20',
						trigger: ['blur', 'change']
					}]

				},

				//lock-------------------------
				lock: {
					data: [],
					params: {
						lock_id: '',
						coop_id: '',
						lock_type: '',
						lock_reason: '',
						creator_id: '',
						create_time: ''
					},

					pageConf: {
						//设置一些初始值(会被覆盖)
						pageCode: 1, //当前页
						pageSize: 6, //每页显示的记录数
						totalPage: 12, //总记录数
						pageOption: [4, 6, 10], //分页选项
						handleCurrentChange: function() {
							console.log("页码改变了");
						}
					}
				},
				useroptions: [],
				deptoptions: [],
				activeName: 'first'
			};
		},
		created: function() {
			// this.ruleForm.coop_code=this.frow.coop_code;
			this.coop_id = this.frow.coop_id;
			this.$axios.post('/prm/coop/viewCoop', {
					coop_id: this.frow.coop_id
				})
				.then((response) => {
					let code = response.data.code;
					if(code == 200) {
						this.ruleForm = response.data.data;
						// this.ruleForm.coop_status = response.data.data.coop_status + '';
						// this.ruleForm.blackwhite_valid = response.data.data.blackwhite_valid + '';
					}

					// this.data1=response.data.data.dataList;

				});

			//address
      this.queryCoopTabs('address');
      //agreement
			this.queryCoopTabs('agreement');
			//contacts
			this.queryContactsList();
			//scope
			this.queryScopeList();
			//lock
			this.queryLockList();

			this.$axios.get('/hrs/dept/selectUser')
				.then(function(response) {
					this.useroptions = response.data.data;
				}.bind(this));
			this.$axios.get('/hrs/dept/selectList?isFinalProfitunit=1')
				.then(function(response) {
					this.deptoptions = response.data.data;
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
					if(valid) {
						// alert('submit!');
						// ruleForm.coop_code = this.father_coop_code+ruleForm.coop_code;
						let params = this.ruleForm;
						params.coop_id = this.coop_id;
						this.$axios.post('/prm/coop/modifyCoop',
							params).then(function(response) {
							if(response.data.code == 200) {
								this.openSuccess();
							} else {
								let errorinfo = response.data.messageInfo;
								//唯一性错误
								if(errorinfo.indexOf('Duplicate entry') > -1) {
									if(errorinfo.indexOf('IDU_prm_coop_code') > -1)
										this.openError('客商资料代码不可重复');
									else if(errorinfo.indexOf('IDU_prm_coop_name') > -1)
										this.openError('客商资料中文名称不可重复');
									else if(errorinfo.indexOf('IDU_prm_short_name') > -1)
										this.openError('客商资料中文简称不可重复');
									else if(errorinfo.indexOf('IDU_prm_coop_ename') > -1)
										this.openError('客商资料英文全称不可重复');
									else if(errorinfo.indexOf('IDU_prm_short_ename') > -1)
										this.openError('客商资料英文简称不可重复');
									else
										this.openError(errorinfo);
								} else {
									this.openError(errorinfo);
								}
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
			// 关闭
			handleClose() {
				this.$emit('update:visible', false);
			},

			//地址相关----------------------------------------------
      queryCoopTabs(tabType) {
				let params = {
					currentPage: this.address.pageConf.pageCode,
					pageSize: this.address.pageConf.pageSize,
					coop_id: this.coop_id,
          tabType: tabType
				}
				this.$axios.post('/prm/coop/queryCoopTabsList', params).then((response) => {debugger
					let code = response.data.code;
					if(tabType=='address'){
            this.address.data = response.data.data.dataList;
            this.address.pageConf.totalPage = response.data.data.totalNum;
          }else{
            this.agreement.data = response.data.data.dataList;
            this.agreement.pageConf.totalPage = response.data.data.totalNum;
          }

				}).catch(err => {
					// console.log(err)
				})
			},
			//pageSize改变时触发的函数
			addresshandleSizeChange() {
				this.queryCoopTabs('address');
			},
			//当前页改变时触发的函数
			addresshandleCurrentChange() {
				this.queryCoopTabs('address');
			},
			saveAddress() {
				// formName = this.addressform;
				this.$refs['addressform'].validate((valid) => {
					if(valid) {
						let params = this.address.params;
						let addr_id = params.addr_id;
						let url = '';
						if(addr_id == '')
							url = '/prm/coop/saveCoopAddress';
						else
							url = '/prm/coop/modifyCoopAddress'
						params.coop_id = this.coop_id;
						this.$axios.post(url,
								params)
							.then(function(response) {
								if(response.data.code == 200) {
									this.openSuccess();
									this.resetFormaddress('address');
									this.queryCoopTabs('address');
								} else {
									this.openError(response.data.messageInfo);
								}

							}.bind(this));
					} else {
						console.log('error submit!!');
						return false;
					}
				});
			},
			showeditaddress(row) {
				// let coop_code = row.coop_code;
				this.address.params.addr_id = row.addr_id;
				this.address.params.coop_id = row.coop_id;
				this.address.params.addr_type = row.addr_type;
				this.address.params.short_name = row.short_name;
				this.address.params.full_address = row.full_address;
				this.address.params.addr_status = row.addr_status + '';
			},
			resetFormaddress(tabType) {
			  if(tabType=='address'){
          this.$refs['addressform'].resetFields();
          this.address.params.addr_id = '';
          this.address.params.coop_id = '';
        }else{
          this.$refs['agreementform'].resetFields();
          this.agreements.params.agreementId = '';
          this.agreements.params.coopId = '';
        }

			},
			format_addr_status(row, column) {
				return row.addr_status == '1' ? "生效" : row.addr_status == '0' ? "失效" : "";
			},

			//联系人相关
			queryContactsList() {
				let params = {
					currentPage: this.contacts.pageConf.pageCode,
					pageSize: this.contacts.pageConf.pageSize,
					coop_id: this.coop_id
				}
				this.$axios.post('/prm/coop/queryCoopContactsList',
						params)
					.then(function(response) {
						let code = response.data.code;
						this.contacts.data = response.data.data.dataList;
						this.contacts.pageConf.totalPage = response.data.data.totalNum;

					}.bind(this));
			},
			//pageSize改变时触发的函数
			contactshandleSizeChange() {
				this.queryContactsList();
			},
			//当前页改变时触发的函数
			contactshandleCurrentChange() {
				this.queryContactsList();
			},
			saveContacts() {
				// formName = this.contactsform;
				this.$refs['contactsform'].validate((valid) => {
					if(valid) {
						let params = this.contacts.params;
						let contacts_id = params.contacts_id;
						let url = '';
						if(contacts_id == '')
							url = '/prm/coop/saveCoopContacts';
						else
							url = '/prm/coop/modifyCoopContacts'
						params.coop_id = this.coop_id;
						this.$axios.post(url,
								params)
							.then(function(response) {
								if(response.data.code == 200) {
									this.openSuccess();
									this.resetFormContacts();
									this.queryContactsList();
								} else {
									this.openError(response.data.messageInfo);
								}

							}.bind(this));
					} else {
						console.log('error submit!!');
						return false;
					}
				});
			},
			showeditContacts(row) {
				// let coop_code = row.coop_code;
				this.contacts.params.contacts_id = row.contacts_id;
				this.contacts.params.coop_id = row.coop_id;
				this.contacts.params.contacts_type = row.contacts_type;
				this.contacts.params.contacts_name = row.contacts_name;
				this.contacts.params.phone_number = row.phone_number;
				this.contacts.params.email = row.email;
				this.contacts.params.dept_name = row.dept_name;
				this.contacts.params.job_position = row.job_position;
				this.contacts.params.tel_number = row.tel_number;
				this.contacts.params.contacts_status = row.contacts_status + '';
			},
			resetFormContacts() {
				this.$refs['contactsform'].resetFields();
				this.contacts.params.contacts_id = '';
				this.contacts.params.coop_id = '';
			},
			format_contacts_status(row, column) {
				return row.contacts_status == '1' ? "生效" : row.contacts_status == '0' ? "失效" : "";
			},

			//业务范畴相关-----------------------------------
			queryScopeList() {
				let params = {
					currentPage: this.scope.pageConf.pageCode,
					pageSize: this.scope.pageConf.pageSize,
					coop_id: this.coop_id
				}
				this.$axios.post('/prm/coop/queryCoopScopeList',
						params)
					.then(function(response) {
						let code = response.data.code;
						this.scope.data = response.data.data.dataList;
						this.scope.pageConf.totalPage = response.data.data.totalNum;

					}.bind(this));
			},
			//pageSize改变时触发的函数
			scopehandleSizeChange() {
				this.queryScopeList();
			},
			//当前页改变时触发的函数
			scopehandleCurrentChange() {
				this.queryScopeList();
			},
			saveScope() {
				// formName = this.scopeform;
				this.$refs['scopeform'].validate((valid) => {
					if(valid) {
						let params = this.scope.params;
						let scope_id = params.scope_id;
						let url = '';
						if(scope_id == '')
							url = '/prm/coop/saveCoopScope';
						else
							url = '/prm/coop/modifyCoopScope'
						params.coop_id = this.coop_id;
						this.$axios.post(url,
								params)
							.then(function(response) {
								if(response.data.code == 200) {
									this.openSuccess();
									this.resetFormScope();
									this.queryScopeList();
								} else {
									this.openError(response.data.messageInfo);
								}

							}.bind(this));
					} else {
						console.log('error submit!!');
						return false;
					}
				});
			},
			showeditScope(row) {
				// let coop_code = row.coop_code;
				this.scope.params.scope_id = row.scope_id;
				this.scope.params.coop_id = row.coop_id;
				this.scope.params.is_key_client = row.is_key_client + '';
				this.scope.params.incharge_id = row.incharge_id;
				this.scope.params.business_scope = row.business_scope;
				this.scope.params.credit_level = row.credit_level;
				this.scope.params.credit_limit = row.credit_limit;
				this.scope.params.invoice_type = row.invoice_type;
				this.scope.params.payment_dept_id = row.payment_dept_id;
				this.scope.params.income_tax_rate = row.income_tax_rate;
				this.scope.params.credit_duration = row.credit_duration;
				this.scope.params.scope_status = row.scope_status + '';
			},
			resetFormScope() {
				this.$refs['scopeform'].resetFields();
				this.scope.params.scope_id = '';
				this.scope.params.coop_id = '';
			},
			format_scope_status(row, column) {
				return row.scope_status == '1' ? "生效" : row.scope_status == '0' ? "失效" : "";
			},
			format_is_key_client(row, column) {
				return row.is_key_client == '1' ? "是" : row.is_key_client == '0' ? "否" : "";
			},

			//异常相关----------------------------------------------
			queryLockList() {
				let params = {
					currentPage: this.lock.pageConf.pageCode,
					pageSize: this.lock.pageConf.pageSize,
					lock_type: this.lock.params.lock_type,
					lock_reason: this.lock.params.lock_reason,
					coop_id: this.coop_id
				}
				this.$axios.post('/prm/coop/queryCoopLockList',
						params)
					.then(function(response) {
						let code = response.data.code;
						this.lock.data = response.data.data.dataList;
						this.lock.pageConf.totalPage = response.data.data.totalNum;

					}.bind(this));
			},
			//pageSize改变时触发的函数
			lockhandleSizeChange() {
				this.queryLockList();
			},
			//当前页改变时触发的函数
			lockhandleCurrentChange() {
				this.queryLockList();
			},

			handleClick(tab, event) {
				console.log(tab, event);
			},
			formatToFloat(item) {
				if(item == 'credit_limit') {
					this.scope.params.credit_limit = this.scope.params.credit_limit.replace(/[^0123456789]/g, "");
					if(this.scope.params.credit_limit.length > 1 && this.scope.params.credit_limit.startsWith("0")) {
						this.scope.params.credit_limit = this.scope.params.credit_limit.replace(/[0]/g, "");
					}
				} else if(item == 'income_tax_rate') {
					this.scope.params.income_tax_rate = this.scope.params.income_tax_rate.replace(/[^0123456789]/g, "");
					if(this.scope.params.income_tax_rate.length > 1 && this.scope.params.income_tax_rate.startsWith("0")) {
						this.scope.params.income_tax_rate = this.scope.params.income_tax_rate.replace(/[0]/g, "");
					}
				} else if(item == 'credit_duration') {
					this.scope.params.credit_duration = this.scope.params.credit_duration.replace(/[^0123456789]/g, "");
					if(this.scope.params.credit_duration.length > 1 && this.scope.params.credit_duration.startsWith("0")) {
						this.scope.params.credit_duration = this.scope.params.credit_duration.replace(/[0]/g, "");
					}
				}
			}
		}
	}
</script>
<style type="text/css">

</style>
