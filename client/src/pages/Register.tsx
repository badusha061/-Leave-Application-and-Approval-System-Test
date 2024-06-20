import { Button } from "@/components/ui/button"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
  } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Loader2 } from "lucide-react"
import axios from "axios"
import { useState } from "react"
import {User} from '../types/database'
import { useNavigate , Link} from "react-router-dom"
import Swal from 'sweetalert2';


const formSchema = z.object({
    username: 
    z.string()
    .min(3, {
      message: "Username must be at least 3 characters.",
    })
    .max(8,{
        message:"username must be lessthan 8 characters"
    })
    ,
    email:
    z.string()
    // .regex(/^[a-z0-9._%+-]+@[a-z09.-]+\\.[a-z]{2,4}$/,{
    //   message:"Please enter a valid email address"
    // }),
    ,
    password1:
    z.string()
    .min(8,{
      message:"Password should be at least 8 characters long"
    })
    .regex(/[A-Z]/,{
      message:"Include upper case letters"
    })
    .regex(/[a-z]/,{
      message:"Include upper case letters"
    })
    .regex(/[0-9]/,{
      message: "Password must include at least one number."
    })
    .regex(/[^A-Za-z0-9]/,{
      message:"Password must include at least one special character."
    })
    , 
    password2:z.string()
  }).refine(data => data.password1 === data.password2,{
    message:"Password do not match",
    path:["password2"],
  })


function Register() {
    const navigate = useNavigate()
    const [data , setData] = useState<User | null>(null)
    const BASE_URL = import.meta.env.VITE_REACT_APP_BASE_URL;
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
          username: "",
        },
        mode: "onTouched"
      })

    const {isSubmitting} = form.formState

    console.log(BASE_URL,'the url');
    

    const  onSubmit = async (values: z.infer<typeof formSchema>) => {
        console.log(values);
        
        try{
            const response = await axios.post(`http://localhost:8000/api/user/`,values)
            setData(response.data)
            if (response.status === 201){
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
                title: "Successfully Created Account"
              });
              navigate(`/otp?id=${response.data.id}`)
            }
        }catch(error) {
            console.log(error)
        }
      }


  return (
    <div className="w-full lg:grid lg:min-h-[600px] lg:grid-cols-2 xl:min-h-[800px] mt-6 ">
      <div className="flex items-center justify-center py-12">
        <div className="mx-auto grid w-[350px] gap-6">
          <div className="grid gap-2 text-center">
            <h1 className="text-3xl font-bold">Register</h1>
            <p className="text-balance text-muted-foreground">
              Enter your Details below to Create your account
            </p>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2">
                <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Username</FormLabel>
                    <FormControl>
                        <Input placeholder="example" {...field} />
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
                        <Input placeholder="example@gmail.com" {...field} />
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
                />
                <FormField
                control={form.control}
                name="password1"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                        <Input  type="password" placeholder="Example_2001" {...field} />
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
                />
                <FormField
                control={form.control}
                name="password2"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Conform Password</FormLabel>
                    <FormControl>
                        <Input type="password" placeholder="Example_2001" {...field} />
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
                />
        
            <Button type="submit" className="w-full">
            {isSubmitting ? 
              <Button disabled>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                   Please wait
              </Button>
              : "Submit"}
            </Button>
            </form>
            </Form>
          
          <div className="mt-4 text-center text-sm">
            Don&apos;t have an account?{" "}
            <Link to='/login' className="underline">
              Sign up
            </Link>
          </div>
        </div>
      </div>
      <div className="hidden bg-muted lg:block">
        <img
          src="https://img.freepik.com/free-vector/ordering-goods-online-internet-store-online-shopping-niche-e-commerce-website-mother-buying-babies-clothes-footwear-toys-infant-accessories-vector-isolated-concept-metaphor-illustration_335657-2764.jpg"
          alt="Image"
          width="1920"
          height="1080"
          className="h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
        />
      </div>
    </div>
  )
}

export default Register