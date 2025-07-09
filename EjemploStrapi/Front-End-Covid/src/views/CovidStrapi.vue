<template>
  <v-container>
    <Toolbarprop titulo="Casos diarios por pais" />
    <v-spacer></v-spacer>
    <v-flex>
      <v-container fluid>
        <v-row align="center">
          <v-col cols="12">
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
        </v-row>
      </v-container>
    </v-flex>
    <v-row xs12>
      <v-col>
        <v-card>
          <v-date-picker
            v-model="fecha"
            color="accent"
            full-width
            locale="es"
            :min="minimo"
            :max="maximo"
            @change="getconfirmadosdeldia(fecha, selected)"
          >
          </v-date-picker>
        </v-card>
        <v-card color="success" dark>
          <v-card-text class="display-1 text-center">
            {{ mensaje }} {{ casosdeldia }}
          </v-card-text>
          <v-card-actions>
            <v-btn
              color="info"
              @click="descripcion = true"
              v-bind:disabled="habilitarBtn"
              >Ver +</v-btn
            >
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
    <v-dialog v-model="descripcion" width="500">
      <v-card>
        <v-card-title>Detalle de los casos del dia seleccionado</v-card-title>
        <v-card-text class="px-4 pt-4 pb-3">
          <p class="text-justify ">
            El día {{ this.fecha }} se confirmaron un total de casos positivos
            de Covid-19 de {{ this.totalConfirmados }} en {{ this.selected }},
            el total de casos activos es de {{ this.casosActivos }}, el total de
            personas recuperadas es {{ this.casosRecuperados }} y las muertes
            confirmadas hasta el momento son {{ this.totalMuertes }}.
          </p>
        </v-card-text>
        <v-divider></v-divider>
        <v-card-actions>
          <v-btn color="info" @click="descripcion = false">Cerrar</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-card> </v-card>
  </v-container>
</template>
<script>
import Toolbarprop from "../components/Toolbar";
import axios from "axios";
import { mapMutations } from "vuex";
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
      titulo: " Casos diarios por pais",
      descripcion: false,
      selected: "Argentina",
      paises: ["Argentina", "Brazil", "Chile", "Uruguay"],
      fecha: new Date().toISOString().substr(0, 10),
      minimo: "2020",
      maximo: new Date().toISOString().substr(0, 10),
      casosdeldia: null,
      totalConfirmados: null,
      casosActivos: null,
      casosRecuperados: null,
      totalMuertes: null,
      mensaje: " ",
      pais: "",
      habilitarBtn: true,
    };
  },
  methods: {
    ...mapMutations(["mostrarLoading", "ocultarLoading"]),
    async getconfirmadosdeldia(dia, p) {
      try {
        this.mostrarLoading({
          titulo: "Buscando los datos",
          color: "secondary",
        });
        let datos = await axios.get(
          `http://localhost:1337/casos-pais?fecha=${dia}&pais=${p}`,
          {
            headers: {
              Authorization: `Bearer ${this.token1}`,
            },
          }
        );
        if (datos.data[0].casosdeldia > 0) {
          this.casosdeldia = await datos.data[0].casosdeldia;
          this.totalConfirmados = await datos.data[0].totalConfirmados;
          this.casosActivos = await datos.data[0].casosActivos;
          this.casosRecuperados = await datos.data[0].casosRecuperados;
          this.totalMuertes = await datos.data[0].totalMuertes;
          this.mensaje = `Los nuevos casos confirmados este dia en  ${p} fueron:`;
          this.habilitarBtn = false;
        } else {
          this.casosdeldia = "";
          this.mensaje = "No hay casos registrados en ese dia";
          this.habilitarBtn = true;
        }
      } catch (error) {
        console.log(error);
        this.mensaje = "No hay casos registrados en ese dia";
        this.casosdeldia = null;
        this.habilitarBtn = true;
      } finally {
        this.ocultarLoading();
      }
    },
  },
  mounted() {
    if (this.authenticated.estado === false) {
      this.authenticated.popup = true;
    }
  },
  created() {},
};
</script>
