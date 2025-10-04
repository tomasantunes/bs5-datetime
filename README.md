# bs5-datetime
Bootstrap 5 DateTime Picker in Vanilla JS (Written by AI)

## Dependencies

- Bootstrap 5
- FontAwesome 7

## Usage (Vanilla JS)

```
<link rel="stylesheet" href="bs5-datetime.min.css">
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