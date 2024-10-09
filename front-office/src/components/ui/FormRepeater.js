import { useState } from 'react';

const FormRepeater = () => {
  const [fields, setFields] = useState([{ value: '' }]);

  const addField = () => {
    setFields([...fields, { value: '' }]);
  };

  const removeField = () => {
    if (fields.length > 1) {
      setFields(fields.slice(0, -1));
    }
  };

  const onSubmit = () => {
    const formData = {};
    fields.forEach((field, index) => {
      formData[`Destination ${index + 1}`] = field.value;
    });

    // Your submit logic here (e.g., sending the formData to the server or handling it as needed)
    // For demonstration purposes, we'll log the form data to the console.
    console.log('Form data:', formData);
  };

  return (
    <div>
      {fields.map((field, index) => (
        <div key={index}>
          <input
            type="text"
            value={field.value}
            placeholder={`Destination ${index + 1}`}
            onChange={(e) => {
              const updatedFields = [...fields];
              updatedFields[index].value = e.target.value;
              setFields(updatedFields);
            }}
            className="border rounded p-2 mb-2"
          />
        </div>
      ))}
      <button onClick={addField} className="bg-blue-500 text-white px-4 py-2 rounded mr-2">
        Add Destination
      </button>
      <button onClick={removeField} className="bg-red-500 text-white px-4 py-2 rounded">
        Remove Destination
      </button>
      <button onClick={onSubmit} className="bg-green-500 text-white px-4 py-2 rounded mt-4">
        Submit
      </button>
    </div>
  );
};

export default FormRepeater;