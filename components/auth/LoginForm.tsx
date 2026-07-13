"use client";

import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";

import { z } from "zod";

import { zodResolver } from "@hookform/resolvers/zod";

import { loginUser } from "@/lib/auth";

import { UserRole, RoleOptions } from "@/config/roles";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";

import { Input } from "@/components/ui/input";

import { Button } from "@/components/ui/button";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { toast } from "sonner";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { useAuth } from "@/providers/AuthProvider";

const LoginSchema = z.object({
  role: z.nativeEnum(UserRole),

  email: z.string().min(1, "Email is required").email("Invalid email address"),

  password: z.string().min(1, "Password is required"),
});

type LoginValues = z.infer<typeof LoginSchema>;

export default function LoginForm() {
  const router = useRouter();
  const { setUser } = useAuth();

  const form = useForm<LoginValues>({
    resolver: zodResolver(LoginSchema),

    defaultValues: {
      email: "",
      password: "",
      role: UserRole.DOCTOR,
    },
  });

  function onSubmit(values: LoginValues) {
    const user = loginUser(values.email, values.password, values.role);

    if (!user) {
      toast.error("Invalid Credentials");

      return;
    }

    setUser(user);

    toast.success("Login Successful");

    router.push(`/${user.role}/dashboard`);
  }

  return (
    <div className="flex min-h-screen">
      <div className="hidden lg:flex w-1/2 bg-gradient-to-br from-blue-700 to-cyan-600 items-center justify-center text-white p-16">
        <div>
          <h1 className="text-5xl font-bold">HMS</h1>

          <p className="mt-6 text-xl">Hospital Management System</p>

          <p className="mt-4 opacity-80">Smart Digital Healthcare Platform</p>
        </div>
      </div>

      <div className="flex flex-1 items-center justify-center p-6">
        <Card className="w-full max-w-md shadow-xl">
          <CardHeader>
            <CardTitle className="text-3xl">Welcome Back</CardTitle>

            <CardDescription>Login to continue</CardDescription>
          </CardHeader>

          <CardContent>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit, () => {
                  toast.error("Please fill all required fields");
                })}
                className="space-y-5"
              >
                <FormField
                  control={form.control}
                  name="role"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Role</FormLabel>

                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                        </FormControl>

                        <SelectContent>
                          {RoleOptions.map((role) => (
                            <SelectItem key={role.value} value={role.value}>
                              {role.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>

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
                        <Input placeholder="Enter Email" {...field} />
                      </FormControl>

                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>

                      <FormControl>
                        <Input
                          type="password"
                          placeholder="******"
                          {...field}
                        />
                      </FormControl>

                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button type="submit" className="w-full" variant="sky">
                  Login
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
