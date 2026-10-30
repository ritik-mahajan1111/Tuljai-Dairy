const PageHeader = ({
    title,
    button,
  }) => {
  
    return (
  
      <div className="d-flex justify-content-between align-items-center mb-4">
  
        <h2 className="fw-bold">
  
          {title}
  
        </h2>
  
        {button}
  
      </div>
  
    );
  
  };
  
  export default PageHeader;