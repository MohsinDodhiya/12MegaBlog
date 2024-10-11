import { Client, Databases, Storage, Query, ID } from "appwrite";
import conf from "../config/conf";

export class Services {
  client = new Client();
  databases;
  storage;

  constructor() {
    this.client
      .setEndpoint(conf.appwriteUrl)
      .setProject(conf.appwriteProjectId);
    this.databases = new Databases(this.client);
    this.storage = new Storage(this.client);
  }

  async createPost({ title, slug, content, featuredImages, status, userId }) {
    try {
      return await this.databases.createDocument(
        conf.appwriteDatabseId,
        conf.appwriteCollectionId,
        slug,
        {
          title,
          content,
          featuredImages,
          status,
          userId,
        }
      );
    } catch (error) {
      console.log("Appwrite database :: createPost :: error", error);
    }
  }

  async updatePost(slug, { title, content, featuredImages, status }) {
    try {
      return await this.databases.updateDocument(
        conf.appwriteDatabseId,
        conf.appwriteCollectionId,
        slug,
        {
          title,
          content,
          featuredImages,
          status,
        }
      );
    } catch (error) {
      console.log("Appwrite database :: updatePost :: error", error);
    }
  }

  async deletePost(slug) {
    try {
      return await this.databases.deleteDocument(
        conf.appwriteDatabseId,
        conf.appwriteCollectionId,
        slug
      );
      return true;
    } catch (error) {
      console.log("Appwrite database :: deletePost :: error", error);
      return false;
    }
  }

  async getPost(slug) {
    try {
      return await this.databases.getDocument(
        conf.appwriteDatabseId,
        conf.appwriteCollectionId,
        slug
      );
    } catch (error) {
      console.log("Appwrite database :: getPost :: error", error);
      return false;
    }
  }

  async getPosts(queries = [Query.equal("status", "active")]) {
    try {
      return await this.databases.listDocuments(
        conf.appwriteDatabseId,
        conf.appwriteCollectionId,
        queries
      );
    } catch (error) {
      console.log("Appwrite database :: getPosts :: error", error);
      return false;
    }
  }

  async uploadFile(file) {
    try {
      return await this.storage.createFile(
        conf.appwriteStorageId,
        ID.unique(),
        file
      );
    } catch (error) {
      console.log("Appwrite database :: uploadFile :: error", error);
      return false;
    }
  }
  async deleteFile(fileId) {
    try {
      return await this.storage.deleteFile(conf.appwriteStorageId, fileId);
      return true;
    } catch (error) {
      console.log("Appwrite database :: deleteFile :: error", error);
      return false;
    }
  }

  async getFilePreview(fileId) {
    const previewUrl = this.storage.getFilePreview(
      conf.appwriteStorageId,
      fileId
    );
    return previewUrl.href;
  }

  // async clearAllStorage() {
  //   try {
  //     const allFiles = await this.storage.listFiles(conf.appwriteStorageId); 
  //     const deletePromises = allFiles.files.map((file) =>
  //       this.storage.deleteFile(conf.appwriteStorageId, file.$id)
  //     );

  //     await Promise.all(deletePromises);
  //     console.log("All files deleted successfully.");
  //   } catch (error) {
  //     console.error("Failed to clear storage:", error);
  //   }
  // }
}
const service = new Services();

export default service;
