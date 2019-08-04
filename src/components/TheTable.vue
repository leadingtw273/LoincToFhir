<template>
  <v-data-table
    dark
    :headers="headers"
    :items="dataList"
    :items-per-page="5"
    :search="search"
    no-data-text="Please upload the file"
    class="elevation-1 table"
  >
    <template v-slot:top>
      <v-toolbar color="primary" height="40">
        <v-toolbar-title>Table</v-toolbar-title>

        <v-divider class="mx-4" inset vertical></v-divider>
        <v-text-field
          v-model="search"
          append-icon="search"
          label="Search"
          single-line
          hide-details
        ></v-text-field>
      </v-toolbar>
    </template>
  </v-data-table>
</template>

<script>
export default {
  name: 'TheTable',
  props: ['category', 'dataList'],
  data() {
    return {
      search: '',
      patientHeaders: [
        { text: '病歷號', value: '病歷號' },
        { text: '身分證字號', value: '身分證字號' },
        { text: '就醫序號', value: '就醫序號' },
        { text: '申請序號', value: '申請序號' },
        { text: '就醫類別', value: '就醫類別' },
        { text: '性別', value: '性別' },
        { text: '生日', value: '生日' },
        { text: '就醫日期/入院日期', value: '就醫日期/入院日期' },
        { text: '離院日期', value: '離院日期' },
        { text: '年齡', value: '年齡' },
        { text: '檢驗細項結果名稱', value: '檢驗細項結果名稱' },
        { text: '開立日期', value: '開立日期' },
        { text: '開立時間', value: '開立時間' },
        { text: '檢驗日期', value: '檢驗日期' },
        { text: '檢驗時間', value: '檢驗時間' },
        { text: '檢驗項目', value: '檢驗項目' },
        { text: '檢驗值', value: '檢驗值' },
        { text: '檢驗值正常範圍', value: '檢驗值正常範圍' },
        { text: '單位', value: '單位' },
      ],
      observationHeaders: [
        { text: '病歷號', value: '病歷號' },
        { text: '身分證字號', value: '身分證字號' },
        { text: '就醫序號', value: '就醫序號' },
        { text: '申請序號', value: '申請序號' },
        { text: '性別', value: '性別' },
        { text: '生日', value: '生日' },
        { text: '就醫日期/入院日期', value: '就醫日期/入院日期' },
        { text: '離院日期', value: '離院日期' },
        { text: '檢查日期', value: '檢查日期' },
        { text: '檢查時間', value: '檢查時間' },
        { text: '名稱縮寫', value: '名稱縮寫' },
        { text: '內容值', value: '內容值' },
      ],
    };
  },
  computed: {
    headers() {
      switch (this.category) {
        case 'patient':
          return this.patientHeaders;
        case 'observation':
          return this.observationHeaders;
      }
      return this.patientHeaders;
    },
  },
};
</script>

<style lang="scss" scoped>
.table {
  background-color: #263238 !important ;
  white-space: nowrap !important;
}
</style>
