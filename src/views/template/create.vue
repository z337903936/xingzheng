<template>
  <template-detail :is-edit="false"/>
</template>

<script>
import TemplateDetail from './TemplateDetail'

export default {
  name: 'CreateTemplate',
  components: { TemplateDetail }
}
</script>

