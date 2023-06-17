import { writable } from 'svelte/store'
import { db } from '../firebase'

export const Resources = writable([])
export const Employees = writable([])

export const DeleteEmployee = (uid) => {
    let query = db.collection('employees').where('uid', '==', uid)
    let employee = {}
    query.get().then((snapShot) => {
        snapShot.forEach(doc => {
            employee = doc.data()
            console.log(`DeleteEmployee employee`, employee)
        })
    })
}