import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {  z } from "zod";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import {
    InputOTP,
    InputOTPGroup,
    InputOTPSeparator,
    InputOTPSlot,
} from "@/components/ui/input-otp";
import { useLocation, useNavigate } from 'react-router-dom'
import axios from "axios";
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
import { useState } from "react";
import Swal from 'sweetalert2';
const FormSchema = z.object({
    otp: z.string().min(4, {
        message: "Your one-time password must be 4 characters.",
    }),
});


function Otp() {
    const [modalOpen , setModalOpen] = useState(false)
    const navigate = useNavigate()
    const location = useLocation()
    const BASE_URL = import.meta.env.VITE_REACT_APP_BASE_URL;
    const searchParams = new URLSearchParams(location.search)
    const userId  = searchParams.get("id")

    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            otp: "",
        },
    });

    

    const onSubmit = async (data: z.infer<typeof FormSchema>) => {
            try{
                const response = await axios.patch(`http://localhost:8000/api/user/${userId}/verify_otp/`,data)
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
                        title: "Successfully Verified Your Account"
                      });
                    navigate('/login')
                }
            }catch(error){
                const Toast = Swal.mixin({
                    toast: true,
                    position: 'top-end',
                    showConfirmButton: false,
                    timer: 3000,
                    timerProgressBar: true,
                    didOpen: (toast) => {
                      toast.onmouseenter = Swal.stopTimer;
                      toast.onmouseleave = Swal.resumeTimer;
                    },
                    
                  });
                  
                  Toast.fire({
                    icon: 'error',
                    title: "Invalid OTP",
                  });
                  return false
            }
    }


    const handleGenerateOtp = async (e :any) => {
        e.preventDefault()
        try{
            const response = await axios.patch(`http://localhost:8000/api/user/${userId}/generate_otp/`)
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
                    title: "Successfully Genrate new OTP"
                  });
               setModalOpen(false)
            }
            
        }catch(error){
            const Toast = Swal.mixin({
                toast: true,
                position: 'top-end',
                showConfirmButton: false,
                timer: 3000,
                timerProgressBar: true,
                didOpen: (toast) => {
                  toast.onmouseenter = Swal.stopTimer;
                  toast.onmouseleave = Swal.resumeTimer;
                },
                
              });
              
              Toast.fire({
                icon: 'error',
                title: "Something wen wrong plese Try Again",
              });
              return false
        }
    }   


  return (
    <main className="grid min-h-screen place-items-center">
    <Card className="mx-auto min-w-96">
        <CardHeader>
            <CardTitle className="text-xl">Verify account</CardTitle>
        </CardHeader>
        <CardContent>
            <Form {...form}>
                <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="space-y-6 text-start">
                    <FormField
                        control={form.control}
                        name="otp"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>We have send an OTP to Email containing the
                                verification code
                            </FormLabel>
                                <FormControl>
                                    <InputOTP maxLength={4} {...field}>
                                        <InputOTPGroup className="w-full justify-between">
                                            <InputOTPSlot
                                                index={0}
                                                className="w-full rounded border"
                                            />
                                            <InputOTPSeparator />
                                            <InputOTPSlot
                                                index={1}
                                                className="w-full rounded border"
                                            />
                                            <InputOTPSeparator />
                                            <InputOTPSlot
                                                index={2}
                                                className="w-full rounded border"
                                            />
                                            <InputOTPSeparator />
                                            <InputOTPSlot
                                                index={3}
                                                className="w-full rounded border"
                                            />
                                        </InputOTPGroup>
                                    </InputOTP>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <Button type="submit" className="w-full">
                        Verify
                    </Button>
                    <AlertDialog open={modalOpen} onOpenChange={(open) => setModalOpen(open)} >
                        <AlertDialogTrigger asChild>
                             <Button  variant="link"> Didn't recieve code? RESEND OTP </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                            <AlertDialogHeader>
                            <AlertDialogTitle>Are you absolutely ?</AlertDialogTitle>
                            <AlertDialogDescription>
                                    Are you sure you want to resend the OTP?
                            </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={(e) => handleGenerateOtp(e)} >SEND OTP</AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                        </AlertDialog>
                    
                </form>
                <div className=" mt-3 " >
                </div>
            </Form>
        </CardContent>
    </Card>
</main>
  )
}

export default Otp