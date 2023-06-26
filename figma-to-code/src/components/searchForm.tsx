"use client";
import { useState, useRef, SyntheticEvent } from "react";
import api from "@/app/utils/api";

type FormProps = {
  handleFetch: (url: string) => any;
};

const SearchForm = ({ handleFetch }: FormProps) => {
  const urlRef = useRef<HTMLInputElement | null>(null);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const url = urlRef.current?.value;
    if (url) {
      handleFetch(url);
    }
  };
  return (
    <div className="w-full">
      <form onSubmit={handleSubmit} className="w-1/2 flex ">
        <input
          type="text"
          ref={urlRef}
          className="w-full h-10 border-2 border-black rounded-xl text-black px-4"
        ></input>
        <button
          type="submit"
          className=" h-10 border-2 border-black rounded-xl"
        >
          Search
        </button>
      </form>
    </div>
  );
};
export default SearchForm;
