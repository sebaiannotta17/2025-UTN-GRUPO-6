<template>
  <v-container>
    <v-app-bar app>
      <v-toolbar color="secondary" src="../assets/imagen2.jpg" dark shaped>
        <v-app-bar-nav-icon @click="drawer = !drawer"></v-app-bar-nav-icon>

        <v-toolbar-title>
          <h3>Trabajo Práctico 2</h3>
        </v-toolbar-title>

        <v-spacer></v-spacer>
        <v-btn
          href="https://leosfigueira.github.io/Projecto-con-API/twiterPostEnb.html"
          target="_blank"
          text
        >
          <span class="mr-2">Trabajo práctico 1</span>
          <v-icon>mdi-open-in-new</v-icon>
        </v-btn>
      </v-toolbar>
    </v-app-bar>
    <v-navigation-drawer
      app
      src="../assets/drawer2.jpg"
      v-model="drawer"
      temporary
      dark
    >
      <v-layout mt-4 column align-center>
        <v-flex>
          <v-avatar :size="130">
            <v-img
              @click="$router.push('/')"
              src="../assets/Leo-2020-2.jpg"
            ></v-img>
          </v-avatar>
        </v-flex>
        <v-flex>
          <p class="white--text mt-3 headline">Leonel Figueira</p>
        </v-flex>

        <v-divider></v-divider>

        <v-list>
          <v-list-item
            v-for="item in items"
            :key="item.title"
            link
            :to="item.route"
          >
            <v-list-item-icon>
              <v-icon color="black">{{ item.icon }}</v-icon>
            </v-list-item-icon>

            <v-list-item-content>
              <v-list-item-title>{{ item.title }}</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-list>
      </v-layout>
    </v-navigation-drawer>
  </v-container>
</template>

<script>
export default {
  data: () => ({
    drawer: null,
    items: [
      {
        title: "Cargar Strapi",
        icon: "mdi-cloud-upload",
        route: "CargardesdeAPI",
      },
      {
        title: "Casos diarios",
        icon: "mdi-calendar-range-outline",
        route: "covidStrapi",
      },
      {
        title: "Curva de contagios",
        icon: "mdi-chart-bell-curve",
        route: "Curvadecontagios",
      },
      {
        title: "Grafico comparativo",
        icon: "mdi-earth-off",
        route: "Graficomundial",
      },
      {
        title: "Tabla estadística",
        icon: "mdi-map-search-outline",
        route: "Covid",
      },
       {
        title: "MS - Mapa Covid 19",
        icon: "mdi-map",
        route: "/MapaCovid19mSalud",
      },
      {
        title: "Login Strapi",
        icon: "mdi-account-arrow-right",
        route: "/login",
      },
     
    ],
  }),
  computed: {},
};
</script>
