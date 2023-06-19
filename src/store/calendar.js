import { writable } from 'svelte/store'

let now = new Date()
let week = 1
let year = now.getFullYear()

const getCurrentWeekNumber = () => {
    let yearNow = new Date(now.getFullYear(), 0, 1)
    console.log(`yearNow`, yearNow)
    let days = Math.floor((now.getTime() - yearNow.getTime()) / (24 * 60 * 60 * 1000))
    console.log(`days`, days)
    let week = Math.floor((now.getDay() + days + 1) / 7)
    console.log(`week`, week)

    console.log(`current week number is ${week}`)
    return week
}
week = getCurrentWeekNumber()

const getStartOfWeek = () => {
    let simple = new Date(year, 0, ((week - 1) * 7) + 1)
    console.log('getStartOfWeek simple', simple)
    let dow = simple.getDay()
    let ISOweekStart = simple
    
    if (dow <= 4) {
        ISOweekStart.setDate(simple.getDate() - simple.getDay() + 1)
    }
    else {
        ISOweekStart.setDate(simple.getDate() - simple.getDay() + 8)
    }

    console.log(`getStartOfWeek ISOweekStart`, ISOweekStart)
    return ISOweekStart;
}

const getDaysOfWeek = () => {
    let weekStart = getStartOfWeek()
    console.log(`getDaysOfWeek weekStart`, weekStart)
    let startDate = new Date(weekStart.getFullYear(), weekStart.getMonth(), weekStart.getDate())
    let weekDays = [{
        date: startDate,
        dayOfWeek: DaysOfWeek[0],
        month: MonthsOfYear[startDate.getMonth()],
        name: GetDateName(startDate)
    }]

    for (let i=0; i<6; i++) {
        let incDate = weekStart.getDate() + 1
        weekStart.setDate(incDate)

        let newDate = new Date(weekStart.getFullYear(), weekStart.getMonth(), weekStart.getDate())
        weekDays.push({
            date: newDate,
            dayOfWeek: DaysOfWeek[i+1],
            month: MonthsOfYear[newDate.getMonth()],
            name: GetDateName(newDate)
        })
    }

    console.log(`getDaysOfWeek weekDays`, weekDays)
    WeekDays.set(weekDays)
}

// let now = new Date()
// let currentWeek = getCurrentWeekNumber()
// let currentYear = now.getFullYear()

const DaysOfWeek = [
    'Mon',
    'Tue',
    'Wed',
    'Thu',
    'Fri',
    'Sat',
    'Sun'
]

const MonthsOfYear = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec'
]

const GetDateName = (dt) => {
    // console.log('dt', dt)
    return `${MonthsOfYear[dt.getMonth()]} ${dt.getDate()}, ${dt.getFullYear()}`
}

export const Week = writable(week)
export const Year = writable(year)
export const WeekDays = writable([])

export const UpdateWeek = (value) => {
    week = value
    getDaysOfWeek()
}

export const PreviousWeek = () => {
    week--
    getDaysOfWeek()
}

export const NextWeek = () => {
    week++
    getDaysOfWeek()
}

export const ResetWeek = () => {
    now = new Date()
    week = getCurrentWeekNumber()
    year = now.getFullYear()
    getDaysOfWeek()
}

export const GetDateKey = (dt) => {
    // console.log(`+++ GetDateKey = ${dt.getFullYear()}_${dt.getMonth()}_${dt.getDate()} for date = `, dt)
    return `${dt.getFullYear()}_${dt.getMonth()}_${dt.getDate()}`
}

export const DateToString = (dt) => {}
getDaysOfWeek()

export const Settings = {
    StartHour: 6,
    EndHour: 18,
    Interval: 30,
    ViewMode: 'time'
}
export const DayData = writable({})
export const TimeOffs = writable([])
export const Holidays = writable([])
export const WeekSettings = writable({})