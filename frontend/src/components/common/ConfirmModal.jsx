const ConfirmModal = ({
    message,
    onConfirm,
  }) => {
  
    return (
  
      <div className="text-center">
  
        <h5>
  
          {message}
  
        </h5>
  
        <button
  
          className="btn btn-danger me-3"
  
          onClick={onConfirm}
  
        >
  
          Yes
  
        </button>
  
      </div>
  
    );
  
  };
  
  export default ConfirmModal;