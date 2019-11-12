<template>
  <links-detail :is-edit="true"/>
</template>

<script>
import LinksDetail from './components/LinksDetail'

export default {
  name: 'EditForm',
  components: { LinksDetail }
}
</script>

