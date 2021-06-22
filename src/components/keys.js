import React from "react";

const Keys = (props) => {
  return (
    <button
      className={props.classes}
      id={props.id}
      onClick={() => props.clicker(props.symbol)}
    >
      {props.symbol}
    </button>
  );
};

export default Keys;
