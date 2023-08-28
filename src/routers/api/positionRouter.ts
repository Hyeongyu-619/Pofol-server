import { Router, Request, Response, NextFunction } from "express";
import { positionService } from "../../services";
import { adminRequired, loginRequired } from "../../middlewares";

const positionRouter = Router();

positionRouter.post(
  "/",
  loginRequired,
  adminRequired,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const newPosition = await positionService.addPosition(req.body);
      res.status(201).json(newPosition);
    } catch (error) {
      next(error);
    }
  }
);

positionRouter.get(
  "/",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const positions = await positionService.findAllPositions();
      res.status(200).json(positions);
    } catch (error) {
      next(error);
    }
  }
);

positionRouter.put(
  "/:id",
  loginRequired,
  adminRequired,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const updatedPosition = await positionService.updatePosition(
        req.params.id,
        req.body
      );
      res.status(200).json(updatedPosition);
    } catch (error) {
      next(error);
    }
  }
);

positionRouter.delete(
  "/:id",
  loginRequired,
  adminRequired,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const deletedPosition = await positionService.deletePosition(
        req.params.id
      );
      res.status(200).json(deletedPosition);
    } catch (error) {
      next(error);
    }
  }
);

export { positionRouter };
