<template>
  <v-container>
    <Toolbarprop titulo="Actualizar Estadisticas desde la API a Strapi" />
    <v-card class="mx-auto mt-3">
      <v-container fluid>
        <v-row dense>
          <v-col cols="12" md="6">
            <v-card>
              <v-img
                src="../assets/globo2.jpg"
                class="white--text align-end"
                gradient="to bottom, rgba(0,0,0,.1), rgba(0,0,0,.5)"
                height="200px"
              >
                <v-card-title>Resumen mundial </v-card-title>
              </v-img>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn block color="success" @click="guardarResumen()"
                  >Guardar resumen en strapi
                  <v-icon right dark>mdi-calendar</v-icon>
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-col>
          <v-col cols="12" md="6">
            <v-card>
              <v-img
                src="../assets/imagen6.jpg"
                class="white--text align-end"
                gradient="to bottom, rgba(0,0,0,.1), rgba(0,0,0,.5)"
                height="200px"
              >
                <v-card-title
                  >Guardar resumen del día actual</v-card-title
                >
              </v-img>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn
                  block
                  color="success"
                  @click="guardarResumenDiarioStrapi()"
                  >Guardar resumen diario en strapi
                  <v-icon right dark>mdi-cloud-upload</v-icon>
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-col>
          <v-col cols="12" md="12">
            <v-card>
              <v-img
                src="../assets/bd1.jpg"
                class="white--text align-end"
                gradient="to bottom, rgba(0,0,0,.1), rgba(0,0,0,.5)"
                height="200px"
              >
                <v-card-title
                  >Cargar BD - Strapi con los detalles del País</v-card-title
                >
              </v-img>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-container fluid>
                  <v-row align="center">
                    <v-col cols="12" md="12">
                      <v-select
                        v-model="selected"
                        :items="paises"
                        menu-props="auto"
                        label="Seleccionar"
                        hide-details
                        prepend-icon="mdi-map-marker"
                        single-line
                      ></v-select>
                    </v-col>
                    <v-col cols="12" md="12">
                      <v-btn
                        block
                        color="success"
                        @click="cargarcasosPais(selected)"
                        >Cargar datos del Pais en strapi
                        <v-icon right dark>mdi-cloud-upload</v-icon>
                      </v-btn>
                    </v-col>
                  </v-row>
                </v-container>
              </v-card-actions>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </v-card>
    <v-snackbar v-model="snackbar">
      {{ textSnackbar }}
      <template v-slot:action="{ attrs }">
        <v-btn color="red" text v-bind="attrs" @click="snackbar = false">
          Close
        </v-btn>
      </template>
    </v-snackbar>
  </v-container>
