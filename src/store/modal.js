import { writable } from "svelte/store";

/* export const modalData = writable({})
export const modalTitle = writable('')
export const modalType = writable('')
export const modalText = writable('') */

export const ModalData = writable({
    data: {},
    text: '',
    title: '',
    type: ''
})