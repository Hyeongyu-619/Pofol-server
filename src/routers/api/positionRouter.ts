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

positionRouter.get("/", async (req: any, res: Response, next: NextFunction) => {
  try {
    const limit = req.query.limit ?? 10;
    const skip = req.query.skip ?? 0;

    const [positions, total] =
      await positionService.getAllPositionsWithPagination(skip, limit);

    const totalPages = Math.ceil(total / limit);

    res.status(200).json({
      positions,
      total,
      totalPages,
      limit,
      skip,
    });
  } catch (error) {
    next(error);
  }
});

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

positionRouter.get("/validate-position/:position", async (req, res, next) => {
  try {
    const { position } = req.params;
    const isDuplicated = await positionService.checkPositionDuplication(
      position
    );
    if (isDuplicated) {
      return res.status(409).json({ error: "이미 사용 중인 직무입니다." });
    }
    return res.status(200).json({ message: "사용 가능한 직무입니다." });
  } catch (error) {
    next(error);
  }
});

export { positionRouter };
