import React from 'react'
import { CSVLink } from 'react-csv'
import { FileExcelOutlined } from '@ant-design/icons';
import { Button } from 'antd';

export const ExportReactCSV = ({csvData, fileName, ...props}) => {
    return (
        <Button variant="warning" {...props}>
            <CSVLink data={csvData} filename={fileName}>
                <FileExcelOutlined/>
            </CSVLink>
        </Button>
    )
}