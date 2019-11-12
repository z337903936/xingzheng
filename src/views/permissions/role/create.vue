<template>
  <role-detail :is-edit="false"/>
</template>

<script>
import RoleDetail from './roleDetail'

export default {
  name: 'CreateForm',
  components: { RoleDetail }
}
</script>

