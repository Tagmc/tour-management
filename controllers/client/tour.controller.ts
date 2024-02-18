import { QueryTypes } from "sequelize";
import sequelize from "../../config/database";
import Tour from "../../models/tour.model";
import { Response, Request } from "express";
//[GET] /tours/
export const index = async (req: Request, res: Response) => {
  //SELECT * FROM tours WHERE deleted = false AND status = "active"
  // const tours = await Tour.findAll({
  //   where: {
  //     deleted: false,
  //     status: "active"
  //   },
  //   raw: true //  de data tra ve dung object trong js
  // });

  /*
    SELECT tours.*, price * (1 - discount/100) as price_special
    FROM tours
    JOIN tours_categories ON tours.id = categories.tour_id
    JOIN categories ON tours_categories.category_id = categories.id
    WHERE
      categories.slug = 'du-lich-trong-nuoc'
      AND categories.deleted = false
      AND categories.status = 'active'
      AND tours.deleted = false
      AND tours.status = 'active' 
  */

  const slugCategory = req.params.slugCategory;

  // Hàm round làm tròn lấy 2 chữ số thập phân sau dấu phẩy
  const tours = await sequelize.query(`
  SELECT tours.*, ROUND(price * (1 - discount/100), 0) AS price_special
  FROM tours
  JOIN tours_categories ON tours.id = tours_categories.tour_id
  JOIN categories ON tours_categories.category_id = categories.id
  WHERE
    categories.slug = '${slugCategory}'
    AND categories.deleted = false
    AND categories.status = 'active'
    AND tours.deleted = false
    AND tours.status = 'active';
`, { type: QueryTypes.SELECT }); // 2 đối số truyền vào, đối số thứ 2 sẽ là để định nghĩa kiểu truy vấn để an toàn hơn

  tours.forEach(item => {
    if (item["images"]) {
      item["images"] = JSON.parse(item["images"]); // gán lại kiểu mảng trong js cho image
      item["image"] = item["images"][0];
    }

    item["price_special"] = parseInt(item["price_special"]);
  });
  res.render("client/pages/tours/index.pug", {
    tours: tours,
    pageTitle: "Danh sách tour"
  });
}

//[GET] /tours/detail/:slugTour
export const detail = async (req: Request, res: Response) => {
  /* 
    SELECT *
    FROM tours
    WHERE slug = ':slugTour'
      AND deleted = false
      AND status = 'active';
  */
  const slugTour = req.params.slugTour;

  const tourDetail = await Tour.findOne({
    where: {
      slug: slugTour,
      deleted: false,
      status: "active"
    },
    raw: true
  });

  tourDetail["images"] = JSON.parse(tourDetail["images"]);
  tourDetail["price_special"] = tourDetail["price"] * (1 - tourDetail["discount"] / 100);

  console.log(tourDetail);

  console.log(slugTour);
  res.render("client/pages/tours/detail", {
    pageTitle: "Chi tiết tour",
    tourDetail: tourDetail
  });
};