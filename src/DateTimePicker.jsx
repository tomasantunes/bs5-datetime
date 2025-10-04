import { useEffect, useRef, useState } from "react";
import "./bs5-datetime.min.css";

export default function DateTimePicker(props) {
  const inputRef = useRef(null);
  const toggleRef = useRef(null);
  const [datetime, setDatetime] = useState(props.defaultValue || "");

  useEffect(() => {
    if (props.onChange) {
      props.onChange(datetime);
    }
  }, [datetime]);

  useEffect(() => {
    (async () => {
      await import("./bs5-datetime.min.js");
      console.log("Initializing datetime picker");
      if (window.createDatetimeTemplate) {
        console.log("Creating datetime template");
        window.createDatetimeTemplate();
      }

      if (window.createDatetimePicker && inputRef.current && toggleRef.current) {
        console.log("Creating datetime picker");
        window.createDatetimePicker(inputRef.current, toggleRef.current);
      }
    })();
  }, []);

  return (
    <div className="input-group">
      <input
        ref={inputRef}
        type="text"
        className="form-control"
        placeholder="Select date and time"
        value={datetime}
        onChange={(e) => setDatetime(e.target.value)}
      />
      <button
        ref={toggleRef}
        className="btn btn-outline-secondary"
        type="button"
      >
        <i className="fa-solid fa-calendar-days"></i>
      </button>
    </div>
  );
}
