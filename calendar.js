const monthNames = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

const calendarState = {
  year: 2026,
  month: 6,
  highlightedDays: {
    2026: {
      6: [10, 11, 12],
      7: [7, 8, 9],
      8: [9, 10, 11],
      9: [11, 12, 13],
      10: [12, 13, 14],
      11: [14, 15, 16]
    }
  }
};

const weekdayNames = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];
const monthLabel = document.getElementById("calendarMonthLabel");
const yearLabel = document.getElementById("calendarYearLabel");
const calendarGrid = document.getElementById("calendarGrid");
const prevMonthButton = document.getElementById("prevMonth");
const nextMonthButton = document.getElementById("nextMonth");

function renderCalendar() {
  calendarGrid.innerHTML = "";

  weekdayNames.forEach((day) => {
    const weekday = document.createElement("div");
    weekday.className = "calendar-day calendar-weekday";
    weekday.textContent = day;
    calendarGrid.appendChild(weekday);
  });

  const firstDayOfMonth = new Date(calendarState.year, calendarState.month, 1);
  const lastDayOfMonth = new Date(calendarState.year, calendarState.month + 1, 0);
  const startingWeekday = firstDayOfMonth.getDay();
  const totalDays = lastDayOfMonth.getDate();

  monthLabel.textContent = monthNames[calendarState.month];
  yearLabel.textContent = String(calendarState.year);

  for (let i = 0; i < startingWeekday; i += 1) {
    const emptyCell = document.createElement("div");
    emptyCell.className = "calendar-day empty";
    calendarGrid.appendChild(emptyCell);
  }

  for (let day = 1; day <= totalDays; day += 1) {
    const dayCell = document.createElement("div");
    dayCell.className = "calendar-day";
    dayCell.textContent = day;

    const monthKey = calendarState.month;
    const yearKey = calendarState.year;
    const highlightedForMonth = calendarState.highlightedDays[yearKey]?.[monthKey] || [];

    if (highlightedForMonth.includes(day)) {
      dayCell.classList.add("event-day");
    }

    calendarGrid.appendChild(dayCell);
  }
}

function advanceMonth(step) {
  let nextMonth = calendarState.month + step;
  let nextYear = calendarState.year;

  if (nextMonth > 11) {
    nextMonth = 0;
    nextYear += 1;
  } else if (nextMonth < 0) {
    nextMonth = 11;
    nextYear -= 1;
  }

  calendarState.month = nextMonth;
  calendarState.year = nextYear;
  renderCalendar();
}

prevMonthButton.addEventListener("click", () => advanceMonth(-1));
nextMonthButton.addEventListener("click", () => advanceMonth(1));

renderCalendar();
