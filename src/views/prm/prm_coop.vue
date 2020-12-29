<template>
	<div class="warp-main">
      <el-form :inline="false" :model="query" class="orderListPage">
          <el-row>
            <el-col class="elementWidth">
              <el-form-item label-width="10px">
                <el-input v-model="query.coop_code" auto-complete="off" @input="query.coop_code=toUpperCaseValue(query.coop_code)" style="width: 160px;">
                  <template slot="prepend">代码</template>
                </el-input>
              </el-form-item>
            </el-col>
            <el-col class="elementWidth">
              <el-form-item label-width="10px">
                <el-input v-model="query.coop_name" auto-complete="off" style="width: 160px;">
                  <template slot="prepend">名称</template>
                </el-input>
              </el-form-item>
            </el-col>
            <el-col class="elementWidth">
              <el-form-item label-width="10px">
                <el-input v-model="query.transactor_user" auto-complete="off" style="width: 160px;">
                  <template slot="prepend">负责人</template>
                </el-input>
              </el-form-item>
            </el-col>
            <el-col class="elementWidth">
              <el-form-item label-width="10px">
                <el-button type="text" size="small" v-if=showFlag v-on:click="showFlag=false">收起</el-button>
                <el-button type="text" size="small" v-if=!showFlag v-on:click="showFlag=true">展开</el-button>
                <el-button type="primary" size="small" v-on:click="queryCoopList" style="margin-left: 2px;padding-left: 8px;padding-right: 8px;">查询</el-button>
                <el-button type="primary" size="small" v-on:click="showsave1" v-if="addButtonFlag" style="margin-left: 2px;padding-left: 8px;padding-right: 8px;">新增</el-button>
                <el-button type="primary" size="small" v-on:click="batchImport" v-if="importButtonFlag" style="margin-left: 2px;padding-left: 8px;padding-right: 8px;">导入</el-button>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row v-show="showFlag">
            <el-col class="elementWidth">
              <el-form-item label-width="10px">
                <el-input style="width:160px;">
                  <template slot="prepend">是否锁定</template>
                  <el-select slot="suffix" v-model="query.lock_valid" placeholder="请选择" style="width:91px;margin-right: -5px;" clearable>
                    <el-option label="是" value="1"></el-option>
                    <el-option label="否" value="0"></el-option>
                  </el-select>
                </el-input>
              </el-form-item>
            </el-col>
            <el-col class="elementWidth">
              <el-form-item label-width="10px">
                <el-input style="width:160px;">
                  <template slot="prepend">黑名单</template>
                  <el-select slot="suffix" v-model="query.black_valid" placeholder="请选择" style="width:105px;margin-right: -5px;" clearable>
                    <el-option label="是" value="1"></el-option>
                    <el-option label="否" value="0"></el-option>
                  </el-select>
                </el-input>
              </el-form-item>
            </el-col>
            <el-col class="elementWidth">
              <el-form-item label-width="10px">
                <el-input style="width:160px;">
                  <template slot="prepend">白名单</template>
                  <el-select slot="suffix" v-model="query.white_valid" placeholder="请选择" style="width:105px;margin-right: -5px;" clearable>
                    <el-option label="是" value="1"></el-option>
                    <el-option label="否" value="0"></el-option>
                  </el-select>
                </el-input>
              </el-form-item>
            </el-col>
            <el-col class="elementWidth">
              <el-form-item label-width="10px">
                <el-input style="width:170px;">
                  <template slot="prepend">信用等级</template>
                  <el-select slot="suffix" clearable v-model="query.credit_level" filterable placeholder="请选择" style="width:101px;margin-right: -5px;">
                    <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value">
                    </el-option>
                  </el-select>
                </el-input>
              </el-form-item>
            </el-col>
            <el-col class="elementWidth">
              <el-form-item label-width="39px">
                <el-button style="margin-left: -24px;padding-left: 8px;padding-right: 8px;background-color:#FFF;color:#409EFF" type="primary" size="small" v-on:click="setting">设置</el-button>
                <el-button style="margin-left: 4px;padding-left: 8px;padding-right: 8px;background-color:#FFF;color:#409EFF" type="primary" size="small" v-on:click="exportExcel" v-if="exportButtonFlag">导出</el-button>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row v-show="showFlag">
            <el-col class="elementWidth">
              <el-form-item label-width="10px">
                <el-input style="width:967px;">
                  <template slot="prepend">客商资料分类</template>
                  <el-checkbox slot="suffix" :indeterminate="isIndeterminate" v-model="checkAll" @change="handleCheckAllChange" style="float:left;margin-top: 5px;">全选</el-checkbox>
                  <el-checkbox-group slot="suffix" v-model="checkedcoop_type" @change="handleCheckedCitiesChange" style="float:left;margin-top: 5px;">
                    <el-checkbox v-for="coop_type in coop_types" :label="coop_type" :key="coop_type">{{coop_type}}</el-checkbox>
                  </el-checkbox-group>
                </el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row v-show="showFlag">
            <el-col class="elementWidth">
              <el-form-item label-width="10px">
                <el-input style="width:770px;">
                  <template slot="prepend">业务范畴</template>
                  <el-checkbox slot="suffix" :indeterminate="isIndeterminate1" v-model="checkAll1" @change="handleCheckAllChangeBusinessScope" style="float:left;margin-top: 5px;">全选</el-checkbox>
                  <el-checkbox-group slot="suffix" v-model="checkedbusiness_scope" @change="handleCheckedCitiesChangeBusinessScope" style="float:left;margin-top: 5px;">
                    <el-checkbox v-for="business_scope in business_scopes" :label="business_scope" :key="business_scope">{{business_scope}}</el-checkbox>
                  </el-checkbox-group>
                </el-input>
              </el-form-item>
            </el-col>
          </el-row>
      </el-form>

			<el-table :indent="8" :data="data1" style="width: 100%;margin-bottom: 20px;"  border max-height="450" :cell-class-name="addPullRightClass" :cell-style="addCellStayle" @header-dragend="cellWidth">
        <el-table-column fixed="left" label="操作" align="center" width="60" type="index">
          <template slot-scope="scope">
            <el-dropdown trigger="click" @command="handleCommand" @visible-change="handleChange(scope.row)">
              <i class="el-icon-s-operation"></i>
              <el-dropdown-menu slot="dropdown">
              	<el-dropdown-item></el-dropdown-item>
                <el-dropdown-item command="edit" v-if="editButtonFlag">修改</el-dropdown-item>
                <el-dropdown-item command="black" v-if="blackButtonFlag" v-show="(scope.row.whitelist_date==null || scope.row.whitelist_date=='') && (scope.row.blacklist_date==null || scope.row.blacklist_date=='')">黑名单</el-dropdown-item>
                <el-dropdown-item command="white" v-if="whiteButtonFlag" v-show="(scope.row.whitelist_date==null || scope.row.whitelist_date=='') && (scope.row.blacklist_date==null || scope.row.blacklist_date=='')">白名单</el-dropdown-item>
                <el-dropdown-item command="outblack" v-if="outblackButtonFlag" v-show="scope.row.blacklist_date!=null">移出黑名单</el-dropdown-item>
                <el-dropdown-item command="outwhite" v-if="outwhiteButtonFlag" v-show="scope.row.whitelist_date!=null">移出白名单</el-dropdown-item>
                <el-dropdown-item command="lock" v-show="scope.row.lock_date==null" v-if="lockButtonFlag">锁定</el-dropdown-item>
                <el-dropdown-item command="unlock" v-show="scope.row.lock_date!=null" v-if="unlockButtonFlag">解锁</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </template>
        </el-table-column>
        <template v-for="(item,index) in tableColumns">
          <el-table-column v-if="item.label=='客商资料代码'" :key="index" :prop="item.prop" :label="item.label" :width="item.width" :align="item.align" :sortable="item.sortable">
            <template slot-scope="scope">
              <span v-if="scope.row.blacklist_date!=null && scope.row.coop_status!='1'" style="color:red"><s><b>{{ formatter22(scope.row) }}</b></s></span><!--是黑名单无效-->
              <span v-if="scope.row.blacklist_date!=null && scope.row.coop_status=='1'" style="color:red"><s>{{ formatter22(scope.row) }}</s></span><!--是黑名单有效-->
              <span v-if="(scope.row.blacklist_date==null || scope.row.blacklist_date=='') && scope.row.coop_status=='1'">{{ formatter22(scope.row) }}</span><!--不是黑名单有效-->
              <span v-if="(scope.row.blacklist_date==null || scope.row.blacklist_date=='') && scope.row.coop_status!='1'"><s><b>{{ formatter22(scope.row) }}</b></s></span><!--不是黑名单无效-->
            </template>
          </el-table-column>
          <el-table-column v-if="item.label=='客商资料类型'" :key="index" :prop="item.prop" :label="item.label" :width="item.width" :align="item.align" :sortable="item.sortable">
            <template slot-scope="scope">
              <span v-if="scope.row.blacklist_date!=null && scope.row.coop_status!='1'" style="color:red"><s><b>{{ formatter33(scope.row) }}</b></s></span><!--是黑名单无效-->
              <span v-if="scope.row.blacklist_date!=null && scope.row.coop_status=='1'" style="color:red"><s>{{ formatter33(scope.row) }}</s></span><!--是黑名单有效-->
              <span v-if="(scope.row.blacklist_date==null || scope.row.blacklist_date=='') && scope.row.coop_status=='1'">{{ formatter33(scope.row) }}</span><!--不是黑名单有效-->
              <span v-if="(scope.row.blacklist_date==null || scope.row.blacklist_date=='') && scope.row.coop_status!='1'"><s><b>{{ formatter33(scope.row) }}</b></s></span><!--不是黑名单无效-->
            </template>
          </el-table-column>
          <el-table-column v-if="item.label=='中文全称'" :key="index" :prop="item.prop" :label="item.label" :width="item.width" :align="item.align" :sortable="item.sortable" header-align="center">
            <template slot-scope="scope">
              <span v-if="scope.row.blacklist_date!=null && scope.row.coop_status!='1'" style="color:red"><s><b>{{ formatter11(scope.row) }}</b></s></span><!--是黑名单无效-->
              <span v-if="scope.row.blacklist_date!=null && scope.row.coop_status=='1'" style="color:red"><s>{{ formatter11(scope.row) }}</s></span><!--是黑名单有效-->
              <span v-if="(scope.row.blacklist_date==null || scope.row.blacklist_date=='') && scope.row.coop_status=='1'">{{ formatter11(scope.row) }}</span><!--不是黑名单有效-->
              <span v-if="(scope.row.blacklist_date==null || scope.row.blacklist_date=='') && scope.row.coop_status!='1'"><s><b>{{ formatter11(scope.row) }}</b></s></span><!--不是黑名单无效-->
            </template>
          </el-table-column>
          <el-table-column v-if="item.label=='负责人'" :key="index" :prop="item.prop" :label="item.label" :width="item.width" :align="item.align" :sortable="item.sortable">
            <template slot-scope="scope">
              <span v-if="scope.row.blacklist_date!=null && scope.row.coop_status!='1'" style="color:red"><s><b>{{ formatter55(scope.row) }}</b></s></span><!--是黑名单无效-->
              <span v-if="scope.row.blacklist_date!=null && scope.row.coop_status=='1'" style="color:red"><s>{{ formatter55(scope.row) }}</s></span><!--是黑名单有效-->
              <span v-if="(scope.row.blacklist_date==null || scope.row.blacklist_date=='') && scope.row.coop_status=='1'">{{ formatter55(scope.row) }}</span><!--不是黑名单有效-->
              <span v-if="(scope.row.blacklist_date==null || scope.row.blacklist_date=='') && scope.row.coop_status!='1'"><s><b>{{ formatter55(scope.row) }}</b></s></span><!--不是黑名单无效-->
            </template>
          </el-table-column>
          <el-table-column v-if="item.label=='锁定状态'" :key="index" :prop="item.prop" :label="item.label" :width="item.width" :align="item.align" :sortable="item.sortable">
            <template slot-scope="scope">
              <i class="iconfont el-icon-myduihao" style="color: red;" v-show="scope.row.lock_date"></i>
            </template>
          </el-table-column>
          <el-table-column v-if="item.label=='黑名单'" :key="index" :prop="item.prop" :label="item.label" :width="item.width" :align="item.align" :sortable="item.sortable">
            <template slot-scope="scope">
              <i class="iconfont el-icon-myduihao" style="color: red;" v-show="scope.row.blacklist_date"></i>
            </template>
          </el-table-column>
          <el-table-column v-if="item.label=='白名单'" :key="index" :prop="item.prop" :label="item.label" :width="item.width" :align="item.align" :sortable="item.sortable">
            <template slot-scope="scope">
              <i class="iconfont el-icon-myduihao" style="color: red;" v-show="scope.row.whitelist_date"></i>
            </template>
          </el-table-column>
          <el-table-column v-if="item.label=='业务范畴'" :key="index" :prop="item.prop" :label="item.label" :width="item.width" :align="item.align" :sortable="item.sortable">
          </el-table-column>
        </template>
			</el-table>
      <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="pageConf.pageCode" :page-sizes="pageConf.pageOption" :page-size.sync="pageConf.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="pageConf.totalPage">
      </el-pagination>
		<coop-save1 ref="addMission" v-if="save1Visible" :visible.sync="save1Visible"></coop-save1>
		<coop-save2 ref="addMission" v-if="save2Visible" :visible.sync="save2Visible" :frow="frow"></coop-save2>
		<coop-edit ref="addMission" v-if="editVisible" :visible.sync="editVisible" :frow="frow"></coop-edit>
		<coop-editsup ref="addMission" v-if="editsupVisible" :visible.sync="editsupVisible" :frow="frow"></coop-editsup>
		<black ref="addMission" v-if="blackVisible" :visible.sync="blackVisible" :frow="frow"></black>
		<white ref="addMission" v-if="whiteVisible" :visible.sync="whiteVisible" :frow="frow"></white>
		<lock ref="addMission" v-if="lockVisible" :visible.sync="lockVisible" :frow="frow"></lock>
		<unlock ref="addMission" v-if="unlockVisible" :visible.sync="unlockVisible" :frow="frow"></unlock>
		<savesup ref="addMission" v-if="savesupVisible" :visible.sync="savesupVisible" :frow="frow"></savesup>
		<move ref="addMission" v-if="moveVisible" :visible.sync="moveVisible" :frow="frow"></move>
    <outblack ref="addMission" v-if="outblackVisible" :visible.sync="outblackVisible" :frow="frow"></outblack>
    <outwhite ref="addMission" v-if="outwhiteVisible" :visible.sync="outwhiteVisible" :frow="frow"></outwhite>
    <batchImport ref="addMission" v-if="batchImportVisible" :visible.sync="batchImportVisible"></batchImport>
    <setVisibleTag ref="addMission" v-if="setVisible" :visible.sync="setVisible"></setVisibleTag>

	</div>
