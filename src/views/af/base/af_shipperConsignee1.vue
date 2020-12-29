<template>
  <div class="warp-main">
    <div>
      <el-form :inline="true" :model="query" label-width="78px" class="demo-ruleForm">
        <el-row>
          <el-col :span="5">
            <el-form-item :label="serName0" v-show=showFlag0>
              <el-input v-model="query.scName0" clearable auto-complete="off" style="width: 200px;">
              </el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="5">
            <el-form-item :label="serName1" v-show=showFlag1>
              <el-input v-model="query.scName1" clearable auto-complete="off" style="width: 200px;">
              </el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="5">
            <el-form-item :label="serName2" v-show=showFlag2>
              <el-input v-model="query.scName2" clearable auto-complete="off" style="width: 200px;">
              </el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="5">
            <el-form-item :label="serName3" v-show=showFlag3>
              <el-input v-model="query.scName3" clearable auto-complete="off" style="width: 200px;">
              </el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="5">
            <el-form-item :label="serName4" v-show=showFlag4>
              <el-input v-model="query.scName4" clearable auto-complete="off" style="width: 200px;">
              </el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="5">
            <el-form-item :label="serName5" v-show=showFlag5>
              <el-input v-model="query.scName5" clearable auto-complete="off" style="width: 200px;">
              </el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="5">
            <el-form-item :label="serName6" v-show=showFlag6>
              <el-input v-model="query.scName6" clearable auto-complete="off" style="width: 200px;">
              </el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="5">
            <el-form-item :label="serName7" v-show=showFlag7>
              <el-input v-model="query.scName7" clearable auto-complete="off" style="width: 200px;">
              </el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="5">
            <el-form-item :label="serName8" v-show=showFlag8>
              <el-input v-model="query.scName8" clearable auto-complete="off" style="width: 200px;">
              </el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="5">
            <el-form-item :label="serName9" v-show=showFlag9>
              <el-input v-model="query.scName9" clearable auto-complete="off" style="width: 200px;">
              </el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="5">
            <el-form-item :label="serName10" v-show=showFlag10>
              <el-input v-model="query.scName10" clearable auto-complete="off" style="width: 200px;">
              </el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="5">
            <el-form-item :label="serName11" v-show=showFlag11>
              <el-input v-model="query.scName11" clearable auto-complete="off" style="width: 200px;">
              </el-input>
            </el-form-item>
          </el-col>
        </el-row><el-row>
        <el-col :span="5">
          <el-form-item :label="serName12" v-show=showFlag12>
            <el-input v-model="query.scName12" clearable auto-complete="off" style="width: 200px;">
            </el-input>
          </el-form-item>
        </el-col>
      </el-row>
        <el-row>
          <el-col :span="5">
            <el-form-item :label="serName13" v-show=showFlag13>
              <el-input v-model="query.scName13" clearable auto-complete="off" style="width: 200px;">
              </el-input>
            </el-form-item>
          </el-col>
        </el-row><el-row>
        <el-col :span="5">
          <el-form-item :label="serName14" v-show=showFlag14>
            <el-input v-model="query.scName14" clearable auto-complete="off" style="width: 200px;">
            </el-input>
          </el-form-item>
        </el-col>
      </el-row>


      </el-form>
    </div>
    <page-save ref="addMission" v-if="saveVisible" :visible.sync="saveVisible" :frow="frow">
    </page-save>
    <page-edit ref="addMission" v-if="editVisible" :visible.sync="editVisible" :frow="frow">
    </page-edit>
    <page-view ref="addMission" v-if="viewVisible" :visible.sync="viewVisible" :frow="frow">
    </page-view>
  </div>
