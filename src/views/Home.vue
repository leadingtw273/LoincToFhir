<template>
  <v-layout row wrap class="home">
    <v-flex xs12 md6 pa-4>
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
                :items="serverList"
                v-model="importConfig.server"
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
                :items="organizationList"
                v-model="importConfig.organization"
                no-data-text="Please select the FHIR Server"
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
              <v-radio-group
                row
                hide-details
                class="ma-0"
                v-model="importConfig.fileType"
              >
                <v-radio label="CSV" value=".csv"></v-radio>
                <v-radio label="JSON" value=".json"></v-radio>
                <v-radio label="XML" value=".xml"></v-radio>
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
              <v-radio-group
                row
                hide-details
                class="ma-0"
                v-model="importConfig.category"
              >
                <v-radio label="標準化病人資料" value="patient"></v-radio>
                <v-radio label="檢驗資料" value="observation"></v-radio>
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
                v-model="importConfig.file"
                :accept="importConfig.fileType"
              ></v-file-input>
            </v-flex>
          </v-layout>
          <v-divider class="my-3"></v-divider>
          <v-layout row justify-center>
            <v-flex shrink pa-0 pr-2>
              <v-btn
                color="accent"
                @click.native="importFHIR()"
                :disabled="!disableImportBtn"
                >Import</v-btn
              >
            </v-flex>
            <v-flex shrink pa-0 pl-2>
              <v-btn color="danger" disabled>錯誤資料</v-btn>
            </v-flex>
          </v-layout>
        </v-container>
      </v-card>
    </v-flex>
    <v-flex xs12 md6 pa-4>
      <v-card dark tile color="secondary" :min-height="420">
        <v-toolbar flat dense dark color="primary" :height="40">
          <v-toolbar-title>Log</v-toolbar-title>
        </v-toolbar>
        <v-container grid-list-xs>
          <v-progress-linear height="30">
            <span>Please upload the file</span>
          </v-progress-linear>
        </v-container>
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
import API from '../services/api.js';
import ParsedData from '../util/ParsedData.js';
import FHIRImport from '../services/FHIRImport.js';

function readFile(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onerror = reject;
    reader.onload = () => {
      resolve(reader.result);
    };

    reader.readAsText(file);
  });
}

export default {
  name: 'Home',
  data() {
    return {
      serverList: [
        'https://hapi.fhir.tw/baseDstu3',
        'http://hapi.fhir.org/baseR4',
      ],
      organizationList: [],
      importConfig: {
        server: null,
        organization: null,
        fileType: '.csv',
        category: 'patient',
        file: null,
      },
      importData: [],
    };
  },
  computed: {
    targetServer() {
      return this.importConfig.server;
    },
    targetFile() {
      return this.importConfig.file;
    },
    disableImportBtn() {
      const props = [];
      for (let prop in this.importConfig) {
        props.push(this.importConfig[prop]);
      }
      return props.every(e => e != null);
    },
  },
  watch: {
    async targetServer(val) {
      if (val == null) return;

      const api = new API(val);
      const { data } = await api.getResoure('Organization');

      this.organizationList = data.entry.map(({ resource }) => {
        const { id, name } = resource;
        return { value: id, text: name };
      });
    },
    async targetFile(val) {
      if (val == null) return;

      const data = await readFile(val);

      const { fileType, category } = this.importConfig;
      this.importData = ParsedData(data, fileType, category);
    },
  },
  methods: {
    async importFHIR() {
      const { server, organization } = this.importConfig;
      const fhir = new FHIRImport(server, organization);

      for (let index = 0; index < this.importData.length; index++) {
        const data = this.importData[index];

        const patient_id = await fhir.importPatient(data);
        const practitioner_id = await fhir.importPractitioner(data);
        const encounter_id = await fhir.importEncounter(
          patient_id,
          practitioner_id,
          data
        );
        const procedureRequest_id = await fhir.importProcedureRequest(
          patient_id,
          encounter_id,
          practitioner_id,
          data
        );
        await fhir.importObservation(
          patient_id,
          encounter_id,
          procedureRequest_id,
          data
        );
      }
      // console.log(this.importData);
    },
  },
};
</script>
