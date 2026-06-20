const DEFAULTS = {
  format: "YYYY-MM-DD HH:mm",
  showTime: true,
  showSeconds: false,
  use24Hour: true,
  startDay: 1 // 0 = Sunday, 1 = Monday
};

const LOCALES = {
  'en-us': {
    monthNames: [
      "January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December"
    ],
    previousMonth: "Previous month",
    nextMonth: "Next month",
    time: "Time",
    applyDatetime: "Apply",
    hours: "Hours",
    minutes: "Minutes",
    weekDays: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
    placeholder: "Select date and time"
  },
  'pt-pt': {
    monthNames: [
      "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
      "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"
    ],
    previousMonth: "Mês anterior",
    nextMonth: "Mês seguinte",
    time: "Hora",
    applyDatetime: "Aplicar",
    hours: "Horas",
    minutes: "Minutos",
    weekDays: ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'],
    placeholder: "Selecione data e hora"
  }
};

function setDatetimeLocale(locale) {
  const loc = LOCALES[locale];
  if (!loc) {
    console.warn(`Locale not found: ${locale}`);
    return;
  }
  Object.assign(window, loc);
}

function pad(n, len=2){ return String(n).padStart(len, '0'); }

function formatDate(d, opts){
  // Very small formatter for the common requested format
  const Y = d.getFullYear();
  const M = pad(d.getMonth()+1);
  const D = pad(d.getDate());
  const H = pad(d.getHours());
  const m = pad(d.getMinutes());
  if(opts.format === "YYYY-MM-DD HH:mm") return `${Y}-${M}-${D} ${H}:${m}`;
  if(opts.format === "YYYY-MM-DD") return `${Y}-${M}-${D}`;
  if(opts.format === "DD/MM/YYYY HH:mm") return `${D}/${M}/${Y} ${H}:${m}`;
  if(opts.format === "DD/MM/YYYY") return `${D}/${M}/${Y}`;
  return `${Y}-${M}-${D} ${H}:${m}`;
}

function parseInputToDate(str, opts={}) {
  if (!str) return null;

  const format = opts.format || "YYYY-MM-DD HH:mm";
  let re, Y, M, D, H = 0, Min = 0;

  switch (format) {
    case "YYYY-MM-DD HH:mm":
      re = /^(\d{4})-(\d{1,2})-(\d{1,2})[ T](\d{1,2}):(\d{1,2})$/;
      break;
    case "YYYY-MM-DD":
      re = /^(\d{4})-(\d{1,2})-(\d{1,2})$/;
      break;
    case "DD/MM/YYYY HH:mm":
      re = /^(\d{1,2})\/(\d{1,2})\/(\d{4})[ T]?(\d{1,2}):(\d{1,2})$/;
      break;
    case "DD/MM/YYYY":
      re = /^(\d{1,2})\/(\d{1,2})\/(\d{4})$/;
      break;
    default:
      throw new Error(`Unsupported date format: ${format}`);
  }

  const m = str.match(re);
  if (!m) return null;

  // Extract parts depending on format
  if (format.startsWith("YYYY")) {
    Y = Number(m[1]);
    M = Number(m[2]) - 1;
    D = Number(m[3]);
    if (m[4]) H = Number(m[4]);
    if (m[5]) Min = Number(m[5]);
  } else { // DD/MM/YYYY*
    D = Number(m[1]);
    M = Number(m[2]) - 1;
    Y = Number(m[3]);
    if (m[4]) H = Number(m[4]);
    if (m[5]) Min = Number(m[5]);
  }

  const date = new Date(Y, M, D, H, Min, 0, 0);
  if (isNaN(date.getTime())) return null;

  return date;
}


