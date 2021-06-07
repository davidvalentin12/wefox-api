import request from "supertest";
import App from "@/app";
import IndexRoute from "@/modules/index/index.route";

afterAll(async () => {
  await new Promise<void>((resolve) => setTimeout(() => resolve(), 500));
});

describe("Index Route", () => {
  describe("[GET] /", () => {
    it("should give response 200", () => {
      const indexRoute = new IndexRoute();
      const app = new App([indexRoute]);
      return request(app.getServer()).get(`${indexRoute.path}`).expect(200);
    });
  });
});
