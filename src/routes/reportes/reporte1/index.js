import { Card, Button } from "antd";
import React, { useRef } from "react";
import Cuerpo from "./cuerpo";
import ReactToPrint from "react-to-print";
import { PrinterOutlined } from "@ant-design/icons";

const Reporte1 = () => {
  const pageStyle = `
		@page {
			margin: 15
		}

		@media all {
			.pagebreak {
			display: none;
			}
		}

		@media print {
			.pagebreak {
        margin-top: 1rem;
        display: block;
        page-break-before: auto;
			}
		}

    @media print {
      html, body {
        height: initial !important;
        overflow: initial !important;
        -webkit-print-color-adjust: exact;
      }
    }

		`;
  const impresionRef = useRef();
  return (
    <Card
      title={
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(2, 1fr)",
            gridTemplateRows: "1fr",
            gridColumnGap: "0px",
            gridRowGap: "0px",
            marginRight: "5%",
          }}
        >
          <div
            style={{
              gridArea: "1 / 1 / 2 / 2",
              fontSize: "22px",
              paddingTop: "20px",
            }}
          >
            Analisis de Ordenes y Pacientes vs Concluidos
          </div>
          <div
            style={{
              gridArea: "1 / 2 / 2 / 3",
              display: "flex",
              flexDirection: "row-reverse",
              paddingTop: "15px",
            }}
          >
            <ReactToPrint
              pageStyle={pageStyle}
              trigger={() => (
                <Button type="primary" icon={<PrinterOutlined />}>Imprimir</Button>
              )}
              content={() => impresionRef.current}
              // copyStyles={false}
            />
          </div>
        </div>
      }
    >
      <Cuerpo impresion={impresionRef} />
    </Card>
  );
};

export default Reporte1;
