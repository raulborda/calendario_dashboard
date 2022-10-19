import DocIcon from "../Components/icons/doc";
import FileIcon from "../Components/icons/file";
import JpgIcon from "../Components/icons/jpg";
import PdfIcon from "../Components/icons/pdf";
import PngIcon from "../Components/icons/png";
import TxtIcon from "../Components/icons/txt";
import XlsIcon from "../Components/icons/xls";

const returnExtIcon = (ext) => {
  switch (true) {
    case ext === "docx" || ext === "doc":
      return <DocIcon />;

    case ext === "image/png" || ext === "png":
      return <PngIcon />;

    case ext === "application/pdf" || ext === "pdf":
      return <PdfIcon />;

    case ext === "txt":
      return <TxtIcon />;

    case ext === "xls" || ext === "xlsx":
      return <XlsIcon />;

    case ext === "jpg" || ext === "jpeg":
      return <JpgIcon />;

    default:
      return <FileIcon />;
  }
};

export default returnExtIcon;