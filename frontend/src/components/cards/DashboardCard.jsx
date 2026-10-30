import React from "react";

const DashboardCard = ({
  title,
  value,
  icon,
  color,
}) => {

  return (

    <div
      className="card shadow border-0 h-100"
      style={{
        borderRadius: "18px",
      }}
    >

      <div className="card-body d-flex justify-content-between align-items-center">

        <div>

          <small className="text-muted">
            {title}
          </small>

          <h2 className="fw-bold mt-2">
            {value}
          </h2>

        </div>

        <div
          style={{
            width: 65,
            height: 65,
            borderRadius: "50%",
            background: color,
            color: "#fff",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            fontSize: 28,
          }}
        >
          {icon}
        </div>

      </div>

    </div>

  );

};

export default DashboardCard;