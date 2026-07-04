import { Button } from "@/components/ui/button"

function App() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <div className="flex flex-col items-center gap-6">
        <h1 className="text-5xl font-bold tracking-tight text-foreground sm:text-6xl">
          Welcome to Vrajatian
        </h1>
        <p className="text-lg text-muted-foreground">
          Your project is ready. Start building.
        </p>
        <Button>Get Started</Button>
      </div>
    </div>
  )
}

export default App
