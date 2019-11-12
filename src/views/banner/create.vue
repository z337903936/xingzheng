<template>
  <carousel-detail :is-edit="false"/>
</template>

<script>
import CarouselDetail from './components/CarouselDetail'

export default {
  name: 'CreateForm',
  components: { CarouselDetail }
}
</script>

