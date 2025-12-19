import z from "zod";

export const ledgerSchema = z.object({
  companyName: z.string().min(1, "CompanyName is required"),
  leadId: z.string().optional().nullable().transform((v) => (v === "" ? null : v)),
  contactPersonName: z.string().min(1, "Contact Person name is Required"),
  panNo: z.string(),
  email: z.string().email(),
  phone: z.string().min(1, "Phone number is required"),
  address: z.string(),
});

export type LedgerFormValues = z.infer<typeof ledgerSchema>;

export const ledgerFormDefaultValues: LedgerFormValues = {
  companyName: "",
  phone: "",
  email: "",
  panNo: "",
  address: "",
  contactPersonName: "",
  leadId: null,
};

export enum EParticular {
    Invoice = "Invoice",
    Payment = "Payment",
}
