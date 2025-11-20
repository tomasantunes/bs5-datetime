# bs5-datetime
Bootstrap 5 DateTime Picker in Vanilla JS (Written by AI)

![Screenshot](https://i.imgur.com/g010A7d.png)

## Dependencies

- Bootstrap 5
- FontAwesome 7

## Usage (Vanilla JS)

```
<link rel="stylesheet" href="bs5-datetime.min.css">
<script src="bs5-datetime.min.js"></script>

<div class="input-group">
    <input id="dtp" class="form-control" autocomplete="off">
    <button class="btn btn-outline-secondary" id="dtpToggle" type="button" aria-label="Toggle datetime picker">
    <i class="fa-solid fa-calendar-days" aria-hidden="true"></i>
    </button>
</div>

<script>
    const input = document.getElementById('dtp');
    const toggle = document.getElementById('dtpToggle');
    setDatetimeLocale("en-us");
    createDatetimeTemplate();
    const picker = createDatetimePicker(input, toggle);
</script>
```

## Usage (React)

```
import DateTimePicker from 'DateTimePicker.jsx';

const [datetime, setDatetime] = useState(null);

<DateTimePicker defaultValue={datetime} onChange={setDatetime} locale="en-us" />
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