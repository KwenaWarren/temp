import mongodb from "mongodb";
const ObjectId = mongodb.ObjectId;

let employee;
export default class EmployeeDAO {
  static async injectDB(conn) {
    if (employee) {
      return;
    }
    try {
      employee = await conn.db(process.env.EMPLOYEE_NS).collection("employee");
    } catch (e) {
      console.error(`unable to connect in employeeDAO: ${e}`);
    }
  }
  static async GetAllEmployees({
    // default filter
    filters = null,
    page = 0,
    employeePerPage = 15, // will only get 15 employees at once
  } = {}) {
    let query;
    if (filters) {
      if ("Name" in filters) {
        query = { $text: { $search: filters["Name"] } };
      } else if ("Department" in filters) {
        query = { Department: { $eq: filters["Department"] } };
      }
    }
    let cursor;
    try {
      cursor = await employee
        .find(query)
        .limit(employeePerPage)
        .skip(employeePerPage * page);
      const employeeList = await cursor.toArray();
      const totalNumemployee = await employee.countDocuments(query);
      return { employeeList, totalNumemployee };
    } catch (e) {
      console.error(`Unable to issue find command, ${e}`);
      return { employeeList: [], totalNumemployee: 0 };
    }
  }
  static async getDepartment() {
    let Department = [];
    try {
      Department = await employee.distinct("Department");
      return Department;
    } catch (e) {
      console.error(`unable to get Department, $(e)`);
      return Department;
    }
  }

  static async addEmployee(
    Name,
    Surname,
    Email,
    ContactNumber,
    IDNumber,
    Address,
    Role,
    Department
  ) {
    try {
      const employeeDoc = {
        Name: Name,
        Surname: Surname,
        Email: Email,
        ContactNumber: ContactNumber,
        IDNumber: IDNumber,
        Address: Address,
        Role: Role,
        Department: Department,
      };
      return await employee.insertOne(employeeDoc);
    } catch (e) {
      console.error(`unable to add employee: ${e}`);
      return { error: e };
    }
  }
  static async updateEmployee(
    employeeId,
    Name,
    Surname,
    Email,
    ContactNumber,
    IDNumber,
    Address,
    Role,
    Department
  ) {
    try {
      const updateResponse = await employee.updateOne(
        { _id: ObjectId(employeeId) },
        {
          $set: {
            Name: Name,
            Surname: Surname,
            Email: Email,
            ContactNumber: ContactNumber,
            IDNumber: IDNumber,
            Address: Address,
            Role: Role,
            Department: Department,
          },
        }
      );
      return updateResponse;
    } catch (e) {
      console.error(`unable to update employee: ${e}`);
      return { error: e };
    }
  }
  static async getEmployeeById(id) {
    try {
      return await employee
        .aggregate([
          {
            $match: {
              _id: new ObjectId(id),
            },
          },
        ])
        .next();
    } catch (e) {
      console.error(`something went wrong in getEmployeeById: ${e}`);
      throw e;
    }
  }
  static async deleteEmployee(employeeId) {
    try {
      const deleteResponse = await employee.deleteOne({
        _id: ObjectId(employeeId),
      });
      return deleteResponse;
    } catch (e) {
      console.error(`unable to delete employee: ${e}`);
      return { error: e };
    }
  }
}
