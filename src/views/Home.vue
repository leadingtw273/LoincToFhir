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
                :disabled="optionDisable"
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
                :disabled="optionDisable"
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
                :disabled="optionDisable"
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
                :disabled="optionDisable"
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
                :disabled="optionDisable"
              ></v-file-input>
            </v-flex>
          </v-layout>
          <v-divider class="my-3"></v-divider>
          <v-layout row justify-center>
            <v-flex shrink pa-0 pr-2>
              <v-btn
                v-if="importCount == 0"
                color="accent"
                @click.native="importFHIR(importData)"
                :min-width="200"
                :disabled="importBtnDisable"
              >
                <v-icon left>backup</v-icon>
                <span>匯入</span>
              </v-btn>
              <v-btn
                v-else
                color="accent"
                @click.native="reset()"
                :min-width="200"
                :disabled="importBtnDisable"
              >
                <v-icon left>settings_backup_restore</v-icon>
                <span>重置</span>
              </v-btn>
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
          <v-progress-linear height="30" :value="progressValue">
            <span>{{ progressText }}</span>
          </v-progress-linear>
          <the-log-sheet ref="logSheet" />
        </v-container>
      </v-card>
    </v-flex>
    <v-flex xs12 pa-4 v-if="errorData.length !== 0">
      <the-table
        :category="importConfig.category"
        :dataList="errorParseData"
        :title="'ErrorData'"
      >
        <template v-slot:button>
          <v-btn
            color="danger"
            :href="errorHref"
            download="errorData.json"
            :min-width="150"
            :disabled="errorBtnDisable"
          >
            <v-icon left>get_app</v-icon>
            下載錯誤資料
          </v-btn>
          <v-btn
            color="accent"
            @click.native="importFHIR(errorParseData)"
            class="ml-2"
            :min-width="150"
            :disabled="importBtnDisable"
          >
            <v-icon left>backup</v-icon>
            <span>重新匯入</span>
          </v-btn>
          <v-spacer></v-spacer>
        </template>
      </the-table>
    </v-flex>
    <v-flex xs12 pa-4>
      <the-table :category="importConfig.category" :dataList="importData" />
    </v-flex>
  </v-layout>
</template>

<script>
import API from '../services/api.js';
import ParsedData from '../util/ParsedData.js';
import FHIRImport from '../services/FHIRImport.js';
import TheLogSheet from '../components/TheLogSheet';
import TheTable from '../components/TheTable';

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
  components: {
    TheLogSheet,
    TheTable,
  },
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
      importCount: 0,
      importLength: 0,
      errorData: [],
      loading: false,
    };
  },
  computed: {
    targetServer() {
      return this.importConfig.server;
    },
    targetFile() {
      return this.importConfig.file;
    },
    progressText() {
      const { server, organization, file } = this.importConfig;
      if (!this.loading) {
        if (server == null) return 'Please select the Server';
        if (organization == null) return 'Please select the Organization';
        if (file == null) return 'Please upload the File';
        if (this.progressValue === 100) return 'Import finish';
        return 'Ready to import!';
      }

      return this.progressValue + '%';
    },
    progressValue() {
      if (this.importCount === 0) return 0;
      return Math.ceil((this.importCount / this.importLength) * 100);
    },
    importBtnDisable() {
      const props = [];
      for (let prop in this.importConfig) {
        props.push(this.importConfig[prop]);
      }
      return this.loading || !props.every(e => e != null);
    },
    optionDisable() {
      return this.loading || this.importCount !== 0;
    },
    errorBtnDisable() {
      return this.loading || this.errorData.length == 0;
    },
    errorHref() {
      return (
        'data:text/json;charset=utf-8,' +
        encodeURIComponent(JSON.stringify(this.errorData))
      );
    },
    errorParseData() {
      return this.errorData.map(({ Data }) => Data);
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
    async importFHIR(orgDataList) {
      const dataList = JSON.parse(JSON.stringify(orgDataList));
      const log = this.$refs.logSheet;

      this.loading = true;
      this.errorData = [];
      this.importLength = dataList.length;

      const { server, organization } = this.importConfig;
      const fhir = new FHIRImport(server, organization);

      log.line();
      for (let index = 0; index < dataList.length; index++) {
        this.importCount = index + 1;
        const data = dataList[index];

        try {
          const patient_id = await fhir.importPatient(data);
          log.print(`[已匯入] Patient ${patient_id}`);

          const practitioner_id = await fhir.importPractitioner(data);
          log.print(`[已匯入] Practitioner ${practitioner_id}`);

          const encounter_id = await fhir.importEncounter(
            patient_id,
            practitioner_id,
            data
          );
          log.print(`[已匯入] Encounter ${encounter_id}`);

          const procedureRequest_id = await fhir.importProcedureRequest(
            patient_id,
            encounter_id,
            practitioner_id,
            data
          );
          log.print(`[已匯入] ProcedureRequest ${procedureRequest_id}`);

          const observation_id = await fhir.importObservation(
            patient_id,
            encounter_id,
            procedureRequest_id,
            data
          );
          log.print(`[已匯入] Observation ${observation_id}`);
          log.line();
        } catch (err) {
          if (err.response != null) {
            log.print(
              `[匯入失敗] ${err.response.data.issue[0].diagnostics}`,
              'danger'
            );
            log.line();
            this.errorData.push({
              ErrorMessage: err.response.data.issue[0].diagnostics,
              Data: data,
            });
          }
        }
      }

      log.print('All data import finish!', 'primary');

      if (this.errorData.length !== 0) {
        log.line();
        this.errorData.forEach(({ ErrorMessage, Data }, index) => {
          log.print(`[ Index: ${index} ]`, 'danger');
          log.print(`message: ${ErrorMessage}`, 'danger');
          log.print(`data: ${Data}`, 'danger');
          log.line();
        });
        log.print(`Find ${this.errorData.length} errors.`, 'danger');
      }

      this.loading = false;
    },
    reset() {
      this.importConfig.file = null;
      this.importCount = 0;
      this.importData = [];
      this.errorData = [];
      this.$refs.logSheet.clear();
    },
  },
};
</script>
