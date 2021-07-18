<template>
    <div>
        <el-row :gutter="10" >
            <el-col :xs="24" :sm="8" :md="8" :lg="8" :xl="8"  class="btn-group">
                <slot name="headerAction" :selectRows="selectRows"></slot>
            </el-col>
            <el-col :xs="24" :sm="16" :md="16" :lg="16" :xl="16" class="table-tools">
                <el-row type="flex" justify="end">
                    <el-input size="small" placeholder="请输入内容" v-model="keywords" @change="search" clearable></el-input>
                    <el-button type="default" size="small" title="刷新" @click="refresh"><i class="fa fa-refresh"></i></el-button>
                    <el-button type="default" size="small" title="筛选" @click="filter_show = true"><i class="fa fa-filter"></i></el-button>

                    <!--<el-button type="default" size="small" title="日历"><i class="fa fa-calendar"></i></el-button>
                    <el-button type="default" size="small" title="透视" @click="pivot"><i class="fa fa-table"></i></el-button>
                    <el-button type="default" size="small" title="图表"><i class="fa fa-bar-chart"></i></el-button>
                    <el-button type="default" size="small" title="看板"><i class="fa fa-th-large"></i></el-button>-->

                    <el-dropdown trigger="click" >
                        <el-button type="default" size="small" title="列">
                            <i class="fa fa-th"></i>
                        </el-button>
                        <el-dropdown-menu slot="dropdown" >
                            <el-checkbox-group v-model="checkList" class="dropdown-content" @change="fieldChange">
                                <template v-for="(item,index) in columns">
                                    <el-checkbox :key="index"  :label="item.label" >
                                        <span v-html="item.label"></span>
                                    </el-checkbox>
                                </template>
                            </el-checkbox-group>
                        </el-dropdown-menu>
                    </el-dropdown>

                    <el-button type="default" size="small"  title="导入" @click="importModal = true"><i class="fa fa-cloud-upload"></i></el-button>

                    <el-dropdown trigger="click" @command="downloadExport">
                        <el-button type="default" size="small" title="导出">
                            <i class="fa fa-sign-out"></i>
                        </el-button>
                        <el-dropdown-menu slot="dropdown">
                            <el-dropdown-item command="xlsx">XLSX工作表</el-dropdown-item>
                            <el-dropdown-item command="csv">CSV文档</el-dropdown-item>
                            <el-dropdown-item command="txt">TXT文本文档</el-dropdown-item>
                            <el-dropdown-item command="xml">XML文档</el-dropdown-item>
                        </el-dropdown-menu>
                    </el-dropdown>

                </el-row>


            </el-col>
        </el-row>

        <el-table
                :data="tableData"
                border
                style="width: 100%"
                size="small"
                @sort-change="sort"
                v-loading="loading"
                :stripe="true"
                :height="height"
                @select="currentSelect"
                @selection-change="getSelectRows"
        >
            <!-- 行选择 -->
            <el-table-column fixed type="selection" :selectable="selectable" width="50" v-if="checkbox"></el-table-column>

            <!-- 列头及列表展示 -->
            <template v-for="(item,index) in columns">
                <el-table-column v-if="item.show"
                                 :prop="item.prop"
                                 :label="item.label"
                                 :sortable="item.sortable"
                                 :fixed= "item.fixed"
                                 :width="item.width"
                                 :key="index"
                >
                    <!-- 列头自定义 -->
                    <template slot="header">
                        <el-tooltip v-if="item.tooltip" placement="bottom" effect="light">
                            <i class="el-icon-question"></i>
                            <div slot="content" >
                                <span v-html="item.tooltip"></span>
                            </div>
                        </el-tooltip>
                        <span class="header-label">{{ item.label }}</span>
                        <!--<div><el-input
                                v-model="filterForm[item.prop]"
                                size="mini"
                                placeholder="输入关键字搜索"/>
                        </div>-->
                    </template>

                    <!-- 格式化列表内容显示 -->
                    <template slot-scope="scope">
                        <slot name="formatRow" :row="scope.row" :field="item.prop" :type="item.data_type" :options="item.options">
                            <span  v-html="formatter(scope.row,item.prop,item.data_type,item.options)"></span>
                        </slot>
                    </template>

                </el-table-column>
            </template>

            <!-- 行操作 -->
            <el-table-column fixed="right" label="操作" :width="operateWidth" v-if="operateWidth">
                <template slot-scope="scope" >
                    <slot name="rowAction" :row="scope.row" :index="scope.$index"></slot>
                </template>
            </el-table-column>

            <!-- 行展开 -->
            <el-table-column type="expand" fixed="left" v-if="expand">
                <template slot-scope="props">
                  <el-table border :data="props.row.expandData.tableList" size="small" :stripe="true" >
                    <template v-for="(item,index) in props.row.expandData.tableFields">
                      <el-table-column :prop="item.prop" :label="item.label" :width="item.width" :key="index">
                          <!-- 表格行自定义 -->
                          <template slot-scope="expandScope">
                            <slot name="formatRow" :row="expandScope.row" :field="item.prop" :type="item.data_type" :options="item.options">
                                <span  v-html="formatter(expandScope.row,item.prop,item.data_type,item.options)"></span>
                            </slot>
                          </template>
                      </el-table-column>
                    </template>
                  </el-table>
                </template>
            </el-table-column>

        </el-table>

        <div class="pagination">
            <el-pagination
                    @size-change="handleSizeChange"
                    @current-change="handleCurrentChange"
                    :current-page="currentPage"
                    :page-sizes="[5, 20, 30, 40,50,100,200,300,500,1000]"
                    :page-size="pageSize"
                    :layout="pageLayout"
                    :pager-count="5"
                    :total="total">
            </el-pagination>
        </div>

        <!-- 下载数据 -->
        <el-dialog
                title="正在下载数据，请稍后..."
                :visible.sync="downloadTips"
                width="30%"
                :close-on-click-modal="false"
                :close-on-press-escape="false"
                :show-close="false"
                class="download-tips-dlg"
        >
            <span class="el-tag--danger">{{downloadError}}</span>
            <el-progress :text-inside="true" :stroke-width="18" :percentage="percentage"></el-progress>
        </el-dialog>

        <!-- 导入数据 -->
        <el-dialog :visible.sync="importModal" title="导入" class="import-dlg" >
            <el-row  type="flex" justify="space-between">
                <el-col :span="12">
                    <form id="import_data_form">
                      <input type="file" ref="importExcelForm" class="file-form" @change="importExcel"  accept=".xlsx, .xls">
                      <el-button  type="primary" @click="triggerUpload" size="small">选择文件</el-button>
                    </form>
                </el-col>

                <el-col :span="12" class="download_tpl_btn">
                    <el-button  type="success"  @click="downloadTemplate" size="small" >下载模板</el-button>
                </el-col>
            </el-row>
            
            <el-row>
                <el-col v-if=" import_file_name != '' ">
                    <div>当前选择文件:  {{ import_file_name }}</div>
                    <div v-html="parse_data_tips"></div>
                    <div v-if=" import_file_error != '' ">
                        <div class="error_tips" v-html="import_file_error"></div>
                    </div>
                </el-col>
                <el-col class="upload-progress">
                    <el-progress  :text-inside="true"  status="success"  :stroke-width="18" :percentage="importExcelPercentage"></el-progress>
                </el-col>
            </el-row>

            <template slot="footer">
                <el-button type="default" size="small"  @click="importModal = false">取消</el-button>
                <el-button type="primary" size="small"  @click="startImportData" :disabled=" is_import_disabled ">开始</el-button>
            </template>
        </el-dialog>

        <!-- 筛选对话框 -->
        <el-dialog :visible.sync="filter_show" title="筛选" >
            <el-form :inline="true" :model="filterForm"  ref="filterForm"  class="filter-form-inline " size="small">
                <div class="filter-form-content">
                    <template v-for="(item,index) in columns" >
                        <el-col :key="index" :xs="24" :sm="12" :md="12" :lg="8" :xl="6"  v-if="item.filter">
                            <el-form-item :label="item.label"  :prop="item.prop">
                                <el-input v-model="filterForm[item.prop]" :placeholder="'请输入' + item.label" v-if=" item.data_type == 'string' "></el-input>
                                <el-select  v-model="filterForm[item.prop]" filterable  placeholder="请选择" v-if=" item.data_type == 'select' ">
                                    <el-option
                                            v-for="(option_item,option_index) in item.options"
                                            :key="option_index"
                                            :label="option_item"
                                            :value="option_index">
                                    </el-option>
                                </el-select>

                                <el-date-picker
                                        v-if=" item.data_type == 'date' "
                                        v-model="filterForm[item.prop]"
                                        type="daterange"
                                        value-format="yyyy-MM-dd HH:mm:ss"
                                >
                                </el-date-picker>

                                <el-date-picker
                                        v-if=" item.data_type == 'datetime' "
                                        v-model="filterForm[item.prop]"
                                        type="datetimerange"
                                        value-format="yyyy-MM-dd HH:mm:ss"
                                >
                                </el-date-picker>

                            </el-form-item>

                        </el-col>
                    </template>
                </div>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button size="mini" type="default" @click="restFilter">重置</el-button>
                <el-button type="primary" size="mini" @click="filter">确定</el-button>
            </div>
        </el-dialog>

    </div>

