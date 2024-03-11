import { Router } from "express";
import axios from "axios";

const router = Router();
const { request } = axios;

router.route("/:formId/filteredResponses").get(async (req, res) => {
  const { formId } = req.params;
  const { page, pageSize, filters } = req.query;
  const API_KEY = process.env.API_KEY;
  try {
    const responseFilters = filters ? JSON.parse(filters) : [];
    const options = {
      method: "GET",
      url: `https://api.fillout.com/v1/api/forms/${formId}/submissions`,
      headers: {
        Authorization: `Bearer ${API_KEY}`,
      },
      params: {
        page: page || 1,
        pageSize: pageSize || 10,
      },
    };
    console.log("options: ", options);
    const response = await request(options);

    const responseData = response?.data;

    const filteredResponses = responseData.responses.filter((response) =>
      responseFilters.every((filter) => {
        const question = response.questions.find((q) => q.id === filter.id);
        if (!question) return false;

        switch (filter.condition) {
          case "equals":
            return question.value == filter.value;
          case "does_not_equal":
            return question.value != filter.value;
          case "greater_than":
            return isDate(question.value) && isDate(filter.value)
              ? new Date(question.value) > new Date(filter.value)
              : parseFloat(question.value) > parseFloat(filter.value);
          case "less_than":
            return isDate(question.value) && isDate(filter.value)
              ? new Date(question.value) < new Date(filter.value)
              : parseFloat(question.value) < parseFloat(filter.value);
          default:
            return true;
        }
      })
    );

    // Adjust the response with filtered data
    const adjustedData = {
      responses: filteredResponses,
      totalResponses: filteredResponses.length,
      pageCount: Math.ceil(filteredResponses.length / (pageSize || 10)),
    };

    res.json(adjustedData);
  } catch (error) {
    console.error("Error fetching form responses:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

export default router;
