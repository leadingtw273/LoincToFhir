<template>
  <v-layout row wrap class="home">
    <v-flex xs12 md6 pa-3>
      <v-card dark tile color="secondary" :min-height="420">
        <v-toolbar flat dense dark color="primary" :height="40">
          <v-toolbar-title>Option</v-toolbar-title>
        </v-toolbar>
        <v-container grid-list-lg>
          <v-layout wrap>
            <v-flex
              xs12
              sm3
              md4
              :d-flex="!$vuetify.breakpoint.xsOnly"
              align-self-center
              justify-end
            >
              <span class="title text-truncate pr-5">Server</span>
            </v-flex>
            <v-flex xs12 sm9 md8>
              <v-select
                label="Select FHIR Server"
                hide-details
                outlined
              ></v-select>
            </v-flex>
            <v-flex
              xs12
              sm3
              md4
              :mt-3="$vuetify.breakpoint.xsOnly"
              :d-flex="!$vuetify.breakpoint.xsOnly"
              align-self-center
              justify-end
            >
              <span class="title text-truncate pr-5">Organization</span>
            </v-flex>
            <v-flex xs12 sm9 md8>
              <v-select
                label="Select Organization"
                hide-details
                outlined
              ></v-select>
            </v-flex>
            <v-flex
              xs12
              sm3
              md4
              :mt-3="$vuetify.breakpoint.xsOnly"
              :d-flex="!$vuetify.breakpoint.xsOnly"
              align-self-center
              justify-end
            >
              <span class="title text-truncate pr-5">File Type</span>
            </v-flex>
            <v-flex xs12 sm9 md8>
              <v-radio-group row hide-details class="ma-0">
                <v-radio label="CSV" value="radio-1"></v-radio>
                <v-radio label="JSON" value="radio-2"></v-radio>
                <v-radio label="XML" value="radio-3"></v-radio>
              </v-radio-group>
            </v-flex>
            <v-flex
              xs12
              sm3
              md4
              :mt-3="$vuetify.breakpoint.xsOnly"
              :d-flex="!$vuetify.breakpoint.xsOnly"
              align-self-center
              justify-end
            >
              <span class="title text-truncate pr-5">Type</span>
            </v-flex>
            <v-flex xs12 sm9 md8>
              <v-radio-group row hide-details class="ma-0">
                <v-radio label="骨密資料" value="radio-1"></v-radio>
                <v-radio label="標準化病人資料" value="radio-2"></v-radio>
              </v-radio-group>
            </v-flex>
            <v-flex
              xs12
              sm3
              md4
              :mt-3="$vuetify.breakpoint.xsOnly"
              :d-flex="!$vuetify.breakpoint.xsOnly"
              align-self-center
              justify-end
            >
              <span class="title text-truncate pr-5">Upload</span>
            </v-flex>
            <v-flex xs12 sm9 md8>
              <v-file-input
                label="File input"
                hide-details
                class="ma-0 pa-0"
              ></v-file-input>
            </v-flex>
          </v-layout>
          <v-divider class="my-3"></v-divider>
          <v-layout row justify-center>
            <v-flex shrink pa-0 pr-2>
              <v-btn color="accent">Import</v-btn>
            </v-flex>
            <v-flex shrink pa-0 pl-2>
              <v-btn color="danger" disabled>錯誤資料</v-btn>
            </v-flex>
          </v-layout>
        </v-container>
      </v-card>
    </v-flex>
    <v-flex xs12 md6 pa-3>
      <v-card dark tile color="secondary" :min-height="420">
        <v-toolbar flat dense dark color="primary" :height="40">
          <v-toolbar-title>Log</v-toolbar-title>
        </v-toolbar>
        <v-card-text>I'm text</v-card-text>
      </v-card>
    </v-flex>
    <v-flex xs12 pa-3>
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
