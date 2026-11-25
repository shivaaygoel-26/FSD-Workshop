const express = require("express");
const app = express();

app.use(express.json());

let leaves = [
  {
    id: 701,
    employeeName: "Aranya Singh",
    employeeCode: "EMP101",
    leaveType: "Casual",
    days: 2,
    status: "Pending",
  },
  {
    id: 702,
    employeeName: "Rahul Verma",
    employeeCode: "EMP102",
    leaveType: "Sick",
    days: 1,
    status: "Approved",
  },
  {
    id: 703,
    employeeName: "Simran Kaur",
    employeeCode: "EMP103",
    leaveType: "Earned",
    days: 3,
    status: "Rejected",
  },
];

const validate = (data) => {
  const types = ["Casual", "Sick", "Earned"];
  const statuses = ["Pending", "Approved", "Rejected"];

  if (
    typeof data.employeeName !== "string" ||
    !data.employeeName.trim() ||
    typeof data.employeeCode !== "string" ||
    !data.employeeCode.trim() ||
    !types.includes(data.leaveType) ||
    !Number.isInteger(data.days) ||
    data.days <= 0 ||
    !statuses.includes(data.status)
  ) {
    return false;
  }

  return true;
};

// 1. GET all records
app.get("/api/leaves", (req, res) => {
  res.status(200).json(leaves);
});

// 2. POST new record
app.post("/api/leaves", (req, res) => {
  const data = req.body;

  if (!validate(data)) {
    return res.status(400).json({
      message: "Invalid input",
    });
  }

  const newId = Math.max(...leaves.map((l) => l.id), 700) + 1;

  const newLeave = {
    id: newId,
    employeeName: data.employeeName,
    employeeCode: data.employeeCode,
    leaveType: data.leaveType,
    days: data.days,
    status: data.status,
  };

  leaves.push(newLeave);

  res.status(201).json(newLeave);
});

// 3. GET pending requests
app.get("/api/leaves/pending", (req, res) => {
  const result = leaves.filter((l) => l.status.toLowerCase() === "pending");

  res.status(200).json(result);
});

// 4. Filter records by status
app.get("/api/leaves/status/:status", (req, res) => {
  const status = req.params.status.toLowerCase();

  const result = leaves.filter((l) => l.status.toLowerCase() === status);

  res.status(200).json(result);
});

// 5. GET leave by ID
app.get("/api/leaves/:id", (req, res) => {
  const id = Number(req.params.id);

  const leave = leaves.find((l) => l.id === id);

  if (!leave) {
    return res.status(404).json({
      message: "Leave record not found",
    });
  }

  res.status(200).json(leave);
});

// 6. PUT update record
app.put("/api/leaves/:id", (req, res) => {
  const id = Number(req.params.id);

  const index = leaves.findIndex((l) => l.id === id);

  if (index === -1) {
    return res.status(404).json({
      message: "Leave record not found",
    });
  }

  const updatedData = {
    ...leaves[index],
    ...req.body,
    id: id,
  };

  if (!validate(updatedData)) {
    return res.status(400).json({
      message: "Invalid input",
    });
  }

  leaves[index] = updatedData;

  res.status(200).json(updatedData);
});

// 7. DELETE record
app.delete("/api/leaves/:id", (req, res) => {
  const id = Number(req.params.id);

  const index = leaves.findIndex((l) => l.id === id);

  if (index === -1) {
    return res.status(404).json({
      message: "Leave record not found",
    });
  }

  leaves.splice(index, 1);

  res.status(200).json({
    message: "Leave record deleted successfully",
  });
});

// Start server
app.listen(3000, () => {
  console.log("Server running on port 3000");
});
