<template>
  <template-detail :is-edit="true"/>
</template>

<script>
import TemplateDetail from './TemplateDetail'

export default {
  name: 'EditTemplate',
  components: { TemplateDetail }
}
</script>

