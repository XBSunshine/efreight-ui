<template>
	<el-dialog title="附加费 - 新增" width="700px" :visible.sync="visible" :close-on-press-escape="false" :close-on-click-modal="false" :before-close="handleClose">
		<el-form :disabled="loading" :model="ruleForm" :rules="rules" :close-on-press-escape="false" ref="ruleForm" label-width="85px" style="margin-left: 10px;" class="afSurchargeSave">
			<el-row>
				<el-col class="elementWidth">
          <el-form-item prop="carrierId" label-width="15px">
            <el-input class="widthTwoXing" style="width:239px;margin-right: 15px;">
              <template slot="prepend">
                <font style="color: red;">*</font>
                <span>航司</span>
              </template>
              <el-select slot="suffix" v-model="ruleForm.carrierId" filterable default-first-option placeholder="请选择" style="width:146px;margin-right: -5px;" clearable :filter-method="changeCarrier" @visible-change="initCarrier">
                <el-option v-for="item in carriers" :key="item.carrierId" :label="item.carrierCode" :value="item.carrierId">
                  <<span>{{item.carrierName.split(',')[0]}}&nbsp;&nbsp;&nbsp;&nbsp;{{item.carrierName.split(',')[1]}}&nbsp;&nbsp;&nbsp;&nbsp;{{item.carrierName.split(',')[2]}}</span>-
                </el-option>
              </el-select>
            </el-input>
          </el-form-item>
				</el-col>
        <el-col class="elementWidth">
          <el-form-item prop="departureStation" label-width="15px">
            <el-input class="widthThree" style="width:339px;margin-right: 15px;">
              <template slot="prepend">
                <span>始发港</span>
              </template>
              <el-select slot="suffix" v-model="ruleForm.departureStations" multiple :filter-method="changeDepartureStation" @input="toDoUpperCase2" filterable
                          default-first-option placeholder="请选择" style="width:246px;margin-right: -5px;">
                <el-option v-for="item in departureStations" :key="item.apCode" :label="item.apCode" :value="item.apCode">
                </el-option>
              </el-select>
            </el-input>
          </el-form-item>
          <!--<el-form-item prop="departureStation" label-width="15px">
            <el-input class="widthThree" v-model.trim="ruleForm.departureStation" clearable style="width:339px;margin-right: 15px;" auto-complete="off" @input="ruleForm.departureStation=ruleForm.departureStation.toUpperCase()">
              <template slot="prepend">
                <span>始发港</span>
              </template>
            </el-input>
          </el-form-item>-->
        </el-col>
			</el-row>
			<el-row>
        <el-col class="elementWidth">
          <el-form-item prop="arrivalNationCode" label-width="15px">
            <el-input class="widthThree" style="width:239px;margin-right: 15px;">
              <template slot="prepend">
                <span>目的国</span>
              </template>
              <el-select slot="suffix" v-model="arrivalNationCode" multiple filterable placeholder="请选择" style="width:146px;margin-right: -5px;">
                <el-option v-for="item in nationCodes" :key="item.nationCode" :label="item.nationCode" :value="item.nationCode">
                  <span>{{item.nationName.split(',')[0]}}&nbsp;&nbsp;&nbsp;&nbsp;{{item.nationName.split(',')[1]}}&nbsp;&nbsp;&nbsp;</span>
                </el-option>
              </el-select>
            </el-input>
          </el-form-item>
        </el-col>
        <el-col class="elementWidth">
          <el-form-item prop="arrivalStation" label-width="15px">
            <el-input class="widthThree" style="width:339px;margin-right: 15px;">
              <template slot="prepend">
                <span>目的港</span>
              </template>
              <el-select slot="suffix" v-model="ruleForm.arrivalStations" multiple :filter-method="changeArrivalStation" @input="toDoUpperCase3" filterable
                         default-first-option placeholder="请选择" style="width:246px;margin-right: -5px;">
                <el-option v-for="item in arrivalStations" :key="item.apCode" :label="item.apCode" :value="item.apCode">
                </el-option>
              </el-select>
            </el-input>
          </el-form-item>
          <!--<el-form-item prop="arrivalStation" label-width="15px">
            <el-input class="widthThree" v-model.trim="ruleForm.arrivalStation" clearable style="width:339px;margin-right: 15px;" auto-complete="off" @input="ruleForm.arrivalStation=ruleForm.arrivalStation.toUpperCase()">
              <template slot="prepend">
                <span>目的港</span>
              </template>
            </el-input>
          </el-form-item>-->
        </el-col>
			</el-row>
      <el-row>
        <el-col class="elementWidth">
          <el-form-item prop="routingName" label-width="15px">
            <el-input class="widthRoutingName" style="width:239px;margin-right: 15px;">
              <template slot="prepend">
                <span>IATA分区</span>
              </template>
              <el-select slot="suffix" v-model="ruleForm.routingName" filterable placeholder="请选择" style="width:146px;margin-right: -5px;" clearable>
                <el-option v-for="item in routingNames" :key="item.id" :label="item.paramText" :value="item.paramText">
                </el-option>
              </el-select>
            </el-input>
          </el-form-item>
        </el-col>
        <el-col class="elementWidth">
          <el-form-item prop="awbSort" label-width="15px">
            <el-input class="widthFour" v-model="ruleForm.awbSort" clearable style="width:239px;margin-right: 15px;" auto-complete="off" @input="formatToNumber('awbSort')" maxlength="10">
              <template slot="prepend">
                <span>运单排序</span>
              </template>
            </el-input>
          </el-form-item>
        </el-col>
      </el-row>
			<el-row>
				<el-col class="elementWidth">
          <el-form-item prop="surchargeCode" label-width="15px">
            <el-input class="widthFive" v-model="ruleForm.surchargeCode" clearable style="width:239px;margin-right: 15px;" auto-complete="off" @input="ruleForm.surchargeCode=ruleForm.surchargeCode.toUpperCase()" maxlength="5">
              <template slot="prepend">
                <font style="color: red;">*</font>
                <span>附加费代码</span>
              </template>
            </el-input>
          </el-form-item>
				</el-col>
				<el-col class="elementWidth">
          <el-form-item prop="surchargeName" label-width="15px">
            <el-input v-model="ruleForm.surchargeName" clearable style="width:239px;margin-right: 15px;" auto-complete="off" maxlength="100">
              <template slot="prepend">
                <font style="color: red;">*</font>
                <span>附加费名称</span>
              </template>
            </el-input>
          </el-form-item>
				</el-col>
			</el-row>

			<el-row>
				<el-col class="elementWidth">
          <el-form-item prop="unitPrice" label-width="15px">
            <el-input class="widthTwoXing" v-model="ruleForm.unitPrice" clearable style="width:239px;margin-right: 15px;" auto-complete="off" @input="formatToFloat('unitPrice')" maxlength="18">
              <template slot="prepend">
                <font style="color: red;">*</font>
                <span>单价</span>
              </template>
            </el-input>
          </el-form-item>
				</el-col>
        <el-col class="elementWidth">
          <el-form-item label-width="15px" prop="chargeMethod">
            <el-input class="widthFourXing" style="width:239px;">
              <template slot="prepend">
                <font style="color: red;">*</font>
                <span>收费方式</span>
              </template>
              <el-select slot="suffix" v-model="ruleForm.chargeMethod" placeholder="请选择" style="width:146px;margin-right: -5px;">
                <el-option label="计重" value="计重"></el-option>
                <el-option label="毛重" value="毛重"></el-option>
                <el-option label="运单" value="运单"></el-option>
              </el-select>
            </el-input>
          </el-form-item>
        </el-col>
			</el-row>
      <el-row>
        <el-col class="elementWidth">
          <el-form-item prop="chargeMin" label-width="15px">
            <el-input class="widthFour" v-model="ruleForm.chargeMin" clearable style="width:239px;margin-right: 15px;" auto-complete="off" @input="formatToFloat('chargeMin')" maxlength="18">
              <template slot="prepend">
                <span>最低收费</span>
              </template>
            </el-input>
          </el-form-item>
        </el-col>
        <el-col class="elementWidth">
          <el-form-item prop="chargeMax" label-width="15px">
            <el-input class="widthFour" v-model="ruleForm.chargeMax" clearable style="width:239px;margin-right: 15px;" auto-complete="off" @input="formatToFloat('chargeMax')" maxlength="18">
              <template slot="prepend">
                <span>最高收费</span>
              </template>
            </el-input>
          </el-form-item>
        </el-col>
      </el-row>
			<el-row>
        <el-col class="elementWidth">
          <el-form-item prop="beginDate" label-width="15px">
            <el-input class="widthFourXing" style="width:239px;">
              <template slot="prepend">
                <font style="color: red;">*</font>
                <span>生效日期</span>
              </template>
              <el-date-picker slot="suffix" style="width: 146px;margin-right: -5px;" v-model="ruleForm.beginDate" clearable type="date" value-format="yyyy-MM-dd 00:00:00"
                              placeholder="选择日期">
              </el-date-picker>
            </el-input>
          </el-form-item>
        </el-col>
        <el-col class="elementWidth">
          <el-form-item prop="endDate" label-width="30px">
            <el-input class="widthFour" style="width:239px;">
              <template slot="prepend">
                <span>失效日期</span>
              </template>
              <el-date-picker slot="suffix" style="width: 146px;margin-right: -5px;" v-model="ruleForm.endDate" clearable type="date" value-format="yyyy-MM-dd 23:59:59"
                              placeholder="选择日期">
              </el-date-picker>
            </el-input>
          </el-form-item>
        </el-col>
			</el-row>
			<el-row style="text-align: left">
					<el-form-item label-width="15px">
						<el-button size="small" type="primary" @click="submitForm('ruleForm')" :loading="loading">保存</el-button>
						<el-button size="small" @click="resetForm('ruleForm')">重置</el-button>
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
			}
		},
		data() {
      var validateDepartureStation = (rule, value, callback) => {
          if(!value) {
              return callback();
          }
          let regE = /^([A-Za-z][A-Za-z]*,)*[A-Za-z][A-Za-z]*$/;
          if(!regE.test(value)) {
              callback(new Error('始发港只能录入英文字母和英文逗号，且不能以逗号开头结尾'));
          } else {
              callback();
          }
      };
      var validateArrivalStation = (rule, value, callback) => {
          if(!value) {
              return callback();
          }
          let regE = /^([A-Za-z][A-Za-z]*,)*[A-Za-z][A-Za-z]*$/;
          if(!regE.test(value)) {
              callback(new Error('目的港只能录入英文字母和英文逗号，且不能以逗号开头结尾'));
          } else {
              callback();
          }
      };
			return {
				loading: false,
          carriers: [],
          carriers2: [],
          departureStations: [],
          arrivalStations: [],
          nationCodes: [],
          routingNames: [],
          arrivalNationCode: [],
          airportOptions2: [],
				//表单字段
				ruleForm: {
          carrierId: "",
					departureStation: "",
          departureStations: [],
					arrivalStation: "",
          arrivalStations: [],
          arrivalNationCode: "",
          routingName: "",
          awbSort:1,
          surchargeCode: '',
          surchargeName: '',
          unitPrice: '',
          chargeMethod: '计重',
          chargeMin: '',
          chargeMax: '',
					beginDate: this.getDateTime(new Date()),
					endDate: "",
				},
				//验证规则
				rules: {
          carrierId: [{
            required: true,
            message: '请选择航司',
            trigger: ['blur', 'change']
					}],
          surchargeCode: [{
						required: true,
						message: '请输入附加费代码',
						trigger: ['blur', 'change']
					}],
          surchargeName: [{
              required: true,
              message: '请输入附加费名称',
              trigger: ['blur', 'change']
          }],
          unitPrice: [{
              required: true,
              message: '请输入单价',
              trigger: ['blur', 'change']
          }],
          chargeMethod: [{
              required: true,
              message: '请选择计重',
              trigger: ['blur', 'change']
          }],
					beginDate: [{
						required: true,
						message: '请输入生效日期',
						trigger: ['blur', 'change']
					}],
          /*departureStation: [
              { validator: validateDepartureStation, rigger: ['blur', 'change'] }
          ],
          arrivalStation: [
              { validator: validateArrivalStation, rigger: ['blur', 'change'] }
          ],*/
				}
			}
		},
		inject: ['queryList'],

    created(){
        this.$axios.get('/afbase/carrier/getCarrierList').then((response) => {
            this.carriers2 = response.data.data;
            this.carriers = this.carriers2;
        });
        //始发港，目的港
        this.$axios.get('/afbase/surcharge/getDepartureStationList').then((response) => {
            this.airportOptions2 = response.data.data;
            this.departureStations = this.airportOptions2.slice(0, 30);
            this.arrivalStations = this.airportOptions2.slice(0, 30);
        });
        //目的国
        this.$axios.get('/afbase/surcharge/getNationCodesList').then((response) => {
            this.nationCodes = response.data.data;
        });
        //IATA分区
        this.$axios.get2("/afbase/category/params", {
            "categoryName": "分区"
        }).then(function(response) {
                this.routingNames = response.data.data || [];
            }.bind(this))
    },

		methods: {
      initCarrier(){
          this.carriers = this.carriers2
      },
      changeCarrier(val) {
          if (val) {
              this.carriers = this.carriers2.filter(port => port.carrierCode.indexOf(val.toUpperCase()) > -1 || port.carrierName.indexOf(
                  val.toUpperCase()) > -1)
          } else {
              this.carriers = this.carriers2
          }
      },
      changeDepartureStation(val) {
          if (val) {
              this.departureStations = this.airportOptions2.filter(port => port.apCode.indexOf(val.toUpperCase()) > -1 || port.apCode.indexOf(
                  val) > -1).slice(0, 30)
          } else {
              this.departureStations = this.airportOptions2.slice(0, 30)
          }
      },
      changeArrivalStation(val) {
          if (val) {
              this.arrivalStations = this.airportOptions2.filter(port => port.apCode.indexOf(val.toUpperCase()) > -1 || port.apCode.indexOf(
                  val) > -1).slice(0, 30)
          } else {
              this.arrivalStations = this.airportOptions2.slice(0, 30)
          }
      },
      toDoUpperCase2() {
          if (this.ruleForm.departureStations.length > 0) {
              this.ruleForm.departureStations[this.ruleForm.departureStations.length - 1] = this.ruleForm.departureStations[this
                  .ruleForm.departureStations.length - 1].toUpperCase()
          }
      },
      toDoUpperCase3() {
          if (this.ruleForm.arrivalStations.length > 0) {
              this.ruleForm.arrivalStations[this.ruleForm.arrivalStations.length - 1] = this.ruleForm.arrivalStations[this.ruleForm
                  .arrivalStations.length - 1].toUpperCase()
          }
      },
      getDateTime(theDate) {
          let _year = theDate.getFullYear();
          let _month = theDate.getMonth();
          let _day = theDate.getDate();
          console.log(_day);
          _month = _month + 1;
          if (_month < 10) {
              _month = "0" + _month;
          }
          if (_day < 10) {
              _day = "0" + _day;
          }
          return _year + "-" + _month +"-"+ _day+" 00:00:00";
      },
			//关闭
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
			submitForm(formName) {
        if(this.arrivalNationCode){
            this.ruleForm.arrivalNationCode = this.arrivalNationCode.join()
        }
        if((this.ruleForm.arrivalStations.length == 0) && (this.ruleForm.arrivalNationCode == null || this.ruleForm.arrivalNationCode == '') && (this.ruleForm.routingName == null || this.ruleForm.routingName == '')){
            this.openError("目的港、目的国、IATA分区 至少填一项");
            return;
        }

				this.$refs[formName].validate((valid) => {
					if(valid) {
						this.loading = true;
						let params = this.ruleForm;
						this.$axios.post2("/afbase/surcharge/doSave", params)
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
								this.openError(error.response.data.messageInfo || "");
							}.bind(this));
					} else {
						console.log("error submit!");
						return false;
					}
				})
			},
			resetForm(formName) {
				this.$refs[formName].resetFields();
				this.arrivalNationCode = '';
        this.ruleForm.arrivalNationCode = '';
        this.ruleForm.departureStations = [];
        this.ruleForm.arrivalStations = [];
			},
			formatToFloat(item) {
				if(!item) {
					return
				}
				this.ruleForm[item] = this.ruleForm[item].replace(/[^0123456789.]/g, "");
				let t = this.ruleForm[item].split('.');
          if(t.length > 1) {
              if(t[0].length > 16){
                  t[0] = t[0].substring(0,16);
                  this.ruleForm[item] = t[0] + "." + t[1].substr(0, 2);
              }else{
                  this.ruleForm[item] = t[0] + "." + t[1].substr(0, 2);
              }
          }else{
              if(this.ruleForm[item].length > 16){
                  this.ruleForm[item] = this.ruleForm[item].substring(0,16);
              }
          }
			},
      formatToNumber(item) {
          if(!item) {
              return
          }
          this.ruleForm[item] = this.ruleForm[item].replace(/[^0123456789]/g, "");
      }
		}
	}
</script>
<style type="text/css">

  .afSurchargeSave .el-input__icon {
    line-height: 30px !important;
  }

  .afSurchargeSave .el-form-item__content {
    line-height: 30px !important;
  }

  .afSurchargeSave .el-input-group__prepend {
    padding: 0 6px;
  }

  .afSurchargeSave .widthOne .el-input-group__prepend {
    padding: 0 20px;
  }

  .afSurchargeSave .widthThree .el-input-group__prepend {
    padding: 0 25px;
  }

  .afSurchargeSave .widthTwoXing .el-input-group__prepend {
    padding: 0 27px;
  }

  .afSurchargeSave .widthThreeXing .el-input-group__prepend {
    padding: 0 15px;
  }

  .afSurchargeSave .widthThree1 .el-input-group__prepend {
    padding: 0 18px;
  }

  .afSurchargeSave .widthRoutingName .el-input-group__prepend {
    padding: 0 17px;
  }

  .afSurchargeSave .widthFour .el-input-group__prepend {
    padding: 0 18px;
  }

  .afSurchargeSave .widthFourXing .el-input-group__prepend {
    padding: 0 13px;
  }

</style>
