import { useEffect, useState } from "react"
import { toast } from "sonner"
import { Compass, Save } from "lucide-react"

import { Button } from "src/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "src/components/ui/card"
import { Input } from "src/components/ui/input"
import { Label } from "src/components/ui/label"
import TripRequestList from "src/components/profile/TripRequestList"
import { useAuth } from "src/lib/auth/AuthContext"
import { getMyProfile, updateMyProfile, type Profile as ProfileData } from "src/lib/data/profile"
import { getMyBookingRequests, type BookingRequest } from "src/lib/data/booking-requests"

function Profile() {
  const { user } = useAuth()
  const [profile, setProfile] = useState<ProfileData | null>(null)
  const [requests, setRequests] = useState<BookingRequest[]>([])
  const [loading, setLoading] = useState(true)
  const [fullName, setFullName] = useState("")
  const [phone, setPhone] = useState("")
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    Promise.all([getMyProfile(), getMyBookingRequests()])
      .then(([p, r]) => {
        setProfile(p)
        setFullName(p.fullName ?? "")
        setPhone(p.phone ?? "")
        setRequests(r)
      })
      .catch(() => toast.error("Could not load your profile. Please refresh and try again."))
      .finally(() => setLoading(false))
  }, [])

  async function handleSave(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    try {
      const updated = await updateMyProfile({ fullName: fullName.trim(), phone: phone.trim() })
      setProfile(updated)
      toast.success("Profile updated.")
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not update your profile.")
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center">
        <div className="text-center space-y-4">
          <Compass className="mx-auto h-12 w-12 animate-spin text-primary" />
          <p className="text-muted-foreground">Loading your profile...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-10 max-w-4xl space-y-8">
      <div>
        <h1 className="text-3xl font-black tracking-tight text-foreground">My Profile</h1>
        <p className="text-muted-foreground mt-1">Manage your account details and track your trip requests.</p>
      </div>

      <Card className="rounded-2xl border shadow-sm">
        <CardHeader>
          <CardTitle className="text-xl">Account Details</CardTitle>
          <CardDescription>This information is used to prefill your trip requests.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSave} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="profile-email">Email</Label>
              <Input id="profile-email" value={user?.email ?? profile?.email ?? ""} disabled />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="profile-fullName">Full Name</Label>
                <Input
                  id="profile-fullName"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Aarav Sharma"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="profile-phone">Phone Number</Label>
                <Input
                  id="profile-phone"
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+91 98765 43210"
                />
              </div>
            </div>
            <Button type="submit" disabled={saving} className="gap-2">
              <Save className="h-4 w-4" /> {saving ? "Saving..." : "Save Changes"}
            </Button>
          </form>
        </CardContent>
      </Card>

      <div className="space-y-4">
        <h2 className="text-xl font-bold tracking-tight">My Trip Requests</h2>
        <TripRequestList requests={requests} />
      </div>
    </div>
  )
}

export default Profile
