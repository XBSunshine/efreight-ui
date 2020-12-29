<template>
	<div class="org_config" >
		<el-row v-loading="loading" element-loading-text="拼命加载中"  :visible.sync="visible">
			<el-col class="toolbar" style="padding-bottom: 0;">
        <el-form :inline="false" :model="ruleForm" :rules="rules" ref="ruleForm" class="demo-ruleForm">
          <el-row>
            <el-col class="elementWidth">
              <el-form-item label-width="18px">
                <el-input v-model="backData.stopDate" auto-complete="off" style="width: 300px" :class="stopDateClass"
                          disabled>
                  <template slot="prepend">有效期至</template>
                </el-input>
              </el-form-item>
            </el-col>
            <el-col class="elementWidth">
              <el-form-item label-width="18px">
                <el-input v-model="backData.userNumber" auto-complete="off" style="width: 300px" disabled >
                  <template slot="prepend">用户数量</template>
                </el-input>
              </el-form-item>
            </el-col>
            <el-col class="elementWidth">
              <el-form-item label-width="18px">
                <el-input v-model="backData.airFreightSubscriptions" auto-complete="off" style="width: 350px" disabled>
                  <template slot="prepend">
                    <div style="width: 89px">空运订阅量</div>
                  </template>
                </el-input>
              </el-form-item>
            </el-col>
            <el-col class="elementWidth">
              <el-button size="mini" type="primary" style="margin-left: 14px" @click="openSubscribe">订阅明细</el-button>
            </el-col>
          </el-row>

          <template v-if="editFlag">
            <!-- 个人版本 -->
            <el-row>
              <el-col class="elementWidth" :span="12">
                <el-form-item  prop="orgName" label-width="18px">
                  <el-input v-model="ruleForm.orgName" auto-complete="off" style="width: 615px">
                    <template slot="prepend">公司名称(中文)</template>
                  </el-input>
                </el-form-item>
              </el-col>
              <el-col class="elementWidth" :span="12">
                <el-form-item  prop="shortName" label-width="18px">
                  <el-input v-model="ruleForm.shortName" auto-complete="off" style="width: 450px">
                    <template slot="prepend">公司简称(中文)</template>
                  </el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col class="elementWidth" :span="12">
                <el-form-item  prop="orgEname" label-width="18px">
                  <el-input v-model="ruleForm.orgEname" auto-complete="off" style="width: 615px">
                    <template slot="prepend">公司名称(英文)</template>
                  </el-input>
                </el-form-item>
              </el-col>
              <el-col class="elementWidth" :span="12">
                <el-form-item  prop="shortEname" label-width="18px">
                  <el-input v-model="ruleForm.shortEname" auto-complete="off" style="width: 450px">
                    <template slot="prepend">公司简称(英文)</template>
                  </el-input>
                </el-form-item>
              </el-col>
            </el-row>
          </template>
          <template v-else>
            <!-- 企业版本 -->
            <el-row>
              <el-col class="elementWidth" :span="12">
                <el-form-item  prop="orgName" label-width="18px">
                  <el-input v-model="ruleForm.orgName" auto-complete="off" style="width: 615px" disabled>
                    <template slot="prepend">公司名称(中文)</template>
                  </el-input>
                </el-form-item>
              </el-col>
              <el-col class="elementWidth" :span="12">
                <el-form-item  prop="shortName" label-width="18px">
                  <el-input v-model="ruleForm.shortName" auto-complete="off" style="width: 450px">
                    <template slot="prepend">公司简称(中文)</template>
                  </el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col class="elementWidth" :span="12">
                <el-form-item  prop="orgEname" label-width="18px">
                  <el-input v-model="ruleForm.orgEname" auto-complete="off" style="width: 615px">
                    <template slot="prepend">公司名称(英文)</template>
                  </el-input>
                </el-form-item>
              </el-col>
              <el-col class="elementWidth" :span="12">
                <el-form-item  prop="shortEname" label-width="18px">
                  <el-input v-model="ruleForm.shortEname" auto-complete="off" style="width: 450px">
                    <template slot="prepend">公司简称(英文)</template>
                  </el-input>
                </el-form-item>
              </el-col>
            </el-row>
          </template>
          <el-row>
            <el-col class="elementWidth" :span="12">
              <el-form-item  prop="orgCodeThree" label-width="18px">
                <el-input v-model="ruleForm.orgCodeThree" auto-complete="off" style="width: 220px" maxlength="3">
                  <template slot="prepend">
                    <div style="width: 94px;">公司三字码</div>
                  </template>
                </el-input>
              </el-form-item>
            </el-col>
            <el-col class="elementWidth" :span="12">
              <el-form-item prop="financialVoucherOutType" label-width="18px">
                <el-input auto-complete="off" style="width: 220px" maxlength="3">
                  <template slot="prepend">
                    <div style="width: 94px;">凭证导出设置</div>
                  </template>
                  <el-select slot="suffix" v-model="ruleForm.financialVoucherOutType" placeholder=""
                             style="width:85px; margin-right: -5px;">
                    <el-option label="金蝶" value="金蝶"></el-option>
                    <el-option label="用友" value="用友"></el-option>
                  </el-select>
                </el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col class="elementWidth">
              <el-form-item label="银行账号设置"></el-form-item>
            </el-col>
            <el-col class="elementWidth">
              <el-form-item label="" label-width="0px">
                <el-button type="text" size="small" v-if="bankAccountSettings" v-on:click="bankAccountSettings = false">
                  收起<i class="el-icon-arrow-down"></i></el-button>
                <el-button type="text" size="small" v-if="!bankAccountSettings" v-on:click="bankAccountSettings = true">
                  展开<i class="el-icon-arrow-up"></i></el-button>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row v-if="bankAccountSettings" :style="is1360? '': 'width:1366px'">
            <el-row class="header-color">
              <div class="icon_subtract" style="display: none">
                <i class="iconfont el-icon-myyuanquanjiahao" @click="addRow"
                   style="cursor: pointer;size: b5;color: #409EFF;"></i>
              </div>
              <el-col :span="10" style="padding-left: 55px" class="header-font">
                <span>抬头 / 银行账号 / 地址(中文)</span>
              </el-col>
              <el-col :span="10" style="padding-left: 37px" class="header-font">
                <span>抬头 / 银行账号 / 地址(英文)</span>
              </el-col>
              <el-col :span="3" style="padding-left: 20px" class="header-font">
                <span>LOGO / 印章</span>
              </el-col>
            </el-row>
            <div style="margin-left: 33px">
              <div class="bank-account-item">

                <el-row :gutter="6" class="bank-account-row">
                  <el-col :span="10">
                    <el-input v-model="ruleForm.orgName" disabled placeholder="公司抬头(中文)" show-word-limit
                              maxlenght="100"/>
                  </el-col>
                  <el-col :span="10">
                    <el-input v-model="ruleForm.orgEname" disabled placeholder="公司抬头(英文)" show-word-limit
                              maxlenght="100"/>
                  </el-col>
                  <el-col :span="4">
                    <el-button type="primary" size="mini" class="upload-btn"
                               @click="showImageCropper(400, 100, 'org_logo', -1)">上传LOGO
                    </el-button>
                    <el-button type="success" size="mini" class="view-btn"
                               :disabled="ruleForm.orgLogo == null || ruleForm.orgLogo == ''"
                               @click="viewPic(ruleForm.orgLogo)">查看LOGO
                    </el-button>
                  </el-col>
                </el-row>
                <el-row :gutter="6" class="bank-account-row">
                  <el-col :span="10">
                    <el-input v-model="ruleForm.orgBankInfoCn" type="textarea" :rows="2" show-word-limit maxlength="200"
                              placeholder="银行账号(中文)"/>
                  </el-col>
                  <el-col :span="10">
                    <el-input v-model="ruleForm.orgBankInfoEn" type="textarea" :rows="2" show-word-limit maxlength="200"
                              placeholder="银行账号(英中文)"/>
                  </el-col>
                  <el-col :span="4">
                    <el-button type="primary" size="mini" class="upload-btn"
                               @click="showImageCropper(300, 300, 'org_seal', -1)">上传印章
                    </el-button>
                    <el-button type="success" size="mini" class="view-btn"
                               :disabled="ruleForm.orgSeal == null || ruleForm.orgSeal == ''"
                               @click="viewPic(ruleForm.orgSeal)">查看印章
                    </el-button>
                  </el-col>
                </el-row>
                <el-row :gutter="6" class="bank-account-row">
                  <el-col :span="10">
                    <el-input v-model="ruleForm.orgAddressInfoCn" type="textarea" :rows="2" show-word-limit
                              maxlength="200" placeholder="地址(中文)"/>
                  </el-col>
                  <el-col :span="10">
                    <el-input v-model="ruleForm.orgAddressInfoEn" type="textarea" :rows="2" show-word-limit
                              maxlength="200" placeholder="地址(英文)"/>
                  </el-col>
                </el-row>
                <el-row>
                  <el-divider></el-divider>
                </el-row>
              </div>
              <template v-for="(item, index) in this.ruleForm.orgBankConfigList">
                <div class="bank-account-item">
                  <div class="icon_subtract">
                    <i class="iconfont el-icon-myjianhao" @click="deleteRow(index, item)"
                       style="cursor: pointer;size: b5;color: #409EFF;"></i>
                  </div>
                  <el-row :gutter="6" class="bank-account-row">
                    <el-col :span="10">
                      <el-input v-model="item.titleCn" placeholder="公司抬头(中文)" show-word-limit maxlength="100"/>
                    </el-col>
                    <el-col :span="10">
                      <el-input v-model="item.titleEn" placeholder="公司抬头(英文)" show-word-limit maxlength="100"/>
                    </el-col>
                    <el-col :span="4">
                      <el-button type="primary" size="mini" class="upload-btn"
                                 @click="showImageCropper(400, 100, 'org_logo', index)">上传LOGO
                      </el-button>
                      <el-button type="success" size="mini" class="view-btn" :disabled="item.logoUrl == null"
                                 @click="viewPic(item.logoUrl)">查看LOGO
                      </el-button>
                    </el-col>
                  </el-row>
                  <el-row :gutter="6" class="bank-account-row">
                    <el-col :span="10">
                      <el-input v-model="item.bankInfoCn" type="textarea" :rows="2" show-word-limit maxlength="200"
                                placeholder="银行账号(中文)"/>
                    </el-col>
                    <el-col :span="10">
                      <el-input v-model="item.bankInfoEn" type="textarea" :rows="2" show-word-limit maxlength="200"
                                placeholder="银行账号(英文)"/>
                    </el-col>
                    <el-col :span="4">
                      <el-button type="primary" size="mini" class="upload-btn"
                                 @click="showImageCropper(300, 300, 'org_seal', index)">上传印章
                      </el-button>
                      <el-button type="success" size="mini" class="view-btn" :disabled="item.sealUrl == null"
                                 @click="viewPic(item.sealUrl)">查看印章
                      </el-button>
                    </el-col>
                  </el-row>
                  <el-row :gutter="6" class="bank-account-row">
                    <el-col :span="10">
                      <el-input v-model="item.addressInfoCn" type="textarea" :rows="2" show-word-limit maxlength="200"
                                placeholder="地址(中文)"/>
                    </el-col>
                    <el-col :span="10">
                      <el-input v-model="item.addressInfoEn" type="textarea" :rows="2" show-word-limit maxlength="200"
                                placeholder="地址(英文)"/>
                    </el-col>
                  </el-row>
                  <el-row>
                    <el-divider></el-divider>
                  </el-row>
                </div>
              </template>
            </div>
          </el-row>

          <div style="margin-left: 16px">
            <el-row>
              <el-col class="elementWidth">
                <el-form-item label="AE订单配置"></el-form-item>
              </el-col>
              <el-col class="elementWidth">
                <el-form-item label="" label-width="0px">
                  <el-button type="text" size="small" v-if="orderConfig.AE.showFlag" v-on:click="showFlagSearch('AE')">
                    收起<i class="el-icon-arrow-down"></i></el-button>
                  <el-button type="text" size="small" v-if="!orderConfig.AE.showFlag" v-on:click="showFlagSearch('AE')">
                    展开<i class="el-icon-arrow-up"></i></el-button>
                 </el-form-item>
               </el-col>
             </el-row>
             <el-row v-show="orderConfig.AE.showFlag">
               <el-col class="elementWidth">
                 <el-form-item label-width="40px">
                   <el-input style="width:200px;">
                     <template slot="prepend">锁账是否可见</template>
                     <el-select slot="suffix" v-model="orderConfig.AE.fields.financeLockView" placeholder="" style="width:78px; margin-right: -5px;">
                       <el-option label="是" :value="true"></el-option>
                       <el-option label="否"  :value="false"></el-option>
                     </el-select>
                   </el-input>
                 </el-form-item>
               </el-col>
               <el-col class="elementWidth">
                 <el-form-item label-width="40px">
                   <el-input style="width:240px;">
                     <template slot="prepend">默认货物类型</template>
                     <el-select slot="suffix" clearable  v-model="orderConfig.AE.fields.goodsType" placeholder="" style="width:115px; margin-right: -5px;">
                       <el-option  v-for="item in remoteData.AE.goodsType" :key="item.value" :label="item.label" :value="item.value"></el-option>
                     </el-select>
                   </el-input>
                 </el-form-item>
               </el-col>
               <el-col class="elementWidth">
                 <el-form-item label-width="40px">
                   <el-input style="width:240px;">
                     <template slot="prepend">默认服务产品</template>
                     <el-select slot="suffix" clearable  v-model="orderConfig.AE.fields.businessProduct" placeholder="" style="width:115px; margin-right: -5px;">
                       <el-option  v-for="item in remoteData.AE.businessProduct" :key="item.value" :label="item.label" :value="item.value"></el-option>
                     </el-select>
                   </el-input>
                 </el-form-item>
               </el-col>
               <el-col class="elementWidth">
                 <el-form-item label-width="40px">
                   <el-input style="width:240px;">
                     <template slot="prepend">默认电池情况</template>
                     <el-select slot="suffix" clearable  v-model="orderConfig.AE.fields.batteryType" placeholder="" style="width:115px; margin-right: -5px;">
                       <el-option  v-for="item in remoteData.AE.batteryType" :key="item.value" :label="item.label" :value="item.value"></el-option>
                     </el-select>
                   </el-input>
                 </el-form-item>
               </el-col>
              </el-row>
              <el-row v-show="orderConfig.AE.showFlag">
                <el-col class="elementWidth">
                  <el-form-item label-width="40px">
                    <el-input style="width:308px;">
                      <template slot="prepend">默认海关代码</template>
                      <el-select slot="suffix" clearable v-model="orderConfig.AE.fields.customsStatusCode" placeholder="" style="width:183px; margin-right: -5px;">
                        <el-option  v-for="item in remoteData.AE.customsStatusCode" :key="item.code" :label="item.label" :value="item.code"></el-option>
                      </el-select>
                    </el-input>
                  </el-form-item>
                </el-col>
               <el-col class="elementWidth">
                 <el-form-item  prop="iataCodeAe" label-width="20px">
                   <el-input v-model="orderConfig.AE.fields.iataCode" auto-complete="off" style="width: 368px" class="widthIataCode" clearable maxlength="15">
                     <template slot="prepend">IATA Code</template>
                   </el-input>
                 </el-form-item>
               </el-col>
               <el-col class="elementWidth">
                 <el-form-item  prop="iataCodeAe" label-width="20px">
                   <el-input v-model="orderConfig.AE.fields.cataCertifiedSalesAgents" auto-complete="off" style="width: 323px" class="widthIataCode" clearable maxlength="20">
                     <template slot="prepend">航协铜牌代码</template>
                   </el-input>
                 </el-form-item>
               </el-col>
             </el-row>
             <el-row v-show="orderConfig.AE.showFlag">
                <el-col class="elementWidth">
                 <el-form-item label-width="40px">
                   <el-input style="width:695px;">
                     <template slot="prepend">是否启用签单</template>
                     <el-select slot="suffix" multiple clearable v-model="rountingSignBusinessProductList" placeholder="" style="width:570px;background-color:#FFF;color: #606266;height: 28px;margin-right: -5px;">
                       <el-option v-for="item in aeProductList" :key="item.value" :label="item.label" :value="item.value">
                       </el-option>
                     </el-select>
                   </el-input>
                 </el-form-item>
               </el-col>
             </el-row>

             <el-row>
               <el-col class="elementWidth">
                 <el-form-item label="AI订单配置"></el-form-item>
               </el-col>
               <el-col class="elementWidth">
                 <el-form-item label="" label-width="0px">
                   <el-button type="text" size="small" v-if="orderConfig.AI.showFlag" v-on:click="showFlagSearch('AI')">收起<i class="el-icon-arrow-down"></i></el-button>
                   <el-button type="text" size="small" v-if="!orderConfig.AI.showFlag" v-on:click="showFlagSearch('AI')">展开<i class="el-icon-arrow-up"></i></el-button>
                 </el-form-item>
               </el-col>
             </el-row>
             <el-row v-show="orderConfig.AI.showFlag">
               <el-col class="elementWidth">
                 <el-form-item label-width="40px">
                   <el-input style="width:200px;">
                     <template slot="prepend">锁账是否可见</template>
                     <el-select slot="suffix" v-model="orderConfig.AI.fields.financeLockView" placeholder="" style="width:78px; margin-right: -5px;">
                       <el-option label="是" :value="true"></el-option>
                       <el-option label="否"  :value="false"></el-option>
                     </el-select>
                   </el-input>
                 </el-form-item>
               </el-col>
               <el-col class="elementWidth">
                 <el-form-item label-width="40px">
                   <el-input style="width:240px;">
                     <template slot="prepend">默认货物类型</template>
                     <el-select slot="suffix" clearable v-model="orderConfig.AI.fields.goodsType" placeholder="" style="width:115px; margin-right: -5px;">
                       <el-option  v-for="item in remoteData.AI.goodsType" :key="item.value" :label="item.label" :value="item.value"></el-option>
                     </el-select>
                   </el-input>
                 </el-form-item>
               </el-col>
               <el-col class="elementWidth">
                 <el-form-item label-width="40px">
                   <el-input style="width:240px;">
                     <template slot="prepend">默认货物流向</template>
                     <el-select slot="suffix" clearable v-model="orderConfig.AI.fields.cargoFlowType" placeholder="" style="width:115px; margin-right: -5px;">
                       <el-option  v-for="item in remoteData.AI.cargoFlowType" :key="item.value" :label="item.label" :value="item.value"></el-option>
                     </el-select>
                   </el-input>
                 </el-form-item>
               </el-col>
               <el-col class="elementWidth">
                 <el-form-item  prop="iataCodeAi" label-width="40px">
                   <el-input v-model="orderConfig.AI.fields.iataCode" auto-complete="off" style="width: 368px" class="widthIataCode" clearable maxlength="15">
                     <template slot="prepend">IATA Code</template>
                   </el-input>
                 </el-form-item>
               </el-col>
             </el-row>

             <el-row>
               <el-col class="elementWidth">
                 <el-form-item label="SE订单配置"></el-form-item>
               </el-col>
               <el-col class="elementWidth">
                 <el-form-item label="" label-width="0px">
                   <el-button type="text" size="small" v-if="orderConfig.SE.showFlag" v-on:click="showFlagSearch('SE')">收起<i class="el-icon-arrow-down"></i></el-button>
                   <el-button type="text" size="small" v-if="!orderConfig.SE.showFlag" v-on:click="showFlagSearch('SE')">展开<i class="el-icon-arrow-up"></i></el-button>
                 </el-form-item>
               </el-col>
             </el-row>
             <el-row v-show="orderConfig.SE.showFlag">
               <el-col class="elementWidth">
                 <el-form-item label-width="40px">
                   <el-input style="width:200px;">
                     <template slot="prepend">锁账是否可见</template>
                     <el-select slot="suffix" v-model="orderConfig.SE.fields.financeLockView" placeholder="" style="width:78px; margin-right: -5px;">
                       <el-option label="是" :value="true"></el-option>
                       <el-option label="否"  :value="false"></el-option>
                     </el-select>
                   </el-input>
                 </el-form-item>
               </el-col>
               <el-col class="elementWidth">
                 <el-form-item label-width="40px">
                   <el-input style="width:200px;">
                     <template slot="prepend">提单类型</template>
                     <el-select slot="suffix" clearable v-model="orderConfig.SE.fields.billingType" placeholder="" style="width:115px; margin-right: -5px;">
                       <el-option v-for="(item,index) in remoteData.SE.billingTypes" :key="index" :label="item.paramText" :value="item.paramText"></el-option>
                     </el-select>
                   </el-input>
                 </el-form-item>
               </el-col>
               <el-col class="elementWidth">
                 <el-form-item label-width="40px">
                   <el-input style="width:240px;">
                     <template slot="prepend">默认货物类型</template>
                     <el-select slot="suffix" clearable v-model="orderConfig.SE.fields.goodsType" placeholder="" style="width:115px; margin-right: -5px;">
                       <el-option v-for="(item,index) in remoteData.SE.goodsType" :key="index" :label="item.paramText" :value="item.paramText"></el-option>
                     </el-select>
                   </el-input>
                 </el-form-item>
               </el-col>
               <el-col class="elementWidth">
                 <el-form-item label-width="40px">
                   <el-input style="width:240px;">
                     <template slot="prepend">默认装箱方式</template>
                     <el-select slot="suffix" clearable v-model="orderConfig.SE.fields.containerMethod" placeholder="" style="width:115px; margin-right: -5px;">
                       <el-option  v-for="(item, index) in remoteData.SE.containerMethod" :key="index" :label="item.paramText" :value="item.paramText"></el-option>
                     </el-select>
                   </el-input>
                 </el-form-item>
               </el-col>
             </el-row>

             <el-row>
               <el-col class="elementWidth">
                 <el-form-item label="SI订单配置"></el-form-item>
               </el-col>
               <el-col class="elementWidth">
                 <el-form-item label="" label-width="0px">
                   <el-button type="text" size="small" v-if="orderConfig.SI.showFlag" v-on:click="showFlagSearch('SI')">收起<i class="el-icon-arrow-down"></i></el-button>
                   <el-button type="text" size="small" v-if="!orderConfig.SI.showFlag" v-on:click="showFlagSearch('SI')">展开<i class="el-icon-arrow-up"></i></el-button>
                 </el-form-item>
               </el-col>
             </el-row>
             <el-row v-show="orderConfig.SI.showFlag">
               <el-col class="elementWidth">
                 <el-form-item label-width="40px">
                   <el-input style="width:200px;">
                     <template slot="prepend">锁账是否可见</template>
                     <el-select slot="suffix" v-model="orderConfig.SI.fields.financeLockView" placeholder="" style="width:78px; margin-right: -5px;">
                       <el-option label="是" :value="true"></el-option>
                       <el-option label="否"  :value="false"></el-option>
                     </el-select>
                   </el-input>
                 </el-form-item>
               </el-col>
               <el-col class="elementWidth">
                 <el-form-item label-width="40px">
                   <el-input style="width:240px;">
                     <template slot="prepend">默认货物类型</template>
                     <el-select slot="suffix" clearable v-model="orderConfig.SI.fields.goodsType" placeholder="" style="width:115px; margin-right: -5px;">
                       <el-option v-for="(item,index) in remoteData.SI.goodsType" :key="index" :label="item.paramText" :value="item.paramText"></el-option>
                     </el-select>
                   </el-input>
                 </el-form-item>
               </el-col>
               <el-col class="elementWidth">
                 <el-form-item label-width="40px">
                   <el-input style="width:240px;">
                     <template slot="prepend">默认装箱方式</template>
                     <el-select slot="suffix" clearable v-model="orderConfig.SI.fields.containerMethod" placeholder="" style="width:115px; margin-right: -5px;">
                       <el-option  v-for="(item, index) in remoteData.SI.containerMethod" :key="index" :label="item.paramText" :value="item.paramText"></el-option>
                     </el-select>
                   </el-input>
                 </el-form-item>
               </el-col>
             </el-row>

             <el-row>
               <el-col class="elementWidth">
                 <el-form-item label="TE订单配置"></el-form-item>
               </el-col>
               <el-col class="elementWidth">
                 <el-form-item label="" label-width="0px">
                   <el-button type="text" size="small" v-if="orderConfig.TE.showFlag" v-on:click="showFlagSearch('TE')">收起<i class="el-icon-arrow-down"></i></el-button>
                   <el-button type="text" size="small" v-if="!orderConfig.TE.showFlag" v-on:click="showFlagSearch('TE')">展开<i class="el-icon-arrow-up"></i></el-button>
                 </el-form-item>
               </el-col>
             </el-row>
             <el-row v-show="orderConfig.TE.showFlag">
               <el-col class="elementWidth">
                 <el-form-item label-width="40px">
                   <el-input style="width:200px;">
                     <template slot="prepend">锁账是否可见</template>
                     <el-select slot="suffix" clearable v-model="orderConfig.TE.fields.financeLockView" placeholder="" style="width:78px; margin-right: -5px;">
                       <el-option label="是" :value="true"></el-option>
                       <el-option label="否"  :value="false"></el-option>
                     </el-select>
                   </el-input>
                 </el-form-item>
               </el-col>
               <el-col class="elementWidth">
                 <el-form-item label-width="40px">
                   <el-input style="width:240px;">
                     <template slot="prepend">默认货物类型</template>
                     <el-select slot="suffix" clearable v-model="orderConfig.TE.fields.goodsType" placeholder="" style="width:115px; margin-right: -5px;">
                       <el-option  v-for="(item, index) in remoteData.TE.goodsType" :key="index" :label="item.paramText" :value="item.paramText"></el-option>
                     </el-select>
                   </el-input>
                 </el-form-item>
               </el-col>
               <el-col class="elementWidth">
                 <el-form-item label-width="40px">
                   <el-input style="width:240px;">
                     <template slot="prepend">默认装箱方式</template>
                     <el-select slot="suffix" clearable v-model="orderConfig.TE.fields.containerMethod" placeholder="" style="width:115px; margin-right: -5px;">
                       <el-option  v-for="(item, index) in remoteData.TE.containerMethod" :key="index" :label="item.paramText" :value="item.paramText"></el-option>
                     </el-select>
                   </el-input>
                 </el-form-item>
               </el-col>
             </el-row>

             <el-row>
               <el-col class="elementWidth">
                 <el-form-item label="LC订单配置"></el-form-item>
               </el-col>
               <el-col class="elementWidth">
                 <el-form-item label="" label-width="0px">
                   <el-button type="text" size="small" v-if="orderConfig.LC.showFlag" v-on:click="showFlagSearch('LC')">收起<i class="el-icon-arrow-down"></i></el-button>
                   <el-button type="text" size="small" v-if="!orderConfig.LC.showFlag" v-on:click="showFlagSearch('LC')">展开<i class="el-icon-arrow-up"></i></el-button>
                 </el-form-item>
               </el-col>
             </el-row>
             <el-row v-show="orderConfig.LC.showFlag">
               <el-col class="elementWidth">
                 <el-form-item label-width="40px">
                   <el-input style="width:200px;">
                     <template slot="prepend">锁账是否可见</template>
                     <el-select slot="suffix" v-model="orderConfig.LC.fields.financeLockView" placeholder="" style="width:78px; margin-right: -5px;">
                       <el-option label="是" :value="true"></el-option>
                       <el-option label="否"  :value="false"></el-option>
                     </el-select>
                   </el-input>
                 </el-form-item>
               </el-col>
               <el-col class="elementWidth">
                 <el-form-item label-width="40px">
                   <el-input style="width:240px;">
                     <template slot="prepend">默认货物类型</template>
                     <el-select slot="suffix" clearable v-model="orderConfig.LC.fields.goodsType" placeholder="" style="width:115px; margin-right: -5px;">
                       <el-option  v-for="(item,index) in remoteData.LC.goodsType" :key="index" :label="item.paramText" :value="item.paramText"></el-option>
                     </el-select>
                   </el-input>
                 </el-form-item>
               </el-col>
               <el-col class="elementWidth">
                 <el-form-item label-width="40px">
                   <el-input style="width:240px;">
                     <template slot="prepend">默认运输方式</template>
                     <el-select slot="suffix" clearable  v-model="orderConfig.LC.fields.shippingMethod" placeholder="" style="width:115px; margin-right: -5px;">
                       <el-option v-for="(item,index) in remoteData.LC.shippingMethod" :key="index" :label="item.paramText" :value="item.paramText"></el-option>
                     </el-select>
                   </el-input>
                 </el-form-item>
               </el-col>
             </el-row>

             <el-row>
               <el-col class="elementWidth">
                 <el-form-item label="IO订单配置"></el-form-item>
               </el-col>
               <el-col class="elementWidth">
                 <el-form-item label="" label-width="0px">
                   <el-button type="text" size="small" v-if="orderConfig.IO.showFlag" v-on:click="showFlagSearch('IO')">收起<i class="el-icon-arrow-down"></i></el-button>
                   <el-button type="text" size="small" v-if="!orderConfig.IO.showFlag" v-on:click="showFlagSearch('IO')">展开<i class="el-icon-arrow-up"></i></el-button>
                 </el-form-item>
               </el-col>
             </el-row>
             <el-row v-show="orderConfig.IO.showFlag">
               <el-col class="elementWidth">
                 <el-form-item label-width="40px">
                   <el-input style="width:200px;">
                     <template slot="prepend">锁账是否可见</template>
                     <el-select slot="suffix" v-model="orderConfig.IO.fields.financeLockView" placeholder="" style="width:78px; margin-right: -5px;">
                       <el-option label="是" :value="true"></el-option>
                       <el-option label="否"  :value="false"></el-option>
                     </el-select>
                   </el-input>
                 </el-form-item>
               </el-col>
             </el-row>

           </div>
          <el-row>
            <el-col class="elementWidth">
              <el-form-item label="" label-width="14px">
                <el-button type="primary" size="small" v-if="subFlag" v-on:click="submitQuery('ruleForm')">提交
                </el-button>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </el-col>
    </el-row>
    <subscribe-list ref="addMission" v-if="subscribeListVisible" :visible.sync="subscribeListVisible"></subscribe-list>
    <image-cropper ref="addMission" v-if="imageCropperVisible" :visible.sync="imageCropperVisible"
                   :option="cropperOption" :upload-success="imageCropperUploadSuccess"></image-cropper>
    <el-dialog title="图片预览" :visible.sync="imageViewVisible" width="30%" :before-close="handleClose">
      <el-row style="text-align: center">
        <el-image :src="imageViewUrl"></el-image>
      </el-row>
    </el-dialog>
  </div>
