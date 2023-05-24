import { useState } from "react";

const useFileReader = () => {
  const [url, setUrl] = useState("");

  const fileReader = (file) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      setUrl(reader.result);
    };
  };

  return [url, fileReader];
};

export { useFileReader };
