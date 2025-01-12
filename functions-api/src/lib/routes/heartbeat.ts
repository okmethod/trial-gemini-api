import type { Request, Response } from "express";
import type { ResponseHeartbeatJson } from "../types/heartbeat";

const heartbeat = async (_: Request, res: Response) => {
  const now = new Date();
  const response: ResponseHeartbeatJson = {
    alive: now.toISOString(),
  };
  res.json(response);
};

export default heartbeat;
