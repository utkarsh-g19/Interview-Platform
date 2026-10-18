import React from "react";
import toast from "react-hot-toast";
function HomePage() {
  return (
    <div>
      <h1>Home Page</h1>
      <button
        className="btn btn-primary"
        onClick={() => {
          toast.success("this is a success");
        }}
      >
        Click me
      </button>
    </div>
  );
}

export default HomePage;
