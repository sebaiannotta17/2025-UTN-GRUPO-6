<template>
  <v-container>
    <Toolbarprop
      titulo="Mapa del Covid-19 en la provincia de Bs As - Argentina"
    />
    <iframe
      style="min-height: 100vh; min-width: 100%"
      src="http://qlik3.ms.gba.gov.ar/sense/app/0a29a121-edef-4cd9-9ffd-fb5e298b5afd/sheet/c812ce2b-d071-4e1c-a7a2-3a63cf710b68/state/analysis"
      frameborder="0"
    ></iframe>
  </v-container>
</template>
<script>
import { mapState } from "vuex";
import Toolbarprop from "../components/Toolbar";
export default {
  components: {
    Toolbarprop,
  },
  mounted() {
    this.authenticated.popup = false;
  },
  computed: {
    ...mapState(["authenticated"]),
  },
};
</script>
