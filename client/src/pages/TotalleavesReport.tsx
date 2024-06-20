import React, { useEffect, useState } from 'react'
import {LeaveData} from '../types/database.ts'
import axios from 'axios'
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"


function TotalleavesReport() {
  const [data , setData] = useState<LeaveData >([])
  useEffect(() => {
    TotalLeavesReport()
  },[])





  const TotalLeavesReport = async () => {
    try{
      const response = await axios.get(`http://localhost:8000/api/totalleave/`)
      if(response.status === 200){
        setData(response.data)
        console.log(response.data);
        
      }
    }catch(error){
      console.log(error);
    }
  }

  return (
    <div>
       <Table>
      <TableHeader>
        <TableRow>
          <TableHead >Employee Name</TableHead>
          <TableHead>Leave Type</TableHead>
          <TableHead>Total</TableHead>
          <TableHead>Approved</TableHead>
          <TableHead>Pending</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
      {Object.entries(data).map(([employee, leaves]) => (
            Object.entries(leaves).map(([leaveType, leaveData]) => (
          <TableRow key={`${employee}-${leaveType}`} >
            <TableCell>{employee}</TableCell>
            <TableCell>{leaveType}</TableCell>
            <TableCell>{leaveData.total}</TableCell>
            <TableCell>{leaveData.approved}</TableCell>
            <TableCell>{leaveData.pending}</TableCell>
          </TableRow>
        ))
      ))}

      </TableBody>
    </Table>
    </div>
  )
}

export default TotalleavesReport