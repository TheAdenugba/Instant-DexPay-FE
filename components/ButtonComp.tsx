/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import { Button, CircularProgress } from "@mui/material";
import { useBreakPoints } from "@/utils";

const ButtonComp = ({
  children,
  handleSubmit,
  height = "48px",
  heightSm = "40px",
  width = "100%",
  padding = "16px 18px 16px 18px",
  color = "#111217",
  backgroundColor = "#FFFFFF",
  fontSize = "14px",
  disabled = false,
  hover = true,
  loading = false,
  margin = "initial",
  border = "none",
}: any) => {
  const { sm } = useBreakPoints();
  return (
    <Button
      onClick={() => {
        handleSubmit();
      }}
      disabled={loading || disabled}
      sx={{
        minWidth: "fit-content",
        height: sm ? height : heightSm,
        border: border,
        color: color,
        backgroundColor: backgroundColor,
        borderRadius: "64px",
        textTransform: "capitalize",
        fontSize: fontSize,
        fontWeight: 500,
        fontStyle: "normal",
        lineHeight: "17px",
        display: "flex",
        padding: padding,
        width: width,
        "&:hover": {
          backgroundColor: hover ? "#FC3F6B" : backgroundColor,
          color: hover ? "#fff" : "inherit",
        },
        margin,
        opacity: disabled ? 0.4 : 1,
      }}
    >
      {children}
      {loading && (
        <CircularProgress
          sx={{
            color: "#111217",
            opacity: "0.4",
            marginLeft: "10px",
            verticalAlign: "middle",
          }}
          size={15}
        />
      )}
    </Button>
  );
};

export default ButtonComp;
