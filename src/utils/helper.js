import dayjs from "dayjs";
import * as XLSX from "xlsx";

function logoutHelper() {
  localStorage.removeItem("token");
  localStorage.removeItem("refreshToken");
  localStorage.removeItem("userId");
  localStorage.removeItem("displayName");
  localStorage.removeItem("userType");
}

const downloadExcel = ({ header, data, fileName, hidden = true }) => {
  const excelData = [
    [...header],
    ...data.map((item) => [
      item.displayName,
      !hidden ? item.message : item.hiddenMessage,
      dayjs(item.createdAt).format("YYYY-MM-DD HH:mm"),
    ]),
  ];

  const wb = XLSX.utils.book_new();
  const ws = XLSX.utils.aoa_to_sheet(excelData);
  XLSX.utils.book_append_sheet(wb, ws, "Sheet1");

  XLSX.writeFile(wb, `${fileName || "download"}.xlsx`);
};

export { logoutHelper, downloadExcel };
