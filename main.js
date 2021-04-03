
window.onload = () => {
  const input = document.getElementById('year')

  const currentYear = new Date().getFullYear()
  input.value = currentYear.toString()

  let childCalendar = yearHTML(getFirstDayOfWeekInYear(currentYear), isYearLeap(currentYear))
  document.body.appendChild(childCalendar)

  document.getElementById('goCalendar').onclick = () => {
    const year = Number(input.value)
    if (isNaN(year) || year < 0 || year > 10000) {
      alert(`Wrong year: ${input.value}`)
      return false
    }
    document.body.removeChild(childCalendar)
    childCalendar = yearHTML(getFirstDayOfWeekInYear(year), isYearLeap(year))
    document.body.appendChild(childCalendar)
    return false
  }
}

/*
  1 января 2000 года - суббота
  После високосного года - прибавляется 2 дня
  После обычного года - прибавляется 1 день
 */
const FIRST_DAY_OF_WEEK_IN_2000 = 5
const getFirstDayOfWeekInYear = year => {
  if (year > 2000) {
    let dayOfWeek = FIRST_DAY_OF_WEEK_IN_2000
    for (let prevYear = 2000; prevYear < year; prevYear++) {
      const add = isYearLeap(prevYear) ? 2 : 1
      dayOfWeek = addToDayOfWeek(dayOfWeek, add)
    }
    return dayOfWeek
  }
  if (year < 2000) {
    let dayOfWeek = FIRST_DAY_OF_WEEK_IN_2000
    for (let y = 1999; y >= year; y--) {
      const add = isYearLeap(y) ? -2 : -1
      dayOfWeek = addToDayOfWeek(dayOfWeek, add)
    }
    return dayOfWeek
  }
  return FIRST_DAY_OF_WEEK_IN_2000
}

/*
 * firstDayOfWeek:
 * Monday = 0
 * ...
 * Sunday = 6
 */
const yearHTML = (firstDayOfWeek, isLeap) => {
  const daysCounts = getDaysCountsInYear(isLeap)

  const firstDays = [firstDayOfWeek]
  for (let i = 1; i < daysCounts.length; i++) {
    firstDays.push(
      addToDayOfWeek(firstDays[i-1], daysCounts[i-1])
    )
  }

  const calendar = []
  for (let i = 0, line = []; i < daysCounts.length; i++) {
    line.push(
      tableHTML(
        [
          [ MONTH_NAMES[i] ],
          [ monthHTML(firstDays[i], daysCounts[i]) ]
        ],
        { tableClass: 'text-center' }
      )
    )
    if (i % 3 === 2) {
      calendar.push(line)
      line = []
    }
  }

  return tableHTML(calendar, { tdClass: 'padding10 td-top-align' })
}

const monthHTML = (firstDayOfWeek, monthDaysCount) => {
  const calendar = [ WEEK_DAYS_NAMES ]

  const emptyPartOfFirstWeek = Array.from({ length: firstDayOfWeek })
  const filledPartOfFirstWeek = Array.from({ length: DAYS_IN_WEEK - firstDayOfWeek }, (_, index) => index + 1)
  calendar.push(emptyPartOfFirstWeek.concat(filledPartOfFirstWeek))

  for (let currentDay = DAYS_IN_WEEK - firstDayOfWeek; currentDay < monthDaysCount; currentDay += DAYS_IN_WEEK) {
    calendar.push(
      Array.from(
        { length: DAYS_IN_WEEK },
        (_, index) => {
          const day = currentDay + index + 1
          return day <= monthDaysCount ? day : undefined
        }
      )
    )
  }

  return tableHTML(calendar, { tdClass: 'b-1-s-w width30 height20' })
}

const DAYS_IN_WEEK = 7
const MONTH_NAMES = [
  'Январь',
  'Февраль',
  'Март',
  'Апрель',
  'Май',
  'Июнь',
  'Июль',
  'Август',
  'Сентябрь',
  'Октябрь',
  'Ноябрь',
  'Декабрь'
]
const WEEK_DAYS_NAMES = ['пн', 'вт', 'ср', 'чт', 'пт', 'сб', 'вс']

const addToDayOfWeek = (dayOfWeek, add) => (dayOfWeek + add + DAYS_IN_WEEK) % DAYS_IN_WEEK

const isYearLeap = year => year % 400 === 0 || (year % 100 !== 0 && year % 4 === 0)

const getDaysCountsInYear = isLeap => [31, isLeap ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]

const tableHTML = (
  arrayOfArrays,
  {
    tableClass = null,
    trClass = null,
    tdClass = null
  } = {}
) => {
  const table = document.createElement('table')
  if (tableClass) table.className = tableClass
  for (const line of arrayOfArrays) {
    const tr = document.createElement('tr')
    if (trClass) tr.className = trClass
    for (const elem of line) {
      const td = document.createElement('td')
      if (elem !== undefined && elem !== null) {
        if (tdClass) td.className = tdClass
        td.append(elem)
      }
      tr.appendChild(td)
    }
    table.appendChild(tr)
  }
  return table
}
