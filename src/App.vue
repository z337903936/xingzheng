<template>
    <div id="app">
        <router-view/>
    </div>
</template>

<script>
    import {getToken, getUID} from '@/utils/auth'

    export default {
        name: 'App',
        data() {
            return {
                url: 'wss://starnew.cn/ws/',
                websock: undefined,
                showNotify: true,
                showNotifyA: true,
            }
        },
        created() {
            if (this.$store.getters.id){
                this.initWebSocket()
            }
        },
        methods: {
            initWebSocket() { //初始化weosocket

                this.websock = new WebSocket(this.url, getUID());
                this.websock.onopen = this.websocketonopen;
                this.websock.onmessage = this.websocketonmessage;
                this.websock.onerror = this.websocketonerror;
                this.websock.onclose = this.websocketclose;
            },
            websocketonmessage(e) {
                var data = JSON.parse(e.data);
                console.log(data)

                if (data) {
                    var _this = this;
                    if (data.type === 'ANALYSIS_TASK') {
                        if (this.showNotifyA) {
                            this.$notify({
                                title: '系统消息',
                                message: '您有新的串并结果',
                                duration: 0,
                                type: 'success',
                                onClose: function () {
                                    _this.showNotifyA = true;
                                },
                                position: 'top-left',

                            });
                            this.showNotifyA = false;
                        }


                    }

                    if (data.type === 'TODO_TASK') {
                        if (this.showNotify) {
                            this.$notify({
                                title: '系统消息',
                                message: '您有新的待办任务',
                                duration: 0,
                                onClose: function () {
                                    _this.showNotify = true;
                                },
                                position: 'top-left',
                                type: 'success'
                            });
                            this.showNotify = false;
                        }
                    }
                }

            },
            websocketonopen() { //连接建立之后执行send方法发送数据
                // var test = {'X-AUTH-TOKEN-UID':getUID()}
                // this.websocketsend(JSON.stringify(test))
                setInterval(() => {
                    this.websocketsend(JSON.stringify({type:'ping',time:(new Date()).valueOf()}));
                }, 3000);
            },
            websocketsend(Data) {//数据发送
                this.websock.send(Data)
            },
            websocketonerror(){//连接建立失败重连
                this.initWebSocket()
            },
            websocketclose(e){  //关闭重连
                this.initWebSocket()
            }

        }
    }
</script>

<style>
    .el-notification{
        padding: 10px 16px !important;
        width: 246px !important;
    }
</style>
