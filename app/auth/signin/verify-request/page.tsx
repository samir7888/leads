import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { db } from "@/db";
import { Mail } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import { z } from "zod";

const emailSchema = z.string().email("Invalid email address").trim();

type Props = {
  searchParams: {
    email?: string;
  };
};

export default async function VerifyRequest(props: {
  searchParams: Promise<Props["searchParams"]>;
}) {
  const searchParams = await props.searchParams;

  const { success, data } = emailSchema.safeParse(searchParams?.email);

  if (!success) {
    return redirect("/auth/signin");
  }

  // check if a request is in the database for this email
  const verificationToken = await db.query.verificationTokens.findMany({
    where: (verificationToken, { eq }) =>
      eq(verificationToken.identifier, data),
    limit: 1,
    orderBy: (verificationToken, { desc }) => desc(verificationToken.expires),
  });

  if (verificationToken.length === 0) {
    return redirect("/auth/signin");
  }

  const expires = verificationToken[0].expires;

  if (expires < new Date()) {
    return redirect("/auth/signin");
  }

  return (
    <Card className="w-full max-w-md shadow-none border-none bg-transparent">
      <CardHeader className="space-y-6">
        <Link href={"/"}>
          <Image
            src="/logo.png"
            alt="Feature Creatify Logo"
            width={64}
            height={64}
            className="h-16 w-auto block mx-auto"
          />
        </Link>
        <div className="text-center space-y-4">
          <div className="space-y-2">
            <h1 className="text-2xl font-semibold tracking-tight">
              Check your email
            </h1>
            <p className="text-sm text-muted-foreground">
              A sign-in link has been sent to{" "}
              <span className="font-medium text-foreground">{data}</span>
            </p>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="bg-blue-50 border border-blue-200 p-4">
          <div className="flex items-start space-x-3">
            <Mail className="w-5 h-5 text-blue-600 mt-0.5 shrink-0" />
            <div className="space-y-1">
              <p className="text-sm font-medium text-blue-900">
                Click the link in your email to sign in
              </p>
              <p className="text-xs text-blue-700">
                The link will expire in 1 hour for security reasons
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <p className="text-xs text-muted-foreground text-center">
            Didn&apos;t receive the email? Check your spam folder or try again
          </p>
        </div>
      </CardContent>
    </Card >
  );
}
