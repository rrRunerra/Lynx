import { Request, Response } from "express";

export class API {
  public route?: string;
  public enabled: boolean;
  public docs: string;

  constructor(options: { route?: string; enabled: boolean; docs: string }) {
    this.route = options.route;
    this.enabled = options.enabled;
    this.docs = options.docs;
  }

  public GET(req: Request, res: Response): any {
    return res.status(405).send("Method Not Allowed");
  }

  public POST(req: Request, res: Response): any {
    return res.status(405).send("Method Not Allowed");
  }

  public PUT(req: Request, res: Response): any {
    return res.status(405).send("Method Not Allowed");
  }

  public DELETE(req: Request, res: Response): any {
    return res.status(405).send("Method Not Allowed");
  }

  public PATCH(req: Request, res: Response): any {
    return res.status(405).send("Method Not Allowed");
  }
}
