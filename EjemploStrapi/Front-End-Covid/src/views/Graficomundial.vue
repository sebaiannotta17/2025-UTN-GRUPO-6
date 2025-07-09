<template>
  <v-container>
    <v-toolbar color="indigo" dark shaped>
      <v-toolbar-title c>
        <h4>Confirmados por país - {{ fecha }}</h4>
      </v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn icon color="green" @click="$router.push('/')">
        <v-icon>mdi-home</v-icon>
      </v-btn>
    </v-toolbar>
    <v-divider></v-divider>
    <v-card class="mx-auto mt-3">
      <v-row align="center" mb-1>
        <v-col cols="12" md="6">
          <div class="text-center my-2">
            <v-btn rounded @click="armarTabla()" dark>
              Confirmados por país</v-btn
            >
          </div>
        </v-col>
        <v-col cols="12" md="6"> </v-col>
        <v-col full-width v-if="habilitarG" cols="12" md="6">
          <GChart
            type="PieChart"
            :data="chartData"
            :options="chartOptions"
            :resizeDebounce="500"
          />
        </v-col>
        <v-col full-width v-if="habilitarG" cols="12" md="6">
          <GChart
            type="BarChart"
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
import Vue from "vue";
import VueGoogleCharts from "vue-google-charts";
import axios from "axios";
Vue.use(VueGoogleCharts);
import { mapState } from "vuex";
import { mapMutations } from "vuex";
export default {
  computed: {
    ...mapState(["token1", "authenticated"]),
  },
  data() {
    return {
      habilitarG: false,
      fecha: "",
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
          title: "Total de casos confirmados",
          titleTextStyle: { color: "green" },
        },
      },
    };
  },
  methods: {
    ...mapMutations(["mostrarLoading", "ocultarLoading"]),
    async armarTabla() {
      if (this.authenticated.estado === false) {
        this.authenticated.popup = true;
      } else {
        this.mostrarLoading({
          titulo: "Buscando los datos",
          color: "secondary",
        });
        let p = "";
        var data2 = [["Pais", "Total de casos confirmados"]];
        for (p in this.paises) {
          let datos = await axios.get(
            `http://localhost:1337/casos-pais?_sort=fecha:desc&pais=${this.paises[p]}&totalConfirmados_ne=0&_limit=1`,
            {
              headers: {
                Authorization: `Bearer ${this.token1}`,
              },
            }
          );
          this.datostabla = datos.data;
          if (this.datostabla[0] != undefined) {
            this.fecha = this.datostabla[0].fecha;
            data2.push([
              this.datostabla[0].pais,
              this.datostabla[0].totalConfirmados,
            ]);
          }
        }
        this.chartData = data2;
        this.habilitarG = true;
        this.ocultarLoading();
      }
    },
  },
  computed: {
    ...mapState(["token1", "authenticated"]),
  },
  mounted() {
    if (this.authenticated.estado === false) {
      this.authenticated.popup = true;
    }
  },
};
</script>
