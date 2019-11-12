<template>
  <action-detail :is-edit="true"/>
</template>

<script>
import ActionDetail from './actionDetail'

export default {
  name: 'EditForm',
  components: { ActionDetail }
}
</script>

