import React, { useEffect, useState } from "react";
import service from "../appwrite/database";
import { Container, PostCard } from "../components";
import { Query } from "appwrite";

function AllPosts() {
  const [posts, setPosts] = useState([]);
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const postsData = await service.getPosts([
          Query.equal("status", "active"),
        ]);
        if (postsData) {
          setPosts(postsData.documents);
        }
      } catch (error) {
        console.error("Error fetching posts:", error);
      }
    };

    fetchPosts();
  }, []);

  return (
    <div className="w-full py-8">
      <Container>
        <div className="flex flex-wrap">
          {posts.map((post) => (
            <div className="p-2 w-1/4" key={post.$id}>
              <PostCard post={{ ...post }} />
            </div>
          ))}
        </div>
      </Container>
    </div>
  );
}

export default AllPosts;
