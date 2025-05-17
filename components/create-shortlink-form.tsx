"use client";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { createShortlinkAction } from "@/actions/short-action";
import { useHookFormAction } from "@next-safe-action/adapter-react-hook-form/hooks";
import { zodResolver } from "@hookform/resolvers/zod";
import { urlSchema } from "@/types/url.types";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import { toast } from "sonner";
import { useState } from "react";
import { Copy } from "lucide-react";

export function NewShortlinkForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const [shortUrl, setShortUrl] = useState<string | null>(null);

  const { form, action, handleSubmitWithAction, resetFormAndAction } =
    useHookFormAction(createShortlinkAction, zodResolver(urlSchema), {
      actionProps: {
        onSuccess: (res) => {
          toast.success("Shortlink created!");
          // Show the shortlink
          if (res.data?.shortUrl) {
            setShortUrl(res.data?.shortUrl?.shortUrl);
          }
          console.log(res);
        },
        onError: (e) => {
          console.log(e);
          resetFormAndAction();
        },
      },
      formProps: {
        mode: "onChange",
        defaultValues: {
          url: "",
        },
      },
    });

  const handleCopy = () => {
    if (shortUrl) {
      navigator.clipboard.writeText(shortUrl);
      toast.success("Shortlink copied to clipboard!");
    }
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Form {...form}>
        <form onSubmit={handleSubmitWithAction}>
          <div className="flex flex-col gap-6">
            <div className="flex flex-col items-center gap-2">
              <h1 className="text-xl font-bold">Welcome to Shortlinks.</h1>
            </div>
            <div className="flex flex-col gap-6">
              <div className="grid gap-3">
                <FormField
                  control={form.control}
                  name="url"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Enter the URL to short. Simple.</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="https://www.youtube.com/watch?v=dQw4w9WgXcQ"
                          {...field}
                          aria-invalid={
                            form.formState.errors.url ? "true" : "false"
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <Button
                type="submit"
                className="w-full"
                disabled={action.isExecuting}
              >
                {action.isExecuting ? "Creating..." : "Short."}
              </Button>
            </div>
          </div>
        </form>
        {shortUrl && (
          <div className="flex items-center justify-between gap-2 rounded-md border px-4 py-2 bg-muted text-sm">
            <span className="truncate">{shortUrl}</span>
            <Button
              variant="outline"
              size="sm"
              onClick={handleCopy}
              className="ml-2"
            >
              <Copy className="w-4 h-4 mr-1" />
              Copy
            </Button>
          </div>
        )}
        {/* <div className="text-muted-foreground *:[a]:hover:text-primary text-center text-xs text-balance *:[a]:underline *:[a]:underline-offset-4">
        By clicking continue, you agree to our <a href="#">Terms of Service</a>{" "}
        and <a href="#">Privacy Policy</a>.
      </div> */}
      </Form>
    </div>
  );
}
