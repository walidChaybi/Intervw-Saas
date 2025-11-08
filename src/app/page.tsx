"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { type ChangeEvent, useState } from "react";
import { authClient } from "@/lib/auth-client";

interface ILoginForm {
  name: string;
  email: string;
  password: string;
}

export default function Home() {
  const [form, setForm] = useState<ILoginForm>({
    name: "",
    email: "",
    password: "",
  });

  const { data: session, isPending, error, refetch } = authClient.useSession();

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setForm({
      ...form,
      [event.target.name]: event.target.value,
    });
  };

  const onSubmit = () => {
    authClient.signUp.email(
      {
        email: form.email,
        name: form.name,
        password: form.password,
      },
      {
        onError: () => window.alert("error"),
        onSuccess: () => window.alert("success"),
      }
    );
  };

  if (session) {
    return (
      <div>
        loggedn in as {session.user.name}
        <Button onClick={() => authClient.signOut()}>SignOut</Button>
      </div>
    );
  }

  return (
    <div className="max-w-2xl space-y-4 p-4">
      <Input
        value={form.name}
        name="name"
        onChange={handleChange}
        label="name"
        id="name"
      />
      <Input value={form.email} name="email" onChange={handleChange} />
      <Input
        value={form.password}
        name="password"
        onChange={handleChange}
        type="password"
      />

      <Button onClick={onSubmit}>Login</Button>
    </div>
  );
}
