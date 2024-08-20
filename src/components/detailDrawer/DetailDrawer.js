import { Drawer } from "antd";
import DealContent from "./detailContent/DealContent";

const DetailDrawer = ({ showDetailDrawer, closeDrawer }) => {
  const renderDetailContent = () => {
    switch (true) {
      case showDetailDrawer.type === "negocio":
        return <DealContent idNegocio={showDetailDrawer.idContent} />;
      default:
        break;
    }
  };

  return (
    <Drawer
      width={650}
      open={showDetailDrawer.visible}
      onClose={() => closeDrawer({ visible: false, type: "", idContent: null })}
    >
      {renderDetailContent()}
    </Drawer>
  );
};

export default DetailDrawer;
