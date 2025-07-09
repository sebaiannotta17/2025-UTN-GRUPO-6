<template>
  <v-container>
    <v-toolbar color="indigo" dark shaped>
      <v-toolbar-title>Covid 19 - Estadísticas</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn icon color="green" @click="$router.push('/login')">
        <v-icon>mdi-login</v-icon>
      </v-btn>
      <v-btn icon color="green" @click="$router.push('/')">
        <v-icon>mdi-home</v-icon>
      </v-btn>
    </v-toolbar>
    <v-card class="mx-auto mt-3">
      <v-container fluid>
        <v-row dense>
          <v-col cols="12" md="6">
            <v-card>
              <v-img
                src="../assets/imagen3.jpg"
                class="white--text align-end"
                gradient="to bottom, rgba(0,0,0,.1), rgba(0,0,0,.5)"
                height="200px"
              >
                <v-card-title>Estadística por país</v-card-title>
              </v-img>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="success" @click="$router.push('/covidStrapi')">
                  Estadísticas
                  <v-icon right dark>mdi-calendar</v-icon>
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-col>
          <v-col cols="12" md="6">
            <v-card>
              <v-img
                src="../assets/imagen4.jpg"
                class="white--text align-end"
                gradient="to bottom, rgba(0,0,0,.1), rgba(0,0,0,.5)"
                height="200px"
              >
                <v-card-title>Curva de contagios</v-card-title>
              </v-img>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn
                  color="success"
                  @click="$router.push('/curvadecontagios')"
                >
                  Curva de contagios
                  <v-icon right dark>mdi-calendar</v-icon>
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-col>
          <v-col cols="12" md="4">
            <v-card>
              <v-img
                src="../assets/globo.jpg"
                class="white--text align-end"
                gradient="to bottom, rgba(0,0,0,.1), rgba(0,0,0,.5)"
                height="200px"
              >
                <v-card-title>Resumen diario global</v-card-title>
              </v-img>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn icon color="green"></v-btn>
                <v-btn color="success" @click="$router.push('/covid')">
                  Resumen Global
                  <v-icon right dark>mdi-globe-model</v-icon>
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-col>
          <v-col cols="12" md="4">
            <v-card>
              <v-img
                src="../assets/imagen7.jpg"
                class="white--text align-end"
                gradient="to bottom, rgba(0,0,0,.1), rgba(0,0,0,.5)"
                height="200px"
              >
                <v-card-title>Grafico comparativo</v-card-title>
              </v-img>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn icon color="green"></v-btn>
                <v-btn color="success" @click="$router.push('/Graficomundial')">
                  Grafico AR, BR, CH, UR
                  <v-icon right dark>mdi-globe-model</v-icon>
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-col>
          <v-col cols="12" md="4">
            <v-card>
              <v-img
                src="../assets/strapi-image.jpeg"
                class="white--text align-end"
                gradient="to bottom, rgba(0,0,0,.1), rgba(0,0,0,.5)"
                height="200px"
              >
                <v-card-title>Cargar BD - Strapi</v-card-title>
              </v-img>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="success" @click="$router.push('/CargardesdeAPI')">
                  Actualizar
                  <v-icon right dark>mdi-cloud-upload</v-icon>
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </v-card>
  </v-container>
</template>
<script>
import { mapState } from "vuex";
export default {
  data: () => ({}),
  methods: {
    consola() {
      console.log(this.authenticated.estado);
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
