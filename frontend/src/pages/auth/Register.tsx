import { useState, useMemo } from "react"
import { Link, useNavigate } from "react-router-dom"
import { toast } from "sonner"

import { Eye, EyeOff } from "lucide-react"

import { Apple } from "src/components/icons/apple"
import { Google } from "src/components/icons/google"
import { Meta } from "src/components/icons/meta"
import { cn } from "src/lib/utils"
import { supabase } from "src/lib/supabase"
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
import { Label } from "src/components/ui/label"

interface Touched {
  fullName: boolean
  email: boolean
  password: boolean
  confirmPassword: boolean
}

function validateEmail(email: string): string | undefined {
  if (!email) return "Email is required"
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return "Invalid email format"
}

function validatePassword(_password: string): string | undefined {
  return undefined
}

function getPasswordStrength(password: string): {
  score: number
  label: string
  color: string
} {
  let score = 0
  if (password.length >= 8) score++
  if (password.length >= 12) score++
  if (/[a-z]/.test(password)) score++
  if (/[A-Z]/.test(password)) score++
  if (/[0-9]/.test(password)) score++
  if (/[^a-zA-Z0-9]/.test(password)) score++

  if (score <= 2) return { score, label: "Weak", color: "bg-red-400/70" }
  if (score <= 4) return { score, label: "Medium", color: "bg-yellow-500" }
  return { score, label: "Strong", color: "bg-green-500" }
}

