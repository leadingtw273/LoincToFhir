import axios from 'axios';

export default class API {
  constructor(baseUrl) {
    this.baseUrl = baseUrl;
  }

  async getResoure(resourceType, params = {}) {
    return await axios.get(`${this.baseUrl}/${resourceType}`, {
      params: {
        _format: 'json',
        ...params,
      },
    });
  }

  async postResource(resourceType, payload, params = {}) {
    return await axios.post(`${this.baseUrl}/${resourceType}`, payload, {
      params: {
        _format: 'json',
        ...params,
      },
    });
  }
}
