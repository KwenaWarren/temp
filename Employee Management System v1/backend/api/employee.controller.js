import EmployeeDAO from "../dao/employeeDAO.js";

export default class EmployeeController {
  static async apiGetAllEmployees(req, res, next) {
    const employeePerPage = req.query.employeePerPage
      ? parseInt(req.query.employeePerPage)
      : 15;
    const page = req.query.page ? parseInt(req.query.page) : 0;
    let filters = {};
    if (req.query.Department) {
      filters.Department = req.query.Department;
    } else if (req.query.Name) {
      filters.Name = req.query.Name;
    }
    const { employeeList, totalNumemployee } =
      await EmployeeDAO.GetAllEmployees({ filters, page, employeePerPage });
    let response = {
      employee: employeeList,
      page: page,
      filters: filters,
      entries_per_page: employeePerPage,
      total_results: totalNumemployee,
    };
    res.json(response);
  }

  static async apiGetDepartment(req, res, next) {
    try {
      let propertyTypes = await EmployeeDAO.getDepartment();
      res.json(propertyTypes);
    } catch (e) {
      console.log(`api,${e}`);
      res.status(500).json({ error: e });
    }
  }
  static async apiPostEmployee(req, res, next) {
    try {
      const Name = req.body.Name;
      const Surname = req.body.Surname;
      const Email = req.body.Email;
      const ContactNumber = req.body.ContactNumber;
      const IDNumber = req.body.IDNumber;
      const Address = req.body.Address;
      const Role = req.body.Role;
      const Department = req.body.Department;

      const Response = await EmployeeDAO.addEmployee(
        Name,
        Surname,
        Email,
        ContactNumber,
        IDNumber,
        Address,
        Role,
        Department
      );
      res.json({ status: "success " });
    } catch (e) {
      res.status(500).json({ error: e.message });
    }
  }
  static async apiUpdateEmployee(req, res, next) {
    try {
      const employeeId = req.body.employeeId;
      const Name = req.body.Name;
      const Surname = req.body.Surname;
      const Email = req.body.Email;
      const ContactNumber = req.body.ContactNumber;
      const IDNumber = req.body.IDNumber;
      const Address = req.body.Address;
      const Role = req.body.Role;
      const Department = req.body.Department;

      const updateResponse = await EmployeeDAO.updateEmployee(
        employeeId,
        Name,
        Surname,
        Email,
        ContactNumber,
        IDNumber,
        Address,
        Role,
        Department
      );
      var { error } = updateResponse;
      if (error) {
        res.status.json({ error });
      }
      if (updateResponse.modifiedCount === 0) {
        throw new Error(
          "unable to update employee. User may not be original poster"
        );
      }
      res.json({ status: "success " });
    } catch (e) {
      res.status(500).json({ error: e.message });
    }
  }
  static async apiDeleteEmployee(req, res, next) {
    try {
      const employeeId = req.body.employeeId;

      const EmployeeResponse = await EmployeeDAO.deleteEmployee(employeeId);

      res.json({ status: "success " });
    } catch (e) {
      res.status(500).json({ error: e.message });
    }
  }
  static async apiGetEmployeeById(req, res, next) {
    try {
      let id = req.params.id || {};
      let employee = await EmployeeDAO.getEmployeeById(id);
      if (!employee) {
        res.status(404).json({ error: "not found" });
        return;
      }
      res.json(employee);
    } catch (e) {
      console.log(`api, ${e}`);
      res.status(500).json({ error: e });
    }
  }
}
