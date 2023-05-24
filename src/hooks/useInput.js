import { useCallback, useState } from "react";

const useInput = () => {
  const [value, setValue] = useState();

  const handleInputChange = useCallback((e) => {
    setValue(e.target.value);
  }, []);

  const resetValue = () => {
    setValue("");
  };

  return [value, handleInputChange, resetValue];
};

export { useInput };
