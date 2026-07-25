import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { toast } from "sonner"

import { Eye, EyeOff } from "lucide-react"

import { Apple } from "src/components/icons/apple"
import { Google } from "src/components/icons/google"
import { Meta } from "src/components/icons/meta"
import { cn } from "src/lib/utils"
import { supabase } from "src/lib/supabase"
import { isCurrentUserAdmin } from "src/lib/data/packages"
import { Button } from "src/components/ui/button"
import { Card, CardContent } from "src/components/ui/card"
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldSeparator,
} from "src/components/ui/field"
import { Input } from "src/components/ui/input"

interface FormErrors {
  email?: string
  password?: string
}

function validateEmail(email: string): string | undefined {
  if (!email) return "Email is required"
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return "Invalid email format"
}

export default function LoginPage({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const navigate = useNavigate()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [errors, setErrors] = useState<FormErrors>({})

  const allValid = email && password

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()

    const emailError = validateEmail(email)
    setErrors({ email: emailError })
    if (emailError) return

    setLoading(true)
    const { error } = await supabase.auth.signInWithPassword({ email, password })

    if (error) {
      setLoading(false)
      setErrors({ email: "Invalid email or password", password: "Invalid email or password" })
      return
    }

    // Admins land in the dashboard; everyone else goes to the public site.
    const admin = await isCurrentUserAdmin()
    setLoading(false)

    toast.success("Welcome back!")
    navigate(admin ? "/admin" : "/")
  }

  return (
    <div className="flex min-h-svh flex-col items-center bg-border justify-center p-6 md:p-10">
      <div className="w-full max-w-sm md:max-w-4xl">
        <div className={cn("flex flex-col gap-6", className)} {...props}>
          <Card className="overflow-hidden p-0">
            <CardContent className="grid p-0 md:grid-cols-2">
              <form className="p-6 md:p-8" onSubmit={handleSubmit}>
                <FieldGroup>
                  <div className="flex flex-col items-center gap-2 text-center">
                    <h1 className="text-2xl font-bold">Welcome back</h1>
                    <p className="text-balance text-muted-foreground">
                      Login to your Vrajatian account
                    </p>
                  </div>
                  <Field>
                    <FieldLabel htmlFor="email">Email</FieldLabel>
                    <Input
                      id="email"
                      type="email"
                      placeholder="m@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                    <div
                      className={`grid transition-all duration-300 ${
                        errors.email ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                      }`}
                    >
                      <div className="overflow-hidden">
                        <p className="text-sm text-red-600/80">{errors.email}</p>
                      </div>
                    </div>
                  </Field>
                  <Field>
                    <div className="flex items-center">
                      <FieldLabel htmlFor="password">Password</FieldLabel>
                      <a
                        href="#"
                        className="ml-auto text-sm underline-offset-2 hover:underline"
                      >
                        Forgot your password?
                      </a>
                    </div>
                    <div className="relative">
                      <Input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                      >
                        {showPassword ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                      </button>
                    </div>
                    <div
                      className={`grid transition-all duration-300 ${
                        errors.password ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                      }`}
                    >
                      <div className="overflow-hidden">
                        <p className="text-sm text-red-600/80">{errors.password}</p>
                      </div>
                    </div>
                  </Field>
                  <Field>
                    <Button type="submit" className="w-full" disabled={!allValid || loading}>
                      {loading ? "Logging in..." : "Login"}
                    </Button>
                  </Field>
                  <FieldSeparator className="*:data-[slot=field-separator-content]:bg-card">
                    Or continue with
                  </FieldSeparator>
                  <Field className="grid grid-cols-3 gap-4">
                    <Button variant="outline" type="button">
                      <Apple className="h-4 w-4" />
                      <span className="sr-only">Login with Apple</span>
                    </Button>
                    <Button variant="outline" type="button">
                      <Google className="h-4 w-4" />
                      <span className="sr-only">Login with Google</span>
                    </Button>
                    <Button variant="outline" type="button">
                      <Meta className="h-4 w-4" />
                      <span className="sr-only">Login with Meta</span>
                    </Button>
                  </Field>
                  <FieldDescription className="text-center">
                    Don&apos;t have an account?{" "}
                    <Link to="/register">Sign up</Link>
                  </FieldDescription>
                </FieldGroup>
              </form>
              <div className="relative hidden bg-muted md:block">
                <img
                  src="https://images.unsplash.com/photo-1518002054494-3a6f94352e9d?q=80&w=987&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                  alt="Image"
                  className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
                />
              </div>
            </CardContent>
          </Card>
          <FieldDescription className="px-6 text-center">
            By clicking continue, you agree to our{" "}
            <a href="#">Terms of Service</a> and{" "}
            <a href="#">Privacy Policy</a>.
          </FieldDescription>
        </div>
      </div>
    </div>
  )
}
