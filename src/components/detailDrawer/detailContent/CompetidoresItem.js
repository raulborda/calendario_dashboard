import { Card, Col, Row, Table } from "antd";

const CompetidoresItem = ({ data }) => {
  const columns = [
    {
      title: "Nombre",
      dataIndex: "com_nombre",
      key: "nombre",
    },
    {
      title: "Producto",
      dataIndex: "com_producto",
      key: "producto",
    },
    {
      title: "Precio",
      dataIndex: "com_precio",
      key: "precio",
    },
  ];

  return (
    <Table
      dataSource={data}
      columns={columns}
      pagination={false}
      expandable={{
        expandedRowRender: (record) => {
          return (
            <Row align="middle" justify="space-around" gutter={[12, 12]}>
              <Col xs={12}>
                <Card title="Fortalezas">{record.com_fortalezas}</Card>
              </Col>
              <Col xs={12}>
                <Card title="Debilidades">{record.com_debilidades}</Card>
              </Col>
            </Row>
          );
        },
        rowExpandable: (record) => record.name !== "Not Expandable",
      }}
    />
  );
};

export default CompetidoresItem;
