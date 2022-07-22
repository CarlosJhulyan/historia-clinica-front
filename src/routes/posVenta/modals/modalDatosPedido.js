import React, { useState } from 'react';
import {
  Form,
  Button,
  Row,
  Input,
  Col,
  Modal,
  Divider,
  Radio,
  Space
} from 'antd';

import Doctor from '../../../assets/posventa/doctor.png';
import Paciente from '../../../assets/posventa/paciente.png';
import ModalListaMedicos from '../modalListas/modalListaMedicos';
import ModalListaPacientes from '../modalListas/modalListaPacientes';
import ModalListaClientes from '../modalListas/modalListaClientes';
import { openNotification } from '../../../util/util';
import ModalLoading from '../../../util/modalLoading';

function ModalDatosPedido({
                              visible,
                              setVisible,
                              pacienteCurrent,
                              setPacienteCurrent,
                              medicoCurrent,
                              setMedicoCurrent,
                              clienteCurrent,
                              setClienteCurrent,
                              visibleDatosPedidoAceptar,
                              grabarPedido,
                              guardarDatosPedidoCabecera,
                              loadingGrabarPedido,
                              tipoVenta,
                              setTipoVenta,
}) {
  const { confirm } = Modal;
	const [visibleModalMedicos, setVisibleModalMedicos] = useState(false);
	const [visibleModalPacientes, setVisibleModalPacientes] = useState(false);
	const [visibleModalCliente, setVisibleModalCliente] = useState(false);
	const [guardando, setGuardando] = useState(false);

	const handleLimpiar = () => {
    confirm({
      content: '¿Esta seguro de limpiar los Datos de pedido?',
      onOk:() => {
        setMedicoCurrent({});
        setPacienteCurrent({});
        setClienteCurrent({});
      },
      centered: true,
      okText: 'Continuar',
      cancelText: 'Cancelar',
    });
	};

	return (
		<>
			<Modal
				centered
				width={1100}
				footer={[]}
				visible={visible}
				title="Datos de Pedido"
				className="modal-posventa"
				onCancel={guardando ? null : () => setVisible(false)}
			>
				<Row justify="space-between" style={{ marginTop: 10, marginLeft: 0, marginRight: 20 }}>
					<Col span={24}>
						<Row justify="space-between" style={{ margin: 0 }} align="middle">
							<Col span={19}>
								<Row>
									<Col span={18}>
										<Form labelCol={{ span: 8 }} wrapperCol={{ span: 16 }}>
											<h5>Datos de Medico</h5>
											<Form.Item label="CMP" style={{ margin: 0 }}>
												<Input disabled size="small" value={medicoCurrent.CMP} />
											</Form.Item>
											<Form.Item label="Nombre Completo" style={{ margin: 0 }}>
												<Input disabled size="small" value={medicoCurrent.NOMBRE_COMPLETO} />
											</Form.Item>
										</Form>
									</Col>
									<Col span={6}>
										<Button
											block
											onClick={() => setVisibleModalMedicos(true)}
											style={{ display: 'block', height: 'auto', padding: 10, margin:0 }}
										>
											<img src={Doctor} />
										</Button>
									</Col>
									<Divider />
									<Col span={18}>
										<h5>Datos de Paciente</h5>
										<Form labelCol={{ span: 7 }} wrapperCol={{ span: 17 }}>
											<Row>
                        <Col span={10}>
                          <Form.Item label="DNI" style={{ margin: 0 }}>
                            <Input disabled size="small" value={pacienteCurrent.NUM_DOCUMENTO} />
                          </Form.Item>
                        </Col>
                        <Col span={14}>
                          <Form.Item label="Nacimiento" style={{ margin: 0 }}>
                            <Input disabled size="small" value={pacienteCurrent.FEC_NAC_CLI} />
                          </Form.Item>
                        </Col>
                      </Row>
											<Form.Item label="Nombres" style={{ margin: 0 }}>
												<Input disabled size="small" value={pacienteCurrent.NOMBRE} />
											</Form.Item>
											<Form.Item label="Apellidos" style={{ margin: 0 }}>
												<Input
													disabled
													size="small"
													value={`${
														pacienteCurrent.APE_PATERNO ? pacienteCurrent.APE_PATERNO : ''
													} ${pacienteCurrent.APE_MATERNO ? pacienteCurrent.APE_MATERNO : ''}`}
												/>
											</Form.Item>
										</Form>
									</Col>
									<Col span={6}>
										<Button
											block
											onClick={() => setVisibleModalPacientes(true)}
											style={{ display: 'block', height: 'auto', padding: 10, margin:0 }}
										>
											<img src={Paciente} />
										</Button>
									</Col>
								</Row>
							</Col>
							<Col span={5}>
								<Row>
									<Button
										block
										style={{
											backgroundColor: '#0169aa',
											color: 'white',
										}}
										onClick={guardando ? null : () => setVisibleModalMedicos(true)}
									>
										Ingreso Médico
									</Button>
									<Button
										block
										style={{
											backgroundColor: '#0169aa',
											color: 'white',
										}}
										onClick={guardando ? null : () => setVisibleModalPacientes(true)}
									>
										Ingreso paciente
									</Button>
									<Button
										block
										style={{
											backgroundColor: '#0169aa',
											color: 'white',
										}}
										onClick={guardando ? null : handleLimpiar}
									>
										Limpiar
									</Button>
									<Button
										block
										style={{
											backgroundColor: '#36AE7C',
											color: 'white',
										}}
										disabled={!clienteCurrent.key || !medicoCurrent.key || !pacienteCurrent.NUM_DOCUMENTO}
										onClick={
											guardando
												? null
												: () => {
														if (grabarPedido) {
															const fun = async () => {
																setGuardando(true);
																console.log('grabando');
																console.log(pacienteCurrent, medicoCurrent, clienteCurrent);
																if (
																	pacienteCurrent.COD_PACIENTE &&
																	medicoCurrent.key &&
																	clienteCurrent.key
																) {
																	await guardarDatosPedidoCabecera();
																} else {
																	openNotification(
																		'error',
																		'Debe ingresar un paciente, médico y cliente',
																		'Alerta'
																	);
																}
																console.log('grabado');
																setGuardando(false);
															};
															fun();
														} else {
															setVisible(false);
															visibleDatosPedidoAceptar();
														}
												  }
										}
                    loading={loadingGrabarPedido}
									>
                    {grabarPedido ? 'Generar' : 'Aceptar'}
									</Button>
									<Button
										block
										style={{
											backgroundColor: "#EB5353",
											color: 'white',
										}}
										onClick={guardando ? null : () => setVisible(false)}
									>
										Cerrar
									</Button>
									<Button></Button>
								</Row>
							</Col>
						</Row>
						<small style={{ color: 'red' }}>
							Para ingresar los datos de Médico y Paciente, hacer CLICK en las imágenes
						</small>
						<Divider />
						<Row>
							<Col span={5}>
								<br />
								<h5>Selección de Tipo...</h5>
								<Form>
									<Radio.Group value={tipoVenta} onChange={e => setTipoVenta(e.target.value)}>
										<Space direction="vertical">
											<Radio disabled value='05'>
												Ticket
											</Radio>
											<Radio value='01'>Boleta</Radio>
											<Radio value='02'>Factura</Radio>
										</Space>
									</Radio.Group>
								</Form>
							</Col>
							<Col span={1}></Col>
							<Col span={17}>
								<Form labelCol={{ span: 5 }} wrapperCol={{ span: 19 }}>
									<Form.Item label="Documento" style={{ margin: 0 }}>
										<Input
											style={{ cursor: 'pointer' }}
											addonAfter={
												<span onClick={() => setVisibleModalCliente(true)}>
													Seleccionar Cliente
												</span>
											}
											size="small"
											disabled
											value={clienteCurrent.NUM_DOCUMENTO}
										/>
									</Form.Item>
									<Form.Item label="Nombres" style={{ margin: 0 }}>
										<Input size="small" disabled value={clienteCurrent.CLIENTE} />
									</Form.Item>
									<Form.Item label="Dirección" style={{ margin: 0 }}>
										<Input size="small" disabled value={clienteCurrent.DIRECCION} />
									</Form.Item>
									<Form.Item label="Email" style={{ margin: 0 }}>
										<Input size="small" disabled value={clienteCurrent.CORREO} />
									</Form.Item>
								</Form>
							</Col>
						</Row>
					</Col>
					{/* <Col span={6}>
            <h5>Seleccionar Fecha y Hora para reservar...</h5>
            <Form>
              <Form.Item label='Fecha'>
                <DatePicker
                  size='small'
                  style={{width: '100%'}}
                />
              </Form.Item>
              <Form.Item>
                <Button
                  block
                  size='small'
                >
                  Buscar Turnos Disponibles
                </Button>
              </Form.Item>
            </Form>

            <Form.Item>
              <TextArea style={{height: 300}}>

              </TextArea>
            </Form.Item>
            <Form.Item label='Celular' style={{margin: 0}}>
              <Input size='small'/>
            </Form.Item>
            <Form.Item label='Correo' style={{margin: 0}}>
              <Input size='small'/>
            </Form.Item>
          </Col> */}
				</Row>
			</Modal>
			{visibleModalMedicos ? (
				<ModalListaMedicos
					setVisible={setVisibleModalMedicos}
					visible={visibleModalMedicos}
					setMedicoCurrent={setMedicoCurrent}
				/>
			) : null}
      {visibleModalPacientes && (
        <ModalListaPacientes
          visible={visibleModalPacientes}
          setVisible={setVisibleModalPacientes}
          setPacienteCurrent={setPacienteCurrent}
          setClienteCurrent={setClienteCurrent}
        />
      )}
      {visibleModalCliente && (
        <ModalListaClientes
          visible={visibleModalCliente}
          setVisible={setVisibleModalCliente}
          setClienteCurrent={setClienteCurrent}
        />
      )}
      {guardando ? <ModalLoading></ModalLoading> : null}
		</>
	);
}

export default ModalDatosPedido;
