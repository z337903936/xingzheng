<template>
    <div class="app-container">
        <el-steps :active="step" align-center finish-status="success" style="margin-top: 20px" >
            <el-step v-for="(data,key) in allGroup" :title="data" @click.native="show(data,key)"/>
        </el-steps>

        <div>
            <addCase :is_detail="is_detail" :detailData="caseDetail" v-if="showStep ==='添加案件'"></addCase>
            <addAlarm :is_detail="is_detail" :detailData="alarmDetail" :parentId="parentId" v-if="showStep==='接警台'"></addAlarm>
            <addSearch :is_detail="is_detail" :detailData="searchDetail" :parentId="parentId" v-if="showStep==='痕检现勘'"></addSearch>
            <nextStep  :parentId="caseId" :taskId="taskId" v-if="showStep==='指派任务'"></nextStep>
        </div>

    </div>
</template>

<script>
    import { fetchList,fetchTask,createTask,updateTask,nextTask,groupList } from '@/api/task'
    import addAlarm from './components/addAlarm'
    import addSearch from './components/addSearch'
    import addCase from './components/addCase'
    import nextStep from './components/nextStep'

    export default {
        name: "Detail",
        components: {
            addAlarm,
            addSearch,
            addCase,
            nextStep
        },
        data(){
            return {
                parentId:0,
                taskId:0,
                caseId:0,
                task:{},
                stepDetail:[],
                step:0,
                showStep:'',
                allGroup: [],
                is_detail:true,
                caseDetail:{},
                alarmDetail:{},
                searchDetail:{},
                currentUserId:null,
            }
        },
        created(){
            const id = this.$route.params && this.$route.params.id;
            this.caseId = id;
            this.currentUserId  = this.$store.getters.id
            this.getTask(id)
        },
        methods:{
            getTask(id){
                fetchTask(id).then(response=>{
                    this.task = response;
                    this.stepDetail = response.caseStepList;
                    var count = response.caseStepList.length;
                    if (count>0){
                        this.step +=count-1;
                    }
                    response.caseStepList.map(data=>{
                        count--;
                        this.allGroup.push(data.stepName);
                        data.task.currentUserId = this.currentUserId;
                        data.task.stepHanlderUid = data.stepHanlderUid;
                        if(count===0) {
                            data.task.isLast = true;
                        }else{
                            data.task.isLast = false;
                        }
                        this.preData(data.stepName,data.task)
                    });

                    this.allGroup.push('指派任务');
                    this.showStep = this.allGroup[this.step]
                })
            },
            preData(name,obj){
                switch (name) {
                    case '添加案件':
                        this.caseDetail = obj;
                        break;
                    case '接警台':
                        this.alarmDetail = obj;
                        break;
                    case '痕检现勘':
                        this.searchDetail = obj;
                        break;
                }
            },
            show(e,index){
                if (e!='指派任务')
                    this.showStep = e
            },
            setTaskStep(taskId){
                this.taskId = taskId;
                this.step++;
                this.showStep = this.allGroup[this.step];
            }
        }
    }
</script>

<style scoped>

</style>