import DocIcon from "../components/icons/doc" 
import FileIcon from "../components/icons/file" 
import JpgIcon from "../components/icons/jpg" 
import PdfIcon from "../components/icons/pdf" 
import PngIcon from "../components/icons/png" 
import TxtIcon from "../components/icons/txt" 
import XlsIcon from "../components/icons/xls" 

const returnExtIcon = (ext) => {
  switch (true) {
    case ext === "docx" || ext === "doc":
      return <DocIcon />;

    case ext === "image/png":
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
