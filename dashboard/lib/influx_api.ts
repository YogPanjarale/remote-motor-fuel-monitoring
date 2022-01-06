import { InfluxDB,Point } from "@influxdata/influxdb-client";
// You can generate an API token from the "API Tokens Tab" in the UI
const token = process.env.INFLUX_TOKEN;
const org = 'yog.panjarale@gmail.com'
const bucket = 'rfms'

const client = new InfluxDB({url: 'https://europe-west1-1.gcp.cloud2.influxdata.com', token: token})

const writeApi = client.getWriteApi(org, bucket)
writeApi.useDefaultTags({host: 'host1'})

const queryApi = client.getQueryApi(org)


function query (q: string) : Promise<any>  {
    return new Promise((resolve, reject) => {
        let result = []
        queryApi.queryRows(q,{
            next(row, tableMeta) {
                const o = tableMeta.toObject(row)
                result.push(o)
                console.log(`${o._time} ${o._measurement}: ${o._field}=${o._value}`)
              },
              error(error) {
                console.error(error)
                console.log('Finished ERROR')
                reject(error)
              },
              complete() {
                console.log('Finished SUCCESS')
                resolve(result)
              },

        })
    });
}

export {writeApi,queryApi,query};