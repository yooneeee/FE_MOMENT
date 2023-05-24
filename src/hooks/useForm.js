import { useState } from "react";

const useForm = (initialState) => {
  const [form, setForm] = useState(initialState);

  /*   const handleFormChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  }; */
  const handleFormChange = (name, value) => {
    setForm((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleRoleChange = (value) => {
    setForm((prevState) => ({
      ...prevState,
      role: value,
    }));
  };

  const handleSexChange = (value) => {
    setForm((prevState) => ({
      ...prevState,
      sex: value,
    }));
  };
  const handleFileChange = (e) => {
    const { name, files } = e.target;
    setForm({ ...form, [name]: files[0] });
  };

  const reset = (resetState = initialState) => {
    setForm(resetState);
  };

  return [form, handleFormChange, handleFileChange, reset];
};

export { useForm };