function createTemplate() {
  if (document.getElementById('dtp-template')) return; // already exists

  const tpl = document.createElement('template');
  tpl.id = 'dtp-template';
  tpl.innerHTML = `
      <div class="dtp-popup shadow rounded" role="dialog" aria-modal="false">
          <div class="dtp-header d-flex justify-content-between align-items-center p-2 border-bottom">
              <div class="dtp-month-year fs-6 fw-semibold"></div>
              <div class="dtp-nav">
              <button type="button" class="btn btn-sm dtp-prev" aria-label="${window.previousMonth}">‹</button>
              <button type="button" class="btn btn-sm dtp-next" aria-label="${window.nextMonth}">›</button>
              </div>
          </div>

          <div class="dtp-calendar p-2">
              <div class="dtp-weekdays d-flex small text-muted"></div>
              <div class="dtp-days d-flex flex-wrap"></div>
          </div>

          <div class="p-2 border-top d-flex">
              <div class="dtp-time d-flex gap-2 align-items-center">
                  <label class="mb-0 small">${window.time}</label>
                  <div class="dtp-time-unit input-group input-group-sm">
                      <button type="button" class="btn btn-outline-secondary dtp-time-step" data-target="hour" data-step="-1" aria-label="${window.hours} -">-</button>
                      <input type="text" class="form-control form-control-sm dtp-hour" inputmode="numeric" pattern="[0-9]*" autocomplete="off" aria-label="${window.hours}">
                      <button type="button" class="btn btn-outline-secondary dtp-time-step" data-target="hour" data-step="1" aria-label="${window.hours} +">+</button>
                  </div>
                  <span>:</span>
                  <div class="dtp-time-unit input-group input-group-sm">
                      <button type="button" class="btn btn-outline-secondary dtp-time-step" data-target="minute" data-step="-1" aria-label="${window.minutes} -">-</button>
                      <input type="text" class="form-control form-control-sm dtp-minute" inputmode="numeric" pattern="[0-9]*" autocomplete="off" aria-label="${window.minutes}">
                      <button type="button" class="btn btn-outline-secondary dtp-time-step" data-target="minute" data-step="1" aria-label="${window.minutes} +">+</button>
                  </div>
              </div>
              <div class="ms-auto p-2">
                  <button class="btn btn-sm btn-primary dtp-apply">${window.applyDatetime}</button>
              </div>
          </div>
      </div>
  `;
  document.body.appendChild(tpl);
}

