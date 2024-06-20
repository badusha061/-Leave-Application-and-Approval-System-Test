import  { useNavigate } from 'react-router-dom'
import {
  LogOut,
  PlusCircle,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Tabs,
  TabsContent,
} from "@/components/ui/tabs"
import Swal from 'sweetalert2';
import { useEffect, useState } from 'react'
import axios from 'axios'
import {EmployeeLeave} from '../types/database'
import { jwtDecode } from "jwt-decode";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
  } from "@/components/ui/alert-dialog"
  import { zodResolver } from "@hookform/resolvers/zod"
  import { useForm } from "react-hook-form"
  import { z } from "zod"

  import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
  } from "@/components/ui/form"
  import { Input } from "@/components/ui/input"

  import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
  } from "@/components/ui/select"

  import { format } from "date-fns"
  import { CalendarIcon } from "lucide-react"
  import { cn } from "@/lib/utils"
import { Calendar } from "@/components/ui/calendar"

import {
    Popover,
    PopoverContent,
    PopoverTrigger,
  } from "@/components/ui/popover"
  import { toast } from "@/components/ui/use-toast"


  const formSchema = z.object({
    user : z.number(),
    department : z.string(),
    phone: z.string().max(10,{
        message: "Phone Number Must be 10 Digits"
    })
    // .regex(/^[+]{1}(?:[0-9\-\\(\\)\\/.]\s?){6,15}[0-9]{1}$/,{
    //     message:"Phone Number must be Valid"
    // }),
    ,
    email:z.string()
    .regex(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,{
        message:"Email Must be Valid"
    }),
    type_of_leave: z.string(),
    reason: z.string().min(10,{
        message:"Reason More than 10 Digits"
    })
    .max(250,{
        message:"Reaosn Not More than 250 Digits"
    }),
    first_day_of_absence: z.date(),
    last_day_of_absence : z.date(),
  })




