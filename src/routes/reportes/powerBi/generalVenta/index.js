import { Card } from "antd";

const GeneralVenta = () => {
  return (
    <Card
      title={<div style={{ fontSize: "22px" }}>Tablero General - Venta</div>}
    >
      <iframe
        title="Venta_Biensalud"
        width="100%"
        height="804"
        src="https://www.powerbi.com/view?r=eyJrIjoiMWRjYzE0N2MtZWUxZC00NWM5LWEzYTEtODEwOTc3OWFlZGJiIiwidCI6ImViNjNjNGEzLTI5ZGEtNGMzMS05OTI3LThmMjgyMjc3Nzk5OCJ9&pageName=ReportSection"
        frameborder="0"
        allowFullScreen="true"
      ></iframe>
    </Card>
  );
};

export default GeneralVenta;