function createDatetimePicker(input, toggle, onChangeCallback, options={}) {
  const opt = Object.assign({}, DEFAULTS, options);
  const tpl = document.getElementById('dtp-template');
  if(!tpl) throw new Error('Template not found');

  console.log('Options:', opt);

  let popup = null;
  let current = null; // Date shown on calendar (month view)
  let selected = null; // Selected Date

  function build(){
    popup = tpl.content.firstElementChild.cloneNode(true);
    document.body.appendChild(popup);
    popup.style.display = 'none';
    // elements
    popup._monthYear = popup.querySelector('.dtp-month-year');
    popup._weekdays = popup.querySelector('.dtp-weekdays');
    popup._days = popup.querySelector('.dtp-days');
    popup._prev = popup.querySelector('.dtp-prev');
    popup._next = popup.querySelector('.dtp-next');
    popup._hour = popup.querySelector('.dtp-hour');
    popup._minute = popup.querySelector('.dtp-minute');
    popup._apply = popup.querySelector('.dtp-apply');

    popup._prev.addEventListener('click', ()=>{ current.setMonth(current.getMonth()-1); render(); });
    popup._next.addEventListener('click', ()=>{ current.setMonth(current.getMonth()+1); render(); });
    popup._apply.addEventListener('click', applyAndClose);
    popup.querySelectorAll('.dtp-time-step').forEach((btn) => {
      btn.addEventListener('click', onTimeStep);
    });
    [popup._hour, popup._minute].forEach((el) => {
      el.addEventListener('input', onTimeInput);
      el.addEventListener('blur', normalizeTimeInput);
    });

    // keyboard: Esc closes
    popup.addEventListener('keydown', (e)=>{
      if(e.key === 'Escape') { close(); input.focus(); }
    });

    // close when clicking outside
    setTimeout(()=>{
      window.addEventListener('click', onWindowClick);
    }, 0);

    renderWeekdays();
  }

  function renderWeekdays(){
    const names = window.weekDays;
    popup._weekdays.innerHTML = '';
    for(let i=0;i<7;i++){
      const idx = (opt.startDay + i) % 7;
      const el = document.createElement('div');
      el.className = 'dtp-weekday flex-fill text-center';
      el.textContent = names[idx];
      popup._weekdays.appendChild(el);
    }
  }

  function render(){
    // show month-year
    const monthNames = window.monthNames;
    const currentMonth = current.getMonth();
    const month = monthNames[currentMonth];
    const year = current.getFullYear();
    popup._monthYear.textContent = `${month} ${year}`;

    // first day of the month grid
    
    const firstOfMonth = new Date(year, currentMonth, 1);
    let start = firstOfMonth.getDay(); // 0-6 (Sun-Sat)
    // shift by startDay
    let offset = (start - opt.startDay + 7) % 7;
    const gridStart = new Date(year, currentMonth, 1 - offset);

    popup._days.innerHTML = '';
    for(let i=0;i<42;i++){
      const d = new Date(gridStart.getFullYear(), gridStart.getMonth(), gridStart.getDate()+i);
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'dtp-day btn btn-sm';
      btn.style.borderRadius = '0.35rem';
      btn.setAttribute('data-date', d.toISOString());
      btn.textContent = d.getDate();

      if(d.getMonth() !== month) btn.classList.add('dtp-other-month','text-muted');
      if(selected && sameDay(d, selected)) btn.classList.add('active');
      if(isToday(d)) btn.classList.add('dtp-today');

      btn.addEventListener('click', (ev)=>{
        ev.stopPropagation();
        selectDate(d);
      });

      popup._days.appendChild(btn);
    }

    // set time inputs
    if(selected){
      popup._hour.value = pad(selected.getHours());
      popup._minute.value = pad(selected.getMinutes());
    } else {
      popup._hour.value = pad(current.getHours());
      popup._minute.value = pad(current.getMinutes());
    }
  }

  function isToday(d){
    const t = new Date();
    return t.getFullYear()===d.getFullYear() && t.getMonth()===d.getMonth() && t.getDate()===d.getDate();
  }

  function sameDay(a,b){
    return a.getFullYear()===b.getFullYear() && a.getMonth()===b.getMonth() && a.getDate()===b.getDate();
  }

  function selectDate(d){
    // preserve time if selected exists otherwise use current's time
    const h = selected ? selected.getHours() : current.getHours();
    const m = selected ? selected.getMinutes() : current.getMinutes();
    selected = new Date(d.getFullYear(), d.getMonth(), d.getDate(), h, m, 0, 0);
    render();
  }

  function getTimeInputValue(inputEl, min, max, fallback){
    if (inputEl.value === '') return fallback;
    const value = Number(inputEl.value);
    if (Number.isNaN(value)) return fallback;
    return clampNumber(value, min, max);
  }

  function ensureSelectedDate(){
    if(!selected) {
      selected = new Date(current.getFullYear(), current.getMonth(), current.getDate(), current.getHours(), current.getMinutes(), 0, 0);
    }
  }

  function setSelectedTimeFromInputs(){
    ensureSelectedDate();
    const h = getTimeInputValue(popup._hour, 0, 23, selected.getHours());
    const m = getTimeInputValue(popup._minute, 0, 59, selected.getMinutes());
    selected.setHours(h, m, 0, 0);
    current.setHours(h, m, 0, 0);
  }

  function onTimeInput(e){
    e.target.value = e.target.value.replace(/\D/g, '').slice(0, 2);
    setSelectedTimeFromInputs();
  }

  function normalizeTimeInput(e){
    ensureSelectedDate();
    const isHour = e.target === popup._hour;
    const max = isHour ? 23 : 59;
    const fallback = isHour ? selected.getHours() : selected.getMinutes();
    e.target.value = pad(getTimeInputValue(e.target, 0, max, fallback));
    setSelectedTimeFromInputs();
  }

  function onTimeStep(e){
    e.preventDefault();
    e.stopPropagation();
    ensureSelectedDate();
    const target = e.currentTarget.getAttribute('data-target');
    const step = Number(e.currentTarget.getAttribute('data-step')) || 0;
    const inputEl = target === 'hour' ? popup._hour : popup._minute;
    const max = target === 'hour' ? 23 : 59;
    const currentValue = getTimeInputValue(inputEl, 0, max, target === 'hour' ? selected.getHours() : selected.getMinutes());
    const nextValue = (currentValue + step + max + 1) % (max + 1);
    inputEl.value = pad(nextValue);
    setSelectedTimeFromInputs();
    inputEl.focus();
  }

  function applyAndClose(){
    // read time inputs
    const fallbackDate = selected || current;
    const h = getTimeInputValue(popup._hour, 0, 23, fallbackDate.getHours());
    const m = getTimeInputValue(popup._minute, 0, 59, fallbackDate.getMinutes());
    if(!selected) selected = new Date(current.getFullYear(), current.getMonth(), current.getDate(), h, m, 0, 0);
    selected.setHours(h, m, 0, 0);
    input.value = formatDate(selected, opt);
    onChangeCallback && onChangeCallback(input.value);
    input.dispatchEvent(new Event('change', {bubbles:true}));
    close();
  }

  function clampNumber(v, a, b){ if(isNaN(v)) return a; return Math.max(a, Math.min(b, v)); }

  function open(){
    if(!popup) build();
    // parse current input
    const parsed = parseInputToDate(input.value, opt);
    selected = parsed || selected || new Date();
    current = new Date(selected.getFullYear(), selected.getMonth(), 1, selected.getHours(), selected.getMinutes());
    render();
    positionPopup();
    popup.style.display = 'block';
    popup.classList.add('show');
    // focus first focusable element in popup
    popup.querySelector('.dtp-hour').focus();

    // show/hide time
    if(!opt.showTime){
      console.log('hiding time');
      popup.querySelector('.dtp-time').setAttribute('style', 'display:none !important');
    }
  }

  function close(){
    if(!popup) return;
    popup.style.display = 'none';
    popup.classList.remove('show');
  }

  function positionPopup(){
    const rect = input.getBoundingClientRect();
    const popupRect = popup.getBoundingClientRect();
    const scrollY = window.scrollY || window.pageYOffset;
    const scrollX = window.scrollX || window.pageXOffset;
    // prefer below, but flip if not enough space
    const spaceBelow = window.innerHeight - rect.bottom;
    let top = rect.bottom + scrollY + 6;
    if(spaceBelow < popupRect.height + 10){
      // place above
      top = rect.top + scrollY - popupRect.height - 6;
    }
    let left = rect.left + scrollX;
    // ensure within viewport
    left = Math.max(6, Math.min(left, document.documentElement.clientWidth - popupRect.width - 6));

    popup.style.position = 'absolute';
    popup.style.top = `${top}px`;
    popup.style.left = `${left}px`;
    popup.style.zIndex = 1080; // above bootstrap modals
  }

  function onWindowClick(e){
    if(!popup || popup.style.display === 'none') return;
    if(e.target === input || input.contains(e.target) || popup.contains(e.target) || e.target === document.getElementById('dtpToggle')) return;
    close();
  }

  function attach(){
    //Uncomment to open on focus or click on input
    //input.addEventListener('focus', ()=>open());
    //input.addEventListener('click', (e)=>open());
    // keyboard controls: Enter applies, Esc closes
    if(toggle) toggle.addEventListener('click', (e)=>{ e.stopPropagation(); if(popup && popup.style.display==='block') close(); else open(); });
    input.addEventListener('keydown', (e)=>{
      open();
      input.focus();
      if (input.value == "") close();
      if(e.key === 'Escape') close();
      if(e.key === 'Enter'){
        const parsed = parseInputToDate(input.value, opt);
        if(parsed){ 
          selected = parsed; 
          input.value = formatDate(parsed, opt);
          input.dispatchEvent(new Event('change',{bubbles:true}));
          onChangeCallback && onChangeCallback(input.value);
        }
        close();
      }
    });
  }

  input.addEventListener('input', (e) => {
    const parsed = parseInputToDate(input.value, opt);
    if (parsed) selected = parsed; // update internal date
    onChangeCallback && onChangeCallback(input.value);
  });

  // public api
  const api = {
    open, close,
    getDate: ()=>selected,
    setDate: (d) => {
      if (!(d instanceof Date)) d = parseInputToDate(d, opt);
      selected = d;
      input.value = selected ? formatDate(selected, opt) : '';
      onChangeCallback && onChangeCallback(input.value);
    },
    destroy: ()=>{
      if(popup){ popup.remove(); popup = null; }
      input.removeEventListener('focus', open);
      window.removeEventListener('click', onWindowClick);
    }
  };

  attach();
  return api;
}

// expose globally
window.setDatetimeLocale = setDatetimeLocale;
window.createDatetimeTemplate = createTemplate;
window.createDatetimePicker = createDatetimePicker;
