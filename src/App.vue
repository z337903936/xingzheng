<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script>
export default{
  name: 'App',
  data(){
    return{
      url:'',
      websock :undefined
    }
  },
  created() {

  },
  methods:{
    initWebSocket(){ //初始化weosocket
      // this.websock = new WebSocket(this.url);

    },
  }
}
</script>
