const knex = require("../db");

exports.insertCommentByArticleId = ({ article_id }, { username, body }) => {
  return knex("comments")
    .insert({ author: username, article_id, body })
    .returning("*");
};

exports.selectCommentsByArticleId = (
  { article_id },
  { sort_by = "created_at", order = "desc" }
) => {
  if (!["asc", "desc"].includes(order)) {
    return Promise.reject({ status: 400, msg: "bad request" });
  }
  return knex("comments")
    .select("comment_id", "votes", "created_at", "author", "body")
    .orderBy(sort_by, order)
    .where({ article_id })
    .then((dbResponse) => {
      if (dbResponse.length === 0)
        return Promise.reject({ status: 404, msg: "value not found" });
      return dbResponse;
    });
};