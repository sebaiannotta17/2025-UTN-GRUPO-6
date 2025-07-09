<template>
  <v-app>
    <Drawer />

    <v-main>
      <router-view />

      <v-dialog v-model="loading.estado" hide-overlay persistent width="300">
        <v-card :color="loading.color" dark>
          <v-card-text>
            {{ loading.titulo }}
            <v-progress-linear
              indeterminate
              color="white"
              class="mb-0"
            ></v-progress-linear>
          </v-card-text>
        </v-card>
      </v-dialog>

      <v-dialog persistent v-model="authenticated.popup" width="500">
        <v-card>
          <v-card-title>Importante</v-card-title>
          <v-divider></v-divider>
          <v-card-text class="px-4 pt-4 pb-3">
            <h3>Para poder navegar correctamente debe ingresar a Strapi</h3>
          </v-card-text>

          <v-divider></v-divider>
          <v-card-actions>
            <v-btn color="error" @click="authenticated.popup = false"
              >Cerrar</v-btn
            >
            <v-spacer></v-spacer>
            <v-btn color="success" @click="cerrarLog()"
              >Ingresar a Strapi</v-btn
            >
          </v-card-actions>
        </v-card>
      </v-dialog>

      <Footer />
    </v-main>
  </v-app>
</template>

<script>
import { mapState } from "vuex";
import Drawer from "./components/Drawer";
import Footer from "./components/Footer";
import { mapMutations } from "vuex";
import axios from "axios";
export default {
  name: "App",

  components: {
    Drawer,
    Footer,
  },
  methods: {
    ...mapMutations(["asignartoken"]),
    cerrarLog() {
      this.authenticated.popup = false;
      console.log(this.authenticated.popup);

      this.$router.push("/login");
    },
  },

  data: () => ({
    drawer: true,
    token: "",
  }),
  computed: {
    ...mapState(["loading", "token1", "authenticated"]),
  },
};
</script>
