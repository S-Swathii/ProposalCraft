import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertProposalSchema, proposalSchema } from "@shared/schema";
import { ZodError } from "zod";
import { fromZodError } from "zod-validation-error";

export async function registerRoutes(app: Express): Promise<Server> {
  // API Routes for proposals
  app.get('/api/proposals', async (req, res) => {
    try {
      const proposals = await storage.getProposals();
      return res.json(proposals);
    } catch (error) {
      console.error('Error getting proposals:', error);
      return res.status(500).json({ error: 'Failed to get proposals' });
    }
  });
  
  app.get('/api/proposals/:id', async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      
      if (isNaN(id)) {
        return res.status(400).json({ error: 'Invalid proposal ID' });
      }
      
      const proposal = await storage.getProposal(id);
      
      if (!proposal) {
        return res.status(404).json({ error: 'Proposal not found' });
      }
      
      return res.json(proposal);
    } catch (error) {
      console.error('Error getting proposal:', error);
      return res.status(500).json({ error: 'Failed to get proposal' });
    }
  });
  
  app.post('/api/proposals', async (req, res) => {
    try {
      // Validate request body
      const validatedData = proposalSchema.parse(req.body);
      
      // Convert to InsertProposal
      const insertProposal = {
        clientName: validatedData.clientName,
        services: validatedData.services,
        pricing: validatedData.pricing,
        startDate: validatedData.startDate,
        endDate: validatedData.endDate,
        notes: validatedData.notes || '',
        totalAmount: validatedData.totalAmount
      };
      
      const proposal = await storage.createProposal(insertProposal);
      return res.status(201).json(proposal);
    } catch (error) {
      console.error('Error creating proposal:', error);
      
      if (error instanceof ZodError) {
        const validationError = fromZodError(error);
        return res.status(400).json({ error: validationError.message });
      }
      
      return res.status(500).json({ error: 'Failed to create proposal' });
    }
  });
  
  app.put('/api/proposals/:id', async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      
      if (isNaN(id)) {
        return res.status(400).json({ error: 'Invalid proposal ID' });
      }
      
      // Validate request body
      const validatedData = proposalSchema.parse(req.body);
      
      // Convert to InsertProposal for update
      const updateProposal = {
        clientName: validatedData.clientName,
        services: validatedData.services,
        pricing: validatedData.pricing,
        startDate: validatedData.startDate,
        endDate: validatedData.endDate,
        notes: validatedData.notes || '',
        totalAmount: validatedData.totalAmount
      };
      
      const updatedProposal = await storage.updateProposal(id, updateProposal);
      
      if (!updatedProposal) {
        return res.status(404).json({ error: 'Proposal not found' });
      }
      
      return res.json(updatedProposal);
    } catch (error) {
      console.error('Error updating proposal:', error);
      
      if (error instanceof ZodError) {
        const validationError = fromZodError(error);
        return res.status(400).json({ error: validationError.message });
      }
      
      return res.status(500).json({ error: 'Failed to update proposal' });
    }
  });
  
  app.delete('/api/proposals/:id', async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      
      if (isNaN(id)) {
        return res.status(400).json({ error: 'Invalid proposal ID' });
      }
      
      const deleted = await storage.deleteProposal(id);
      
      if (!deleted) {
        return res.status(404).json({ error: 'Proposal not found' });
      }
      
      return res.status(204).end();
    } catch (error) {
      console.error('Error deleting proposal:', error);
      return res.status(500).json({ error: 'Failed to delete proposal' });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
