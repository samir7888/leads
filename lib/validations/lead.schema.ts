import { z } from "zod";
import { leadStatusEnum } from "@/db/schema/leads";

export const leadSchema = z.object({
    name: z.string().min(1, "Name is required"),
    email: z.string().email(),
    phone: z.string().min(1, "Phone number is required"),
    address: z.string(),
    status: z.enum(leadStatusEnum.enumValues),
    interestedCourse: z.string(),
});

export type LeadFormValues = z.infer<typeof leadSchema>;

export const leadFormDefaultValues: LeadFormValues = {
    name: "",
    phone: "",
    email: "",
    address: "",
    status: "New",
    interestedCourse: ""
}