"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Profile from "@components/Profile";
import { use } from "react";

const UserProfile = ({ params }) => {
  const [posts, setPosts] = useState([]);
  const router = useRouter();
  const { data: session } = useSession();
  const userId = use(params).id;

  useEffect(() => {
    const fetchPosts = async () => {
      const response = await fetch(`/api/users/${userId}/posts`);
      const data = await response.json();
      setPosts(data);
    };
    if (userId) fetchPosts();
  }, [userId]);

  return (
    <Profile
      name="User"
      desc={`Welcome to ${
        posts[0]?.creator?.username || "User"
      }'s profile page`}
      data={posts}
    />
  );
};

export default UserProfile;
