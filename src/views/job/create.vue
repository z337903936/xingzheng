<template>
  <job-detail :is-edit="false"/>
</template>

<script>
import JobDetail from './components/JobDetail'

export default {
  name: 'CreateForm',
  components: { JobDetail }
}
</script>