</template>

<script>
import Vue from "vue";
import axios from "axios";
import loadDataEvent from "./event/loadData.js";
import uploadEvent from "./event/uploadData.js";
import downloadEvent from "./event/download.js";

//如果elementUI页面使用CDN外链接引入的话，则注释这段
import "font-awesome/css/font-awesome.min.css";
import ElementUI from "element-ui";
import "element-ui/lib/theme-chalk/index.css";
Vue.use(ElementUI);

export default {
  name: "vc-table",
  props: [
    "tableName",
    "importServer",
    "selectable",
    "checkbox",
    "server",
    "page",
    "limit",
    "height",
    "operateWidth",
    "expand"
  ], //头部按钮
  mixins: [
    loadDataEvent, //加载数据相关事件
    uploadEvent, //导入数据相关事件
    downloadEvent //导出数据相关事件
  ],
  data() {
    return {
      //数据导入相关
      parse_data_tips: '', //解析数据时提示
      is_import_disabled: true, //开始按钮是否禁用
      import_file_name: "", //当前导入文件名
      import_file_error: "", //导入异常提示语句
      importModal: false, //是否显示导入对话框
      importExcelData: [], //导入的文件内容
      importExcelPercentage: 0, //导入进度百分比
      importCurrentPage: 0, //导入当前进度页

      //筛选表单
      filterForm: {},
      filter_show: false, //筛选表单显示
      keywords: "",
      keywords_field: [], //可模糊搜索字段

      checkList: [], //列显示

      //分页设置
      pageLayout: "total, sizes, prev, pager, next, jumper",
      currentPage: 1,
      pageSize: 50,

      //导出设置
      exportData: [], //导出的数据
      exportFileType: "xlsx", //导出的文件类型
      totalPages: 1, //总页数
      downloadTips: false, //下载进度提示框的显示与隐藏
      percentage: 0, //下载进度
      downloadError: "", //下载错误提示
      loading: false,
      downloadCurrentPage: 0,

      tableData: [],
      total: 0,
      orderField: "",
      orderSort: "desc",
      columns: [],
      selectRows: [], //已选择行数据
      currentSelectRow: {} //当前选择行数据
    };
  },
  mounted() {
    let that = this;
    that.pageSize = that.limit;
    that.loadTableField(); //加载列表表头字段
    that.refresh();

    //列表响应式显示处理
    that.resizeWin();
    window.onresize = () => {
      that.resizeWin();
    };
  },
  methods: {
    //POST请求数据
    post: function(url, data) {
      return axios.post(url, data);
    },
    //GET请求数据
    get: function(url) {
      return axios.get(url);
    },
    //当前选择行数据
    currentSelect: function(selection, row) {
      this.currentSelectRow = row;
    },
    //获取选择的行数据
    getSelectRows: function(selection) {
      this.selectRows = selection;
    },
    //重置筛选
    restFilter: function() {
      this.$refs["filterForm"].resetFields();
    },
    //筛选
    filter: function() {
      this.filter_show = false;
      this.refresh();
    },

    //搜索
    search: function() {
      this.refresh();
    },

    //刷新
    refresh: function() {
      this.loading = true;
      this.pullData(this.currentPage, this.getList);
    },
    //改变窗口大小
    resizeWin: function() {
      //如果页数不够page-count，sizes 将不会显示
      if (document.body.offsetWidth < 768) {
        this.pageLayout = "prev, pager, next";
        this.label_width = "30%";
      } else {
        this.pageLayout = "total, sizes, prev, pager, next, jumper";
        this.label_width = "20%";
      }

      this.filter_form_width = document.body.offsetWidth * 0.8;
    },
    //列的显示与隐藏
    fieldChange(check_val) {
      this.columns.forEach(function(item) {
        if (
          check_val == "" ||
          check_val == null ||
          check_val.length == 0 ||
          check_val == undefined
        ) {
          item.show = false;
        } else {
          if (check_val.indexOf(item.label) != -1) {
            item.show = true;
          } else {
            item.show = false;
          }
        }
      });
    },
    //列排序
    sort(column) {
      this.orderField = column.prop;
      this.orderSort = column.order == "descending" ? "desc" : "asc";
      this.refresh();
    }
  }
};
</script>

