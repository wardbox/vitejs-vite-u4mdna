import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Switch } from "@/components/ui/switch"
import { Button } from "@/components/ui/button"
import { Form, FormField, FormItem, FormControl } from "@/components/ui/form"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { cookieData } from "./constants"
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
        acc[cookie.id] = { consent: false };
        return acc;
      }, {} as Record<string, { consent: boolean }>),
    },
  })

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-5 p-8">
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
        <Button type="submit" className="mx-auto">Submit Cookie Consent</Button>
      </form>
    </Form >
  )
}