export default function SignupForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const navigate = useNavigate()
  const [fullName, setFullName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [terms, setTerms] = useState(false)
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [touched, setTouched] = useState<Touched>({
    fullName: false,
    email: false,
    password: false,
    confirmPassword: false,
  })

  const strength = useMemo(() => getPasswordStrength(password), [password])

  const fullNameError = useMemo(() => {
    if (!touched.fullName) return
    return fullName.trim() ? undefined : "Full name is required"
  }, [fullName, touched.fullName])

  const emailError = useMemo(() => {
    if (!touched.email) return
    return validateEmail(email)
  }, [email, touched.email])

  const passwordError = useMemo(() => {
    if (!touched.password) return
    return validatePassword(password)
  }, [password, touched.password])

  const confirmPasswordError = useMemo(() => {
    if (!touched.confirmPassword) return
    if (!confirmPassword) return "Please confirm your password"
    if (confirmPassword !== password) return "Passwords do not match"
  }, [confirmPassword, password, touched.confirmPassword])

  const allValid = useMemo(
    () =>
      fullName.trim() &&
      email &&
      password.length >= 8 &&
      confirmPassword === password &&
      terms &&
      !fullNameError &&
      !emailError &&
      !passwordError &&
      !confirmPasswordError,
    [fullName, email, password, confirmPassword, terms, fullNameError, emailError, passwordError, confirmPasswordError]
  )

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()

    const eError = validateEmail(email)
    const pError = validatePassword(password)
    const cpError =
      !confirmPassword
        ? "Please confirm your password"
        : confirmPassword !== password
          ? "Passwords do not match"
          : undefined
    const nError = fullName.trim() ? undefined : "Full name is required"

    setTouched({ fullName: true, email: true, password: true, confirmPassword: true })

    if (eError || pError || cpError || nError || !terms) return

    setLoading(true)
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`,
        data: { full_name: fullName.trim() },
      },
    })
    setLoading(false)

    if (error) {
      toast.error(error.message || "Could not create your account. Please try again.")
      return
    }

    toast.success("Check your email to confirm your account before logging in.")
    navigate("/login")
  }

  return (
    <div className="flex min-h-svh flex-col items-center justify-center bg-border p-6 md:p-10">
      <div className="w-full max-w-sm md:max-w-4xl">
        <div className={cn("flex flex-col gap-6", className)} {...props}>
          <Card className="overflow-hidden p-0">
            <CardContent className="grid p-0 md:grid-cols-2">
              <form className="p-6 md:p-8" onSubmit={handleSubmit}>
                <FieldGroup>
                  <div className="flex flex-col items-center gap-2 text-center">
                    <h1 className="text-2xl font-bold">Create your account</h1>
                    <p className="text-sm text-balance text-muted-foreground">
                      Enter your email below to create your account
                    </p>
                  </div>
                  <Field>
                    <FieldLabel htmlFor="fullName">Full Name</FieldLabel>
                    <Input
                      id="fullName"
                      placeholder="Aarav Sharma"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      onBlur={() =>
                        setTouched((prev: Touched) => ({ ...prev, fullName: true }))
                      }
                    />
                    <div
                      className={`grid transition-all duration-300 ${
                        fullNameError ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                      }`}
                    >
                      <div className="overflow-hidden">
                        <p className="text-sm text-red-600/80">{fullNameError}</p>
                      </div>
                    </div>
                  </Field>
                  <Field>
                    <FieldLabel htmlFor="email">Email</FieldLabel>
                    <Input
                      id="email"
                      type="email"
                      placeholder="m@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      onBlur={() =>
                        setTouched((prev: Touched) => ({ ...prev, email: true }))
                      }
                    />
                    <FieldDescription>
                      We&apos;ll use this to contact you. We will not share your
                      email with anyone else.
                    </FieldDescription>
                    <div
                      className={`grid transition-all duration-300 ${
                        emailError ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                      }`}
                    >
                      <div className="overflow-hidden">
                        <p className="text-sm text-red-600/80">{emailError}</p>
                      </div>
                    </div>
                  </Field>
                  <Field>
                    <Field className="grid grid-cols-2 gap-4">
                      <Field>
                        <FieldLabel htmlFor="password">Password</FieldLabel>
                        <div className="relative">
                          <Input
                            id="password"
                            type={showPassword ? "text" : "password"}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            onBlur={() =>
                              setTouched((prev: Touched) => ({ ...prev, password: true }))
                            }
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
                            password ? "grid-rows-[1fr] opacity-100 mt-1" : "grid-rows-[0fr] opacity-0"
                          }`}
                        >
                          <div className="overflow-hidden">
                            <div className="h-1.5 w-full rounded-full bg-muted">
                              <div
                                className={`h-full rounded-full transition-all duration-300 ${strength.color}`}
                                style={{
                                  width: `${Math.min((strength.score / 6) * 100, 100)}%`,
                                }}
                              />
                            </div>
                            <p className="mt-0.5 text-xs text-muted-foreground">
                              {strength.label}
                            </p>
                          </div>
                        </div>
                        <div
                          className={`grid transition-all duration-300 ${
                            passwordError ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                          }`}
                        >
                          <div className="overflow-hidden">
                            <p className="text-sm text-red-600/80">
                              {passwordError}
                            </p>
                          </div>
                        </div>
                      </Field>
                      <Field>
                        <FieldLabel htmlFor="confirm-password">
                          Confirm Password
                        </FieldLabel>
                        <div className="relative">
                          <Input
                            id="confirm-password"
                            type={showConfirmPassword ? "text" : "password"}
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            onBlur={() =>
                              setTouched((prev: Touched) => ({
                                ...prev,
                                confirmPassword: true,
                              }))
                            }
                          />
                          <button
                            type="button"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                          >
                            {showConfirmPassword ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                          </button>
                        </div>
                        <div
                          className={`grid transition-all duration-300 ${
                            confirmPasswordError ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                          }`}
                        >
                          <div className="overflow-hidden">
                            <p className="text-sm text-red-600/80">
                              {confirmPasswordError}
                            </p>
                          </div>
                        </div>
                      </Field>
                    </Field>
                    <FieldDescription>
                      Must be at least 8 characters long.
                    </FieldDescription>
                  </Field>
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="terms"
                      checked={terms}
                      onChange={(e) => setTerms(e.target.checked)}
                    />
                    <Label htmlFor="terms" className="text-sm font-normal">
                      I agree to the{" "}
                      <a href="#" className="underline underline-offset-4">
                        Terms of Service
                      </a>{" "}
                      and{" "}
                      <a href="#" className="underline underline-offset-4">
                        Privacy Policy
                      </a>
                    </Label>
                  </div>
                  <Field>
                    <Button type="submit" className="w-full" disabled={!allValid || loading}>
                      {loading ? "Creating account..." : "Create Account"}
                    </Button>
                  </Field>
                  <FieldSeparator className="*:data-[slot=field-separator-content]:bg-card">
                    Or continue with
                  </FieldSeparator>
                  <Field className="grid grid-cols-3 gap-4">
                    <Button variant="outline" type="button">
                          <Apple className="h-4 w-4" />
                          <span className="sr-only">Sign up with Apple</span>
                    </Button>
                    <Button variant="outline" type="button">
                          <Google className="h-4 w-4" />
                          <span className="sr-only">Sign up with Google</span>
                    </Button>
                    <Button variant="outline" type="button">
                          <Meta className="h-4 w-4" />
                          <span className="sr-only">Sign up with Meta</span>
                    </Button>
                  </Field>
                  <FieldDescription className="text-center">
                    Already have an account?{" "}
                    <Link to="/login">Sign in</Link>
                  </FieldDescription>
                </FieldGroup>
              </form>
              <div className="relative hidden bg-muted md:block">
                <img
                  src="https://images.unsplash.com/photo-1513023840371-dd774fcaee5b?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
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
