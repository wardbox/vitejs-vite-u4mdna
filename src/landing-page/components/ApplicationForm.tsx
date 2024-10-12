import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Textarea } from "@/components/ui/textarea"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Switch } from "@/components/ui/switch"
import { Button } from "@/components/ui/button"
import { Form, FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage } from "@/components/ui/form"

export const applicationFormSchema = z.object({
  reason: z.string().min(400),
  likelihood: z.enum(["always", "often", "rarely", "never"]).refine((value) => value === "never", {
    message: "Selection other than 'never' is not acceptable",
  }),
  compliance: z.boolean().refine(value => value === true, {
    message: "You must agree to comply",
  }),
})


export function ApplicationForm({ onSubmit }: { onSubmit: (data: z.infer<typeof applicationFormSchema>) => void }) {
  const form = useForm<z.infer<typeof applicationFormSchema>>({
    resolver: zodResolver(applicationFormSchema),
    defaultValues: {
      reason: "",
      likelihood: "never",
      compliance: false,
    },
  })

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-5">
        <FormField
          control={form.control}
          name="reason"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Why should you be trusted to manage your own privacy settings?</FormLabel>
              <FormControl>
                <Textarea {...field} minLength={400} required />
              </FormControl>
              <FormDescription>
                {field.value.length}/400 characters
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="likelihood"
          render={({ field }) => (
            <FormItem className="space-y-3">
              <FormLabel>How often do you prioritize convenience over privacy?</FormLabel>
              <FormControl>
                <RadioGroup
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  className="flex flex-col space-y-1"
                >
                  <FormItem className="flex items-center space-x-3 space-y-0">
                    <FormControl>
                      <RadioGroupItem value="always" />
                    </FormControl>
                    <FormLabel className="font-normal">
                      Always
                    </FormLabel>
                  </FormItem>
                  <FormItem className="flex items-center space-x-3 space-y-0">
                    <FormControl>
                      <RadioGroupItem value="often" />
                    </FormControl>
                    <FormLabel className="font-normal">
                      Often
                    </FormLabel>
                  </FormItem>
                  <FormItem className="flex items-center space-x-3 space-y-0">
                    <FormControl>
                      <RadioGroupItem value="rarely" />
                    </FormControl>
                    <FormLabel className="font-normal">
                      Rarely
                    </FormLabel>
                  </FormItem>
                  <FormItem className="flex items-center space-x-3 space-y-0">
                    <FormControl>
                      <RadioGroupItem value="never" />
                    </FormControl>
                    <FormLabel className="font-normal">
                      Never
                    </FormLabel>
                  </FormItem>
                </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="compliance"
          render={({ field }) => (
            <FormItem>
              <div className="flex flex-row items-center justify-between gap-3">
                <FormControl>
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <FormLabel className="text-base">
                  Are you willing to comply with data-sharing regulations set by our privacy oversight team?
                </FormLabel>
              </div>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="mx-auto">Submit Application</Button>
      </form>
    </Form>
  )
}