const Loader = () => {
    return (
      <div
        className="d-flex justify-content-center align-items-center"
        style={{ minHeight: "300px" }}
      >
        <div className="spinner-border text-success" role="status">
          <span className="visually-hidden">
            Loading...
          </span>
        </div>
      </div>
    );
  };
  
  export default Loader;