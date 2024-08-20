/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import React, { Fragment, useContext, useEffect, useState } from "react";
import { Col, Row } from "antd";
import { GlobalContext } from "../../context/GlobalContext";
import 'quill/dist/quill.snow.css';
import { useQuill } from 'react-quilljs';

const Note = ({ editValue, width, height, taskNote }) => {
  const [value, setValue] = useState("");
  const { setNoteContent } = useContext(GlobalContext);
  var toolbarOptions = [
    ["bold", "italic", "underline"],
    [{ link: true }],
    [{ list: "ordered" }, { list: "bullet" }],
    ["clean"],
  ];

  const { quill, quillRef, Quill } = useQuill({
    modules: { magicUrl: true, toolbar: toolbarOptions },
  });

  if (Quill && !quill) {
    const MagicUrl = require("quill-magic-url").default;
    Quill.register('modules/magicUrl', MagicUrl);
  }

  //* Effect para prop nota de la tarea
  useEffect(() => {
    if (quill && taskNote) {
      quill.clipboard.dangerouslyPasteHTML(taskNote);
    }
  }, [quill, taskNote]);

  useEffect(() => {
    if (editValue) {
      setValue(editValue);

      if (quill) {
        quill.clipboard.dangerouslyPasteHTML(editValue);
        setValue(editValue);
      }
    }
    if (quill) {
      quill.on("text-change", () => {
        setValue(quill.root.innerHTML);
        setNoteContent(quill.root.innerHTML);
      });
    }
  }, [editValue, quill]);

  return (
    <Fragment>
      <Row gutter={[20, 20]}>
        <Col sm={24}>
          <div style={{ width: width }}>
            <div ref={quillRef} style={{ minHeight: height }} />
          </div>
        </Col>
      </Row>
    </Fragment>
  );
};

export default Note;
