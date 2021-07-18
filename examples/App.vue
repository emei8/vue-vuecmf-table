<template>
  <div id="app">
    <h2>vue-vuecmf-table demo</h2>
    <vc-table
            table-name="账单导入日志"
            :selectable="selectable"
            :checkbox="true"
            ref="vcTable"
            server="http://www.billsystem.com/api/Table/index"
            page="page"
            :limit="20"
            :operate-width="100"
            import-server="http://www.billsystem.com/api/Table/importData"
            :expand="true"
    >
      <!-- 表格头部左边 自定义按钮操作 -->
      <template #headerAction="selectRows">
          <el-button size="mini" type="primary" @click.native.prevent="add(selectRows)" >添加</el-button>
      </template>

      <!-- 列表每行 自定义按钮操作 -->
      <template #rowAction="{ row, index}">
          <span v-if=" row.site != '' ">
              有站点
          </span>
          <el-button v-else size="mini" type="success" @click.native.prevent="test(row)">test {{ index }}</el-button>
      </template>

      <!-- 每行中的每个字段内容 自定义格式化内容显示： 可获取参数有 { row, field, type, options } -->
      <template #formatRow="{ row, field }">
          <span v-if=" field == 'child_account_name' ">
              <el-input v-model="row[field]" size="small" clearable></el-input>
          </span>
      </template>

    </vc-table>

  </div>
</template>

<script>
import Vue from "vue";
import ElementUI from "element-ui";
import "element-ui/lib/theme-chalk/index.css";
import ElButton from "../node_modules/element-ui/packages/button/src/button.vue";
import vcTable from "../packages";

Vue.use(ElementUI).use(vcTable);

export default {
  components: { ElButton },
  name: "app",
  data() {
    return {
      selectable: function(row, index) {
        if (index % 2 == 0) {
          return false; //不允许勾选
        } else {
          return true; //可以勾选
        }
      }
    };
  },
  methods: {
    add: function(selectRows) {
      console.log(selectRows);
    },
    test: function(row) {
      console.log(row);
    }
  },
  mounted: function() {

  }
};
</script>

<style>
h2 {
  font-weight: normal;
}
</style>
