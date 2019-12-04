<template>
    <div>
        <el-card :body-style="{ padding: '0px' }">
            <div style="width: 100%">

            </div>
            <div style="padding: 14px;">
                <span>好吃的汉堡</span>
                <div class="bottom clearfix">
                    <time class="time">{{ currentDate }}</time>

                </div>
            </div>
        </el-card>
    </div>
</template>

<script>
    export default {
        name: "materialDetail",
        props: {
            data: {
                type: Array,
                default: []
            }
        },
        data(){
            return {

            }
        }
    }
</script>

<style scoped>

</style>