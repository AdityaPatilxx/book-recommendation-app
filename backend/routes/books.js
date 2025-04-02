const express = require("express");
const axios = require("axios");
const router = express.Router();

const API_KEY = "AIzaSyDvssQIhuDRe-yeC_4mj-BYzV1A1kcGQt0";

router.get("/search", async (req, res, next) => {
  try {
    const { q: query, maxResults = 10 } = req.query;
    if (!query) {
      return res.status(400).json({
        success: false,
        message: "please provide a query (q parameter)",
      });
    }

    const response = await axios.get(
      "https://www.googleapis.com/books/v1/volumes",
      {
        params: {
          q: query,
          maxResults: parseInt(maxResults),
          key: API_KEY,
        },
      }   
    );

    if (!response.data.items || response.data.items.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No books found matching your search",
      });
    }

    const books = response.data.items.map((item) => ({
      id: item.id,
      title: item.volumeInfo.title,
      authors: item.volumeInfo.authors || ["Unknown"],
      publisher: item.volumeInfo.publisher || "Not specified",
      publishedDate: item.volumeInfo.publishedDate,
      description:
        item.volumeInfo.description?.substring(0, 200) + "..." ||
        "No description available",
      pageCount: item.volumeInfo.pageCount,
      categories: item.volumeInfo.categories || [],
      averageRating: item.volumeInfo.averageRating || "Not rated",
      thumbnail: item.volumeInfo.imageLinks?.thumbnail || null,
      previewLink: item.volumeInfo.previewLink,
    }));

    res.json({
      success: true,
      count: books.length,
      query,
      data: books,
    });
  } catch (error) {
    next(error);
  }
});

router.get("/debug", async (req, res) => {
  const {q:query, maxResults = 10 } = req.query
  const response = await axios.get(
    "https://www.googleapis.com/books/v1/volumes",
    {
      params: {
        q: query,
        maxResults: maxResults,
        key: API_KEY,
      },
    }
  );

  res.json(response.data);
});

module.exports = router;
