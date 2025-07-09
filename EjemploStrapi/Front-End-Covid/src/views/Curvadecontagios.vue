<template>
  <v-container>
    <Toolbarprop titulo="Curva de contagios por pais" />
    <v-divider></v-divider>
    <v-card class="mx-auto mt-3">
      <v-row align="center" mb-1>
        <v-col cols="12" sm="6">
          <div class="text-center my-2">
            <v-btn rounded small @click="graficoConfirmados(selected)" dark>
              Mostrar curva de contagios</v-btn
            >
          </div>
        </v-col>
        <v-col cols="12" sm="6">
          <v-select
            v-model="selected"
            :items="paises"
            menu-props="auto"
            label="Seleccionar"
            hide-details
            prepend-icon="mdi-map-marker"
            single-
            @change="graficoConfirmados(selected)"
          ></v-select>
        </v-col>
        <v-col v-flex full-width v-if="habilitarG" cols="12">
          <GChart
            type="AreaChart"
            :data="chartData"
            :options="chartOptions"
            :resizeDebounce="500"
          />
        </v-col>
      </v-row>
    </v-card>
  </v-container>
</template>
<script>
import Toolbarprop from "../components/Toolbar";
import Vue from "vue";
import VueGoogleCharts from "vue-google-charts";
import axios from "axios";
Vue.use(VueGoogleCharts);
import { mapState } from "vuex";
export default {
  components: {
    Toolbarprop,
  },
  computed: {
    ...mapState(["token1", "authenticated"]),
  },
  data() {
    return {
      habilitarG: false,
      selected: "Argentina",
      paises: ["Argentina", "Brazil", "Chile", "Uruguay"],
      datostabla: {},
      chartData: [],
      chartOptions: {
        chart: {
          title: "",
          subtitle: "",
        },
        height: 400,
        hAxis: {
          title: "Curva de contagios",
          titleTextStyle: { color: "green" },
        },
      },
    };
  },
  methods: {
    async graficoConfirmados(p) {
      if (this.authenticated.estado === false) {
        this.authenticated.popup = true;
      } else {
        let datos = await axios.get(
          `http://localhost:1337/casos-pais?_sort=fecha:asc&pais=${p}&_limit=-1&totalConfirmados_ne=0`,
          {
            headers: {
              Authorization: `Bearer ${this.token1}`,
            },
          }
        );
        this.datostabla = datos.data;
        var data2 = [["Fecha", "Casos"]];
        let casos = 0;
        this.datostabla.map(async function(casos) {
          data2.push([casos.fecha, casos.totalConfirmados]);
        });
        this.chartData = data2;
        this.habilitarG = true;
      }
    },
  },
  mounted() {
    if (this.authenticated.estado === false) {
      this.authenticated.popup = true;
    }
  },
};
</script>
