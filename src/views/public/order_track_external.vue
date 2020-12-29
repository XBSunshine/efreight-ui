<template>
  <div>
    <AF_ORDER_TRACK_EXTERNAL v-if="businessScope=='AF'"></AF_ORDER_TRACK_EXTERNAL>
    <AI_ORDER_TRACK_EXTERNAL v-else-if="businessScope=='AI'"></AI_ORDER_TRACK_EXTERNAL>
    <SE_ORDER_TRACK_EXTERNAL v-else-if="businessScope=='SE'"></SE_ORDER_TRACK_EXTERNAL>
    <SI_ORDER_TRACK_EXTERNAL v-else-if="businessScope=='SI'"></SI_ORDER_TRACK_EXTERNAL>
  </div>
</template>
<script>
  import AF_ORDER_TRACK_EXTERNAL from '@/views/af/order/orderTrack/af_order_track_external.vue'
  import AI_ORDER_TRACK_EXTERNAL from '@/views/af/order/orderTrack/ai_order_track_external.vue'
  import SE_ORDER_TRACK_EXTERNAL from '@/views/sc/se/order/track/order_track_external.vue'
  import SI_ORDER_TRACK_EXTERNAL from '@/views/sc/si/order/track/order_track_external.vue'

  export default {
    data(){
      return{
        businessScope: '',
      }
    },
    created() {
      let uuid = this.$route.query['o'] ||"";
      let scope = uuid.substring(0,2);
      this.businessScope = scope.toUpperCase();
    },
    components: {
      AF_ORDER_TRACK_EXTERNAL,
      AI_ORDER_TRACK_EXTERNAL,
      SE_ORDER_TRACK_EXTERNAL,
      SI_ORDER_TRACK_EXTERNAL
    }
  }
</script>
