<template>
  <div class="warp-main">
	  <el-dialog title="客商资料 - 修改" width="1000px" :visible.sync="visible" :close-on-press-escape="false" :close-on-click-modal="false" :before-close="handleClose">
		<el-tabs v-model="activeName" @tab-click="handleClick">
			<el-tab-pane label="客商资料修改" name="first">
				<el-form :model="ruleForm" :rules="rules" ref="ruleForm" class="orderListPage">
					<el-row>
						<el-col class="elementWidth">
              <el-form-item prop="coop_code" label-width="15px">
                <el-input class="" v-model="ruleForm.coop_code" style="width:370px;margin-right: 15px;" auto-complete="off" :disabled="true">
                  <template slot="prepend">
                    <font style="color: red;">*</font>
                    <span>客商资料代码</span>
                  </template>
                </el-input>
              </el-form-item>
						</el-col>
						<el-col class="elementWidth">
              <el-form-item prop="coop_type" label-width="15px">
                <el-input class="" auto-complete="off" style="width:370px;margin-right: 15px;">
                  <template slot="prepend">
                    <font style="color: red;">*</font>
                    <span>客商资料类型</span>
                  </template>
                  <el-select slot="suffix" v-model="ruleForm.coop_type" filterable placeholder="请选择" style="width:263px;margin-right: -5px;" clearable>
                    <el-option v-for="item in coopTypeOptions" :key="item.code" :label="item.label" :value="item.value">
                    </el-option>
                  </el-select>
                </el-input>
              </el-form-item>
						</el-col>
					</el-row>
          <el-row>
            <el-col class="elementWidth">
              <el-form-item prop="coopCodeThree" label-width="15px">
                <el-input class="widthFive" v-model="ruleForm.coopCodeThree" style="width:370px;margin-right: 15px;" auto-complete="off" @input="ruleForm.coopCodeThree = toUpperCaseValue(ruleForm.coopCodeThree)">
                  <template slot="prepend">
                    <span>客商三字码</span>
                  </template>
                </el-input>
              </el-form-item>
            </el-col>
            <el-col class="elementWidth">
              <el-form-item prop="financialCode" label-width="15px">
                <el-input class="widthFour" v-model="ruleForm.financialCode" style="width:370px;margin-right: 15px;" auto-complete="off">
                  <template slot="prepend">
                    <span>财务代码</span>
                  </template>
                </el-input>
              </el-form-item>
            </el-col>
          </el-row>
					<el-row>
						<el-col class="elementWidth">
              <el-form-item prop="social_credit_code" label-width="15px">
                <el-input class="widthSix" v-model="ruleForm.social_credit_code" style="width:370px;margin-right: 15px;" auto-complete="off">
                  <template slot="prepend">
                    <span>社会信用代码</span>
                  </template>
                </el-input>
              </el-form-item>
						</el-col>
            <el-col class="elementWidth">
              <el-form-item prop="transactor_id" label-width="15px">
                <el-input class="widthThree1" style="width:370px;;margin-right: 15px;">
                  <template slot="prepend">
                    <span>负责人</span>
                  </template>
                  <el-select slot="suffix" v-model="ruleForm.transactor_id" filterable placeholder="请选择" style="width:291px;margin-right: -5px;" clearable>
                    <el-option v-for="item in useroptions" :key="item.value" :label="item.label" :value="item.value">
                      <span style="float: left">{{ item.label }}</span>
                      <span style="float: right; color: #8492a6; font-size: 13px">{{ item.label4 }}</span>
                    </el-option>
                  </el-select>
                </el-input>
              </el-form-item>
            </el-col>
					</el-row>
					<el-row>
						<el-col class="elementWidth">
              <el-form-item prop="coop_name" label-width="15px">
                <el-input class="" v-model="ruleForm.coop_name" style="width:370px;margin-right: 15px;" auto-complete="off" @blur="setCoopEname(ruleForm.coop_name)">
                  <template slot="prepend">
                    <font style="color: red;">*</font>
                    <span>中文全称</span>
                  </template>
                </el-input>
              </el-form-item>
						</el-col>
            <el-col class="elementWidth">
              <el-form-item prop="coop_ename" label-width="15px">
                <el-input class="" v-model="ruleForm.coop_ename" style="width:370px;margin-right: 15px;" auto-complete="off" @change="ruleForm.coop_ename=strTrim(ruleForm.coop_ename)">
                  <template slot="prepend">
                    <font style="color: red;">*</font>
                    <span>英文全称</span>
                  </template>
                </el-input>
              </el-form-item>
            </el-col>
					</el-row>
					<el-row>
					</el-row>
					<el-row>
						<el-col class="elementWidth">
              <el-form-item prop="bank_name" label-width="15px">
                <el-input class="widthThree1" v-model="ruleForm.bank_name" style="width:370px;margin-right: 15px;" auto-complete="off">
                  <template slot="prepend">
                    <span>开户行</span>
                  </template>
                </el-input>
              </el-form-item>
						</el-col>
						<el-col class="elementWidth">
              <el-form-item prop="bank_number" label-width="15px">
                <el-input class="widthFour" v-model="ruleForm.bank_number" style="width:370px;margin-right: 15px;" auto-complete="off">
                  <template slot="prepend">
                    <span>银行账号</span>
                  </template>
                </el-input>
              </el-form-item>
						</el-col>
					</el-row>
					<el-row>
						<el-col class="elementWidth">
              <el-form-item prop="phone_number" label-width="15px">
                <el-input class="widthTwo" v-model="ruleForm.phone_number" style="width:370px;margin-right: 15px;" auto-complete="off">
                  <template slot="prepend">
                    <span>电话</span>
                  </template>
                </el-input>
              </el-form-item>
						</el-col>
						<el-col class="elementWidth">
              <el-form-item prop="coop_address" label-width="15px">
                <el-input class="widthTwo" v-model="ruleForm.coop_address" style="width:370px;margin-right: 15px;" auto-complete="off">
                  <template slot="prepend">
                    <span>地址</span>
                  </template>
                </el-input>
              </el-form-item>
						</el-col>
					</el-row>
					<el-row>
						<el-col class="elementWidth">
              <el-form-item prop="coop_remark" label-width="15px">
                <el-input class="widthTwo" v-model="ruleForm.coop_remark" style="width:770px;margin-right: 15px;" auto-complete="off">
                  <template slot="prepend">
                    <span>备注</span>
                  </template>
                </el-input>
              </el-form-item>
						</el-col>
					</el-row>
          <div style="padding:15px 0px 10px 15px;width: 785px">
            <HR color="#eee" size="5">
            </HR>
          </div>
          <el-row>
            <el-col class="elementWidth">
              <el-form-item prop="iataCode" label-width="15px">
                <el-input v-model="ruleForm.iataCode" style="width:370px;margin-right: 15px;" auto-complete="off" @input="ruleForm.iataCode = toUpperCaseValue(ruleForm.iataCode)">
                  <template slot="prepend">
                    <span>IATA Code</span>
                  </template>
                </el-input>
              </el-form-item>
            </el-col>
            <el-col class="elementWidth">
              <el-form-item prop="cataCertifiedSalesAgents" label-width="15px">
                <el-input v-model="ruleForm.cataCertifiedSalesAgents" style="width:370px;margin-right: 15px;" auto-complete="off" @input="ruleForm.cataCertifiedSalesAgents = toUpperCaseValue(ruleForm.cataCertifiedSalesAgents)">
                  <template slot="prepend">
                    <span>航协铜牌代码</span>
                  </template>
                </el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col class="elementWidth">
              <el-form-item style="margin-left: 15px;">
                <el-button size="small" type="primary" @click="submitForm('ruleForm')" :disabled="disabledFlag1">修改</el-button>
              </el-form-item>
            </el-col>
          </el-row>
				</el-form>
			</el-tab-pane>
			<el-tab-pane label="地址" name="second">
				<el-row>
					<el-form :model="address.params" :rules="addressrules" ref="addressform" class="orderListPage">
						<el-row>
							<el-col class="elementWidth">
                <el-form-item label-width="10px" prop="addr_type">
                  <el-input class="" style="width:206px;margin-right: 15px;">
                    <template slot="prepend">
                      <font style="color: red;">*</font>
                      <span>地址类型</span>
                    </template>
                    <el-select slot="suffix" v-model="address.params.addr_type" placeholder="请选择" style="width:128px;margin-right: -5px;" clearable>
                      <el-option label="注册地址" value="注册地址"></el-option>
                      <el-option label="办公地址" value="办公地址"></el-option>
                      <el-option label="仓库地址" value="仓库地址"></el-option>
                    </el-select>
                  </el-input>
                </el-form-item>
							</el-col>
							<el-col class="elementWidth">
                <el-form-item prop="short_name" label-width="6px">
                  <el-input v-model="address.params.short_name" style="width:180px;margin-right: 15px;" auto-complete="off">
                    <template slot="prepend">
                      <font style="color: red;">*</font>
                      <span>简称</span>
                    </template>
                  </el-input>
                </el-form-item>
							</el-col>
							<el-col class="elementWidth">
                <el-form-item prop="full_address" label-width="6px">
                  <el-input v-model="address.params.full_address" style="width:380px;margin-right: 15px;" auto-complete="off">
                    <template slot="prepend">
                      <font style="color: red;">*</font>
                      <span>详细地址</span>
                    </template>
                  </el-input>
                </el-form-item>
							</el-col>
							<el-col class="elementWidth">
                <el-form-item style="margin-left: 50px;">
									<el-button size="small" type="primary" @click="saveAddress()" :disabled="disabledFlag3">提交</el-button>
								</el-form-item>
							</el-col>
						</el-row>
            <el-row>
              <el-col class="elementWidth">
                <el-form-item label-width="10px" prop="addr_status">
                  <el-input class="" style="width:206px;margin-right: 6px;">
                    <template slot="prepend">
                      <font style="color: red;">*</font>
                      <span>生效状态</span>
                    </template>
                    <el-select slot="suffix" v-model="address.params.addr_status" placeholder="请选择" style="width:128px;margin-right: -5px;" clearable>
                      <el-option label="生效" value="1"></el-option>
                      <el-option label="失效" value="0"></el-option>
                    </el-select>
                  </el-input>
                </el-form-item>
              </el-col>
            </el-row>
					</el-form>
				</el-row>
				<el-row>
					<el-table ref="multipleTable" :data="address.data" style="width: 100%" row-key="addr_id" border max-height="500px">
            <el-table-column fixed="left" label="操作" width="60" align="center">
              <template slot-scope="scope">
                <el-dropdown trigger="click" @command="handleTabsCommand" @visible-change="handleTabsChange(scope.row)">
                     <i class="el-icon-s-operation"></i>
                     <el-dropdown-menu slot="dropdown">
			             <el-dropdown-item command="editAddress" v-if="editAddressFlag">修改</el-dropdown-item>
			             <el-dropdown-item command="deleteAddress" v-if="deleteAddressFlag">删除</el-dropdown-item>
			         </el-dropdown-menu>
               </el-dropdown>
              </template>
            </el-table-column>
            <el-table-column align="center" prop="addr_type" label="地址类型" width="80px"></el-table-column>
            <el-table-column align="center" prop="short_name" label="地址简称" width="100px"></el-table-column>
            <el-table-column align="left" header-align="center" prop="full_address" label="详细地址" ></el-table-column>
            <el-table-column align="center" label="生效状态"  width="80px">
              <template slot-scope="scope">
                <i class="iconfont el-icon-myduihao" style="color: red;" v-show="scope.row.addr_status"></i>
              </template>
            </el-table-column>
          </el-table>
					<!--<div style="margin-top: 20px">
            <el-button @click="toggleSelection([tableData3[1], tableData3[2]])">切换第二、第三行的选中状态</el-button>
            <el-button @click="toggleSelection()">取消选择</el-button>
          </div>-->
					<el-col :span="24" class="pagination">
						<el-pagination background @size-change="addresshandleSizeChange('agreement')" @current-change="addresshandleCurrentChange('agreement')" :current-page.sync="address.pageConf.pageCode" :page-sizes="address.pageConf.pageOption" :page-size.sync="address.pageConf.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="address.pageConf.totalPage">
						</el-pagination>
					</el-col>
				</el-row>

			</el-tab-pane>
			<el-tab-pane label="联系人" name="third">
				<el-row>
					<el-form :model="contacts.params" :rules="contactsrules" ref="contactsform" class="orderListPage">
						<el-row>
							<el-col class="elementWidth">
                <el-form-item label-width="10px" prop="contacts_type">
                  <el-input class="" style="width:180px;margin-right: 15px;">
                    <template slot="prepend">
                      <font style="color: red;">*</font>
                      <span>类型</span>
                    </template>
                    <el-select slot="suffix" v-model="contacts.params.contacts_type" placeholder="请选择" style="width:130px;margin-right: -5px;" clearable>
                      <el-option label="老板" value="老板"></el-option>
                      <el-option label="订舱" value="订舱"></el-option>
                      <el-option label="操作" value="操作"></el-option>
                      <el-option label="对账" value="对账"></el-option>
                      <el-option label="财务" value="财务"></el-option>
                    </el-select>
                  </el-input>
                </el-form-item>
							</el-col>
							<el-col class="elementWidth">
                <el-form-item prop="contacts_name" label-width="6px">
                  <el-input v-model="contacts.params.contacts_name" style="width:180px;margin-right: 15px;" auto-complete="off">
                    <template slot="prepend">
                      <font style="color: red;">*</font>
                      <span>姓名</span>
                    </template>
                  </el-input>
                </el-form-item>
							</el-col>
							<el-col class="elementWidth">
                <el-form-item prop="email" label-width="6px">
                  <el-input v-model="contacts.params.email" style="width:410px;margin-right: 15px;" auto-complete="off">
                    <template slot="prepend">
                      <font style="color: red;">*</font>
                      <span>邮箱</span>
                    </template>
                  </el-input>
                </el-form-item>
							</el-col>
              <el-col class="elementWidth">
                <el-form-item style="margin-left: 50px;">
                  <el-button size="small" type="primary" @click="saveContacts()" :disabled="disabledFlag2">提交</el-button>
                </el-form-item>
              </el-col>
						</el-row>
            <el-row>
              <el-col class="elementWidth">
                <el-form-item prop="dept_name" label-width="10px">
                  <el-input class="widthThree" v-model="contacts.params.dept_name" style="width:180px;margin-right: 15px;" auto-complete="off">
                    <template slot="prepend">
                      <span>部门</span>
                    </template>
                  </el-input>
                </el-form-item>
              </el-col>
              <el-col class="elementWidth">
                <el-form-item prop="job_position" label-width="6px">
                  <el-input class="widthThree" v-model="contacts.params.job_position" style="width:180px;margin-right: 15px;" auto-complete="off">
                    <template slot="prepend">
                      <span>职务</span>
                    </template>
                  </el-input>
                </el-form-item>
              </el-col>
              <el-col class="elementWidth">
                <el-form-item prop="phone_number" label-width="6px">
                  <el-input class="widthThree" v-model="contacts.params.phone_number" style="width:180px;margin-right: 15px;" auto-complete="off">
                    <template slot="prepend">
                      <span>电话</span>
                    </template>
                  </el-input>
                </el-form-item>
              </el-col>
              <el-col class="elementWidth">
                <el-form-item label-width="10px" prop="contacts_status">
                  <el-input class="" style="width:206px;margin-right: 6px;">
                    <template slot="prepend">
                      <font style="color: red;">*</font>
                      <span>生效状态</span>
                    </template>
                    <el-select slot="suffix" v-model="contacts.params.contacts_status" placeholder="请选择" style="width:128px;margin-right: -5px;" clearable>
                      <el-option label="生效" value="1"></el-option>
                      <el-option label="失效" value="0"></el-option>
                    </el-select>
                  </el-input>
                </el-form-item>
              </el-col>
            </el-row>
					</el-form>
				</el-row>
				<el-row>
					<el-table ref="multipleTable" :data="contacts.data" style="width: 100%"  row-key="contacts_id" border max-height="500px">
            <el-table-column align="center" prop="contacts_type" label="类型" width="60"></el-table-column>
            <el-table-column align="center" prop="contacts_name" label="姓名" width="150"></el-table-column>
            <el-table-column align="center" prop="email" label="邮箱" ></el-table-column>
            <el-table-column align="center" prop="dept_name" label="部门" width="150"></el-table-column>
            <el-table-column align="center" prop="job_position" label="职务" width="150"></el-table-column>
						<el-table-column align="center" prop="phone_number" label="电话" width="150"></el-table-column>
						<el-table-column align="center" label="生效状态"  width="80px">
              <template slot-scope="scope">
                <i class="iconfont el-icon-myduihao" style="color: red;" v-show="scope.row.contacts_status"></i>
              </template>
            </el-table-column>
            <el-table-column fixed="left" label="操作" width="60" align="center">
              <template slot-scope="scope">
                 <el-dropdown trigger="click" @command="handleTabsCommand" @visible-change="handleTabsChange(scope.row)">
                     <i class="el-icon-s-operation"></i>
                     <el-dropdown-menu slot="dropdown">
			             <el-dropdown-item command="editContacts" v-if="editContactsFlag">修改</el-dropdown-item>
			             <el-dropdown-item command="deleteContacts" v-if="deleteContactsFlag">删除</el-dropdown-item>
			         </el-dropdown-menu>
                 </el-dropdown>
              </template>
            </el-table-column>
					</el-table>

					<el-col :span="24" class="pagination">
						<el-pagination background @size-change="contactshandleSizeChange" @current-change="contactshandleCurrentChange" :current-page.sync="contacts.pageConf.pageCode" :page-sizes="contacts.pageConf.pageOption" :page-size.sync="contacts.pageConf.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="contacts.pageConf.totalPage">
						</el-pagination>
					</el-col>
				</el-row>
			</el-tab-pane>
			<el-tab-pane label="业务范畴" name="fourth">
				<el-row>
					<el-form :model="scope.params" :rules="scoperules" ref="scopeform" class="orderListPage">
						<el-row>
              <el-col class="elementWidth">
                <el-form-item label-width="10px" prop="business_scope">
                  <el-input style="width:180px;margin-right: 15px;">
                    <template slot="prepend"><font style="color: red;">*</font>业务范畴</template>
                    <el-select slot="suffix" v-model="scope.params.business_scope" placeholder="请选择" style="width:105px;margin-right: -5px;" :disabled="scope.businessScopeDisabled" clearable>
                      <el-option  v-for="item in scope.businessCodes" :key="item.paramText" :label="item.paramText" :value="item.paramText"></el-option>
                    </el-select>
                  </el-input>
                </el-form-item>
              </el-col>
              <el-col class="elementWidth">
                <el-form-item label-width="10px" prop="scope_status">
                  <el-input class="" style="width:180px;margin-right: 6px;">
                    <template slot="prepend">
                      <font style="color: red;">*</font>
                      <span>生效状态</span>
                    </template>
                    <el-select slot="suffix" v-model="scope.params.scope_status" placeholder="请选择" style="width:102px;margin-right: -5px;" clearable>
                      <el-option label="生效" value="1"></el-option>
                      <el-option label="失效" value="0"></el-option>
                    </el-select>
                  </el-input>
                </el-form-item>
              </el-col>
              <el-col class="elementWidth">
                <el-form-item label-width="18px" prop="is_key_client">
                  <el-input class="" style="width:180px;margin-right: 6px;">
                    <template slot="prepend">
                      <font style="color: red;">*</font>
                      <span>关键客户</span>
                    </template>
                    <el-select slot="suffix" v-model="scope.params.is_key_client" placeholder="请选择" style="width:102px;margin-right: -5px;" clearable>
                      <el-option label="是" value="1"></el-option>
                      <el-option label="否" value="0"></el-option>
                    </el-select>
                  </el-input>
                </el-form-item>
              </el-col>
              <el-col class="elementWidth">
                <el-form-item label-width="20px" prop="incharge_id">
                  <el-input class="" style="width:206px;margin-right: 6px;">
                    <template slot="prepend">
                      <span>关系维护人</span>
                    </template>
                    <el-select slot="suffix" v-model="scope.params.incharge_id" placeholder="请选择" style="width:128px;margin-right: -5px;" clearable>
                      <el-option v-for="item in useroptions" :key="item.value" :label="item.label" :value="item.value">
                        <span style="float: left">{{ item.label }}</span>
                        <span style="float: right; color: #8492a6; font-size: 13px">{{ item.label2 }}</span>
                      </el-option>
                    </el-select>
                  </el-input>
                </el-form-item>
              </el-col>
              <el-col class="elementWidth">
                <el-form-item style="margin-left: 40px;">
                  <el-button size="small" type="primary" @click="saveScope()" :disabled="disabledFlag4">提交</el-button>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col class="elementWidth">
                <el-form-item label-width="10px" prop="credit_level">
                  <el-input class="" style="width:180px;margin-right: 15px;">
                    <template slot="prepend">
                      <font style="color: red;">*</font>
                      <span>信用等级</span>
                    </template>
                    <el-select slot="suffix" v-model="scope.params.credit_level" placeholder="请选择" style="width:102px;margin-right: -5px;" clearable>
                      <el-option label="A级" value="A级"></el-option>
                      <el-option label="B级" value="B级"></el-option>
                      <el-option label="C级" value="C级"></el-option>
                      <el-option label="D级" value="D级"></el-option>
                      <el-option label="E级" value="E级"></el-option>
                    </el-select>
                  </el-input>
                </el-form-item>
              </el-col>
              <el-col class="elementWidth">
                <el-form-item prop="credit_limit" label-width="10px">
                  <el-input class="" v-model="scope.params.credit_limit" style="width:180px;margin-right: 15px;" auto-complete="off" @input="formatToFloat('credit_limit')" suffix-icon="iconfont el-icon-myzonghenengyuan_wanyuan">
                    <template slot="prepend">
                      <font style="color: red;">*</font>
                      <span>授信额度</span>
                    </template>
                  </el-input>
                </el-form-item>
              </el-col>
              <el-col class="elementWidth">
                <el-form-item prop="settlement_period" label-width="10px">
                  <el-input class="widthEQ" style="width:180px;margin-right: 15px;">
                    <template slot="prepend">
                      <font style="color: red;">*</font>
                      <span>EQ</span>
                    </template>
                    <el-select slot="suffix" v-model="scope.params.settlement_period" placeholder="请选择" style="width:105px;margin-right: -5px;">
                      <el-option  v-for="item in scope.settlementPeriods" :key="item.edicode1" :label="item.paramText" :value="item.edicode1"></el-option>
                    </el-select>
                  </el-input>
                </el-form-item>
              </el-col>
              <el-col class="elementWidth">
                <el-form-item prop="credit_duration" label-width="10px">
                  <el-input class="widthThree" v-model="scope.params.credit_duration" style="width:206px;margin-right: 15px;" auto-complete="off" @input="formatToFloat('credit_duration')" suffix-icon="iconfont el-icon-mytian">
                    <template slot="prepend">
                      <span>授信期限</span>
                    </template>
                  </el-input>
                </el-form-item>
              </el-col>
						</el-row>
					</el-form>
				</el-row>
				<el-row>
					<el-table ref="multipleTable" :data="scope.data" style="width: 100%" row-key="scope_id" border max-height="500px">
            <el-table-column fixed="left" label="操作" width="60" align="center">
              <template slot-scope="scope">
                <el-button @click="showeditScope(scope.row)" type="text" size="small">修改</el-button>
              </template>
            </el-table-column>
						<el-table-column align="center" prop="business_scope" label="业务范畴" width="80"></el-table-column>
						<el-table-column align="center" prop="credit_level" label="信用等级" width="80"></el-table-column>
						<el-table-column align="center" prop="credit_limit" label="授信额度" width="100"></el-table-column>
            <el-table-column align="center" prop="settlement_period_name" label="EQ" width="80"></el-table-column>
            <el-table-column align="center" prop="credit_duration" label="授信期限" width="80"></el-table-column>
						<el-table-column align="center" prop="is_key_client" label="关键客户"  width="80">
              <template slot-scope="scope">
                <i class="iconfont el-icon-myduihao" style="color: red;" v-show="scope.row.is_key_client"></i>
              </template>
            </el-table-column>
            <el-table-column align="center" prop="incharge_user_name" label="关系维护人" width="110"></el-table-column>
						<el-table-column align="center" prop="scope_status" label="生效状态" width="80">
              <template slot-scope="scope">
                <i class="iconfont el-icon-myduihao" style="color: red;" v-show="scope.row.scope_status"></i>
              </template>
            </el-table-column>
            <el-table-column></el-table-column>
					</el-table>
					<el-col :span="24" class="pagination">
						<el-pagination background @size-change="scopehandleSizeChange" @current-change="scopehandleCurrentChange" :current-page.sync="scope.pageConf.pageCode" :page-sizes="scope.pageConf.pageOption" :page-size.sync="scope.pageConf.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="scope.pageConf.totalPage">
						</el-pagination>
					</el-col>
				</el-row>
			</el-tab-pane>


      <el-tab-pane label="合同" name="sixth">
        <el-row>
          <el-form :model="agreements.params" :rules="agreementsrules" ref="agreementsform" class="orderListPage">
            <el-row>
              <el-col class="elementWidth">
                <el-form-item prop="serial_number">
                  <el-input v-model="agreements.params.serial_number" class="elinputDiv" auto-complete="off" clearable>
                    <template slot="prepend">
                      <font style="color: red;">*</font>
                      <span>合同编号</span>
                    </template>
                  </el-input>
                </el-form-item>
              </el-col>
              <el-col class="elementWidth">
                <el-form-item prop="begin_date">
                  <el-input class="elinputDiv">
                    <template slot="prepend">
                      <font style="color: red;">*</font>
                      <span>生效日期</span>
                    </template>
                    <el-date-picker slot="suffix" class="elInputChild" v-model="agreements.params.begin_date" clearable type="date" value-format="yyyy-MM-dd 00:00:00"
                                    placeholder="选择日期">
                    </el-date-picker>
                  </el-input>
                </el-form-item>
              </el-col>
              <el-col class="elementWidth">
                <el-form-item prop="end_date">
                  <el-input class="elinputDiv">
                    <template slot="prepend">
                      <font style="color: red;">*</font>
                      <span>失效日期</span>
                    </template>
                    <el-date-picker slot="suffix" class="elInputChild" v-model="agreements.params.end_date" clearable type="date" value-format="yyyy-MM-dd 23:59:59"
                                    placeholder="选择日期">
                    </el-date-picker>
                  </el-input>
                </el-form-item>
              </el-col>
              <el-col class="elementWidth">
                <el-form-item style="margin-left: 68px;">
                  <el-button size="mini" type="primary" @click="saveAgreement()" :disabled="disabledFlag6">提交</el-button>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col class="elementWidth">
                <el-form-item prop="agreement_type">
                  <el-input class="elinputDiv">
                    <template slot="prepend">
                      <font style="color: red;">*</font>
                      <span>合同类型</span>
                    </template>

                    <el-select slot="suffix" v-model="agreements.params.agreement_type" filterable class="elInputChild" clearable>
                      <el-option v-for="item in agreementTypes" :key="item.paramText" :label="item.paramText" :value="item.paramText">
                      </el-option>
                    </el-select>

                  </el-input>
                </el-form-item>
              </el-col>
              <el-col class="elementWidth">
                <el-form-item prop="template">
                  <el-input class="elinputDiv">
                    <template slot="prepend">
                      <font style="color: red;">*</font>
                      <span>合同模板</span>
                    </template>
                    <el-select slot="suffix" v-model="agreements.params.template" class="elInputChild" clearable>
                      <el-option v-for="item in templates" :key="item.paramText" :label="item.paramText" :value="item.paramText"></el-option>
                    </el-select>
                  </el-input>
                </el-form-item>
              </el-col>
              <el-col class="elementWidth">
                  <el-form-item prop="incharge_id">
                    <el-input class="elinputDiv fileUrlInput">
                      <template slot="prepend">
                        <font style="color: red;">*</font>
                        <span>经办人</span>
                      </template>
                      <el-select slot="suffix" v-model="agreements.params.incharge_id" class="elInputChild" clearable>
                        <el-option v-for="item in useroptions" :key="item.value" :label="item.label" :value="item.value">
                          <span style="float: left">{{ item.label }}</span>
                          <span style="float: right; color: #8492a6; font-size: 13px">{{ item.label2 }}</span>
                        </el-option>
                      </el-select>
                    </el-input>
                  </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col class="elementWidth">
                <el-form-item prop="settlement_period">
                  <el-input class="elinputDiv">
                    <template slot="prepend">
                      <font style="color: red;">*</font>
                      <span>结算周期</span>
                    </template>
                    <el-select slot="suffix" v-model="agreements.params.settlement_period" class="elInputChild" clearable>
                      <el-option v-for="item in settlementPeriods" :key="item.paramText" :label="item.paramText" :value="item.paramText"></el-option>
                    </el-select>
                  </el-input>
                </el-form-item>
              </el-col>
              <el-col class="elementWidth">
                <el-form-item prop="payment_period">
                  <el-input v-model="agreements.params.payment_period" @change="agreements.params.payment_period=strTrim(agreements.params.payment_period)" class="elinputDiv"  @input="formatToFloat('payment_period')" suffix-icon="iconfont el-icon-mytian">
                    <template slot="prepend">
                      <font style="color: red;">*</font>
                      <span>合同账期</span>
                    </template>
                  </el-input>
                </el-form-item>
              </el-col>
              <el-col class="elementWidth">
                <el-form-item prop="total_amount">
                  <el-input v-model="agreements.params.total_amount" class="elinputDiv" auto-complete="off" @input="formatToFloat('total_amount')" suffix-icon="iconfont el-icon-myzonghenengyuan_wanyuan" >
                    <template slot="prepend">
                      <font style="color: red;">*</font>
                      <span>合同额度</span>
                    </template>
                  </el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col class="elementWidth">
                <el-form-item prop="file_url">
                  <el-input class="fileUrlInput" v-model="fileForm.fileName" disabled style="width:810px">
                    <template slot="prepend">
                      <span>附件</span>
                    </template>
                  </el-input>

                </el-form-item>

              </el-col>
             <el-col class="elementWidth">
                <el-form-item style="margin-left: 20px;margin-top:-2px">
                  <el-upload :action="actionPath" :accept="accept" :data="uptoken" :before-upload="beforeAvatarUpload"
                                  :on-remove="handleRemoveChange" :on-success="handleSuccessChange" ref="upload"
                             :show-file-list="false" :auto-upload="true">
                    <el-button size="mini" type="primary" :disabled="disabledFlag3">选择</el-button>&nbsp;
                  </el-upload>
                </el-form-item>
              </el-col>
              <el-col class="elementWidth"style="margin-left: 4px;">
                <el-button size="mini" type="primary" @click="clearFile()">清空</el-button>
              </el-col>
            </el-row>
            <el-row>
              <el-col class="elementWidth">
                <span style="margin-left: 80px;font-size: smaller;">支持格式：PDF/DOC/DOCX/XLS/XLSX/TXT/RAR/ZIP/JPG/JPEG/BMP/PNG , 最大10M。</span>
              </el-col>
            </el-row>
            <el-row>
              <el-col class="elementWidth">
                <el-form-item prop="agreement_remark">
                  <el-input v-model="agreements.params.agreement_remark" @change="agreements.params.agreement_remark=strTrim(agreements.params.agreement_remark)" auto-complete="off" style="width: 810px;">
                    <template slot="prepend">
                      <span>合同备注</span>
                    </template>
                  </el-input>
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
        </el-row>
        <el-row>
          <el-table ref="multipleTable" :data="agreements.data" style="width: 100%"  row-key="agreements_id" border max-height="500px">
            <el-table-column fixed="left" label="操作" width="60" align="center">
              <template slot-scope="scope">
                <el-dropdown trigger="click" @command="handleTabsCommand" @visible-change="handleTabsChange(scope.row)">
                  <i class="el-icon-s-operation"></i>
                  <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item command="editAgreement" v-if="editAgreementFlag">修改</el-dropdown-item>
                    <el-dropdown-item command="addAgreement" v-if="addAgreementFlag">续签</el-dropdown-item>
                    <el-dropdown-item command="stopAgreement" v-if="stopAgreementFlag">废止</el-dropdown-item>
                  </el-dropdown-menu>
                </el-dropdown>
              </template>
            </el-table-column>
            <el-table-column align="center" prop="serial_number" label="合同编号" width="150"></el-table-column>
            <el-table-column align="center" prop="begin_date" label="生效日期" width="110"></el-table-column>
            <el-table-column align="center" prop="end_date" label="失效日期" width="110" ></el-table-column>
            <el-table-column align="center" prop="agreement_type" label="合同类型" width="100" ></el-table-column>
            <el-table-column align="center" prop="template" label="合同模板" width="100" ></el-table-column>
            <el-table-column align="center" prop="incharge_name" label="经办人" width="100" ></el-table-column>
            <el-table-column align="center" prop="settlement_period" label="结算周期" width="90" ></el-table-column>
            <el-table-column align="center" prop="file_name" label="附件"  width="190">
             <template slot-scope="scope">
                <a href="javascript:void(0)" @click="downloadShow(scope.row)" style="color: #137DFA;text-decoration: underline;">{{scope.row.file_name}}</a>
              </template>
            </el-table-column>
            <el-table-column align="center" prop="agreement_remark" label="备注" width="389"></el-table-column>
          </el-table>

          <el-col :span="24" class="pagination">
            <el-pagination background @size-change="addresshandleSizeChange('agreement')" @current-change="addresshandleCurrentChange('agreement')" :current-page.sync="agreements.pageConf.pageCode" :page-sizes="agreements.pageConf.pageOption" :page-size.sync="agreements.pageConf.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="agreements.pageConf.totalPage">
            </el-pagination>
          </el-col>
        </el-row>
      </el-tab-pane>

			<el-tab-pane label="异常记录" name="fifth">
				<el-row>
					<el-form :model="lock.params" ref="lock" class="orderListPage">
						<el-row>
							<el-col class="elementWidth">
                <el-form-item label-width="10px" prop="lock_type">
                  <el-input class="" style="width:200px;margin-right: 6px;">
                    <template slot="prepend">
                      <span>异常类型</span>
                    </template>
                    <el-select slot="suffix" v-model="lock.params.lock_type" placeholder="请选择" style="width:132px;margin-right: -5px;" clearable>
                      <el-option label="全部" value=""></el-option>
                      <el-option label="解锁" value="解锁"></el-option>
                      <el-option label="锁定" value="锁定"></el-option>
                      <el-option label="加入黑名单" value="加入黑名单"></el-option>
                      <el-option label="加入白名单" value="加入白名单"></el-option>
                      <el-option label="移出黑名单" value="移出黑名单"></el-option>
                      <el-option label="移出白名单" value="移出白名单"></el-option>
                    </el-select>
                  </el-input>
                </el-form-item>
							</el-col>
							<el-col class="elementWidth">
                <el-form-item prop="lock_reason" label-width="10px">
                  <el-input class="" v-model="lock.params.lock_reason" style="width:380px;margin-right: 15px;" auto-complete="off">
                    <template slot="prepend">
                      <span>异常原因</span>
                    </template>
                  </el-input>
                </el-form-item>
							</el-col>
							<el-col class="elementWidth">
								<el-form-item style="margin-left: 50px;">
									<el-button size="small" type="primary" @click="queryLockList()">查询</el-button>
								</el-form-item>
							</el-col>
						</el-row>
					</el-form>
				</el-row>
				<el-row>
					<el-table ref="multipleTable" :data="lock.data" style="width: 100%" row-key="lock_id" border>
						<el-table-column align="center" prop="lock_type" label="异常类型" width="120"></el-table-column>
						<el-table-column align="left" header-align="center" prop="lock_reason" label="异常原因"></el-table-column>
						<el-table-column align="center" prop="create_time" label="异常日期" width="160"></el-table-column>
					</el-table>
					<el-col :span="24" class="pagination">
						<el-pagination background @size-change="lockhandleSizeChange" @current-change="lockhandleCurrentChange" :current-page.sync="lock.pageConf.pageCode" :page-sizes="lock.pageConf.pageOption" :page-size.sync="lock.pageConf.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="lock.pageConf.totalPage">
						</el-pagination>
					</el-col>
				</el-row>
			</el-tab-pane>
		</el-tabs>

	</el-dialog>
    <delAgreement ref="addMission" v-if="deleteAgreementVisible" :visible.sync="deleteAgreementVisible" :frow="frow"></delAgreement>
  </div>
