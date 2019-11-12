<template>
  <accounts-detail :is-edit="false"/>
</template>

<script>
import AccountsDetail from './AccountsDetail'

export default {
  name: 'CreateForm',
  components: { AccountsDetail }
}
</script>