</template>
<script>
    import save from './shipperConsignee/af_shipperConsignee_save'
    import edit from './shipperConsignee/af_shipperConsignee_edit'
    import view from './shipperConsignee/af_shipperConsignee_view'
    export default {
        data() {
            return {
                showFlag0: false,
                showFlag1: false,
                showFlag2: false,
                showFlag3: false,
                showFlag4: false,
                showFlag5: false,
                showFlag6: false,
                showFlag7: false,
                showFlag8: false,
                showFlag9: false,
                showFlag10: false,
                showFlag11: false,
                showFlag12: false,
                showFlag13: false,
                showFlag14: false,
                serName1: '',
                serName2: '',
                serName3: '',
                serName4: '',
                serName5: '',
                serName6: '',
                serName7: '',
                serName8: '',
                serName9: '',
                serName10: '',
                serName11: '',
                serName12: '',
                serName13: '',
                serName14: '',
                serName0: '',
                loading: false,
                data: [],
                pageConf: {
                    //设置一些初始值(会被覆盖)
                    pageCode: 1, //当前页
                    pageSize: 10, //每页显示的记录数
                    totalPage: 0, //总记录数
                    pageOption: [10, 50, 100]
                },
                saveVisible: false,
                editVisible: false,
                viewVisible: false,
                addButtonFlag: false,
                editButtonFlag: false,
                viewButtonFlag: false,
                cancelButtonFlag: false,
                frow: {},
                query: {
                    scType: '',
                    isValid: true,
                    scName: '',
                    scMnemonic: '',
                    scCode: '',
                    cityName: '',
                    nationCode: '',
                    scName1: '',
                    scName2: '',
                    scName3: '',
                    scName4: '',
                    scName5: '',
                    scName6: '',
                    scName7: '',
                    scName8: '',
                    scName9: '',
                    scName10: '',
                    scName11: '',
                    scName12: '',
                    scName13: '',
                    scName14: '',
                    scName0: '',

                },
                currRow: ''
            }
        },
        created: function() {
            let name,value;
            let str=location.href; //取得整个地址栏
            //let str = 'http://tom.t.efreight.cn/#/prm_coop?a=1&b=2&c=3';
            let num=str.indexOf("?")
            str=str.substr(num+1); //取得所有参数   stringvar.substr(start [, length ]

            let arr=str.split("&"); //各个参数放到数组里
            for(let i=0;i < arr.length;i++){
                num=arr[i].indexOf("=");
                if(num>0){
                    name=arr[i].substring(0,num);
                    value=arr[i].substr(num+1);
                    if(i==0){
                        this.showFlag0=true;
                        this.query.scName0 = value;
                        this.serName0 = name;
                    }else if(i==1){
                        this.showFlag1=true;
                        this.query.scName1 = value;
                        this.serName1 = name;
                    }else if(i==2){
                        this.showFlag2=true;
                        this.query.scName2 = value;
                        this.serName2 = name;
                    }else if(i==3){
                        this.showFlag3=true;
                        this.query.scName3 = value;
                        this.serName3 = name;
                    }else if(i==4){
                        this.showFlag4=true;
                        this.query.scName4 = value;
                        this.serName4 = name;
                    }else if(i==5){
                        this.showFlag5=true;
                        this.query.scName5 = value;
                        this.serName5 = name;
                    }else if(i==6){
                        this.showFlag6=true;
                        this.query.scName6 = value;
                        this.serName6 = name;
                    }else if(i==7){
                        this.showFlag7=true;
                        this.query.scName7 = value;
                        this.serName7 = name;
                    }else if(i==8){
                        this.showFlag8=true;
                        this.query.scName8 = value;
                        this.serName8 = name;
                    }else if(i==9){
                        this.showFlag9=true;
                        this.query.scName9 = value;
                        this.serName9 = name;
                    }else if(i==10){
                        this.showFlag10=true;
                        this.query.scName10 = value;
                        this.serName10 = name;
                    }else if(i==11){
                        this.showFlag11=true;
                        this.query.scName11 = value;
                        this.serName11 = name;
                    }else if(i==12){
                        this.showFlag12=true;
                        this.query.scName12 = value;
                        this.serName12 = name;
                    }else if(i==13){
                        this.showFlag13=true;
                        this.query.scName13 = value;
                        this.serName13 = name;
                    }else if(i==14){
                        this.showFlag14=true;
                        this.query.scName14 = value;
                        this.serName14 = name;
                    }

                }
            }

        },
        provide() {
            return {
                queryList: this.queryList
            }
        },
        components: {
            'page-save': save,
            'page-edit': edit,
            'page-view': view
        },
        methods: {
            handleCommand(command) {
                if(command == 'edit') {
                    this.showedit(this.currRow)
                } else if(command == 'view') {
                    this.showDetail(this.currRow)
                } else if(command == 'cancel') {
                    this.cancel(this.currRow)
                }
            },
            handleChange(command) {
                this.currRow = command
            },
            showsave() {
                this.saveVisible = true;
            },
            showedit(row) {
                this.frow = row;
                this.editVisible = true;
            },
            showDetail(row) {
                this.frow = row;
                this.viewVisible = true;
            },
            openError(info) {
                this.$notify({
                    title: '',
                    message: info,
                    type: 'error',
                    position: 'bottom-right'
                });
            },
            openSuccess(info) {
                this.$notify({
                    title: '',
                    message: info,
                    type: 'success',
                    position: 'bottom-right'
                });
            },
            cancel(row) {
                let scTypeName = ''
                if(row.scType == '0') {
                    scTypeName = '该发货人'
                } else if(row.scType == '1') {
                    scTypeName = '该收货人'
                }
                this.$confirm('您将作废' + scTypeName + ', 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning',
                    center: true
                }).then(() => {
                    this.$axios.put('/afbase/shipperConsignee/cancel/' + row.scId).then((response) => {
                        if(response.data.code == '0') {
                            this.openSuccess("作废成功！")
                            this.queryList();
                        } else {
                            this.openError("作废失败：" + response.data.data.messageInfo)
                        }
                    }).catch((error) => {
                        this.openError("作废失败：" + error.response.data.messageInfo)
                    });
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消作废'
                    });
                });

            },
            queryList() {

                this.loading = true
                this.$axios.get2('/afbase/shipperConsignee?size=' + this.pageConf.pageSize + '&current=' + this.pageConf.pageCode, this.query).then((response) => {
                    this.data = response.data.data.records;
                    this.pageConf.totalPage = response.data.data.total;
                    if(this.data.length == 0) {
                        let current = Math.ceil(this.pageConf.totalPage / this.pageConf.pageSize);
                        this.queryList2(current);
                    } else {
                        this.loading = false
                    }
                }).catch((error) => {
                    this.loading = false
                    console.log(error);
                });
            },
            queryList2(current) {
                this.$axios.get2('/afbase/shipperConsignee?size=' + this.pageConf.pageSize + '&current=' + current, this.query).then((response) => {
                    this.data = response.data.data.records;
                    this.pageConf.totalPage = response.data.data.total;
                    this.loading = false
                }).catch(function(error) {
                    this.loading = false
                    console.log(error);
                });
            },
            //pageSize改变时触发的函数
            handleSizeChange() {
                this.queryList();
            },
            //当前页改变时触发的函数
            handleCurrentChange() {
                this.queryList();
            },
            scTypeFormat(row, column) {
                if(row.scType == '1') {
                    return "收货人"
                } else if(row.scType == '0') {
                    return "发货人"
                } else {
                    return ""
                }
            }

        }
    }
</script>
