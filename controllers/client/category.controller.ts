import { Response, Request } from "express";
import Category from "../../models/category.model";
//[GET] /categories/
export const index =  async (req: Request, res: Response) => {
  //SELECT * FROM tours WHERE deleted = false AND status = "active"
  const categories = await Category.findAll({
    where: {
      deleted: false,
      status: "active"
    },
    raw: true //  de data tra ve dung object trong js
  });

  console.log(categories);

  res.render("client/pages/categories/index.pug", {
    categories: categories,
    pageTitle: "Danh sách danh mục"
  });
}