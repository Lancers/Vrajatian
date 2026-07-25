import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { ArrowRight, Compass, HelpCircle, RefreshCw } from "lucide-react"

import { getPackages, type TravelPackage } from "src/lib/data/packages"
import { cn } from "src/lib/utils"
import { Button } from "src/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "src/components/ui/card"

interface Question {
  id: string
  text: string
  options: { label: string; value: string; icon: string }[]
}

const QUESTIONS: Question[] = [
  {
    id: "vibe",
    text: "What is your primary travel style or vibe?",
    options: [
      { label: "High-Altitude Trekking & Adventure", value: "adventure", icon: "🏔️" },
      { label: "Pristine Beaches & Snorkeling", value: "beach", icon: "🏖️" },
      { label: "Royal Palaces, Forts & Heritage", value: "heritage", icon: "🏛️" },
      { label: "Sacred Ghats, Serene Temples & Spirits", value: "spiritual", icon: "🕉️" },
    ],
  },
  {
    id: "companion",
    text: "Who are you traveling with?",
    options: [
      { label: "Solo Explorer", value: "solo", icon: "🎒" },
      { label: "Romantic Getaway", value: "couple", icon: "💑" },
      { label: "Family Holiday", value: "family", icon: "👨‍👩‍👧" },
      { label: "Group of Friends", value: "friends", icon: "👥" },
    ],
  },
  {
    id: "budget",
    text: "What is your budget preference per person?",
    options: [
      { label: "Value / Budget Friendly (Under ₹20,000)", value: "budget", icon: "💰" },
      { label: "Moderate Explorer (₹20,000 - ₹35,000)", value: "moderate", icon: "💳" },
      { label: "Luxury / Premium Escape (Over ₹35,000)", value: "luxury", icon: "💎" },
    ],
  },
]

const VIBE_KEYWORDS: Record<string, string[]> = {
  adventure: ["trek", "adventure", "mountain", "himalay", "hill", "camp", "hike", "valley"],
  beach: ["beach", "island", "coast", "goa", "andaman", "backwater", "sea", "shore"],
  heritage: ["heritage", "fort", "palace", "royal", "rajasthan", "history", "culture", "haveli"],
  spiritual: ["spiritual", "temple", "ghat", "sacred", "varanasi", "pilgrim", "aarti"],
}

function matchesVibe(pkg: TravelPackage, vibe: string): boolean {
  const haystack = `${pkg.title} ${pkg.location} ${pkg.region} ${pkg.description}`.toLowerCase()
  const keywordHit = (VIBE_KEYWORDS[vibe] ?? []).some((k) => haystack.includes(k))
  if (vibe === "adventure") return keywordHit || pkg.difficulty !== "Easy"
  return keywordHit
}

