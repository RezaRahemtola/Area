import {JobData} from "../proto/area_types";
import {AreaBackServiceClient, JobError} from "../proto/area_back";

export async function onReaction(client:  AreaBackServiceClient, data: JobData) {
    return new Promise((resolve, reject) => {
        client.onReaction(data, (err, res) => {
            if (!err) {
                resolve(res)
            } else {
                reject(err)
            }
        })
    })
}

export async function onError(client:  AreaBackServiceClient, data: JobError) {
    return new Promise((resolve, reject) => {
        client.onError(data, (err, res) => {
            if (!err) {
                resolve(res)
            } else {
                reject(err)
            }
        })
    })
}
