import { Typography, useTheme } from "@mui/material";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const ProductCard = ({ title, icon, link }) => {
  const navigate = useNavigate();
  const theme = useTheme();
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const handleClick = () => {
    navigate(link);
  };

  const tileStyle = {
    width: isMobile ? '120px' : '150px',
    height: isMobile ? '120px' : '150px',
    border: "1px solid #ccc",
    borderRadius: "8px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    margin: "10px",
    cursor: "pointer",
    backgroundColor: theme.palette.primary.main,
  };

  const imageStyle = {
    maxWidth: "60px",
    maxHeight: "60px",
    marginBottom: "10px",
  };

  const titleStyle = {
    fontSize: "16px",
    textAlign: "center",
  };

  return (
    <div style={tileStyle} onClick={handleClick}>
      <img src={icon} alt={title} style={imageStyle} />
      <Typography component="div" variant="h6" style={titleStyle}>{title}</Typography>
    </div>
  );
};

export default ProductCard;