</template>
<script>
import Toolbarprop from "../components/Toolbar";
import { mapMutations } from "vuex";
import axios from "axios";
import { mapState } from "vuex";
export default {
  components: {
    Toolbarprop,
  },
  name: "CargarAPI",
  data() {
    return {
      selected: "Argentina",
      snackbar: false,
      textSnackbar: "",
      paises: ["Argentina", "Brazil", "Chile", "Uruguay"],
      token: "",
      info: {},
      loading: true,
      errored: false,
      resumen: {},
      countries: {},
      ultimo: 0,
      resumenDiario: {
        fecha: "",
        nuevosConfirmados: 0,
        totalConfirmados: 0,
        nuevasMuertes: 0,
        totaldeMuertes: 0,
        nuevosRecuperados: 0,
        totalRecuperados: 0,
      },
      pais: {
        nombre: "",
      },
      casosPais: {
        pais: "Argentina",
        fecha: "",
        casosdeldia: 0,
        activos: 0,
        totalConfirmados: 0,
        totaldeMuertes: 0,
        totalRecuperados: 0,
      },
      totalcasosdeldia: 0,
      diaanterior: 0,
      casosdeldia1: 0,
      dia: 0,
    };
  },
  computed: {
    ...mapState(["token1", "authenticated"]),
  },
  methods: {
    ...mapMutations(["mostrarLoading", "ocultarLoading"]),
    //Usando strapi cargo el JSON/
    async guardarResumen() {
      if (this.authenticated.estado === false) {
        this.authenticated.popup = true;
      } else {
        try {
          this.mostrarLoading({
            titulo: "Cargando los datos",
            color: "secondary",
          });
          await axios
            .get("https://api.covid19api.com/summary")
            .then((response) => {
              this.resumen = response.data.Countries;
            });
          let data = {
            casos: this.resumen,
          };
          await axios
            .post("http://localhost:1337/resumen", data, {
              headers: {
                Authorization: `Bearer ${this.token1}`,
              },
            })
            .then((response) => {
              this.resumen.push(response.data);
            });
          this.snackbar = true;
          this.textSnackbar = "El resumen fue cargado";
        } catch (error) {
          console.log(error);
        } finally {
          this.ocultarLoading();
          this.textSnackbar = "Ya esta actualizado";
          this.snackbar = true;
        }
        this.textSnackbar = "Ya esta actualizado";
        this.snackbar = true;
      }
    },
    async guardarResumenDiarioStrapi() {
      if (this.authenticated.estado === false) {
        this.authenticated.popup = true;
      } else {
        try {
          this.mostrarLoading({
            titulo: "Cargando los datos",
            color: "secondary",
          });
          var tok = this.token1;
          this.resumenDiario = {};
          await axios
            .get("https://api.covid19api.com/summary")
            .then((response) => {
              this.resumenDiario.fecha = response.data.Date;
              this.resumenDiario.nuevosConfirmados =
                response.data.Global.NewConfirmed;
              this.resumenDiario.totalConfirmados =
                response.data.Global.TotalConfirmed;
              this.resumenDiario.nuevasMuertes = response.data.Global.NewDeaths;
              this.resumenDiario.totaldeMuertes =
                response.data.Global.TotalDeaths;
              this.resumenDiario.nuevosRecuperados =
                response.data.Global.NewRecovered;
              this.resumenDiario.totalRecuperados =
                response.data.Global.TotalRecovered;
            });
          let data = {
            fecha: this.resumenDiario.fecha,
            nuevosConfirmados: this.resumenDiario.nuevosConfirmados,
            totalConfirmados: this.resumenDiario.totalConfirmados,
            nuevasMuertes: this.resumenDiario.nuevasMuertes,
            totaldeMuertes: this.resumenDiario.totaldeMuertes,
            nuevosRecuperados: this.resumenDiario.nuevosRecuperados,
            totalRecuperados: this.resumenDiario.totalRecuperados,
          };
          await axios
            .post("http://localhost:1337/resumen-diarios", data, {
              headers: {
                Authorization: `Bearer ${tok}`,
              },
            })
            .then((response) => {
              this.resumenDiario.push(response.data);
            });
        } catch (error) {
          console.log(error);
        } finally {
          this.ocultarLoading();
          this.textSnackbar = "Ya esta actualizado";
          this.snackbar = true;
        }
      }
    },
    async cargarcasosPais(p) {
      if (this.authenticated.estado === false) {
        this.authenticated.popup = true;
      } else {
        try {
          this.mostrarLoading({
            titulo: "Cargando los datos",
            color: "secondary",
          });
          this.countries = "";
          await axios
            .get(`https://api.covid19api.com/total/country/${p}`)
            .then((response) => {
              this.countries = response.data;
              let totalcasosdeldia = 0;
              let diaanterior = 0;
              let casosdeldia1 = 0;
              let dia = 0;
              var tok = this.token1;
              this.countries.map( async function(country) {
                  totalcasosdeldia = country.Confirmed;
                  if (diaanterior != totalcasosdeldia) {
                    casosdeldia1 = totalcasosdeldia - diaanterior;
                  }
                  diaanterior = totalcasosdeldia;
                  let data = {
                    pais: country.Country,
                    fecha: country.Date,
                    casosdeldia: casosdeldia1,
                    totalConfirmados: country.Confirmed,
                    casosActivos: country.Active,
                    casosRecuperados: country.Recovered,
                    totalMuertes: country.Deaths,
                  };
                 let datos = await axios.get(
                  `http://localhost:1337/casos-pais?fecha=${country.Date}&pais=${p}`,
                  {
                    headers: {
                      Authorization: `Bearer ${tok}`,
                    },
                  }
                );
                if (datos.data[0] != undefined) {
                  console.log(" Ya hay datos en esta fecha");
                } else {
                  console.log("no hay datos para esta fecha");
                   axios.post("http://localhost:1337/casos-pais", data, {
                    headers: {
                      Authorization: `Bearer ${tok}`,
                    },
                  });
                  console.log("dia cargado");
                } 
              });
            });
          //muestro mensaje
        await this.mostrarSnackbar();
        } catch (error) {
          console.log(error);
        } finally {
         await this.ocultarLoading();
        }
      }
    },
    mostrarSnackbar(){
       this.snackbar = true;
          this.textSnackbar = "Los datos fueron actualizados";
    }
  },
  mounted() {
    if (this.authenticated.estado === false) {
      this.authenticated.popup = true;
    }
  },
};
</script>
