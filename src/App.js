import React, { useEffect, useState } from "react";

const App = () => {
  const [searchText, setsearchText] = useState("");
  const [items, setItems] = useState([]);

  const handleSearch = (e) => {
    setsearchText(e.target.value);
  };
  useEffect(() => {
    fetch(
      "https://geektrust.s3-ap-southeast-1.amazonaws.com/adminui-problem/members.json"
    )
      .then((res) => res.json())
      .then((result) => {
        setItems(result);
      });
    console.log(items);
  }, []);

  // const filteredItems = items.filter(
  //   (car) =>
  //     car.make.toLowerCase().includes(setsearchText.toLowerCase()) ||
  //     car.model.toLowerCase().includes(setsearchText.toLowerCase()) ||
  //     String(car.year).includes(setsearchText.toLowerCase())
  // );

  return (
    <div>
      <input
        type="text"
        placeholder="Enter Value..."
        value={searchText}
        onChange={handleSearch}
      />
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Role</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>{items && items.map((i) => <tr key={i.id}></tr>)}</tbody>
      </table>
    </div>
  );
};

export default App;
