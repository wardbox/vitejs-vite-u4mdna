import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Loader2, AlertTriangle, CheckCircle } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from "@/components/ui/dialog"
import { ApplicationForm } from "./ApplicationForm"
import { CookieForm, cookieFormSchema } from "./CookieForm"
import { JustificationForm } from "./JustificationForm"
import { z } from "zod"
import { cookieData, processingMessages } from "./constants"

export default function CookieConsentBanner() {
  const [stage, setStage] = useState("application")
  const [processing, setProcessing] = useState(false)
  const [consents, setConsents] = useState(cookieData.reduce((acc, cookie) => {
    acc[cookie.id] = { consent: false };
    return acc;
  }, {} as Record<string, { consent: boolean }>))
  const [open, setOpen] = useState(false)
  const [position, setPosition] = useState(Math.floor(Math.random() * (35 - 20 + 1) + 20))
  const [waitTimes, setWaitTimes] = useState<number[]>([])
  const [averageWaitTime, setAverageWaitTime] = useState(10000)
  const [processingMessage, setProcessingMessage] = useState(processingMessages[0])
  const [allDone, setAllDone] = useState(false)

  const handleApplicationSubmit = () => {
    setProcessing(true)
    setTimeout(() => {
      setProcessing(false)
      setStage("cookies")
    }, 12000)
  }
  const handleCookieSubmit = (data: z.infer<typeof cookieFormSchema>) => {
    setProcessing(true)
    setConsents(data.cookies)
    const allAccepted = Object.values(data.cookies).every(cookie => cookie.consent);
    setTimeout(() => {
      setProcessing(false)
      setStage(allAccepted ? "approved" : "justification");
    }, 12000)
  }

  const handleJustificationSubmit = () => {
    setProcessing(true)
    setTimeout(() => {
      setProcessing(false)
      setStage("approved")
    }, 12000)
  }

  useEffect(() => {
    const interval = setInterval(() => {
      setProcessingMessage(processingMessages[Math.floor(Date.now() / 8000 % processingMessages.length)])
    }, 8000)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    if (!open && stage === "approved" && position > 0) {
      setPosition(Math.floor(Math.random() * (35 - 20 + 1) + 20))
    }
  }, [open, stage, position]);

  useEffect(() => {
    if (stage === "approved" && position > 0) {
      const randomInterval = Math.floor(Math.random() * (18000 - 5000 + 1)) + 5000;

      setWaitTimes(prev => [...prev, randomInterval]);

      setAverageWaitTime(prev => {
        const newWaitTimes = [...waitTimes, randomInterval];
        return newWaitTimes.reduce((sum, time) => sum + time, 0) / newWaitTimes.length;
      });

      const timeout = setTimeout(() => {
        if (position === 1) {
          setAllDone(true)
        } else {
          setPosition(prev => prev - 1);
        }
      }, randomInterval);

      return () => clearTimeout(timeout);
    }
  }, [stage, position]);

  return (
    stage !== "done" && (
      <Card className="fixed bottom-4 right-4 max-w-md">
        <CardHeader>
          <CardTitle>We use cookies, do you?</CardTitle>
        </CardHeader>
        <CardContent>
          <p>We use cookies for entirely honorable and virtuous purposes to ensure you get the best experience on our website. You may manage your cookie settings below.</p>
        </CardContent>
        <CardFooter>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild className="w-full">
              <Button>Manage Cookies</Button>
            </DialogTrigger>
            {processing ? (
              <DialogContent>
                <div className="flex flex-col items-center justify-center space-y-4 p-8">
                  <Loader2 className="h-8 w-8 animate-spin" />
                  <p className="text-lg italic text-center text-balance text-muted-foreground">{processingMessage}</p>
                </div>
              </DialogContent>
            ) : stage === "application" ? (
              <DialogContent className="p-12">
                <DialogHeader className="mb-4">
                  <DialogTitle className="text-2xl">Application for Cookie Management License</DialogTitle>
                  <DialogDescription>
                    As of 2024, verification is required by the <span className="font-bold italic">Web Authority for Surveillance and Privacy</span>. Your responses
                    will determine your ability to manage your cookie settings.
                  </DialogDescription>
                </DialogHeader>
                <ApplicationForm onSubmit={handleApplicationSubmit} />
              </DialogContent>
            ) : stage === "cookies" ? (
              <DialogContent>
                <DialogHeader>
                  <DialogTitle className="text-2xl">
                    Cookie Selection
                  </DialogTitle>
                  <DialogDescription>
                    Please select which cookies you consent to. Ensure you understand the implications of your choices.
                  </DialogDescription>
                </DialogHeader>
                <ScrollArea className="h-[60vh]">
                  <CookieForm onSubmit={handleCookieSubmit} />
                </ScrollArea>
              </DialogContent>
            ) : stage === "justification" ? (
              <DialogContent>
                <DialogHeader>
                  <DialogTitle className="text-2xl">
                    Justification for Cookie Management
                  </DialogTitle>
                  <DialogDescription>
                    Please provide a justification for each cookie you have rejected.
                  </DialogDescription>
                </DialogHeader>
                <ScrollArea className="h-[60vh]">
                  <JustificationForm onSubmit={handleJustificationSubmit} consents={consents} />
                </ScrollArea>
              </DialogContent>
            ) : stage === "approved" && position > 1 ? (
              <DialogContent>
                <div className="text-center">
                  <AlertTriangle className="h-12 w-12 text-yellow-500 mx-auto mb-4" />
                  <h2 className="text-2xl font-bold mb-2">Privacy Management License In Review</h2>
                  <p>Your application is currently under review. We will notify you via this page when your license is approved. Your position in line is <span className="font-bold">{position}</span>. Do not close this window or your position will be reset.</p>
                </div>
                <p className="text-center text-sm text-gray-500">Average wait time: {Math.floor(averageWaitTime / 1000)} seconds</p>
              </DialogContent>
            ) : stage === "approved" && position === 1 && allDone ? (
              <DialogContent>
                <div className="text-center flex flex-col items-center gap-4">
                  <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
                  <h2 className="text-2xl font-bold mb-2">Privacy Management License Approved</h2>
                  <p>Your cookie consent settings have been saved.</p>
                  <Button onClick={() => {
                    setOpen(false)
                    setStage("done")
                  }}>Close</Button>
                </div>
              </DialogContent>
            ) : null}
          </Dialog>
        </CardFooter>
      </Card >
    )
  )
}