import React, { createRef, useEffect } from 'react';
import { Col, Form, Input, Row } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { setDesarrolloAction } from '../../../appRedux/actions/menu/desarrollo';

const Desarrollo = () => {
    const formRef = createRef();
    const dispatch = useDispatch();
    const desarrollo = useSelector(state => state.desarrollo);
    const { historiaClinica , visualizar } = useSelector(state => state.helpers)


    useEffect(() => {
        formRef.current.setFieldsValue({
            relatoMedico: desarrollo.relatoMedico,
            conclusion: desarrollo.conclusion,
            observaciones: desarrollo.observaciones,

        });
    }, [desarrollo])

    //Setteos
    const handleChangeRelatoMedico = (e) => {
        dispatch(setDesarrolloAction({
            ...desarrollo,
            relatoMedico: e.target.value
        }))
    };
    const handleChangeConclusion = (e) => {
        dispatch(setDesarrolloAction({
            ...desarrollo,
            conclusion: e.target.value
        }))
    };
    const handleChangeObservaciones = (e) => {
        dispatch(setDesarrolloAction({
            ...desarrollo,
            observaciones: e.target.value
        }))
    };


    return (
        <Form
            ref={formRef}
            layout="vertical"
        >
            <Row style={{ flexDirection: "row", paddingTop: 20 }}>
                <Col lg={24} md={24} sm={24} xs={24}>
                    <Form.Item
                        name="relatoMedico"
                        label="Relato Medico"
                        rules={[
                            {
                                required: true,
                                message: "Ingrese un relato médico valido",
                            }
                        ]}
                    >
                        <Input.TextArea
                            disabled={historiaClinica | visualizar}
                            rows={4}
                            placeholder="Ingrese su relato médico "
                            onChange={handleChangeRelatoMedico}
                        />
                    </Form.Item>
                </Col>
                <Col lg={24} md={24} sm={24} xs={24}>
                    <Form.Item
                        name="conclusion"
                        label="Conclusion"
                        rules={[
                            {
                                required: true,
                                message: "Ingrese una Conclusion valida",
                            }
                        ]}
                    >
                        <Input.TextArea
                            disabled={historiaClinica | visualizar}
                            rows={4}
                            placeholder="Ingrese su Conclusion"
                            onChange={handleChangeConclusion}
                        />
                    </Form.Item>
                </Col>
                <Col lg={24} md={24} sm={24} xs={24}>
                    <Form.Item
                        name="observaciones"
                        label="Observaciones"
                        rules={[
                            {
                                required: true,
                                message: "Ingrese Observaciones validas",
                            }
                        ]}
                    >
                        <Input.TextArea
                            disabled={historiaClinica | visualizar}
                            rows={4}
                            placeholder="Ingrese sus Observaciones"
                            onChange={handleChangeObservaciones}
                        />
                    </Form.Item>
                </Col>
            </Row>
        </Form>
    )
}
export default Desarrollo;
