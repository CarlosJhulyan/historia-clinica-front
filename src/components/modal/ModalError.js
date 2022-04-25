import SweetAlert from "react-bootstrap-sweetalert";

export const ModalError = ({ mostrarErrorModal, setMostrarErrorModal }) => {
    return (
        <SweetAlert
            show={mostrarErrorModal}
            error
            timeout="2500"
            onConfirm={() => setMostrarErrorModal(false)}
            confirmBtnText="OK"
            title="Error">
            <h5>El diente final se debe seleccionar hacia la parte derecha</h5>
        </SweetAlert>
    );
}
