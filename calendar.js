
const DAYS_IN_WEEK = 7
const addToDayOfWeek = (dayOfWeek, add) => (dayOfWeek + add + DAYS_IN_WEEK) % DAYS_IN_WEEK
const isYearLeap = year => year % 400 === 0 || (year % 100 !== 0 && year % 4 === 0)
const getDaysCountsInYear = isLeap => [31, isLeap ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]

/**
 * @param firstDayOfWeek - which day of week is 1 day of month (0 - Monday, 6 - Sunday)
 * @param monthDaysCount - days count in month
 * @return (number | undefined)[][] - array of arrays, represents month
 *
 * for example:
 * [
 *   [ 1, 2, 3, 4, 5, 6, 7 ],
 *   [ 8,  9, 10, 11, 12, 13, 14 ],
 *   [ 15, 16, 17, 18, 19, 20, 21 ],
 *   [ 22, 23, 24, 25, 26, 27, 28 ],
 *   [ 29, 30, 31, undefined, undefined, undefined, undefined ]
 * ]
 */
const createMonth = (firstDayOfWeek, monthDaysCount) => {
  const month = []
  const emptyPart = Array.from({ length: firstDayOfWeek })
  const filledPart = Array.from({ length: DAYS_IN_WEEK - firstDayOfWeek }, (_, index) => index + 1)
  month.push(emptyPart.concat(filledPart))

  for (let currentDay = DAYS_IN_WEEK - firstDayOfWeek; currentDay < monthDaysCount; currentDay += DAYS_IN_WEEK) {
    month.push(
      Array.from(
        { length: DAYS_IN_WEEK },
        (_, index) => {
          const day = currentDay + index + 1
          return day <= monthDaysCount ? day : undefined
        }
      )
    )
  }

  return month
}

/**
 * @param year
 * @return (number | undefined)[][][] - array of months, item at 0 index - January, 1 - February, etc.
 */
const createYear = (year) => {
  const firstDayOfWeek = getFirstDayOfWeekInYear(year)
  const daysCounts = getDaysCountsInYear(isYearLeap(year))

  const firstDays = [firstDayOfWeek]
  for (let i = 1; i < daysCounts.length; i++) {
    firstDays.push(
      addToDayOfWeek(firstDays[i-1], daysCounts[i-1])
    )
  }

  return firstDays.map(
    (firstDay, index) => createMonth(firstDay, daysCounts[index])
  )
}

/*
  1 january of 2000 - saturday
  after leap year - adds 2 days
  after not leap year - adds 1 day
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
