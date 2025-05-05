import { Request, Response } from "express";
import { AppError } from "../middleware/error.middleware";
import { IEventCreate, IEventUpdate } from "../types/event.types";

export const eventController = {
  getAllEvents: async (req: Request, res: Response) => {
    try {
      //TODO: Implement event retrieval logic
      res.status(200).json({ message: "Get all events" });
    } catch (error) {
      throw new AppError(500, "Failed to get events");
    }
  },

  getEventById: async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      // TODO: Implement event retrieval by ID logic
      res.status(200).json({ message: `Get event ${id}` });
    } catch (error) {
      throw new AppError(500, "Failed to get event");
    }
  },

  createEvent: async (req: Request, res: Response) => {
    try {
      const eventData: IEventCreate = req.body;
      // TODO: Implement event creation logic
      res.status(201).json({ message: "Event created", data: eventData });
    } catch (error) {
      throw new AppError(500, "Failed to create event");
    }
  },

  updateEvent: async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const eventData: IEventUpdate = req.body;
      // TODO: Implement event update logic
      res.status(200).json({ message: `Event ${id} updated`, data: eventData });
    } catch (error) {
      throw new AppError(500, "Failed to update event");
    }
  },

  deleteEvent: async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      // TODO: Implement event deletion logic
      res.status(200).json({ message: `Event ${id} deleted` });
    } catch (error) {
      throw new AppError(500, "Failed to delete event");
    }
  },
};