</template>
<script>
 import deleteAgreementWin from './prm_coop_agreement_delete'
	export default {
		props: {
			visible: {
				type: Boolean,
				default: false
			},
			frow: Object
		},
    components: {
      "delAgreement":deleteAgreementWin
    },
		data() {
      var checkSerialNumber = (rule, value, callback) => {
        if(!value) {
          return callback();
        }
        var u = '/prm/coop/checkSerialNumber/'+this.agreements.params.serial_number+'/'+this.agreements.params.agreement_id;
        this.$axios.get(u)
          .then(function(response) {
            let data = response.data.data;
            if (!!data && data.length>0) {
              callback(new Error('合同编号重复'));
            }else {
              callback();
            }
          }.bind(this));
      }
      var checkBeginDate = (rule, value, callback) => {
        if(this.lastBeginDate != "") {
          var beginLast = new Date(this.lastBeginDate).getTime();
          var beginDateD = new Date(value).getTime();
          if(beginLast < beginDateD) {
            return callback()
          } else {
            return callback(new Error('生效日期必须晚于' + this.lastBeginDate.substr(0, 10)))
          }
        } else {
          return callback()
        }
      }
      var checkendDate = (rule, value, callback) => {
        if(value != null && value != "") {
          var endTimeD = new Date(value).getTime();
          var beginDateD = new Date(this.agreements.params.begin_date).getTime();
          if(endTimeD < beginDateD) {
            return callback(new Error('失效日期不能早于生效日期'))
          } else {
            return callback()
          }
        } else {
          return callback()
        }
      }

      let numberValidator = (rule, value, callback) => {
        if(!value) {
          return callback();
        }
        let regE =/^[0-9]\d{0,7}$/;
        if(!regE.test(value)) {
          callback(new Error('请输入最大8位大于等于0的整数'));
        } else {
          callback();
        }
      };

      var checkNumber = (rule, value, callback) => {
        // let regE = /^[1-9]\d*\.\d*|0\.\d*[1-9]\d*$/;
        let regE =/^[0-9]\d{0,7}$/;
        let regE2=/^\d{1,8}([\.]\d{0,2})$/
        if (regE.test(value) || regE2.test(value)) {
          callback();
        }else {
          callback(new Error('整数最大8位，小数最大2位'));
        }
      };
			return {
        deleteAgreementVisible: false,
        frow: {},
        lastBeginDate: "",
        useroptions: [],
        coopTypeOptions:[],
				ruleForm: {
					coop_id: '',
					coop_code: '',
					coop_type: '',
					coop_mnemonic: '',
					coop_name: '',
					short_name: '',
					coop_ename: '',
					short_ename: '',
					social_credit_code: '',
					bank_name: '',
					bank_number: '',
					phone_number: '',
					coop_address: '',
					coop_remark: '',
					coop_status: '',
					blackwhite_valid: '',
          transactor_id: '',
          coopCodeThree: '',
          iataCode: '',
          cataCertifiedSalesAgents: '',
          financialCode: '',
				},
        disabledFlag1: false,
        editAddressFlag:false,
        deleteAddressFlag:false,
        editContactsFlag:false,
        deleteContactsFlag:false,
        //TODO
        editAgreementFlag:false,
        addAgreementFlag:false,
        stopAgreementFlag:false,
				rules: {
					coop_code: [{
							required: true,
							message: '请输入客商资料代码',
							trigger: ['blur', 'change']
						},
						{
							min: 6,
							max: 6,
							message: '长度为 6',
							trigger: ['blur', 'change']
						}
					],
					coop_type: [{
						required: true,
						message: '请选择客商资料类型',
						trigger: ['blur', 'change']
					}],
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
					social_credit_code: [
						{
							min: 0,
							max: 20,
							message: '长度不超过 20',
							trigger: ['blur', 'change']
						}
					],
					bank_name: [{
						min: 0,
						max: 200,
						message: '长度不超过 200',
						trigger: ['blur', 'change']
					}],
					bank_number: [{
						min: 0,
						max: 200,
						message: '长度不超过 200',
						trigger: ['blur', 'change']
					}],
					phone_number: [{
						min: 0,
						max: 20,
						message: '长度不超过 20',
						trigger: ['blur', 'change']
					}],
					coop_address: [{
						min: 0,
						max: 40,
						message: '长度不超过 40',
						trigger: ['blur', 'change']
					}],
					coop_remark: [{
						min: 0,
						max: 200,
						message: '长度不超过 200',
						trigger: ['blur', 'change']
					}],
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
					}],
          iataCode: [{
              min: 0,
              max: 15,
              message: '长度不超过 15',
              trigger: ['blur', 'change']
          }],
          cataCertifiedSalesAgents: [{
              min: 0,
              max: 20,
              message: '长度不超过 20',
              trigger: ['blur', 'change']
          }],
          financialCode: [{
              min: 0,
              max: 20,
              message: '长度不超过 20',
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
						pageSize: 10, //每页显示的记录数
						totalPage: 12, //总记录数
						pageOption: [10,20], //分页选项
						handleCurrentChange: function() {
							console.log("页码改变了");
						}
					}
				},
        disabledFlag3:false,
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
						contacts_type: '对账',
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
						pageSize: 10, //每页显示的记录数
						totalPage: 12, //总记录数
						pageOption: [10,20], //分页选项
						handleCurrentChange: function() {
							console.log("页码改变了");
						}
					}
				},

        disabledFlag2: false,
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
              max: 100,
              message: '长度不超过 100',
              trigger: ['blur', 'change']
            }
            /*{
              type: 'email',
              message: '请输入正确的邮箱地址',
              trigger: ['blur', 'change']
            },
						{
							min: 1,
							max: 80,
							message: '长度不超过 80',
							trigger: ['blur', 'change']
						}*/
					],
					phone_number: [/*{
							required: true,
							message: '请输入联系人电话',
							trigger: ['blur', 'change']
						},*/
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

        //agreements--------
        disabledFlag6: false,
        agreements: {
          data: [],
          params: {
            agreement_id: '',
            coop_id: '',
            agreement_type: '',
            serial_number: '',
            begin_date: this.getCurrDateAndCurrMonthLastDay()[0],
            end_date: '',
            template: '',
            incharge_id: '',
            settlement_period: '',
            total_amount: '0',
            payment_period: '0',
            file_url: '',
            file_name: '',
            agreement_remark: '',
          },
          pageConf: {
            //设置一些初始值(会被覆盖)
            pageCode: 1, //当前页
            pageSize: 10, //每页显示的记录\数
            totalPage: 12, //总记录数
            pageOption: [10,20], //分页选项
            handleCurrentChange: function() {
              console.log("页码改变了");
            }
          }
        },
        fileForm: {
          businessScope: '',
          orderId: '',
          fileType: '文件',
          fileName: '',
          fileUrl: '',
          fileRemark: '',
          isDisplay: '1',
          chBillTemplate: '',
        },
        actionPath: 'http://up-z1.qiniu.com',
        accept: ".PDF,.DOC,.DOCX,.XLS,.XLSX,.TXT,.RAR,.ZIP,.JPG,.JPEG,.BMP,.PNG",
        uptoken: {
          token: '',
          key: ""
        },
        formData: {
          smallModelPhoto: [],
        },

        agreementsrules: {
          serial_number: [{
            required: true,
            message: '请输入合同编号',
            trigger: ['blur', 'change']
          },
            {
              min: 1,
              max: 50,
              message: '长度不超过 50',
              trigger: ['blur', 'change']
            },
            {
              validator: checkSerialNumber,
              trigger: ['blur', 'change']
            }
          ],
          begin_date: [{
            required: true,
            message: '请选择生效日期',
            trigger: ['blur', 'change']
          },
            {
              validator: checkBeginDate,
              trigger: ['blur', 'change']
            }
          ],
          end_date: [{
            required: true,
            message: '请选择生效日期',
            trigger: ['blur', 'change']
          },{
            validator: checkendDate,
            trigger: ['blur', 'change']
          }],
          agreement_type: [{
            required: true,
            message: '请选择合同类型',
            trigger: ['blur', 'change']
          }],
          template: [{
            required: true,
            message: '请选择合同模板',
            trigger: ['blur', 'change']
          }],
          incharge_id: [{
            required: true,
            message: '请选择经办人',
            trigger: ['blur', 'change']
          }],
          settlement_period: [{
            required: true,
            message: '请选择结算周期',
            trigger: ['blur', 'change']
          }],
          payment_period: [{
            required: true,
            message: '请输入合同账期',
            trigger: ['blur', 'change']
          },
            {
              validator: numberValidator,
              trigger: ['blur', 'change']
            }
          ],
          total_amount: [{
            required: true,
            message: '请输入合同额度',
            trigger: ['blur', 'change']
          },
            {
              validator: checkNumber,
              trigger: ['blur', 'change']
            }
          ],
          agreement_remark: [{
            min: 0,
            max: 200,
            message: '长度不超过 200',
            trigger: ['blur', 'change']
          }],
        },
				//scope-------------------------
				scope: {
					data: [],
          businessCodes: [],
          settlementPeriods: [],
					params: {
						scope_id: '',
						coop_id: '',
						is_key_client: '0',
						incharge_id: '',
						business_scope: '',
						credit_level: 'E级',
						credit_limit: '0',
						invoice_type: '',
						payment_dept_id: '',
						income_tax_rate: '0',
						credit_duration: '0',
						scope_status: '1',
            settlement_period: '30',
					},

					pageConf: {
						//设置一些初始值(会被覆盖)
						pageCode: 1, //当前页
						pageSize: 10, //每页显示的记录数
						totalPage: 12, //总记录数
						pageOption: [10,20], //分页选项
						handleCurrentChange: function() {
							console.log("页码改变了");
						}
					},
					businessScopeDisabled: false
				},
        disabledFlag4: false,
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
					invoice_type: [{
						min: 0,
						max: 20,
						message: '长度不超过 20',
						trigger: ['blur', 'change']
					}],
          settlement_period: [{
              required: true,
              message: '请选择结算周期',
              trigger: ['blur', 'change']
          }],

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
						pageSize: 10, //每页显示的记录数
						totalPage: 12, //总记录数
						pageOption: [10,20], //分页选项
						handleCurrentChange: function() {
							console.log("页码改变了");
						}
					}
				},
				deptoptions: [],
        agreementTypes:[],
        templates:[],
        settlementPeriods:[],
				activeName: 'first'
			};
		},
    inject: ['queryCoopList'],
		created: function() {
      this.$axios.get('/hrs/org/getUpToken')
        .then(function(response) {
          this.uptoken.token = response.data.data;
          if (this.uptoken.token == null || this.uptoken.token == '') {
            this.$message.error('因缺失token，无法上传文件，故无法新增附件')
          }
        }.bind(this));
		  let buttonInfo = window.localStorage.getItem('buttonInfo');
      if (buttonInfo.indexOf('sys_coop_address_edit')>-1) {
        this.editAddressFlag=true;
      }
      if (buttonInfo.indexOf('sys_coop_address_delete')>-1) {
        this.deleteAddressFlag=true;
      }
      if (buttonInfo.indexOf('sys_coop_contact_edit')>-1) {
        this.editContactsFlag=true;
      }
      if (buttonInfo.indexOf('sys_coop_contact_delete')>-1) {
        this.deleteContactsFlag=true;
      }
      if (buttonInfo.indexOf('sys_coop_agreement_edit')>-1) {
        this.editAgreementFlag=true;
      }
      if (buttonInfo.indexOf('sys_coop_agreement_add')>-1) {
        this.addAgreementFlag=true;
      }
      if (buttonInfo.indexOf('sys_coop_agreement_stop')>-1) {
        this.stopAgreementFlag=true;
      }
			this.coop_id = this.frow.coop_id;
			if(this.frow.continue) {
				this.activeName = 'second'
			}
      this.$axios.get('/hrs/dept/selectUser')
          .then(function(response) {
              this.useroptions = response.data.data;
          }.bind(this));
			this.$axios.post('/prm/coop/viewCoop', {
					coop_id: this.frow.coop_id
				})
				.then((response) => {
					let code = response.data.code;
					if(code == 200) {
						this.ruleForm = response.data.data;
					}
				});

			//经办人
      this.setUserName();
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
			this.$axios.get('/afbase/awb/selectVCategory?category=合作伙伴分类').then(function(response) {
				this.coopTypeOptions = response.data.data;
			    }.bind(this));
      //查询业务范畴
      this.$axios.get2('/prm/category/paramsNew', {
          categoryName: "业务范畴"
      }).then(function(response) {
          this.scope.businessCodes = response.data.data;
      }.bind(this)).catch(function(error) {
          console.log(error);
      });
      //查询EQ
      this.$axios.get2('/prm/category/getSettlementPeriods', {
          categoryName: "EQ"
      }).then(function(response) {
          this.scope.settlementPeriods = response.data.data;
      }.bind(this)).catch(function(error) {
          console.log(error);
      });
      //合同类型
      this.$axios.get('/hrs/org/listCategory/合同分类').then(function(response) {
          this.agreementTypes = response.data.data;
          this.agreements.params.agreement_type = this.agreementTypes[0].paramText;
        }.bind(this));
      //合同模板
      this.$axios.get('/hrs/org/listCategory/合同模板').then(function(response) {
          this.templates = response.data.data;
          this.agreements.params.template = this.templates[0].paramText;
        }.bind(this));
      //结算周期
      this.$axios.get('/hrs/org/listCategory/结算周期').then(function(response) {
          this.settlementPeriods = response.data.data;
          this.agreements.params.settlement_period = this.settlementPeriods[0].paramText;
        }.bind(this));
		},

		methods: {
      setUserName(){
        let userId = window.localStorage.getItem('userId')
        if (userId != null && userId !== '') {
          this.agreements.params.incharge_id = parseInt(userId);
        }
      },
      getDateTime(theDate,type) {
        let _year = theDate.getFullYear();
        let _month = theDate.getMonth() + 1;
        let _date = theDate.getDate();
        if (_month < 10) {
          _month = "0" + _month;
        }
        if (_date < 10) {
          _date = "0" + _date;
        }
        if(!!type && type=='end'){
          return _year + "-" + _month + "-" + _date + ' 23:59:59';
        }
        return _year + "-" + _month + "-" + _date + " 00:00:00";
      },

      dateAdd(interval, number, dateStr) {
        let date = new Date(dateStr);
        switch (interval) {
            case "y": {
              date.setFullYear(date.getFullYear() + number);
              return date;
              break;
            }
          case "q": {
            date.setMonth(date.getMonth() + number * 3);
            return date;
            break;
          }
          case "m": {
            date.setMonth(date.getMonth() + number);
            return date;
            break;
          }
          case "w": {
            date.setDate(date.getDate() + number * 7);
            return date;
            break;
          }
          case "d": {
            date.setDate(date.getDate() + number);
            return date;
            break;
          }
          case "h": {
            date.setHours(date.getHours() + number);
            return date;
            break;
          }
          case "m": {
            date.setMinutes(date.getMinutes() + number);
            return date;
            break;
          }
          case "s": {
            date.setSeconds(date.getSeconds() + number);
            return date;
            break;
          }
          default: {
            date.setDate(date.getDate() + number);
            return date;
            break;
          }
        }
      },
      getCurrDateAndCurrMonthLastDay() {
        //获取当前日期
        let date = new Date();
        date.setDate(1);
        let months = parseInt(date.getMonth() + 1);
        let days = date.getDate();
        if(months < 10) {
          months = '0' + months
        }
        if(days < 10) {
          days = '0' + days
        }
        let datas = date.getFullYear() + '-' + months + '-' + days + " 00:00:00";

        //获取当月最后一天
        let currentMonth = date.getMonth();
        let nextMonth = ++currentMonth;
        let nextMonthFirstDay = new Date(date.getFullYear(), nextMonth, 1);
        let oneDay = 1000 * 60 * 60 * 24;
        let lastTime = new Date(nextMonthFirstDay - oneDay);
        let month = parseInt(lastTime.getMonth() + 1);
        let day = lastTime.getDate();
        if(month < 10) {
          month = '0' + month
        }
        if(day < 10) {
          day = '0' + day
        }
        //当月最后一天
        let data = date.getFullYear() + '-' + month + '-' + day + " 23:59:59";
        let result = []
        result.push(datas)
        result.push(data)
        return result
      },
      downloadShow(row){debugger
        window.open(row.file_url);
      },
      setCoopEname(val) {
          if(this.ruleForm.coop_ename){

          }else{
              this.ruleForm.coop_ename = val
          }
      },
      setShortEname(val) {
          if(this.ruleForm.short_ename){

          }else{
              this.ruleForm.short_ename = val
          }
      },
      clearFile(){
        this.fileForm.fileUrl = '';
        this.fileForm.fileName = '';
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
        if(this.ruleForm.coopCodeThree && this.ruleForm.coopCodeThree.length !== 3){
            this.openError("客商三字码长度为三位");
            return;
        }
				this.$refs[formName].validate((valid) => {
					if(valid) {
              //查询社会信用代码是否已经存在
              if(this.ruleForm.social_credit_code){
                  this.$axios.post('/prm/coop/isHaveSocialCreditCode', {
                      coop_id: this.coop_id,
                      social_credit_code: this.ruleForm.social_credit_code,
                  }).then(function(response) {
                      if(response.data.code == 0) {//存在
                          let currthis = this
                          currthis.$confirm('社会信用代码 与 其他客商资料社会信用代码重复，是否继续？', '提示', {
                              confirmButtonText: '确定',
                              cancelButtonText: '取消',
                              type: 'warning',
                              center: true
                          }).then(() => {
                              this.disabledFlag2 = true;
                              this.$axios.post('/prm/coop/modifyCoop', {
                                  coop_id: this.coop_id,
                                  coop_code: this.ruleForm.coop_code,
                                  coop_type: this.ruleForm.coop_type,
                                  coop_mnemonic: this.ruleForm.coop_code,//保存时 保存为 客商资料代码
                                  coop_name: this.ruleForm.coop_name,
                                  short_name: this.ruleForm.coop_name,
                                  coop_ename: this.ruleForm.coop_ename,
                                  short_ename: this.ruleForm.coop_ename,
                                  social_credit_code: this.ruleForm.social_credit_code,
                                  bank_name: this.ruleForm.bank_name,
                                  bank_number: this.ruleForm.bank_number,
                                  phone_number: this.ruleForm.phone_number,
                                  coop_address: this.ruleForm.coop_address,
                                  coop_remark: this.ruleForm.coop_remark,
                                  coop_status: this.ruleForm.coop_status,
                                  blackwhite_valid: this.ruleForm.blackwhite_valid,
                                  transactor_id: this.ruleForm.transactor_id,
                                  coopCodeThree: this.ruleForm.coopCodeThree,
                                  iataCode: this.ruleForm.iataCode,
                                  cataCertifiedSalesAgents: this.ruleForm.cataCertifiedSalesAgents,
                                  financialCode: this.ruleForm.financialCode,
                              }).then(function(response) {
                                  if(response.data.code == 200) {
                                      this.openSuccess();
                                      this.queryCoopList();
                                      this.disabledFlag2 = false;
                                  } else {
                                      let errorinfo = response.data.messageInfo;
                                      this.openError(errorinfo);
                                      this.disabledFlag2 = false;
                                  }

                              }.bind(this));
                          }).catch(() => {
                              currthis.$message({
                                  type: 'info',
                                  message: '已取消'
                              });
                          });
                      }else{
                          this.disabledFlag2 = true;
                          this.$axios.post('/prm/coop/modifyCoop', {
                              coop_id: this.coop_id,
                              coop_code: this.ruleForm.coop_code,
                              coop_type: this.ruleForm.coop_type,
                              coop_mnemonic: this.ruleForm.coop_code,//保存时 保存为 客商资料代码
                              coop_name: this.ruleForm.coop_name,
                              short_name: this.ruleForm.coop_name,
                              coop_ename: this.ruleForm.coop_ename,
                              short_ename: this.ruleForm.coop_ename,
                              social_credit_code: this.ruleForm.social_credit_code,
                              bank_name: this.ruleForm.bank_name,
                              bank_number: this.ruleForm.bank_number,
                              phone_number: this.ruleForm.phone_number,
                              coop_address: this.ruleForm.coop_address,
                              coop_remark: this.ruleForm.coop_remark,
                              coop_status: this.ruleForm.coop_status,
                              blackwhite_valid: this.ruleForm.blackwhite_valid,
                              transactor_id: this.ruleForm.transactor_id,
                              coopCodeThree: this.ruleForm.coopCodeThree,
                              iataCode: this.ruleForm.iataCode,
                              cataCertifiedSalesAgents: this.ruleForm.cataCertifiedSalesAgents,
                              financialCode: this.ruleForm.financialCode,
                          }).then(function(response) {
                              if(response.data.code == 200) {
                                  this.openSuccess();
                                  this.queryCoopList();
                                  this.disabledFlag2 = false;
                              } else {
                                  let errorinfo = response.data.messageInfo;
                                  this.openError(errorinfo);
                                  this.disabledFlag2 = false;
                              }
                          }.bind(this));
                      }
                  }.bind(this)).catch(function(error) {
                      let errorinfo = error.response.data.messageInfo;
                      this.openError(errorinfo)
                  }.bind(this));
              }else{
                  this.disabledFlag2 = true;
                  this.$axios.post('/prm/coop/modifyCoop', {
                      coop_id: this.coop_id,
                      coop_code: this.ruleForm.coop_code,
                      coop_type: this.ruleForm.coop_type,
                      coop_mnemonic: this.ruleForm.coop_code,//保存时 保存为 客商资料代码
                      coop_name: this.ruleForm.coop_name,
                      short_name: this.ruleForm.coop_name,
                      coop_ename: this.ruleForm.coop_ename,
                      short_ename: this.ruleForm.coop_ename,
                      social_credit_code: this.ruleForm.social_credit_code,
                      bank_name: this.ruleForm.bank_name,
                      bank_number: this.ruleForm.bank_number,
                      phone_number: this.ruleForm.phone_number,
                      coop_address: this.ruleForm.coop_address,
                      coop_remark: this.ruleForm.coop_remark,
                      coop_status: this.ruleForm.coop_status,
                      blackwhite_valid: this.ruleForm.blackwhite_valid,
                      transactor_id: this.ruleForm.transactor_id,
                      coopCodeThree: this.ruleForm.coopCodeThree,
                      iataCode: this.ruleForm.iataCode,
                      cataCertifiedSalesAgents: this.ruleForm.cataCertifiedSalesAgents,
                      financialCode: this.ruleForm.financialCode,
                  }).then(function(response) {
                      if(response.data.code == 200) {
                          this.openSuccess();
                          this.queryCoopList();
                          this.disabledFlag2 = false;
                      } else {
                          let errorinfo = response.data.messageInfo;
                          this.openError(errorinfo);
                          this.disabledFlag2 = false;
                      }
                  }.bind(this));
              }
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
			//地址/合同相关----------------------------------------------
      queryCoopTabs(tabType) {
				let params = {
					currentPage: this.address.pageConf.pageCode,
					pageSize: this.address.pageConf.pageSize,
					coop_id: this.coop_id,
          tabType: tabType
				}
				this.$axios.post('/prm/coop/queryCoopTabsList', params).then((response) => {
					let code = response.data.code;
					if(tabType == 'address'){
            this.address.data = response.data.data.dataList;
            this.address.pageConf.totalPage = response.data.data.totalNum;
          }else if(tabType == 'agreement'){
            this.agreements.data = response.data.data.dataList;
            this.agreements.pageConf.totalPage = response.data.data.totalNum;
          }

				}).catch(err => {
					// console.log(err)
				})
			},
			//pageSize改变时触发的函数
			addresshandleSizeChange(tabType) {
				this.queryCoopTabs(tabType);
			},
			//当前页改变时触发的函数
			addresshandleCurrentChange(tabType) {
				this.queryCoopTabs(tabType);
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
						this.disabledFlag3 = true;
						this.$axios.post(url,
								params)
							.then(function(response) {
								if(response.data.code == 200) {
									this.openSuccess();
                  this.resetFormaddress('address');
                  this.queryCoopTabs('address');
                  this.disabledFlag3 = false;
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

		   deleteAddress(row){
          	this.$confirm('是否 确认 删除？', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning',
					center: true
				}).then(() => {
					this.$axios.put('/prm/coop/deleteAddress/' + row.addr_id)
						.then(function(response) {
						   if(response.data.code == 200) {
								this.openSuccess();
                 this.queryCoopTabs('address');
							} else {
								this.openError(response.data.messageInfo);
							}
						}.bind(this));
				}).catch(() => {
					this.$message({
						type: 'info',
						message: '已取消删除'
					});
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
			resetFormaddress() {
			  let tmp_type = this.address.params.addr_type;
				this.$refs['addressform'].resetFields();
				if(this.address.params.addr_id == ''){ //添加操作地址类型不为空
				    this.address.params.addr_type = tmp_type;
        }
				this.address.params.addr_id = '';
				this.address.params.coop_id = '';
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
				this.$refs['contactsform'].validate((valid) => {
					if(valid) {
						let params = this.contacts.params;
						let contacts_id = params.contacts_id;
						let url = '';
						let matchEmail = /^[a-zA-Z#0-9_.-]+@[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)*\.[a-zA-Z0-9]{2,6}$/;
            if(contacts_id == ''){
                let email = params.email.replace(/\s*/g,"").replace(/,/g,';');//去掉空格，把逗号换为分号
                let emails = email.split(";");
                for(let i=0;i<emails.length;i++){
                    if(emails[i]){
                        if(!matchEmail.test(emails[i])) {
                            this.openError("请输入正确的邮箱地址");
                            return;
                        }
                    }
                }
                url = '/prm/coop/saveCoopContacts';
             }else{
                if(!matchEmail.test(params.email)) {
                    this.openError("请输入正确的邮箱地址");
                    return;
                }
                url = '/prm/coop/modifyCoopContacts'
             };
            this.disabledFlag2 = true;
						params.coop_id = this.coop_id;
						this.$axios.post(url,
								params)
							.then(function(response) {
								if(response.data.code == 200) {
									this.openSuccess();
									this.resetFormContacts();
									this.queryContactsList();
                  this.disabledFlag2 = false;
								} else {
									this.openError(response.data.messageInfo);
                    this.disabledFlag2 = false;
								}

							}.bind(this));
					} else {
						console.log('error submit!!');
						return false;
					}
				});
			},
			deleteContacts(row){
          	this.$confirm('是否 确认 删除？', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning',
					center: true
				}).then(() => {
					this.$axios.put('/prm/coop/deleteContacts/' + row.contacts_id)
						.then(function(response) {
						   if(response.data.code == 200) {
								this.openSuccess();
								this.queryContactsList();
							} else {
								this.openError(response.data.messageInfo);
							}
						}.bind(this));
				}).catch(() => {
					this.$message({
						type: 'info',
						message: '已取消删除'
					});
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
			    let temp = this.contacts.params.contacts_status;
				this.$refs['contactsform'].resetFields();
				if(this.contacts.params.contacts_id == ''){
				    this.contacts.params.contacts_status = temp;
        }
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
						this.disabledFlag4 = true;
						this.$axios.post(url,
								params)
							.then(function(response) {
								if(response.data.code == 200) {
									this.openSuccess();
									this.resetFormScope();
									this.queryScopeList();
                  this.disabledFlag4 = false;
								} else {
									this.openError(response.data.messageInfo);
                  this.disabledFlag4 = false;
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
				this.scope.businessScopeDisabled = true
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
        this.scope.params.settlement_period = row.settlement_period + '';
			},
			resetFormScope() {
				this.scope.businessScopeDisabled = false
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
      handleTabsChange(command) {
				this.currRow = command
			},
      handleTabsCommand(command) {
        if(command == 'editContacts') {
          this.showeditContacts(this.currRow)
        } else if(command == 'deleteContacts') {
          this.deleteContacts(this.currRow)
        }else if(command == 'editAddress') {
					this.showeditaddress(this.currRow)
				} else if(command == 'deleteAddress') {
					this.deleteAddress(this.currRow)
				}else if(command == 'editAgreement') {
          this.showeditAgreement(this.currRow)
        } else if(command == 'addAgreement') {
          this.showaddAgreement(this.currRow)
        }else if(command == 'stopAgreement') {
          this.stopAgreement(this.currRow)
        }
      },

      //合同相关----------------------------------------------
      saveAgreement() {debugger
        this.$refs['agreementsform'].validate((valid) => {
          if(valid) {
            let params = this.agreements.params;
            let url = '/prm/coop/saveCoopAgreement';
            params.coop_id = this.coop_id;
            params.file_url = this.fileForm.fileUrl;
            params.file_name = this.fileForm.fileName;
            // this.disabledFlag6 = true;
            this.$axios.post(url,
              params)
              .then(function(response) {
                if(response.data.code == 200) {
                  this.openSuccess();
                  this.resetFormAgreement();
                  this.queryCoopTabs('agreement');
                  this.disabledFlag6 = false;
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

      stopAgreement(row){
        this.frow = row;
        this.deleteAgreementVisible = true;
      },
      showeditAgreement(row) {
        this.agreements.params.agreement_id = row.agreement_id;
        this.agreements.params.coop_id = row.coop_id;
        this.agreements.params.agreement_type = row.agreement_type;
        this.agreements.params.serial_number = row.serial_number;
        this.agreements.params.begin_date = this.getDateTime(new Date(row.begin_date));
        this.agreements.params.end_date =  this.getDateTime(new Date(row.end_date),'end');
        this.agreements.params.template = row.template;
        this.agreements.params.incharge_id = row.incharge_id;
        this.agreements.params.settlement_period = row.settlement_period;
        this.agreements.params.total_amount = row.total_amount;
        this.agreements.params.payment_period = row.payment_period;
        this.agreements.params.file_url = row.file_url;
        this.fileForm.fileUrl = row.file_url;
        this.fileForm.fileName = row.file_name;
        this.agreements.params.file_name = row.file_name;
        this.agreements.params.agreement_remark = row.agreement_remark;
      },
      showaddAgreement(row) {
        this.agreements.params.agreement_id = '';
        this.agreements.params.coop_id = row.coop_id;
        this.agreements.params.agreement_type = row.agreement_type;
        this.agreements.params.serial_number = '';
        this.agreements.params.begin_date = this.getDateTime(this.dateAdd("d", 1,row.end_date));
        this.agreements.params.end_date = this.getDateTime(this.dateAdd("d", -1,this.dateAdd("y", 1,row.end_date)),'end');
        this.agreements.params.template = row.template;
        this.agreements.params.incharge_id = row.incharge_id;
        this.agreements.params.settlement_period = row.settlement_period;
        this.agreements.params.total_amount = row.total_amount;
        this.agreements.params.payment_period = row.payment_period;
        this.agreements.params.file_url = '';
        this.fileForm.fileUrl = '';
        this.fileForm.fileName = '';
        this.agreements.params.file_name = '';
        this.agreements.params.agreement_remark = '';
      },
      resetFormAgreement() {
        this.$refs['agreementsform'].resetFields();
        this.fileForm.fileUrl = '';
        this.fileForm.fileName = '';
        this.agreements.params.agreement_id = '';
        this.agreements.params.coop_id = '';
        this.agreements.params.template = this.templates[0].paramText;
        this.agreements.params.settlement_period = this.settlementPeriods[0].paramText;
        this.agreements.params.agreement_type = this.agreementTypes[0].paramText;
      },
      beforeAvatarUpload(file) {
        let now = new Date()
        let year = now.getFullYear()
        let month = now.getMonth() + 1
        if (month < 10) {
          month = '0' + month
        }
        this.uptoken.key = "Order_attachment_" + year.toString().substring(2) + month + "_" + this.hexMD5(new Date().getTime()) + file.name.substring(file.name.lastIndexOf('.'));
        const isLt10M = file.size < 10 * 1024 * 1024;
        if (!isLt10M) {
          this.$message.error('上传模板大小不能超过 10MB!');
        }
        if (isLt10M) {
          this.fileForm.fileUrl = "http://doc.yctop.com/" + this.uptoken.key
          // this.fileForm.fileName = file.name.substring(0, file.name.lastIndexOf('.'));
          this.fileForm.fileName = file.name;
        }
        return isLt10M;
      },
      handleSuccessChange(response, file, fileList) { //上传成功后在图片框显示图片
        this.$message.success('上传成功')
        this.fileForm.fileUrl = "http://doc.yctop.com/" + response.key;
      },
      handleRemoveChange(file, fileList) {
        var filelists = [];
        this.fileForm.fileUrl = '';
        this.formData.smallModelPhoto = filelists;
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
			},
      toUpperCaseValue(val) {
          return val.toUpperCase();
      },
      //MD5
      safeAdd(x, y) {
        let lsw = (x & 0xffff) + (y & 0xffff)
        let msw = (x >> 16) + (y >> 16) + (lsw >> 16)
        return(msw << 16) | (lsw & 0xffff)
      },

      bitRotateLeft(num, cnt) {
        return(num << cnt) | (num >>> (32 - cnt))
      },

      md5cmn(q, a, b, x, s, t) {
        return this.safeAdd(this.bitRotateLeft(this.safeAdd(this.safeAdd(a, q), this.safeAdd(x, t)), s), b)
      },

      md5ff(a, b, c, d, x, s, t) {
        return this.md5cmn((b & c) | (~b & d), a, b, x, s, t)
      },

      md5gg(a, b, c, d, x, s, t) {
        return this.md5cmn((b & d) | (c & ~d), a, b, x, s, t)
      },

      md5hh(a, b, c, d, x, s, t) {
        return this.md5cmn(b ^ c ^ d, a, b, x, s, t)
      },

      md5ii(a, b, c, d, x, s, t) {
        return this.md5cmn(c ^ (b | ~d), a, b, x, s, t)
      },

      binlMD5(x, len) {
        /* append padding */
        x[len >> 5] |= 0x80 << (len % 32)
        x[((len + 64) >>> 9 << 4) + 14] = len

        let i
        let olda
        let oldb
        let oldc
        let oldd
        let a = 1732584193
        let b = -271733879
        let c = -1732584194
        let d = 271733878

        for(i = 0; i < x.length; i += 16) {
          olda = a
          oldb = b
          oldc = c
          oldd = d

          a = this.md5ff(a, b, c, d, x[i], 7, -680876936)
          d = this.md5ff(d, a, b, c, x[i + 1], 12, -389564586)
          c = this.md5ff(c, d, a, b, x[i + 2], 17, 606105819)
          b = this.md5ff(b, c, d, a, x[i + 3], 22, -1044525330)
          a = this.md5ff(a, b, c, d, x[i + 4], 7, -176418897)
          d = this.md5ff(d, a, b, c, x[i + 5], 12, 1200080426)
          c = this.md5ff(c, d, a, b, x[i + 6], 17, -1473231341)
          b = this.md5ff(b, c, d, a, x[i + 7], 22, -45705983)
          a = this.md5ff(a, b, c, d, x[i + 8], 7, 1770035416)
          d = this.md5ff(d, a, b, c, x[i + 9], 12, -1958414417)
          c = this.md5ff(c, d, a, b, x[i + 10], 17, -42063)
          b = this.md5ff(b, c, d, a, x[i + 11], 22, -1990404162)
          a = this.md5ff(a, b, c, d, x[i + 12], 7, 1804603682)
          d = this.md5ff(d, a, b, c, x[i + 13], 12, -40341101)
          c = this.md5ff(c, d, a, b, x[i + 14], 17, -1502002290)
          b = this.md5ff(b, c, d, a, x[i + 15], 22, 1236535329)

          a = this.md5gg(a, b, c, d, x[i + 1], 5, -165796510)
          d = this.md5gg(d, a, b, c, x[i + 6], 9, -1069501632)
          c = this.md5gg(c, d, a, b, x[i + 11], 14, 643717713)
          b = this.md5gg(b, c, d, a, x[i], 20, -373897302)
          a = this.md5gg(a, b, c, d, x[i + 5], 5, -701558691)
          d = this.md5gg(d, a, b, c, x[i + 10], 9, 38016083)
          c = this.md5gg(c, d, a, b, x[i + 15], 14, -660478335)
          b = this.md5gg(b, c, d, a, x[i + 4], 20, -405537848)
          a = this.md5gg(a, b, c, d, x[i + 9], 5, 568446438)
          d = this.md5gg(d, a, b, c, x[i + 14], 9, -1019803690)
          c = this.md5gg(c, d, a, b, x[i + 3], 14, -187363961)
          b = this.md5gg(b, c, d, a, x[i + 8], 20, 1163531501)
          a = this.md5gg(a, b, c, d, x[i + 13], 5, -1444681467)
          d = this.md5gg(d, a, b, c, x[i + 2], 9, -51403784)
          c = this.md5gg(c, d, a, b, x[i + 7], 14, 1735328473)
          b = this.md5gg(b, c, d, a, x[i + 12], 20, -1926607734)

          a = this.md5hh(a, b, c, d, x[i + 5], 4, -378558)
          d = this.md5hh(d, a, b, c, x[i + 8], 11, -2022574463)
          c = this.md5hh(c, d, a, b, x[i + 11], 16, 1839030562)
          b = this.md5hh(b, c, d, a, x[i + 14], 23, -35309556)
          a = this.md5hh(a, b, c, d, x[i + 1], 4, -1530992060)
          d = this.md5hh(d, a, b, c, x[i + 4], 11, 1272893353)
          c = this.md5hh(c, d, a, b, x[i + 7], 16, -155497632)
          b = this.md5hh(b, c, d, a, x[i + 10], 23, -1094730640)
          a = this.md5hh(a, b, c, d, x[i + 13], 4, 681279174)
          d = this.md5hh(d, a, b, c, x[i], 11, -358537222)
          c = this.md5hh(c, d, a, b, x[i + 3], 16, -722521979)
          b = this.md5hh(b, c, d, a, x[i + 6], 23, 76029189)
          a = this.md5hh(a, b, c, d, x[i + 9], 4, -640364487)
          d = this.md5hh(d, a, b, c, x[i + 12], 11, -421815835)
          c = this.md5hh(c, d, a, b, x[i + 15], 16, 530742520)
          b = this.md5hh(b, c, d, a, x[i + 2], 23, -995338651)

          a = this.md5ii(a, b, c, d, x[i], 6, -198630844)
          d = this.md5ii(d, a, b, c, x[i + 7], 10, 1126891415)
          c = this.md5ii(c, d, a, b, x[i + 14], 15, -1416354905)
          b = this.md5ii(b, c, d, a, x[i + 5], 21, -57434055)
          a = this.md5ii(a, b, c, d, x[i + 12], 6, 1700485571)
          d = this.md5ii(d, a, b, c, x[i + 3], 10, -1894986606)
          c = this.md5ii(c, d, a, b, x[i + 10], 15, -1051523)
          b = this.md5ii(b, c, d, a, x[i + 1], 21, -2054922799)
          a = this.md5ii(a, b, c, d, x[i + 8], 6, 1873313359)
          d = this.md5ii(d, a, b, c, x[i + 15], 10, -30611744)
          c = this.md5ii(c, d, a, b, x[i + 6], 15, -1560198380)
          b = this.md5ii(b, c, d, a, x[i + 13], 21, 1309151649)
          a = this.md5ii(a, b, c, d, x[i + 4], 6, -145523070)
          d = this.md5ii(d, a, b, c, x[i + 11], 10, -1120210379)
          c = this.md5ii(c, d, a, b, x[i + 2], 15, 718787259)
          b = this.md5ii(b, c, d, a, x[i + 9], 21, -343485551)

          a = this.safeAdd(a, olda)
          b = this.safeAdd(b, oldb)
          c = this.safeAdd(c, oldc)
          d = this.safeAdd(d, oldd)
        }
        return [a, b, c, d]
      },

      binl2rstr(input) {
        let i
        let output = ''
        let length32 = input.length * 32
        for(i = 0; i < length32; i += 8) {
          output += String.fromCharCode((input[i >> 5] >>> (i % 32)) & 0xff)
        }
        return output
      },

      rstr2binl(input) {
        let i
        let output = []
        output[(input.length >> 2) - 1] = undefined
        for(i = 0; i < output.length; i += 1) {
          output[i] = 0
        }
        let length8 = input.length * 8
        for(i = 0; i < length8; i += 8) {
          output[i >> 5] |= (input.charCodeAt(i / 8) & 0xff) << (i % 32)
        }
        return output
      },

      rstrMD5(s) {
        return this.binl2rstr(this.binlMD5(this.rstr2binl(s), s.length * 8))
      },

      rstr2hex(input) {
        var hexTab = '0123456789abcdef'
        var output = ''
        var x
        var i
        for(i = 0; i < input.length; i += 1) {
          x = input.charCodeAt(i)
          output += hexTab.charAt((x >>> 4) & 0x0f) + hexTab.charAt(x & 0x0f)
        }
        return output
      },

      str2rstrUTF8(input) {
        return unescape(encodeURIComponent(input))
      },

      hexMD5(s) {
        return this.rstr2hex(this.rawMD5(s))
      },
      rawMD5(s) {
        return this.rstrMD5(this.str2rstrUTF8(s))
      }
		}
	}
</script>
<style type="text/css">
  .orderListPage .el-input__icon {
    line-height: 30px !important;
  }
  .orderListPage .el-form-item__content {
    line-height: 30px !important;
  }
  .orderListPage .widthWithThree .el-input-group__prepend {
    padding: 0 13px !important;
  }
  .orderListPage .widthThree .el-input-group__prepend {
    padding: 0 11px;
  }

  .orderListPage .widthThree2 .el-input-group__prepend {
    padding: 0 38px;
  }

  .orderListPage .widthThree1 .el-input-group__prepend {
    padding: 0 18px;
  }

  .orderListPage .widthTwo .el-input-group__prepend {
    padding: 0 25px;
  }

  .orderListPage .widthFour .el-input-group__prepend {
    padding: 0 11px;
  }

  .orderListPage .widthSix .el-input-group__prepend {
    padding: 0 11px !important;
  }

  .orderListPage .widthFive .el-input-group__prepend {
    padding: 0 18px;
  }

  .orderListPage .widthEQ .el-input-group__prepend {
    padding: 0 22px;
  }
  .elinputDiv{
    width: 260px !important;
    margin-right: 15px;
  }
  .elinputDiv .elInputChild {
    width: 181px !important;
    margin-right: -5px;
  }
  .fileUrlInput .el-input-group__prepend {
    width: 80px !important;
    text-align: center;
  }
</style>