</template>
<script>
	// import API from '../../api/api_enterprise'
	import NewCoop from './coop/prm_coop_save'
	import NewCoopChild from './coop/prm_coop_save2'
	import EditCoop from './coop/prm_coop_edit'
	import EditCoopSup from './coop/prm_coop_editsup'
	import Black from './coop/prm_coop_black'
	import White from './coop/prm_coop_white'
	import Lock from './coop/prm_coop_lock'
	import UnLock from './coop/prm_coop_unlock'
	import SaveSup from './coop/prm_coop_savesup'
	import Move from './coop/prm_coop_move'
  import OutBlack from './coop/prm_coop_outblack'
  import OutWhite from './coop/prm_coop_outwhite'
  import BatchImport from './coop/prm_coop_import'
  import columns from './coop/prm_coop_column.json'
  import setVisibleVue from './coop/prm_coop_setting'
	const cooptypes = [
		'外部客户',
		'互为代理',
	/*	'海外代理',*/
		'干线承运人',
		'延伸服务供应商',
		'业务类结算对象',
		'非业务结算对象'
	];
  const businessScopes = [
      'EF',
      'AE',
      'AI',
      'SE',
      'SI',
      'TE',
      'TI',
      'LC',
      'IO',
  ];
  const businessScopes1 = [
      'AE',
      'AI',
      'SE',
      'SI',
      'TE',
      'TI',
      'LC',
      'IO',
  ];
	export default {
		data() {
			return {
				loading: false,
				showFlag: false,
        exportButtonFlag: false,
        addButtonFlag: false,
        editButtonFlag: false,
        blackButtonFlag: false,
        whiteButtonFlag: false,
        lockButtonFlag: false,
        unlockButtonFlag: false,
        moveButtonFlag: false,
        upButtonFlag: false,
        underButtonFlag: false,
        outblackButtonFlag: false,
        outwhiteButtonFlag: false,
        importButtonFlag: false,
        setVisible: false,
				data1: [],
        tableColumns: [],
				pageConf: {
					//设置一些初始值(会被覆盖)
					pageCode: 1, //当前页
					pageSize: 10, //每页显示的记录数
					totalPage: 0, //总记录数
					pageOption: [10, 30, 50], //分页选项
					handleCurrentChange: function() {
						console.log("页码改变了");
					}
				},
				query: {
					coop_code: '',
					coop_mnemonic: '',
					coop_name: '',
					social_credit_code: '',
					contacts_name: '',
					credit_level: '',
					black_valid: '0',
					white_valid: '',
          lock_valid: '0',
					coop_type: '',
					org_id: '',
					dept_id: '',
          transactor_user: '',
				},
				options: [{
					value: 'A级',
					label: 'A级'
				}, {
					value: 'B级',
					label: 'B级'
				}, {
					value: 'C级',
					label: 'C级'
				}, {
					value: 'D级',
					label: 'D级'
				}, {
					value: 'E级',
					label: 'E级'
				}],
				coop_types: cooptypes,
        business_scopes: [],
				checkedcoop_type: [],
        checkedbusiness_scope: [],
				checkAll: false,
          checkAll1: false,
				isIndeterminate: false,
        isIndeterminate1: false,
				save1Visible: false,
				save2Visible: false,
				editVisible: false,
				editsupVisible: false,
				blackVisible: false,
				whiteVisible: false,
				lockVisible: false,
				unlockVisible: false,
				savesupVisible: false,
				moveVisible: false,
        outblackVisible: false,
        outwhiteVisible: false,
				useroptions: [],
				frow: {},
				currRow: '',
        batchImportVisible: false
			}
		},
		created: function() {
        let buttonInfo = window.localStorage.getItem('buttonInfo')
        if (buttonInfo.indexOf('sys_coop_export')>-1) {
            this.exportButtonFlag=true;
        }
        if (buttonInfo.indexOf('sys_coop_add')>-1) {
            this.addButtonFlag=true;
        }
        if (buttonInfo.indexOf('sys_coop_edit')>-1) {
            this.editButtonFlag=true;
        }
        if (buttonInfo.indexOf('sys_coop_black')>-1) {
            this.blackButtonFlag=true;
        }
        if (buttonInfo.indexOf('sys_coop_white')>-1) {
            this.whiteButtonFlag=true;
        }
        if (buttonInfo.indexOf('sys_coop_lock')>-1) {
            this.lockButtonFlag=true;
        }
        if (buttonInfo.indexOf('sys_coop_unlock')>-1) {
            this.unlockButtonFlag=true;
        }
        if (buttonInfo.indexOf('sys_coop_move')>-1) {
            this.moveButtonFlag=true;
        }
        if (buttonInfo.indexOf('sys_coop_add')>-1) {
            this.upButtonFlag=true;
        }
        if (buttonInfo.indexOf('sys_coop_add')>-1) {
            this.underButtonFlag=true;
        }
        if (buttonInfo.indexOf('sys_coop_outblack')>-1) {
            this.outblackButtonFlag=true;
        }
        if (buttonInfo.indexOf('sys_coop_outwhite')>-1) {
            this.outwhiteButtonFlag=true;
        }
        if (buttonInfo.indexOf('sys_coop_import')>-1) {
            this.importButtonFlag=true;
        }

        //不同签约公司显示不同的业务范畴
        let orgId = window.localStorage.getItem('orgId')
        if(orgId ==1){
            this.business_scopes = businessScopes;
        }else{
            this.business_scopes = businessScopes1;
        }


			// 组件创建完后获取数据，
			// 此时 data 已经被 observed 了
			//this.fetchData();  //调用接口获取动态数据
			// created(){
			this.queryCoopList();
			// }

			this.$axios.get('/hrs/dept/selectUser')
				.then(function(response) {
					this.useroptions = response.data.data;
				}.bind(this));

      //从数据库查询设置信息
      let pageName = '客商资料管理/客商资料';
      this.$axios.get2("/hrs/user/getUserPageSet?pageName=" + pageName)
          .then(function(response) {
              let prm_coop_list_column = response.data.data;
              if(prm_coop_list_column && prm_coop_list_column.length>0){
                  this.tableColumns = this.sortBykey(prm_coop_list_column, 'index');
              }else{
                  this.tableColumns = this.sortBykey(columns.info, 'index');
              }
          }.bind(this));
		},
		provide() {
			return {
				continueOperation: this.continueOperation,
				queryCoopList: this.queryCoopList,
          load: this.load
			}


		},
		components: {
			'coop-save1': NewCoop,
			'coop-save2': NewCoopChild,
			'coop-edit': EditCoop,
			'coop-editsup': EditCoopSup,
			'black': Black,
			'white': White,
			'lock': Lock,
			'unlock': UnLock,
			'savesup': SaveSup,
			'move': Move,
      'outblack': OutBlack,
      'outwhite': OutWhite,
      'batchImport': BatchImport,
      'setVisibleTag': setVisibleVue,
		},
		methods: {
      setting() {
          this.setVisible = true;
      },
      cellWidth(newWidth, oldWidth, column, event) {
          let strColumn = JSON.stringify(this.tableColumns);
          let userId = window.localStorage.getItem('userId');
          let arrayC = JSON.parse(strColumn);
          if (arrayC && arrayC.length > 0) {
              arrayC.forEach(function(item, index) {
                  if (column.label == item.label) {
                      item.width = newWidth;
                  }
              });
              arrayC = this.sortBykey(arrayC, 'index');
              localStorage.setItem(userId + '_prm_coop_list_column_width', JSON.stringify(arrayC))
          }
      },
      //标题样式
      addPullRightClass({
                            row,
                            column,
                            rowIndex,
                            columnIndex
                        }) {

      },
      //标题 stly
      addCellStayle(data) {
          return "";
      },
      sortBykey(ary, key) {
          return ary.sort(function(a, b) {
              let x = a[key]
              let y = b[key]
              return ((x < y) ? -1 : (x > y) ? 1 : 0)
          })
      },
      toUpperCaseValue(val) {
          return val.toUpperCase();
      },
      formatter11(row, column) {
          return row.coop_name;
      },
      formatter22(row, column) {
          return row.coop_code;
      },
      formatter33(row, column) {
          return row.coop_type;
      },
      formatter44(row, column) {
          return row.coop_mnemonic;
      },
      formatter55(row, column) {
          return row.transactor_user;
      },
			handleCommand(command) {
				if(command == 'edit') {
					this.showedit(this.currRow)
				} else if(command == 'black') {
					this.showblack(this.currRow)
				} else if(command == 'white') {
					this.showwhite(this.currRow)
				} else if(command == 'lock') {
					this.lock(this.currRow)
				} else if(command == 'unlock') {
					this.unlock(this.currRow)
				} else if(command == 'move') {
					this.move(this.currRow)
				} else if(command == 'up') {
					this.savesup(this.currRow)
				} else if(command == 'under') {
					this.showsave2(this.currRow)
				} else if(command == 'outblack') {
          this.showoutblack(this.currRow)
        } else if(command == 'outwhite') {
          this.showoutwhite(this.currRow)
        }
			},
			handleChange(command) {
				this.currRow = command
			},
			// 添加弹窗
			showsave1() {
				this.save1Visible = true;
			},
      batchImport() {
          this.batchImportVisible = true;
      },
			showsave2(row) {
				this.frow = row;
				this.save2Visible = true;
			},
			showedit(row) {
				this.frow = row;
				if(row.group_type == "group")
					this.editsupVisible = true;
				else
					this.editVisible = true;
			},
			showwhite(row) {
				this.frow = row;
				this.whiteVisible = true;
			},
			showblack(row) {
				this.frow = row;
				this.blackVisible = true;
			},
      showoutblack(row) {
        this.frow = row;
        this.outblackVisible = true;
      },
      showoutwhite(row) {
        this.frow = row;
        this.outwhiteVisible = true;
      },
			lock(row) {
				this.frow = row;
				this.lockVisible = true;
			},
			unlock(row) {
				this.frow = row;
				this.unlockVisible = true;
			},
			savesup(row) {
				this.frow = row;
				this.savesupVisible = true;
			},
			move(row) {
				this.frow = row;
				this.moveVisible = true;
			},
			// 关闭所有弹窗
			cancelVisible() {
				this.save1Visible = false;
				this.save2Visible = false;
				this.editVisible = false;
				this.editsupVisible = false;
				this.blackVisible = false;
				this.whiteVisible = false;
				this.lockVisible = false;
				this.unlockVisible = false;
				this.savesupVisible = false;
				this.moveVisible = false;
        this.outblackVisible = false;
        this.outwhiteVisible = false;
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
			queryCoopList() {

        //从数据库查询设置信息
        let pageName = '客商资料管理/客商资料';
        this.$axios.get2("/hrs/user/getUserPageSet?pageName=" + pageName)
            .then(function(response) {
                let prm_coop_list_column = response.data.data;
                if(prm_coop_list_column && prm_coop_list_column.length>0){
                    this.tableColumns = this.sortBykey(prm_coop_list_column, 'index');
                }else{
                    this.tableColumns = this.sortBykey(columns.info, 'index');
                }
                let params = {
                    'currentPage': this.pageConf.pageCode,
                    'pageSize': this.pageConf.pageSize,
                    coop_code: this.query.coop_code,
                    coop_name: this.query.coop_name,
                    credit_level: this.query.credit_level,
                    white_valid: this.query.white_valid,
                    black_valid: this.query.black_valid,
                    lock_valid: this.query.lock_valid,
                    coop_type: this.checkedcoop_type.toString(),
                    business_scope: this.checkedbusiness_scope.toString(),
                    transactor_user: this.query.transactor_user,
                }
                this.$axios.post('/prm/coop/queryCoopListByPage', params).then((response) => {
                    this.data1 = response.data.data.dataList;
                    this.pageConf.totalPage = response.data.data.totalNum;
                }).catch(err => {})
            }.bind(this));

/*				let params = {
					'currentPage': this.pageConf.pageCode,
					'pageSize': this.pageConf.pageSize,
					coop_code: this.query.coop_code,
					coop_name: this.query.coop_name,
					credit_level: this.query.credit_level,
					white_valid: this.query.white_valid,
					black_valid: this.query.black_valid,
					lock_valid: this.query.lock_valid,
					coop_type: this.checkedcoop_type.toString(),
          business_scope: this.checkedbusiness_scope.toString(),
          transactor_user: this.query.transactor_user,
				}
				this.$axios.post('/prm/coop/queryCoopListByPage', params).then((response) => {
					//this.data1 = response.data.data;
            this.data1 = response.data.data.dataList;
					this.pageConf.totalPage = response.data.data.totalNum;
				}).catch(err => {})*/
			},
			//pageSize改变时触发的函数
			handleSizeChange() {
				this.queryCoopList();
			},
			//当前页改变时触发的函数
			handleCurrentChange(val) {
				this.queryCoopList();
			},
			load(tree, treeNode, resolve) {
				// console.log(tree);
        //this.loading = true;
				let params = {
					currentPage: 1,
					pageSize: 100,
					coop_code: tree.coop_code
				}
				this.$axios.post('/prm/coop/queryCoopChildList',
						params)
					.then(function(response) {
						// this.loading = false;
						let datachild = response.data.data.dataList;
						// this.pageConf.totalPage=response.data.data.totalNum;
						if(datachild.length > 0) {
							setTimeout(() => {
								resolve(datachild)
							}, 100)
						} else {
              setTimeout(() => {
                  resolve([])//不设置成空，一直转圈
              }, 100),
							this.$message({
								message: '该客商资料没有子公司',
								type: 'warning',
								duration: 1000
							});
						}
					}.bind(this));

			},
			queryListForChoose() {
				let params = {
					currentPage: '1',
					pageSize: '1000'
				}
				this.$axios.post('/prm/coop/queryListForChoose',
						params)
					.then(function(response) {
						console.log(response);
						// this.data1=response.data.data.dataList;
						// this.pageConf.totalPage=response.data.data.totalNum;
					}.bind(this));
			},
			goSaveCoop() {
				this.$router.push({
					path: '/prm/prm_coop_save'
				});
			},
			modify(row) {
				// console.log(row);
				let coop_code = row.coop_code;
				// console.log(coop_code);
				this.$router.push({
					path: '/prm/prm_coop_modify',
					query: {
						coop_code: coop_code
					}
				});

			},
			format_coop_status(row, column) {
				return row.coop_status == '1' ? "生效" : row.coop_status == '0' ? "失效" : "";
			},
			format_blackwhite_valid(row, column) {
				return row.blackwhite_valid == '1' ? "白名单" : row.blackwhite_valid == '0' ? "黑名单" : "";
			},
			handleCheckAllChange(val) {
				this.checkedcoop_type = val ? cooptypes : [];
				this.isIndeterminate = false;
			},
      handleCheckAllChangeBusinessScope(val) {
          let orgId = window.localStorage.getItem('orgId')
          if(orgId ==1){
              this.checkedbusiness_scope = val ? businessScopes : [];
              this.isIndeterminate1 = false;
          }else{
              this.checkedbusiness_scope = val ? businessScopes1 : [];
              this.isIndeterminate1 = false;
          }

      },
			handleCheckedCitiesChange(value) {
				let checkedCount = value.length;
				this.checkAll = checkedCount === this.coop_types.length;
				this.isIndeterminate = checkedCount > 0 && checkedCount < this.coop_types.length;
			},
      handleCheckedCitiesChangeBusinessScope(value) {
          let checkedCount = value.length;
          this.checkAll1 = checkedCount === this.business_scopes.length;
          this.isIndeterminate1 = checkedCount > 0 && checkedCount < this.business_scopes.length;
      },
			login() {
				let params = {
					username: '0|test|001',
					password: '123456',
					grant_type: 'password',
					client_id: 'efreight',
					client_secret: 'efreight'
				};
				let Base64 = require('js-base64').Base64;
				let authori = Base64.encode('efreight:efreight');
				this.$axios.post(
						'/auth',
						params, {
							headers: {
								isToken: false,
								Authorization: 'Basic ' + authori
							}

						})
					.then(function(response) {
						consol(response);
						// this.data1=response.data.data.dataList;
						// this.pageConf.totalPage=response.data.data.totalNum;
					}.bind(this));
			},
			exportExcel() {
          this.$confirm('是否根据结果字段导出数据？', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning',
              center: true
          }).then(() => {
              this.query.columnStrs = JSON.stringify(this.tableColumns)
              this.exportExcelSure()
          }).catch(() => {
              this.query.columnStrs = '';
              this.exportExcelSure();
          });

			},
      exportExcelSure() {
          if(this.data1.length == 0){
              this.openError("查询结果没有数据，不允许导出");
              return;
          }
          let params = {
              "coop_code": this.query.coop_code,
              "coop_name": this.query.coop_name,
              "credit_level": this.query.credit_level,
              "black_valid": this.query.black_valid,
              "white_valid": this.query.white_valid,
              "lock_valid": this.query.lock_valid,
              "coop_type": this.checkedcoop_type.toString(),
              "business_scope": this.checkedbusiness_scope.toString(),
              "transactor_user": this.query.transactor_user,
              "columnStrs": this.query.columnStrs,
          }
          this.$axios.post3('/prm/coop/exportExcel', params)
              .then(function(response) {
                  var blob = new Blob([response.data], {
                      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8'
                  });
                  var downloadElement = document.createElement('a');
                  var href = window.URL.createObjectURL(blob); // 创建下载的链接
                  downloadElement.href = href;
                  downloadElement.download = '客商资料列表' + '.xls'; // 下载后文件名
                  document.body.appendChild(downloadElement);
                  downloadElement.click(); // 点击下载
                  document.body.removeChild(downloadElement); // 下载完成移除元素
                  window.URL.revokeObjectURL(href); // 释放掉blob对象
              }.bind(this));
      },
			continueOperation(coopId) {
				this.$confirm('是否继续录入 客商资料 地址、业务范畴 等内容 ？', '提示', {
					confirmButtonText: '是',
					cancelButtonText: '否',
					type: 'warning',
					center: true
				}).then(() => {
					this.frow = {coop_id:coopId,continue:true}
					this.editVisible = true;

				}).catch(() => {
					this.$message({
						type: 'info',
						message: '已取消'
					});
				});
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

  .orderListPage .el-input-group__prepend {
    padding: 0 6px;
  }

</style>