function HomePage() {






    const navigate = useNavigate()
    const [data , setData] = useState<EmployeeLeave>([])

 

    const token = jwtDecode(localStorage.getItem('access'))
    const userId = token.id

 


    useEffect(() => {
        FetchLeaves()
    },[userId])

    const FetchLeaves =  async () => {
        try{
            const response = await axios.get(`http://localhost:8000/api/list/${userId}/`)
            if(response.status === 200){
                setData(response.data)
            }
        }catch(error){
            console.log(error);
        }
    }

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
          user: userId,
        },
        mode: "onTouched"
      })


    const {isSubmitting} = form.formState


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
            title: "Successfully Logout Employees"
          });
        navigate('/login')          
    }

    const formatDate = (date : any) => {
        const year = date.getFullYear(); 
        const month = String(date.getMonth() + 1).padStart(2, '0'); 
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`; 
    };


    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        console.log(formatDate(values.first_day_of_absence));
        console.log(formatDate(values.last_day_of_absence));

        
        const data = new FormData()
        data.append('email',values.email)
        data.append('phone',values.phone)
        data.append('department',values.department)
        data.append('user',values.user)
        data.append('type_of_leave',values.type_of_leave)
        data.append('reason',values.reason)
        data.append('first_day_of_absence',formatDate(values.first_day_of_absence))
        data.append('last_day_of_absence',formatDate(values.last_day_of_absence))

        
        try{
            const response =  await axios.post('http://localhost:8000/api/create/',data)
            if(response.status === 201){
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
                    title: "Successfully Added Your Leave"
                  });
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

                <AlertDialog>
                <AlertDialogTrigger asChild>
                <Button size="sm" className="h-8 gap-1">
                  <PlusCircle className="h-3.5 w-3.5" />
                  <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                    Add Leaves
                  </span>
                </Button>
                </AlertDialogTrigger>
                <AlertDialogContent className='overflow-auto  max-h-[90vh] border' >
                    <AlertDialogHeader>
                    <AlertDialogTitle>LEAVE APPLICATION FORM</AlertDialogTitle>
                    <AlertDialogDescription>
                        
                        
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">

                       
                        <FormField
                            control={form.control}
                            name="department"
                            render={({ field }) => (
                                <FormItem>
                                <FormLabel>Select Your Department</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select Your Department" />
                                    </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                    <SelectItem value="HR">human resource</SelectItem>
                                    <SelectItem value="IT">Information technology</SelectItem>
                                    <SelectItem value="FINANCE">finance departments</SelectItem>
                                    <SelectItem value="OPM">Operations Management</SelectItem>
                                    <SelectItem value="OTHERS">Others</SelectItem>
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                                </FormItem>
                            )}
                            />

                        <FormField
                            control={form.control}
                            name="type_of_leave"
                            render={({ field }) => (
                                <FormItem>
                                <FormLabel>Select Your Type of Leaves</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select Your Department" />
                                    </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                    <SelectItem value="AL">Annual Leave</SelectItem>
                                    <SelectItem value="SL">Sick Leave</SelectItem>
                                    <SelectItem value="CL">Casual Leave</SelectItem>
                                    <SelectItem value="ML">Maternity Leave</SelectItem>
                                    <SelectItem value="PL">Paternity Leave</SelectItem>
                                    <SelectItem value="MAL">Marriage Leave</SelectItem>
                                    <SelectItem value="OTHERS">Others</SelectItem>
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                                </FormItem>
                            )}
                            />

      

                            <FormField
                            control={form.control}
                            name="reason"
                            render={({ field }) => (
                                <FormItem>
                                <FormLabel>Reason For Leave</FormLabel>
                                <FormControl>
                                    <Input placeholder="Reason For Leave" {...field} />
                                </FormControl>
                                <FormMessage />
                                </FormItem>
                            )}
                            />

                            <FormField
                                    control={form.control}
                                    name="email"
                                    render={({ field }) => (
                                        <FormItem>
                                        <FormLabel>Email</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Enter your Email" {...field} />
                                        </FormControl>
                                      
                                        <FormMessage />
                                        </FormItem>
                                    )}
                                    />

                                    <FormField
                                            control={form.control}
                                            name="phone"
                                            render={({ field }) => (
                                                <FormItem>
                                                <FormLabel>Phone Number</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="Enter Your Phone Number" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                                </FormItem>
                                            )}
                                            />
                            <div className='flex gap-4' >

                            <FormField
                                    control={form.control}
                                    name="first_day_of_absence"
                                    render={({ field }) => (
                                        <FormItem className="flex flex-col">
                                        <FormLabel>Starting Date </FormLabel>
                                        <Popover>
                                            <PopoverTrigger asChild>
                                            <FormControl>
                                                <Button
                                                variant={"outline"}
                                                className={cn(
                                                    "w-[200px] pl-3 text-left font-normal",
                                                    !field.value && "text-muted-foreground"
                                                )}
                                                >
                                                {field.value ? (
                                                    format(field.value, 'yyyy-MM-dd')
                                                ) : (
                                                    <span>Pick a date</span>
                                                )}
                                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                                </Button>
                                            </FormControl>
                                            </PopoverTrigger>
                                            <PopoverContent className="w-auto p-0" align="start">
                                            <Calendar
                                                mode="single"
                                                selected={field.value}
                                                onSelect={field.onChange}
                                                
                                                initialFocus
                                            />
                                            </PopoverContent>
                                        </Popover>
                                        <FormMessage />
                                        </FormItem>
                                    )}
                                    />


                                <FormField
                                    control={form.control}
                                    name="last_day_of_absence"
                                    render={({ field }) => (
                                        <FormItem className="flex flex-col ">
                                        <FormLabel>Ending Date</FormLabel>
                                        <Popover>
                                            <PopoverTrigger asChild>
                                            <FormControl>
                                                <Button
                                                variant={"outline"}
                                                className={cn(
                                                    "w-[200px] pl-3 text-left font-normal",
                                                    !field.value && "text-muted-foreground"
                                                )}
                                                >
                                                {field.value ? (
                                                    format(field.value, 'yyyy-MM-dd')
                                                ) : (
                                                    <span>Pick a date</span>
                                                )}
                                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                                </Button>
                                            </FormControl>
                                            </PopoverTrigger>
                                            <PopoverContent className="w-auto p-0" align="start">
                                            <Calendar
                                                mode="single"
                                                selected={field.value}
                                                onSelect={field.onChange}
                                                initialFocus
                                            />
                                            </PopoverContent>
                                        </Popover>
                                        <FormMessage />
                                        </FormItem>
                                    )}
                                    />
                            </div>

                                        
                                    

                            <Button className='w-full' type="submit">Submit</Button>
                        </form>
                    </Form>

                    </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                    <AlertDialogCancel className='w-full' >Cancel</AlertDialogCancel>
                    </AlertDialogFooter>
                </AlertDialogContent>
                </AlertDialog>
                

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
                            Approved 
                         </TableCell>  
                        ): (
                        <TableCell className="font-medium">
                           Pending
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

export default HomePage