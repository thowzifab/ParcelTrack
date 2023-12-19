import React, { useState, useEffect } from 'react';
import { DataGrid, GridColDef, GridToolbar } from '@mui/x-data-grid';

// The URL of the endpoint
import config from 'src/views/dashboard/config.json';
import Grid from '@mui/material/Grid';

const url = config.apiUrl2;

type PLogInfo = {
  ParcelID: string;
  DateScanned: string;
  Bin: string | null; // Use string | null to represent a nullable string
  ScannedAt: string | null; // Use string | null to represent a nullable string
  ShiftID: string | null; // Use string | null to represent a nullable string
  id: number;
};

export default function DataTable() {
    const [plog, setPLog] = useState<PLogInfo[]>([]);

    const [searchQuery, setSearchQuery] = useState('');
    const [filteredRows, setFilteredRows] = useState<PLogInfo[]>([]);

    const handleSearch = (event: { target: { value: any; }; }) => {
        const query = event.target.value;
        setSearchQuery(query);
    
        // Filter the rows based on the search query
        const filteredData = rowsWithId.filter((row) =>
          Object.values(row).some(
            (value) =>
              typeof value === 'string' &&
              value.toLowerCase().includes(query.toLowerCase())
          )
        );
        setFilteredRows(filteredData);
      };

    useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`${url}/packageLog`);
  
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
  
        const data = await response.json();

        setPLog(JSON.parse(data).map((item: any, index: number) => ({
          ParcelID: item.parcel_ID,
          DateScanned: item.date_scanned,
          Bin: item.bin?.String ?? null,
          ScannedAt: item.scanned_at?.String ?? null,
          ShiftID: item.shift_ID?.Int64?.toString() ?? null,
          id: index,
        })));

      } catch (error) {
        console.error(`Error during GET request:`, error);
      }
    };
  
    fetchData();
    console.log(plog);
  }, []);

  const columns: GridColDef[] = [
    { field: 'ParcelID', headerName: 'Parcel ID', flex: 1 },
    { field: 'DateScanned', headerName: 'Date Scanned', flex: 1,
        valueGetter: (params) => {
        const date = new Date(params.value as string); // Assuming date_scanned is a string
        return date.toLocaleString(); // Adjust the formatting based on your requirements
        }, },
    { field: 'Bin', headerName: 'Bin', flex: 1 },
    { field: 'ScannedAt', headerName: 'Conveyor', flex: 1 },
    { field: 'ShiftID', headerName: 'Shift ID', type: 'number', flex: 1 },
  ];


  const rowsWithId = plog.map((row, index) => ({ ...row, id: index }));

  return (
    <div style={{ height: 650, width: '100%' }}>
        <div>
        {/* Search bar */}
            <input
                type="text"
                placeholder="Search..."
                value={searchQuery}
                onChange={handleSearch}
            />
        </div>

        <Grid>
            <DataGrid
                rows={searchQuery ? filteredRows : rowsWithId}
                columns={columns}
                autoHeight
                initialState={{
                    pagination: {
                    paginationModel: { page: 0, pageSize: 10 },
                    },
                }} 
                components={{
                    Toolbar: GridToolbar, // Use the MUI GridToolbar for default functionality
                  }}
                getRowId={(row) => row.id} 
                pagination
                disableRowSelectionOnClick 
            />
        </Grid>
      
    </div>
  );
}
