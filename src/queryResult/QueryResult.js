import { Empty, Spin } from "antd";
import "./index.css";

const QueryResult = ({ loading, error, data, children }) => {
 //console.log(data)
  if (error) {
    return <p>ERROR: {error.message}</p>;
  }
  if (loading) {
    return (
      <div className="center-wrapper">
        <Spin />
      </div>
    );
  }
  if (!data || data.length === 0) {
    return (
      <div className="center-wrapper">
        <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
      </div>
    );
  }
  if (data) {
    return children;
  }
};

export default QueryResult;
