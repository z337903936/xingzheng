<template>
  <partner-detail :is-edit="false"/>
</template>

<script>
import PartnerDetail from './components/PartnerDetail'

export default {
  name: 'CreateForm',
  components: { PartnerDetail }
}
</script>

