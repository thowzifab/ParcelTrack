import React, { useState, useEffect } from 'react';
import { DataGrid, GridColDef, GridToolbar } from '@mui/x-data-grid';

// The URL of the endpoint
import config from 'src/views/dashboard/config.json';
import Grid from '@mui/material/Grid';

const url = config.apiUrl2;

export default function DataTable() {
    const [plog, setPLog] = useState<Array<{ ParcelID: string; DateScanned: string; Bin: string; ScannedAt: string; ShiftID: string; id: number }>>([]);

    const [searchQuery, setSearchQuery] = useState('');
    const [filteredRows, setFilteredRows] = useState<{
        id: number;
        ParcelID: string;
        DateScanned: string;
        Bin: string;
        ScannedAt: string;
        ShiftID: string;
      }[]>([]);

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

        
        setPLog(JSON.parse(data));

      } catch (error) {
        console.error(`Error during GET request:`, error);
      }
    };
  
    fetchData();
    console.log(plog);
  }, []);

  const columns: GridColDef[] = [
    { field: 'parcel_ID', headerName: 'Parcel ID', flex: 1 },
    { field: 'date_scanned', headerName: 'Date Scanned', flex: 1,
        valueGetter: (params) => {
        const date = new Date(params.value as string); // Assuming date_scanned is a string
        return date.toLocaleString(); // Adjust the formatting based on your requirements
        }, },
    { field: 'bin', headerName: 'Bin', flex: 1 },
    { field: 'conveyor', headerName: 'Conveyor', flex: 1 },
    { field: 'shift_ID', headerName: 'Shift ID', type: 'number', flex: 1 },
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
