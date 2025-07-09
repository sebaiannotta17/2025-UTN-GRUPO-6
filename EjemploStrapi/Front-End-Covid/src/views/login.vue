<template>
  <v-container>
    <Toolbarprop titulo="Ingreso a la BD" />
    <v-row align="center" justify="center">
      <v-col cols="12" sm="8" md="4">
        <v-card class="elevation-12">
          <v-toolbar color="indigo" dark flat>
            <v-toolbar-title>Ingresar a Strapi</v-toolbar-title>
            <v-spacer></v-spacer>
          </v-toolbar>
          <v-card-text>
            <v-form>
              <v-text-field
                label="Usuario"
                name="login"
                prepend-icon="mdi-account"
                type="text"
                :value="login"
                v-model="login"
              ></v-text-field>
              <v-text-field
                id="password"
                label="Contraseña"
                name="password"
                prepend-icon="mdi-lock"
                type="password"
                :value="password"
                v-model="password"
              ></v-text-field>
            </v-form>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn @click="logStrapi(login, password)" color="indigo"
              >Ingresar</v-btn
            >
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
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
  data() {
    return {
      login: "user@covid.com",
      password: "123456",
    };
  },
  computed: {
    ...mapState(["token1", "authenticated"]),
  },
  methods: {
    ...mapMutations(["asignartoken", "authenticatedT"]),
    onLoginClick(e) {
      auth.logIn();
    },
    async logStrapi(u, p) {
      await axios
        //.post("https://damp-earth-29430.herokuapp.com/auth/local", {
        .post("http://localhost:1337/auth/local", {
          identifier: `${u}`,
          password: `${p}`,
        })
        .then((response) => {
          this.token = response.data.jwt;
          this.asignartoken(this.token);
        });
      await this.$router.push(this.$route.query.redirect || "/");
      await this.authenticatedT();
      this.authenticated.popup = false;
    },
  },
  props: {
    source: String,
  },
};
</script>
