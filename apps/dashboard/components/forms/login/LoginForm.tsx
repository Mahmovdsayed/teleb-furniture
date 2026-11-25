"use client";

import { useTranslations } from "next-intl";
import { LogIn } from "lucide-react";
import { useFormHandler } from "@/hooks/useFormHandler";
import { loginSchema } from "@teleb/validations/auth";
import FormField from "@teleb/ui/components/form-field";
import { useRouter } from "next/navigation";
import { loginInitialValues } from "@/constant/initial-values";
import { useStore } from "@/store";
import { login } from "@/services/auth";
import { Spinner } from "@teleb/ui/components/spinner";
import SubmitButton from "@teleb/ui/components/submit-button";

export default function LoginForm() {
    const { push } = useRouter()
    const t = useTranslations("LoginPage");
    const setUser = useStore((state) => state.setUser)

    const {
        register, onSubmit, loading, reset,
        formState: { errors, isDirty, isValid },
    } = useFormHandler({
        schema: loginSchema,
        defaultValues: loginInitialValues,
        service: login,
        onSuccess: (data) => {
            setUser(data.data.user)
            push("/")
        },
        onError: (error) => {
            reset()
        },
    });

    return (
        <form
            onSubmit={onSubmit}
            className="flex flex-col max-w-lg w-full gap-4 px-4 mt-4"
        >
            <FormField
                type="email"
                name="email"
                register={register}
                label={t("fields.email.label")}
                placeholder={t("fields.email.placeholder")}
                description={t("fields.email.description")}
                autoComplete="email"
                error={errors.email}
            />

            <FormField
                type="password"
                name="password"
                register={register}
                label={t("fields.password.label")}
                placeholder={t("fields.password.placeholder")}
                description={t("fields.password.description")}
                autoComplete="current-password"
                error={errors.password}
            />

            <SubmitButton
                type="submit"
                disabled={loading || !isDirty || !isValid}
                size="lg"
            >
                {loading ? (
                    <>
                        <Spinner />
                        {t("submit.loading")}
                    </>
                ) : (
                    <>
                        <LogIn size={18} />
                        {t("submit.idle")}
                    </>
                )}
            </SubmitButton>
        </form>
    );
}