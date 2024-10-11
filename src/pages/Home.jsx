import React, { useEffect, useState } from "react";
import { Container, PostCard } from "../components";
import service from "../appwrite/database";
import { useSelector } from "react-redux";

function Home() {
  const deleteImg = async () => {
    try {
      await service.clearAllStorage(); // Wait for the async operation to complete
    } catch (error) {
      console.log("Error deleting images: ", error);
    }
  };

  const [posts, setPosts] = useState([]);
  const authStatus = useSelector((state) => state.auth?.status);
  useEffect(() => {
    service.getPosts().then((posts) => {
      if (posts) {
        setPosts(posts.documents);
      }
    });
  }, []);

  if (posts.length === 0) {
    return (
      <div className="w-full py-8 mt-4 text-center">
        <Container>
          <div className="flex flex-wrap">
            <div className="p-2 w-full">
              <h1 className="text-2xl font-bold hover:text-gray-500">
                {authStatus == true
                  ? "Write Post Now!"
                  : "Login to Write Your Post!"}
              </h1>
            </div>
          </div>
        </Container>
      </div>
    );
  }

  return (
    <div className="w-full py-8">
      <Container>
        <div className="flex flex-wrap">
          {posts.map((post) => (
            <div className="p-2 w-1/4" key={post.$id}>
              <PostCard {...post} />
            </div>
          ))}
        </div>
        <button onClick={deleteImg}>Delete all File / img</button>
      </Container>
    </div>
  );
}

export default Home;
