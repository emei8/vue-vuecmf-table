<template>
  <div id="app">
    <h2>vue-vuecmf-table demo</h2>
    <vc-table
            :selectable="selectable"
            :checkbox="true"
            ref="vcTable"
            :cell-event="cellEvent"
            server="http://www.b2b.com/api/Table/index"
            page="page"
            :limit="20"
            :operate-width="100"
            import-server="http://www.b2b.com/api/Table/importData"
    >
      <template #headerAction="selectRows">
          <el-button size="mini" type="primary" @click.native.prevent="add(selectRows)" >添加</el-button>
      </template>

      <template #rowAction="{ row, index}">
          <el-button size="mini" type="success" @click.native.prevent="test(row)">test {{ index }}</el-button>
      </template>

    </vc-table>

  </div>
</template>

<script>
    import Vue from 'vue'
    import ElementUI from 'element-ui'
    import 'element-ui/lib/theme-chalk/index.css'
    import ElButton from "../node_modules/element-ui/packages/button/src/button.vue";
    Vue.use(ElementUI)

export default {
    components: {ElButton},
    name: 'app',
  data () {
    return {
        selectable: function (row, index) {
            if(index % 2 == 0){
                return false;  //不允许勾选
            }else{
                return true; //可以勾选
            }

        },
        //针对自定义单元格内容的事件处理， 可借助jquery进行DOM操作和事件处理
        cellEvent:
            function (currentList) { //currentList 为当前页列表数据
                console.log('cellevent')
                console.log(currentList)
            }


    }
  },
    methods:{
          add:function (selectRows) {
              console.log(selectRows)
          },
          test:function (row) {
              console.log(row)
          }
    },
  mounted: function () {
      let that = this
      that.rowAction[1].callback = function (index,row) {

          //that.$set(that.$refs.vcTable.tableData[index],'callback_result','未关注');  //替换默认操作

          that.$set(that.$refs.vcTable.tableData[index],'callback_result',false);  //不替换默认操作

         /*
         //异常回调处理
         that.$refs.vcTable.post('http://www.b2b.com/api/table/index',{id:'11'}).then(
              resolve => {
                  //console.log('请求成功',resolve.data)

                  that.$set(that.$refs.vcTable.tableData[index],'callback_result','未关注');

                  //return Promise.resolve(resolve.data)
              },
              reject => {
                 // console.log('请求异常')
                 // return Promise.reject(reject)
              }
          );*/

      }

  }
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;

}

h1, h2 {
  font-weight: normal;
}

ul {
  list-style-type: none;
  padding: 0;
}

li {
  display: inline-block;
  margin: 0 10px;
}

a {
  color: #42b983;
}
</style>
