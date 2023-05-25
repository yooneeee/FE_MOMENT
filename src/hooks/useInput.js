import { useCallback, useState } from "react";

export function useInput(initialValue) {
  const [value, setValue] = useState(initialValue);

  const onChange = (e) => {
    setValue(e.target.value);
  };

  const reset = () => {
    setValue("");
  };

  return [value, onChange, reset];
}

export function useInputs(initialValue) {
  const [values, setValues] = useState(initialValue);

  const onChange = (e) => {
    const { name, value } = e.target;
    setValues({ ...values, [name]: value });
  };

  const reset = useCallback(() => setValues(initialValue), []);
  return [values, onChange, reset];
}
