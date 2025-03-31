import React from "react";
import BookCard from "../../components/BookCard";

const book = [
  {
    id: 1,
    title: "어린왕자",
    author: "앙투안 드 생텍쥐페리",
    imageUrl: "/images/little-prince.png",
  },
];

const Search = () => {
  return (
    <>
      <div>search</div>
      <BookCard
        key={book[0].id}
        {...book[0]}
        onClick={() => {console.log("hi")}}
      />
    </>
  );
};

export default Search;
