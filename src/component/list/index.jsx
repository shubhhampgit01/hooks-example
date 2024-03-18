import React from "react";

const Lists = ({ items, addItem }) => {
  console.log("list page");
  return (
    <div>
      <button onClick={addItem}>Add Item</button>
      <ul>
        {items.map((item, index) => (
          <li key={index}>
            {item}- {index + 1}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default React.memo(Lists);
