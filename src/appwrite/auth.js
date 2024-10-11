import { Client, Account, ID } from "appwrite";
import conf from "../config/conf";

export class AuthServices {
  client = new Client();
  account;

  constructor() {
    this.client
      .setEndpoint(conf.appwriteUrl)
      .setProject(conf.appwriteProjectId);

    this.account = new Account(this.client);
  }

  async createAccount({ email, password, name }) {
    try {
      const userAccount = await this.account.create(
        ID.unique(),
        email,
        password,
        name
      );
      return userAccount ? await this.login({ email, password }) : userAccount;
    } catch (error) {
      this.handleError("createAccount", error);
    }
  }

  async login({ email, password }) {
    try {
      const session = await this.getCurrentSession();
      return (
        session ||
        (await this.account.createEmailPasswordSession(email, password))
      );
    } catch (error) {
      this.handleError("login", error);
      throw new Error(error.message || "Login failed");
    }
  }

  async getCurrentSession() {
    try {
      return await this.account.getSession("current");
    } catch (error) {
      this.handleError("getCurrentSession", error);
      return null;
    }
  }

  async getCurrentUser() {
    try {
      
      const user = await this.account.get();
      return user;
    } catch (error) {
      return null;
    }
  }

  async logout() {
    try {
      return await this.account.deleteSessions();
    } catch (error) {
      this.handleError("logout", error);
    }
  }

  handleError(method, error) {
    console.error(`Appwrite service :: ${method} :: error`, error);
  }
}

const authServices = new AuthServices();
export default authServices;
