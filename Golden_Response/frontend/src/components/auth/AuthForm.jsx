import { useState } from "react";
import { LogIn, UserPlus } from "lucide-react";
import { Button } from "../ui/Button";
import { Field } from "../ui/Field";
import { loginUser, registerUser } from "../../services/auth";

const initial = {
  name: "",
  email: "",
  phone: "",
  password: ""
};

export function AuthForm({ mode, onModeChange, onAuthenticated }) {
  const [form, setForm] = useState(initial);
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const isRegister = mode === "register";

  function updateField(field, value) {
    setForm((current) => ({ ...current, [field]: value }));
    setErrors((current) => ({ ...current, [field]: "" }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    const nextErrors = validate(form, isRegister);
    setErrors(nextErrors);
    setMessage("");

    if (Object.keys(nextErrors).length > 0) return;

    setSubmitting(true);
    try {
      const data = isRegister
        ? await registerUser(form)
        : await loginUser({ email: form.email, password: form.password });
      onAuthenticated(data.user);
    } catch (error) {
      setMessage(error.message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full max-w-md rounded-lg bg-white p-5 shadow-panel sm:p-7"
      noValidate
    >
      <div className="mb-6">
        <p className="text-sm font-semibold uppercase tracking-[0.16em] text-mint">
          {isRegister ? "Create account" : "Welcome back"}
        </p>
        <h1 className="mt-2 text-3xl font-bold text-ink">
          {isRegister ? "Start riding together" : "Sign in to RideJunto"}
        </h1>
      </div>

      <div className="space-y-4">
        {isRegister ? (
          <Field label="Name" htmlFor="name" error={errors.name}>
            <input
              id="name"
              className="input"
              autoComplete="name"
              value={form.name}
              onChange={(event) => updateField("name", event.target.value)}
            />
          </Field>
        ) : null}

        <Field label="Email" htmlFor="email" error={errors.email}>
          <input
            id="email"
            type="email"
            className="input"
            autoComplete="email"
            value={form.email}
            onChange={(event) => updateField("email", event.target.value)}
          />
        </Field>

        {isRegister ? (
          <Field label="Phone number" htmlFor="phone" error={errors.phone}>
            <input
              id="phone"
              className="input"
              autoComplete="tel"
              value={form.phone}
              onChange={(event) => updateField("phone", event.target.value)}
            />
          </Field>
        ) : null}

        <Field label="Password" htmlFor="password" error={errors.password}>
          <input
            id="password"
            type="password"
            className="input"
            autoComplete={isRegister ? "new-password" : "current-password"}
            value={form.password}
            onChange={(event) => updateField("password", event.target.value)}
          />
        </Field>
      </div>

      {message ? (
        <p className="mt-4 rounded-md bg-[#fff1ed] px-3 py-2 text-sm text-[#a63a29]" role="alert">
          {message}
        </p>
      ) : null}

      <Button type="submit" className="mt-6 w-full" disabled={submitting}>
        {isRegister ? <UserPlus size={18} /> : <LogIn size={18} />}
        {submitting ? "Working..." : isRegister ? "Create account" : "Sign in"}
      </Button>

      <button
        type="button"
        className="mt-4 w-full rounded-md px-3 py-2 text-sm font-semibold text-mint transition hover:bg-skywash focus:outline-none focus-visible:ring-2 focus-visible:ring-mint"
        onClick={() => onModeChange(isRegister ? "login" : "register")}
      >
        {isRegister
          ? "Already have an account? Sign in"
          : "Need an account? Register"}
      </button>
    </form>
  );
}

function validate(form, isRegister) {
  const errors = {};
  if (isRegister && !form.name.trim()) errors.name = "Name is required.";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
    errors.email = "Enter a valid email address.";
  }
  if (isRegister && !/^[+()\-\s0-9]{7,20}$/.test(form.phone)) {
    errors.phone = "Enter a valid phone number.";
  }
  if (form.password.length < 8) {
    errors.password = "Password must be at least 8 characters.";
  }
  return errors;
}
