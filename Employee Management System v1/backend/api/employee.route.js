import express from "express";
import EmployeeController from "./employee.controller.js";
const router = express.Router(); // get access to express router
router.route("/").get(EmployeeController.apiGetAllEmployees);
router.route("/department").get(EmployeeController.apiGetDepartment);
router.route("/id/:id").get(EmployeeController.apiGetEmployeeById);
router
  .route("/employeeData")
  .post(EmployeeController.apiPostEmployee)
  .put(EmployeeController.apiUpdateEmployee)
  .delete(EmployeeController.apiDeleteEmployee);

export default router;