function TravelQuiz() {
  const [step, setStep] = useState(0) // 0: intro, 1-3: questions, 4: matching loader, 5: result
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [matchedPkg, setMatchedPkg] = useState<TravelPackage | null>(null)
  const [packages, setPackages] = useState<TravelPackage[]>([])

  useEffect(() => {
    getPackages()
      .then((pkgs) => setPackages(pkgs))
      .catch(() => setPackages([]))
  }, [])

  function handleSelect(questionId: string, value: string) {
    const updatedAnswers = { ...answers, [questionId]: value }
    setAnswers(updatedAnswers)

    if (step < QUESTIONS.length) {
      setStep((prev) => prev + 1)
    } else {
      setStep(QUESTIONS.length + 1) // Set loading step

      setTimeout(() => {
        const vibe = updatedAnswers["vibe"]
        const budget = updatedAnswers["budget"]

        // Match on the package's own attributes/keywords so it works for any catalog.
        const vibeMatches = packages.filter((p) => matchesVibe(p, vibe))
        const candidates = vibeMatches.length > 0 ? vibeMatches : packages

        let budgetFiltered = candidates
        if (budget === "budget") {
          budgetFiltered = candidates.filter((p) => p.price <= 20000)
        } else if (budget === "moderate") {
          budgetFiltered = candidates.filter((p) => p.price > 20000 && p.price <= 35000)
        } else if (budget === "luxury") {
          budgetFiltered = candidates.filter((p) => p.price > 35000)
        }

        const finalCandidates = budgetFiltered.length > 0 ? budgetFiltered : candidates
        const match = [...finalCandidates].sort((a, b) => b.rating - a.rating)[0] ?? null

        setMatchedPkg(match)
        setStep(QUESTIONS.length + 2) // Result step
      }, 1200)
    }
  }

  function handleStart() {
    setAnswers({})
    setMatchedPkg(null)
    setStep(1)
  }

  return (
    <section className="py-24 bg-muted/20">
      <div className="container mx-auto px-4">
        <div className="mx-auto mb-14 max-w-2xl text-center">
          <span className="mb-3 inline-flex items-center gap-2 rounded-full border bg-primary/10 px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-primary">
            <HelpCircle size={14} /> Quick Recommendation Tool
          </span>
          <h2 className="mb-4 text-3xl font-black tracking-tight sm:text-4xl">Match Your Travel Style</h2>
          <p className="text-lg text-muted-foreground">
            Take our 10-second matching quiz to discover the perfect Indian destination tailored to your vibes and budget.
          </p>
        </div>

        <div className="mx-auto max-w-xl">
          <Card className="relative overflow-hidden border bg-card shadow-lg p-0 rounded-3xl">
            {/* Step 0: Intro */}
            {step === 0 && (
              <>
                <CardHeader className="text-center pb-2 pt-8">
                  <Compass className="mx-auto mb-4 h-16 w-16 text-primary" />
                  <CardTitle className="text-2xl font-black">Not sure where to head next?</CardTitle>
                  <CardDescription className="text-sm text-muted-foreground mt-2 max-w-md mx-auto">
                    Answer 3 quick questions about your travel style, companions, and budget, and let our recommendation engine find your match.
                  </CardDescription>
                </CardHeader>
                <CardContent className="pb-8 pt-4 text-center">
                  <Button
                    onClick={handleStart}
                    size="lg"
                    className="rounded-full gap-2 px-8 font-bold"
                  >
                    Start The Quiz <ArrowRight size={16} />
                  </Button>
                </CardContent>
              </>
            )}

            {/* Steps 1 to 3: Questions */}
            {step > 0 && step <= QUESTIONS.length && (
              <>
                <CardHeader className="border-b pb-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black uppercase tracking-wider text-primary">
                      Question {step} of {QUESTIONS.length}
                    </span>
                    <div className="flex gap-1.5">
                      {QUESTIONS.map((_, i) => (
                        <span
                          key={i}
                          className={cn(
                            "h-1.5 w-6 rounded-full transition-all duration-300",
                            step > i ? "bg-primary w-8" : "bg-muted"
                          )}
                        />
                      ))}
                    </div>
                  </div>
                  <CardTitle className="text-xl font-bold mt-4 leading-snug">
                    {QUESTIONS[step - 1].text}
                  </CardTitle>
                </CardHeader>

                <CardContent className="space-y-3.5 pt-6 pb-8">
                  {QUESTIONS[step - 1].options.map((option) => (
                    <Button
                      key={option.value}
                      onClick={() => handleSelect(QUESTIONS[step - 1].id, option.value)}
                      variant="outline"
                      className="flex h-auto w-full items-center justify-start gap-4 rounded-xl border bg-background p-4 text-left font-medium transition-all duration-300 hover:border-primary hover:bg-primary/5 hover:translate-x-1"
                    >
                      <span className="text-2xl">{option.icon}</span>
                      <span className="text-sm font-semibold">{option.label}</span>
                    </Button>
                  ))}
                </CardContent>
              </>
            )}

            {/* Step 4: Loading Screen */}
            {step === QUESTIONS.length + 1 && (
              <CardContent className="flex flex-col items-center justify-center py-20 text-center">
                <RefreshCw className="mb-6 h-12 w-12 animate-spin text-primary" />
                <h3 className="mb-2 text-xl font-bold">Analyzing Your Travel Vibe...</h3>
                <p className="text-sm text-muted-foreground">
                  Matching with over 200+ high-rated packages across India.
                </p>
              </CardContent>
            )}

            {/* Step 5: Result Screen */}
            {step === QUESTIONS.length + 2 && matchedPkg && (
              <>
                <CardHeader className="text-center pb-2">
                  <span className="text-xs font-black uppercase tracking-widest text-emerald-500">
                    🎉 It&apos;s a Match!
                  </span>
                  <CardTitle className="text-2xl font-black mt-1">Your Recommended Vacation</CardTitle>
                </CardHeader>

                <CardContent className="pb-6">
                  <div className="overflow-hidden rounded-2xl border border-border bg-muted/40 p-4 sm:flex sm:items-center sm:gap-5">
                    <img
                      src={matchedPkg.image}
                      alt={matchedPkg.title}
                      className="h-32 w-full rounded-xl object-cover sm:h-24 sm:w-24 shrink-0 shadow-sm"
                    />
                    <div className="mt-4 sm:mt-0 flex-1">
                      <span className="text-xs font-bold text-primary uppercase tracking-wide">
                        {matchedPkg.location}
                      </span>
                      <h4 className="text-lg font-bold mt-0.5 leading-tight text-foreground">{matchedPkg.title}</h4>
                      <p className="mt-1 text-xs text-muted-foreground line-clamp-2">
                        {matchedPkg.description}
                      </p>
                    </div>
                  </div>
                </CardContent>

                <CardFooter className="flex flex-col gap-3 sm:flex-row sm:justify-end border-t pt-4 bg-muted/10">
                  <Button
                    onClick={handleStart}
                    variant="outline"
                    className="rounded-full gap-2 w-full sm:w-auto"
                  >
                    <RefreshCw size={14} /> Retake Quiz
                  </Button>
                  <Button
                    asChild
                    className="rounded-full gap-2 w-full sm:w-auto"
                  >
                    <Link to={`/destinations/${matchedPkg.slug}`}>
                      View Details & Customize <ArrowRight size={14} />
                    </Link>
                  </Button>
                </CardFooter>
              </>
            )}
          </Card>
        </div>
      </div>
    </section>
  )
}

export default TravelQuiz
