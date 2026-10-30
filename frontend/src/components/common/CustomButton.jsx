const CustomButton = ({
    title,
    color = "success",
    onClick,
    type = "button",
  }) => {
  
    return (
  
      <button
  
        type={type}
  
        className={`btn btn-${color}`}
  
        onClick={onClick}
  
      >
  
        {title}
  
      </button>
  
    );
  
  };
  
  export default CustomButton;