# bs5-datetime
Bootstrap 5 DateTime Picker in Vanilla JS (Written by AI)

## Dependencies

- Bootstrap 5
- FontAwesome 7

## Usage (Vanilla JS)

```
<link rel="stylesheet" href="bs5-datetime.min.css">
<script src="locale-en-us.min.js"></script>
<script src="bs5-datetime.min.js"></script>

<div class="input-group">
    <input id="dtp" class="form-control">
    <button class="btn btn-outline-secondary" id="dtpToggle">
        <i class="fa-solid fa-calendar-days"></i>
    </button>
</div>

<script>
    const input = document.getElementById('dtp');
    const toggle = document.getElementById('dtpToggle');
    createDatetimeTemplate();
    const picker = createDatetimePicker(input, toggle);
</script>
```

## Usage (React)

```
import DateTimePicker from 'DateTimePicker.jsx';

const [datetime, setDatetime] = useState(null);

<DateTimePicker defaultValue={datetime} onChange={setDatetime} />
```

## Options

The 4th argument of the createDatetimePicker function accepts the following options:

```
{
  format: "YYYY-MM-DD HH:mm",
  showTime: true,
  showSeconds: false,
  use24Hour: true,
  startDay: 1 // 0 = Sunday, 1 = Monday
}
```

## Methods

The DateTimePicker has the following methods:

- open()
- close()
- getDate()
- setDate(d)
- destroy()