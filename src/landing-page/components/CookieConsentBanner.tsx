import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Loader2, AlertTriangle } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from "@/components/ui/dialog"
import { ApplicationForm } from "./ApplicationForm"
import { CookieForm, cookieFormSchema } from "./CookieForm"
import { z } from "zod"

// function CookieConsentItem({ cookie, onConsent }: { cookie: typeof cookieData[0], onConsent: (id: string, value: boolean) => void }) {
//   const [consent, setConsent] = useState(false)

//   const handleConsent = (value: boolean) => {
//     setConsent(value)
//     onConsent(cookie.id, value)
//   }

//   return (
// <Card className="mb-4">
//   <CardHeader>
//     <CardTitle>{cookie.name}</CardTitle>
//     <CardDescription>{cookie.description}</CardDescription>
//   </CardHeader>
//   <CardContent>
//     <p><strong>Storage Duration:</strong> {cookie.storage}</p>
//     <p><strong>Data Sharing Partners:</strong> {cookie.partners.join(", ")}</p>
//   </CardContent>
//   <CardFooter className="flex justify-between">
//     <AlertDialog>
//       <AlertDialogTrigger asChild>
//         <Button variant="outline">Advanced Settings</Button>
//       </AlertDialogTrigger>
//       <AlertDialogContent>
//         <AlertDialogHeader>
//           <AlertDialogTitle>Advanced Settings for {cookie.name}</AlertDialogTitle>
//           <AlertDialogDescription>
//             <p><strong>Storage Duration:</strong> {cookie.storage}</p>
//             <p><strong>Data Sharing Partners:</strong></p>
//             <ul>
//               {cookie.partners.map((partner, index) => (
//                 <li key={index}>{partner}</li>
//               ))}
//             </ul>
//           </AlertDialogDescription>
//         </AlertDialogHeader>
//         <AlertDialogFooter>
//           <AlertDialogAction>Close</AlertDialogAction>
//         </AlertDialogFooter>
//       </AlertDialogContent>
//     </AlertDialog>
//     <div className="flex items-center space-x-2">
//       <Switch
//         id={`consent-${cookie.id}`}
//         checked={consent}
//         onCheckedChange={handleConsent}
//       />
//       <Label htmlFor={`consent-${cookie.id}`}>
//         {consent ? "Approved" : "Rejected"}
//       </Label>
//     </div>
//   </CardFooter>
// </Card>
//   )
// }

type FinalLicenseFormData = {
  reasons: string
  acknowledged: boolean
  commitment: string
}

function FinalLicenseForm({ onSubmit }: { onSubmit: (data: FinalLicenseFormData) => void }) {
  const [reasons, setReasons] = useState("")
  const [acknowledged, setAcknowledged] = useState(false)
  const [commitment, setCommitment] = useState("")

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    onSubmit({ reasons, acknowledged, commitment })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="reasons">State your reasons for rejecting certain cookies:</Label>
        <Textarea
          id="reasons"
          value={reasons}
          onChange={(e) => setReasons(e.target.value)}
          required
          maxLength={500}
        />
      </div>
      <div className="flex items-center space-x-2">
        <Checkbox
          id="acknowledged"
          checked={acknowledged}
          onCheckedChange={(value: boolean) => setAcknowledged(value)}
          required
        />
        <Label htmlFor="acknowledged">
          Acknowledge that rejecting certain cookies may result in reduced user experience.
        </Label>
      </div>
      <div>
        <Label htmlFor="commitment">Rate your commitment to privacy on a scale of 1-10:</Label>
        <Select value={commitment} onValueChange={setCommitment} required>
          <SelectTrigger id="commitment">
            <SelectValue placeholder="Select a rating" />
          </SelectTrigger>
          <SelectContent>
            {[...Array(10)].map((_, i) => (
              <SelectItem key={i + 1} value={(i + 1).toString()}>
                {i + 1}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <Button type="submit">Submit License Application</Button>
    </form>
  )
}

export default function MovingCookieConsentBanner() {
  const [stage, setStage] = useState("cookies")
  const [processing, setProcessing] = useState(false)
  const [consents, setConsents] = useState({})
  const [open, setOpen] = useState(false)

  const handleApplicationSubmit = () => {
    setProcessing(true)
    setTimeout(() => {
      if (Math.random() < 0.25) {
        setProcessing(false)
        setStage("rejected")
      } else {
        setProcessing(false)
        setStage("cookies")
      }
    }, 5000)
  }

  const handleCookieSubmit = (data: z.infer<typeof cookieFormSchema>) => {
    console.log(data)
  }

  const handleLicenseSubmit = (data) => {
    setProcessing(true)
    setTimeout(() => {
      setProcessing(false)
      setStage("approved")
    }, 5000)
  }

  return (
    <Card className="fixed bottom-4 right-4 max-w-md">
      <CardHeader>
        <CardTitle>We use cookies, do you?</CardTitle>
      </CardHeader>
      <CardContent>
        <p>We use cookies to ensure you get the best experience on our website. Please click accept to manage your cookie settings.</p>
      </CardContent>
      <CardFooter>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild className="w-full">
            <Button>Accept</Button>
          </DialogTrigger>
          {processing ? (
            <DialogContent>
              <div className="flex flex-col items-center justify-center space-y-4">
                <Loader2 className="h-8 w-8 animate-spin" />
                <p>Processing your request...</p>
              </div>
            </DialogContent>
          ) : stage === "application" ? (
            <DialogContent className="p-12">
              <DialogHeader>
                <DialogTitle className="text-2xl">Application for Cookie Management License</DialogTitle>
                <DialogDescription>
                  Verification required by the <span className="font-bold italic">Web Authority for Surveillance and Privacy</span>. Your responses
                  will determine your ability to manage your cookie settings.
                </DialogDescription>
              </DialogHeader>
              <ApplicationForm onSubmit={handleApplicationSubmit} />
            </DialogContent>
          ) : stage === "cookies" ? (
            <DialogContent>
              <DialogHeader>
                <DialogTitle>
                  Cookie Management
                </DialogTitle>
              </DialogHeader>
              <ScrollArea className="h-[60vh]">
                <CookieForm onSubmit={handleCookieSubmit} />
              </ScrollArea>
            </DialogContent>
          ) : stage === "license" ? (
            <DialogContent>
              <FinalLicenseForm onSubmit={handleLicenseSubmit} />
            </DialogContent>
          ) : (
            <DialogContent>
              <div className="text-center">
                <AlertTriangle className="h-12 w-12 text-yellow-500 mx-auto mb-4" />
                <h2 className="text-2xl font-bold mb-2">Privacy Management License Approved</h2>
                <p>Your choices have been recorded. Remember, with great power comes great responsibility.</p>
              </div>
            </DialogContent>
          )}
        </Dialog>
      </CardFooter>
    </Card>
  )
}
