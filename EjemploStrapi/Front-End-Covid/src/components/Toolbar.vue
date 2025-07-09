<template>
  <div>
    <v-toolbar color="indigo" dark shaped>
      <v-toolbar-title>
        <h4>
          {{ titulo }}
        </h4>
      </v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn icon color="green" @click="$router.push('/login')">
        <v-icon>mdi-login</v-icon>
      </v-btn>
      <v-btn icon color="green" @click="$router.push('/')">
        <v-icon>mdi-home</v-icon>
      </v-btn>
    </v-toolbar>
  </div>
</template>
<script>
export default {
  name: "Toolbarprop",
  props: {
    titulo: "",
  },
};
</script>
