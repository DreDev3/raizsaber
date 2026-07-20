import axios from 'axios';

const apiKey = process.env.ASAAS_API_KEY;
const apiUrl = process.env.ASAAS_API_URL;

if(!apiKey || !apiUrl) {
  throw new Error ('As variáveis de ambiente ASAA_API_KEY e ASAA_API_URL devem estar definidas.');
}

export const asaasApi = axios.create({
  baseURL: apiUrl,
  headers: {
    'Access-Token': apiKey
  }
});