<template>
  <v-layout row wrap class="home">
    <v-flex xs12 md6 pa-4>
      <v-card dark tile color="secondary" :height="420">
        <v-toolbar flat dense dark color="primary" :height="40">
          <v-toolbar-title>Option</v-toolbar-title>
        </v-toolbar>
        <v-card-text>I'm text</v-card-text>
      </v-card>
    </v-flex>
    <v-flex xs12 md6 pa-4>
      <v-card dark tile color="secondary" :height="420">
        <v-toolbar flat dense dark color="primary" :height="40">
          <v-toolbar-title>Log</v-toolbar-title>
        </v-toolbar>
        <v-card-text>I'm text</v-card-text>
      </v-card>
    </v-flex>
    <v-flex xs12 pa-4>
      <v-card dark tile color="secondary">
        <v-card-title>I'm a Table</v-card-title>
      </v-card>
    </v-flex>
  </v-layout>
</template>

<script>
export default {
  name: 'Home',
};
</script>
