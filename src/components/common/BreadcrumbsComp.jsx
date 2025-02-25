import React, { useContext } from "react";
import { Link, useLocation } from "react-router-dom";
import { Breadcrumbs, Typography } from "@mui/material";
import { ROOT_PATH } from "../../config/constants";
import { ThemeContext } from "./Header";

export const BreadcrumbsComp = () => {
  const { theme } = useContext(ThemeContext);
  const location = useLocation();
  const pathnames = location.pathname.split("/").filter((x) => x);

  const breadcrumbs = [
    <Link
      key="home"
      to={ROOT_PATH}
      style={{ textDecoration: "none", color: theme === "light" ? "white" : "black", fontWeight: "bold", textShadow: theme === "light" ? "0 0 10px black, 0 0 20px black" : "0 0 10px white, 0 0 20px white" }}
    >
      Home
    </Link>,
  ];

  let currentPath = "";

  pathnames.forEach((name, index) => {
    currentPath += `/${name}`;
    const isLast = index === pathnames.length - 1;

    if (isLast) {
      breadcrumbs.push(
        <Typography key={name} color={theme === "light" ? "white" : "black"} fontWeight="bold" sx={{textShadow: theme === "light" ? "0 0 10px black, 0 0 20px black" : "0 0 10px white, 0 0 20px white"}}>
          {name.charAt(0).toUpperCase() + name.slice(1)}
        </Typography>
      );
    } else {
      breadcrumbs.push(
        <Link
          key={name}
          to={currentPath}
          style={{ textDecoration: "none", color: "inherit", fontWeight: "bold" }}
        >
          {name.charAt(0).toUpperCase() + name.slice(1)}
        </Link>
      );
    }
  });

  return (
    <div style={{margin: "10px"}}>
      <Breadcrumbs separator=" › " aria-label="breadcrumb">
        {breadcrumbs}
      </Breadcrumbs>
    </div>
  );
};
