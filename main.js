const DAYS_IN_MONTH = 30;
const MONTHS = 7;
const DAILY_INCREASE = 5;
const MAX_DAILY = 100;
const REVENUE_PER_MONTH = 10500 / MONTHS;
const RESET_AFTER_DAYS = 20;
const MAX_TOTAL_SAVINGS = 10500;

const savingsDays = [];

function getDayName(dayNumber) {
  const days = ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'];
  return days[(dayNumber + 4) % 7];
}

function initializeSavingsDays() {
  let currentSavings = 5;
  let dayCounter = 1;
  
  for (let day = 1; day <= DAYS_IN_MONTH * MONTHS; day++) {
    if (currentSavings > MAX_DAILY) currentSavings = MAX_DAILY;
    
    if (dayCounter > RESET_AFTER_DAYS) {
      dayCounter = 1;
      currentSavings = 5;
    }
    
    savingsDays.push({
      day,
      amount: currentSavings,
      saved: false,
      dayName: getDayName(day - 1)
    });
    
    currentSavings += DAILY_INCREASE;
    dayCounter++;
  }
}

function renderTable() {
  const tbody = document.getElementById('savings-table');
  tbody.innerHTML = '';
  
  savingsDays.forEach((day, index) => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width: 1rem; height: 1rem; display: inline-block; vertical-align: middle; margin-right: 0.5rem; color: var(--color-gray-400)">
          <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
          <line x1="16" y1="2" x2="16" y2="6"></line>
          <line x1="8" y1="2" x2="8" y2="6"></line>
          <line x1="3" y1="10" x2="21" y2="10"></line>
        </svg>
        Jour ${day.day} (${day.dayName})
      </td>
      <td style="text-align: right; font-weight: 500">${day.amount} DH</td>
      <td style="text-align: center">
        <input type="checkbox" ${day.saved ? 'checked' : ''} data-index="${index}">
      </td>
    `;
    tbody.appendChild(tr);
  });
}

function calculateTotals() {
  const totalSaved = savingsDays.reduce((acc, day) => 
    day.saved ? acc + day.amount : acc, 0);
  const totalRevenue = Math.floor(REVENUE_PER_MONTH * MONTHS);
  const savedDaysCount = savingsDays.filter(day => day.saved).length;
  
  document.getElementById('total-saved').textContent = `${totalSaved} DH`;
  document.getElementById('total-revenue').textContent = `${totalRevenue} DH`;
  document.getElementById('remaining').textContent = `${totalRevenue - totalSaved} DH`;
  document.getElementById('days-count').textContent = `${savedDaysCount} jours d'épargne`;
  document.getElementById('months-count').textContent = `Sur ${MONTHS} mois`;
}

function toggleSavingsDay(index) {
  const day = savingsDays[index];
  const currentTotal = savingsDays.reduce((acc, d) => 
    d.saved ? acc + d.amount : acc, 0);
  const newTotal = day.saved 
    ? currentTotal - day.amount 
    : currentTotal + day.amount;
  
  if (!day.saved && newTotal > MAX_TOTAL_SAVINGS) {
    alert(`Le total d'épargne ne peut pas dépasser ${MAX_TOTAL_SAVINGS} DH`);
    return;
  }
  
  day.saved = !day.saved;
  renderTable();
}

// Initialize the application
document.addEventListener('DOMContentLoaded', () => {
  initializeSavingsDays();
  renderTable();
  calculateTotals();
  
  // Event delegation for checkboxes
  document.getElementById('savings-table').addEventListener('change', (e) => {
    if (e.target.matches('input[type="checkbox"]')) {
      toggleSavingsDay(parseInt(e.target.dataset.index));
    }
  });
  
  document.getElementById('calculate').addEventListener('click', calculateTotals);
});