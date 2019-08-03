import API from './api.js';

export default class FHIR {
  constructor(baseUrl, organization) {
    this.api = new API(baseUrl);
    this.organization = organization;
  }

  // 病患
  async importPatient(data) {
    if (data['病歷號'] == null) return '';

    const dataId = await this.checkResource(
      'Patient',
      'HospitalID|' + data['病歷號']
    );
    if (dataId != null) return dataId;

    const payload = {
      resourceType: 'Patient',
      identifier: [
        {
          use: 'official',
          system: 'HospitalID',
          value: data['病歷號'],
        },
        {
          use: 'official',
          system: 'UID',
          value: data['身分證字號'] || '',
        },
      ],
      gender:
        data['性別'] != null ? (data['性別'] == 'M' ? 'male' : 'female') : '',
      birthDate: data['生日'] || '',
      managingOrganization: {
        reference: 'Organization/' + this.Organization,
      },
    };

    return await this.importResource('Patient', payload);
  }

  // 醫生
  async importPractitioner(data) {
    if (data['開立醫師卡號'] == null) return '';

    const dataId = await this.checkResource(
      'Practitioner',
      data['開立醫師卡號']
    );
    if (dataId != null) return dataId;

    const payload = {
      resourceType: 'Practitioner',
      identifier: {
        use: 'official',
        value: data['開立醫師卡號'],
      },
      active: 'true',
      managingOrganization: {
        reference: 'Organization/' + this.Organization,
      },
    };

    return await this.importResource('Practitioner', payload);
  }

  // 就診資訊
  async importEncounter(patient_id, practitioner_id, data) {
    if (data['就醫序號'] == null) return '';

    const dataId = await this.checkResource('Encounter', data['就醫序號']);
    if (dataId != null) return dataId;

    const payload = {
      resourceType: 'Encounter',
      identifier: {
        use: 'official',
        value: data['就醫序號'],
      },
      subject: {
        reference: 'Patient/' + patient_id,
      },
      participant: {
        individual: {
          reference:
            practitioner_id != '' ? 'Practitioner/' + practitioner_id : '',
        },
      },
      period: {
        start: data['就醫日期/入院日期'] || '',
        end: data['離院日期'] || '',
      },
    };

    return await this.importResource('Encounter', payload);
  }

  // 診斷說明
  async importProcedureRequest(
    patient_id,
    encounter_id,
    practitioner_id,
    data
  ) {
    if (data['申請序號'] == null) return '';

    const payload = {
      resourceType: 'ProcedureRequest',
      identifier: {
        use: 'official',
        value: data['申請序號'],
      },
      status: 'completed',
      intent: 'order',
      code: {
        text: '99999',
      },
      subject: {
        reference: 'Patient/' + patient_id,
      },
      context: {
        reference: 'Encounter/' + encounter_id,
      },
      requester: {
        reference: 'Organization/' + this.Organization,
      },
      occurrenceDateTime:
        data['開立日期'] != null && data['開立時間'] != null
          ? data['開立日期'] + 'T' + data['開立時間']
          : '',
      //"authoredOn": "2010-10-01T07:49:00"
    };

    if (practitioner_id !== '') {
      payload.requester.agent = 'Practitioner/' + practitioner_id;
    }

    return await this.importResource('ProcedureRequest', payload);
  }

