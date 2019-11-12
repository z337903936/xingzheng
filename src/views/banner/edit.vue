<template>
  <carousel-detail :is-edit="true"/>
</template>

<script>
import CarouselDetail from './components/CarouselDetail'

export default {
  name: 'EditForm',
  components: { CarouselDetail }
}
</script>

