function ErrorMessage({ errorMessage }) {
  return (
    <>
      <div className="h-screen  flex justify-center items-start px-4 mt-60">
        <p className="text-3xl font-bold">{errorMessage}</p>
      </div>
    </>
  );
}

export default ErrorMessage;
