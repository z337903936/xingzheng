<template>
    <div>
        <el-steps :active="step" align-center finish-status="success" style="margin-top: 20px" >
            <!--<el-step style="color: rgb(64, 158, 255)!important;" title="添加案件" @click.native="show('添加案件')"/>-->
            <!--<el-step style="color: rgb(64, 158, 255)!important;" title="接警" @click.native="show('接警')" v-if="nextStep===1"/>-->
            <!--<el-step style="color: rgb(64, 158, 255)!important;" title="现勘" @click.native="show('现勘')" v-if="nextStep===2"/>-->
            <el-step style="color: rgb(64, 158, 255)!important;" title="添加案件" />
            <el-step style="color: rgb(64, 158, 255)!important;" title="接警" v-if="nextStep===1"/>
            <el-step style="color: rgb(64, 158, 255)!important;" title="现勘" v-if="nextStep===2"/>
        </el-steps>

        <div>
            <addCase v-if="showStep ==='添加案件'"></addCase>
            <addAlarm :parentId="caseId" v-if="showStep==='接警'"></addAlarm>
            <addSearch :parentId="caseId" v-if="showStep==='现勘'"></addSearch>

        </div>
    </div>
</template>

<script>
    import addAlarm from './components/addAlarm'
    import addSearch from './components/addSearch'
    import addCase from './components/addCase'
    export default {
        name: "editTask",
        components: {
            addAlarm,
            addSearch,
            addCase,
        },
        data(){
            return{
                step: 1,
                showStep: '添加案件',
                nextStep: 0,
                caseId: 0,
            }
        },
        methods:{
            show(e){
                this.showStep = e
            },
            setNextStep(num,id){
                console.log(num,id)
                if (num === 1)
                    this.showStep = '接警';
                else
                    this.showStep = '现勘';
                this.nextStep = num;
                this.caseId = id;
            }
        }
    }
</script>

<style scoped>

</style>