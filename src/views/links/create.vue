<template>
  <links-detail :is-edit="false"/>
</template>

<script>
import LinksDetail from './components/LinksDetail'

export default {
  name: 'CreateForm',
  components: { LinksDetail }
}
</script>

