<template>
  <div class="warp-main">
    <el-row v-loading="loading" element-loading-text="拼命加载中">
      <el-col class="toolbar" style="padding-bottom: 0;">
        <el-form :inline="false" :model="query" class="demo-ruleForm">
          <el-row>
            <el-col class="elementWidth">
              <el-form-item label="模板名称" label-width="85px">
                <el-input v-model="query.orgName" auto-complete="off" placeholder="" clearable style="width: 160px;">
                </el-input>
              </el-form-item>
            </el-col>
            <el-col class="elementWidth">
              <el-form-item label="是否启用" label-width="105px">
                <el-select v-model="query.orgStatus" clearable placeholder="请选择" style="width: 115px;">
                  <el-option label="是" value="1"></el-option>
                  <el-option label="否" value="0"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col class="elementWidth">
              <el-form-item style="margin-left: 41px;">
                <el-button type="primary" size="small" v-on:click="findByPage">查询</el-button>
                <el-button type="primary" size="small" v-on:click="showsave">新增</el-button>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </el-col>
      <el-table :data="data" border>
        <el-table-column prop="orgName" width="150" label="模板名称" align="center"></el-table-column>
        <el-table-column prop="orgUserCount" width="90" label="用户数量" align="center"></el-table-column>
        <el-table-column prop="orgStatus" width="90" label="是否启用" align="center">
          <template slot-scope="scope">
            <i class="iconfont el-icon-myduihao" style="color: red;" v-show="scope.row.orgStatus"></i>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="60" align="center" fixed="left">
          <template slot-scope="scope">
            <el-dropdown trigger="click" @command="handleCommand" @visible-change="handleChange(scope.row)">
              <i class="el-icon-s-operation"></i>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item></el-dropdown-item>
                <el-dropdown-item command="edit" >编辑</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </template>
        </el-table-column>
        <el-table-column></el-table-column>
      </el-table>
    </el-row>
    <save ref="addMission" v-if="save" :visible.sync="save"></save>
    <edit ref="addMission" v-if="edit" :visible.sync="edit" :frow="frow"></edit>
  </div>
</template>
<script>
    import save from './org/hrs_signtemplate_save'
    import edit from './org/hrs_signtemplate_edit'
    export default {
        data() {

            return {
                /*表数据*/
                data: [],
                loading: false,
                query: {
                    orgStatus: '1',
                    orgName: '',
                },
                save: false,
                edit: false,
                frow: {},
                showFlag: false,
                currRow: '',
                addButtonFlag: false,
                editButtonFlag: false,
            }
        },
        components: {
            'save': save,
            'edit': edit,
        },
        provide() {
            return {
                findByPage: this.findByPage
            }
        },
        methods: {
            handleCommand(command) {
                if(command == 'edit') {
                    this.showedit(this.currRow)
                }
            },
            handleChange(command) {
                this.currRow = command
            },
            showsave() {
                this.save = true;
            },
            showedit(row) {
                this.frow = row;
                this.edit = true;
            },
            findByPage() {
                let param = {
                    "orgStatus": this.query.orgStatus,
                    "orgName": this.query.orgName
                };
                this.$axios.get2('/hrs/org/getSignTemplate', param).then(function(response) {
                    if(response.data.code == 0) {
                        this.data = response.data.data;
                        //this.pageConf.totalPage = response.data.data.total;
                    } else {
                        this.openError(response.data.messageInfo);
                    }
                }.bind(this)).catch(function(error) {
                    this.openError(error.response.data.message);
                }.bind(this));
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
        created() {
            let buttonInfo = window.localStorage.getItem('buttonInfo')
            if (buttonInfo.indexOf('sys_version_add')>-1) {
                this.addButtonFlag=true;
            }
            if (buttonInfo.indexOf('sys_version_edit')>-1) {
                this.editButtonFlag=true;
            }
            if (buttonInfo.indexOf('sys_version_record')>-1) {
                this.recordButtonFlag=true;
            }
            if (buttonInfo.indexOf('sys_version_del')>-1) {
                this.deleteButtonFlag=true;
            }
            this.findByPage();
        }
    }
</script>
<style>

</style>
