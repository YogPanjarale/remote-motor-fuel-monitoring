import { InfluxDB,Point } from "@influxdata/influxdb-client";
// You can generate an API token from the "API Tokens Tab" in the UI
const token = process.env.INFLUX_TOKEN;
const org = 'yog.panjarale@gmail.com'
const bucket = 'rfms'

const client = new InfluxDB({url: 'https://europe-west1-1.gcp.cloud2.influxdata.com', token: token})

const writeApi = client.getWriteApi(org, bucket)
writeApi.useDefaultTags({host: 'host1'})

const queryApi = client.getQueryApi(org)
export {writeApi,queryApi};