</template>
<script>
import subscribe_list from './org/hrs_org_subscribe'
import image_cropper from "../public/image_cropper";

export default {
  props: {
    visible: {
      type: Boolean,
      default: false
    }
  },
  components: {
    "subscribe-list": subscribe_list,
    "image-cropper": image_cropper,
  },
  data() {
    const checkOrgCodeThree = (rule, value, callback) => {
      if (value && value.length < 3) {
        callback(new Error(rule.message));
      } else {
        callback();
      }
    };
    return {
      is1360: false,
      imageViewVisible: false,
      imageViewUrl: '',
      imageLoading: {
        orgLogo: true,
        shortLogo: true,
        orgSeal: true,
      },
      dic: {
        "org_log_bg": "orgLogo",
        "org_log_sm": "shortLogo",
        "org_seal": "orgSeal",
      },
      cropperOption: {
        autoCropWidth: 400,
        autoCropHeight: 100,
        businessIdentity: 'org_log_bg',
      },
      imageCropperVisible: false,
      imageCropperDataIndex: null,
      subscribeListVisible: false,
      loading: false,
      showFlag: false,
      subFlag: true,
      editFlag: false,
      stopDateClass: 'colorRed',
      ruleForm: {
        orgId: "",
        orgBankInfoCn: "",
        orgBankInfoEn: "",
        orgAddressInfoCn: "",
        orgAddressInfoEn: "",
        orgLogo: "",
        shortLogo: "",
        orgSeal: "",
        orgName: "",
        shortName: "",
        orgEname: "",
        shortEname: "",
        orgCodeThree: '',
        financialVoucherOutType: '',
        orderConfig: [],
        orgBankConfigList: [],
        groupId:'',
      },
      backData: {
        stopDate: '',
        userNumber: '',
        airFreightSubscriptions: '',
      },
      rountingSignBusinessProductList: [],
      aeProductList: [],
      orderConfig: {
        AE: {
          showFlag: false,
          fields: {
            financeLockView: true,
            businessProduct: null,
            goodsType: null,
            batteryType: null,
            customsStatusCode: null,
            iataCode: '',
            cataCertifiedSalesAgents: null,
            rountingSignBusinessProduct: '',
            rountingSign: 0
          }
        },
        AI: {
          showFlag: false,
          fields: {
            financeLockView: true,
            goodsType: null,
            cargoFlowType: null,
            iataCode: '',
          }
        },
        SE: {
          showFlag: false,
          fields: {
            financeLockView: true,
            goodsType: null,
            containerMethod: null,
            billingType: null,
          }
        },
        SI: {
          showFlag: false,
          fields: {
            financeLockView: true,
            goodsType: null,
            containerMethod: null,
          }
        },
        TE: {
          showFlag: false,
          fields: {
            financeLockView: true,
            goodsType: null,
            containerMethod: null,
          }
        },
        LC: {
          showFlag: false,
          fields: {
            financeLockView: true,
            goodsType: null,
            shippingMethod: null,
          }
        },
        IO: {
          showFlag: false,
          fields: {
            financeLockView: true,
            goodsType: null,
            shippingMethod: null,
          }
        },
      },
      rules: {
        orgName: [{
          required: true,
          message: '请输入公司名称(中文)',
          trigger: ['blur']
        }
        ],
        shortName: [{
          required: true,
          message: '请输入公司简称(中文)',
          trigger: ['blur']
        }
        ],
        orgEname: [{
          required: true,
          message: '请输入公司名称(英文)',
          trigger: ['blur']
        }
        ],
        showEname: [{
          required: true,
          message: '请输入公司简称(英文)',
          trigger: ['blur']
        }
        ],
        orgBankInfoCn: [
          {
            min: 1,
            max: 200,
            message: '长度不超过 200',
            trigger: ['blur']
          }
        ],
        orgBankInfoEn: [
          {
            min: 1,
            max: 200,
            message: '长度不超过 200',
            trigger: ['blur']
          }
        ],
        orgAddressInfoCn: [
          {
            min: 1,
            max: 200,
            message: '长度不超过 200',
            trigger: ['blur']
          }
        ],
        orgAddressInfoEn: [
          {
            min: 1,
            max: 200,
            message: '长度不超过 200',
            trigger: ['blur']
          }
        ],
        orgCodeThree: [
          {
            trigger: ['blur'],
            message: '请填写3位公司代码',
            validator: checkOrgCodeThree,
          }
        ]
      },
      remoteData: {
        AE: {
          goodsType: [],//货物类型
          customsStatusCode: [], //货物海关编码
          businessProduct: [], //服务产品
          batteryType: [], //电池情况
        },
        AI: {
          goodsType: [],//货物类型
          cargoFlowType: [], //货物流向
        },
        SE: {
          goodsType: [],//货物类型
          containerMethod: [], //装箱方式
          billingTypes: [], //提单类型
        },
        SI: {
          goodsType: [],//货物类型
          containerMethod: [], //装箱方式
        },
        TE: {
          goodsType: [],//货物类型
          containerMethod: [], //装箱方式
        },
        LC: {
          goodsType: [],//货物类型
          shippingMethod: [], //运输方式
        },
      },
      bankAccountSettings: false,
      bankAccountTemplate: {
        titleCn: null,
        bankInfoCn: null,
        addressInfoCn: null,
        titleEn: null,
        bankInfoEn: null,
        addressInfoEn: null,
        logoUrl: null,
        sealUrl: null
      }
    }
  },
  created: function () {
    this.is1360 = (window.screen.width == 1360 || window.screen.width == 1366) ? true : false;
    let orgId = window.localStorage.getItem('orgId');
    let orgType = window.localStorage.getItem('orgType');
    if (orgType == "2" || orgType == 2) {
      this.editFlag = true;
    }
    this.$axios.get('/afbase/awb/selectCategory?category=航线签单').then(function (response) {
      this.aeProductList = response.data.data;
    }.bind(this));

      //查询公司信息
      let that = this;
      this.$axios.get('/hrs/org/' + orgId).then(function(response) {
        if (response.data.code == 1) {
          this.openError(response.data.message || '数据加载失败');
          return;
        }
        let data = response.data.data;
        for (let key in this.ruleForm) {
          let value = data[key];
          if (value) {
            this.ruleForm[key] = value;
          }
        }
        that.backData.userNumber = response.data.data.totalUser + " / " + response.data.data.orgUserCount;
        if (!response.data.data.orderFinanceLockView) {
          that.ruleForm.orderFinanceLockView = false;
        } else {
          that.ruleForm.orderFinanceLockView = response.data.data.orderFinanceLockView;
        }

        that.backFillOrderConfig(response.data.data.orderConfig);
        that.buildAdditionalService(response.data.data.serviceMealConfigList || []);
        that.processStopDate(response.data.data.stopDate);
      }.bind(this)).catch(function (error) {
        this.openError(error || '数据加载失败');
      }.bind(this));
    this.loadRemoteData();
  },
  mounted() {
  },
  methods: {
    showFlagSearch(scope) {
      this.orderConfig[scope].showFlag = !this.orderConfig[scope].showFlag;
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
     submitQuery(formName){
       if(this.rountingSignBusinessProductList.length>0){
         this.orderConfig.AE.fields.rountingSign = 1;
         let idStr = '';
          this.rountingSignBusinessProductList.forEach((a) => {
                if(idStr){
                   idStr = idStr+","+a;
                }else{
                   idStr = a;
                }
          })
         this.orderConfig.AE.fields.rountingSignBusinessProduct = idStr;
       }else{
         this.orderConfig.AE.fields.rountingSign = 0;
         this.orderConfig.AE.fields.rountingSignBusinessProduct = '';
       }
        	this.$refs[formName].validate((valid) => {
        		if(valid) {
              this.subFlag = false;
              let bankList = this.ruleForm.orgBankConfigList || [];
              for (let i = 0; i < bankList.length; i++) {
                let data = bankList[i];
                if ((data.titleCn || '').length == 0) {
                  this.openError("请填写公司抬头(中文)")
                  this.subFlag = true;
                  return;
                }
                if ((data.titleEn || '').length == 0) {
                  this.openError("请填写公司抬头(英文)")
                  this.subFlag = true;
                  return;
                }
              }

              let params = this.ruleForm;
              params.orderConfig = this.getOrderConfig();

              this.$axios.post2('/hrs/org/configure', params)
                .then(function (response) {
                  if (response.data.code == 0) {
                    this.loading = false
                    this.openSuccess();
                    this.subFlag = true;
                       localStorage.setItem('orderFinanceLockView',params.orderFinanceLockView)
                       localStorage.setItem('rountingSign',this.orderConfig.AE.fields.rountingSign)
                       localStorage.setItem('rountingSignBusinessProduct',this.orderConfig.AE.fields.rountingSignBusinessProduct)
                    } else {
                    this.loading = false
                    this.subFlag = true;
                    let errorinfo = response.data.messageInfo;
                    if (errorinfo.indexOf("SY.01") > -1) {
                      this.openError("公司抬头重复");
                    } else {
                      this.openError(errorinfo);
                    }
                  }
                  }.bind(this)).catch(function(error) {
                    this.loading = false
                    this.subFlag = true;
                    this.openError(error.response.data.messageInfo);
                  }.bind(this));

              } else {
              		console.log('error submit!!');
              		return false;
              	}
              });

      },
      trim_str(str){
        return str.replace(/(^\s*)|(\s*$)/g, "");
      },
      loadRemoteData(){
        this.loadAirGoodsType();
        this.loadSeaGoodsType();
        this.loadRailwayGoodsType();
        this.loadInlandGoodsType();
        this.loadAirCustomsStatusCode();
        this.loadAirBatteryType();
        this.loadAirBusinessProduct();
        this.loadAirCargoFlowType();

        this.loadSeaContainerMethod();
        this.loadRailwayContainerMethod();
        this.loadShippingMethod();
        this.loadSeaBillingType();
      },
      /**
       * 空运货物类型
       */
      loadAirGoodsType(){
        this.$axios.get('/afbase/awb/selectCategory?category=货物类型').then(function(response) {
          this.remoteData.AE.goodsType = response.data.data;
          this.remoteData.AI.goodsType = response.data.data;
        }.bind(this));
      },
      /**
       * 海运货物类型
       */
      loadSeaGoodsType(){
        this.$axios.get('/sc/vScCategory/货物类型').then(function(response){
          this.remoteData.SE.goodsType = response.data.data;
          this.remoteData.SI.goodsType = response.data.data;
        }.bind(this))
      },
      /**
       * 海运提单类型
       */
      loadSeaBillingType(){
          this.$axios.get('/sc/vScCategory/提单类型').then((response) => {
              this.remoteData.SE.billingTypes = response.data.data;
          })
      },
      /**
       * 铁路货物类型
       */
      loadRailwayGoodsType() {
        this.$axios.get('/sc/vScCategory/货物类型').then(function(response){
          this.remoteData.TE.goodsType = response.data.data;
        }.bind(this))
      },
      /**
       * 国内货物类型
       */
      loadInlandGoodsType(){
        this.$axios.get('/sc/vLcCategory/货物类型').then(function(response){
          this.remoteData.LC.goodsType = response.data.data;
        }.bind(this))
      },

      loadAirCustomsStatusCode(){
        this.$axios.get('/afbase/awb/selectCategory?category=货物海关代码').then(function(response) {
          this.remoteData.AE.customsStatusCode = response.data.data;
        }.bind(this));
      },
      loadAirBatteryType(){
        this.$axios.get('/afbase/awb/selectCategory?category=电池情况').then(function(response) {
          this.remoteData.AE.batteryType = response.data.data;
        }.bind(this));
      },
      loadAirBusinessProduct(){
        this.$axios.get('/afbase/awb/selectCategory?category=出口产品').then(function(response) {
          this.remoteData.AE.businessProduct = response.data.data;
        }.bind(this));
      },

      loadAirCargoFlowType(){
        this.$axios.get('/afbase/awb/selectCategory?category=货物流向').then(function(response) {
          this.remoteData.AI.cargoFlowType = response.data.data;
        }.bind(this));
      },
      /**
       * 海运装箱方式
        */
      loadSeaContainerMethod(){
        this.$axios.get('/sc/vScCategory/装箱方式').then(function(response){
          this.remoteData.SE.containerMethod = response.data.data;
          this.remoteData.SI.containerMethod = response.data.data;
        }.bind(this));
      },
      /**
       * 铁路装箱方式
       */
      loadRailwayContainerMethod(){
        this.$axios.get('/sc/tcCategory/装箱方式').then(function(response){
          this.remoteData.TE.containerMethod = response.data.data;
        }.bind(this))
      },
      loadShippingMethod(){
        this.$axios.get('/sc/vLcCategory/运输方式').then(function(response) {
          this.remoteData.LC.shippingMethod = response.data.data;
        }.bind(this));
      },
      getOrderConfig(){
        let orderConfig = [];
        for (let businessScope in this.orderConfig) {
          let item = {}, fields = this.orderConfig[businessScope].fields;
          item['businessScope'] = businessScope;
          for (let fieldKey in fields) {
            // let value = (fields[fieldKey] || '');
            // if(value.length > 0) {
              if(fields[fieldKey]||fields[fieldKey]==0){
              item[fieldKey] = fields[fieldKey];
            }
            // }
          }
          item.financeLockView = fields.financeLockView;
          orderConfig.push(item);
        }
        return orderConfig;
      },
      backFillOrderConfig(remoteOrderConfig){
        remoteOrderConfig = remoteOrderConfig || [];
        if(remoteOrderConfig.length == 0){ return; }
        let dic = {};
        for (let i = 0; i < remoteOrderConfig.length; i++) {
          let item = remoteOrderConfig[i], businessScope = item.businessScope;
          dic[businessScope] = item;
          if(businessScope =='AE'&&remoteOrderConfig[i].rountingSignBusinessProduct){
            if(remoteOrderConfig[i].rountingSignBusinessProduct.indexOf(",")){
              this.rountingSignBusinessProductList = remoteOrderConfig[i].rountingSignBusinessProduct.split(',');
            }else{
               this.rountingSignBusinessProductList = [];
               this.rountingSignBusinessProductList.push(remoteOrderConfig[i].rountingSignBusinessProduct);
            }

          }
        }
        for(let scope in this.orderConfig){
          let item = this.orderConfig[scope].fields, backItem = dic[scope];
          if(!backItem){ continue }
          for(let itemKey in item){
            item[itemKey] = backItem[itemKey];
          }
        }
      },
      buildAdditionalService(serviceList){
        if(serviceList.length == 0){
          return;
        }
        let item = serviceList[0];
        let dic = {"MONTH": '月'};
        this.backData.airFreightSubscriptions = item['serviceNumberUsed'] + " / " + item['serviceNumberMax'] + " (" + dic[item['serviceCycle']] + ")";
      },
      processStopDate(stopDate){
        if(stopDate){
          this.backData.stopDate = stopDate.substring(0,10);
          let day1 = new Date();
          let s1 = day1.getFullYear()+"-" + (day1.getMonth()+1) + "-" + day1.getDate();
          let days = this.getDaysBetween(s1,stopDate);
          if(days < 30){
            this.stopDateClass = "colorRed";
          }else{
            this.stopDateClass = "";
          }
        }else{
          this.backData.stopDate = '2099-12-31'
          this.stopDateClass = "";
        }
      },
    getDaysBetween(dateString1, dateString2) {
      let startDate = Date.parse(dateString1);
      let endDate = Date.parse(dateString2);
      let days = (endDate - startDate) / (1 * 24 * 60 * 60 * 1000);
      return days;
    },
    openSubscribe() {
      this.subscribeListVisible = true;
    },
    showImageCropper(width, height, type, dataIndex) {
      this.cropperOption.autoCropWidth = width;
      this.cropperOption.autoCropHeight = height;
      this.cropperOption.businessIdentity = type;
      this.imageCropperVisible = true;
      this.imageCropperDataIndex = dataIndex;
    },
    imageCropperUploadSuccess(url) {
      if (this.imageCropperDataIndex == -1) {
        switch (this.cropperOption.businessIdentity) {
          case "org_logo":
            this.ruleForm.orgLogo = url;
            break;
          case "org_seal":
            this.ruleForm.orgSeal = url;
            break;
          default:
            break;
        }
      }
      if (this.imageCropperDataIndex > -1) {
        let data = this.ruleForm.orgBankConfigList[this.imageCropperDataIndex];
        switch (this.cropperOption.businessIdentity) {
          case "org_logo":
            data.logoUrl = url;
            break;
          case "org_seal":
            data.sealUrl = url;
            break;
          default:
            break;
        }
      }
    },
    addRow() {
      let item = Object.assign({}, this.bankAccountTemplate);
      item.titleCn = this.ruleForm.orgName;
      this.ruleForm.orgBankConfigList.push(item);
    },
    deleteRow(index, row) {
      this.ruleForm.orgBankConfigList.splice(index, 1);
    },
    viewPic(url) {
      this.imageViewVisible = true;
      this.imageViewUrl = url;
    },
    handleClose() {
      this.imageViewVisible = false;
    }
  }
	}
</script>
<style >

  .org_config{
    padding-top: 10px;
    padding-bottom: 10px;

  }
	.el-form-item__content_org_config {
		line-height: 8px !important;
		position: relative;
		font-size: 14px;
	}

  .org_config .el-form-item__content3 {
    line-height: 8px !important;
    position: relative;
    font-size: 14px;
  }
    .org_config .el-input__icon{
      line-height: 29px !important;
    }

  .demo-ruleForm .widthIataCode .el-input-group__prepend {
    padding: 0 28px;
  }

  .org_config .colorRed .el-input__inner {
    color: red !important;
    font-weight: bold
  }

  .org_config .bank-account-item {
    margin-left: 20px;
  }

  .org_config .bank-account-row {
    margin-top: 5px;
  }

  .org_config .upload-btn {
    padding: 7px;
    width: 73px;
  }

  .org_config .view-btn {
    padding: 7px;
    width: 73px;
    margin-left: 3px;
  }

  .org_config .header-color {
    background-color: oldlace;
    height: 40px;
    padding-top: 5px;
  }

  .org_config .icon_subtract {
    position: absolute;
    left: 15px;
    line-height: 30px;
  }

  .org_config .el-divider--horizontal {
    margin: 14px 0px;
  }

  .org_config .header-font {
    color: #909399;
    font-size: 14px;
    font-weight: bold;
    line-height: 33px;
  }

</style>
