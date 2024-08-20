import { useMutation } from "@apollo/client";
import { Button, Col, Form, Radio, Row } from "antd";
import Note from '../../note/Note'
import { GlobalContext } from "../../../context/GlobalContext"; 
import { NEW_HISTORIAL_NEGOCIO } from "../../../graphql/mutation/historial";
import { NEW_NOTA } from "../../../graphql/mutation/notas"; 
import { useContext } from "react";

const NewNotaForm = ({ idNegocio, closeDrawer }) => {
  const [form] = Form.useForm();

  const [newNotaResolver] = useMutation(NEW_NOTA);
  const [newHistorialNegocioResolver] = useMutation(NEW_HISTORIAL_NEGOCIO, {
    onCompleted: () => {
      setNoteContent("");
      queryPollDealContent.initial(2000);
      setTimeout(() => {
        queryPollDealContent.close();
      }, 3000);

      closeDrawer(false);
    },
  });

  const { userId, noteContent, queryPollDealContent, setNoteContent } =
    useContext(GlobalContext);

  const onFinish = (v) => {
    const data = {
      not_desc: noteContent,
      not_importancia: v.not_importancia ? Number(v.not_importancia) : 1,
    };

    newNotaResolver({
      variables: {
        input: data,
        idNegocio: idNegocio,
        idUsuario: userId,
      },
    }).then((nota) => {
      const idNota = nota.data.newNotaResolver;
      const template = `####N_${idNota}`;
      const his_detalle = template;

      const input = {
        neg_id: idNegocio,
        eta_id: -1,
        his_detalle,
        usu_id: userId,
        his_etaprevia: -1,
      };

      newHistorialNegocioResolver({ variables: { input } });
    });
  };

  return (
    <Row gutter={[20, 20]}>
      <Col xs={24}>
        <>
          <Form
            form={form}
            requiredMark="optional"
            name="etapas"
            layout="vertical"
            onFinish={(v) => onFinish(v)}
            autoComplete="off"
            initialValues={{ not_importancia: "1" }}
          >
            <div className="layout-wrapper">
              <div className="layout-form">
                <Note width={300} height={200} />
                <Row gutter={[20, 20]}>
                  <Col sm={24}>
                    <Form.Item name="not_importancia">
                      <Radio.Group buttonStyle="solid" className="custom-radio">
                        <Radio.Button value="1">Alta</Radio.Button>
                        <Radio.Button value="2">Media</Radio.Button>
                        <Radio.Button value="3">Baja</Radio.Button>
                      </Radio.Group>
                    </Form.Item>
                  </Col>
                </Row>
              </div>
              <div className="layout-footer">
                <Button type="primary" htmlType="submit" block>
                  Guardar
                </Button>
              </div>
            </div>
          </Form>
        </>
      </Col>
    </Row>
  );
};

export default NewNotaForm;
