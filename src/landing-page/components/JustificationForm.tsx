import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Button } from "@/components/ui/button"
import { Form, FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage } from "@/components/ui/form"
import { cookieData } from "./constants"

export const justificationFormSchema = z.object({
  justifications: z.record(z.string(), z.string().min(100)),
  acknowledge: z.boolean().refine((v) => v, { message: "You must acknowledge that you understand the consequences of rejecting these cookies." }),
})


export function JustificationForm({ onSubmit, consents }: { onSubmit: (data: z.infer<typeof justificationFormSchema>) => void, consents: Record<string, { consent: boolean }> }) {
  const form = useForm<z.infer<typeof justificationFormSchema>>({
    resolver: zodResolver(justificationFormSchema),
    defaultValues: {
      justifications: Object.fromEntries(Object.entries(consents).filter(([_, consent]) => !consent.consent).map(([cookie, _]) => [cookie, ""]))
    },
  })

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-5 p-8">
        {Object.entries(consents).filter(([_, consent]) => !consent.consent).map(([cookieId, _]) => (
          <FormField
            key={cookieId}
            control={form.control}
            name={`justifications.${cookieId}`}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Why did you reject the {cookieData.find(cookie => cookie.id === cookieId)?.name}?</FormLabel>
                <FormControl>
                  <Textarea {...field} placeholder={cookieData.find(cookie => cookie.id === cookieId)?.warning} required />
                </FormControl>
                <FormDescription>{field.value.length}/100 characters</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        ))}
        <FormField
          control={form.control}
          name="acknowledge"
          render={({ field }) => (
            <FormItem>
              <div className="flex items-center gap-3 justify-center">
                <FormControl>
                  <Switch checked={field.value} onCheckedChange={field.onChange} />
                </FormControl>
                <FormLabel>I acknowledge that rejecting certain cookies may result in reduced user experience</FormLabel>
              </div>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="mx-auto">Submit Justifications</Button>
      </form>
    </Form>
  )
}
