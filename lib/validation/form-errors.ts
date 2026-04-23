import type { z } from "zod";

export type FormFieldIssue = {
  path: (string | number)[];
  message: string;
};

export function zodIssuesForForm(error: z.ZodError): FormFieldIssue[] {
  return error.issues.map((i) => ({
    path: i.path as (string | number)[],
    message: i.message,
  }));
}
