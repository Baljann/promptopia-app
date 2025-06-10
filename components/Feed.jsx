"use client";

import React, { useState, useEffect } from "react";
import PromptCard from "./PromptCard";
import { useRouter } from "next/navigation";

const PromptCardList = ({ data, handleTagClick, handleProfileClick }) => {
  return (
    <div className="mt-16 prompt_layout">
      {data.map((post) => (
        <PromptCard
          key={post._id}
          post={post}
          handleTagClick={handleTagClick}
          handleProfileClick={handleProfileClick}
        />
      ))}
    </div>
  );
};

const Feed = () => {
  const [searchText, setSearchText] = useState("");
  const [posts, setPosts] = useState([]);
  const [searchResult, setSearchResult] = useState([]);
  const router = useRouter();

  const handleSearchChange = (e) => {
    setSearchText(e.target.value);
    setTimeout(() => {
      const searchResult = posts.filter(
        (item) =>
          item.prompt.toLowerCase().includes(searchText.toLowerCase()) ||
          item.tag.toLowerCase().includes(searchText.toLowerCase()) ||
          item.creator.username.toLowerCase().includes(searchText.toLowerCase())
      );
      setSearchResult(searchResult);
    }, 500);
  };

  const handleTagClick = (tag) => {
    setSearchText(tag);
    const searchResult = posts.filter((item) =>
      item.tag.toLowerCase().includes(tag.toLowerCase())
    );
    setSearchResult(searchResult);
  };

  const handleProfileClick = (username) => {
    router.push(`/profile/${username}`);
  };

  useEffect(() => {
    const fetchPosts = async () => {
      const response = await fetch("/api/prompt");
      const data = await response.json();
      setPosts(data);
    };
    fetchPosts();
  }, [router]);

  return (
    <section className="feed">
      <form className="relative w-full flex-center">
        <input
          type="text"
          placeholder="Search for a tag or a username..."
          value={searchText}
          onChange={handleSearchChange}
          required
          className="search_input peer"
        />
        <button
          type="submit"
          disabled={!searchText}
          className="search_submit"
          onClick={handleSearchChange}
        >
          Search
        </button>
      </form>
      <PromptCardList
        data={searchText ? searchResult : posts}
        handleTagClick={handleTagClick}
        handleProfileClick={handleProfileClick}
      />
    </section>
  );
};

export default Feed;
