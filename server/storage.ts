import { 
  users, 
  type User, 
  type InsertUser, 
  proposals, 
  type Proposal, 
  type InsertProposal,
  type ProposalWithDate 
} from "@shared/schema";

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Proposal-related methods
  createProposal(proposal: InsertProposal): Promise<Proposal>;
  getProposal(id: number): Promise<Proposal | undefined>;
  getProposals(): Promise<Proposal[]>;
  updateProposal(id: number, proposal: Partial<InsertProposal>): Promise<Proposal | undefined>;
  deleteProposal(id: number): Promise<boolean>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private proposalsMap: Map<number, Proposal>;
  private userCurrentId: number;
  private proposalCurrentId: number;

  constructor() {
    this.users = new Map();
    this.proposalsMap = new Map();
    this.userCurrentId = 1;
    this.proposalCurrentId = 1;
  }

  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.userCurrentId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  async createProposal(insertProposal: InsertProposal): Promise<Proposal> {
    const id = this.proposalCurrentId++;
    const proposal: Proposal = { 
      ...insertProposal, 
      id,
      createdAt: new Date() 
    };
    
    this.proposalsMap.set(id, proposal);
    return proposal;
  }

  async getProposal(id: number): Promise<Proposal | undefined> {
    return this.proposalsMap.get(id);
  }

  async getProposals(): Promise<Proposal[]> {
    return Array.from(this.proposalsMap.values()).sort((a, b) => {
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });
  }

  async updateProposal(id: number, proposalUpdate: Partial<InsertProposal>): Promise<Proposal | undefined> {
    const existingProposal = this.proposalsMap.get(id);
    
    if (!existingProposal) {
      return undefined;
    }
    
    const updatedProposal: Proposal = {
      ...existingProposal,
      ...proposalUpdate
    };
    
    this.proposalsMap.set(id, updatedProposal);
    return updatedProposal;
  }

  async deleteProposal(id: number): Promise<boolean> {
    return this.proposalsMap.delete(id);
  }
}

export const storage = new MemStorage();
