<template>
  <v-container>
    <v-toolbar color="indigo" dark shaped>
      <v-toolbar-title>
        <h4>Estadísticas Globales - {{ this.fecha | format_Date }}</h4>
      </v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn icon color="green" @click="completartabla()">
        <v-icon>mdi-cached</v-icon>
      </v-btn>
      <v-btn icon color="green" @click="$router.push('/')">
        <v-icon>mdi-home</v-icon>
      </v-btn>
    </v-toolbar>
    <v-spacer></v-spacer>
    <v-card>
      <v-card-title class="text-decoration-underline">
        <v-btn @click="completartabla()">Resumen diario</v-btn>
        <v-spacer></v-spacer>
        <v-btn @click="$router.push('/Graficomundial')"
          >Comparación entre AR, BR, CL y UR</v-btn
        >
        <v-spacer></v-spacer>
        <v-text-field
          v-model="search"
          append-icon="mdi-magnify"
          label="Buscar"
          single-line
          hide-details
        ></v-text-field>
      </v-card-title>
      <v-data-table
        :headers="headers"
        :items="casosRow"
        :items-per-page="5"
        :search="search"
        class="elevation-1"
        :loading="cargandoData"
        loading-text="Presione Resumen Diario o Actualizar para cargar la tabla"
      ></v-data-table>
    </v-card>
  </v-container>
</template>
<script>
import axios from "axios";
import moment from "moment";
import { mapState } from "vuex";
export default {
  data() {
    return {
      cargandoData: true,
      search: "",
      countries: "",
      fecha: new Date().toISOString().substr(0, 10),
      headers: [
        { text: "País", value: "pais", align: "start", sortable: true },
        {
          text: "Casos Confirmados del dia",
          value: "confirmed",
          align: "center",
        },
        { text: "Total Casos Confirmados", value: "confirmed2" },
        { text: "Nuevos Recuperados", value: "recovered" },
        { text: "Total Recuperados", value: "recovered2" },
        { text: "Fallecidos del dia", value: "nmuertes" },
        { text: "Total de fallecidos", value: "fallecidos" },
      ],
      casosRow: [],
    };
  },
  computed: {
    ...mapState(["token1", "authenticated"]),
  },
  methods: {
    async completartabla() {
      if (this.authenticated.estado === false) {
        this.authenticated.popup = true;
      } else {
        await axios
          .get(`http://localhost:1337/resumen?_sort=id:desc`, {
            headers: {
              Authorization: `Bearer ${this.token1}`,
            },
          })
          .then((response) => {
            this.countries = response.data[0].casos;
            var data3 = [];
            
            this.fecha = this.countries[0].Date;
            this.fecha = this.format_date(this.fecha);
            this.countries.map(async function(countryR) {
              data3.push({
                pais: countryR.Country,
                confirmed: countryR.NewConfirmed,
                confirmed2: countryR.TotalConfirmed,
                recovered: countryR.NewRecovered,
                recovered2: countryR.TotalRecovered,
                nmuertes: countryR.NewDeaths,
                fallecidos: countryR.TotalDeaths,
              });
            });
            this.casosRow = data3;
            this.cargandoData = false;
          });
      }
    },
    format_date(value) {
      if (value) {
        return moment(String(value)).format("DD-MM-YYYY");
      }
    },
  }, //methods
  mounted() {
    if (this.authenticated.estado === false) {
      this.authenticated.popup = true;
    }
  },
};
</script>
