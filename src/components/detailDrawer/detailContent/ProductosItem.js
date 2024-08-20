import { Table } from "antd";
const ProductosItem = ({ data }) => {
  const columns = [
    {
      title: "Nombre",
      dataIndex: "prod_desc",
      key: "nombre",
    },
    {
      title: "Cantidad",
      dataIndex: "cantidad",
      key: "cantidad",
    },
    {
      title: "Valor",
      dataIndex: "valor",
      key: "valor",
    },
    {
      title: "Total",
      key: "total",
      render: (text, record) => {
        return (
          <span>
            U$D{" "}
            {Number(record.cantidad * record.valor).toLocaleString("de-DE", {
              maximumFractionDigits: 2,
            })}
          </span>
        );
      },
    },
  ];
  return <Table dataSource={data} columns={columns} />;
};

export default ProductosItem;
