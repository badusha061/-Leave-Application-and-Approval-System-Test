import React, { useEffect, useReducer, useState } from 'react'
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
  import {
    Tabs,
    TabsContent,
  } from "@/components/ui/tabs"
  import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import axios from 'axios'
import {EmployeeLeave} from '../types/database'
import Swal from 'sweetalert2';
import { useNavigate, Link } from 'react-router-dom'
import {
    LogOut,
  } from "lucide-react"
  import { ClipboardPlus } from 'lucide-react';



function Manager() {
    const navigate = useNavigate()
    const [reducer , forceUpdate] = useReducer( x => x + 1 , 0)
    const [data , setData] = useState<EmployeeLeave>([])
    useEffect(() => {
        FetchLeaves()
    },[reducer])

    const FetchLeaves =  async () => {
        try{
            const response = await axios.get(`http://localhost:8000/api/manager-list/`)
            if(response.status === 200){
                setData(response.data)
            }
        }catch(error){
            console.log(error);
        }
    }

    const handleLogout = () => {
        localStorage.removeItem('access')
        const Toast = Swal.mixin({
            toast: true,
            position: "top-end",
            showConfirmButton: false,
            timer: 3000,
            timerProgressBar: true,
            didOpen: (toast) => {
              toast.onmouseenter = Swal.stopTimer;
              toast.onmouseleave = Swal.resumeTimer;
            }
          });
          Toast.fire({
            icon: "success",
            title: "Successfully Logout Manager"
          });
        navigate('/login')          
    }

    const handleApprovalLeaveForm = async (Id : number) => {
        try{
            const response = await axios.put(`http://localhost:8000/api/approval/${Id}/`)
            if(response.status === 200){
                const Toast = Swal.mixin({
                    toast: true,
                    position: "top-end",
                    showConfirmButton: false,
                    timer: 3000,
                    timerProgressBar: true,
                    didOpen: (toast) => {
                      toast.onmouseenter = Swal.stopTimer;
                      toast.onmouseleave = Swal.resumeTimer;
                    }
                  });
                  Toast.fire({
                    icon: "success",
                    title: "Successfully Approved"
                  });
                forceUpdate()
            }   
        }catch(error){
            console.log(error);
        }
    }

  return (
    <main className="grid flex-1  mt-4 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
    <Tabs defaultValue="all">
      <div className="flex items-center">
        <div className="ml-auto flex items-center gap-2">

    
    <Link to='/report'>
        <Button size="sm" className="h-8 gap-1">
            < ClipboardPlus  className="h-3.5 w-3.5" />
            <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
            Total leaves Report
            </span>
          </Button>
    </Link>

          <Button onClick={handleLogout} size="sm" className="h-8 gap-1">
            <LogOut  className="h-3.5 w-3.5" />
            <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
              Logout
            </span>
          </Button>
        </div>
      </div>
      <TabsContent value="all">
        <Card x-chunk="dashboard-06-chunk-0">
          <CardHeader>
            <CardTitle>Leaves</CardTitle>
            <CardDescription>
              Manage your leaves and view of leave approval.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Department</TableHead>
                  <TableHead className="hidden md:table-cell">
                      Phone Number
                  </TableHead>
                  <TableHead className="hidden md:table-cell">
                     Email
                  </TableHead>
                  <TableHead className="hidden md:table-cell">
                    Type of Leaves
                  </TableHead>
                  <TableHead className="hidden md:table-cell">
                    Reason
                  </TableHead>
                  <TableHead className="hidden md:table-cell">
                    First Day of Absence
                  </TableHead>
                  <TableHead className="hidden md:table-cell">
                    Last Day of Absence
                  </TableHead>
                  <TableHead className="hidden md:table-cell">
                    Leaves Approval
                  </TableHead>

                  
                </TableRow>
              </TableHeader>
              <TableBody>
              {data?.map((data , index) => (

                <TableRow>
                 
                  <TableCell className="font-medium">
                    {data.user.username}
                  </TableCell>
                  <TableCell className="font-medium">
                    {data.department}
                  </TableCell>
                  <TableCell className="font-medium">
                     {data.phone}
                  </TableCell>
                  <TableCell className="font-medium">
                    {data.email}
                  </TableCell>
                  
                  {data.type_of_leave === 'AL' ? (
                      <TableCell className="font-medium">Annual Leave</TableCell>
                  ) : data.type_of_leave === 'SL' ? (
                      <TableCell className="font-medium">Sick Leave</TableCell>
                  ) : data.type_of_leave === 'CL' ? (
                      <TableCell className="font-medium">Casual Leave</TableCell>
                  ) : data.type_of_leave === 'ML' ? (
                      <TableCell className="font-medium">Maternity Leave</TableCell>
                  ) : data.type_of_leave === 'PL' ? (
                      <TableCell className="font-medium">Paternity Leave</TableCell>
                  ) : data.type_of_leave === 'MAL' ? (
                      <TableCell className="font-medium">Marriage Leave</TableCell>
                  ) : data.type_of_leave === 'OTHERS' ? (
                      <TableCell className="font-medium">Others</TableCell>
                  ) : null}


                  <TableCell className="font-medium">
                    {data.reason}
                  </TableCell>
                  <TableCell className="font-medium">
                    {data.first_day_of_absence}
                  </TableCell>
                  <TableCell className="font-medium">
                    {data.last_day_of_absence}
                  </TableCell>
                  {data.leave_approval === true ? (
                     <TableCell className="font-medium">
                        <Button variant={'customgreen'} >
                            Approve
                        </Button>
                   </TableCell>  
                  ): (
                  <TableCell className="font-medium">
                    <Button onClick={() => handleApprovalLeaveForm(data.id)} variant={'customred'}>
                            Pending
                    </Button>
                  </TableCell>
                  )}
                </TableRow>
              ))}
                
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  </main>
    
  )
}

export default Manager