<style scoped="true">
.el-col {
  margin-bottom: 10px;
}
.filter-form-inline .el-col {
  margin-bottom: 0;
}
.el-form-item--small.el-form-item {
  margin-bottom: 10px;
}
.pagination {
  margin: 10px auto;
  text-align: center;
}
.table-tools {
  text-align: right;
}
.btn-group {
  text-align: left;
}
.dropdown-content {
  max-height: 260px;
  padding: 10px 15px;
  overflow-y: auto;
  max-width: 500px;
  overflow-x: auto;
}
.dropdown-content .el-checkbox {
  display: block;
}

.table-tools .el-button {
  margin-left: -1px !important;
  border-radius: 0px;
  height: 32px;
  line-height: 16px;
}
.table-tools .el-button:focus {
  border-color: #b3d8ff !important;
}

.el-dropdown:last-child .el-button {
  border-top-right-radius: 4px !important;
  border-bottom-right-radius: 4px !important;
}
.el-date-editor--daterange.el-input,
.el-date-editor--daterange.el-input__inner {
  width: 100% !important;
}
.el-date-editor--datetimerange.el-input,
.el-date-editor--datetimerange.el-input__inner {
  width: 100% !important;
}
.filter-form-content {
  max-height: 460px;
  display: block;
  overflow-y: auto;
}

.el-tooltip {
  font-size: 16px;
  color: #f56c6c;
}
</style>

<style>
.header-label{ font-size: 14px; }
.table-tools .el-input__inner {
  border-top-right-radius: 0 !important;
  border-bottom-right-radius: 0 !important;
}
.el-button--small {
  font-size: 14px !important;
  padding: 8px 9px !important;
}
.el-table--small td,
.el-table--small th {
  padding: 5px 0 !important;
}
.el-form-item--small .el-form-item__content {
  width: 70% !important;
}

.el-dialog {
  margin-top: 5vh !important;
  width: 70vw !important;
}

.download-tips-dlg .el-dialog, .import-dlg .el-dialog {
  margin-top: 25vh !important;
  width: 50vw !important;
}
.download-tips-dlg .el-dialog .el-dialog__body {
  padding-top: 10px;
}

.file-form {
  display: none;
}
.upload-progress{ margin-top: 20px;}
.download_tpl_btn{ text-align:right;}

.el-table--small td.el-table__expanded-cell{
   padding: 10px !important; background-color: #EBEEF5;
}
</style>

