function Input({ name, type, placeholder, value, onChange }) {
  return (
    <>
      <input
        name={name}
        type={type}
        placeholder={placeholder}
        className="p-[10px] border border-gray-300 rounded-xl w-full focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
        value={value}
        onChange={onChange}
      />
    </>
  );
}

export default Input;
