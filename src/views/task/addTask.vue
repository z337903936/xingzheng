<template>
    <div>
        <el-steps :active="step" align-center finish-status="success" style="margin-top: 20px" >
            <el-step  title="添加案件" @click.native="show('添加案件')"/>
            <el-step  title="接警台"  v-if="currenGroup==='接警台'"/>
            <el-step  title="痕检"  v-if="currenGroup==='痕检'"/>
            <el-step  title="法医现勘"  v-if="currenGroup==='法医'"/>
            <el-step  title="DNA检测" v-if="currenGroup==='DNA检测'"/>
            <el-step  title="DNA检测" v-if="currenGroup==='DNA检测'"/>
            <el-step title="指派任务"/>
            <!--<el-step  title="指纹检测" @click.native="show('指纹检测')" v-if="currenGroup==='指纹检测'"/>-->
            <!--<el-step  title="理化检测" @click.native="show('理化检测')" v-if="currenGroup==='理化检测'"/>-->
        </el-steps>

        <div>
            <addCase  :detailData="caseDetail" v-if="showStep ==='添加案件'"></addCase>
            <addAlarm :parentId="caseId" :detailData="caseDetail" v-if="showStep==='接警台'"></addAlarm>
            <addSearch :parentId="caseId" :detailData="caseDetail" v-if="showStep==='痕检'"></addSearch>
            <nextStep :parentId="caseId" :taskId="taskId" v-if="showStep==='指派任务'"></nextStep>

        </div>
    </div>
</template>

<script>
    import addAlarm from './components/addAlarm'
    import addSearch from './components/addSearch'
    import addCase from './components/addCase'
    import nextStep from './components/nextStep'

    const group = [
        '接警台','痕检','法医','DNA检测','指纹检测','理化检测',
    ]
    export default {
        name: "editTask",
        components: {
            addAlarm,
            addSearch,
            addCase,
            nextStep
        },
        data(){
            return{
                step: 0,
                showStep: '添加案件',
                nextStep: 0,
                caseId: 0,
                taskId: 0,
                currenGroup: '',
                allGroup: ['添加案件'],
                caseDetail:{}
            }
        },
        created(){
            const groupName = this.$store.getters.groupName;
            group.map(data=>{
                if (groupName.indexOf(data) > -1){
                    this.currenGroup = data
                    this.allGroup.push(data);
                }
            })
            console.log()
            this.allGroup.push('指派任务');
        },
        methods:{
            show(e){
                this.showStep = e
            },
            setNextStep(id){
                this.caseId = id;
                this.step++;
                this.showStep = this.allGroup[this.step];
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