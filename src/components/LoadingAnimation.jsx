function LoadingAnimation({ loading }) {
  return (
    <>
      {loading && (
        <div className="h-screen flex justify-center items-start px-4 mt-60">
          <span className="loading loading-spinner text-info loading-xl"></span>
        </div>
      )}
    </>
  );
}

export default LoadingAnimation;
