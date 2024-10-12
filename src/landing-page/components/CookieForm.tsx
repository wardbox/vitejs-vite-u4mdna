import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Textarea } from "@/components/ui/textarea"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Switch } from "@/components/ui/switch"
import { Button } from "@/components/ui/button"
import { Form, FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage } from "@/components/ui/form"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { AlertDialog, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogTrigger, AlertDialogAction, AlertDialogFooter } from "@/components/ui/alert-dialog"

const cookieData = [
  {
    id: "biometric",
    name: "Biometric Tracking Cookie",
    description: "Monitors your heart rate and facial expressions via webcam to gauge emotional reactions to content.",
    storage: 100,
    partners: ["EmotiTrack Corp", "FacialData Inc."]
  },
  {
    id: "family",
    name: "Family Mapping Cookie",
    description: "Builds a profile of your family members, including names and ages, based on shared devices and IP addresses.",
    storage: 100,
    partners: ["FamilyNet Analytics", "HouseholdData Co."]
  },
  // ... Add more cookies here
]

export const cookieFormSchema = z.object({
  cookies: z.record(z.string(), z.object({
    consent: z.boolean(),
  })),
})


export function CookieForm({ onSubmit }: { onSubmit: (data: z.infer<typeof cookieFormSchema>) => void }) {
  const form = useForm<z.infer<typeof cookieFormSchema>>({
    resolver: zodResolver(cookieFormSchema),
    defaultValues: {
      cookies: cookieData.reduce((acc, cookie) => {
        acc[cookie.id] = { consent: false, storageLength: cookie.storage };
        return acc;
      }, {} as Record<string, { consent: boolean; storageLength: number }>),
    },
  })

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-5">
        {cookieData.map((cookie) => (
          <FormField
            key={cookie.id}
            control={form.control}
            name={`cookies.${cookie.id}.consent`}
            render={({ field }) => (
              <FormItem>
                <Card className="mb-4">
                  <CardHeader>
                    <CardTitle>{cookie.name}</CardTitle>
                    <CardDescription>{cookie.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p><strong>Storage Duration:</strong> {cookie.storage} years</p>
                    <p><strong>Data Sharing Partners:</strong> {cookie.partners.join(", ")}</p>
                  </CardContent>
                  <CardFooter className="flex justify-between">
                    <div className="flex items-center space-x-2">
                      <FormControl>
                        <Switch
                          id={`consent-${cookie.id}`}
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </div>
                  </CardFooter>
                </Card>
              </FormItem>
            )} />
        ))}
        <Button type="submit" className="mx-auto">Submit Application</Button>
      </form>
    </Form >
  )
}