  // 診斷報告
  async importObservation(patient_id, encounter_id, procedureRequest_id, data) {
    let payload = {};

    if (data['內容集合'] != null) {
      // 骨密資料

      payload = {
        resourceType: 'Observation',
        basedOn: {
          reference: 'ProcedureRequest/' + procedureRequest_id,
        },
        status: 'final',
        category: {
          coding: {
            system: 'http://hl7.org/fhir/ValueSet/observation-category',
            code: 'laboratory',
          },
        },
        code: {
          coding: {
            system: 'http://loinc.org',
            code: getLoincCode(data['內容集合']).code,
            display: getLoincCode(data['內容集合']).name,
          },
        },
        method: {
          coding: {
            system: 'http://loinc.org',
            display: data['內容集合']['METHOD'],
          },
        },
        subject: {
          reference: 'Patient/' + patient_id,
        },
        context: {
          reference: 'Encounter/' + encounter_id,
        },
        valueQuantity: {
          value: data['內容集合']['TSCORE'],
          unit: 'mg/dL',
        },
        effectiveDateTime:
          data['開立日期'] != null && data['開立時間'] != null
            ? data['開立日期'] + 'T' + data['開立時間']
            : '',
        comment: 'T-Score',
      };
    } else {
      // 標準化病人

      payload = {
        resourceType: 'Observation',
        basedOn: {
          reference: 'ProcedureRequest/' + procedureRequest_id,
        },
        status: 'final',
        category: [
          {
            coding: {
              system: 'http://hl7.org/fhir/ValueSet/observation-category',
              code: 'vital-signs',
            },
            text: '53.0',
          },
          {
            coding: {
              system: 'http://hl7.org/fhir/ValueSet/observation-category',
              code: 'laboratory',
            },
          },
        ],
        code: {
          coding: {
            system: 'http://loinc.org',
            display: data['檢驗項目'] || '0',
          },
        },
        subject: {
          reference: 'Patient/' + patient_id,
        },
        context: {
          reference: 'Encounter/' + encounter_id,
        },
        effectiveDateTime:
          data['檢驗日期'] != null && data['檢驗時間'] != null
            ? data['檢驗日期'] + 'T' + data['檢驗時間']
            : '',
        valueQuantity: {
          value: data['檢驗值'] || '0',
          unit: data['單位'] || '0',
        },
        interpretation: {
          coding: {
            system: 'http://hl7.org/fhir/v2/0078',
            code: interpretationCheck(
              data['檢驗值'] || '0',
              data['檢驗值正常範圍'] != null
                ? data['檢驗值正常範圍'].split('-')
                : [0, 0]
            )
              ? 'Y'
              : 'N',
          },
        },
        referenceRange: {
          low: {
            value: (data['檢驗值正常範圍'] != null
              ? data['檢驗值正常範圍'].split('-')
              : [0, 0])[0],
            unit: data['單位'] || '0',
          },
          high: {
            value: (data['檢驗值正常範圍'] != null
              ? data['檢驗值正常範圍'].split('-')
              : [0, 0])[1],
            unit: data['單位'] || '0',
          },
        },
      };
    }

    return await this.importResource('Observation', payload);
  }

  async checkResource(resourceType, identifier) {
    const { data: resData } = await this.api.getResoure(resourceType, {
      identifier,
    });
    const { total, entry } = resData;
    if (total === 0) return null;

    const id = entry[entry.length - 1].resource.id;

    return id;
  }

  async importResource(resourceType, payload) {
    try {
      const { data } = await this.api.postResource(resourceType, payload);
      const str = data.issue[0].diagnostics;
      const id = str.substring(
        str.indexOf(resourceType) + resourceType.length + 1,
        str.indexOf('/_')
      );

      return id;
    } catch (err) {
      throw err;
    }
  }
}

function interpretationCheck(val, range) {
  const value = parseFloat(val);
  if (parseFloat(range[0]) === parseFloat(range[1])) {
    return value == parseFloat(range[0]);
  }
  const min = range[0] ? parseFloat(range[0]) : null;
  const max = range[1] ? parseFloat(range[1]) : null;
  return (min ? min < value : true) && (max ? value < max : true);
}

function getLoincCode(data) {
  const lonic_map = [
    {
      name: 'Bone densitometry, AP L-spine',
      code: '38267-1-0',
    },
    {
      name: 'Bone densitometry, AP & Lat L-sp',
      code: '38267-2-1',
    },
    {
      name: 'Bone densitometry, Rt hip',
      code: '80945-9-0',
    },
    {
      name: 'Bone densitometry, Lt hip',
      code: '80946-7-0',
    },
    {
      name: 'Bone densitometry, Rt hip(prost)',
      code: '80945-9-1',
    },
    {
      name: 'Bone densitometry, Lt hip(prost)',
      code: '80946-7-1',
    },
    {
      name: 'Bone densitometry, Rt forearm',
      code: '80943-4',
    },
    {
      name: 'Bone densitometry, Lt forearm',
      code: '80944-2',
    },
    {
      name: 'Bone densitometry, Whole body',
      code: '99999-0',
    },
    {
      name: 'Bone densitometry, Body composit',
      code: '99999-1',
    },
  ];

  let lonic = 0;
  for (let i in lonic_map) {
    // 清除中文字
    const ITEM = data['ITEM'].replace(/[^0-9A-Za-z\s]/g, '');
    const PART = data['PART'].replace(/[^0-9A-Za-z\s]/g, '');

    if (
      lonic_map[i].name.split(', ').includes(ITEM) &&
      lonic_map[i].name.split(', ').includes(PART)
    )
      lonic = i;
  }
  return lonic_map[lonic];
}
