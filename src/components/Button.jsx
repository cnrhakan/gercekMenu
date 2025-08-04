function Button({ content }) {
  return (
    <div className="w-full flex justify-center">
      <button
        type="submit"
        className="p-3 bg-blue-600 hover:bg-blue-700 transition text-white font-semibold rounded-xl w-3/4   shadow-md cursor-pointer"
      >
        {content}
      </button>
    </div>
  );
}

export default Button;
