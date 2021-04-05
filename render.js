
window.onload = () => {
  const input = document.getElementById('year')

  const year = new Date().getFullYear()
  input.value = year.toString()

  let childCalendar = createYearInHTML(year)
  document.body.appendChild(childCalendar)

  document.getElementById('goCalendar').onclick = () => {
    const year = Number(input.value)
    if (isNaN(year) || year < 0 || year > 10000) {
      alert(`Wrong year: ${input.value}`)
      return false
    }
    document.body.removeChild(childCalendar)
    childCalendar = createYearInHTML(year)
    document.body.appendChild(childCalendar)
    return false
  }
}

const createYearInHTML = (year) => {
  const months = createYear(year)
  const calendar = []

  for (let i = 0, line = []; i < months.length; i++) {
    line.push(
      tableHTML(
        [
          [ MONTH_NAMES[i] ],
          [ createMonthInHtml(months[i]) ]
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

const createMonthInHtml = (month) => {
  const calendar = [ WEEK_DAYS_NAMES, ...month ]
  return tableHTML(calendar, { tdClass: 'b-1-s-w width30 height20' })
}

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
