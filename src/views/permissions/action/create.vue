<template>
  <action-detail :is-edit="false" />
</template>

<script>
import ActionDetail from './actionDetail'

export default {
  name: 'CreateForm',
  components: { ActionDetail }
}
</script>

