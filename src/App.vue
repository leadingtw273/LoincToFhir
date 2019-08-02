<template>
  <v-app>
    <v-content>
      <v-toolbar dark flat color="primary">
        <v-toolbar-title>EZ FHIR 資料轉換工具</v-toolbar-title>
      </v-toolbar>

      <v-container>
        <router-view></router-view>
      </v-container>
    </v-content>
  </v-app>
</template>

<script>
export default {
  name: 'App',
};
</script>

<style lang="scss">
#app {
  font-family: 'Roboto', 'Noto Sans TC', sans-serif;
  background-color: #424242;
}
</style>
