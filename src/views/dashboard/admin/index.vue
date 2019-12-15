<template>
  <div class="dashboard-editor-container">
    <panel-group :state="state" />
    <el-row style="background:#fff;padding:16px 16px 0;margin-bottom:32px;">
      <bar-chart :state="state" />
    </el-row>
    <div class="tip"><p>待办任务</p></div>
    <div  @click="gotoUndone">
      <el-table
              v-loading="listLoading"
              :data="list"
              border
              fit
              highlight-current-row
              style="width: 100%;"


      >
        <el-table-column label="任务单号" align="center">
          <template slot-scope="{row}">
            <span>{{ row.taskNo }}</span>
          </template>
        </el-table-column>
        <el-table-column label="任务类型" align="center">
          <template slot-scope="{row}">
            <span>{{ row.stepName }}</span>
          </template>
        </el-table-column>
        <el-table-column label="发送人" align="center">
          <template slot-scope="{row}">
            <span>{{ row.stepHandler }}</span>
          </template>
        </el-table-column>
        <el-table-column label="发送时间" align="center">
          <template slot-scope="{row}">
            <span>{{ row.taskArriveTime | parseTime('{y}-{m}-{d} {h}:{i}:{s}')  }}</span>
          </template>
        </el-table-column>

        <el-table-column label="任务数" align="center">
          <template slot-scope="{row}">
            <span>{{ row.examNumber }}</span>
          </template>
        </el-table-column>
        <el-table-column label="状态" align="center">
          <template slot-scope="{row}">
            <span>{{ row.status | statusFilter }}</span>
          </template>
        </el-table-column>
      </el-table>
    </div>

  </div>
</template>

<script>
import PanelGroup from './components/PanelGroup'
import LineChart from './components/LineChart'
import RaddarChart from './components/RaddarChart'
import PieChart from './components/PieChart'
import BarChart from './components/BarChart'
import TransactionTable from './components/TransactionTable'
import TodoList from './components/TodoList'
import BoxCard from './components/BoxCard'
import { taskList} from '@/api/backlog'
import { homePageState} from '@/api/common'

export default {
  name: 'DashboardAdmin',
  components: {
    PanelGroup,
    LineChart,
    RaddarChart,
    PieChart,
    BarChart,
    TransactionTable,
    TodoList,
    BoxCard
  },
  filters: {

    statusFilter(status) {
      const statusMap = {
        1: '未领取',
        2: '进行中',
        3: '已完成'
      }
      return statusMap[status]
    }
  },
  data() {
    return {
      listLoading:false,
      state:{
        dayEvidences:0,
        monthEvidences:0,
        dayData:[],
        eviData:[],
      },
      list:''
    }
  },
  created() {


    this.getList();

  },
  methods: {
    gotoUndone(){
      this.$router.push({
        path: '/backlog/undone/',
        query: {
          t: +new Date()
        }
      })
    },
    getList() {
      this.listLoading = true;
      const data = {
        status: 1
      }
      taskList(data).then(response => {

        this.list = response.list.slice(0,10)
        // this.pages = response.pages

        // Just to simulate the time of the request

        this.listLoading = false

      })
      homePageState().then(res=>{
        var month = [];
        var showMonth = [];
        this.state = res;
        this.state.dayStatList.map(data=>{
          month.push(data.day);
          showMonth.push(data.evidences)
        });
        this.state.dayData = month;
        this.state.eviData = showMonth;
        console.log(this.state);

      })

    },
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.dashboard-editor-container {
  padding: 32px;
  background-color: rgb(240, 242, 245);
  min-height: calc( 100vh - 114px );
  .chart-wrapper {
    background: #fff;
    padding: 16px 16px 0;
    margin-bottom: 32px;
  }
}
 .tip {
  padding: 8px 16px;
  background-color: #ecf8ff;
  border-radius: 4px;
  border-left: 5px solid #50bfff;
  margin: 20px 0;
}
</style>
