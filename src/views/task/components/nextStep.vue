<template>
    <div class="main">
        <div style="text-align: center">
            <el-select v-model="nextGroup" placeholder="请选择岗位" center>
                <el-option
                        v-for="item in groupList"
                        :key="item.id"
                        :label="item.title"
                        :value="item.id"/>
            </el-select>
            <el-button type="primary"  @click="nextStep()">确认</el-button>
        </div>



    </div>
</template>
<style scoped>
    .main {
        width: 100%;
        margin-top: 100px;
    }

    .action {
        width: 600px;
        margin: auto;
    }
</style>
<script>
    import { fetchList,fetchTask,createTask,updateTask,nextTask,groupList } from '@/api/task'

    export default {
        name: "NextStep",
        props: {
            parentId: {
                type: Number,
                default: false
            },
            taskId: {
                type: Number,
                default: false
            },
        },
        data(){
            return {
                groupList: [],
                nextGroup:'',
            }
        },
        created() {
            this.getGroup()

        },
        methods: {
            getGroup() {
                groupList({}).then(response => {
                    this.groupList = response.list.map(data => {
                        return {
                            id: data.id,
                            title: data.groupName
                        }
                    })
                })
            },
            nextStep(){
                const sendData = {
                    caseId: this.parentId,
                    groupId: this.nextGroup,
                    taskId: this.taskId,
                };
                nextTask(sendData).then(response => {
                    if (response.code === 200) {
                        this.$message({
                            message: '操作成功',
                            type: 'success',
                            showClose: true,
                            duration: 2000
                        })
                        setTimeout(() => {
                            this.$router.push({
                                path: '/task/index',
                                query: {
                                    t: +new Date()
                                }
                            })
                        },  1000)

                    }else{
                        this.$message({
                            message: response.reason,
                            type: 'success',
                            showClose: true,
                            duration: 2000
                        })
                    }
                })
            }
        }
    }
</script>

<style scoped>

</style>